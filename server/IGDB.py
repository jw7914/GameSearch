import requests
import datetime

base_url = "https://api.igdb.com/v4"

def fetch_gameid(headers, id):
    body = f'fields id, name, cover.url, summary, rating_count, platforms.platform_logo.url, genres.name, player_perspectives.name, themes.name, screenshots.url, total_rating, storyline, videos.video_id; where id = {id};'

    response = requests.post(f'{base_url}/games', headers=headers, data=body)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def fetch_latest_games(headers, time):
    time = int(time)
    body = f'fields id, name, cover.url, artworks.url, summary, rating_count, genres.name, parent_game.name, first_release_date, screenshots.url, storyline; limit 100; sort first_release_date desc; where first_release_date <= {time};'
    response = requests.post(f'{base_url}/games', headers=headers, data=body)
    
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def fetch_searched_games(headers, search_term):
    body = f'fields id, name, cover.url, summary, rating_count, first_release_date, parent_game.name, genres.name, screenshots.url, total_rating, storyline, videos.video_id; limit 500; search "{search_term}";'
    
    response = requests.post(f'{base_url}/games', headers=headers, data=body)
    
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def fetch_searched_genres(headers, genre):
    body = f'fields id, name, cover.url, summary, rating_count, first_release_date, genres.name, screenshots.url, total_rating, storyline, videos.video_id; limit 500; where genres.name = "{genre}";'
    
    response = requests.post(f'{base_url}/games', headers=headers, data=body)
    
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def get_parent_game_detail(headers, gameName):
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
        
        if game.get("artworks"):
            game["artworks"] = clean_data(game["artworks"], "artworks", "url")
            
       
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
            elif "t_thumb" in item[keyName] and listName == "artworks":
                result.append("https:" + item[keyName].replace("t_thumb", "t_1080p"))
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

def fetch_genres(headers):
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

def fetch_popular_games(headers):
    popular_body = "fields game_id, value, popularity_type; sort value desc; limit 20; where popularity_type = 2;"
    popular_games = []
    try:
        popular_response = requests.post(f"{base_url}/popularity_primitives", headers=headers, data=popular_body)
        popular_response.raise_for_status()  # Raise an exception for HTTP errors
        popular = popular_response.json()
        for x in popular:
            game_id = x["game_id"]
            popular_games.append(game_id)   
    except requests.exceptions.HTTPError as error:
        print(f"HTTP error: {error}")
        return []
    except Exception as error:
        print(f"Error fetching games: {error}")
        return []
    
    games_to_fetch = "(" + ", ".join(map(str, popular_games)) + ")"
    body = f'fields id, name, cover.url, summary, rating_count, genres.name, parent_game.name, first_release_date, screenshots.url, total_rating, storyline, videos.video_id, artworks.url; where id = {games_to_fetch}; limit 20;'

    try:
        response = requests.post(f'{base_url}/games', headers=headers, data=body)
        response.raise_for_status()  
        return response.json()
    except requests.exceptions.HTTPError as error:
        print(f"HTTP error: {error}")
        return []


        
    
    

