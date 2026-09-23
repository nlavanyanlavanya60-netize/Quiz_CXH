import sys
import os

# Ensure backend/ is in the Python path so `from app.main import app` works
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
