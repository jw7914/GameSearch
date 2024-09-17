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
headers = {
        'Client-ID': client_id,
        'Authorization': f'Bearer {access_token}',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

def fetch_games():
    body = f'fields id, name, cover.url, summary, rating_count, genres.name, screenshots.url, total_rating, storyline, videos.video_id; limit 500;'
    
    response = requests.post(f'{base_url}/games', headers=headers, data=body)
    
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def fetch_searched_games(search_term):
    body = f'fields id, name, cover.url, summary, rating_count, genres.name, screenshots.url, total_rating, storyline, videos.video_id; limit 500; search "{search_term}";'
    
    response = requests.post(f'{base_url}/games', headers=headers, data=body)
    
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def create_list_of_games(specificGame):
    if specificGame != "":
        games = fetch_searched_games(specificGame)
    else:
        games = fetch_games()
    games_with_all_fields = []
    required_keys = ["name", "cover", "summary", "genres", "screenshots"]
    
    for game in games:
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
                result.append(item[keyName].replace("t_thumb", "t_cover_big"))
            elif listName == "videos":
                result.append("https://www.youtube.com/watch?v=" + item[keyName])
            else:
                result.append(item[keyName])
    else:
        if "t_thumb" in listFromJSON[keyName]:
            result.append(listFromJSON[keyName].replace("t_thumb", "t_cover_big"))
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
    games = create_list_of_games("")
    return jsonify(games)

@app.route('/games/<gameName>', methods=['GET'])
def get_games(gameName):
    search_term = gameName
    try:
        games = create_list_of_games(search_term)
        return jsonify(games)
    except requests.exceptions.HTTPError as err:
        return jsonify({"error": str(err)}), 500
    
@app.route('/genres', methods=['GET'])
def get_genres():
    genres = fetch_genres()
    return jsonify(genres)

if __name__ == '__main__':
    app.run(debug=True, port=8080)