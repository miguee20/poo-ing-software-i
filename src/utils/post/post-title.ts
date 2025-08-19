export class PostTitle {
  constructor(public readonly value: string) {
    const trimmed = value.trim();
    if (trimmed.length < 5 || trimmed.length > 100) {
      throw new Error('Title must be between 5-100 characters');
    }
  }
}