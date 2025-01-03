from flask import Flask, jsonify, request
from token_util import get_access_token
import os
import requests
from dotenv import load_dotenv
from flask_cors import CORS
import urllib.parse
import datetime


# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
cors = CORS(app, origins="*")

client_id = os.getenv('CLIENT_ID')
access_token = get_access_token()
base_url = "https://api.igdb.com/v4"
headers = {
        'Client-ID': client_id,
        'Authorization': f'Bearer {access_token}',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

def fetch_gameid(id):
    body = f'fields id, name, cover.url, summary, rating_count, platforms.platform_logo.url, genres.name, player_perspectives.name, themes.name, screenshots.url, total_rating, storyline, videos.video_id; where id = {id};'

    response = requests.post(f'{base_url}/games', headers=headers, data=body)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def fetch_lastest_games(time):
    body = f'fields id, name, cover.url, summary, rating_count, genres.name, parent_game.name, first_release_date, screenshots.url, total_rating, storyline, videos.video_id; limit 20; sort first_release_date desc; where first_release_date <= {time};'
    response = requests.post(f'{base_url}/games', headers=headers, data=body)
    
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def fetch_popular_games():
    body = f'fields id, name, cover.url, summary, rating_count, genres.name, parent_game.name, screenshots.url, total_rating, storyline, videos.video_id; limit 500; sort total_rating desc;'
    response = requests.post(f'{base_url}/games', headers=headers, data=body)
    
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def fetch_searched_games(search_term):
    body = f'fields id, name, cover.url, summary, rating_count, first_release_date, parent_game.name, genres.name, screenshots.url, total_rating, storyline, videos.video_id; limit 500; search "{search_term}";'
    
    response = requests.post(f'{base_url}/games', headers=headers, data=body)
    
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def fetch_searched_genres(genre):
    body = f'fields id, name, cover.url, summary, rating_count, first_release_date, genres.name, screenshots.url, total_rating, storyline, videos.video_id; limit 500; where genres.name = "{genre}";'
    
    response = requests.post(f'{base_url}/games', headers=headers, data=body)
    
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def get_parent_game_detail(gameName):
    body = f'fields id, name, cover.url, summary, rating_count, genres.name, first_release_date, screenshots.url, total_rating, storyline, videos.video_id; where name = "{gameName}";'
    
    response = requests.post(f'{base_url}/games', headers=headers, data=body)
    
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def create_list_of_games(games):
    games_with_all_fields = []
    uniqueGames = []
    uniqueGameNames = set()
    for game in games:
        if game.get("parent_game", "") == "":
            uniqueGames.append(game)
        elif game.get("parent_game", "") != "" and game['parent_game']['name'] in uniqueGameNames:
            uniqueGames.append(get_parent_game_detail((game['parent_game']['name'])))
            uniqueGameNames.add(game['parent_game']['name'])
    
    required_keys = ["name", "cover", "summary", "genres", "screenshots"]
    
    for game in uniqueGames:
        if game.get("first_release_date"):
            timestamp_in_seconds = game["first_release_date"]
            date = datetime.datetime.fromtimestamp(timestamp_in_seconds)
            game["first_release_date"] = date.strftime("%m/%d/%Y")
       
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
            if "t_thumb" in item[keyName] and listName == "cover":
                # Replace 't_thumb' with 't_cover_big' for cover URLs
                result.append("https:" + item[keyName].replace("t_thumb", "t_cover_big"))
            elif "t_thumb" in item[keyName] and listName == "screenshots":
                result.append("https:" + item[keyName].replace("t_thumb", "t_screenshot_big"))
            elif listName == "videos":
                # Build YouTube video link
                result.append("https://www.youtube.com/embed/" + item[keyName])
            else:
                result.append(item[keyName])
    else:
        if "t_thumb" in listFromJSON[keyName]:
            result.append("https:" + listFromJSON[keyName].replace("t_thumb", "t_cover_big"))
        elif listName == "videos":
            result.append("https://www.youtube.com/embed/" + listFromJSON[keyName])
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
    current_time = int(datetime.datetime.now().timestamp())
    game_data = fetch_lastest_games(current_time)
    games = create_list_of_games(game_data)
    return jsonify(games)

@app.route('/popular', methods=['GET'])
def popular():
    game_data = fetch_popular_games()
    games = create_list_of_games(game_data)
    return jsonify(games)

@app.route('/games', methods=['GET'])
def get_games():
    search_term = request.args.get('search_term', type=str)
    search_term = urllib.parse.unquote(search_term)
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
    if genre == "":
        genres_data = fetch_genres()
    else:
        genre_games = fetch_searched_genres(genre)
        genres_data = create_list_of_games(genre_games)
    return jsonify(genres_data)

@app.route('/<id>', methods=['GET'])
def get_game_id(id):
    try:
        games = fetch_gameid(id)
        games_data = create_list_of_games(games)
        print(games_data[0]['platforms'][0]['platform_logo'])
        games_data[0]['platforms'] = ["https:" + ((games_data[0]['platforms'][0]['platform_logo']['url']).replace("t_thumb", "t_cover_big"))]
        return jsonify(games_data)
    except requests.exceptions.HTTPError as err:
        return jsonify({"error": str(err)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8080)