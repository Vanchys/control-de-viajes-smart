// js/auth.js
// Manejo de Usuarios, Sesiones y Auditoría

const DEFAULT_USERS = [
  { username: "admin", password: "Ivan1.1", role: "superadmin" },
  { username: "Ivan", password: "1", role: "admin" },
  { username: "Timoteo", password: "arminio", role: "user" }
];

let users = JSON.parse(localStorage.getItem("smart_users")) || DEFAULT_USERS;
let auditLog = JSON.parse(localStorage.getItem("smart_audit")) || [];
let currentUser = null;
let sessionTimeout = null;
const SESSION_TIME_MS = 15 * 60 * 1000; // 15 minutos

// Normalización/migración: si ya existía el password viejo, corregirlo
// (evita que localStorage mantenga "ivan1.1" y bloquee el login).
(() => {
  const adminUser = users.find(u => u.username === "admin");
  if (adminUser && adminUser.password === "ivan1.1") {
    adminUser.password = "Ivan1.1";
    saveUsers();
  }
})();

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
  const visibleUsers = users.filter(u => u.username !== "admin");
  select.innerHTML = `<option value="">Selecciona un usuario...</option>` +
    visibleUsers.map(u => `<option value="${u.username}">${u.username}</option>`).join("");
}

function openSettingsModal() {
  const modal = document.getElementById("settings-modal");
  const modalBody = document.getElementById("settings-modal-body");
  
  if (currentUser.role === "superadmin" || currentUser.role === "admin" || currentUser.role === "user") {
    let tabsHtml = `<div class="tabs">`;
    tabsHtml += `<button class="tab-btn active" onclick="switchTab('myaccount-tab', this)">Cambiar Contraseña</button>`;
    tabsHtml += `<button class="tab-btn" onclick="switchTab('users-tab', this)">Gestión de Usuarios</button>`;
    if (currentUser.role === "superadmin") {
      tabsHtml += `<button class="tab-btn" onclick="switchTab('audit-tab', this)">Registro de Actividad</button>`;
    }
    tabsHtml += `</div>`;
    
    let roleOptions = "";

    if (currentUser.role === "superadmin") {
      roleOptions = `<option value="user">Normal</option><option value="admin">Administrador</option>`;
    } else if (currentUser.role === "admin") {
      roleOptions = `<option value="user">Normal</option><option value="admin">Administrador</option>`;
    } else if (currentUser.role === "user") {
      roleOptions = `<option value="subuser">Sub-Usuario</option>`;
    }


    let auditHtml = "";
    if (currentUser.role === "superadmin") {
      auditHtml = `
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
      </div>`;
    }

    modalBody.innerHTML = tabsHtml + `
      <div id="myaccount-tab" class="tab-content active">
        <div style="padding:10px 0 6px;">
          <label style="display:block; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-muted); margin-bottom:8px;">Nueva contraseña</label>
          <div class="password-wrapper" style="margin-bottom:10px;">
            <button type="button" class="password-toggle" onclick="togglePasswordVisibility('my-new-pass', event)">Mostrar</button>
            <input type="password" id="my-new-pass" placeholder="Escribe tu nueva contraseña" class="filter-input" style="background:#fff; width:100%;">
          </div>
          <button class="btn-primary" onclick="changeMyPassword()">Actualizar Contraseña</button>
          <div style="margin-top:20px; border-top:1px solid var(--border-soft); padding-top:16px;">
            <button class="btn-small" style="color:var(--accent-red); border-color:var(--accent-red); width:100%; padding:10px;" onclick="document.getElementById('settings-modal').classList.add('hidden'); logout();">Cerrar Sesión</button>
          </div>
        </div>
      </div>
      <div id="users-tab" class="tab-content">
        <div style="margin-top:10px;">
          <h4 style="font-size:0.95rem; margin-bottom:15px; color:var(--text-primary);">Agregar / Editar Usuario</h4>
          <input type="text" id="new-user-name" placeholder="Nombre" class="filter-input" style="margin-bottom:10px;">
          <div class="password-wrapper" style="margin-bottom:10px;">
            <button type="button" class="password-toggle" onclick="togglePasswordVisibility('new-user-pass', event)">Mostrar</button>
            <input type="password" id="new-user-pass" placeholder="Contraseña" class="filter-input" style="background:#fff; width:100%;">
          </div>
          <select id="new-user-role" class="filter-input" style="margin-bottom:10px;">
            ${roleOptions}
          </select>
          <button class="btn-primary" onclick="addOrUpdateUser()">Guardar Usuario</button>
        </div>
      </div>
      ${auditHtml}
    `;
  } else {
    // Subuser — solo puede cambiar su propia contraseña
    modalBody.innerHTML = `
      <label style="display:block; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-muted); margin-bottom:8px;">Nueva contraseña</label>
      <div class="password-wrapper" style="margin-bottom:10px;">
        <button type="button" class="password-toggle" onclick="togglePasswordVisibility('my-new-pass', event)">Mostrar</button>
        <input type="password" id="my-new-pass" placeholder="Escribe tu nueva contraseña" class="filter-input" style="background:#fff; width:100%;">
      </div>
      <button class="btn-primary" onclick="changeMyPassword()">Actualizar Contraseña</button>
      <div style="margin-top:20px; border-top:1px solid var(--border-soft); padding-top:16px;">
        <button class="btn-small" style="color:var(--accent-red); border-color:var(--accent-red); width:100%; padding:10px;" onclick="document.getElementById('settings-modal').classList.add('hidden'); logout();">Cerrar Sesión</button>
      </div>
    `;
  }
  
  modal.classList.remove("hidden");
}

window.switchTab = function(tabId, btnElement) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  if (btnElement) btnElement.classList.add('active');
}

window.deleteUser = function(index) {
  const targetUser = users[index];
  if (targetUser.username === currentUser.username) {
    showAlert("No puedes eliminarte a ti mismo.");
    return;
  }
  
  // Seguridad: Un admin no puede borrar al SuperAdmin
  if (targetUser.role === "superadmin" && currentUser.role !== "superadmin") {
    showAlert("No tienes permiso para eliminar al Super-Administrador.");
    return;
  }

  // Seguridad: Un usuario normal solo puede borrar a sus propios sub-usuarios
  if (currentUser.role === "user" && targetUser.createdBy !== currentUser.username) {
    showAlert("No tienes permiso para eliminar este usuario.");
    return;
  }

  if (confirm("¿Eliminar a " + targetUser.username + "?")) {
    users.splice(index, 1);
    saveUsers();
    openSettingsModal();
    // Si borramos al admin siendo superadmin, hay que refrescar la lista de login
    renderLoginUsers();
  }
}

window.addOrUpdateUser = function() {
  const name = document.getElementById("new-user-name").value.trim();
  const pass = document.getElementById("new-user-pass").value.trim();
  const role = document.getElementById("new-user-role").value;
  
  if (!name || !pass) { showAlert("Llena nombre y contraseña"); return; }
  
  if (currentUser.role === "user") {
    const subusersCount = users.filter(u => u.createdBy === currentUser.username).length;
    const existing = users.find(u => u.username.toLowerCase() === name.toLowerCase());
    if (!existing && subusersCount >= 2) {
      showAlert("Límite alcanzado: Solo puedes crear 2 sub-usuarios.");
      return;
    }
  }
  
  const existing = users.find(u => u.username.toLowerCase() === name.toLowerCase());
  if (existing) {
    if (existing.role === "superadmin" && currentUser.role !== "superadmin") {
      showAlert("No tienes permiso para editar este usuario.");
      return;
    }
    existing.password = pass;
    existing.role = role;
    showAlert("Usuario actualizado.");
  } else {
    users.push({ username: name, password: pass, role: role, createdBy: currentUser.username });
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

window.togglePasswordVisibility = function(inputId, evt) {
  const input = document.getElementById(inputId);
  const btn = evt.target;
  if (!input) return;

  if (input.type === 'password') {
    input.type = 'text';
    btn.classList.add('active');
    btn.textContent = 'Ocultar';
  } else {
    input.type = 'password';
    btn.classList.remove('active');
    btn.textContent = 'Mostrar';
  }
  input.focus();
}

document.addEventListener("DOMContentLoaded", () => {
  renderLoginUsers();
  // Esconder header y app al inicio
  document.getElementById("main-header").style.display = "none";
  document.getElementById("app-container").style.display = "none";
});
