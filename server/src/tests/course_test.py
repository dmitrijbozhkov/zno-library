""" Tests for course routes """
import os
import unittest
from app import app, user_datastore
from database.models import db
from api_module.course_routes import course_blueprint
from auth_module.auth_routes import auth
from api_module.tag_routes import tags_blueprint
from json import loads

app.testing = True
app.config["TESTING"] = True
app.register_blueprint(course_blueprint)
app.register_blueprint(auth)
app.register_blueprint(tags_blueprint)

def login(client):
    login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
    return client.post("/auth/login/", data=login, content_type="application/json")

def delete_default_course(client, token):
    json = '{ "id": "1234567890123456", "email": "bozhkov_d@mail.ru" }'
    return client.delete("/api/course/delete/", data=json, content_type="application/json", headers={ "Authentication-Token": token })

class CourseTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.app = app.test_client()

    @classmethod
    def tearDownClass(cls):
        cls.app = app.test_client()
        token = login(cls.app)
        authToken = loads(token.data)
        delete_default_course(cls.app, authToken["token"])

    def test_check_should_return_error_if_no_name_field(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No name field"}'
        req = self.app.post("/api/course/check/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_check_should_return_error_if_no_email_field(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "name": "stuff" }'
        expected = b'{"error": "No email field"}'
        req = self.app.post("/api/course/check/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_check_should_return_error_if_no_teacher_role(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "name": "stuff", "email": "mymail@gmail.com" }'
        expected = b'{"error": "No proper role"}'
        req = self.app.post("/api/course/check/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)

    def test_check_should_return_id_string_if_name_valid(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "name": "stuff", "email": "bozhkov_d@mail.ru" }'
        req = self.app.post("/api/course/check/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        actual = loads(req.data)
        self.assertTrue(isinstance(actual["id"], str))
    
    def test_add_should_return_error_if_no_email_field(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "id": "1234567890123456", "name": "Some course", "postTime": "2017-06-09T13:02:51.994Z" }'
        expected = b'{"error": "No email field"}'
        req = self.app.post("/api/course/add/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_add_should_return_error_if_no_id(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "name": "Some course", "postTime": "2017-06-09T13:02:51.994Z", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No id field"}'
        req = self.app.post("/api/course/add/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)

    def test_add_should_return_error_if_no_name(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "id": "1234567890123456", "postTime": "2017-06-09T13:02:51.994Z", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No name field"}'
        req = self.app.post("/api/course/add/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_add_should_return_error_if_no_postTime(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "id": "1234567890123456", "name": "Some course", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No postTime field"}'
        req = self.app.post("/api/course/add/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_add_should_return_response_if_course_added(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "id": "1234567890123456", "name": "Some course", "postTime": "2017-06-09T13:02:51.994Z", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"OK": true}'
        req = self.app.post("/api/course/add/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_check_should_return_error_if_course_exists(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "name": "Some course", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "Name is already taken"}'
        req = self.app.post("/api/course/check/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_description_should_return_error_if_no_id_field(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "description": "this is description", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No id field"}'
        req = self.app.post("/api/course/add/description/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_description_should_return_error_if_no_descripton_field(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "id": "1234567890123456", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No description field"}'
        req = self.app.post("/api/course/add/description/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_description_should_return_error_if_no_course_found(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "id": "1234567890123450", "description": "this is description", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No course found"}'
        req = self.app.post("/api/course/add/description/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_description_should_return_response_if_description_added(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "id": "1234567890123456", "description": "this is description", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"OK": true}'
        req = self.app.post("/api/course/add/description/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_preface_should_return_error_if_no_id_field(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "preface": "this is preface", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No id field"}'
        req = self.app.post("/api/course/add/preface/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_preface_should_return_error_if_no_preface_field(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "id": "1234567890123456", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No preface field"}'
        req = self.app.post("/api/course/add/preface/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_preface_should_return_error_if_no_course_found(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "id": "1234567890123450", "preface": "this is preface", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No course found"}'
        req = self.app.post("/api/course/add/preface/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_preface_should_return_response_if_preface_added(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "id": "1234567890123456", "preface": "this is preface", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"OK": true}'
        req = self.app.post("/api/course/add/preface/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_delete_should_return_error_if_no_id_field(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No id field"}'
        req = self.app.delete("/api/course/delete/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_delete_should_return_error_if_no_teacher_role(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "id": "1234567890123456", "email": "mymail@gmail.com" }'
        expected = b'{"error": "No proper role"}'
        req = self.app.delete("/api/course/delete/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_tags_should_return_error_if_no_teacher_role(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "id": "1234567890123456", "tags": [ 1 ], "email": "mymail@gmail.com" }'
        expected = b'{"error": "No proper role"}'
        req = self.app.post("/api/course/tags/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_tags_should_return_error_if_no_id_field(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "tags": [ 1 ], "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No id field"}'
        req = self.app.post("/api/course/tags/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_tags_should_return_error_if_no_tags_field(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "id": "1234567890123456", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "No tags field"}'
        req = self.app.post("/api/course/tags/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_tags_should_return_error_if_tags_not_found(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "id": "1234567890123456", "tags": [ 99 ], "email": "bozhkov_d@mail.ru" }'
        expected = b'{"error": "tag not found"}'
        req = self.app.post("/api/course/tags/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_tags_should_return_response_if_tags_set(self):
        token = login(self.app)
        authToken = loads(token.data)
        jsonAdd = '{ "tagname": "math", "email": "bozhkov_d@mail.ru" }'
        json = '{ "id": "1234567890123456", "tags": [ 1 ], "email": "bozhkov_d@mail.ru" }'
        expected = b'{"OK": true}'
        self.app.post("/api/tags/add/", data=jsonAdd, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        req = self.app.post("/api/course/tags/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)

    def test_delete_should_return_response_if_course_deleted(self):
        token = login(self.app)
        authToken = loads(token.data)
        jsonAdd = '{ "id": "1234567890123450", "name": "Some course", "postTime": "2017-06-09T13:02:51.994Z", "email": "bozhkov_d@mail.ru" }'
        json = '{ "id": "1234567890123450", "email": "bozhkov_d@mail.ru" }'
        expected = b'{"OK": true}'
        addReq = self.app.post("/api/course/add/", data=jsonAdd, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        req = self.app.delete("/api/course/delete/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_tags_should_return_error_if_no_teacher_role(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "id": "1234567890123450", "tags": [ 1 ], "email": "mymail@gmail.com" }'
        courseTagReq = self.app.post("/api/course/tags/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        expected = b'{ "error": "No proper role" }'
        self.assertTrue(courseTagReq, expected)

    def test_tags_should_return_error_if_no_id_field(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "tags": [ 1 ], "email": "bozhkov_d@mail.ru" }'
        courseTagReq = self.app.post("/api/course/tags/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        expected = b'{ "error": "No id field" }'
        self.assertTrue(courseTagReq, expected)
    
    def test_tags_should_return_error_if_no_tags_field(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "id": "1234567890123450", "email": "bozhkov_d@mail.ru" }'
        courseTagReq = self.app.post("/api/course/tags/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        expected = b'{ "error": "No tags field" }'
        self.assertTrue(courseTagReq, expected)

    def test_tags_should_set_tags_and_return_response(self):
        token = login(self.app)
        authToken = loads(token.data)
        jsonAdd = '{ "id": "1234567890123450", "name": "Some course", "postTime": "2017-06-09T13:02:51.994Z", "email": "bozhkov_d@mail.ru" }'
        addReq = self.app.post("/api/course/add/", data=jsonAdd, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        jsonTags = '{ "tagname": "literature", "email": "bozhkov_d@mail.ru" }'
        tagsReq = self.app.post("/api/tags/add/", data=jsonTags, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        tag = loads(tagsReq.data)
        json = '{ "id": "1234567890123450", "tags": [ ' + str(tag["id"]) + ' ], "email": "bozhkov_d@mail.ru" }'
        courseTagReq = self.app.post("/api/course/tags/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        expected = b'{ "OK": true }'
        self.assertTrue(courseTagReq, expected)
    
    def test_get_should_return_list_of_courses(self):
        req = self.app.get("/api/course/", content_type="application/json")
        actual = loads(req.data)
        self.assertTrue(isinstance(actual["courses"], list))
    
    def test_chapters_should_return_list_of_course_chapters(self):
        token = login(self.app)
        authToken = loads(token.data)
        req = self.app.get("/api/course/chapters/1234567890123456/", content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        actual = loads(req.data)
        self.assertTrue(isinstance(actual["chapters"], list))
    
    def test_chapters_should_return_error_if_no_course_found(self):
        token = login(self.app)
        authToken = loads(token.data)
        req = self.app.get("/api/course/chapters/123456789f123456/", content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        expected = b'{"error": "No course found"}'
        self.assertEqual(req.data, expected)