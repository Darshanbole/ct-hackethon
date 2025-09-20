from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import datetime
import hashlib
import uuid
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Database initialization
def init_db():
    conn = sqlite3.connect('social_dapp.db')
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            wallet_address TEXT UNIQUE NOT NULL,
            username TEXT UNIQUE,
            email TEXT,
            avatar_url TEXT,
            bio TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_verified BOOLEAN DEFAULT FALSE,
            social_tokens TEXT  -- JSON string for social media tokens
        )
    ''')
    
    # Posts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            content TEXT NOT NULL,
            media_urls TEXT,  -- JSON array of media URLs
            post_type TEXT DEFAULT 'text',  -- text, image, video, nft
            blockchain_hash TEXT,
            cross_platform_status TEXT,  -- JSON of platform posting status
            likes_count INTEGER DEFAULT 0,
            shares_count INTEGER DEFAULT 0,
            comments_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Transactions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            from_wallet TEXT NOT NULL,
            to_wallet TEXT NOT NULL,
            amount REAL NOT NULL,
            transaction_hash TEXT UNIQUE,
            transaction_type TEXT,  -- tip, payment, purchase, savings
            related_post_id INTEGER,
            gas_fee REAL,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (related_post_id) REFERENCES posts (id)
        )
    ''')
    
    # NFT Tickets table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS nft_tickets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_name TEXT NOT NULL,
            event_date TIMESTAMP,
            venue TEXT,
            price REAL,
            total_supply INTEGER,
            remaining_supply INTEGER,
            creator_wallet TEXT,
            nft_contract_address TEXT,
            metadata_uri TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Feedback table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            category TEXT,
            is_anonymous BOOLEAN DEFAULT TRUE,
            user_wallet TEXT,
            verification_hash TEXT,
            upvotes INTEGER DEFAULT 0,
            downvotes INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Savings Pools table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS savings_pools (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pool_name TEXT NOT NULL,
            description TEXT,
            target_amount REAL,
            current_amount REAL DEFAULT 0,
            creator_wallet TEXT,
            participants TEXT,  -- JSON array of participant wallets
            end_date TIMESTAMP,
            pool_type TEXT,  -- goal_based, time_based, rotating
            smart_contract_address TEXT,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Voting Polls table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS voting_polls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            options TEXT,  -- JSON array of voting options
            creator_wallet TEXT,
            eligible_voters TEXT,  -- JSON array or criteria
            votes TEXT,  -- JSON object of wallet -> vote
            start_date TIMESTAMP,
            end_date TIMESTAMP,
            is_blockchain_verified BOOLEAN DEFAULT FALSE,
            smart_contract_address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

# Social Media Integration Functions
def post_to_twitter(content, media_urls=None):
    """Post content to Twitter (placeholder for API integration)"""
    # Would integrate with Twitter API v2
    return {"status": "success", "platform": "twitter", "post_id": f"tw_{uuid.uuid4()}"}

def post_to_instagram(content, media_urls=None):
    """Post content to Instagram (placeholder for API integration)"""
    # Would integrate with Instagram Basic Display API
    return {"status": "success", "platform": "instagram", "post_id": f"ig_{uuid.uuid4()}"}

def post_to_facebook(content, media_urls=None):
    """Post content to Facebook (placeholder for API integration)"""
    # Would integrate with Facebook Graph API
    return {"status": "success", "platform": "facebook", "post_id": f"fb_{uuid.uuid4()}"}

def post_to_youtube(content, media_urls=None):
    """Post content to YouTube (placeholder for API integration)"""
    # Would integrate with YouTube Data API for community posts
    return {"status": "success", "platform": "youtube", "post_id": f"yt_{uuid.uuid4()}"}

def cross_platform_post(content, media_urls=None, platforms=None):
    """Post to multiple social media platforms"""
    if platforms is None:
        platforms = ['twitter', 'instagram', 'facebook', 'youtube']
    
    results = {}
    
    if 'twitter' in platforms:
        results['twitter'] = post_to_twitter(content, media_urls)
    if 'instagram' in platforms:
        results['instagram'] = post_to_instagram(content, media_urls)
    if 'facebook' in platforms:
        results['facebook'] = post_to_facebook(content, media_urls)
    if 'youtube' in platforms:
        results['youtube'] = post_to_youtube(content, media_urls)
    
    return results

# API Routes

@app.route('/api/users/register', methods=['POST'])
def register_user():
    data = request.get_json()
    wallet_address = data.get('wallet_address')
    username = data.get('username')
    email = data.get('email')
    
    conn = sqlite3.connect('social_dapp.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO users (wallet_address, username, email)
            VALUES (?, ?, ?)
        ''', (wallet_address, username, email))
        conn.commit()
        user_id = cursor.lastrowid
        
        return jsonify({
            'success': True,
            'user_id': user_id,
            'message': 'User registered successfully'
        })
    except sqlite3.IntegrityError as e:
        return jsonify({
            'success': False,
            'message': 'User already exists'
        }), 400
    finally:
        conn.close()

@app.route('/api/posts/create', methods=['POST'])
def create_post():
    data = request.get_json()
    content = data.get('content')
    user_wallet = data.get('user_wallet')
    media_urls = data.get('media_urls', [])
    post_type = data.get('post_type', 'text')
    cross_post = data.get('cross_post', True)
    platforms = data.get('platforms', ['twitter', 'instagram', 'facebook', 'youtube'])
    
    conn = sqlite3.connect('social_dapp.db')
    cursor = conn.cursor()
    
    # Get user ID
    cursor.execute('SELECT id FROM users WHERE wallet_address = ?', (user_wallet,))
    user = cursor.fetchone()
    
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404
    
    user_id = user[0]
    
    # Cross-platform posting
    cross_platform_status = {}
    if cross_post:
        cross_platform_status = cross_platform_post(content, media_urls, platforms)
    
    # Create post in database
    cursor.execute('''
        INSERT INTO posts (user_id, content, media_urls, post_type, cross_platform_status)
        VALUES (?, ?, ?, ?, ?)
    ''', (user_id, content, str(media_urls), post_type, str(cross_platform_status)))
    
    conn.commit()
    post_id = cursor.lastrowid
    conn.close()
    
    return jsonify({
        'success': True,
        'post_id': post_id,
        'cross_platform_status': cross_platform_status,
        'message': 'Post created successfully'
    })

@app.route('/api/posts/feed', methods=['GET'])
def get_feed():
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    offset = (page - 1) * limit
    
    conn = sqlite3.connect('social_dapp.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT p.*, u.username, u.avatar_url, u.wallet_address
        FROM posts p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
    ''', (limit, offset))
    
    posts = cursor.fetchall()
    conn.close()
    
    posts_list = []
    for post in posts:
        posts_list.append({
            'id': post[0],
            'content': post[2],
            'media_urls': eval(post[3]) if post[3] else [],
            'post_type': post[4],
            'blockchain_hash': post[5],
            'cross_platform_status': eval(post[6]) if post[6] else {},
            'likes_count': post[7],
            'shares_count': post[8],
            'comments_count': post[9],
            'created_at': post[10],
            'username': post[11],
            'avatar_url': post[12],
            'wallet_address': post[13]
        })
    
    return jsonify({
        'success': True,
        'posts': posts_list,
        'page': page
    })

@app.route('/api/posts', methods=['GET'])
def get_posts():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    offset = (page - 1) * per_page
    
    conn = sqlite3.connect('social_dapp.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT p.*, u.username, u.avatar_url, u.wallet_address
        FROM posts p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
    ''', (per_page, offset))
    
    posts = cursor.fetchall()
    conn.close()
    
    posts_list = []
    for post in posts:
        posts_list.append({
            'id': post[0],
            'content': post[2],
            'media_urls': eval(post[3]) if post[3] else [],
            'post_type': post[4],
            'blockchain_hash': post[5],
            'cross_platform_status': eval(post[6]) if post[6] else {},
            'likes_count': post[7],
            'shares_count': post[8],
            'comments_count': post[9],
            'created_at': post[10],
            'username': post[11],
            'avatar_url': post[12],
            'wallet_address': post[13]
        })
    
    return jsonify({
        'success': True,
        'posts': posts_list,
        'page': page,
        'total_pages': 1,  # You can calculate this based on total count if needed
        'has_more': len(posts_list) == per_page
    })

@app.route('/api/transactions/record', methods=['POST'])
def record_transaction():
    data = request.get_json()
    
    conn = sqlite3.connect('social_dapp.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO transactions (from_wallet, to_wallet, amount, transaction_hash, transaction_type, related_post_id, gas_fee, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data.get('from_wallet'),
        data.get('to_wallet'),
        data.get('amount'),
        data.get('transaction_hash'),
        data.get('transaction_type'),
        data.get('related_post_id'),
        data.get('gas_fee'),
        data.get('status', 'confirmed')
    ))
    
    conn.commit()
    transaction_id = cursor.lastrowid
    conn.close()
    
    return jsonify({
        'success': True,
        'transaction_id': transaction_id,
        'message': 'Transaction recorded successfully'
    })

@app.route('/api/nft-tickets/create', methods=['POST'])
def create_nft_ticket():
    data = request.get_json()
    
    conn = sqlite3.connect('social_dapp.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO nft_tickets (event_name, event_date, venue, price, total_supply, remaining_supply, creator_wallet, nft_contract_address, metadata_uri)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data.get('event_name'),
        data.get('event_date'),
        data.get('venue'),
        data.get('price'),
        data.get('total_supply'),
        data.get('total_supply'),  # remaining_supply starts as total_supply
        data.get('creator_wallet'),
        data.get('nft_contract_address'),
        data.get('metadata_uri')
    ))
    
    conn.commit()
    ticket_id = cursor.lastrowid
    conn.close()
    
    return jsonify({
        'success': True,
        'ticket_id': ticket_id,
        'message': 'NFT ticket created successfully'
    })

@app.route('/api/feedback/submit', methods=['POST'])
def submit_feedback():
    data = request.get_json()
    
    conn = sqlite3.connect('social_dapp.db')
    cursor = conn.cursor()
    
    # Generate verification hash for anonymous feedback
    verification_hash = hashlib.sha256(f"{data.get('content')}{datetime.datetime.now()}".encode()).hexdigest()
    
    cursor.execute('''
        INSERT INTO feedback (content, category, is_anonymous, user_wallet, verification_hash)
        VALUES (?, ?, ?, ?, ?)
    ''', (
        data.get('content'),
        data.get('category'),
        data.get('is_anonymous', True),
        data.get('user_wallet') if not data.get('is_anonymous', True) else None,
        verification_hash
    ))
    
    conn.commit()
    feedback_id = cursor.lastrowid
    conn.close()
    
    return jsonify({
        'success': True,
        'feedback_id': feedback_id,
        'verification_hash': verification_hash,
        'message': 'Feedback submitted successfully'
    })

@app.route('/api/savings-pools/create', methods=['POST'])
def create_savings_pool():
    data = request.get_json()
    
    conn = sqlite3.connect('social_dapp.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO savings_pools (pool_name, description, target_amount, creator_wallet, participants, end_date, pool_type, smart_contract_address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data.get('pool_name'),
        data.get('description'),
        data.get('target_amount'),
        data.get('creator_wallet'),
        str([data.get('creator_wallet')]),  # Creator is first participant
        data.get('end_date'),
        data.get('pool_type'),
        data.get('smart_contract_address')
    ))
    
    conn.commit()
    pool_id = cursor.lastrowid
    conn.close()
    
    return jsonify({
        'success': True,
        'pool_id': pool_id,
        'message': 'Savings pool created successfully'
    })

@app.route('/api/voting/create', methods=['POST'])
def create_voting_poll():
    data = request.get_json()
    
    conn = sqlite3.connect('social_dapp.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO voting_polls (title, description, options, creator_wallet, eligible_voters, start_date, end_date, is_blockchain_verified, smart_contract_address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data.get('title'),
        data.get('description'),
        str(data.get('options')),
        data.get('creator_wallet'),
        str(data.get('eligible_voters', [])),
        data.get('start_date'),
        data.get('end_date'),
        data.get('is_blockchain_verified', False),
        data.get('smart_contract_address')
    ))
    
    conn.commit()
    poll_id = cursor.lastrowid
    conn.close()
    
    return jsonify({
        'success': True,
        'poll_id': poll_id,
        'message': 'Voting poll created successfully'
    })

@app.route('/api/voting/<int:poll_id>/vote', methods=['POST'])
def vote_on_poll(poll_id):
    data = request.get_json()
    user_wallet = data.get('user_wallet')
    vote_option = data.get('vote_option')
    
    conn = sqlite3.connect('social_dapp.db')
    cursor = conn.cursor()
    
    # Get current votes
    cursor.execute('SELECT votes FROM voting_polls WHERE id = ?', (poll_id,))
    poll = cursor.fetchone()
    
    if not poll:
        return jsonify({'success': False, 'message': 'Poll not found'}), 404
    
    current_votes = eval(poll[0]) if poll[0] else {}
    current_votes[user_wallet] = vote_option
    
    # Update votes
    cursor.execute('UPDATE voting_polls SET votes = ? WHERE id = ?', (str(current_votes), poll_id))
    conn.commit()
    conn.close()
    
    return jsonify({
        'success': True,
        'message': 'Vote recorded successfully'
    })

@app.route('/api/feedback/list', methods=['GET'])
def get_feedback():
    conn = sqlite3.connect('social_dapp.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM feedback
        ORDER BY created_at DESC
        LIMIT 50
    ''')
    
    feedback_list = cursor.fetchall()
    conn.close()
    
    feedback_data = []
    for feedback in feedback_list:
        feedback_data.append({
            'id': feedback[0],
            'content': feedback[1],
            'category': feedback[2],
            'is_anonymous': feedback[3],
            'user_wallet': feedback[4],
            'verification_hash': feedback[5],
            'upvotes': feedback[6],
            'downvotes': feedback[7],
            'created_at': feedback[8]
        })
    
    return jsonify({
        'success': True,
        'feedback': feedback_data
    })

@app.route('/api/feedback/<int:feedback_id>/vote', methods=['POST'])
def vote_feedback(feedback_id):
    data = request.get_json()
    vote_type = data.get('vote_type')
    
    conn = sqlite3.connect('social_dapp.db')
    cursor = conn.cursor()
    
    if vote_type == 'upvote':
        cursor.execute('UPDATE feedback SET upvotes = upvotes + 1 WHERE id = ?', (feedback_id,))
    elif vote_type == 'downvote':
        cursor.execute('UPDATE feedback SET downvotes = downvotes + 1 WHERE id = ?', (feedback_id,))
    
    conn.commit()
    conn.close()
    
    return jsonify({
        'success': True,
        'message': 'Vote recorded successfully'
    })

@app.route('/api/nft-tickets/list', methods=['GET'])
def get_nft_tickets():
    conn = sqlite3.connect('social_dapp.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM nft_tickets
        WHERE is_active = TRUE
        ORDER BY event_date ASC
    ''')
    
    tickets = cursor.fetchall()
    conn.close()
    
    tickets_list = []
    for ticket in tickets:
        tickets_list.append({
            'id': ticket[0],
            'event_name': ticket[1],
            'event_date': ticket[2],
            'venue': ticket[3],
            'price': ticket[4],
            'total_supply': ticket[5],
            'remaining_supply': ticket[6],
            'creator_wallet': ticket[7],
            'nft_contract_address': ticket[8],
            'metadata_uri': ticket[9],
            'created_at': ticket[10]
        })
    
    return jsonify({
        'success': True,
        'tickets': tickets_list
    })

@app.route('/api/transactions/payment', methods=['POST'])
def process_payment():
    """Process payment for social media posting"""
    data = request.get_json()
    wallet_address = data.get('wallet_address')
    transaction_hash = data.get('transaction_hash')
    amount = data.get('amount')
    platforms = data.get('platforms', [])
    content = data.get('content')
    
    conn = sqlite3.connect('social_dapp.db')
    cursor = conn.cursor()
    
    # Record payment transaction
    cursor.execute('''
        INSERT INTO transactions (from_wallet, to_wallet, amount, transaction_hash, transaction_type, status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        wallet_address,
        '0x742d35Cc6b3c8D21C04A7b7D7A4DA1E5CF1A9D2E',  # Your receiving address
        amount,
        transaction_hash,
        'social_posting_payment',
        'confirmed'
    ))
    
    conn.commit()
    transaction_id = cursor.lastrowid
    conn.close()
    
    return jsonify({
        'success': True,
        'transaction_id': transaction_id,
        'message': 'Payment processed successfully'
    })

@app.route('/api/social/post', methods=['POST'])
def post_to_social_platform():
    """Post content to a specific social media platform"""
    data = request.get_json()
    platform = data.get('platform')
    content = data.get('content')
    wallet_address = data.get('wallet_address')
    transaction_hash = data.get('transaction_hash')
    
    # Platform charges
    platform_charges = {
        'twitter': 0.001,
        'facebook': 0.001,
        'instagram': 0.0015,
        'linkedin': 0.002,
        'youtube': 0.003
    }
    
    if platform not in platform_charges:
        return jsonify({
            'success': False,
            'error': 'Invalid platform'
        }), 400
    
    conn = sqlite3.connect('social_dapp.db')
    cursor = conn.cursor()
    
    try:
        # Simulate posting to social media platform
        if platform == 'twitter':
            result = post_to_twitter_api(content, wallet_address)
        elif platform == 'facebook':
            result = post_to_facebook_api(content, wallet_address)
        elif platform == 'instagram':
            result = post_to_instagram_api(content, wallet_address)
        elif platform == 'linkedin':
            result = post_to_linkedin_api(content, wallet_address)
        elif platform == 'youtube':
            result = post_to_youtube_api(content, wallet_address)
        
        # Record the post
        cursor.execute('''
            INSERT INTO posts (user_id, content, post_type, cross_platform_status)
            SELECT id, ?, 'cross_platform', ?
            FROM users WHERE wallet_address = ?
        ''', (content, str({platform: result}), wallet_address))
        
        conn.commit()
        post_id = cursor.lastrowid
        conn.close()
        
        return jsonify({
            'success': True,
            'platform': platform,
            'post_id': result.get('post_id'),
            'url': result.get('url'),
            'message': f'Successfully posted to {platform}'
        })
        
    except Exception as e:
        conn.close()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def post_to_twitter_api(content, wallet_address):
    """Post to Twitter (simulated)"""
    # In real implementation, use Twitter API v2
    post_id = f"tw_{uuid.uuid4().hex[:8]}"
    return {
        'post_id': post_id,
        'url': f"https://twitter.com/user/status/{post_id}",
        'platform': 'twitter',
        'timestamp': datetime.datetime.now().isoformat()
    }

def post_to_facebook_api(content, wallet_address):
    """Post to Facebook (simulated)"""
    # In real implementation, use Facebook Graph API
    post_id = f"fb_{uuid.uuid4().hex[:8]}"
    return {
        'post_id': post_id,
        'url': f"https://facebook.com/posts/{post_id}",
        'platform': 'facebook',
        'timestamp': datetime.datetime.now().isoformat()
    }

def post_to_instagram_api(content, wallet_address):
    """Post to Instagram (simulated)"""
    # In real implementation, use Instagram Basic Display API
    post_id = f"ig_{uuid.uuid4().hex[:8]}"
    return {
        'post_id': post_id,
        'url': f"https://instagram.com/p/{post_id}",
        'platform': 'instagram',
        'timestamp': datetime.datetime.now().isoformat()
    }

def post_to_linkedin_api(content, wallet_address):
    """Post to LinkedIn (simulated)"""
    # In real implementation, use LinkedIn API
    post_id = f"li_{uuid.uuid4().hex[:8]}"
    return {
        'post_id': post_id,
        'url': f"https://linkedin.com/posts/{post_id}",
        'platform': 'linkedin',
        'timestamp': datetime.datetime.now().isoformat()
    }

def post_to_youtube_api(content, wallet_address):
    """Post to YouTube Community (simulated)"""
    # In real implementation, use YouTube Data API
    post_id = f"yt_{uuid.uuid4().hex[:8]}"
    return {
        'post_id': post_id,
        'url': f"https://youtube.com/post/{post_id}",
        'platform': 'youtube',
        'timestamp': datetime.datetime.now().isoformat()
    }

@app.route('/api/user/authenticate', methods=['POST'])
def authenticate_user():
    """Authenticate user with email and password"""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    wallet_address = data.get('wallet_address')
    
    # Check against stored credentials
    stored_email = os.getenv('USER_EMAIL', 'darshanbole69@gmail.com')
    stored_password = os.getenv('USER_PASSWORD', 'darshan@987')
    
    if email == stored_email and password == stored_password:
        conn = sqlite3.connect('social_dapp.db')
        cursor = conn.cursor()
        
        # Update or create user record
        cursor.execute('''
            INSERT OR REPLACE INTO users (wallet_address, username, email, is_verified)
            VALUES (?, ?, ?, ?)
        ''', (wallet_address, f"User_{wallet_address[-6:]}", email, True))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'user': {
                'email': email,
                'wallet_address': wallet_address,
                'is_verified': True
            },
            'message': 'Authentication successful'
        })
    else:
        return jsonify({
            'success': False,
            'message': 'Invalid credentials'
        }), 401

@app.route('/api/transactions/history', methods=['GET'])
def get_transaction_history():
    """Get transaction history for a wallet"""
    wallet = request.args.get('wallet')
    
    conn = sqlite3.connect('social_dapp.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM transactions 
        WHERE from_wallet = ? OR to_wallet = ?
        ORDER BY created_at DESC
        LIMIT 50
    ''', (wallet, wallet))
    
    transactions = cursor.fetchall()
    conn.close()
    
    transaction_list = []
    for tx in transactions:
        transaction_list.append({
            'id': tx[0],
            'from_wallet': tx[1],
            'to_wallet': tx[2],
            'amount': tx[3],
            'transaction_hash': tx[4],
            'transaction_type': tx[5],
            'related_post_id': tx[6],
            'gas_fee': tx[7],
            'status': tx[8],
            'created_at': tx[9]
        })
    
    return jsonify({
        'success': True,
        'transactions': transaction_list
    })

@app.route('/api/nft-tickets/purchase', methods=['POST'])
def purchase_nft_ticket():
    data = request.get_json()
    
    conn = sqlite3.connect('social_dapp.db')
    cursor = conn.cursor()
    
    # Update remaining supply
    cursor.execute('''
        UPDATE nft_tickets 
        SET remaining_supply = remaining_supply - 1 
        WHERE id = ? AND remaining_supply > 0
    ''', (data.get('event_id'),))
    
    # Record transaction
    cursor.execute('''
        INSERT INTO transactions (from_wallet, to_wallet, amount, transaction_hash, transaction_type, related_post_id, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        data.get('buyer_wallet'),
        'platform_wallet',  # Platform or event creator wallet
        data.get('amount_paid'),
        data.get('transaction_hash'),
        'nft_purchase',
        data.get('event_id'),
        'confirmed'
    ))
    
    conn.commit()
    conn.close()
    
    return jsonify({
        'success': True,
        'message': 'Ticket purchased successfully'
    })

@app.route('/api/nft-tickets/my-tickets', methods=['GET'])
def get_my_tickets():
    wallet = request.args.get('wallet')
    
    conn = sqlite3.connect('social_dapp.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT nt.* FROM nft_tickets nt
        JOIN transactions t ON nt.id = t.related_post_id
        WHERE t.from_wallet = ? AND t.transaction_type = 'nft_purchase'
        ORDER BY nt.event_date ASC
    ''', (wallet,))
    
    tickets = cursor.fetchall()
    conn.close()
    
    tickets_list = []
    for ticket in tickets:
        tickets_list.append({
            'id': ticket[0],
            'event_name': ticket[1],
            'event_date': ticket[2],
            'venue': ticket[3],
            'price': ticket[4],
            'total_supply': ticket[5],
            'remaining_supply': ticket[6],
            'creator_wallet': ticket[7],
            'nft_contract_address': ticket[8],
            'metadata_uri': ticket[9],
            'created_at': ticket[10]
        })
    
    return jsonify({
        'success': True,
        'tickets': tickets_list
    })

@app.route('/api/savings-pools/list', methods=['GET'])
def get_savings_pools():
    conn = sqlite3.connect('social_dapp.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM savings_pools
        WHERE is_active = TRUE
        ORDER BY created_at DESC
    ''')
    
    pools = cursor.fetchall()
    conn.close()
    
    pools_list = []
    for pool in pools:
        pools_list.append({
            'id': pool[0],
            'pool_name': pool[1],
            'description': pool[2],
            'target_amount': pool[3],
            'current_amount': pool[4],
            'creator_wallet': pool[5],
            'participants': pool[6],
            'end_date': pool[7],
            'pool_type': pool[8],
            'smart_contract_address': pool[9],
            'is_active': pool[10],
            'created_at': pool[11]
        })
    
    return jsonify({
        'success': True,
        'pools': pools_list
    })

@app.route('/api/savings-pools/join', methods=['POST'])
def join_savings_pool():
    data = request.get_json()
    pool_id = data.get('pool_id')
    participant_wallet = data.get('participant_wallet')
    contribution_amount = data.get('contribution_amount')
    
    conn = sqlite3.connect('social_dapp.db')
    cursor = conn.cursor()
    
    # Get current pool data
    cursor.execute('SELECT participants, current_amount FROM savings_pools WHERE id = ?', (pool_id,))
    pool_data = cursor.fetchone()
    
    if pool_data:
        current_participants = eval(pool_data[0]) if pool_data[0] else []
        current_amount = pool_data[1] or 0
        
        if participant_wallet not in current_participants:
            current_participants.append(participant_wallet)
        
        new_amount = current_amount + contribution_amount
        
        # Update pool
        cursor.execute('''
            UPDATE savings_pools 
            SET participants = ?, current_amount = ?
            WHERE id = ?
        ''', (str(current_participants), new_amount, pool_id))
        
        # Record transaction
        cursor.execute('''
            INSERT INTO transactions (from_wallet, to_wallet, amount, transaction_hash, transaction_type, related_post_id, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            participant_wallet,
            'pool_wallet',
            contribution_amount,
            data.get('transaction_hash'),
            'pool_contribution',
            pool_id,
            'confirmed'
        ))
        
        conn.commit()
    
    conn.close()
    
    return jsonify({
        'success': True,
        'message': 'Successfully joined pool'
    })

@app.route('/api/voting/list', methods=['GET'])
def get_voting_polls():
    conn = sqlite3.connect('social_dapp.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM voting_polls
        ORDER BY created_at DESC
    ''')
    
    polls = cursor.fetchall()
    conn.close()
    
    polls_list = []
    for poll in polls:
        polls_list.append({
            'id': poll[0],
            'title': poll[1],
            'description': poll[2],
            'options': poll[3],
            'creator_wallet': poll[4],
            'eligible_voters': poll[5],
            'votes': poll[6],
            'start_date': poll[7],
            'end_date': poll[8],
            'is_blockchain_verified': poll[9],
            'smart_contract_address': poll[10],
            'created_at': poll[11]
        })
    
    return jsonify({
        'success': True,
        'polls': polls_list
    })

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)