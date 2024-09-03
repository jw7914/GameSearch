from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/", methods=["GET"])
def users():
    return jsonify(
        {
            "test": ['Hello', "World"]
        }
    )

if __name__ == "__main__":
    app.run(debug=True, port=8080)
