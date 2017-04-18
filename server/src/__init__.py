""" Api startup file """
from flask import Flask, request, url_for, render_template
import api_routes

app = Flask(
    "metodichka",
    template_folder="../../client/views/",
    static_folder="../../static/",
    static_url_path="/static")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>/')
def route(path=None):
    """ App route """
    return render_template("index.html")

app.register_blueprint(api_routes.api)

if __name__ == "__main__":
    app.run(port=3000)
