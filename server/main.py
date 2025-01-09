from flask import Flask, jsonify, request, abort, session
import pymysql.cursors
from token_util import get_access_token
import os
import requests
from dotenv import load_dotenv
from flask_cors import CORS
import urllib.parse
import datetime
from IGDB import *
import firebase_admin
from firebase_admin import credentials, auth


load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY")
cors = CORS(app, origins="*")
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
firebase_admin.initialize_app(cred)

timeout = 10
connection = pymysql.connect(
  charset="utf8mb4",
  connect_timeout=timeout,
  cursorclass=pymysql.cursors.DictCursor,
  db="gamesearch",
  host=os.getenv("DB_HOST"),
  password=os.getenv("DB_PASSWORD"),
  read_timeout=timeout,
  port=11075,
  user="avnadmin",
  write_timeout=timeout,
)

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

@app.route('/', methods=['GET']) 
def latest():
    global access_token, access_token_expiry
    current_time = datetime.datetime.now().timestamp()
    if current_time > access_token_expiry: #Root/homepage of frontend will call this route causing token to be refreshed if expired
        access_token_data = get_access_token()
        access_token = access_token_data[0]
        access_token_expiry = access_token_data[1]
    game_data = fetch_latest_games(headers, current_time)
    games = create_list_of_games(game_data)
    return jsonify(games[0:20])

@app.route('/popular', methods=['GET'])
def popular():
    game_data = fetch_popular_games(headers)
    games = create_list_of_games(game_data)
    return jsonify(games)

@app.route('/games', methods=['GET'])
def get_games():
    search_term = request.args.get('search_term', type=str)
    search_term = urllib.parse.unquote(search_term)
    try:
        games_data = fetch_searched_games(headers, search_term)
        games = create_list_of_games(games_data)
        return jsonify(games)
    except requests.exceptions.HTTPError as err:
        return jsonify({"error": str(err)}), 500
    
# Route to get games by genre
@app.route('/genres', methods=['GET'])
def get_genres_games():
    genre = request.args.get('genre', type=str)
    genre = urllib.parse.unquote(genre)
    if genre == "":
        genres_data = fetch_genres(headers)
    else:
        genre_games = fetch_searched_genres(headers,genre)
        genres_data = create_list_of_games(genre_games)
    return jsonify(genres_data)

@app.route('/<id>', methods=['GET'])
def get_game_id(id):    
    try:
        games = fetch_gameid(headers, id)
        games_data = create_list_of_games(games)
        games_data[0]['platforms'] = ["https:" + ((games_data[0]['platforms'][0]['platform_logo']['url']).replace("t_thumb", "t_cover_big"))]
        return jsonify(games_data)
    except requests.exceptions.HTTPError as err:
        return jsonify({"error": str(err)}), 500
    
@app.route("/login", methods=['POST'])
def login():
    try:
        data = request.json
        token = data.get("idToken")
        decoded_token = auth.verify_id_token(token)
        user_id = decoded_token['uid']
        session['uid'] = user_id
        sqlCursor = connection.cursor()
        # Check if the user already exists in the database
        sqlCursor.execute("SELECT uid FROM users WHERE uid = %s", (user_id,))
        user = sqlCursor.fetchone()
        
        if not user:
            sqlCursor.execute("INSERT INTO users (uid, displayName) VALUES (%s, %s)", (user_id, decoded_token['name']))
            connection.commit()
            
        return jsonify({"message": "Login successful", "user_id": user_id}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401
    
@app.route("/addGame", methods=['POST'])
def addGame():
    try:
        data = request.json
        user_id = session['uid']
        gameID = data.get("gameID")
        gameName = data.get("name")
        image = data.get("img")

        sqlCursor = connection.cursor()

        # Check if Game is already in the db
        sqlCursor.execute("SELECT gameID FROM games WHERE gameID = %s", (gameID,))
        game = sqlCursor.fetchone()

        if not game:
            sqlCursor.execute("INSERT INTO games (gameID, gameName, image) VALUES (%s, %s, %s)", (gameID, gameName, image))
            connection.commit()

        # Check if Game is already favorited by the User
        sqlCursor.execute("SELECT uid, gameID FROM user_games WHERE uid = %s and gameID = %s", (user_id, gameID))
        exists = sqlCursor.fetchone()

        if not exists:
            sqlCursor.execute("INSERT INTO user_games (uid, gameID) VALUE (%s, %s)", (user_id, gameID))
            connection.commit()
        
        return jsonify({"message": "Game favorited successfully."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 401
    
@app.route("/removeGame", methods=['POST'])
def removeGame():
    try:
        data = request.json
        user_id = session['uid']
        gameID = data.get("gameID")

        sqlCursor = connection.cursor()

        # Check if Game is  favorited by the User
        sqlCursor.execute("SELECT uid, gameID FROM user_games WHERE uid = %s and gameID = %s", (user_id, gameID))
        exists = sqlCursor.fetchone()

        if exists:
            sqlCursor.execute("DELETE FROM user_games where UID = %s and gameID = %s", (user_id, gameID))
            connection.commit()
        
        return jsonify({"message": "Game favorited successfully."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 402

@app.route("/retrieveFavorited", methods=['GET', 'POST'])
def retrieveFavorited():
    try:
        user_id = session['uid']

        if not user_id:
            return jsonify({"error": "User not authenticated"}), 401

        sqlCursor = connection.cursor()

        query = """
            SELECT G.gameID, G.gameName, G.image 
            FROM users_game UG
            JOIN games G ON UG.gameID = G.gameID
            where UG.UID = %s
        """
        sqlCursor.execute(query, (user_id))
        result = sqlCursor.fetchall()

        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8080)