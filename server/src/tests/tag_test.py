""" Tests for tag routes """
import os
import unittest
from app import app, user_datastore
from database.models import db
from api_module.tag_routes import tags_blueprint
from auth_module.auth_routes import auth
from json import loads, dumps

app.testing = True
app.config["TESTING"] = True
app.register_blueprint(tags_blueprint)
app.register_blueprint(auth)

class TagTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
    
    def test_add_tag_should_return_err_if_no_email(self):
        login = '{ "email": "mymail@gmail.com", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "tagname": "math" }'
        expected = b'{"error": "No email field"}'
        req = self.app.post("/api/tags/add/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_add_tag_should_return_err_if_no_user_email(self):
        login = '{ "email": "mymail@gmail.com", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "tagname": "math", "email": "pepe@gmail.com" }'
        expected = b'{"error": "No user found"}'
        req = self.app.post("/api/tags/add/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_add_tag_should_return_err_if_no_teacher_role(self):
        login = '{ "email": "mymail@gmail.com", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "tagname": "math", "email": "mymail@gmail.com" }'
        expected = b'{"error": "No proper role"}'
        req = self.app.post("/api/tags/add/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)

    def test_add_tag_should_return_err_if_no_tagname_field(self):
        login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No tagname field"}'
        req = self.app.post("/api/tags/add/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)

    def test_add_tag_should_return_id_if_tag_created(self):
        login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "tagname": "pepe", "email": "bozhkov_d@mail.ru" }'
        req = self.app.post("/api/tags/add/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        actual = loads(req.data)
        self.assertTrue(isinstance(actual["id"], int))
    
    def test_get_tag_should_return_collection_of_tags(self):
        req = self.app.get("/api/tags/", content_type="application/json")
        actual = loads(req.data)
        self.assertTrue(isinstance(actual["tags"], list))
    
    def test_delete_tag_should_return_error_if_no_tag_field(self):
        login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No tagid field"}'
        req = self.app.delete("/api/tags/delete/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_delete_tag_should_return_error_if_no_tag_found(self):
        login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "tagid": 55, "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No such tag"}'
        req = self.app.delete("/api/tags/delete/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_delete_tag_should_return_response_if_tag_deleted(self):
        login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        jsonAdd = '{ "tagname": "adding", "email": "bozhkov_d@mail.ru" }'
        reqAdd = self.app.post("/api/tags/add/", data=jsonAdd, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        actualAdd = loads(reqAdd.data)
        json = '{ "tagid": ' + str(actualAdd["id"]) + ', "email": "bozhkov_d@mail.ru" }'
        expected = b'{"OK": true}'
        req = self.app.delete("/api/tags/delete/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)