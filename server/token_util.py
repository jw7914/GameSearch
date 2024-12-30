import os
import requests
from dotenv import load_dotenv
import time

load_dotenv()

client_id = os.getenv('CLIENT_ID')
client_secret = os.getenv('CLIENT_SECRET')

TOKEN_URL = f'https://id.twitch.tv/oauth2/token?client_id={client_id}&client_secret={client_secret}&grant_type=client_credentials'

access_token = None
token_expiry = 0

def refresh_token():
    global access_token, token_expiry
    
    try:
        response = requests.post(TOKEN_URL)
        response.raise_for_status()
        data = response.json()
        access_token = data["access_token"]
        token_expiry = time.time() + data["expires_in"]  
        print("Token refreshed successfully!")
        return access_token
        
    except requests.exceptions.RequestException as e:
        print(f"Error refreshing token: {e}")
        raise

def get_access_token():
    global access_token, token_expiry

    if access_token is None or time.time() >= token_expiry:
        return refresh_token()  
    return access_token
