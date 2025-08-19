import { Post } from '../post';

export interface PostRepository {
  save(post: Post): Promise<void>;
}