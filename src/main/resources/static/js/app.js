const API_SERVICIOS = "/api/servicios";
const API_CITAS = "/api/citas";

document.addEventListener("DOMContentLoaded", function () {
    mostrarSeccion("inicio");
    cargarServicios();
    cargarCitas();

    const hoy = new Date().toISOString().split("T")[0];

    const fechaAgenda = document.getElementById("fechaAgenda");
    const fechaIndicador = document.getElementById("fechaIndicador");

    if (fechaAgenda) {
        fechaAgenda.value = hoy;
    }

    if (fechaIndicador) {
        fechaIndicador.value = hoy;
    }

    const formServicio = document.getElementById("formServicio");
    const formCita = document.getElementById("formCita");

    if (formServicio) {
        formServicio.addEventListener("submit", guardarServicio);
    }

    if (formCita) {
        formCita.addEventListener("submit", guardarCita);
    }
});

function mostrarSeccion(idSeccion) {
    const secciones = document.querySelectorAll(".seccion");

    secciones.forEach(function (seccion) {
        seccion.classList.remove("activa");
    });

    const seccionSeleccionada = document.getElementById(idSeccion);

    if (seccionSeleccionada) {
        seccionSeleccionada.classList.add("activa");
    }

    if (idSeccion === "servicios") {
        cargarServicios();
    }

    if (idSeccion === "citas") {
        cargarServicios();
        cargarCitas();
    }
}

async function cargarServicios() {
    try {
        const respuesta = await fetch(API_SERVICIOS);

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los servicios");
        }

        const servicios = await respuesta.json();

        mostrarServiciosTabla(servicios);
        cargarServiciosEnSelect(servicios);

    } catch (error) {
        mostrarMensaje(error.message);
    }
}

function mostrarServiciosTabla(servicios) {
    const tabla = document.getElementById("tablaServicios");

    if (!tabla) {
        return;
    }

    tabla.innerHTML = "";

    servicios.forEach(function (servicio) {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${servicio.id}</td>
            <td>${servicio.nombre}</td>
            <td>${servicio.descripcion || ""}</td>
            <td>Q ${Number(servicio.precio).toFixed(2)}</td>
            <td>${servicio.duracionMinutos} min</td>
            <td>${servicio.activo ? "Activo" : "Inactivo"}</td>
        `;

        tabla.appendChild(fila);
    });
}

function cargarServiciosEnSelect(servicios) {
    const select = document.getElementById("servicioCita");

    if (!select) {
        return;
    }

    select.innerHTML = `
        <option value="">
            Seleccione un servicio
        </option>
    `;

    servicios
        .filter(function (servicio) {
            return servicio.activo;
        })
        .forEach(function (servicio) {
            const opcion = document.createElement("option");

            opcion.value = servicio.id;
            opcion.textContent =
                servicio.nombre + " - Q " + Number(servicio.precio).toFixed(2);

            select.appendChild(opcion);
        });
}

async function guardarServicio(evento) {
    evento.preventDefault();

    const servicio = {
        nombre: document.getElementById("nombreServicio").value,
        descripcion: document.getElementById("descripcionServicio").value,
        precio: Number(document.getElementById("precioServicio").value),
        duracionMinutos: Number(document.getElementById("duracionServicio").value),
        activo: true
    };

    try {
        const respuesta = await fetch(API_SERVICIOS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(servicio)
        });

        if (!respuesta.ok) {
            const error = await respuesta.json();
            throw new Error(
                error.mensaje || "No se pudo guardar el servicio"
            );
        }

        document.getElementById("formServicio").reset();

        mostrarMensaje("Servicio guardado correctamente");

        cargarServicios();

    } catch (error) {
        mostrarMensaje(error.message);
    }
}

async function cargarCitas() {
    try {
        const respuesta = await fetch(API_CITAS);

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar las citas");
        }

        const citas = await respuesta.json();

        mostrarCitasTabla(citas);

    } catch (error) {
        mostrarMensaje(error.message);
    }
}

function mostrarCitasTabla(citas) {
    const tabla = document.getElementById("tablaCitas");

    if (!tabla) {
        return;
    }

    tabla.innerHTML = "";

    citas.forEach(function (cita) {
        const fila = document.createElement("tr");

        let acciones = "";

        if (cita.estado === "PROGRAMADA") {
            acciones = `
                <button
                    class="accion atender"
                    onclick="cambiarEstado(${cita.id}, 'ATENDIDA')"
                >
                    Atender
                </button>

                <button
                    class="accion cancelar"
                    onclick="cancelarCita(${cita.id})"
                >
                    Cancelar
                </button>
            `;
        }

        fila.innerHTML = `
            <td>${cita.id}</td>
            <td>${cita.nombreMascota}</td>
            <td>${cita.propietario}</td>
            <td>${cita.especie}</td>
            <td>${formatearFecha(cita.fechaHora)}</td>
            <td>${cita.servicioNombre}</td>
            <td>${cita.estado}</td>
            <td>Q ${Number(cita.costoEstimado).toFixed(2)}</td>
            <td>${acciones}</td>
        `;

        tabla.appendChild(fila);
    });
}

async function guardarCita(evento) {
    evento.preventDefault();

    const cita = {
        nombreMascota: document.getElementById("nombreMascota").value,
        propietario: document.getElementById("propietario").value,
        especie: document.getElementById("especie").value,
        fechaHora: document.getElementById("fechaHora").value,
        estado: "PROGRAMADA",
        servicioId: Number(
            document.getElementById("servicioCita").value
        )
    };

    try {
        const respuesta = await fetch(API_CITAS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cita)
        });

        if (!respuesta.ok) {
            const error = await respuesta.json();

            throw new Error(
                error.mensaje || "No se pudo registrar la cita"
            );
        }

        document.getElementById("formCita").reset();

        mostrarMensaje("Cita registrada correctamente");

        cargarCitas();

    } catch (error) {
        mostrarMensaje(error.message);
    }
}

async function cambiarEstado(id, estado) {
    try {
        const respuesta = await fetch(
            `${API_CITAS}/${id}/estado/${estado}`,
            {
                method: "PATCH"
            }
        );

        if (!respuesta.ok) {
            const error = await respuesta.json();

            throw new Error(
                error.mensaje || "No se pudo cambiar el estado"
            );
        }

        mostrarMensaje("Estado actualizado correctamente");

        cargarCitas();

    } catch (error) {
        mostrarMensaje(error.message);
    }
}

async function cancelarCita(id) {
    try {
        const respuesta = await fetch(
            `${API_CITAS}/${id}/cancelar`,
            {
                method: "PATCH"
            }
        );

        if (!respuesta.ok) {
            const error = await respuesta.json();

            throw new Error(
                error.mensaje || "No se pudo cancelar la cita"
            );
        }

        mostrarMensaje("Cita cancelada correctamente");

        cargarCitas();

    } catch (error) {
        mostrarMensaje(error.message);
    }
}

async function consultarAgenda() {
    const fecha = document.getElementById("fechaAgenda").value;

    if (!fecha) {
        mostrarMensaje("Seleccione una fecha");
        return;
    }

    try {
        const respuesta = await fetch(
            `${API_CITAS}/fecha/${fecha}`
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo consultar la agenda");
        }

        const citas = await respuesta.json();

        const contenedor =
            document.getElementById("resultadoAgenda");

        if (citas.length === 0) {
            contenedor.innerHTML =
                "<p>No hay citas para esta fecha.</p>";
            return;
        }

        let html = `
            <div class="tabla-contenedor">
                <table>
                    <thead>
                        <tr>
                            <th>Hora</th>
                            <th>Mascota</th>
                            <th>Propietario</th>
                            <th>Servicio</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        citas.forEach(function (cita) {
            const hora =
                cita.fechaHora.substring(11, 16);

            html += `
                <tr>
                    <td>${hora}</td>
                    <td>${cita.nombreMascota}</td>
                    <td>${cita.propietario}</td>
                    <td>${cita.servicioNombre}</td>
                    <td>${cita.estado}</td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        contenedor.innerHTML = html;

    } catch (error) {
        mostrarMensaje(error.message);
    }
}

async function consultarTotalEstimado() {
    const fecha =
        document.getElementById("fechaIndicador").value;

    if (!fecha) {
        mostrarMensaje("Seleccione una fecha");
        return;
    }

    try {
        const respuesta = await fetch(
            `${API_CITAS}/indicadores/total-estimado/${fecha}`
        );

        if (!respuesta.ok) {
            throw new Error(
                "No se pudo consultar el total estimado"
            );
        }

        const total = await respuesta.json();

        document.getElementById("totalEstimado").textContent =
            "Q " + Number(total).toFixed(2);

    } catch (error) {
        mostrarMensaje(error.message);
    }
}

async function consultarServiciosMasSolicitados() {
    try {
        const respuesta = await fetch(
            `${API_CITAS}/indicadores/servicios-mas-solicitados`
        );

        if (!respuesta.ok) {
            throw new Error(
                "No se pudieron consultar los servicios"
            );
        }

        const datos = await respuesta.json();

        const contenedor =
            document.getElementById("serviciosSolicitados");

        if (datos.length === 0) {
            contenedor.innerHTML =
                "<p>No hay datos disponibles.</p>";
            return;
        }

        let html = "<ul>";

        datos.forEach(function (dato) {
            html += `
                <li>
                    ${dato[0]} - ${dato[1]} cita(s)
                </li>
            `;
        });

        html += "</ul>";

        contenedor.innerHTML = html;

    } catch (error) {
        mostrarMensaje(error.message);
    }
}

function formatearFecha(fechaHora) {
    if (!fechaHora) {
        return "";
    }

    const partes = fechaHora.split("T");

    if (partes.length !== 2) {
        return fechaHora;
    }

    const fecha = partes[0].split("-");

    return (
        fecha[2] +
        "/" +
        fecha[1] +
        "/" +
        fecha[0] +
        " " +
        partes[1].substring(0, 5)
    );
}

function mostrarMensaje(texto) {
    const mensaje = document.getElementById("mensaje");

    mensaje.textContent = texto;
    mensaje.style.display = "block";

    setTimeout(function () {
        mensaje.style.display = "none";
    }, 3000);
}