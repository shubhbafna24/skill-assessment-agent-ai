import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { parseDocument } from '@/lib/parsers';

async function extractText(raw: FormDataEntryValue | null, fieldName: string): Promise<string | null> {
  if (raw instanceof File && raw.size > 0) {
    return parseDocument(raw);
  }
  if (typeof raw === 'string' && raw.trim()) {
    return raw.trim();
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const candidateName = formData.get('candidateName') as string;
    const jobTitle = formData.get('jobTitle') as string;

    if (!candidateName || !jobTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const resumeText = await extractText(formData.get('resume'), 'resume');
    const jdText = await extractText(formData.get('jd'), 'jd');

    if (!resumeText) {
      return NextResponse.json({ error: 'Resume is required (upload a file or paste text)' }, { status: 400 });
    }
    if (!jdText) {
      return NextResponse.json({ error: 'Job description is required (upload a file or paste text)' }, { status: 400 });
    }

    const assessment = await db.assessment.create({
      data: { candidateName, jobTitle, resumeText, jdText },
    });

    return NextResponse.json({ assessmentId: assessment.id, message: 'Files processed successfully' });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
