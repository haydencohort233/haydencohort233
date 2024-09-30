# scraper.py
import os
import time
import random
import signal
import sys
from datetime import datetime
from config import SCRAPER_CONFIG
from session_manager import create_instaloader_session
from database import get_db_connection, check_db_integrity, close_db_connection
from scraper_utils import check_ip_ban, handle_rate_limit, download_media, post_exists, get_instagram_post_count, get_saved_post_count
from metrics import metrics, save_metrics
from usernames import usernames
from logger import configure_logger
from cleanup import cleanup_old_files
from error_utils import handle_error  # Import the generic error handler

# Configure logging
logger = configure_logger()

# Define directory paths for cleanup
sessions_dir = os.path.join(os.path.dirname(__file__), 'sessions')
downloads_dir = os.path.join(os.path.dirname(__file__), '../downloads')
metrics_dir = os.path.join(os.path.dirname(__file__), '../metrics')

# Clean up old files before starting the scrape
cleanup_old_files(sessions_dir)
cleanup_old_files(downloads_dir)
cleanup_old_files(metrics_dir)

# Flag to track if a critical error occurred
critical_error_occurred = False

# Graceful shutdown function
def graceful_shutdown(signal, frame):
    logger.info("Received shutdown signal. Shutting down gracefully...")
    if not critical_error_occurred:
        save_metrics()  # Save metrics before shutting down only if no critical error
    close_db_connection(cursor, db)
    sys.exit(0)

# Register signal handlers for graceful shutdown
signal.signal(signal.SIGINT, graceful_shutdown)
signal.signal(signal.SIGTERM, graceful_shutdown)

# Start the scraping process
metrics['start_time'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

# Create a new session only if necessary
try:
    loader = create_instaloader_session('deleteddfanaccount', '!Motoross72')
except Exception as e:
    logger.error(f"Failed to create session: {e}")
    sys.exit(1)  # Exit if the session could not be created

# Connect to MySQL database
try:
    db, cursor = get_db_connection()
    check_db_integrity(cursor)
except Exception as e:
    handle_error(e, "Critical error connecting to the database or checking its integrity")
    sys.exit(1)  # Exit if the database connection fails

# Function to scrape posts from a specific user
def scrape_user_posts(username):
    logger.info(f"Scraping posts for user: {username}")
    global metrics
    global critical_error_occurred
    start_time = time.time()  # Start timer for this user

    try:
        if check_ip_ban():
            logger.warning(f"Stopping scraping for {username} due to potential IP ban.")
            metrics['errors_encountered'] += 1
            return

        # Check the number of posts on Instagram
        insta_post_count = get_instagram_post_count(loader, username)
        if insta_post_count is None:
            logger.info(f"Could not get Instagram post count for {username}. Skipping...")
            return

        # Check the number of posts saved in the database
        saved_post_count = get_saved_post_count(cursor, username)
        logger.info(f"Instagram post count: {insta_post_count}, Saved post count: {saved_post_count}")

        # If the numbers are the same, skip scraping
        if insta_post_count == saved_post_count:
            logger.info(f"No new posts to scrape for {username}. Skipping...")
            metrics['posts_skipped'] += 1
            return

        successful_scrapes = 0  # Track the number of successful scrapes for the vendor

        # Load the Instagram profile
        profile = instaloader.Profile.from_username(loader.context, username)

        # Iterate through posts and save them to the database
        for index, post in enumerate(profile.get_posts()):
            if successful_scrapes >= SCRAPER_CONFIG['max_posts_per_vendor']:
                break  # Stop if we've successfully scraped the max allowed posts for this vendor

            if post_exists(cursor, post.shortcode):
                logger.info(f"Post {post.shortcode} already exists. Skipping...")
                metrics['posts_skipped'] += 1
                continue  # Skip existing posts without counting as a successful scrape

            logger.info(f"Scraping post {post.shortcode} from {username}...")

            # Handle multiple images (carousel)
            if post.typename == "GraphSidecar":
                # Convert the generator to a list and download the first MAX_PHOTOS
                resources = list(post.get_sidecar_nodes())
                media_urls = []
                for resource_index, resource in enumerate(resources[:SCRAPER_CONFIG['max_photos']]):
                    media_type = "video" if resource.is_video else "image"
                    filename = download_media(resource.video_url if resource.is_video else resource.display_url, 
                                              f"{post.shortcode}_{resource_index}", media_type)
                    if not filename:
                        continue
                    media_urls.append(filename)

                # Insert post into the database with comma-separated filenames for multiple images
                cursor.execute("""
                    INSERT IGNORE INTO scraped_posts (username, post_id, caption, media_url, timestamp, scrape_date)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    username,
                    post.shortcode,  # post_id
                    post.caption,
                    ','.join(media_urls),  # Store comma-separated filenames for multiple images
                    post.date,
                    datetime.now()
                ))
                db.commit()
                successful_scrapes += 1  # Increment successful scrapes counter

            elif post.is_video:
                # Download the thumbnail first to the THUMBNAILS_DIR directory
                thumbnail_filename = download_media(post.url, f"{post.shortcode}_thumbnail", media_type="image", is_thumbnail=True)

                if not thumbnail_filename:
                    logger.info(f"Failed to download thumbnail for {post.shortcode}. Skipping video download.")
                    metrics['errors_encountered'] += 1
                    continue

                # If thumbnail download is successful, download the video
                video_filename = download_media(post.video_url, post.shortcode, media_type="video")

                if video_filename:
                    cursor.execute("""
                        INSERT IGNORE INTO scraped_posts (username, post_id, caption, media_url, timestamp, scrape_date, video_url)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """, (
                        username,
                        post.shortcode,  # post_id
                        post.caption,
                        thumbnail_filename,  # Store the thumbnail filename in media_url
                        post.date,
                        datetime.now(),
                        video_filename  # Store the video filename in video_url
                    ))
                    db.commit()
                    successful_scrapes += 1  # Increment successful scrapes counter

            else:
                # For single image posts, download the image
                filename = download_media(post.url, post.shortcode, media_type="image")
                if not filename:
                    metrics['errors_encountered'] += 1
                    continue
                # Insert single image post into the database
                cursor.execute("""
                    INSERT IGNORE INTO scraped_posts (username, post_id, caption, media_url, timestamp, scrape_date)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    username,
                    post.shortcode,  # post_id
                    post.caption,
                    filename,  # Store only the filename
                    post.date,
                    datetime.now()
                ))
                db.commit()
                successful_scrapes += 1  # Increment successful scrapes counter

            # Handle rate limiting after each post
            handle_rate_limit()

        logger.info(f"Finished scraping {username}")
        metrics['scraping_time'][username] = time.time() - start_time  # Store scraping time for this user

    except Exception as e:
        handle_error(e, f"Critical error while scraping user {username}")
        critical_error_occurred = True  # Set critical error flag to true
        graceful_shutdown(signal.SIGTERM, None)  # Gracefully shutdown on critical error
        metrics['errors_encountered'] += 1

# Start scraping for each user
for i, user in enumerate(usernames):
    scrape_user_posts(user)
    
    # Check if more users are left before adding delay
    if i < len(usernames) - 1:
        delay = random.randint(60, 120)  # Random delay between 1 and 2 minutes
        logger.info(f"Waiting for {delay} seconds before scraping the next user...")
        time.sleep(delay)

# Save final metrics and close the database connection only if no critical error occurred
if not critical_error_occurred:
    save_metrics()
close_db_connection(cursor, db)
