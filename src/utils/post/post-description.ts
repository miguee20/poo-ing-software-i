export class PostDescription {
  constructor(public readonly value: string) {
    const trimmed = value.trim();
    
    if (!trimmed) {
      throw new Error('Description cannot be empty');
    }
    if (trimmed.length < 5) {
      throw new Error('Description too short (minimum 5 characters)');
    }
    if (trimmed.length > 1000) {
      throw new Error('Description too long (maximum 1000 characters)');
    }
  }
}