import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateAIResponse } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { assessmentId } = await req.json();
    const assessment = await db.assessment.findUnique({ where: { id: assessmentId } });

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    const systemPrompt = `You are an expert technical recruiter and assessor.
Analyze the Job Description to identify core required skills.
Then evaluate the candidate's Resume against those skills.
Return ONLY a raw JSON array — no markdown, no code fences.
Format: [{"skillName": "React", "required": true, "score": 8.5, "reasoning": "5 years experience listed"}]`;

    const userPrompt = `Job Title: ${assessment.jobTitle}\n\nJob Description:\n${assessment.jdText}\n\nCandidate Resume:\n${assessment.resumeText}`;

    const raw = await generateAIResponse(systemPrompt, userPrompt);
    const scores = JSON.parse(raw.replace(/```json|```/g, '').trim());

    await db.skillScore.createMany({
      data: scores.map((s: any) => ({
        assessmentId,
        skillName: s.skillName,
        required: s.required,
        score: s.score,
        reasoning: s.reasoning,
      })),
    });

    return NextResponse.json({ scores });
  } catch (error: any) {
    console.error('Assessment Error:', error.message);
    return NextResponse.json({ error: error.message || 'Failed to generate assessment' }, { status: 500 });
  }
}
