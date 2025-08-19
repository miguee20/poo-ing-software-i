import postgres from 'postgres';

export class DatabaseService {
  private sql: any;
  
  constructor(connectionString: string) {
    this.sql = postgres(connectionString);
  }
  
  async insertPost(title: string, description: string, author: string): Promise<void> {
    await this.sql`INSERT INTO "POST-DB" (title, description, author) VALUES (${title}, ${description}, ${author})`;
  }
  
  disconnect(): void {
    this.sql.end();
  }
}