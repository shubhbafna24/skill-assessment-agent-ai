import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { parseDocument } from '@/lib/parsers';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const candidateName = formData.get('candidateName') as string;
    const jobTitle = formData.get('jobTitle') as string;
    const resumeFile = formData.get('resume') as File;
    const jdFile = formData.get('jd') as File;

    if (!candidateName || !jobTitle || !resumeFile || !jdFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Parse documents using the library we defined earlier
    const resumeText = await parseDocument(resumeFile);
    const jdText = await parseDocument(jdFile);

    // Create DB Record
    const assessment = await db.assessment.create({
      data: {
        candidateName,
        jobTitle,
        resumeText,
        jdText,
      },
    });

    return NextResponse.json({ assessmentId: assessment.id, message: 'Files processed successfully' });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}