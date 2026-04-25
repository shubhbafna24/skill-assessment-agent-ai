'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'IDLE' | 'UPLOADING' | 'ASSESSING' | 'PLANNING' | 'COMPLETE'>('IDLE');
  const [results, setResults] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      // Step 1: Upload & Parse
      setStep('UPLOADING');
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const { assessmentId } = await uploadRes.json();

      if (!assessmentId) throw new Error('Upload failed');

      // Step 2: Generate Assessment
      setStep('ASSESSING');
      const assessRes = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId })
      });
      const { scores } = await assessRes.json();

      // Step 3: Generate Roadmap
      setStep('PLANNING');
      const roadmapRes = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId })
      });
      const { roadmap } = await roadmapRes.json();

      setResults({ scores, roadmap });
      setStep('COMPLETE');
    } catch (error) {
      alert('An error occurred during processing.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">AI Skill Assessment Agent</h1>
          <p className="text-slate-500">Automate candidate evaluation and generate personalized learning roadmaps.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* INPUT FORM (Left Column) */}
          <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold mb-6">New Evaluation</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Candidate Name</label>
                <input required name="candidateName" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-none" placeholder="Jane Doe" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Job Title</label>
                <input required name="jobTitle" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-none" placeholder="Frontend Engineer" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Resume (PDF/DOCX)</label>
                <input required type="file" name="resume" accept=".pdf,.docx,.txt" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-900 hover:file:bg-slate-200" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Job Description (PDF/DOCX)</label>
                <input required type="file" name="jd" accept=".pdf,.docx,.txt" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-900 hover:file:bg-slate-200" />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-4 bg-slate-900 text-white font-medium py-2 px-4 rounded-md hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                {loading ? `Processing: ${step}...` : 'Run AI Agent'}
              </button>
            </form>
          </div>

          {/* RESULTS DASHBOARD (Right Columns) */}
          <div className="md:col-span-2 space-y-6">
            {!results && !loading && (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-500">
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
                        <p className="text-sm text-slate-600">{score.reasoning}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Roadmap */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold mb-4 text-slate-900">Personalized Learning Roadmap</h3>
                  {results.roadmap?.skillsToLearn ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {results.roadmap.skillsToLearn.map((item: any, i: number) => (
                        <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <h4 className="font-bold text-slate-800">{item.skill}</h4>
                          <p className="text-xs text-slate-500 mt-1">Timeline: {item.estimatedTimeline}</p>
                          <div className="mt-3">
                            <span className="text-xs font-semibold uppercase text-slate-400">Adjacent Skills</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {item.adjacentSkills.map((adj: string, j: number) => (
                                <span key={j} className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-md">{adj}</span>
                              ))}
                            </div>
                          </div>
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