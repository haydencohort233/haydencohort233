# logger.py
import logging
from config import LOGGING_CONFIG

def configure_logger():
    logger = logging.getLogger()
    logger.setLevel(getattr(logging, LOGGING_CONFIG['log_level']))
    
    # Create file handler
    file_handler = logging.FileHandler(LOGGING_CONFIG['log_file'])
    file_handler.setLevel(getattr(logging, LOGGING_CONFIG['log_level']))
    file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
    
    # Create console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(getattr(logging, LOGGING_CONFIG['log_level']))
    console_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
    
    # Add handlers to logger
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    
    return logger
