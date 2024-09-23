import instaloader
import mysql.connector
from datetime import datetime
import os
import requests

# Connect to MySQL database
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="chasingnostalgia"
)

cursor = db.cursor()

# Initialize Instaloader
loader = instaloader.Instaloader()

# Define the directory structure to save downloaded images and videos
DOWNLOAD_DIR = os.path.join(os.path.dirname(__file__), '../downloads')
PHOTOS_DIR = os.path.join(DOWNLOAD_DIR, 'photos')
VIDEOS_DIR = os.path.join(DOWNLOAD_DIR, 'videos')
THUMBNAILS_DIR = os.path.join(VIDEOS_DIR, 'thumbnails')

# Ensure the download directories exist
os.makedirs(PHOTOS_DIR, exist_ok=True)
os.makedirs(VIDEOS_DIR, exist_ok=True)
os.makedirs(THUMBNAILS_DIR, exist_ok=True)

# Maximum number of photos to download per post
MAX_PHOTOS = 2

# Function to detect if IP might be banned
def check_ip_ban():
    try:
        # Check if Instagram is accessible, a common method
        response = requests.get('https://www.instagram.com', timeout=5)
        if response.status_code != 200:
            print("Warning: Unable to access Instagram. Possible IP ban or network issue.")
            return True
    except requests.RequestException:
        print("Warning: Unable to access Instagram. Possible IP ban or network issue.")
        return True
    return False

# Function to download an image or video and return the filename with a progress meter
def download_media(url, post_id, media_type="image", is_thumbnail=False):
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()  # Check if the request was successful
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
                    progress_percentage = int((downloaded_size / total_size) * 100)  # Round to nearest integer
                    print(f"Downloading {media_type} {post_id}: {progress_percentage}% complete", end="\r")
        
        print(f"\nDownloaded {media_type} to {full_path}")  # Debug: Log download location
        return local_filename  # Return only the filename
    except requests.exceptions.RequestException as e:
        print(f"Error downloading {media_type} {url}: {e}")
        return None

# Check if the post is already in the database
def post_exists(post_id):
    cursor.execute("SELECT post_id FROM scraped_posts WHERE post_id = %s", (post_id,))
    return cursor.fetchone() is not None

# Function to scrape posts from a specific user
def scrape_user_posts(username):
    if check_ip_ban():
        print(f"Stopping scraping for {username} due to potential IP ban.")
        return

    try:
        # Load the Instagram profile
        profile = instaloader.Profile.from_username(loader.context, username)

        # Iterate through posts and save them to the database
        for index, post in enumerate(profile.get_posts()):
            if index >= 2:  # Limit to 2 posts per vendor
                break

            if post_exists(post.shortcode):
                print(f"Post {post.shortcode} already exists. Skipping...")
                continue

            print(f"Scraping post {post.shortcode} from {username}...")

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

            elif post.is_video:
                # Download the thumbnail first to the THUMBNAILS_DIR directory
                thumbnail_filename = download_media(post.url, f"{post.shortcode}_thumbnail", media_type="image", is_thumbnail=True)

                if not thumbnail_filename:
                    print(f"Failed to download thumbnail for {post.shortcode}. Skipping video download.")
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

            else:
                # For single image posts, download the image
                filename = download_media(post.url, post.shortcode, media_type="image")
                if not filename:
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

        print(f"Finished scraping {username}")

    except Exception as e:
        if '429' in str(e):
            print(f"Error scraping {username}: Rate limit exceeded. Possible IP ban. Stopping...")
        else:
            print(f"Error scraping {username}: {e}")

# Close the cursor and database connection
def close_db_connection():
    cursor.close()
    db.close()

# Example usage: scrape posts from a list of usernames
usernames = ["lovemorgue", "chasingnostalgia__"]  # Add more usernames as needed
for user in usernames:
    scrape_user_posts(user)

# Close the database connection
close_db_connection()