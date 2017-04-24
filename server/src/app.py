""" Creates flask application """
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from database.models import Roles, CourseStatuses
from sqlalchemy import create_engine, insert
from sqlalchemy.orm import sessionmaker

connection_str = "postgresql://postgres:pass@localhost:5432/metodichka"

app = Flask(
    "metodichka",
    template_folder="../../client/views/",
    static_folder="../../static/",
    static_url_path="/static")

app.config["SQLALCHEMY_DATABASE_URI"] = connection_str

db = SQLAlchemy(app)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>/')
def route(path=None):
    """ App route """
    return render_template("index.html")

def init_db():
    """ Adds roles to database """
    user_role = Roles(1, "User")
    teacher_role = Roles(2, "Teacher")
    admin_role = Roles(3, "Admin")
    reading_status = CourseStatuses(1, "Reading")
    completed_status = CourseStatuses(2, "Completed")
    db.session.add(user_role)
    db.session.add(teacher_role)
    db.session.add(admin_role)
    db.session.add(reading_status)
    db.session.add(completed_status)
    db.session.commit()
