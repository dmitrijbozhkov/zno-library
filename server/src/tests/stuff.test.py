from api_routes import api
from app import app
import unittest

class ApiTestCase(unittest.TestCase):
    def setUp(self):
        app.config["TESTING"] = True
        self.app = app.test_client()
        with app.app_context():
            app.init_db()
print(api)