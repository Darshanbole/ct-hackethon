import sqlite3
import json
from datetime import datetime

# Connect to database
conn = sqlite3.connect('backend/social_dapp.db')
cursor = conn.cursor()

# First, add a sample user if not exists
cursor.execute('''
    INSERT OR IGNORE INTO users (wallet_address, username, email, avatar_url, bio, is_verified)
    VALUES (?, ?, ?, ?, ?, ?)
''', (
    'demo_wallet_123',
    'demouser',
    'darshanbole69@gmail.com',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    'Demo user for testing',
    True
))

user_id = cursor.lastrowid
if user_id == 0:  # User already exists, get the ID
    cursor.execute('SELECT id FROM users WHERE email = ?', ('darshanbole69@gmail.com',))
    result = cursor.fetchone()
    if result:
        user_id = result[0]
    else:
        user_id = 1  # Default to 1 if not found

# Add sample posts
sample_posts = [
    {
        'content': 'Just built an amazing dApp on Shardeum! The transaction speed is incredible 🚀 #Web3 #Blockchain #Shardeum',
        'post_type': 'text',
        'media_urls': '[]',
        'cross_platform_status': '{"twitter": "posted", "linkedin": "posted"}',
        'likes_count': 12,
        'shares_count': 3,
        'comments_count': 5
    },
    {
        'content': 'Check out this amazing NFT collection I just minted! The future of digital art is here 🎨✨',
        'post_type': 'text',
        'media_urls': '["https://example.com/nft1.jpg"]',
        'cross_platform_status': '{"instagram": "posted", "twitter": "posted"}',
        'likes_count': 25,
        'shares_count': 8,
        'comments_count': 12
    },
    {
        'content': 'DeFi is revolutionizing traditional finance. What are your thoughts on the latest yield farming strategies? 💰',
        'post_type': 'text',
        'media_urls': '[]',
        'cross_platform_status': '{"linkedin": "posted"}',
        'likes_count': 18,
        'shares_count': 5,
        'comments_count': 9
    },
    {
        'content': 'Excited to share my latest Web3 project built with React and smart contracts! Open source on GitHub 👨‍💻',
        'post_type': 'text',
        'media_urls': '[]',
        'cross_platform_status': '{"github": "posted", "twitter": "posted"}',
        'likes_count': 31,
        'shares_count': 15,
        'comments_count': 7
    },
    {
        'content': 'Attending the biggest blockchain conference of the year! Networking with amazing developers and entrepreneurs 🌟',
        'post_type': 'text',
        'media_urls': '[]',
        'cross_platform_status': '{"linkedin": "posted", "instagram": "posted"}',
        'likes_count': 42,
        'shares_count': 22,
        'comments_count': 18
    }
]

for post in sample_posts:
    cursor.execute('''
        INSERT INTO posts (user_id, content, media_urls, post_type, cross_platform_status, likes_count, shares_count, comments_count, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        user_id,
        post['content'],
        post['media_urls'],
        post['post_type'],
        post['cross_platform_status'],
        post['likes_count'],
        post['shares_count'],
        post['comments_count'],
        datetime.now()
    ))

conn.commit()
conn.close()

print("Sample posts added successfully!")