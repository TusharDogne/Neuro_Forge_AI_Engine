from jose import jwt
from datetime import datetime, timedelta, UTC
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Read configuration once
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
)


def create_access_token(data: dict):
    """
    Generate a JWT access token.
    """
    

    # Copy the payload
    to_encode = data.copy()

    # Set token expiration time
    expire = datetime.now(UTC) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    
    # Add expiration to payload
    to_encode.update({"exp": expire})

    # Generate JWT
    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt