import { NextRequest } from 'next/server';
import { PostHandler } from '@/utils/postHandler';

const connectionString = 'postgresql://postgres.entsyipsaivdjxboyjxu:MIGUELss19@aws-1-us-east-2.pooler.supabase.com:6543/postgres';
const postHandler = new PostHandler(connectionString);

export async function POST(req: NextRequest) {
  return postHandler.handleRequest(req);
}