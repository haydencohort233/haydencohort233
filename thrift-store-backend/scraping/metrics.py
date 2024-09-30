# metrics.py
import json
import logging
from datetime import datetime
from config import METRICS_CONFIG

metrics = {
    'total_posts_scraped': 0,
    'errors_encountered': 0,
    'posts_skipped': 0,
    'scraping_time': {},
    'start_time': None,
    'end_time': None
}

def save_metrics():
    metrics['end_time'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    metrics_file_path = METRICS_CONFIG['metrics_file']
    
    # Read existing data
    try:
        with open(metrics_file_path, 'r') as file:
            existing_metrics = json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        existing_metrics = {}

    # Update existing data with new metrics
    existing_metrics.update(metrics)

    # Write updated data back to file
    with open(metrics_file_path, 'w') as file:
        json.dump(existing_metrics, file, indent=4)

    logging.info("Metrics saved successfully.")
