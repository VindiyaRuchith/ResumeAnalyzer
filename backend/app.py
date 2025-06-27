from flask import Flask, request, jsonify
from flask_cors import CORS
from analyzer import analyze_resume
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    # route to check if the backend is running
    return "Flask backend is running"

@app.route("/analyze", methods=["POST"])
def analyze():
    job_role = request.form.get("jobRole")
    skills_raw = request.form.get("skills")
    skills = [s.strip() for s in skills_raw.split(",")]
    file = request.files.get("resume")

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    # Save uploaded file temporarily
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # Run analysis
    result = analyze_resume(filepath, skills)

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=5001)
