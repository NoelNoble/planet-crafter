from flask import Flask, jsonify, send_from_directory
import requests
import os

# --- Configuration ---
# Set the root directory for the application
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Initialize Flask app (Flask automatically looks for the 'static' folder)
app = Flask(__name__) 

# --- 1. API Endpoint ---
@app.route('/exoplanets')
def get_exoplanets():
    """
    Fetches exoplanet data from the external NASA API and returns it as JSON.
    This runs server-side to bypass browser CORS policy.
    """
    URL = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,pl_eqt,pl_rade,pl_bmasse,st_teff+from+pscomppars&format=json"
    
    try:
        # Use requests to make the secure server-side call
        response = requests.get(URL)
        
        # Raise an exception for bad status codes (4xx or 5xx)
        response.raise_for_status() 
        
        # Return the JSON data wrapped by Flask's jsonify
        return jsonify(response.json()), 200
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from NASA: {e}")
        # Return a server error status if the fetch fails
        return jsonify({"error": "Could not fetch data from external API"}), 500

# --- 2. Route to Serve the Main HTML File ---
@app.route('/')
def serve_index():
    """Serves the index.html file directly from the base directory."""
    return send_from_directory(BASE_DIR, 'index.html')

if __name__ == '__main__':
    # Run the server on http://127.0.0.1:5000/
    app.run(debug=True, port=5000)
