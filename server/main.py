from flask import Flask, jsonify, request
import os
import requests
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
cors = CORS(app, origins="*")

client_id = os.getenv('CLIENT_ID')
access_token = os.getenv('ACCESS_TOKEN')
base_url = "https://api.igdb.com/v4"

def fetch_games(search_term):
    headers = {
        'Client-ID': client_id,
        'Authorization': f'Bearer {access_token}',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    body = f'fields id, name, cover; limit 500; search "{search_term}";'
    
    response = requests.post(f'{base_url}/games', headers=headers, data=body)
    
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

#create more routes for different end points
@app.route('/', methods=['GET'])
def latest():
    return "Latest Games"

@app.route('/games', methods=['GET'])
def get_games():
    search_term = request.args.get('search_term', default='zelda', type=str)
    try:
        games = fetch_games(search_term)
        return jsonify(games)
    except requests.exceptions.HTTPError as err:
        return jsonify({"error": str(err)}), 500
    
@app.route('/genres', methods=['GET'])
def get_genres():
    return "Display Genres"

if __name__ == '__main__':
    app.run(debug=True, port=8080)
