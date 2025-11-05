// 🌐 URL base de la API
const API_URL = "http://localhost:8000/api/usuarios";

// 🧭 Elementos del DOM
const form = document.getElementById("usuarioForm");
const btnCancelar = document.getElementById("btnCancelar");
const inputId = document.getElementById("id");
const inputNombre = document.getElementById("nombre");
const inputEmail = document.getElementById("email");
const btnGuardar = document.getElementById("btnGuardar");

// ✅ Cargar usuarios al iniciar
document.addEventListener("DOMContentLoaded", () => {
  cargarUsuarios();
});

// 🔹 Obtener todos los usuarios
async function cargarUsuarios() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    mostrarUsuarios(data);
  } catch (error) {
    console.error("Error cargando usuarios:", error);
  }
}

// 🔹 Mostrar usuarios en la tabla
function mostrarUsuarios(usuarios) {
  const tbody = document.querySelector("#tablaUsuarios tbody");
  tbody.innerHTML = "";

  if (!usuarios || usuarios.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No hay usuarios</td></tr>`;
    return;
  }

  usuarios.forEach(usuario => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${usuario.id}</td>
      <td>${usuario.nombre}</td>
      <td>${usuario.email}</td>
      <td>
        <button class="btn btn-sm btn-warning me-2" onclick="editarUsuario(${usuario.id})">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// 🔹 Crear o actualizar usuario
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = inputId.value.trim();
  const nombre = inputNombre.value.trim();
  const email = inputEmail.value.trim();

  if (!nombre || !email) {
    alert("Por favor completa todos los campos");
    return;
  }

  const data = { nombre, email };

  try {
    let response;

    if (id) {
      // PUT → actualizar
      response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      // POST → crear
      response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    const result = await response.json();

    if (response.ok) {
      alert(id ? "Usuario actualizado" : "Usuario creado");
      form.reset();
      inputId.value = "";
      btnGuardar.textContent = "Guardar";
      cargarUsuarios();
    } else {
      alert(result.error || "Ocurrió un error");
    }
  } catch (error) {
    console.error("Error al guardar usuario:", error);
  }
});

// 🔹 Editar usuario
async function editarUsuario(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const usuario = await response.json();

    if (response.ok) {
      inputId.value = usuario.id;
      inputNombre.value = usuario.nombre;
      inputEmail.value = usuario.email;
      btnGuardar.textContent = "Actualizar";
    } else {
      alert("Usuario no encontrado");
    }
  } catch (error) {
    console.error("Error al editar:", error);
  }
}

// 🔹 Eliminar usuario
async function eliminarUsuario(id) {
  if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    const result = await response.json();

    if (response.ok) {
      alert("Usuario eliminado");
      cargarUsuarios();
    } else {
      alert(result.error || "Error al eliminar");
    }
  } catch (error) {
    console.error("Error al eliminar:", error);
  }
}

// 🔹 Cancelar edición
btnCancelar.addEventListener("click", () => {
  form.reset();
  inputId.value = "";
  btnGuardar.textContent = "Guardar";
});
