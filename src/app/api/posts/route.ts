import { NextResponse } from 'next/server';
import { PostRepositoryPostgres } from '@/utils/post/repository/post-repository-postgres';
import { GetAllPostsUseCase } from '@/utils/post/use-cases/get-all-posts';

const connectionString = 'postgresql://postgres.entsyipsaivdjxboyjxu:MIGUELss19@aws-1-us-east-2.pooler.supabase.com:6543/postgres';

export async function GET() {
  try {
    const repository = new PostRepositoryPostgres(connectionString);
    const getAllPostsUseCase = new GetAllPostsUseCase(repository);
    
    const posts = await getAllPostsUseCase.execute();

    return NextResponse.json({
      success: true,
      data: posts.map(post => post.toObject())
    });

  } catch (error: any) {
    console.error('Error getting posts:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch posts',
        message: error.message
      },
      { status: 500 }
    );
  }
}