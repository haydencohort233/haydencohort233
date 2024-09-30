# database.py
import mysql.connector
import logging
from config import DATABASE_CONFIG

def get_db_connection():
    try:
        connection = mysql.connector.connect(**DATABASE_CONFIG)
        cursor = connection.cursor()
        logging.info("Database connection established successfully.")
        return connection, cursor
    except mysql.connector.Error as err:
        logging.error(f"Error: {err}")
        raise err

def check_db_integrity(cursor):
    required_tables = ["scraped_posts"]
    try:
        cursor.execute("SHOW TABLES")
        tables = [table[0] for table in cursor.fetchall()]
        for table in required_tables:
            if table not in tables:
                logging.error(f"Required table '{table}' is missing from the database.")
                raise Exception(f"Required table '{table}' is missing from the database.")
    except Exception as e:
        logging.error(f"Database integrity check failed: {e}")
        raise e

def close_db_connection(cursor, connection):
    cursor.close()
    connection.close()
    logging.info("Database connection closed.")
