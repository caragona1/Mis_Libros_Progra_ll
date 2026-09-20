import { Libro } from "../models/Libro";

export class LibroRepository {
  private static instancia: LibroRepository;

  private constructor() {}

  public static getInstance(): LibroRepository {
    if (!LibroRepository.instancia) {
      LibroRepository.instancia = new LibroRepository();
    }

    return LibroRepository.instancia;
  }

  private libros: Libro[] = [];

  public obtenerLibros(): Libro[] {
    return this.libros;
  }

  public agregarLibro(libro: Libro): void {
    this.libros.push(libro);
  }

  public eliminarLibro(id: number): void {
    this.libros = this.libros.filter(
      libro => libro.getId() !== id
    );
  }
}
