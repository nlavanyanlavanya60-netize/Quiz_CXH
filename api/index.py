import sys
import os

# Add root directory and backend directory to sys.path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT_DIR)
sys.path.insert(0, os.path.join(ROOT_DIR, "backend"))

try:
    from backend.app.main import app
except ImportError:
    from app.main import app
