# PF-18 - Peluquería de Mascotas

Proyecto final de Programación II.

Este proyecto sirve para llevar el control de servicios y citas de una peluquería de mascotas.

## Autor

Walter Isaí Villagrán García

## Tecnologías usadas

- Java
- Spring Boot
- PostgreSQL
- HTML
- CSS
- JavaScript
- Postman

## Base de datos

La base de datos se llama:

```text
peluqueria_mascotas

Se utilizó PostgreSQL.
Funciones del sistema
El sistema permite:
- Crear servicios
- Ver servicios
- Crear citas
- Ver citas
- Cambiar el estado de una cita
- Cancelar citas
- Consultar citas por fecha
- Ver servicios más solicitados
- Ver el total estimado del día
Estados de las citas
Las citas pueden estar en:
PROGRAMADA
ATENDIDA
CANCELADA

Regla principal
No se pueden registrar dos citas activas en la misma fecha y hora.

Si ya existe una cita en ese horario, el sistema muestra un error.
Servicios
Algunos endpoints utilizados son:
POST /api/servicios
GET /api/servicios
GET /api/servicios/activos
GET /api/servicios/{id}
PUT /api/servicios/{id}
DELETE /api/servicios/{id}

Citas
Endpoints utilizados:
POST /api/citas
GET /api/citas
GET /api/citas/{id}
GET /api/citas/estado/{estado}
GET /api/citas/fecha/{fecha}
PUT /api/citas/{id}
PATCH /api/citas/{id}/estado/{estado}
PATCH /api/citas/{id}/cancelar

Indicadores
Servicios más solicitados:
GET /api/citas/indicadores/servicios-mas-solicitados

Total estimado del día:
GET /api/citas/indicadores/total-estimado/{fecha}

Interfaz web
También se creó una página sencilla con HTML, CSS y JavaScript.

La página permite:
- Crear servicios
- Crear citas
- Ver las citas registradas
- Atender una cita
- Cancelar una cita
- Consultar la agenda
- Consultar indicadores
Para abrir la página:
http://localhost:8080

Script SQL
El script de la base de datos está en:
database/peluqueria_mascotas.sql

Postman
Las pruebas de la API se guardaron en la carpeta:
postman

Ejecutar el proyecto
Primero se debe tener creada la base de datos:
peluqueria_mascotas

Luego configurar PostgreSQL en:
src/main/resources/application.properties

Después ejecutar:
Pf18PeluqueriaMascotasApplication.java

Y abrir:
http://localhost:8080

Estructura principal
controller
dto
entity
exception
repository
service

Final
El proyecto permite llevar un control básico de los servicios y citas de una peluquería de mascotas usando Java, Spring Boot y PostgreSQL.