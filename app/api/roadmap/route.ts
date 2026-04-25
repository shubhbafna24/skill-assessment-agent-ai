import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateAIResponse } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { assessmentId } = await req.json();
    const scores = await db.skillScore.findMany({ where: { assessmentId } });
    const weakSkills = scores.filter(s => s.score < 7.0).map(s => s.skillName);

    if (weakSkills.length === 0) {
      return NextResponse.json({ roadmap: { skillsToLearn: [] } });
    }

    const systemPrompt = `You are an expert career coach.
Generate a personalized learning roadmap for the missing skills provided.
Return ONLY raw JSON — no markdown, no code fences.
Format: {"skillsToLearn": [{"skill": "Skill Name", "adjacentSkills": ["Skill A"], "resources": ["Resource 1"], "estimatedTimeline": "2 weeks"}]}`;

    const userPrompt = `Generate a learning plan for these skill gaps: ${weakSkills.join(', ')}`;

    const raw = await generateAIResponse(systemPrompt, userPrompt);
    const roadmap = JSON.parse(raw.replace(/```json|```/g, '').trim());

    await db.learningPlan.create({ data: { assessmentId, roadmap } });

    return NextResponse.json({ roadmap });
  } catch (error: any) {
    console.error('Roadmap Error:', error.message);
    return NextResponse.json({ error: error.message || 'Failed to generate roadmap' }, { status: 500 });
  }
}
