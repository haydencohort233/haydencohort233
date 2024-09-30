import os
import logging
import argparse
from datetime import datetime, timedelta

# Configure logging to console only
logger = logging.getLogger('cleanup_logger')
logger.setLevel(logging.INFO)

# Console handler
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))

# Add handler to the logger
logger.addHandler(console_handler)

# Define default paths
SCRAPING_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_SESSIONS_DIR = os.path.join(SCRAPING_DIR, 'sessions')
DEFAULT_LOGS_DIR = os.path.join(SCRAPING_DIR, '../logs')  # Adjust path if needed

# Cleanup files older than a certain number of hours
def cleanup_old_files(directory, hours=24):
    now = datetime.now()
    cutoff_time = now - timedelta(hours=hours)
    cleaned_files = False  # Track if any files were cleaned

    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        if os.path.isfile(file_path):
            file_mtime = datetime.fromtimestamp(os.path.getmtime(file_path))
            if file_mtime < cutoff_time:
                try:
                    os.remove(file_path)
                    logger.info(f"Deleted old file: {filename}")
                    cleaned_files = True  # Mark that a file was deleted
                except Exception as e:
                    logger.error(f"Failed to delete {filename}: {e}")
                    print("Error tidying scraping junk")
                    return

    if cleaned_files:
        print("All cleaned!")
    else:
        print("Nothing to clean!")

# Rename session files to use a consistent naming convention
def rename_session_files(directory):
    for filename in os.listdir(directory):
        if filename.startswith('insta_session') or filename == 'deleteddfanaccount':
            # Extract username from old session file
            username = filename.split('_')[1] if '_' in filename else 'unknown'
            new_filename = f"session_{username}.instaloader"
            old_path = os.path.join(directory, filename)
            new_path = os.path.join(directory, new_filename)

            if not os.path.exists(new_path):
                try:
                    os.rename(old_path, new_path)
                    logger.info(f"Renamed session file from {filename} to {new_filename}")
                except Exception as e:
                    logger.error(f"Failed to rename {filename} to {new_filename}: {e}")
            else:
                logger.info(f"Session file {new_filename} already exists. Skipping rename.")

# Add a CLI for standalone usage, with defaults
def main():
    parser = argparse.ArgumentParser(
        description="Cleanup and rename session files. Defaults are used if no arguments are provided."
    )
    parser.add_argument(
        '--sessions-dir', 
        type=str, 
        default=DEFAULT_SESSIONS_DIR, 
        help="The directory where session files are stored. (Default: sessions/)"
    )
    parser.add_argument(
        '--logs-dir', 
        type=str, 
        default=DEFAULT_LOGS_DIR, 
        help="The directory where log files are stored. (Default: ../logs/)"
    )
    parser.add_argument(
        '--hours', 
        type=int, 
        default=24, 
        help="Delete files older than this number of hours. (Default: 24 hours)"
    )
    args = parser.parse_args()

    # Ensure the sessions directory exists
    if not os.path.exists(args.sessions_dir):
        os.makedirs(args.sessions_dir)
        logger.info(f"Created sessions directory: {args.sessions_dir}")

    # Run cleanup and renaming with default or provided arguments
    try:
        cleanup_old_files(args.sessions_dir, args.hours)
        rename_session_files(args.sessions_dir)
    except Exception as e:
        logger.error(f"Error during cleanup: {e}")
        print("Error tidying scraping junk")

if __name__ == "__main__":
    main()
