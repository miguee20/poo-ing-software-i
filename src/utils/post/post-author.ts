export class PostAuthor {
  constructor(public readonly value: string) {
    if (!/^[A-ZÁÉÍÓÚÑÜ]/.test(value)) {
      throw new Error('Author must start with capital letter');
    }
    if (/[^A-Za-záéíóúñü'\-. ]/.test(value)) {
      throw new Error('Author contains invalid characters');
    }
    if (value.replace(/[^a-záéíóúñü]/gi, '').length < 2) {
      throw new Error('Author name too short');
    }
  }
}