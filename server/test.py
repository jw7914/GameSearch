from flask import Flask, jsonify, request, send_from_directory

from token_util import get_access_token
import os
import requests
from dotenv import load_dotenv
from flask_cors import CORS
import urllib.parse
import datetime
from IGDB import *
import firebase_admin
from firebase_admin import credentials, auth, firestore, exceptions
import os

load_dotenv()

app = Flask(__name__, static_folder='../client/dist')
app.secret_key = os.getenv("FLASK_SECRET_KEY")
cors = CORS(app, origins=["http://localhost:5173", "https://gamesearching.vercel.app", "http://localhost:8080"])
firebase_config = {
    "type": os.getenv("FIREBASE_TYPE"),
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace("\\n", "\n"),
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
    "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
    "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
    "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL"),
    "universe_domain": os.getenv("FIREBASE_UNIVERSE_DOMAIN")
}
creds = credentials.Certificate(firebase_config)
firebase_admin.initialize_app(creds)
db = firestore.client()

#Inital boot up of the server get token details
access_token_data = get_access_token()
access_token, access_token_expiry = access_token_data[0], access_token_data[1]

client_id = os.getenv('CLIENT_ID')
headers = {
        'Client-ID': client_id,
        'Authorization': f'Bearer {access_token}',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

@app.route('/api/popular', methods=['GET'])
def popular():
    game_data = fetch_popular_games(headers)
    games = create_list_of_games(game_data)
    return jsonify(games)

# Route to get games by genre
@app.route('/api/genres', methods=['GET'])
def get_genres_games():
    genre = request.args.get('genre', type=str)
    genre = urllib.parse.unquote(genre)
    if genre == "":
        genres_data = fetch_genres(headers)
    else:
        genre_games = fetch_searched_genres(headers,genre)
        genres_data = create_list_of_games(genre_games)
    return jsonify(genres_data)


@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    assets_folder = os.path.join(app.static_folder, 'assets')
    return send_from_directory(assets_folder, filename)

# Catch-all route for React Router
@app.route('/<path:path>')
def catch_all(path):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    if not os.path.exists(os.path.join(app.static_folder, 'index.html')):
        raise FileNotFoundError("static/index.html not found.")
    app.run(debug=True, port=8080)