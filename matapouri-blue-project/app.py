import os
import logging
from flask import Flask, send_from_directory

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create the Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")

# Route to serve attached assets
@app.route('/attached_assets/<path:filename>')
def attached_assets(filename):
    return send_from_directory('attached_assets', filename)

# Import routes after app creation to avoid circular imports
from routes import *

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
