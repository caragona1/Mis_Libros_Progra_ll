Se realizaron los siguientes cambios en la aplicación:

 -Se creó LibroRepository para manejar los libros.
 -Se implementó el patrón Singleton.
 -LibroService ahora utiliza LibroRepository.
 -Se pueden agregar, mostrar y eliminar libros.
 -Se comprobó en la consola que el Singleton funciona correctamente.
¿Por qué es conveniente separar la lógica de los libros de App.tsx?
Porque permite tener el código más ordenado y facilita su mantenimiento y modificación.
//
¿Qué responsabilidad tiene LibroService?
Se encarga de gestionar los libros: agregarlos, eliminarlos y obtener la lista.

¿Qué responsabilidad tiene la clase Libro?
Representa un libro y contiene sus datos: id, titulo, autor y anio. También tiene métodos relacionados con el libro.

