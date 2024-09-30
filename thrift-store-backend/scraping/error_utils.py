import logging

def handle_error(error, message="An error occurred"):
    """Generic error handling function."""
    logging.error(f"{message}: {error}")
    # Additional generic error handling logic can go here
