import logging
import time
from config import SCRAPER_CONFIG

def handle_error(error, operation=None, message="An error occurred"):
    """Generic error handling function with optional retry logic."""
    logging.error(f"{message}: {error}")
    
    if operation is not None:
        retries = SCRAPER_CONFIG.get('retry_attempts', 3)  # Default to 3 retries
        for attempt in range(retries):
            try:
                # Retry the operation
                logging.info(f"Retrying operation, attempt {attempt + 1} of {retries}")
                operation()  # Call the function you're retrying
                return  # If successful, exit the retry loop
            except Exception as e:
                logging.error(f"Retry attempt {attempt + 1} failed with error: {e}")
                time.sleep(5 * (attempt + 1))  # Exponential backoff
