// js/auth.js
// Manejo de Usuarios, Sesiones y Auditoría

const DEFAULT_USERS = [
  { username: "admin", password: "ivan1.1", role: "admin" },
  { username: "Ivan", password: "1", role: "user" },
  { username: "Timoteo", password: "arminio", role: "user" }
];

let users = JSON.parse(localStorage.getItem("smart_users")) || DEFAULT_USERS;
let auditLog = JSON.parse(localStorage.getItem("smart_audit")) || [];
let currentUser = null;
let sessionTimeout = null;
const SESSION_TIME_MS = 15 * 60 * 1000; // 15 minutos

function saveUsers() {
  localStorage.setItem("smart_users", JSON.stringify(users));
}

function saveAuditLog() {
  localStorage.setItem("smart_audit", JSON.stringify(auditLog));
}

function logAction(action, details = "") {
  if (!currentUser) return;
  const now = new Date();
  auditLog.unshift({
    date: now.toLocaleDateString('es-MX') + ' ' + now.toLocaleTimeString('es-MX'),
    username: currentUser.username,
    passwordUsed: currentUser.passwordUsed || "***",
    action: action,
    details: details
  });
  if (auditLog.length > 500) auditLog.pop(); // Mantener solo los últimos 500
  saveAuditLog();
}

function resetSessionTimer() {
  if (sessionTimeout) clearTimeout(sessionTimeout);
  if (currentUser) {
    sessionTimeout = setTimeout(() => {
      logout("Sesión expirada por inactividad (15 min)");
    }, SESSION_TIME_MS);
  }
}

function logout(reason = "") {
  if (currentUser) logAction("Cierre de sesión", reason || "Cierre manual o expiración");
  currentUser = null;
  if (sessionTimeout) clearTimeout(sessionTimeout);
  
  // Ocultar app y mostrar login
  document.getElementById("login-screen").classList.remove("hidden");
  document.getElementById("main-header").style.display = "none";
  document.getElementById("app-container").style.display = "none";
  document.getElementById("password").value = "";
  
  if (reason) showAlert(reason);
}

// Escuchar actividad para resetear el tiempo de sesión
document.addEventListener("mousemove", resetSessionTimer);
document.addEventListener("click", resetSessionTimer);
document.addEventListener("keypress", resetSessionTimer);
document.addEventListener("touchstart", resetSessionTimer);

function renderLoginUsers() {
  const select = document.getElementById("username");
  if (!select) return;
  select.innerHTML = `<option value="">Selecciona un usuario...</option>` + 
    users.map(u => `<option value="${u.username}">${u.username}</option>`).join("");
}

function openSettingsModal() {
  const modal = document.getElementById("settings-modal");
  const modalBody = document.getElementById("settings-modal-body");
  
  if (currentUser.role === "admin") {
    modalBody.innerHTML = `
      <div class="tabs">
        <button class="tab-btn active" onclick="switchTab('users-tab', this)">Gestión de Usuarios</button>
        <button class="tab-btn" onclick="switchTab('audit-tab', this)">Registro de Actividad</button>
      </div>
      
      <div id="users-tab" class="tab-content active">
        <div class="table-wrapper" style="margin-top: 10px;">
          <table class="users-table" style="width: 100%; text-align: left;">
            <thead><tr><th>Usuario</th><th>Contraseña</th><th>Rol</th><th>Acciones</th></tr></thead>
            <tbody>
              ${users.map((u, i) => `
                <tr>
                  <td>${u.username}</td>
                  <td>${u.password}</td>
                  <td>${u.role === 'admin' ? '<span class="badge badge-admin">Admin</span>' : '<span class="badge badge-user">Normal</span>'}</td>
                  <td>
                    <button class="btn-tiny" onclick="deleteUser(${i})">Eliminar</button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        <div style="margin-top:15px; border-top:1px solid #ddd; padding-top:15px;">
          <h4>Agregar / Editar Usuario</h4>
          <input type="text" id="new-user-name" placeholder="Nombre" class="filter-input" style="margin-bottom:5px;">
          <input type="text" id="new-user-pass" placeholder="Contraseña" class="filter-input" style="margin-bottom:5px;">
          <select id="new-user-role" class="filter-input" style="margin-bottom:5px;">
            <option value="user">Normal</option>
            <option value="admin">Administrador</option>
          </select>
          <button class="btn-primary" onclick="addOrUpdateUser()">Guardar Usuario</button>
        </div>
      </div>
      
      <div id="audit-tab" class="tab-content hidden">
        <div class="table-wrapper" style="margin-top: 10px; max-height: 400px; overflow-y: auto;">
          <table class="users-table" style="width: 100%; text-align: left; font-size: 0.8rem;">
            <thead><tr><th>Fecha/Hora</th><th>Usuario</th><th>Pass Usado</th><th>Acción</th><th>Detalles</th></tr></thead>
            <tbody>
              ${auditLog.map(l => `
                <tr>
                  <td style="white-space:nowrap">${l.date}</td>
                  <td><strong>${l.username}</strong></td>
                  <td>${l.passwordUsed}</td>
                  <td>${l.action}</td>
                  <td>${l.details}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        <button class="btn-small" style="margin-top: 10px; color: red; border-color: red;" onclick="clearAudit()">Limpiar Registro</button>
      </div>
    `;
  } else {
    // Normal User Settings
    modalBody.innerHTML = `
      <h3>Mis Ajustes</h3>
      <p>Hola <strong>${currentUser.username}</strong>, aquí puedes cambiar tu contraseña.</p>
      <div style="margin-top:15px;">
        <input type="text" id="my-new-pass" placeholder="Nueva Contraseña" class="filter-input" style="margin-bottom:10px;">
        <button class="btn-primary" onclick="changeMyPassword()">Actualizar Contraseña</button>
      </div>
    `;
  }
  
  modal.classList.remove("hidden");
}

window.switchTab = function(tabId, btnElement) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(tabId).classList.remove('hidden');
  if (btnElement) btnElement.classList.add('active');
}

window.deleteUser = function(index) {
  if (users[index].username === currentUser.username) {
    showAlert("No puedes eliminarte a ti mismo.");
    return;
  }
  if (confirm("¿Eliminar a " + users[index].username + "?")) {
    users.splice(index, 1);
    saveUsers();
    openSettingsModal();
  }
}

window.addOrUpdateUser = function() {
  const name = document.getElementById("new-user-name").value.trim();
  const pass = document.getElementById("new-user-pass").value.trim();
  const role = document.getElementById("new-user-role").value;
  
  if (!name || !pass) { showAlert("Llena nombre y contraseña"); return; }
  
  const existing = users.find(u => u.username.toLowerCase() === name.toLowerCase());
  if (existing) {
    existing.password = pass;
    existing.role = role;
    showAlert("Usuario actualizado.");
  } else {
    users.push({ username: name, password: pass, role: role });
    showAlert("Usuario creado.");
  }
  saveUsers();
  openSettingsModal();
}

window.changeMyPassword = function() {
  const pass = document.getElementById("my-new-pass").value.trim();
  if (!pass) { showAlert("Ingresa una contraseña"); return; }
  const user = users.find(u => u.username === currentUser.username);
  if (user) {
    user.password = pass;
    saveUsers();
    document.getElementById("settings-modal").classList.add("hidden");
    showAlert("✅ Contraseña actualizada exitosamente.");
    logAction("Cambio de contraseña", "El usuario cambió su propia contraseña.");
    document.getElementById("my-new-pass").value = "";
  }
}

window.clearAudit = function() {
  if(confirm("¿Seguro que deseas borrar todo el registro de actividad?")) {
    auditLog = [];
    saveAuditLog();
    openSettingsModal();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderLoginUsers();
  // Esconder header y app al inicio
  document.getElementById("main-header").style.display = "none";
  document.getElementById("app-container").style.display = "none";
});
