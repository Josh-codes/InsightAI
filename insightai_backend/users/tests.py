from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from .models import User


class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('auth-register')
        self.login_url = reverse('auth-login')
        self.me_url = reverse('auth-me')
        self.user_data = {'email': 'test@example.com', 'name': 'Test User', 'password': 'securepass123'}

    def test_register_success(self):
        res = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(res.status_code, 201)
        self.assertIn('token', res.data['data'])
        self.assertEqual(res.data['data']['user']['email'], 'test@example.com')

    def test_register_duplicate_email(self):
        self.client.post(self.register_url, self.user_data, format='json')
        res = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(res.status_code, 400)

    def test_login_success(self):
        self.client.post(self.register_url, self.user_data, format='json')
        res = self.client.post(self.login_url, {'email': 'test@example.com', 'password': 'securepass123'}, format='json')
        self.assertEqual(res.status_code, 200)
        self.assertIn('token', res.data['data'])

    def test_login_wrong_password(self):
        self.client.post(self.register_url, self.user_data, format='json')
        res = self.client.post(self.login_url, {'email': 'test@example.com', 'password': 'wrongpass'}, format='json')
        self.assertEqual(res.status_code, 401)

    def test_me_authenticated(self):
        reg = self.client.post(self.register_url, self.user_data, format='json')
        token = reg.data['data']['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        res = self.client.get(self.me_url)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['data']['email'], 'test@example.com')

    def test_me_unauthenticated(self):
        res = self.client.get(self.me_url)
        self.assertEqual(res.status_code, 403)
