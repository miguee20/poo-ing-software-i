import { Post } from '../post';
import { PostRepository } from '../repository/post-repository-interface';

export class GetAllPostsUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(): Promise<Post[]> {
    return await this.postRepository.findAll();
  }
}