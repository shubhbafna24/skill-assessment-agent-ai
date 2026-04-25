import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAiProvider } from '@/lib/ai/providerFactory';

export async function POST(req: NextRequest) {
  try {
    const { assessmentId } = await req.json();
    const scores = await db.skillScore.findMany({ where: { assessmentId } });

    // Filter skills where candidate scored less than 7.0
    const weakSkills = scores.filter(s => s.score < 7.0).map(s => s.skillName);

    if (weakSkills.length === 0) {
      return NextResponse.json({ roadmap: { message: 'Candidate meets all requirements!' } });
    }

    const aiProvider = getAiProvider();
    const systemPrompt = `You are an expert career coach. Based on the missing skills provided, generate a personalized learning roadmap. 
    Return ONLY raw JSON. Format: {"skillsToLearn": [{"skill": "Skill Name", "adjacentSkills": ["Skill A"], "resources": ["Link 1"], "estimatedTimeline": "2 weeks"}]}`;
    
    const userPrompt = `Generate a learning plan to bridge these skill gaps: ${weakSkills.join(', ')}`;

    const aiResponse = await aiProvider.generateAssessment(systemPrompt, userPrompt);
    const cleanedJson = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const roadmap = JSON.parse(cleanedJson);

    await db.learningPlan.create({
      data: {
        assessmentId,
        roadmap: roadmap,
      }
    });

    return NextResponse.json({ roadmap });
  } catch (error: any) {
    console.error('Roadmap Error:', error);
    return NextResponse.json({ error: 'Failed to generate roadmap' }, { status: 500 });
  }
}