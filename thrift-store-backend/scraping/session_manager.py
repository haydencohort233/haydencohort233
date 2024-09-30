import os
import instaloader
import logging
import browser_cookie3
from datetime import datetime, timedelta

# Set up paths
SESSIONS_DIR = os.path.join(os.path.dirname(__file__), 'sessions')
if not os.path.exists(SESSIONS_DIR):
    os.makedirs(SESSIONS_DIR)

# Check if session file is older than 24 hours
def is_session_expired(session_file):
    if os.path.exists(session_file):
        file_time = datetime.fromtimestamp(os.path.getmtime(session_file))
        if datetime.now() - file_time > timedelta(hours=24):
            logging.info("Session expired (older than 24 hours).")
            return True
        else:
            logging.info("Using existing session (valid within 24 hours).")
            return False
    logging.info("Session file not found, creating a new one.")
    return True

# Load cookies from Firefox only
def load_cookies(loader):
    try:
        cookies = browser_cookie3.firefox(domain_name='instagram.com')
        loader.context._session.cookies.update(cookies)  # Use _session instead of session
        logging.info("Successfully loaded cookies from Firefox.")
    except Exception as e:
        logging.error(f"Failed to load cookies from Firefox: {e}")
        raise e

# Create a new session or reuse an existing one based on expiry
def create_instaloader_session(username, password):
    # Adjusted part to handle valid session filenames better
    sanitized_username = username.replace(":", "_").replace("\\", "_").replace("/", "_")
    session_file = os.path.join(SESSIONS_DIR, f'session_{sanitized_username}.instaloader')

    loader = instaloader.Instaloader()
    loader.context.user_agent = (
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0'
    )
    
    if not is_session_expired(session_file):
        try:
            loader.load_session_from_file(session_file)
            logging.info(f"Loaded existing session for {username} from file.")
            return loader
        except Exception as e:
            logging.error(f"Failed to load existing session for {username}: {e}. Creating a new session.")

    # Remove old session file if exists
    try:
        os.remove(session_file)
        logging.info(f"Old session file for {username} deleted.")
    except FileNotFoundError:
        logging.info(f"No old session file found for {username}.")

    # Load cookies from Firefox
    try:
        load_cookies(loader)
    except Exception as e:
        logging.error(f"Failed to load cookies: {e}")
        raise e

    # Login to Instagram
    try:
        loader.login(username, password)
        loader.save_session_to_file(session_file)
        logging.info(f"Successfully logged in as {username} and saved new session.")
    except Exception as e:
        logging.error(f"Login failed: {e}")
        raise e
    
    return loader
