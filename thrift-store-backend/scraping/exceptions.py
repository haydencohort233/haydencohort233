class ScraperError(Exception):
    """Exception raised for errors in the scraper."""
    pass

class DatabaseError(Exception):
    """Exception raised for database-related errors."""
    pass

class SessionError(Exception):
    """Exception raised for session-related errors."""
    pass
