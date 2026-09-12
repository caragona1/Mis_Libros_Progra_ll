import { Libro } from "../models/Libro";

export class LibroService {
  private libros: Libro[] = [];

  public agregarLibro(
    titulo: string,
    autor: string,
    anio: number
  ): void {
    const id = this.libros.length + 1;

    const nuevoLibro = new Libro(
      id,
      titulo,
      autor,
      anio
    );

    this.libros.push(nuevoLibro);
  }

  public eliminarLibro(id: number): void {
    this.libros = this.libros.filter(
      libro => libro.getId() !== id
    );
  }

  public obtenerLibros(): Libro[] {
    return this.libros;
  }
}