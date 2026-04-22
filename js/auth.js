// js/auth.js
// Manejo de Usuarios, Sesiones y Auditoría

const DEFAULT_USERS = [
  { username: "admin", password: "ivan1.1", role: "superadmin" },
  { username: "Ivan", password: "1", role: "admin" },
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
  const visibleUsers = users.filter(u => u.username !== "admin");
  select.innerHTML = `<option value="">Selecciona un usuario...</option>` + 
    visibleUsers.map(u => `<option value="${u.username}">${u.username}</option>`).join("");
}

function openSettingsModal() {
  const modal = document.getElementById("settings-modal");
  const modalBody = document.getElementById("settings-modal-body");
  
  if (currentUser.role === "superadmin" || currentUser.role === "admin" || currentUser.role === "user") {
    let tabsHtml = `<div class="tabs">`;
    tabsHtml += `<button class="tab-btn active" onclick="switchTab('users-tab', this)">Gestión de Usuarios</button>`;
    if (currentUser.role === "superadmin") {
      tabsHtml += `<button class="tab-btn" onclick="switchTab('audit-tab', this)">Registro de Actividad</button>`;
    }
    tabsHtml += `<button class="tab-btn" onclick="switchTab('myaccount-tab', this)">Mi Cuenta</button>`;
    tabsHtml += `</div>`;
    
    let visibleUsers = [];
    let roleOptions = "";
    
    if (currentUser.role === "superadmin") {
      visibleUsers = users;
      roleOptions = `<option value="user">Normal</option><option value="admin">Administrador</option>`;
    } else if (currentUser.role === "admin") {
      visibleUsers = users.filter(u => u.role !== "superadmin");
      roleOptions = `<option value="user">Normal</option><option value="admin">Administrador</option>`;
    } else if (currentUser.role === "user") {
      visibleUsers = users.filter(u => u.createdBy === currentUser.username);
      roleOptions = `<option value="subuser">Sub-Usuario</option>`;
    }

    let usersHtml = visibleUsers.map((u) => {
      let idx = users.findIndex(ux => ux.username === u.username);
      let badge = u.role === "superadmin" ? "S-Admin" : (u.role === "admin" ? "Admin" : (u.role === "user" ? "User" : "SubUser"));
      return `<tr>
        <td>${u.username}</td>
        <td>${u.password}</td>
        <td><span class="badge badge-user">${badge}</span></td>
        <td><button class="btn-tiny" onclick="deleteUser(${idx})">Eliminar</button></td>
      </tr>`;
    }).join("");

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
      <div id="users-tab" class="tab-content active">
        <div class="table-wrapper" style="margin-top: 10px;">
          <table class="users-table" style="width: 100%; text-align: left;">
            <thead><tr><th>Usuario</th><th>Contraseña</th><th>Rol</th><th>Acciones</th></tr></thead>
            <tbody>${usersHtml}</tbody>
          </table>
        </div>
        <div style="margin-top:15px; border-top:1px solid var(--border-soft); padding-top:15px;">
          <h4 style="font-size:0.95rem; margin-bottom:10px; color:var(--text-primary);">Agregar / Editar Usuario</h4>
          <input type="text" id="new-user-name" placeholder="Nombre" class="filter-input" style="margin-bottom:10px;">
          <div class="password-wrapper" style="margin-bottom:10px;">
            <input type="password" id="new-user-pass" placeholder="Contraseña" class="filter-input" style="background:#fff; width:100%;">
            <button type="button" class="password-toggle" onclick="togglePasswordVisibility('new-user-pass', event)" title="Mostrar contraseña">👁️</button>
          </div>
          <select id="new-user-role" class="filter-input" style="margin-bottom:10px;">
            ${roleOptions}
          </select>
          <button class="btn-primary" onclick="addOrUpdateUser()">Guardar Usuario</button>
        </div>
      </div>
      ${auditHtml}
      <div id="myaccount-tab" class="tab-content">
        <div style="padding:10px 0 6px;">
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:18px;">
            Sesión activa como <strong>${currentUser.username}</strong>
            <span class="badge badge-admin" style="margin-left:8px;">${currentUser.role}</span>
          </p>
          <label style="display:block; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-muted); margin-bottom:8px;">Nueva contraseña</label>
          <div class="password-wrapper" style="margin-bottom:10px;">
            <input type="password" id="my-new-pass" placeholder="Escribe tu nueva contraseña" class="filter-input" style="background:#fff; width:100%;">
            <button type="button" class="password-toggle" onclick="togglePasswordVisibility('my-new-pass', event)" title="Mostrar contraseña">👁️</button>
          </div>
          <button class="btn-primary" onclick="changeMyPassword()">Actualizar Contraseña</button>
          <div style="margin-top:20px; border-top:1px solid var(--border-soft); padding-top:16px;">
            <button class="btn-small" style="color:var(--accent-red); border-color:var(--accent-red); width:100%; padding:10px;" onclick="document.getElementById('settings-modal').classList.add('hidden'); logout();">Cerrar Sesión</button>
          </div>
        </div>
      </div>
    `;
  } else {
    // Subuser — solo puede cambiar su propia contraseña
    modalBody.innerHTML = `
      <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:18px;">
        Sesión activa como <strong>${currentUser.username}</strong>
        <span class="badge badge-user" style="margin-left:8px;">Sub-Usuario</span>
      </p>
      <label style="display:block; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-muted); margin-bottom:8px;">Nueva contraseña</label>
      <div class="password-wrapper" style="margin-bottom:10px;">
        <input type="password" id="my-new-pass" placeholder="Escribe tu nueva contraseña" class="filter-input" style="background:#fff; width:100%;">
        <button type="button" class="password-toggle" onclick="togglePasswordVisibility('my-new-pass', event)" title="Mostrar contraseña">👁️</button>
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
  const btn = evt?.target?.closest?.('.password-toggle') || document.querySelector(`[data-toggle-for="${inputId}"]`);
  if (!input || !btn) return;

  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '👁️';
    btn.title = 'Ocultar contraseña';
  } else {
    input.type = 'password';
    btn.textContent = '👁️';
    btn.title = 'Mostrar contraseña';
  }
  input.focus();
}

document.addEventListener("DOMContentLoaded", () => {
  renderLoginUsers();
  // Esconder header y app al inicio
  document.getElementById("main-header").style.display = "none";
  document.getElementById("app-container").style.display = "none";
});
