import os

# Ensure necessary directories exist
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
    'max_photos': 3,
    'max_posts_per_vendor': 1,
    'throttle_speed_kbps': 50,
    'request_threshold': 100,  # Number of requests before cooldown
    'cool_down_time': 600,  # Cool down time in seconds (10 minutes)
    'download_directory': os.path.join(os.path.dirname(__file__), '../downloads')
}

LOGGING_CONFIG = {
    'log_file': os.path.join(os.path.dirname(__file__), '../logs/scraper.log'),  # Log file path
    'log_level': 'INFO'  # Log level
}

METRICS_CONFIG = {
    'metrics_file': os.path.join(os.path.dirname(__file__), '../metrics/metrics.json')  # Metrics file path
}
