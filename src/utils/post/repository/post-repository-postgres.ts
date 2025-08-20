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

  async findById(id: string): Promise<Post | null> {
    const postData = await this.sql`
      SELECT * FROM "POST-DB" WHERE id = ${id}
    `;

    if (postData.length === 0) {
      return null;
    }

    const data = postData[0];
    return new Post(
      new PostTitle(data.title),
      new PostDescription(data.description),
      new PostAuthor(data.author)
    );
  }

  async update(id: string, post: Post): Promise<void> {
    const { title, description, author } = post.toObject();
    await this.sql`
      UPDATE "POST-DB" 
      SET title = ${title}, description = ${description}, author = ${author}
      WHERE id = ${id}
    `;
  }



  disconnect(): void {
    this.sql.end();
  }
}