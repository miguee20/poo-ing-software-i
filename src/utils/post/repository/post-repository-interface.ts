import { Post } from '../post';

export interface PostRepository {
  save(post: Post): Promise<void>;
  findAll(): Promise<Post[]>;
  findById(id: string): Promise<Post | null>; 
  update(id: string, post: Post): Promise<void>; 
  delete(id: string): Promise<void>;
}