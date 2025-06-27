import fitz  # PyMuPDF
import re
import spacy

nlp = spacy.load("en_core_web_sm")

def analyze_resume(pdf_path, required_skills):
    # Extract text
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()

    text_lower = text.lower()

    # Skill matching
    skills_found = [s for s in required_skills if s.lower() in text_lower]

    # Experience extraction
    experience_match = re.findall(r'(\d+)\s+years', text_lower)
    years = int(experience_match[0]) if experience_match else 0

    # Education detection
    education = "Unknown"
    if "master" in text_lower:
        education = "Graduate"
    elif "bachelor" in text_lower:
        education = "Undergraduate"
    elif "diploma" in text_lower:
        education = "Diploma"

    # Link extraction
    links = re.findall(r'(https?://[^\s]+)', text)

    # Simple scoring logic
    skill_score = (len(skills_found) / len(required_skills)) * 60
    experience_score = 30 if years >= 3 else 20 if years >=1 else 10
    education_score = 10 if education == "Graduate" else 7 if education == "Undergraduate" else 5

    fit_score = round(skill_score + experience_score + education_score, 2)

    return {
        "fit_score": fit_score,
        "skills_found": skills_found,
        "experience_years": years,
        "education": education,
        "links": links
    }
