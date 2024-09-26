import instaloader
import mysql.connector
from datetime import datetime
import os
import requests
import time
import random
import logging
import signal
import sys
import json
import browser_cookie3
from config import DATABASE_CONFIG, SCRAPER_CONFIG, LOGGING_CONFIG, METRICS_CONFIG

# Configure logging
logging.basicConfig(
    filename=LOGGING_CONFIG['log_file'],
    filemode='a',
    format='%(asctime)s - %(levelname)s - %(message)s',
    level=getattr(logging, LOGGING_CONFIG['log_level'])
)

# Global request counter for rate limiting
REQUEST_COUNT = 0

# Initialize metrics dictionary
metrics = {
    'total_posts_scraped': 0,
    'errors_encountered': 0,
    'posts_skipped': 0,
    'scraping_time': {},
    'start_time': None,
    'end_time': None
}

# Function to get database connection
def get_db_connection():
    return mysql.connector.connect(**DATABASE_CONFIG)

# Function to check database integrity
def check_db_integrity():
    required_tables = ["scraped_posts"]
    try:
        cursor.execute("SHOW TABLES")
        tables = [table[0] for table in cursor.fetchall()]
        for table in required_tables:
            if table not in tables:
                logging.error(f"Required table '{table}' is missing from the database.")
                raise Exception(f"Required table '{table}' is missing from the database.")
    except Exception as e:
        logging.error(f"Database integrity check failed: {e}")
        sys.exit(1)

# Function to save metrics to a file
def save_metrics():
    metrics['end_time'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    with open(METRICS_CONFIG['metrics_file'], 'w') as metrics_file:
        json.dump(metrics, metrics_file, indent=4)
    logging.info("Metrics saved successfully.")

# Initialize Instaloader and set user-agent
loader = instaloader.Instaloader()
loader.context.user_agent = (
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
)

# Load cookies from browser
try:
    cookies = browser_cookie3.firefox(domain_name='instagram.com')
    loader.context.session.cookies.update(cookies)
    logging.info("Successfully loaded cookies from browser.")
except Exception as e:
    logging.error(f"Could not load cookies: {e}")

# Load or login to Instagram (using session file as a fallback)
try:
    loader.load_session_from_file('deleteddfanaccount')
    logging.info("Successfully loaded session from file.")
except FileNotFoundError:
    logging.info("Session file not found. Trying to login with username and password...")
    try:
        loader.login('deleteddfanaccount', '!Motoross72')
        loader.save_session_to_file()
        logging.info("Successfully logged in and saved session.")
    except Exception as e:
        logging.error(f"Login failed: {e}")
        sys.exit(1)

# Connect to MySQL database
db = get_db_connection()
cursor = db.cursor()

# Check database integrity before scraping
check_db_integrity()

# Define the directory structure to save downloaded images and videos
DOWNLOAD_DIR = os.path.join(os.path.dirname(__file__), '../downloads')
PHOTOS_DIR = os.path.join(DOWNLOAD_DIR, 'photos')
VIDEOS_DIR = os.path.join(DOWNLOAD_DIR, 'videos')
THUMBNAILS_DIR = os.path.join(VIDEOS_DIR, 'thumbnails')

# Ensure the download directories exist
os.makedirs(PHOTOS_DIR, exist_ok=True)
os.makedirs(VIDEOS_DIR, exist_ok=True)
os.makedirs(THUMBNAILS_DIR, exist_ok=True)
os.makedirs(os.path.join(os.path.dirname(__file__), '../metrics'), exist_ok=True)

# Maximum number of photos to download per post and posts per vendor
MAX_PHOTOS = SCRAPER_CONFIG['max_photos']
MAX_POSTS_PER_VENDOR = SCRAPER_CONFIG['max_posts_per_vendor']

# Function to detect if IP might be banned
def check_ip_ban():
    try:
        response = requests.get('https://www.instagram.com', timeout=5)
        if response.status_code != 200:
            logging.warning("Warning: Unable to access Instagram. Possible IP ban or network issue.")
            return True
    except requests.RequestException:
        logging.warning("Warning: Unable to access Instagram. Possible IP ban or network issue.")
        return True
    return False

# Function to download an image or video and return the filename with a progress meter and throttling
def download_media(url, post_id, media_type="image", is_thumbnail=False, throttle_speed_kbps=50):
    """
    Downloads media from the given URL and saves it to the appropriate directory.
    
    Parameters:
    - url: URL of the media to download
    - post_id: ID of the post to use in the filename
    - media_type: "image" or "video" to determine the file type
    - is_thumbnail: Boolean indicating if it's a thumbnail
    - throttle_speed_kbps: Throttle speed in kilobytes per second (default is 50 KB/s)
    
    Returns: Filename of the downloaded media or None if download failed.
    """
    global REQUEST_COUNT, metrics
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()  # Check if the request was successful
        REQUEST_COUNT += 1
        extension = "jpg" if media_type == "image" else "mp4"  # Determine extension based on media type
        local_filename = f"{post_id}.{extension}"  # Only store the filename

        if is_thumbnail:
            folder_path = THUMBNAILS_DIR
        elif media_type == "image":
            folder_path = PHOTOS_DIR
        else:
            folder_path = VIDEOS_DIR

        full_path = os.path.join(folder_path, local_filename)

        # Get the total file size from the response headers
        total_size = int(response.headers.get('content-length', 0))
        downloaded_size = 0

        with open(full_path, 'wb') as f:
            for chunk in response.iter_content(1024):
                if chunk:  # Filter out keep-alive chunks
                    f.write(chunk)
                    downloaded_size += len(chunk)
                    
                    # Throttle download speed
                    time.sleep(len(chunk) / (throttle_speed_kbps * 1024))
                    
                    progress_percentage = int((downloaded_size / total_size) * 100)  # Round to nearest integer
                    logging.info(f"Downloading {media_type} {post_id}: {progress_percentage}% complete", end="\r")
        
        logging.info(f"Downloaded {media_type} to {full_path}")  # Log download location
        metrics['total_posts_scraped'] += 1
        return local_filename  # Return only the filename
    except requests.exceptions.RequestException as e:
        logging.error(f"Error downloading {media_type} {url}: {e}")
        metrics['errors_encountered'] += 1
        return None

# Check if the post is already in the database
def post_exists(post_id):
    cursor.execute("SELECT post_id FROM scraped_posts WHERE post_id = %s", (post_id,))
    return cursor.fetchone() is not None

# Function to get the number of posts in the database for a specific user
def get_saved_post_count(username):
    cursor.execute("SELECT COUNT(*) FROM scraped_posts WHERE username = %s", (username,))
    return cursor.fetchone()[0]

# Function to get the number of posts on Instagram for a specific user
def get_instagram_post_count(username):
    try:
        profile = instaloader.Profile.from_username(loader.context, username)
        return profile.mediacount
    except Exception as e:
        logging.error(f"Error fetching Instagram post count for {username}: {e}")
        metrics['errors_encountered'] += 1
        return None

# Function to handle rate limit and cooldown
def handle_rate_limit():
    global REQUEST_COUNT
    if REQUEST_COUNT >= SCRAPER_CONFIG['request_threshold']:
        logging.warning(f"Request threshold reached. Cooling down for {SCRAPER_CONFIG['cool_down_time']} seconds...")
        time.sleep(SCRAPER_CONFIG['cool_down_time'])
        REQUEST_COUNT = 0  # Reset request count after cooldown

# Function to scrape posts from a specific user
def scrape_user_posts(username):
    global metrics
    start_time = time.time()  # Start timer for this user
    if check_ip_ban():
        logging.warning(f"Stopping scraping for {username} due to potential IP ban.")
        metrics['errors_encountered'] += 1
        return

    # Check the number of posts on Instagram
    insta_post_count = get_instagram_post_count(username)
    if insta_post_count is None:
        logging.info(f"Could not get Instagram post count for {username}. Skipping...")
        return

    # Check the number of posts saved in the database
    saved_post_count = get_saved_post_count(username)

    logging.info(f"Instagram post count: {insta_post_count}, Saved post count: {saved_post_count}")

    # If the numbers are the same, skip scraping
    if insta_post_count == saved_post_count:
        logging.info(f"No new posts to scrape for {username}. Skipping...")
        metrics['posts_skipped'] += 1
        return

    successful_scrapes = 0  # Track the number of successful scrapes for the vendor

    try:
        # Load the Instagram profile
        profile = instaloader.Profile.from_username(loader.context, username)

        # Iterate through posts and save them to the database
        for index, post in enumerate(profile.get_posts()):
            if successful_scrapes >= MAX_POSTS_PER_VENDOR:
                break  # Stop if we've successfully scraped the max allowed posts for this vendor

            if post_exists(post.shortcode):
                logging.info(f"Post {post.shortcode} already exists. Skipping...")
                metrics['posts_skipped'] += 1
                continue  # Skip existing posts without counting as a successful scrape

            logging.info(f"Scraping post {post.shortcode} from {username}...")

            # Handle multiple images (carousel)
            if post.typename == "GraphSidecar":
                # Convert the generator to a list and download the first MAX_PHOTOS
                resources = list(post.get_sidecar_nodes())
                media_urls = []
                for resource_index, resource in enumerate(resources[:MAX_PHOTOS]):
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
                    logging.info(f"Failed to download thumbnail for {post.shortcode}. Skipping video download.")
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

        logging.info(f"Finished scraping {username}")
        metrics['scraping_time'][username] = time.time() - start_time  # Store scraping time for this user

    except Exception as e:
        if '429' in str(e):
            logging.error(f"Error scraping {username}: Rate limit exceeded. Possible IP ban. Stopping...")
        else:
            logging.error(f"Error scraping {username}: {e}")
        metrics['errors_encountered'] += 1

# Close the cursor and database connection
def close_db_connection():
    cursor.close()
    db.close()
    logging.info("Database connection closed.")

# Graceful shutdown function
def graceful_shutdown(signal, frame):
    logging.info("Received shutdown signal. Shutting down gracefully...")
    save_metrics()  # Save metrics before shutting down
    close_db_connection()
    sys.exit(0)

# Register signal handlers for graceful shutdown
signal.signal(signal.SIGINT, graceful_shutdown)
signal.signal(signal.SIGTERM, graceful_shutdown)

# Start the scraping process
metrics['start_time'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
usernames = ["lovemorgue", "chasingnostalgia__"]  # Add more usernames as needed
for i, user in enumerate(usernames):
    scrape_user_posts(user)
    
    # Check if more users are left before adding delay
    if i < len(usernames) - 1:
        delay = random.randint(60, 120)  # Random delay between 1 and 2 minutes
        logging.info(f"Waiting for {delay} seconds before scraping the next user...")
        time.sleep(delay)

# Save final metrics and close the database connection
save_metrics()
close_db_connection()
