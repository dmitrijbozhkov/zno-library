import os
import unittest
from app import app, user_datastore
from database.models import db
from auth_module.auth_routes import auth
from database.setup import init_db
from json import dumps

app.config["TESTING"] = True
app.register_blueprint(auth)

class AuthTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_create_should_return_error_if_no_field(self):
        json = '{ "email": "mymail@gmail.com", "password": "pass1234", "name": "ivan", "surname": "ivanov" }'
        expected = b'{"error": "No lastName field"}'
        req = self.app.post("/auth/create/", data=json, content_type="application/json")
        self.assertEqual(req.data, expected)

    def test_create_should_return_error_if_email_wrong(self):
        json = '{ "email": "mymailgmail.com", "password": "pass1234", "name": "ivan", "surname": "ivanov", "lastName": "ivanovich" }'
        expected = b'{"error": "Email is incorrect"}'
        req = self.app.post("/auth/create/", data=json, content_type="application/json")
        self.assertEqual(req.data, expected)
    
    def test_create_should_return_error_if_password_wrong(self):
        json = '{ "email": "mymail@gmail.com", "password": "pass@34234", "name": "ivan", "surname": "ivanov", "lastName": "ivanovich" }'
        expected = b'{"error": "Password is incorrect"}'
        req = self.app.post("/auth/create/", data=json, content_type="application/json")
        self.assertEqual(req.data, expected)
    
    def test_create_should_return_error_if_name_wrong(self):
        json = '{ "email": "mymail@gmail.com", "password": "pass34234", "name": "1235", "surname": "ivanov", "lastName": "ivanovich" }'
        expected = b'{"error": "Name is incorrect"}'
        req = self.app.post("/auth/create/", data=json, content_type="application/json")
        self.assertEqual(req.data, expected)
    
    def test_create_should_return_error_if_surname_wrong(self):
        json = '{ "email": "mymail@gmail.com", "password": "pass34234", "name": "ivan", "surname": "1234", "lastName": "ivanovich" }'
        expected = b'{"error": "Surname is incorrect"}'
        req = self.app.post("/auth/create/", data=json, content_type="application/json")
        self.assertEqual(req.data, expected)
    
    def test_create_should_return_error_if_lastName_wrong(self):
        json = '{ "email": "mymail@gmail.com", "password": "pass34234", "name": "ivan", "surname": "ivanov", "lastName": "123456" }'
        expected = b'{"error": "Last name is incorrect"}'
        req = self.app.post("/auth/create/", data=json, content_type="application/json")
        self.assertEqual(req.data, expected)
    
    def test_create_should_return_error_if_user_exists(self):
        json = '{ "email": "bozhkov_d@mail.ru", "password": "pass34234", "name": "ivan", "surname": "ivanov", "lastName": "ivanovich" }'
        expected = b'{"error": "User already exists"}'
        req = self.app.post("/auth/create/", data=json, content_type="application/json")
        self.assertEqual(req.data, expected)
    
    def test_create_should_return_ok_if_new_user_created(self):
        json = '{ "email": "mymail@gmail.com", "password": "pass1234", "name": "ivan", "surname": "ivanov", "lastName": "ivanovich" }'
        expected = b'{"reponse": "OK"}'
        req = self.app.post("/auth/create/", data=json, content_type="application/json")
        self.assertEqual(req.data, expected)

    def test_log_in_should_return_error_if_email_wrong(self):
        json = '{ "email": "mymail@gmailcom", "password": "pass1234", "remember_me": false }'
        expected = b'{"error": "Email is incorrect"}'
        req = self.app.post("/auth/login/", data=json, content_type="application/json")
        self.assertEqual(req.data, expected)
    
    def test_log_in_should_return_error_if_password_wrong(self):
        json = '{ "email": "mymail@gmail.com", "password": "pas", "remember_me": false }'
        expected = b'{"error": "Password is incorrect"}'
        req = self.app.post("/auth/login/", data=json, content_type="application/json")
        self.assertEqual(req.data, expected)

    def test_log_in_should_return_error_if_no_field(self):
        json = '{ "email": "mymail@gmail.com", "remember_me": false }'
        expected = b'{"error": "No password field"}'
        req = self.app.post("/auth/login/", data=json, content_type="application/json")
        self.assertEqual(req.data, expected)
    
    def test_log_in_should_return_error_if_email_not_found(self):
        json = '{ "email": "wrong@gmail.com", "password": "pass1234", "remember_me": false }'
        expected = b'{"error": "Password or email is wrong"}'
        req = self.app.post("/auth/login/", data=json, content_type="application/json")
        self.assertEqual(req.data, expected)
    
    def test_log_in_should_return_error_if_password_wrong(self):
        json = '{ "email": "mymail@gmail.com", "password": "pass12345", "remember_me": false }'
        expected = b'{"error": "Password or email is wrong"}'
        req = self.app.post("/auth/login/", data=json, content_type="application/json")
        self.assertEqual(req.data, expected)
    
    def test_log_in_should_return_token_if_email_password_correct(self):
        json = '{ "email": "mymail@gmail.com", "password": "pass1234", "remember_me": false }'
        req = self.app.post("/auth/login/", data=json, content_type="application/json")
        token = req.data.decode("utf-8")
        self.assertTrue(isinstance(token, str))
    
    def test_log_in_should_set_cookie_expires_if_remember_me_true(self):
        json = '{ "email": "mymail@gmail.com", "password": "pass1234", "remember_me": true }'
        req = self.app.post("/auth/login/", data=json, content_type="application/json")
        self.assertTrue("Expires" in req.headers["Set-Cookie"])
    
    def test_log_in_should_set_cookie_if_remember_me_false(self):
        json = '{ "email": "mymail@gmail.com", "password": "pass1234", "remember_me": false }'
        req = self.app.post("/auth/login/", data=json, content_type="application/json")
        self.assertFalse("Expires" in req.headers["Set-Cookie"])

if __name__ == "__main__":
    unittest.main()