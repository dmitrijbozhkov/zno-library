""" Tests for chapter """
import os
import unittest
from app import app, user_datastore
from database.models import db
from auth_module.auth_routes import auth
from api_module.chapter_routes import chapter_blueprint
from api_module.course_routes import course_blueprint
from json import loads

app.config["TESTING"] = True
app.config["LOGIN_DISABLED"] = True
app.register_blueprint(auth)
app.register_blueprint(chapter_blueprint)
app.register_blueprint(course_blueprint)

# def test_add_should_return_error_if_no_name_field(self):
#         login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
#         token = self.app.post("/auth/login/", data=login, content_type="application/json")
#         authToken = loads(token.data)
#         json = '{ "email": "mymail@gmail.com", "name": "This is course", "contents": "Some contents", "course": "1234567890123456", "previous": null }'
#         expected = b'{"error": "No proper role"}'
#         req = self.app.post("/api/chapter/add/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
#         self.assertEqual(req.data, expected)

def login(client):
    login = '{ "email": "bozhkov_d@mail.ru", "password": "pass1234" }'
    return client.post("/auth/login/", data=login, content_type="application/json")

def add_default_course(client, token):
    json = '{ "id": "aasdfghjklqwerty1", "name": "Some course", "postTime": "2017-06-09T13:02:51.994Z", "email": "bozhkov_d@mail.ru" }'
    return client.post("/api/course/add/", data=json, content_type="application/json", headers={ "Authentication-Token": token })

def delete_default_course(client, token):
    json = '{ "id": "aasdfghjklqwerty1", "email": "bozhkov_d@mail.ru" }'
    return client.delete("/api/course/delete/", data=json, content_type="application/json", headers={ "Authentication-Token": token })

class ChapterTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        token = login(self.app)
        authToken = loads(token.data)
        add_default_course(self.app, authToken["token"])

    def tearDown(self):
        token = login(self.app)
        authToken = loads(token.data)
        delete_default_course(self.app, authToken["token"])
    
    def test_add_should_return_error_if_no_teacher_role(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "email": "mymail@gmail.com" }'
        expected = b'{"error": "No proper role"}'
        req = self.app.post("/api/chapter/add/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)

    def test_add_should_return_error_if_no_name_field(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "email": "bozhkov_d@mail.ru", "contents": "Some contents", "course": "1234567890123456", "previous": null }'
        expected = b'{"error": "No name field"}'
        req = self.app.post("/api/chapter/add/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_add_should_return_error_if_no_contents_field(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "email": "bozhkov_d@mail.ru", "name": "This is course", "course": "1234567890123456", "previous": null }'
        expected = b'{"error": "No contents field"}'
        req = self.app.post("/api/chapter/add/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_add_should_return_error_if_no_course_field(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "email": "bozhkov_d@mail.ru", "contents": "Some contents", "name": "This is course", "previous": null }'
        expected = b'{"error": "No course field"}'
        req = self.app.post("/api/chapter/add/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_add_should_return_error_if_no_previous_field(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "email": "bozhkov_d@mail.ru", "contents": "Some contents", "name": "This is course", "course": "1234567890123456" }'
        expected = b'{"error": "No previous field"}'
        req = self.app.post("/api/chapter/add/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_add_should_return_error_if_no_course_found(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "email": "bozhkov_d@mail.ru", "contents": "Some contents", "name": "This is course", "course": "1234567890123456", "previous": null }'
        expected = b'{"error": "No course found"}'
        req = self.app.post("/api/chapter/add/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        self.assertEqual(req.data, expected)
    
    def test_add_should_return_id_if_chapter_added(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "email": "bozhkov_d@mail.ru", "contents": "Some contents", "name": "This is course", "course": "aasdfghjklqwerty1", "previous": null }'
        req = self.app.post("/api/chapter/add/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        actual = loads(req.data)
        self.assertTrue(isinstance(actual["id"], str))
    
    def test_patch_should_return_error_if_no_name_field(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "email": "bozhkov_d@mail.ru", "contents": "Some contents", "course": "aasdfghjklqwerty1", "previous": null, "next": "" }'
        req = self.app.post("/api/chapter/patch/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        expected = b'{"error": "No name field"}'
        self.assertEqual(req.data, expected)
    
    def test_patch_should_return_error_if_no_course_field(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "email": "bozhkov_d@mail.ru", "contents": "Some contents", "name": "This is course", "previous": null, "next": "" }'
        req = self.app.post("/api/chapter/patch/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        expected = b'{"error": "No course field"}'
        self.assertEqual(req.data, expected)
    
    def test_patch_should_return_error_if_no_contents_field(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "email": "bozhkov_d@mail.ru", "name": "This is course", "course": "aasdfghjklqwerty1", "previous": null, "next": "" }'
        req = self.app.post("/api/chapter/patch/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        expected = b'{"error": "No contents field"}'
        self.assertEqual(req.data, expected)
    
    def test_patch_should_return_error_if_no_previous_field(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "email": "bozhkov_d@mail.ru", "contents": "Some contents", "name": "This is course", "course": "aasdfghjklqwerty1", "next": "" }'
        req = self.app.post("/api/chapter/patch/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        expected = b'{"error": "No previous field"}'
        self.assertEqual(req.data, expected)
    
    def test_patch_should_return_error_if_no_next_field(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "email": "bozhkov_d@mail.ru", "contents": "Some contents", "name": "This is course", "course": "aasdfghjklqwerty1", "previous": null }'
        req = self.app.post("/api/chapter/patch/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        expected = b'{"error": "No next field"}'
        self.assertEqual(req.data, expected)
    
    def test_patch_should_return_error_if_previous_and_next_are_empty(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "email": "bozhkov_d@mail.ru", "contents": "Some contents", "name": "This is course", "course": "aasdfghjklqwerty1", "previous": null, "next": null }'
        req = self.app.post("/api/chapter/patch/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        expected = b'{"error": "Either previous or next should not be empty"}'
        self.assertEqual(req.data, expected)

    def test_patch_should_add_chapter_to_head_if_no_previous(self):
        token = login(self.app)
        authToken = loads(token.data)
        jsonHead = '{ "email": "bozhkov_d@mail.ru", "contents": "Some contents", "name": "This is course", "course": "aasdfghjklqwerty1", "previous": null }'
        reqHead = self.app.post("/api/chapter/add/", data=jsonHead, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        head = loads(reqHead.data)
        json = '{ "email": "bozhkov_d@mail.ru", "contents": "Some contents", "name": "This is course", "course": "aasdfghjklqwerty1", "previous": null, "next": "' + head["id"] +'" }'
        req = self.app.post("/api/chapter/patch/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        actual = loads(req.data)
        res = self.app.get("/api/chapter/" + actual["id"] + "/", content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        chapters = loads(res.data)
        self.assertEqual(chapters["next"], head["id"])
    
    def test_patch_should_add_chapter_between_chapters_if_previous_next_set(self):
        token = login(self.app)
        authToken = loads(token.data)
        jsonHead = '{ "email": "bozhkov_d@mail.ru", "contents": "Some contents", "name": "This is course", "course": "aasdfghjklqwerty1", "previous": null }'
        reqHead = self.app.post("/api/chapter/add/", data=jsonHead, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        head = loads(reqHead.data)
        jsonTail = '{ "email": "bozhkov_d@mail.ru", "contents": "Some contents", "name": "This is course", "course": "aasdfghjklqwerty1", "previous": "' + head["id"] +'" }'
        reqTail = self.app.post("/api/chapter/add/", data=jsonTail, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        tail = loads(reqTail.data)
        json = '{ "email": "bozhkov_d@mail.ru", "contents": "Some contents", "name": "This is course", "course": "aasdfghjklqwerty1", "previous": "' + head["id"] +'", "next": "' + tail["id"] +'" }'
        req = self.app.post("/api/chapter/patch/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        actual = loads(req.data)
        res = self.app.get("/api/chapter/" + actual["id"] + "/", content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        chapters = loads(res.data)
        self.assertEqual(chapters["next"], tail["id"])
        self.assertEqual(chapters["previous"], head["id"])
    
    def test_delete_should_return_error_if_no_teacher_role(self):
        token = login(self.app)
        authToken = loads(token.data)
        jsonAdd = '{ "email": "bozhkov_d@mail.ru", "contents": "Some contents", "name": "This is course", "course": "aasdfghjklqwerty1", "previous": null }'
        reqAdd = self.app.post("/api/chapter/add/", data=jsonAdd, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        res = loads(reqAdd.data)
        json = '{ "id": "' + res["id"] + '", "email": "mymail@gmail.com" }'
        req = self.app.delete("/api/chapter/delete/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        expected = b'{"error": "No proper role"}'
        self.assertEqual(req.data, expected)
    
    def test_delete_should_return_error_if_no_id_field(self):
        token = login(self.app)
        authToken = loads(token.data)
        json = '{ "email": "bozhkov_d@mail.ru" }'
        req = self.app.delete("/api/chapter/delete/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        expected = b'{"error": "No id field"}'
        self.assertEqual(req.data, expected)

    def test_delete_should_return_response_if_chapter_deleted(self):
        token = login(self.app)
        authToken = loads(token.data)
        jsonAdd = '{ "email": "bozhkov_d@mail.ru", "contents": "Some contents", "name": "This is course", "course": "aasdfghjklqwerty1", "previous": null }'
        reqAdd = self.app.post("/api/chapter/add/", data=jsonAdd, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        res = loads(reqAdd.data)
        json = '{ "id": "' + res["id"] + '", "email": "bozhkov_d@mail.ru" }'
        req = self.app.delete("/api/chapter/delete/", data=json, content_type="application/json", headers={ "Authentication-Token": authToken["token"] })
        expected = b'{"OK": true}'
        self.assertEqual(req.data, expected)