import os
import hmac
import hashlib
import time
import secrets
import string
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from fastapi import HTTPException, Request, Depends
import argon2
import bcrypt
from .database import get_db

SECRET_KEY = os.environ.get("SESSION_SECRET", "ctf-super-secret-auth-key-2026-production")

# Initialize Argon2id hasher
try:
    _argon2_hasher = argon2.PasswordHasher(
        time_cost=2,
        memory_cost=65536,
        parallelism=2,
        hash_len=32,
        type=argon2.Type.ID
    )
except Exception:
    _argon2_hasher = argon2.PasswordHasher()

def hash_password(password: str) -> str:
    """Hashes password using Argon2id with automatic bcrypt fallback."""
    try:
        return _argon2_hasher.hash(password)
    except Exception:
        salt = bcrypt.gensalt(rounds=12)
        return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(password: str, hashed: str) -> bool:
    """Verifies a password against an Argon2id or bcrypt hash."""
    if not password or not hashed:
        return False
    if hashed.startswith("$argon2"):
        try:
            return _argon2_hasher.verify(hashed, password)
        except Exception:
            return False
    elif hashed.startswith("$2b$") or hashed.startswith("$2a$"):
        try:
            return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))
        except Exception:
            return False
    return False

def generate_deterministic_password(team_name: str, length: int = 16) -> str:
    """
    Generates a deterministic, cryptographically secure password for a team name using HMAC-SHA256.
    Ensures team credentials remain consistent across all serverless containers and cold starts.
    Includes uppercase, lowercase, numbers, and symbols.
    """
    clean_name = team_name.lower().strip()
    key_bytes = SECRET_KEY.encode("utf-8")
    data_bytes = f"ctf_team_pwd:{clean_name}".encode("utf-8")
    digest = hmac.new(key_bytes, data_bytes, hashlib.sha256).digest()

    alphabet_upper = string.ascii_uppercase
    alphabet_lower = string.ascii_lowercase
    alphabet_digits = string.digits
    alphabet_symbols = "!?@_"

    c_upper = alphabet_upper[digest[0] % len(alphabet_upper)]
    c_lower = alphabet_lower[digest[1] % len(alphabet_lower)]
    c_digit = alphabet_digits[digest[2] % len(alphabet_digits)]
    c_sym = alphabet_symbols[digest[3] % len(alphabet_symbols)]

    full_alphabet = string.ascii_letters + string.digits + "!?@_"
    chars = [c_upper, c_lower, c_digit, c_sym]
    for i in range(4, length):
        chars.append(full_alphabet[digest[i % len(digest)] % len(full_alphabet)])

    for i in range(len(chars) - 1, 0, -1):
        j = digest[(i + 7) % len(digest)] % (i + 1)
        chars[i], chars[j] = chars[j], chars[i]

    return "".join(chars)

def generate_secure_password(length: int = 16) -> str:
    """
    Generates a cryptographically secure random password.
    Contains uppercase, lowercase, digits, and allowed symbols (!, ?, @, _).
    Guarantees at least one character from each required character group.
    """
    alphabet = string.ascii_letters + string.digits + "!?@_"
    while True:
        pwd = "".join(secrets.choice(alphabet) for _ in range(length))
        has_upper = any(c.isupper() for c in pwd)
        has_lower = any(c.islower() for c in pwd)
        has_digit = any(c.isdigit() for c in pwd)
        has_symbol = any(c in "!?@_" for c in pwd)
        if has_upper and has_lower and has_digit and has_symbol:
            return pwd


def create_admin_token(admin_id: int, username: str) -> str:
    """Creates a cryptographically signed, stateless session token for administrators."""
    timestamp = int(time.time())
    payload = f"admin:{admin_id}:{username}:{timestamp}"
    sig = hmac.new(SECRET_KEY.encode(), payload.encode(), hashlib.sha256).hexdigest()
    return f"{payload}:{sig}"

def verify_admin_signed_token(token: str) -> Optional[Dict[str, Any]]:
    """Verifies a cryptographically signed admin session token without database dependency."""
    try:
        parts = token.split(":")
        if len(parts) != 5 or parts[0] != "admin":
            return None
        _, admin_id_str, username, timestamp_str, sig = parts
        payload = f"admin:{admin_id_str}:{username}:{timestamp_str}"
        expected_sig = hmac.new(SECRET_KEY.encode(), payload.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected_sig):
            return None
        # Valid for 7 days
        if time.time() - int(timestamp_str) > 604800:
            return None
        return {
            "id": int(admin_id_str),
            "admin_id": int(admin_id_str),
            "username": username,
            "session_id": "signed_admin_session"
        }
    except Exception:
        return None

def create_team_token(team_id: int, team_name: str) -> str:
    """Creates a cryptographically signed session token for contestants."""
    timestamp = int(time.time())
    payload = f"team:{team_id}:{team_name}:{timestamp}"
    sig = hmac.new(SECRET_KEY.encode(), payload.encode(), hashlib.sha256).hexdigest()
    return f"{payload}:{sig}"

def verify_team_signed_token(token: str) -> Optional[Dict[str, Any]]:
    """Verifies a cryptographically signed contestant session token."""
    try:
        parts = token.split(":")
        if len(parts) != 5 or parts[0] != "team":
            return None
        _, team_id_str, team_name, timestamp_str, sig = parts
        payload = f"team:{team_id_str}:{team_name}:{timestamp_str}"
        expected_sig = hmac.new(SECRET_KEY.encode(), payload.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected_sig):
            return None
        if time.time() - int(timestamp_str) > 86400:
            return None
        return {
            "id": int(team_id_str),
            "team_id": int(team_id_str),
            "team_name": team_name
        }
    except Exception:
        return None

def extract_token_from_request(request: Request, cookie_name: str = "ctf_session") -> Optional[str]:
    """Extracts session token from Authorization: Bearer <token> or HttpOnly cookie."""
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header[7:].strip()
        if token:
            return token
    return request.cookies.get(cookie_name)

def get_current_team(request: Request) -> Dict[str, Any]:
    """
    Dependency that extracts, verifies, and returns the authenticated team dictionary.
    Enforces active session ownership and session validity.
    """
    token = extract_token_from_request(request, cookie_name="ctf_session")
    if not token:
        raise HTTPException(status_code=401, detail="Authentication required. No session token provided.")

    now_iso = datetime.now(timezone.utc).isoformat()

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT s.id AS session_id, s.team_id, s.active AS session_active,
                   t.id, t.team_name, t.member1_name, t.member2_name,
                   t.registered_at, t.quiz_started_at, t.quiz_submitted_at,
                   t.submission_reason, t.score, t.active_session_id, t.active_tab_id, t.allow_relogin
            FROM sessions s
            JOIN teams t ON s.team_id = t.id
            WHERE s.session_token = ? AND s.active = 1
        """, (token,))
        row = cursor.fetchone()

        if not row:
            # Fallback check for signed token
            signed = verify_team_signed_token(token)
            if signed:
                cursor.execute("""
                    SELECT id, team_name, member1_name, member2_name,
                           registered_at, quiz_started_at, quiz_submitted_at,
                           submission_reason, score, active_session_id, active_tab_id, allow_relogin
                    FROM teams WHERE id = ?
                """, (signed["id"],))
                team_row = cursor.fetchone()
                if not team_row:
                    cursor.execute("""
                        INSERT OR IGNORE INTO teams (
                            id, team_name, team_name_lower, password_hash,
                            member1_name, registered_at, login_used, allow_relogin
                        ) VALUES (?, ?, ?, ?, ?, ?, 1, 0);
                    """, (
                        signed["id"],
                        signed["team_name"],
                        signed["team_name"].lower(),
                        hash_password(generate_deterministic_password(signed["team_name"])),
                        "Contestant",
                        now_iso
                    ))
                    cursor.execute("""
                        SELECT id, team_name, member1_name, member2_name,
                               registered_at, quiz_started_at, quiz_submitted_at,
                               submission_reason, score, active_session_id, active_tab_id, allow_relogin
                        FROM teams WHERE id = ?
                    """, (signed["id"],))
                    team_row = cursor.fetchone()

                if team_row:
                    team = dict(team_row)
                    team["session_id"] = "signed_session"
                    team["session_active"] = 1
                    return team
            raise HTTPException(status_code=401, detail="Invalid or expired session. Please log in again.")

        team = dict(row)

        # Update last activity timestamp
        cursor.execute("UPDATE sessions SET last_activity = ? WHERE session_token = ?", (now_iso, token))

        return team

def get_current_admin(request: Request) -> Dict[str, Any]:
    """
    Dependency that extracts, verifies, and returns the authenticated admin dictionary.
    Supports both stateless signed tokens (across serverless lambdas) and database sessions.
    """
    token = extract_token_from_request(request, cookie_name="ctf_admin_session")
    if not token:
        raise HTTPException(status_code=401, detail="Administrator authentication required.")

    # 1. First, check cryptographically signed token (100% resilient across serverless lambdas)
    signed_admin = verify_admin_signed_token(token)
    if signed_admin:
        return signed_admin

    # 2. Fallback to database lookup
    now_iso = datetime.now(timezone.utc).isoformat()
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT s.id AS session_id, s.admin_id, a.id, a.username
            FROM admin_sessions s
            JOIN admins a ON s.admin_id = a.id
            WHERE s.session_token = ? AND s.active = 1
        """, (token,))
        row = cursor.fetchone()

        if not row:
            raise HTTPException(status_code=401, detail="Invalid or expired administrator session.")

        admin = dict(row)
        try:
            cursor.execute("UPDATE admin_sessions SET last_activity = ? WHERE session_token = ?", (now_iso, token))
        except Exception:
            pass
        return admin
