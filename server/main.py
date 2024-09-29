from flask import Flask, jsonify, request
import os
import requests
from dotenv import load_dotenv
from flask_cors import CORS
import urllib.parse

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
cors = CORS(app, origins="*")

client_id = os.getenv('CLIENT_ID')
access_token = os.getenv('ACCESS_TOKEN')
base_url = "https://api.igdb.com/v4"
headers = {
        'Client-ID': client_id,
        'Authorization': f'Bearer {access_token}',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

def fetch_games():
    body = f'fields id, name, cover.url, summary, rating_count, genres.name, parent_game, screenshots.url, total_rating, storyline, videos.video_id; limit 500;'
    
    response = requests.post(f'{base_url}/games', headers=headers, data=body)
    
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def fetch_searched_games(search_term):
    body = f'fields id, name, cover.url, summary, rating_count, parent_game, genres.name, screenshots.url, total_rating, storyline, videos.video_id; limit 500; search "{search_term}";'
    
    response = requests.post(f'{base_url}/games', headers=headers, data=body)
    
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def fetch_searched_genres(genre):
    body = f'fields id, name, cover.url, summary, rating_count, genres.name, screenshots.url, total_rating, storyline, videos.video_id; limit 500; where genres.name = "{genre}";'
    
    response = requests.post(f'{base_url}/games', headers=headers, data=body)
    
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def get_parent_game_detail(gameID):
    body = f'fields id, name, cover.url, summary, rating_count, genres.name, screenshots.url, total_rating, storyline, videos.video_id; limit 500;'
    
    response = requests.post(f'{base_url}/games', headers=headers, data=body)
    
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def create_list_of_games(games):
    games_with_all_fields = []
    uniqueGames = []
    for game in games:
        if game.get("parent_game", -1) == -1:
            uniqueGames.append(game)
        elif game.get("parent_game", -1) != -1 and game["parent_game"] not in uniqueGames:
            uniqueGames.append(get_parent_game_detail(game['parent_game']))
    
    required_keys = ["name", "cover", "summary", "genres", "screenshots"]
    
    for game in uniqueGames:
        if all(key in game for key in required_keys):
            game["screenshots"] = clean_data(game["screenshots"], "screenshots", "url")
            game["cover"] = clean_data(game["cover"], "cover", "url")
            game["genres"] = clean_data(game["genres"], "genres", "name")
            if "videos" in game:
                game["videos"] = clean_data(game["videos"], "videos", "video_id")
            games_with_all_fields.append(game)

    return games_with_all_fields

def clean_data(listFromJSON, listName, keyName):
    result = []
    if isinstance(listFromJSON, list):
        for item in listFromJSON:
            if "t_thumb" in item[keyName]:
                # Replace 't_thumb' with 't_cover_big' for cover URLs
                result.append("https:" + item[keyName].replace("t_thumb", "t_cover_big"))
            elif listName == "videos":
                # Build YouTube video link
                result.append("https://www.youtube.com/watch?v=" + item[keyName])
            else:
                result.append(item[keyName])
    else:
        if "t_thumb" in listFromJSON[keyName]:
            result.append("https:" + listFromJSON[keyName].replace("t_thumb", "t_cover_big"))
        elif listName == "videos":
            result.append("https://www.youtube.com/watch?v=" + listFromJSON[keyName])
        else:
            result.append(listFromJSON[keyName])
    
    return result

def fetch_genres():
    body = 'fields name; limit 500;'
    try:
        response = requests.post(f'{base_url}/genres', headers=headers, data=body)
        response.raise_for_status()  # Raise an exception for HTTP errors
        genres = response.json()
        return genres
    except requests.exceptions.HTTPError as error:
        print(f"HTTP error: {error}")
        return []
    except Exception as error:
        print(f"Error fetching genres: {error}")
        return []

#create more routes for different end points
@app.route('/', methods=['GET'])
def latest():
    game_data = fetch_games()
    games = create_list_of_games(game_data)
    return jsonify(games)

@app.route('/games', methods=['GET'])
def get_games():
    search_term = request.args.get('search_term', type=str)
    print(search_term)
    search_term = urllib.parse.unquote(search_term)
    print(search_term)
    try:
        games_data = fetch_searched_games(search_term)
        games = create_list_of_games(games_data)
        return jsonify(games)
    except requests.exceptions.HTTPError as err:
        return jsonify({"error": str(err)}), 500
    
# Route to get games by genre
@app.route('/genres', methods=['GET'])
def get_genres_games():
    genre = request.args.get('genre', type=str)
    genre = urllib.parse.unquote(genre)
    print(genre)
    if genre == "":
        genres_data = fetch_genres()
    else:
        genre_games = fetch_searched_genres(genre)
        genres_data = create_list_of_games(genre_games)
    return jsonify(genres_data)

if __name__ == '__main__':
    app.run(debug=True, port=8080)