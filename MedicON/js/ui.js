// ============================================================
// MEDIC-ON — UI Utilities & Shared Components
// ============================================================

// ── Toast Notifications ──────────────────────────────────────
function showToast(msg, type = "success") {
  const colors = {
    success: "bg-emerald-500",
    error:   "bg-red-500",
    info:    "bg-sky-500",
    warning: "bg-amber-500",
  };
  const icons = { success: "✓", error: "✕", info: "i", warning: "!" };
  const t = document.createElement("div");
  t.className = `fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-white text-sm font-medium ${colors[type]} toast-enter`;
  t.innerHTML = `<span class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">${icons[type]}</span>${msg}`;
  document.body.appendChild(t);
  setTimeout(() => { t.classList.add("toast-exit"); setTimeout(() => t.remove(), 300); }, 3000);
}

// ── Modal ────────────────────────────────────────────────────
function openModal(title, bodyHTML, onSave) {
  document.getElementById("modal-overlay")?.remove();
  const overlay = document.createElement("div");
  overlay.id = "modal-overlay";
  overlay.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm modal-fade";
  overlay.innerHTML = `
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden modal-slide">
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h3 class="text-lg font-semibold text-slate-800">${title}</h3>
        <button onclick="closeModal()" class="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">✕</button>
      </div>
      <div class="p-6 max-h-[70vh] overflow-y-auto">${bodyHTML}</div>
      <div class="flex justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
        <button onclick="closeModal()" class="btn-secondary">Cancelar</button>
        <button id="modal-save-btn" class="btn-primary">Guardar</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  if (onSave) document.getElementById("modal-save-btn").onclick = onSave;
  overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
}
function closeModal() {
  const o = document.getElementById("modal-overlay");
  if (o) { o.classList.add("modal-fade-out"); setTimeout(() => o.remove(), 200); }
}

// ── Confirm Dialog ───────────────────────────────────────────
function confirmDialog(msg, onConfirm) {
  openModal("Confirmar acción",
    `<div class="flex items-start gap-4">
      <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
        <svg class="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
      </div>
      <p class="text-slate-600 pt-2">${msg}</p>
    </div>`,
    () => { closeModal(); onConfirm(); }
  );
  document.getElementById("modal-save-btn").textContent = "Confirmar";
  document.getElementById("modal-save-btn").className = "btn-danger";
}

// ── Shared Table Builder ──────────────────────────────────────
function buildTable(headers, rows, emptyMsg = "Sin registros") {
  if (!rows.length) return `<div class="text-center py-16 text-slate-400"><div class="text-4xl mb-3">📋</div><p>${emptyMsg}</p></div>`;
  return `
    <div class="overflow-x-auto rounded-xl border border-slate-200">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-200">
            ${headers.map(h => `<th class="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">${h}</th>`).join("")}
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          ${rows.map(r => `<tr class="hover:bg-slate-50/80 transition-colors">${r.map(c => `<td class="px-4 py-3 text-slate-700">${c}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

// ── Badge helpers ─────────────────────────────────────────────
function rolBadge(rol) {
  const map = {
    ADMINISTRACION: "badge-purple",
    MEDICO:         "badge-blue",
    RECEPCION:      "badge-teal",
  };
  return `<span class="badge ${map[rol] || 'badge-gray'}">${rol}</span>`;
}
function estadoBadge(est) {
  if (est === true  || est === "activo")    return `<span class="badge badge-green">Activo</span>`;
  if (est === false || est === "inactivo")  return `<span class="badge badge-red">Inactivo</span>`;
  if (est === "PENDIENTE")   return `<span class="badge badge-blue">Pendiente</span>`;
  if (est === "FINALIZADA")  return `<span class="badge badge-green">Finalizada</span>`;
  if (est === "CANCELADA")   return `<span class="badge badge-red">Cancelada</span>`;
  return `<span class="badge badge-gray">${est}</span>`;
}

// ── Action buttons ────────────────────────────────────────────
function btnEdit(onclick) {
  return `<button onclick="${onclick}" class="btn-icon-sm text-sky-600 hover:bg-sky-50" title="Editar">
    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
  </button>`;
}
function btnDelete(onclick) {
  return `<button onclick="${onclick}" class="btn-icon-sm text-red-500 hover:bg-red-50" title="Eliminar">
    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
  </button>`;
}

// ── Section header ────────────────────────────────────────────
function sectionHeader(title, subtitle, btnLabel, btnOnclick, icon = "") {
  return `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">${icon} ${title}</h1>
        ${subtitle ? `<p class="text-sm text-slate-500 mt-0.5">${subtitle}</p>` : ""}
      </div>
      ${btnLabel ? `<button onclick="${btnOnclick}" class="btn-primary flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        ${btnLabel}
      </button>` : ""}
    </div>`;
}

// ── Form field builders ───────────────────────────────────────
function field(label, inputHTML, required = false) {
  return `<div class="form-group">
    <label class="form-label">${label}${required ? ' <span class="text-red-500">*</span>' : ""}</label>
    ${inputHTML}
  </div>`;
}
function input(id, type = "text", placeholder = "", value = "") {
  return `<input id="${id}" type="${type}" placeholder="${placeholder}" value="${value}" class="form-input">`;
}
function select(id, options, selected = "") {
  const opts = options.map(o =>
    `<option value="${o.value}" ${o.value == selected ? "selected" : ""}>${o.label}</option>`
  ).join("");
  return `<select id="${id}" class="form-input">${opts}</select>`;
}
function textarea(id, placeholder = "", value = "") {
  return `<textarea id="${id}" placeholder="${placeholder}" rows="3" class="form-input resize-none">${value}</textarea>`;
}
