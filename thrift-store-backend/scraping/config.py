import os

# Ensure directories exist
for directory in ['../logs', '../metrics', '../downloads']:
    if not os.path.exists(directory):
        os.makedirs(directory)

DATABASE_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'chasingnostalgia'
}

SCRAPER_CONFIG = {
    'max_posts_per_vendor': 1,              # Maximum posts to scrape per vendor
    'max_photos': 3,                        # Max photos to download from carousel posts
    'throttle_speed_kbps': 50,              # Limit download speed of posts
    'request_threshold': 100,               # Number of requests before cooldown
    'cool_down_time': 600,                  # Cool down time in seconds (10 minutes)
    'download_directory': os.path.join(os.path.dirname(__file__), '../downloads'),
    'session_timeout_hours': 24,            # Timeout for session expiration in hours
    'retry_attempts': 3,                    # Max retry attempts for failures
    'delay_between_requests': (5, 15)       # Random delay range (min, max) between requests in seconds
}

LOGGING_CONFIG = {
    'log_file': os.path.join(os.path.dirname(__file__), '../logs/scraper.log'),
    'log_level': 'INFO'
}

METRICS_CONFIG = {
    'metrics_file': os.path.join(os.path.dirname(__file__), '../metrics/metrics.json')
}
