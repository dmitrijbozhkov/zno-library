""" Tests for course routes """
import os
import unittest
from app import app, user_datastore
from database.models import db
from api_module.course_routes import course_blueprint
from auth_module.auth_routes import auth
from json import loads

app.testing = True
app.config["TESTING"] = True
app.register_blueprint(course_blueprint)
app.register_blueprint(auth)

class CourseTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
    
    def test_check_should_return_error_if_no_name_field(self):
        login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No name field"}'
        req = self.app.post("/api/course/check/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_check_should_return_error_if_no_email_field(self):
        login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "name": "stuff" }'
        expected = b'{"error": "No email field"}'
        req = self.app.post("/api/course/check/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_check_should_return_error_if_no_teacher_role(self):
        login = '{ "email": "mymail@gmail.com", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "name": "stuff", "email": "mymail@gmail.com" }'
        expected = b'{"error": "No proper role"}'
        req = self.app.post("/api/course/check/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)

    def test_check_should_return_id_string_if_name_valid(self):
        login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "name": "stuff", "email": "bozhkov_d@mail.ru" }'
        req = self.app.post("/api/course/check/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        actual = loads(req.data)
        self.assertTrue(isinstance(actual["id"], str))
    
    def test_add_should_return_error_if_no_email_field(self):
        login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "id": "1234567890123456", "name": "Some course", "postTime": "2017-06-09T13:02:51.994Z" }'
        expected = b'{"error": "No email field"}'
        req = self.app.post("/api/course/add/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_add_should_return_error_if_no_id(self):
        login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "name": "Some course", "postTime": "2017-06-09T13:02:51.994Z", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No id field"}'
        req = self.app.post("/api/course/add/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)

    def test_add_should_return_error_if_no_name(self):
        login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "id": "1234567890123456", "postTime": "2017-06-09T13:02:51.994Z", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No name field"}'
        req = self.app.post("/api/course/add/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_add_should_return_error_if_no_postTime(self):
        login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "id": "1234567890123456", "name": "Some course", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No postTime field"}'
        req = self.app.post("/api/course/add/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_add_should_return_response_if_course_added(self):
        login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "id": "1234567890123456", "name": "Some course", "postTime": "2017-06-09T13:02:51.994Z", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"OK": true}'
        req = self.app.post("/api/course/add/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_check_should_return_error_if_course_exists(self):
        login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "name": "Some course", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "Name is already taken"}'
        req = self.app.post("/api/course/check/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_contents_should_return_error_if_no_id_field(self):
        login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "contents": "this is it", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No id field"}'
        req = self.app.post("/api/course/add/contents/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_contents_should_return_error_if_no_contents_field(self):
        login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "id": "1234567890123456", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No contents field"}'
        req = self.app.post("/api/course/add/contents/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_contents_should_return_error_if_no_course_found(self):
        login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "id": "1234567890123459", "contents": "this is it", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No course found"}'
        req = self.app.post("/api/course/add/contents/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_contents_should_return_response_if_contents_added(self):
        login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "id": "1234567890123456", "contents": "this is it", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"OK": true}'
        req = self.app.post("/api/course/add/contents/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)

    def test_description_should_return_error_if_no_id_field(self):
        login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "description": "this is description", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No id field"}'
        req = self.app.post("/api/course/add/description/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_description_should_return_error_if_no_descripton_field(self):
        login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "id": "1234567890123456", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No description field"}'
        req = self.app.post("/api/course/add/description/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_description_should_return_error_if_no_course_found(self):
        login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "id": "1234567890123450", "description": "this is description", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No course found"}'
        req = self.app.post("/api/course/add/description/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_description_should_return_response_if_description_added(self):
        login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "id": "1234567890123456", "description": "this is description", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"OK": true}'
        req = self.app.post("/api/course/add/description/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_preface_should_return_error_if_no_id_field(self):
        login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "preface": "this is preface", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No id field"}'
        req = self.app.post("/api/course/add/preface/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_preface_should_return_error_if_no_preface_field(self):
        login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "id": "1234567890123456", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No preface field"}'
        req = self.app.post("/api/course/add/preface/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_preface_should_return_error_if_no_course_found(self):
        login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "id": "1234567890123450", "preface": "this is preface", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No course found"}'
        req = self.app.post("/api/course/add/preface/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_preface_should_return_response_if_preface_added(self):
        login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
        token = self.app.post("/auth/login/", data=login, content_type="application/json")
        authToken = loads(token.data)
        json = '{ "id": "1234567890123456", "preface": "this is preface", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"OK": true}'
        req = self.app.post("/api/course/add/preface/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)