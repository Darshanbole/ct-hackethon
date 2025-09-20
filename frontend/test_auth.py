import requests
import json

# Test the authentication endpoint
url = 'http://localhost:5000/api/user/authenticate'
data = {
    'email': 'darshanbole69@gmail.com',
    'password': 'darshan@987',
    'wallet_address': 'test_wallet_123'
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")