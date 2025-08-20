import { Post } from '../post';
import { PostRepository } from '../repository/post-repository-interface';

export class UpdatePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(id: string, title: string, description: string, author: string): Promise<Post> {
    const existingPost = await this.postRepository.findById(id);
    if (!existingPost) {
      throw new Error('Post not found');
    }

    const updatedPost = Post.create(title, description, author);
    
    await this.postRepository.update(id, updatedPost);
    
    return updatedPost;
  }
}