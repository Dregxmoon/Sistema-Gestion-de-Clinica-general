// ============================================================
// MEDIC-ON — App Core: Auth, Routing, Layout
// ============================================================

// ── Navigation state ──────────────────────────────────────────
let currentPage = "dashboard";

const MENU_ITEMS = [
  { id: "dashboard",      label: "Dashboard",      icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>`,  roles: ["ADMINISTRACION","MEDICO","RECEPCION"] },
  { id: "citas",          label: "Citas",           icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,    roles: ["ADMINISTRACION","MEDICO","RECEPCION"] },
  { id: "pacientes",      label: "Pacientes",       icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`, roles: ["ADMINISTRACION","MEDICO","RECEPCION"] },
  { id: "medicos",        label: "Médicos",         icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`, roles: ["ADMINISTRACION","RECEPCION"] },
  { id: "horarios",       label: "Horarios",        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,    roles: ["ADMINISTRACION"] },
  { id: "usuarios",       label: "Usuarios",        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`,   roles: ["ADMINISTRACION"] },
  { id: "sucursales",     label: "Sucursales",      icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`, roles: ["ADMINISTRACION"] },
  { id: "especialidades", label: "Especialidades",  icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`, roles: ["ADMINISTRACION"] },
  { id: "bitacora",       label: "Bitácora",        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,   roles: ["ADMINISTRACION"] },
];

// ── Auth ──────────────────────────────────────────────────────
function initLogin() {
  document.getElementById("app").innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 p-4">
      <!-- Background decoration -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      <div class="relative w-full max-w-md">
        <!-- Logo/brand -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-400 to-teal-500 shadow-2xl shadow-sky-500/30 mb-4">
            <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </div>
          <h1 class="text-4xl font-bold text-white tracking-tight">Medic<span class="text-sky-400">ON</span></h1>
          <p class="text-slate-400 mt-1 text-sm">Sistema de Gestión Médica</p>
        </div>

        <!-- Login card -->
        <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 class="text-white font-semibold text-lg mb-6">Iniciar sesión</h2>

          <div class="space-y-4">
            <div>
              <label class="text-slate-300 text-sm font-medium block mb-1.5">Usuario</label>
              <input id="login-user" type="text" placeholder="Nombre de usuario"
                class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all">
            </div>
            <div>
              <label class="text-slate-300 text-sm font-medium block mb-1.5">Contraseña</label>
              <input id="login-pass" type="password" placeholder="••••••••"
                class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all">
            </div>
          </div>

          <div id="login-error" class="hidden mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
            Usuario o contraseña incorrectos
          </div>

          <button id="login-btn" onclick="doLogin()"
            class="w-full mt-6 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.01] active:scale-100">
            Ingresar al sistema
          </button>

          <!-- Demo hints -->
          <div class="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <p class="text-slate-400 text-xs font-medium mb-2">Cuentas de demostración:</p>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between text-slate-400"><span class="font-mono text-slate-300">admin</span><span>/ admin123 (Administrador)</span></div>
              <div class="flex justify-between text-slate-400"><span class="font-mono text-slate-300">dr_garcia</span><span>/ med123 (Médico)</span></div>
              <div class="flex justify-between text-slate-400"><span class="font-mono text-slate-300">recep01</span><span>/ rec123 (Recepción)</span></div>
            </div>
          </div>
        </div>

        <p class="text-center text-slate-600 text-xs mt-6">Medic-ON v1.0 · Instituto Tecnológico de Tijuana</p>
      </div>
    </div>`;

  document.getElementById("login-pass").addEventListener("keydown", e => { if (e.key === "Enter") doLogin(); });
  document.getElementById("login-user").addEventListener("keydown", e => { if (e.key === "Enter") document.getElementById("login-pass").focus(); });
}

function doLogin() {
  const u = document.getElementById("login-user").value.trim();
  const p = document.getElementById("login-pass").value;
  const user = DB.usuarios.find(x => x.username === u && x.password === p && x.activo);
  if (!user) {
    document.getElementById("login-error").classList.remove("hidden");
    document.getElementById("login-btn").classList.add("shake");
    setTimeout(() => document.getElementById("login-btn")?.classList.remove("shake"), 500);
    return;
  }
  DB.currentUser = user;
  logAction("Inicio de sesión");
  initApp();
}

function doLogout() {
  logAction("Cierre de sesión");
  DB.currentUser = null;
  initLogin();
}

// ── App Shell ─────────────────────────────────────────────────
function initApp() {
  const allowedMenu = MENU_ITEMS.filter(m => m.roles.includes(DB.currentUser.rol));

  document.getElementById("app").innerHTML = `
    <div class="flex h-screen bg-slate-50 overflow-hidden">
      <!-- Sidebar -->
      <aside id="sidebar" class="w-64 bg-slate-900 flex flex-col flex-shrink-0 shadow-2xl">
        <!-- Logo -->
        <div class="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center shadow-lg flex-shrink-0">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </div>
          <div>
            <h1 class="text-white font-bold text-lg leading-none">Medic<span class="text-sky-400">ON</span></h1>
            <p class="text-slate-500 text-xs">Gestión médica</p>
          </div>
        </div>

        <!-- Nav -->
        <nav class="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          ${allowedMenu.map(m => `
            <button id="nav-${m.id}" onclick="navigate('${m.id}')"
              class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-slate-400 hover:text-white hover:bg-white/10">
              ${m.icon}
              <span class="text-sm font-medium">${m.label}</span>
            </button>`).join("")}
        </nav>

        <!-- User -->
        <div class="px-3 py-4 border-t border-white/10">
          <div class="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              ${DB.currentUser.nombre[0]}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white text-xs font-medium truncate">${DB.currentUser.nombre}</p>
              <p class="text-slate-500 text-xs truncate">${DB.currentUser.rol}</p>
            </div>
            <button onclick="doLogout()" title="Cerrar sesión" class="text-slate-500 hover:text-red-400 transition-colors flex-shrink-0">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Topbar -->
        <header class="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
          <div id="page-breadcrumb" class="flex items-center gap-2 text-sm text-slate-500">
            <span>Medic-ON</span>
            <span>›</span>
            <span id="page-title-nav" class="text-slate-800 font-medium">Dashboard</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right hidden sm:block">
              <p class="text-xs font-medium text-slate-700">${DB.currentUser.nombre}</p>
              <p class="text-xs text-slate-400">${new Date().toLocaleDateString("es-MX",{weekday:"short",month:"short",day:"numeric"})}</p>
            </div>
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
              ${DB.currentUser.nombre[0]}
            </div>
          </div>
        </header>

        <!-- Content -->
        <main id="page-content" class="flex-1 overflow-y-auto p-6">
        </main>
      </div>
    </div>`;

  navigate("dashboard");
}

// ── Router ────────────────────────────────────────────────────
const RENDERERS = {
  dashboard:      renderDashboard,
  sucursales:     renderSucursales,
  especialidades: renderEspecialidades,
  usuarios:       renderUsuarios,
  medicos:        renderMedicos,
  horarios:       renderHorarios,
  pacientes:      renderPacientes,
  citas:          renderCitas,
  bitacora:       renderBitacora,
};

function navigate(page) {
  currentPage = page;
  renderPage(page);
}

function renderPage(page) {
  const renderer = RENDERERS[page];
  if (!renderer) return;

  // Update nav active state
  document.querySelectorAll(".nav-item").forEach(el => {
    el.classList.remove("bg-sky-500/20","text-sky-300");
    el.classList.add("text-slate-400");
  });
  const activeBtn = document.getElementById(`nav-${page}`);
  if (activeBtn) {
    activeBtn.classList.remove("text-slate-400");
    activeBtn.classList.add("bg-sky-500/20","text-sky-300");
  }

  // Update breadcrumb
  const label = MENU_ITEMS.find(m => m.id === page)?.label || "";
  const titleEl = document.getElementById("page-title-nav");
  if (titleEl) titleEl.textContent = label;

  // Render content with fade
  const content = document.getElementById("page-content");
  if (content) {
    content.classList.add("opacity-0");
    requestAnimationFrame(() => {
      content.innerHTML = renderer();
      content.classList.remove("opacity-0");
      content.classList.add("page-fade-in");
      setTimeout(() => content.classList.remove("page-fade-in"), 300);
    });
  }
}

// ── Init ──────────────────────────────────────────────────────
window.navigate = navigate;
document.addEventListener("DOMContentLoaded", initLogin);
