""" Builds and runs application """
from app import app, user_datastore, db
from api_module.api_routes import api
from auth_module.auth_routes import auth

app.register_blueprint(api)
app.register_blueprint(auth)

if __name__ == "__main__":
    app.run(port=3000)
