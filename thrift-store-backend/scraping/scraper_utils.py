# scraper_utils.py

import instaloader
import logging
import os
import time
import requests
from metrics import metrics  # Metrics dictionary
from config import SCRAPER_CONFIG
from exceptions import ScraperError  # Import custom exception
from error_utils import handle_error  # Import error handler

REQUEST_COUNT = 0

def check_ip_ban():
    try:
        response = requests.get('https://www.instagram.com', timeout=5)
        if response.status_code != 200:
            logging.warning("Warning: Unable to access Instagram. Possible IP ban or network issue.")
            return True
    except requests.RequestException as e:
        handle_error(e, "Warning: Unable to access Instagram. Possible IP ban or network issue.")
        return True
    return False

def handle_rate_limit():
    global REQUEST_COUNT
    if REQUEST_COUNT >= SCRAPER_CONFIG['request_threshold']:
        logging.warning(f"Request threshold reached. Cooling down for {SCRAPER_CONFIG['cool_down_time']} seconds...")
        time.sleep(SCRAPER_CONFIG['cool_down_time'])
        REQUEST_COUNT = 0  # Reset request count after cooldown

def download_media(url, post_id, media_type="image", is_thumbnail=False, throttle_speed_kbps=50):
    global REQUEST_COUNT, metrics
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()  # Check if the request was successful
        REQUEST_COUNT += 1
        extension = "jpg" if media_type == "image" else "mp4"  # Determine extension based on media type
        local_filename = f"{post_id}.{extension}"  # Only store the filename

        # Determine the folder path based on media type and whether it's a thumbnail
        folder_path = "thumbnails" if is_thumbnail else "videos" if media_type == "video" else "photos"
        full_path = os.path.join(SCRAPER_CONFIG['download_directory'], folder_path, local_filename)

        # Ensure the directory exists
        os.makedirs(os.path.dirname(full_path), exist_ok=True)

        # Download the file and throttle based on speed
        total_size = int(response.headers.get('content-length', 0))
        downloaded_size = 0

        with open(full_path, 'wb') as f:
            for chunk in response.iter_content(1024):
                if chunk:  # Filter out keep-alive chunks
                    f.write(chunk)
                    downloaded_size += len(chunk)
                    # Throttle based on download speed
                    time.sleep(len(chunk) / (throttle_speed_kbps * 1024))
                    progress_percentage = int((downloaded_size / total_size) * 100)
                    logging.info(f"Downloading {media_type} {post_id}: {progress_percentage}% complete")

        logging.info(f"Downloaded {media_type} to {full_path}")
        metrics['total_posts_scraped'] += 1

        return local_filename  # Return only the filename, not the full path

    except requests.exceptions.RequestException as e:
        handle_error(e, f"Error downloading {media_type} {url}")
        metrics['errors_encountered'] += 1
        return None

def post_exists(cursor, post_id):
    try:
        cursor.execute("SELECT post_id FROM scraped_posts WHERE post_id = %s", (post_id,))
        return cursor.fetchone() is not None
    except Exception as e:
        handle_error(e, f"Error checking if post {post_id} exists in the database")
        return False

def get_saved_post_count(cursor, username):
    try:
        cursor.execute("SELECT COUNT(*) FROM scraped_posts WHERE username = %s", (username,))
        return cursor.fetchone()[0]
    except Exception as e:
        handle_error(e, f"Error fetching saved post count for {username}")
        return 0

def get_instagram_post_count(loader, username):
    try:
        logging.info(f"Fetching Instagram post count for {username}")
        profile = instaloader.Profile.from_username(loader.context, username)
        return profile.mediacount
    except Exception as e:
        handle_error(e, f"Error fetching Instagram post count for {username}")
        metrics['errors_encountered'] += 1
        return None
