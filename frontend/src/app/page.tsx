"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [jobRole, setJobRole] = useState("");
  const [skills, setSkills] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      setError("Please upload a resume file.");
      return;
    }
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("jobRole", jobRole);
    formData.append("skills", skills);
    formData.append("resume", resumeFile);

    try {
      const res = await axios.post("/api/analyze", formData);
      setResult(res.data);
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Resume Analyzer</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Job Role</label>
          <input
            type="text"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Required Skills (comma-separated)</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Resume Upload (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
            className="mt-1 w-full"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-semibold">Analysis Result</h2>
          <p><strong>Fit Score:</strong> {result.fit_score}%</p>
          <p><strong>Matched Skills:</strong> {result.skills_found.join(", ")}</p>
          <p><strong>Experience:</strong> {result.experience_years} years</p>
          <p><strong>Education:</strong> {result.education}</p>
          <p><strong>Links:</strong></p>
          <ul className="list-disc pl-5">
            {result.links.map((link: string, index: number) => (
              <li key={index}><a href={link} target="_blank" className="text-blue-600">{link}</a></li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
