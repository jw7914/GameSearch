import os
import requests
from dotenv import load_dotenv
import datetime

load_dotenv()

client_id = os.getenv('CLIENT_ID')
client_secret = os.getenv('CLIENT_SECRET')

TOKEN_URL = f'https://id.twitch.tv/oauth2/token?client_id={client_id}&client_secret={client_secret}&grant_type=client_credentials'

def get_access_token():
    try:
        response = requests.post(TOKEN_URL)
        response.raise_for_status()
        data = response.json()
        access_token = data["access_token"]
        token_expiry = datetime.datetime.now().timestamp() + data["expires_in"]
        return access_token, token_expiry
        
    except requests.exceptions.RequestException as e:
        print(f"Error refreshing token: {e}")
    return access_token, token_expiry
