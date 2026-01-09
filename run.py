"""
Main entry point for HBnB application
Note: For Part 2, please run: cd part2 && python run.py
"""
from hbnb.app import create_app
import sys
from pathlib import Path

# Add part2 directory to Python path
part2_path = Path(__file__).parent / 'part2'
sys.path.insert(0, str(part2_path))


app = create_app()

if __name__ == '__main__':
    print("Starting HBnB Application (Part 2)...")
    print("API Documentation available at: http://localhost:5000/api/v1/")
    app.run(debug=True)
