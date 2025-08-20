import { NextRequest, NextResponse } from 'next/server';
import { PostRepositoryPostgres } from '@/utils/post/repository/post-repository-postgres';
import { UpdatePostUseCase } from '@/utils/post/use-cases/update-post';
import { DeletePostUseCase } from '@/utils/post/use-cases/delete-post';

const connectionString = 'postgresql://postgres.entsyipsaivdjxboyjxu:MIGUELss19@aws-1-us-east-2.pooler.supabase.com:6543/postgres';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const { title, description, author } = await req.json();
    
    const repository = new PostRepositoryPostgres(connectionString);
    const updatePostUseCase = new UpdatePostUseCase(repository);
    
    const updatedPost = await updatePostUseCase.execute(id, title, description, author);

    return NextResponse.json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost.toObject()
    });

  } catch (error: any) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update post',
        message: error.message
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    const repository = new PostRepositoryPostgres(connectionString);
    const deletePostUseCase = new DeletePostUseCase(repository);
    
    await deletePostUseCase.execute(id);

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete post',
        message: error.message
      },
      { status: 400 }
    );
  }
}