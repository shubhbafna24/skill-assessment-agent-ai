'use client';

import { useState } from 'react';

type InputMode = 'file' | 'text';

function InputToggle({ label, name, mode, onModeChange }: {
  label: string;
  name: string;
  mode: InputMode;
  onModeChange: (m: InputMode) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <div className="flex rounded-md border border-slate-300 overflow-hidden text-xs">
          <button
            type="button"
            onClick={() => onModeChange('file')}
            className={`px-3 py-1 font-medium transition-colors ${mode === 'file' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => onModeChange('text')}
            className={`px-3 py-1 font-medium transition-colors ${mode === 'text' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            Paste Text
          </button>
        </div>
      </div>

      {mode === 'file' ? (
        <input
          required
          type="file"
          name={name}
          accept=".pdf,.docx,.txt"
          className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-900 hover:file:bg-slate-200"
        />
      ) : (
        <textarea
          required
          name={name}
          rows={6}
          placeholder={`Paste ${label.toLowerCase()} content here...`}
          className="w-full p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none resize-y"
        />
      )}
    </div>
  );
}

function buildReportHTML(candidateName: string, jobTitle: string, scores: any[], roadmap: any): string {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const overallScore = scores.length
    ? (scores.reduce((sum: number, s: any) => sum + s.score, 0) / scores.length).toFixed(1)
    : 'N/A';

  const scoresHTML = scores.map((s: any) => {
    const color = s.score >= 7 ? '#15803d' : '#b91c1c';
    const bg = s.score >= 7 ? '#f0fdf4' : '#fef2f2';
    const barColor = s.score >= 7 ? '#22c55e' : '#ef4444';
    const barWidth = `${(s.score / 10) * 100}%`;
    return `
      <div style="padding:12px 0;border-bottom:1px solid #f1f5f9;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-weight:600;color:#0f172a;">${s.skillName}</span>
          <span style="font-size:13px;font-weight:700;padding:2px 10px;border-radius:6px;background:${bg};color:${color};">${s.score} / 10</span>
        </div>
        <div style="background:#e2e8f0;border-radius:4px;height:6px;margin-bottom:6px;">
          <div style="background:${barColor};height:6px;border-radius:4px;width:${barWidth};"></div>
        </div>
        <p style="font-size:13px;color:#475569;margin:0;">${s.reasoning}</p>
      </div>`;
  }).join('');

  const roadmapHTML = roadmap?.skillsToLearn?.length
    ? roadmap.skillsToLearn.map((item: any) => {
        const tags = (item.adjacentSkills || []).map((adj: string) =>
          `<span style="font-size:11px;background:#e2e8f0;color:#475569;padding:2px 8px;border-radius:4px;margin:2px;display:inline-block;">${adj}</span>`
        ).join('');
        const resources = (item.resources || []).map((r: string) =>
          `<li style="font-size:12px;color:#475569;margin:2px 0;">${r}</li>`
        ).join('');
        return `
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;">
              <h4 style="font-weight:700;color:#0f172a;margin:0 0 4px 0;">${item.skill}</h4>
              <span style="font-size:11px;color:#64748b;background:#e2e8f0;padding:2px 8px;border-radius:4px;white-space:nowrap;">⏱ ${item.estimatedTimeline}</span>
            </div>
            ${tags ? `<div style="margin:8px 0 4px 0;"><span style="font-size:10px;font-weight:700;text-transform:uppercase;color:#94a3b8;">Adjacent Skills</span><div style="margin-top:4px;">${tags}</div></div>` : ''}
            ${resources ? `<div style="margin-top:8px;"><span style="font-size:10px;font-weight:700;text-transform:uppercase;color:#94a3b8;">Resources</span><ul style="margin:4px 0 0 16px;padding:0;">${resources}</ul></div>` : ''}
          </div>`;
      }).join('')
    : `<p style="color:#475569;">No major skill gaps identified. Candidate is highly aligned with the job description.</p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Assessment Report — ${candidateName}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#f8fafc; color:#0f172a; margin:0; padding:32px; }
    .container { max-width:800px; margin:0 auto; background:#fff; border-radius:12px; padding:40px; box-shadow:0 1px 3px rgba(0,0,0,.1); }
    h1 { font-size:22px; font-weight:700; margin:0 0 4px 0; }
    h2 { font-size:16px; font-weight:700; margin:0 0 16px 0; color:#0f172a; }
    .meta { font-size:13px; color:#64748b; margin-bottom:32px; }
    .badge { display:inline-block; background:#0f172a; color:#fff; font-size:12px; font-weight:600; padding:4px 12px; border-radius:20px; margin-bottom:32px; }
    .section { margin-bottom:32px; }
    .section-header { border-bottom:2px solid #f1f5f9; padding-bottom:8px; margin-bottom:16px; }
    @media print { body { padding:0; background:#fff; } .container { box-shadow:none; } }
  </style>
</head>
<body>
  <div class="container">
    <h1>AI Skill Assessment Report</h1>
    <p class="meta">
      <strong>Candidate:</strong> ${candidateName} &nbsp;|&nbsp;
      <strong>Role:</strong> ${jobTitle} &nbsp;|&nbsp;
      <strong>Date:</strong> ${date}
    </p>
    <div class="badge">Overall Score: ${overallScore} / 10</div>

    <div class="section">
      <div class="section-header"><h2>Skill Proficiency Assessment</h2></div>
      ${scoresHTML}
    </div>

    <div class="section">
      <div class="section-header"><h2>Personalized Learning Roadmap</h2></div>
      ${roadmapHTML}
    </div>

    <p style="font-size:11px;color:#94a3b8;margin-top:32px;border-top:1px solid #f1f5f9;padding-top:16px;">
      Generated by AI Skill Assessment Agent &bull; ${date}
    </p>
  </div>
</body>
</html>`;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'IDLE' | 'UPLOADING' | 'ASSESSING' | 'PLANNING' | 'COMPLETE'>('IDLE');
  const [results, setResults] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resumeMode, setResumeMode] = useState<InputMode>('file');
  const [jdMode, setJdMode] = useState<InputMode>('file');
  const [candidateInfo, setCandidateInfo] = useState({ name: '', jobTitle: '' });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get('candidateName') as string;
    const jobTitle = formData.get('jobTitle') as string;

    setErrorMsg(null);
    setResults(null);
    try {
      setStep('UPLOADING');
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const { assessmentId, error: uploadError } = await uploadRes.json();
      if (!assessmentId) throw new Error(uploadError || 'Upload failed');

      setStep('ASSESSING');
      const assessRes = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId }),
      });
      const assessJson = await assessRes.json();
      if (!assessRes.ok) throw new Error(assessJson.error || 'Assessment failed');

      setStep('PLANNING');
      const roadmapRes = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId }),
      });
      const roadmapJson = await roadmapRes.json();
      if (!roadmapRes.ok) throw new Error(roadmapJson.error || 'Roadmap generation failed');

      setCandidateInfo({ name, jobTitle });
      setResults({ scores: assessJson.scores, roadmap: roadmapJson.roadmap });
      setStep('COMPLETE');
    } catch (error: any) {
      setErrorMsg(error.message || 'An unexpected error occurred.');
      setStep('IDLE');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function downloadReport() {
    const html = buildReportHTML(
      candidateInfo.name,
      candidateInfo.jobTitle,
      results.scores,
      results.roadmap,
    );
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${candidateInfo.name.replace(/\s+/g, '-')}-assessment-report.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">

        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">AI Skill Assessment Agent</h1>
          <p className="text-slate-500">Automate candidate evaluation and generate personalized learning roadmaps.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* INPUT FORM */}
          <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold mb-6">New Evaluation</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Candidate Name</label>
                <input
                  required
                  name="candidateName"
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  placeholder="Jane Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Job Title</label>
                <input
                  required
                  name="jobTitle"
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  placeholder="Frontend Engineer"
                />
              </div>

              <InputToggle label="Resume" name="resume" mode={resumeMode} onModeChange={setResumeMode} />
              <InputToggle label="Job Description" name="jd" mode={jdMode} onModeChange={setJdMode} />

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-slate-900 text-white font-medium py-2 px-4 rounded-md hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                {loading ? `Processing: ${step}...` : 'Run AI Agent'}
              </button>
            </form>
          </div>

          {/* RESULTS */}
          <div className="md:col-span-2 space-y-6">
            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                <span className="font-semibold">Error: </span>{errorMsg}
              </div>
            )}

            {!results && !loading && !errorMsg && (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-500 p-16">
                Submit a candidate profile to view AI analysis.
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center space-y-4 border-2 border-slate-200 rounded-xl bg-white p-12">
                <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-medium animate-pulse">{step}...</p>
              </div>
            )}

            {results && step === 'COMPLETE' && (
              <>
                {/* Report header with download button */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Results for</p>
                    <p className="font-semibold text-slate-900">{candidateInfo.name} — {candidateInfo.jobTitle}</p>
                  </div>
                  <button
                    onClick={downloadReport}
                    className="flex items-center gap-2 bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                    </svg>
                    Download Report
                  </button>
                </div>

                {/* Skill Scores */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold mb-4 text-slate-900">Skill Proficiency Assessment</h3>
                  <div className="space-y-4">
                    {results.scores.map((score: any, i: number) => (
                      <div key={i} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-slate-900">{score.skillName}</span>
                          <span className={`text-sm font-bold px-2 py-1 rounded-md ${score.score >= 7 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {score.score} / 10
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
                          <div
                            className={`h-1.5 rounded-full ${score.score >= 7 ? 'bg-green-500' : 'bg-red-400'}`}
                            style={{ width: `${(score.score / 10) * 100}%` }}
                          />
                        </div>
                        <p className="text-sm text-slate-600">{score.reasoning}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Roadmap */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold mb-4 text-slate-900">Personalized Learning Roadmap</h3>
                  {results.roadmap?.skillsToLearn?.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {results.roadmap.skillsToLearn.map((item: any, i: number) => (
                        <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-slate-800">{item.skill}</h4>
                            <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full whitespace-nowrap">⏱ {item.estimatedTimeline}</span>
                          </div>
                          <div className="mt-3">
                            <span className="text-xs font-semibold uppercase text-slate-400">Adjacent Skills</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {item.adjacentSkills.map((adj: string, j: number) => (
                                <span key={j} className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-md">{adj}</span>
                              ))}
                            </div>
                          </div>
                          {item.resources?.length > 0 && (
                            <div className="mt-3">
                              <span className="text-xs font-semibold uppercase text-slate-400">Resources</span>
                              <ul className="mt-1 space-y-1">
                                {item.resources.map((r: string, j: number) => (
                                  <li key={j} className="text-xs text-slate-600 list-disc ml-4">{r}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-600">No major skill gaps identified. Candidate is highly aligned with the JD!</p>
                  )}
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
