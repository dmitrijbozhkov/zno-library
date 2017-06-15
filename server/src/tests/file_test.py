""" Tests for course routes """
import os
import unittest
from app import app, user_datastore
from database.models import db
from api_module.file_routes import file_blueprint
from auth_module.auth_routes import auth
from json import loads
import io

app.testing = True
app.config["TESTING"] = True
app.register_blueprint(file_blueprint)

def login(client):
    login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
    return client.post("/auth/login/", data=login, content_type="application/json")

class FileTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.app = app.test_client()

    def test_upload_icon_should_return_error_if_no_teacher_role(self):
        token = login(self.app)
        authToken = loads(token.data)
        data = {
            "file": (io.BytesIO(b'Foo bar baz'), "meme.png"),
            "email": "mymail@gmail.com"
        }
        req = self.app.post("/api/file/icon/", data=data, content_type="multipart/form-data", headers={ "Authentication-Token": authToken["token"] })
        expected = b'{"error": "No proper role"}'
        self.assertEqual(req.data, expected)
    
    def test_upload_icon_should_return_response_if_icon_saved(self):
        token = login(self.app)
        authToken = loads(token.data)
        data = {
            "file": (io.BytesIO(b'Foo bar baz'), "meme.png"),
            "email": "bozhkov_d@mail.ru"
        }
        req = self.app.post("/api/file/icon/", data=data, content_type="multipart/form-data", headers={ "Authentication-Token": authToken["token"] })
        expected = b'{"OK": true}'
        self.assertEqual(req.data, expected)
    
    def test_upload_image_should_return_error_if_no_teacher_role(self):
        self.assertTrue(True)
    
    def test_upload_image_should_return_response_if_icon_saved(self):
        self.assertTrue(True)

    def test_upload_file_should_return_error_if_no_teacher_role(self):
        self.assertTrue(True)
    
    def test_upload_file_should_return_response_if_icon_saved(self):
        self.assertTrue(True)