import { Post } from '../post';
import { PostRepository } from './post-repository-interface';
import { DatabaseService } from '@/utils/databaseService';

export class PostRepositoryPostgres implements PostRepository {
  private dbService: DatabaseService;

  constructor(connectionString: string) {
    this.dbService = new DatabaseService(connectionString);
  }

  async save(post: Post): Promise<void> {
    const { title, description, author } = post.toObject();
    await this.dbService.insertPost(title, description, author);
  }

  disconnect(): void {
    this.dbService.disconnect();
  }
}