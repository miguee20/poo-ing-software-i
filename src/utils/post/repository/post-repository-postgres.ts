import postgres from 'postgres';
import { Post } from '../post';
import { PostRepository } from './post-repository-interface';
import { PostTitle } from '../post-title';
import { PostDescription } from '../post-description';
import { PostAuthor } from '../post-author';

export class PostRepositoryPostgres implements PostRepository {
  private sql: any;

  constructor(connectionString: string) {
    this.sql = postgres(connectionString);
  }

  async save(post: Post): Promise<void> {
    const { title, description, author } = post.toObject();
    await this.sql`INSERT INTO "POST-DB" (title, description, author) VALUES (${title}, ${description}, ${author})`;
  }

  async findAll(): Promise<Post[]> {
    const postsData = await this.sql`SELECT * FROM "POST-DB"`;
    
    return postsData.map((postData: any) => {
      return new Post(
        new PostTitle(postData.title),
        new PostDescription(postData.description),
        new PostAuthor(postData.author)
      );
    });
  }

  disconnect(): void {
    this.sql.end();
  }
}