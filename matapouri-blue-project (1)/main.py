from app import app

# For Vercel deployment, the app needs to be available at module level
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
