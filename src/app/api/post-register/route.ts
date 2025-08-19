import { NextRequest, NextResponse } from 'next/server';
import { PostHandler } from '@/utils/postHandler';

const connectionString = 'postgresql://postgres.entsyipsaivdjxboyjxu:MIGUELss19@aws-1-us-east-2.pooler.supabase.com:6543/postgres';
const postHandler = new PostHandler(connectionString);

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    return await postHandler.handlePostCreation(payload);
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid JSON format', details: String(err) },
      { status: 400 }
    );
  }
}