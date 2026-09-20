import { Libro } from "../models/Libro";
import { LibroRepository } from "../repositories/LibroRepository";

export class LibroService {
  private repository: LibroRepository;

  constructor() {
    this.repository = LibroRepository.getInstance();
  }

  public agregarLibro(
    titulo: string,
    autor: string,
    anio: number
  ): void {
    const libros = this.repository.obtenerLibros();
    const id = libros.length + 1;

    const nuevoLibro = new Libro(
      id,
      titulo,
      autor,
      anio
    );

    this.repository.agregarLibro(nuevoLibro);
  }

  public eliminarLibro(id: number): void {
    this.repository.eliminarLibro(id);
  }

  public obtenerLibros(): Libro[] {
    return this.repository.obtenerLibros();
  }
}
