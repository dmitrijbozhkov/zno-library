""" Creates flask application """
from flask import Flask, render_template
from flask_security import SQLAlchemyUserDatastore, Security
from database.models import Role, User, db
from database.setup import init_db

app = Flask(
    "metodichka",
    template_folder="../../client/views/",
    static_folder="../../static/client/",
    static_url_path="/static")

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:pass@localhost:5432/metodichka-test"
app.config["SECURITY_TOKEN_MAX_AGE"] = 259200
app.config["DEBUG"] = True
app.config["SECRET_KEY"] = "super-secret"
app.config["SECURITY_PASSWORD_HASH"] = "bcrypt"
app.config["SECURITY_PASSWORD_SALT"] = "$2a$16$PnnIgfMwkOjGX4SkHqSOPO"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True

db.init_app(app)

user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(app, user_datastore)

@app.before_first_request
def fill_roles():
    init_db(user_datastore, db, app.config["TESTING"])

@app.route("/")
def route():
    """ App route """
    return render_template("index.html")

@app.errorhandler(404)
def page_not_found(e):
    """ If not found let angular figure out what to do """
    return render_template("index.html")