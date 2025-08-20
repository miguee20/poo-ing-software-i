import { PostRepository } from '../repository/post-repository-interface';

export class DeletePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(id: string): Promise<void> {
    // Verificar que el post existe
    const existingPost = await this.postRepository.findById(id);
    if (!existingPost) {
      throw new Error('Post not found');
    }

    // Eliminar de la base de datos
    await this.postRepository.delete(id);
  }
}