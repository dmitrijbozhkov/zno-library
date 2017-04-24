""" Builds and runs application """
from app import app, init_db
import api_routes

app.register_blueprint(api_routes.api)

if __name__ == "__main__":
    init_db()
    app.run(port=3000)
