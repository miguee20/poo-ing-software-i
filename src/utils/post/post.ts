import { PostTitle } from './post-title';
import { PostDescription } from './post-description';
import { PostAuthor } from './post-author';

export class Post {
  constructor(
    public readonly title: PostTitle,
    public readonly description: PostDescription,
    public readonly author: PostAuthor
  ) {}

  static create(title: string, description: string, author: string): Post {
    return new Post(
      new PostTitle(title),
      new PostDescription(description),
      new PostAuthor(author)
    );
  }

  toObject() {
    return {
      title: this.title.value,
      description: this.description.value,
      author: this.author.value
    };
  }
}