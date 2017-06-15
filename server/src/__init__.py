""" Builds and runs application """
from app import app, user_datastore, db
from api_module.tag_routes import tags_blueprint
from api_module.course_routes import course_blueprint
from auth_module.auth_routes import auth
from api_module.file_routes import file_blueprint
from api_module.chapter_routes import chapter_blueprint

app.register_blueprint(tags_blueprint)
app.register_blueprint(course_blueprint)
app.register_blueprint(file_blueprint)
app.register_blueprint(chapter_blueprint)
app.register_blueprint(auth)

if __name__ == "__main__":
    app.run(port=3000)
