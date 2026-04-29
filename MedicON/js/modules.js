// ============================================================
// MEDIC-ON — Módulos del sistema
// ============================================================

// ══════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════
function renderDashboard() {
  const hoy = today(0);
  const citasHoy = DB.citas.filter(c => c.fecha === hoy);
  const medicosActivos = DB.medicos.filter(m => m.activo).length;
  const pendientes = citasHoy.filter(c => c.estado === "PENDIENTE").length;

  return `
    <!-- KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
      ${kpiCard("Pacientes totales", DB.pacientes.length, "📋", "bg-sky-500", "+3 este mes")}
      ${kpiCard("Citas hoy", citasHoy.length, "📅", "bg-violet-500", `${pendientes} pendientes`)}
      ${kpiCard("Médicos activos", medicosActivos, "👨‍⚕️", "bg-emerald-500", `${DB.sucursales.filter(s=>s.activa).length} sucursales`)}
      ${kpiCard("Finalizadas", DB.citas.filter(c=>c.estado==="FINALIZADA").length, "✅", "bg-amber-500", "histórico total")}
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- Citas del día -->
      <div class="xl:col-span-2 card">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-semibold text-slate-800 text-base">Citas de hoy — ${new Date().toLocaleDateString("es-MX",{weekday:"long",day:"numeric",month:"long"})}</h3>
          <button onclick="navigate('citas')" class="text-xs text-sky-600 hover:underline">Ver todas →</button>
        </div>
        ${citasHoy.length === 0
          ? `<div class="text-center py-10 text-slate-400"><div class="text-3xl mb-2">🗓️</div><p>No hay citas para hoy</p></div>`
          : `<div class="space-y-3">${citasHoy.map(c => citaRow(c)).join("")}</div>`
        }
      </div>

      <!-- Panel lateral -->
      <div class="space-y-6">
        <!-- Distribución por estado -->
        <div class="card">
          <h3 class="font-semibold text-slate-800 text-base mb-4">Estado de citas</h3>
          ${miniDonut()}
        </div>
        <!-- Próximas citas -->
        <div class="card">
          <h3 class="font-semibold text-slate-800 text-base mb-4">Próximas citas</h3>
          <div class="space-y-2">
            ${DB.citas.filter(c=>c.fecha > hoy && c.estado==="PENDIENTE").slice(0,4).map(c=>`
              <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                <div class="w-8 h-8 rounded-full bg-sky-100 text-sky-600 text-xs font-bold flex items-center justify-center">${c.hora.slice(0,5)}</div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-slate-700 truncate">${getPacienteNombre(c.paciente_id)}</p>
                  <p class="text-xs text-slate-400">${c.fecha} · ${getMedicoNombre(c.medico_id).replace("Dr. ","Dr ").split(" ").slice(0,2).join(" ")}</p>
                </div>
              </div>`).join("") || '<p class="text-sm text-slate-400 text-center py-4">Sin próximas citas</p>'}
          </div>
        </div>
      </div>
    </div>`;
}

function kpiCard(label, value, icon, color, sub) {
  return `
    <div class="card flex items-center gap-4">
      <div class="w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-2xl flex-shrink-0 shadow-lg">
        ${icon}
      </div>
      <div>
        <p class="text-3xl font-bold text-slate-800">${value}</p>
        <p class="text-sm font-medium text-slate-600">${label}</p>
        <p class="text-xs text-slate-400 mt-0.5">${sub}</p>
      </div>
    </div>`;
}

function citaRow(c) {
  return `
    <div class="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
      <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold flex flex-col items-center justify-center leading-tight">
        <span>${c.hora.slice(0,5)}</span>
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-medium text-slate-800 text-sm truncate">${getPacienteNombre(c.paciente_id)}</p>
        <p class="text-xs text-slate-400">${getMedicoNombre(c.medico_id)} · ${c.motivo}</p>
      </div>
      ${estadoBadge(c.estado)}
    </div>`;
}

function miniDonut() {
  const total = DB.citas.length || 1;
  const pct = {
    pendiente:  Math.round(DB.citas.filter(c=>c.estado==="PENDIENTE").length/total*100),
    finalizada: Math.round(DB.citas.filter(c=>c.estado==="FINALIZADA").length/total*100),
    cancelada:  Math.round(DB.citas.filter(c=>c.estado==="CANCELADA").length/total*100),
  };
  return `
    <div class="space-y-2">
      ${statBar("Pendientes",   pct.pendiente,  "bg-sky-500")}
      ${statBar("Finalizadas",  pct.finalizada, "bg-emerald-500")}
      ${statBar("Canceladas",   pct.cancelada,  "bg-red-400")}
    </div>`;
}
function statBar(label, pct, color) {
  return `
    <div>
      <div class="flex justify-between text-xs text-slate-500 mb-1"><span>${label}</span><span>${pct}%</span></div>
      <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div class="${color} h-full rounded-full transition-all" style="width:${pct}%"></div>
      </div>
    </div>`;
}

// ══════════════════════════════════════════════
// SUCURSALES
// ══════════════════════════════════════════════
function renderSucursales() {
  const rows = DB.sucursales.map(s => [
    `<span class="font-medium text-slate-800">${s.nombre}</span>`,
    s.direccion,
    s.telefono,
    estadoBadge(s.activa),
    `<div class="flex gap-1">${btnEdit(`editSucursal(${s.id})`)}${btnDelete(`deleteSucursal(${s.id})`)}  </div>`,
  ]);
  return sectionHeader("Sucursales", "Gestión de sedes del sistema", "Nueva sucursal", "newSucursal()", "🏥")
    + buildTable(["Nombre","Dirección","Teléfono","Estado","Acciones"], rows);
}

window.newSucursal = function() {
  openModal("Nueva sucursal", formSucursal(), () => {
    const n = document.getElementById("s-nombre").value.trim();
    const d = document.getElementById("s-dir").value.trim();
    const t = document.getElementById("s-tel").value.trim();
    const a = document.getElementById("s-activa").value === "true";
    if (!n) return showToast("El nombre es obligatorio","error");
    DB.sucursales.push({ id: DB.nextId.sucursales++, nombre:n, direccion:d, telefono:t, activa:a });
    logAction(`Creó sucursal: ${n}`);
    closeModal(); navigate("sucursales"); showToast("Sucursal creada correctamente");
  });
};
window.editSucursal = function(id) {
  const s = DB.sucursales.find(x=>x.id===id);
  openModal("Editar sucursal", formSucursal(s), () => {
    s.nombre   = document.getElementById("s-nombre").value.trim();
    s.direccion= document.getElementById("s-dir").value.trim();
    s.telefono = document.getElementById("s-tel").value.trim();
    s.activa   = document.getElementById("s-activa").value === "true";
    logAction(`Editó sucursal: ${s.nombre}`);
    closeModal(); navigate("sucursales"); showToast("Sucursal actualizada");
  });
};
window.deleteSucursal = function(id) {
  const s = DB.sucursales.find(x=>x.id===id);
  confirmDialog(`¿Eliminar la sucursal <strong>${s.nombre}</strong>?`, () => {
    DB.sucursales = DB.sucursales.filter(x=>x.id!==id);
    logAction(`Eliminó sucursal: ${s.nombre}`);
    navigate("sucursales"); showToast("Sucursal eliminada","info");
  });
};
function formSucursal(s={}) {
  return `<div class="grid gap-4">
    ${field("Nombre",    input("s-nombre","text","Ej: Sucursal Centro", s.nombre||""), true)}
    ${field("Dirección", input("s-dir","text","Av. Principal 123", s.direccion||""))}
    ${field("Teléfono",  input("s-tel","tel","664-000-0000", s.telefono||""))}
    ${field("Estado",    select("s-activa",[{value:"true",label:"Activa"},{value:"false",label:"Inactiva"}], s.activa!==undefined ? String(s.activa) : "true"))}
  </div>`;
}

// ══════════════════════════════════════════════
// ESPECIALIDADES
// ══════════════════════════════════════════════
function renderEspecialidades() {
  const rows = DB.especialidades.map(e => [
    `<span class="font-medium text-slate-800">${e.nombre}</span>`,
    `<span class="text-slate-500">${e.descripcion}</span>`,
    `<div class="flex gap-1">${btnEdit(`editEsp(${e.id})`)}${btnDelete(`deleteEsp(${e.id})`)}  </div>`,
  ]);
  return sectionHeader("Especialidades","Catálogo de especialidades médicas","Nueva especialidad","newEsp()","🔬")
    + buildTable(["Nombre","Descripción","Acciones"], rows);
}

window.newEsp = function() {
  openModal("Nueva especialidad", formEsp(), () => {
    const n = document.getElementById("e-nombre").value.trim();
    const d = document.getElementById("e-desc").value.trim();
    if (!n) return showToast("El nombre es obligatorio","error");
    DB.especialidades.push({ id: DB.nextId.especialidades++, nombre:n, descripcion:d });
    logAction(`Creó especialidad: ${n}`);
    closeModal(); navigate("especialidades"); showToast("Especialidad creada");
  });
};
window.editEsp = function(id) {
  const e = DB.especialidades.find(x=>x.id===id);
  openModal("Editar especialidad", formEsp(e), () => {
    e.nombre      = document.getElementById("e-nombre").value.trim();
    e.descripcion = document.getElementById("e-desc").value.trim();
    logAction(`Editó especialidad: ${e.nombre}`);
    closeModal(); navigate("especialidades"); showToast("Especialidad actualizada");
  });
};
window.deleteEsp = function(id) {
  const e = DB.especialidades.find(x=>x.id===id);
  confirmDialog(`¿Eliminar la especialidad <strong>${e.nombre}</strong>?`, () => {
    DB.especialidades = DB.especialidades.filter(x=>x.id!==id);
    logAction(`Eliminó especialidad: ${e.nombre}`);
    navigate("especialidades"); showToast("Especialidad eliminada","info");
  });
};
function formEsp(e={}) {
  return `<div class="grid gap-4">
    ${field("Nombre",      input("e-nombre","text","Ej: Cardiología", e.nombre||""), true)}
    ${field("Descripción", textarea("e-desc","Descripción breve de la especialidad", e.descripcion||""))}
  </div>`;
}

// ══════════════════════════════════════════════
// USUARIOS
// ══════════════════════════════════════════════
function renderUsuarios() {
  const rows = DB.usuarios.map(u => [
    `<span class="font-mono text-sm text-slate-600">${u.username}</span>`,
    `<span class="font-medium">${u.nombre}</span>`,
    rolBadge(u.rol),
    estadoBadge(u.activo),
    `<div class="flex gap-1">${btnEdit(`editUsuario(${u.id})`)}${btnDelete(`deleteUsuario(${u.id})`)}  </div>`,
  ]);
  return sectionHeader("Usuarios","Gestión de accesos al sistema","Nuevo usuario","newUsuario()","👤")
    + buildTable(["Username","Nombre completo","Rol","Estado","Acciones"], rows);
}

window.newUsuario = function() {
  openModal("Nuevo usuario", formUsuario(), () => {
    const u = document.getElementById("u-user").value.trim();
    const n = document.getElementById("u-nombre").value.trim();
    const r = document.getElementById("u-rol").value;
    const p = document.getElementById("u-pass").value;
    const a = document.getElementById("u-activo").value === "true";
    if (!u || !n || !p) return showToast("Completa los campos requeridos","error");
    if (DB.usuarios.find(x=>x.username===u)) return showToast("Ese username ya existe","error");
    DB.usuarios.push({ id: DB.nextId.usuarios++, username:u, password:p, nombre:n, rol:r, activo:a });
    logAction(`Creó usuario: ${u}`);
    closeModal(); navigate("usuarios"); showToast("Usuario creado");
  });
};
window.editUsuario = function(id) {
  const u = DB.usuarios.find(x=>x.id===id);
  openModal("Editar usuario", formUsuario(u), () => {
    u.nombre = document.getElementById("u-nombre").value.trim();
    u.rol    = document.getElementById("u-rol").value;
    u.activo = document.getElementById("u-activo").value === "true";
    logAction(`Editó usuario: ${u.username}`);
    closeModal(); navigate("usuarios"); showToast("Usuario actualizado");
  });
};
window.deleteUsuario = function(id) {
  if (id === DB.currentUser?.id) return showToast("No puedes eliminarte a ti mismo","error");
  const u = DB.usuarios.find(x=>x.id===id);
  confirmDialog(`¿Eliminar al usuario <strong>${u.username}</strong>?`, () => {
    DB.usuarios = DB.usuarios.filter(x=>x.id!==id);
    logAction(`Eliminó usuario: ${u.username}`);
    navigate("usuarios"); showToast("Usuario eliminado","info");
  });
};
function formUsuario(u={}) {
  const roles = ["ADMINISTRACION","MEDICO","RECEPCION"].map(r=>({value:r,label:r}));
  return `<div class="grid gap-4">
    ${field("Username", input("u-user","text","Ej: dr_perez", u.username||""), true)}
    ${field("Nombre completo", input("u-nombre","text","Nombre y apellido", u.nombre||""), true)}
    ${field("Rol", select("u-rol", roles, u.rol||"RECEPCION"), true)}
    ${u.id ? "" : field("Contraseña", input("u-pass","password","Contraseña segura"), true)}
    ${field("Estado", select("u-activo",[{value:"true",label:"Activo"},{value:"false",label:"Inactivo"}], u.activo!==undefined?String(u.activo):"true"))}
  </div>`;
}

// ══════════════════════════════════════════════
// MÉDICOS
// ══════════════════════════════════════════════
function renderMedicos() {
  const rows = DB.medicos.map(m => [
    `<span class="font-medium">${m.nombre}</span>`,
    getEspecialidadNombre(m.especialidad_id),
    getSucursalNombre(m.sucursal_id),
    m.telefono,
    estadoBadge(m.activo),
    `<div class="flex gap-1">${btnEdit(`editMedico(${m.id})`)}${btnDelete(`deleteMedico(${m.id})`)}  </div>`,
  ]);
  return sectionHeader("Médicos","Directorio de médicos registrados","Nuevo médico","newMedico()","👨‍⚕️")
    + buildTable(["Nombre","Especialidad","Sucursal","Teléfono","Estado","Acciones"], rows);
}

window.newMedico = function() {
  openModal("Nuevo médico", formMedico(), () => {
    const n = document.getElementById("m-nombre").value.trim();
    const e = parseInt(document.getElementById("m-esp").value);
    const s = parseInt(document.getElementById("m-suc").value);
    const t = document.getElementById("m-tel").value.trim();
    const a = document.getElementById("m-activo").value === "true";
    if (!n) return showToast("El nombre es obligatorio","error");
    DB.medicos.push({ id:DB.nextId.medicos++, nombre:n, especialidad_id:e, sucursal_id:s, telefono:t, activo:a });
    logAction(`Registró médico: ${n}`);
    closeModal(); navigate("medicos"); showToast("Médico registrado");
  });
};
window.editMedico = function(id) {
  const m = DB.medicos.find(x=>x.id===id);
  openModal("Editar médico", formMedico(m), () => {
    m.nombre         = document.getElementById("m-nombre").value.trim();
    m.especialidad_id= parseInt(document.getElementById("m-esp").value);
    m.sucursal_id    = parseInt(document.getElementById("m-suc").value);
    m.telefono       = document.getElementById("m-tel").value.trim();
    m.activo         = document.getElementById("m-activo").value === "true";
    logAction(`Editó médico: ${m.nombre}`);
    closeModal(); navigate("medicos"); showToast("Médico actualizado");
  });
};
window.deleteMedico = function(id) {
  const m = DB.medicos.find(x=>x.id===id);
  confirmDialog(`¿Eliminar al médico <strong>${m.nombre}</strong>?`, () => {
    DB.medicos = DB.medicos.filter(x=>x.id!==id);
    logAction(`Eliminó médico: ${m.nombre}`);
    navigate("medicos"); showToast("Médico eliminado","info");
  });
};
function formMedico(m={}) {
  const esps = DB.especialidades.map(e=>({value:e.id,label:e.nombre}));
  const sucs = DB.sucursales.map(s=>({value:s.id,label:s.nombre}));
  return `<div class="grid gap-4">
    ${field("Nombre completo", input("m-nombre","text","Dr. Nombre Apellido", m.nombre||""), true)}
    ${field("Especialidad",    select("m-esp", esps, m.especialidad_id||""), true)}
    ${field("Sucursal",        select("m-suc", sucs, m.sucursal_id||""), true)}
    ${field("Teléfono",        input("m-tel","tel","664-000-0000", m.telefono||""))}
    ${field("Estado",          select("m-activo",[{value:"true",label:"Activo"},{value:"false",label:"Inactivo"}], m.activo!==undefined?String(m.activo):"true"))}
  </div>`;
}

// ══════════════════════════════════════════════
// HORARIOS
// ══════════════════════════════════════════════
const DIAS_SEMANA = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];

function renderHorarios() {
  return sectionHeader("Horarios","Configuración de turnos por médico","Nuevo horario","newHorario()","🕐")
    + `<div class="grid gap-4">
        ${DB.medicos.filter(m=>m.activo).map(m => {
          const h = DB.horarios.find(x=>x.medico_id===m.id);
          return `
            <div class="card flex flex-col sm:flex-row sm:items-center gap-4">
              <div class="flex-1">
                <p class="font-semibold text-slate-800">${m.nombre}</p>
                <p class="text-xs text-slate-400">${getEspecialidadNombre(m.especialidad_id)}</p>
              </div>
              ${h ? `
                <div class="flex flex-wrap gap-1">
                  ${h.dias.map(d=>`<span class="px-2 py-0.5 bg-sky-50 text-sky-700 text-xs rounded-full font-medium">${d}</span>`).join("")}
                </div>
                <div class="text-sm text-slate-600 font-mono whitespace-nowrap">
                  ${h.hora_inicio} – ${h.hora_fin}
                </div>
                <div class="flex gap-1">
                  ${btnEdit(`editHorario(${h.id})`)}
                  ${btnDelete(`deleteHorario(${h.id})`)}
                </div>
              ` : `<span class="text-xs text-slate-400 italic">Sin horario asignado</span>
                <button onclick="newHorarioFor(${m.id})" class="btn-secondary text-xs">+ Asignar</button>`}
            </div>`;
        }).join("")}
      </div>`;
}

window.newHorario = function() {
  const medOpts = DB.medicos.map(m=>({value:m.id,label:m.nombre}));
  openModal("Nuevo horario", formHorario({},medOpts), () => saveHorario(null, medOpts));
};
window.newHorarioFor = function(medId) {
  const medOpts = DB.medicos.map(m=>({value:m.id,label:m.nombre}));
  openModal("Asignar horario", formHorario({medico_id:medId},medOpts), () => saveHorario(null, medOpts));
};
window.editHorario = function(id) {
  const h = DB.horarios.find(x=>x.id===id);
  const medOpts = DB.medicos.map(m=>({value:m.id,label:m.nombre}));
  openModal("Editar horario", formHorario(h,medOpts), () => saveHorario(id, medOpts));
};
window.deleteHorario = function(id) {
  confirmDialog("¿Eliminar este horario?", () => {
    DB.horarios = DB.horarios.filter(x=>x.id!==id);
    navigate("horarios"); showToast("Horario eliminado","info");
  });
};
function saveHorario(id, medOpts) {
  const med  = parseInt(document.getElementById("h-med").value);
  const hi   = document.getElementById("h-inicio").value;
  const hf   = document.getElementById("h-fin").value;
  const dias = DIAS_SEMANA.filter(d => document.getElementById(`hd-${d}`)?.checked);
  if (!dias.length) return showToast("Selecciona al menos un día","error");
  if (hi >= hf) return showToast("La hora fin debe ser mayor a inicio","error");
  if (id) {
    const h = DB.horarios.find(x=>x.id===id);
    Object.assign(h, {medico_id:med, dias, hora_inicio:hi, hora_fin:hf});
  } else {
    DB.horarios.push({id:DB.nextId.horarios++, medico_id:med, dias, hora_inicio:hi, hora_fin:hf});
  }
  logAction(`${id?"Editó":"Creó"} horario para ${getMedicoNombre(med)}`);
  closeModal(); navigate("horarios"); showToast("Horario guardado");
}
function formHorario(h={}, medOpts) {
  return `<div class="grid gap-4">
    ${field("Médico", select("h-med", medOpts, h.medico_id||""), true)}
    <div class="grid grid-cols-2 gap-4">
      ${field("Hora inicio", input("h-inicio","time","",h.hora_inicio||"08:00"), true)}
      ${field("Hora fin",    input("h-fin","time","",h.hora_fin||"14:00"), true)}
    </div>
    <div class="form-group">
      <label class="form-label">Días laborales <span class="text-red-500">*</span></label>
      <div class="flex flex-wrap gap-2 mt-1">
        ${DIAS_SEMANA.map(d => {
          const checked = h.dias?.includes(d);
          return `<label class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${checked?'border-sky-500 bg-sky-50':'border-slate-200'} cursor-pointer text-sm hover:border-sky-400 transition-colors">
            <input type="checkbox" id="hd-${d}" value="${d}" ${checked?"checked":""} class="accent-sky-500">${d}
          </label>`;
        }).join("")}
      </div>
    </div>
  </div>`;
}

// ══════════════════════════════════════════════
// PACIENTES
// ══════════════════════════════════════════════
let pacienteFiltro = "";
function renderPacientes() {
  const lista = DB.pacientes.filter(p =>
    !pacienteFiltro || p.documento.toLowerCase().includes(pacienteFiltro.toLowerCase()) || p.nombre.toLowerCase().includes(pacienteFiltro.toLowerCase())
  );
  const rows = lista.map(p => [
    `<span class="font-medium">${p.nombre}</span>`,
    `<span class="font-mono text-xs text-slate-500">${p.documento}</span>`,
    p.telefono,
    `<span class="${p.sexo==='F'?'text-pink-600':'text-sky-600'} font-medium">${p.sexo==='F'?'Femenino':'Masculino'}</span>`,
    p.fecha_nac,
    `<div class="flex gap-1">${btnEdit(`editPaciente(${p.id})`)}${btnDelete(`deletePaciente(${p.id})`)}<button class="btn-icon-sm text-violet-600 hover:bg-violet-50" onclick="verRiesgoPaciente(${p.id})" title="Perfil predictivo">🧠</button></div>`,
  ]);
  return sectionHeader("Pacientes","Registro de pacientes del sistema","Nuevo paciente","newPaciente()","🧑‍⚕️")
    + `<div class="mb-4 relative">
        <input type="text" placeholder="Buscar por nombre o documento…"
          value="${pacienteFiltro}"
          oninput="pacienteFiltro=this.value;renderPage('pacientes')"
          class="form-input pl-10 max-w-sm">
        <svg class="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
       </div>`
    + buildTable(["Nombre","Documento","Teléfono","Sexo","Nacimiento","Acciones"], rows, "No se encontraron pacientes");
}

window.newPaciente = function() {
  openModal("Nuevo paciente", formPaciente(), () => {
    const n  = document.getElementById("p-nombre").value.trim();
    const doc= document.getElementById("p-doc").value.trim();
    const tel= document.getElementById("p-tel").value.trim();
    const sx = document.getElementById("p-sexo").value;
    const fn = document.getElementById("p-fn").value;
    const em = document.getElementById("p-email").value.trim();
    const al = document.getElementById("p-alergias").value.trim();
    if (!n || !doc) return showToast("Nombre y documento son obligatorios","error");
    if (DB.pacientes.find(x=>x.documento===doc)) return showToast("Documento ya registrado","error");
    DB.pacientes.push({id:DB.nextId.pacientes++, nombre:n, documento:doc, telefono:tel, sexo:sx, fecha_nac:fn, email:em, alergias:al, antecedentes:[], medicamentos:[], historial_consultas:[]});
    logAction(`Registró paciente: ${n}`);
    closeModal(); navigate("pacientes"); showToast("Paciente registrado");
  });
};
window.editPaciente = function(id) {
  const p = DB.pacientes.find(x=>x.id===id);
  openModal("Editar paciente", formPaciente(p), () => {
    p.nombre    = document.getElementById("p-nombre").value.trim();
    p.documento = document.getElementById("p-doc").value.trim();
    p.telefono  = document.getElementById("p-tel").value.trim();
    p.sexo      = document.getElementById("p-sexo").value;
    p.fecha_nac = document.getElementById("p-fn").value;
    p.email     = document.getElementById("p-email").value.trim();
    p.alergias  = document.getElementById("p-alergias").value.trim();
    logAction(`Editó paciente: ${p.nombre}`);
    closeModal(); navigate("pacientes"); showToast("Paciente actualizado");
  });
};
window.deletePaciente = function(id) {
  const p = DB.pacientes.find(x=>x.id===id);
  confirmDialog(`¿Eliminar al paciente <strong>${p.nombre}</strong>?`, () => {
    DB.pacientes = DB.pacientes.filter(x=>x.id!==id);
    logAction(`Eliminó paciente: ${p.nombre}`);
    navigate("pacientes"); showToast("Paciente eliminado","info");
  });
};
function formPaciente(p={}) {
  return `<div class="grid gap-4">
    ${field("Nombre completo", input("p-nombre","text","Nombre completo", p.nombre||""), true)}
    ${field("Documento (CURP/ID)", input("p-doc","text","CURP o número de identificación", p.documento||""), true)}
    <div class="grid grid-cols-2 gap-4">
      ${field("Teléfono",       input("p-tel","tel","664-000-0000", p.telefono||""))}
      ${field("Sexo",           select("p-sexo",[{value:"M",label:"Masculino"},{value:"F",label:"Femenino"}], p.sexo||"M"))}
    </div>
    <div class="grid grid-cols-2 gap-4">
      ${field("Fecha nacimiento", input("p-fn","date","", p.fecha_nac||""))}
      ${field("Email",            input("p-email","email","correo@ejemplo.com", p.email||""))}
    </div>
    ${field("Alergias", textarea("p-alergias","Alergias conocidas del paciente", p.alergias||""))}
  </div>`;
}



window.verRiesgoPaciente = function(id) {
  const p = DB.pacientes.find(x=>x.id===id);
  const historial = DB.citas.filter(c=>c.paciente_id===id && c.estado==="FINALIZADA").slice(-10);
  const alertas = generarAlertasPredictivas(id);
  const html = `
    <div class="space-y-4 text-sm">
      <div><b>Paciente:</b> ${p.nombre}</div>
      <div><b>Antecedentes:</b> ${(p.antecedentes||[]).join(", ") || "Sin registro"}</div>
      <div><b>Medicamentos base:</b> ${(p.medicamentos||[]).join(", ") || "Sin registro"}</div>
      <div><b>Alergias:</b> ${p.alergias || "Sin alergias registradas"}</div>
      <div>
        <b>Historial reciente:</b>
        <ul class="list-disc ml-5 mt-1 text-slate-600">
          ${(p.historial_consultas || []).slice(-8).reverse().map(h=>`<li>${h.fecha} · ${h.motivo}. Síntomas: ${h.sintomas_texto || "—"} (${h.duracion || "sin duración"})</li>`).join("") || "<li>Sin consultas finalizadas</li>"}
        </ul>
      </div>
      <div>
        <b>Alertas predictivas:</b>
        <ul class="list-disc ml-5 mt-1">
          ${alertas.map(a=>`<li class="${a.nivel==='critica'?'text-red-600':'text-amber-600'}"><b>${a.nivel.toUpperCase()}</b>: ${a.descripcion}</li>`).join("") || '<li class="text-emerald-600">Sin alertas activas</li>'}
        </ul>
      </div>
    </div>`;
  openModal("Perfil predictivo del paciente", html, () => closeModal());
};

function generarAlertasPredictivas(pacienteId) {
  const historial = DB.citas.filter(c=>c.paciente_id===pacienteId && c.estado==='FINALIZADA');
  const sintomas = historial.flatMap(c => c.sintomas_ids || []);
  const alerts = DB.patrones_riesgo.flatMap(patron => {
    const hits = sintomas.filter(id => patron.sintomas_ids.includes(id)).length;
    if (hits < patron.frecuencia_umbral) return [];
    return [{
      paciente_id: pacienteId,
      patron_id: patron.id,
      nivel: patron.nivel_alerta,
      descripcion: `${patron.nombre}: ${patron.enfermedad_probable} (${hits} coincidencias)`
    }];
  });
  DB.alertas_predictivas = DB.alertas_predictivas.filter(a=>a.paciente_id!==pacienteId).concat(alerts);
  return alerts;
}
// ══════════════════════════════════════════════
// CITAS
// ══════════════════════════════════════════════
let citaFecha = today(0);
function renderCitas() {
  const citasDia = DB.citas.filter(c => c.fecha === citaFecha).sort((a,b)=>a.hora.localeCompare(b.hora));
  const fechaLabel = new Date(citaFecha + "T12:00:00").toLocaleDateString("es-MX",{weekday:"long",year:"numeric",month:"long",day:"numeric"});

  return `
    ${sectionHeader("Citas","Agenda médica y gestión de citas","Nueva cita","newCita()","📅")}
    <!-- Navegación de fecha -->
    <div class="flex items-center gap-3 mb-6">
      <button onclick="cambiarFecha(-1)" class="btn-icon">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <div class="flex-1 text-center">
        <input type="date" value="${citaFecha}" onchange="citaFecha=this.value;renderPage('citas')" class="form-input text-center max-w-xs">
        <p class="text-xs text-slate-400 mt-1 capitalize">${fechaLabel}</p>
      </div>
      <button onclick="cambiarFecha(1)" class="btn-icon">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </button>
    </div>
    <!-- Timeline de citas -->
    <div class="card">
      ${citasDia.length === 0
        ? `<div class="text-center py-16 text-slate-400"><div class="text-5xl mb-4">📅</div><p class="text-lg">No hay citas para esta fecha</p><button onclick="newCita()" class="btn-primary mt-4">Agendar cita</button></div>`
        : `<div class="space-y-3">${citasDia.map(c => citaCard(c)).join("")}</div>`
      }
    </div>`;
}

function citaCard(c) {
  const colorMap = { PENDIENTE: "border-l-sky-500 bg-sky-50/50", FINALIZADA: "border-l-emerald-500 bg-emerald-50/50", CANCELADA: "border-l-red-400 bg-red-50/50 opacity-70" };
  return `
    <div class="flex gap-4 p-4 rounded-xl border border-slate-100 border-l-4 ${colorMap[c.estado]} hover:shadow-sm transition-all">
      <div class="text-center w-16 flex-shrink-0">
        <p class="text-xl font-bold text-slate-700">${c.hora.slice(0,5)}</p>
        <p class="text-xs text-slate-400">hrs</p>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2">
          <div>
            <p class="font-semibold text-slate-800">${getPacienteNombre(c.paciente_id)}</p>
            <p class="text-sm text-slate-500">${getMedicoNombre(c.medico_id)} · ${getEspecialidadNombre(DB.medicos.find(m=>m.id===c.medico_id)?.especialidad_id)}</p>
            <p class="text-xs text-slate-400 mt-1">📝 ${c.motivo}</p>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            ${estadoBadge(c.estado)}
            ${c.estado === "PENDIENTE" ? `
              <button onclick="finalizarCita(${c.id})" class="btn-icon-sm text-emerald-600 hover:bg-emerald-50" title="Finalizar">✓</button>
              <button onclick="cancelarCita(${c.id})"  class="btn-icon-sm text-red-500 hover:bg-red-50" title="Cancelar">✕</button>
            ` : ""}
            ${btnEdit(`editCita(${c.id})`)}
          </div>
        </div>
      </div>
    </div>`;
}

window.cambiarFecha = function(offset) {
  const d = new Date(citaFecha + "T12:00:00");
  d.setDate(d.getDate() + offset);
  citaFecha = d.toISOString().split("T")[0];
  renderPage("citas");
};
window.finalizarCita = function(id) {
  const c = DB.citas.find(x=>x.id===id);
  const paciente = DB.pacientes.find(p=>p.id===c.paciente_id);
  openModal("Consulta médica", formConsultaMedica(c, paciente), () => {
    const sintomasIds = Array.from(document.querySelectorAll("input[name='consulta-sintoma']:checked")).map(el => parseInt(el.value));
    const fechaInicio = document.getElementById("cm-fecha-inicio").value;
    const duracion = document.getElementById("cm-duracion").value.trim();
    const alergias = document.getElementById("cm-alergias").value.trim();
    const antecedentes = document.getElementById("cm-antecedentes").value.trim();
    const notas = document.getElementById("cm-notas").value.trim();
    if (!sintomasIds.length) return showToast("Selecciona al menos un síntoma","error");

    c.sintomas_ids = sintomasIds;
    c.estado = "FINALIZADA";
    paciente.alergias = alergias;
    if (antecedentes) paciente.antecedentes = antecedentes.split(",").map(x=>x.trim()).filter(Boolean);
    paciente.historial_consultas = paciente.historial_consultas || [];
    paciente.historial_consultas.push({
      fecha: `${c.fecha} ${c.hora}`,
      motivo: c.motivo,
      sintomas_ids: sintomasIds,
      sintomas_texto: sintomasIds.map(id => DB.sintomas_catalogo.find(s=>s.id===id)?.nombre).filter(Boolean).join(", "),
      fecha_inicio: fechaInicio,
      duracion,
      notas,
      medico: getMedicoNombre(c.medico_id),
    });

    generarAlertasPredictivas(c.paciente_id);
    logAction(`Finalizó consulta #${id} y guardó historial clínico`);
    closeModal(); renderPage("citas"); showToast("Consulta finalizada y guardada","success");
  });
};

function formConsultaMedica(c, paciente) {
  return `<div class="grid gap-4">
    <div class="text-xs text-slate-500">Paciente: <b>${paciente.nombre}</b> · Cita: <b>${c.fecha} ${c.hora}</b></div>
    ${field("Síntomas actuales", `<div class="grid grid-cols-1 gap-2">${DB.sintomas_catalogo.map(s=>`<label class="flex items-center gap-2"><input type="checkbox" name="consulta-sintoma" value="${s.id}" class="accent-sky-500"> ${s.nombre} <span class="text-xs text-slate-400">(${s.categoria})</span></label>`).join("")}</div>`, true)}
    <div class="grid grid-cols-2 gap-4">
      ${field("Fecha de inicio síntomas", input("cm-fecha-inicio","date","", c.fecha), true)}
      ${field("Duración estimada", input("cm-duracion","text","Ej. 3 días", ""), true)}
    </div>
    ${field("Alergias", textarea("cm-alergias","Ej. penicilina, ibuprofeno", paciente.alergias||""))}
    ${field("Antecedentes relevantes", textarea("cm-antecedentes","Separar por comas", (paciente.antecedentes||[]).join(", ")))}
    ${field("Nota médica / plan", textarea("cm-notas","Evolución, impresión diagnóstica, indicaciones", ""))}
  </div>`;
}
window.cancelarCita = function(id) {
  confirmDialog("¿Cancelar esta cita?", () => {
    DB.citas.find(x=>x.id===id).estado = "CANCELADA";
    logAction(`Canceló cita #${id}`);
    renderPage("citas"); showToast("Cita cancelada","info");
  });
};
window.newCita = function() {
  openModal("Nueva cita", formCita(), () => {
    const pid = parseInt(document.getElementById("c-pac").value);
    const mid = parseInt(document.getElementById("c-med").value);
    const f   = document.getElementById("c-fecha").value;
    const h   = document.getElementById("c-hora").value;
    const mot = document.getElementById("c-motivo").value.trim();
    if (!f || !h || !mot) return showToast("Completa todos los campos","error");
    // Verificar doble horario
    const conflicto = DB.citas.find(c => c.medico_id===mid && c.fecha===f && c.hora===h && c.estado!=="CANCELADA");
    if (conflicto) return showToast(`El médico ya tiene una cita a las ${h}h ese día`,"error");
    DB.citas.push({id:DB.nextId.citas++, paciente_id:pid, medico_id:mid, fecha:f, hora:h, motivo:mot, estado:"PENDIENTE"});
    citaFecha = f;
    logAction(`Agendó cita: ${getPacienteNombre(pid)} con ${getMedicoNombre(mid)}`);
    closeModal(); navigate("citas"); showToast("Cita agendada");
  });
};
window.editCita = function(id) {
  const c = DB.citas.find(x=>x.id===id);
  openModal("Editar cita", formCita(c), () => {
    const pid = parseInt(document.getElementById("c-pac").value);
    const mid = parseInt(document.getElementById("c-med").value);
    const f   = document.getElementById("c-fecha").value;
    const h   = document.getElementById("c-hora").value;
    const mot = document.getElementById("c-motivo").value.trim();
    const conflicto = DB.citas.find(x => x.id!==id && x.medico_id===mid && x.fecha===f && x.hora===h && x.estado!=="CANCELADA");
    if (conflicto) return showToast("Conflicto de horario con otra cita","error");
    Object.assign(c, {paciente_id:pid, medico_id:mid, fecha:f, hora:h, motivo:mot});
    citaFecha = f;
    logAction(`Modificó cita #${id}`);
    closeModal(); navigate("citas"); showToast("Cita actualizada");
  });
};
function formCita(c={}) {
  const pacs = DB.pacientes.map(p=>({value:p.id,label:p.nombre}));
  const meds = DB.medicos.filter(m=>m.activo).map(m=>({value:m.id,label:`${m.nombre} (${getEspecialidadNombre(m.especialidad_id)})`}));
  const horas = [];
  for(let h=7;h<=19;h++) { horas.push({value:`${String(h).padStart(2,"0")}:00`,label:`${String(h).padStart(2,"0")}:00`}); horas.push({value:`${String(h).padStart(2,"0")}:30`,label:`${String(h).padStart(2,"0")}:30`}); }
  return `<div class="grid gap-4">
    ${field("Paciente", select("c-pac", pacs, c.paciente_id||""), true)}
    ${field("Médico",   select("c-med", meds, c.medico_id||""), true)}
    <div class="grid grid-cols-2 gap-4">
      ${field("Fecha", input("c-fecha","date","", c.fecha||citaFecha), true)}
      ${field("Hora",  select("c-hora", horas, c.hora||"09:00"), true)}
    </div>
    ${field("Motivo de consulta", textarea("c-motivo","Describe el motivo de la consulta", c.motivo||""), true)}
  </div>`;
}

// ══════════════════════════════════════════════
// BITÁCORA
// ══════════════════════════════════════════════
function renderBitacora() {
  const rows = DB.bitacora.map(b => [
    `<span class="font-mono text-xs text-slate-600">${b.usuario}</span>`,
    `<span class="text-slate-700">${b.accion}</span>`,
    `<span class="text-xs text-slate-400 whitespace-nowrap">${b.fecha}</span>`,
  ]);
  return sectionHeader("Bitácora","Registro de auditoría del sistema")
    + `<div class="mb-4 flex items-center gap-2 text-xs text-slate-500 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <svg class="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        Solo lectura. Los registros de auditoría no pueden modificarse.
       </div>`
    + buildTable(["Usuario","Acción","Fecha y hora"], rows);
}
