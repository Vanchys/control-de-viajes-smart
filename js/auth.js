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

// Render custom dropdown for username (non-native UI)
function renderUsernameDropdown() {
  const display = document.getElementById("username-display");
  const menu = document.getElementById("username-options");
  if (!display || !menu) return;
  const visibleUsers = users.filter(u => u.username !== "admin");
  menu.innerHTML = `<div class="username-option" data-username="">Selecciona un usuario...</div>` +
    visibleUsers.map(u => `<div class="username-option" data-username="${u.username}">${u.username}</div>`).join("");

  // Bind click handlers for options
  menu.querySelectorAll('.username-option').forEach((el) => {
    el.addEventListener('click', () => {
      const user = el.dataset.username;
      if (!user) return;
      display.textContent = user;
      const native = document.getElementById("username");
      if (native) native.value = user;
      // Close menu
      menu.classList.add("hidden");
      display.setAttribute("aria-expanded", "false");
    });
  });

  // Toggle on dropdown click
  const dropdown = document.getElementById("username-dropdown");
  if (dropdown) {
    dropdown.addEventListener("click", (e) => {
      // ignore clicks on the options themselves
      if (e.target.closest('.username-option')) return;
      menu.classList.toggle("hidden");
      const expanded = !menu.classList.contains("hidden");
      dropdown.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
  }

  // Close when clicking outside
  document.addEventListener("click", (ev) => {
    if (!dropdown || dropdown.contains(ev.target)) return;
    if (menu && !menu.contains(ev.target)) {
      menu.classList.add("hidden");
      dropdown.setAttribute("aria-expanded", "false");
    }
  });
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
        <div class="table-wrapper audit-table-wrapper">
          <table class="users-table users-table-compact">
            <thead><tr><th>Fecha/Hora</th><th>Usuario</th><th>Pass Usado</th><th>Acción</th><th>Detalles</th></tr></thead>
            <tbody>
              ${auditLog.map(l => `
                <tr>
                  <td class="audit-date">${l.date}</td>
                  <td><strong>${l.username}</strong></td>
                  <td>${l.passwordUsed}</td>
                  <td>${l.action}</td>
                  <td>${l.details}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        <button class="btn-small btn-danger settings-field" onclick="clearAudit()">Limpiar Registro</button>
      </div>`;
    }

    modalBody.innerHTML = tabsHtml + `
      <div id="myaccount-tab" class="tab-content active">
        <div class="settings-panel">
          <label class="settings-label">Nueva contraseña</label>
          <div class="password-wrapper settings-field">
            <button type="button" class="password-toggle" onclick="togglePasswordVisibility('my-new-pass', event)">Mostrar</button>
            <input type="password" id="my-new-pass" placeholder="Escribe tu nueva contraseña" class="filter-input settings-input-full">
          </div>
          <button class="btn-primary" onclick="changeMyPassword()">Actualizar Contraseña</button>
          <div class="settings-section">
            <button class="btn-small btn-danger btn-modal-action" onclick="document.getElementById('settings-modal').classList.add('hidden'); logout();">Cerrar Sesión</button>
          </div>
        </div>
      </div>
      <div id="users-tab" class="tab-content">
        <div class="settings-panel">
          <h4 class="settings-subtitle">Agregar / Editar Usuario</h4>
          <input type="text" id="new-user-name" placeholder="Nombre" class="filter-input settings-field">
          <div class="password-wrapper settings-field">
            <button type="button" class="password-toggle" onclick="togglePasswordVisibility('new-user-pass', event)">Mostrar</button>
            <input type="password" id="new-user-pass" placeholder="Contraseña" class="filter-input settings-input-full">
          </div>
          <select id="new-user-role" class="filter-input settings-field">
            ${roleOptions}
          </select>
          <button class="btn-primary" onclick="addOrUpdateUser()">Guardar Usuario</button>

          <!-- Nueva sección: Lista de Usuarios con opción de Eliminar -->
          <div class="settings-section-spacious">
            <h4 class="settings-subtitle">Usuarios Existentes</h4>
            <div class="table-wrapper users-table-wrap">
              <table class="users-table">
                <thead>
                  <tr class="users-table-head-row">
                    <th>Usuario</th>
                    <th>Rol</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  ${users.map((u, index) => {
                    // Filtrado de visibilidad según rol
                    if (currentUser.role === 'user' && u.createdBy !== currentUser.username) return '';
                    if (u.username === 'admin' && currentUser.username !== 'admin') return '';
                    
                    const isSelf = u.username === currentUser.username;
                    const isSuperAdmin = u.role === 'superadmin';
                    const canDelete = !isSelf && (
                      currentUser.role === 'superadmin' || 
                      (currentUser.role === 'admin' && !isSuperAdmin) || 
                      (currentUser.role === 'user' && u.createdBy === currentUser.username)
                    );

                    const badgeClass = `role-badge role-badge-${u.role}`;

                    return `
                      <tr class="user-row">
                        <td class="user-cell">
                          <div class="user-name">${u.username}</div>
                          ${u.createdBy ? `<div class="user-meta">Vía: ${u.createdBy}</div>` : ''}
                        </td>
                        <td class="user-cell">
                          <span class="${badgeClass}">
                            ${u.role}
                          </span>
                        </td>
                        <td class="user-action-cell">
                          ${canDelete ? `
                            <button class="btn-tiny btn-danger" 
                              onclick="deleteUser(${index})">
                              Eliminar
                            </button>
                          ` : '<span class="blocked-label">Bloqueado</span>'}
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      ${auditHtml}
    `;
  } else {
    // Subuser — solo puede cambiar su propia contraseña
    modalBody.innerHTML = `
      <label class="settings-label">Nueva contraseña</label>
      <div class="password-wrapper settings-field">
        <button type="button" class="password-toggle" onclick="togglePasswordVisibility('my-new-pass', event)">Mostrar</button>
        <input type="password" id="my-new-pass" placeholder="Escribe tu nueva contraseña" class="filter-input settings-input-full">
      </div>
      <button class="btn-primary" onclick="changeMyPassword()">Actualizar Contraseña</button>
      <div class="settings-section">
        <button class="btn-small btn-danger btn-modal-action" onclick="document.getElementById('settings-modal').classList.add('hidden'); logout();">Cerrar Sesión</button>
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
   renderUsernameDropdown();
   // Esconder header y app al inicio
   document.getElementById("main-header").style.display = "none";
   document.getElementById("app-container").style.display = "none";
});
