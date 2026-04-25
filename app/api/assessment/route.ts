import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAiProvider } from '@/lib/ai/providerFactory';

export async function POST(req: NextRequest) {
  try {
    const { assessmentId } = await req.json();
    const assessment = await db.assessment.findUnique({ where: { id: assessmentId } });

    if (!assessment) return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });

    const aiProvider = getAiProvider();
    
    const systemPrompt = `You are an expert technical recruiter and assessor. 
    Analyze the Job Description (JD) to identify core required skills. 
    Then, evaluate the candidate's Resume against these skills.
    Return ONLY a raw JSON array of objects. Do not use markdown blocks (\`\`\`json).
    Format: [{"skillName": "React", "required": true, "score": 8.5, "reasoning": "5 years experience listed..."}]`;
    
    const userPrompt = `Job Title: ${assessment.jobTitle}\n\nJob Description:\n${assessment.jdText}\n\nCandidate Resume:\n${assessment.resumeText}`;

    const aiResponse = await aiProvider.generateAssessment(systemPrompt, userPrompt);
    
    // Clean potential markdown from AI response
    const cleanedJson = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const scores = JSON.parse(cleanedJson);

    // Save scores to database
    await db.skillScore.createMany({
      data: scores.map((score: any) => ({
        assessmentId,
        skillName: score.skillName,
        required: score.required,
        score: score.score,
        reasoning: score.reasoning,
      }))
    });

    return NextResponse.json({ scores });
  } catch (error: any) {
    console.error('Assessment Error:', error);
    return NextResponse.json({ error: 'Failed to generate assessment' }, { status: 500 });
  }
}