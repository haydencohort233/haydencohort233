# config.py

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
    'cool_down_time': 600  # Cool down time in seconds (10 minutes)
}

LOGGING_CONFIG = {
    'log_file': '../logs/scraper.log',  # Log file path
    'log_level': 'INFO'  # Log level
}

METRICS_CONFIG = {
    'metrics_file': '../metrics/metrics.json'  # Metrics file path
}
