// ============================================================
// MEDIC-ON — Datos simulados (mock data)
// ============================================================

const DB = {
  currentUser: null,

  usuarios: [
    { id: 1, username: "admin",     password: "admin123",  nombre: "Administrador",      rol: "ADMINISTRACION", activo: true },
    { id: 2, username: "dr_garcia", password: "med123",    nombre: "Dr. Carlos García",  rol: "MEDICO",         activo: true },
    { id: 3, username: "recep01",   password: "rec123",    nombre: "Laura Mendoza",       rol: "RECEPCION",      activo: true },
    { id: 4, username: "dr_luna",   password: "med456",    nombre: "Dra. Ana Luna",       rol: "MEDICO",         activo: true },
    { id: 5, username: "recep02",   password: "rec456",    nombre: "Jorge Romero",        rol: "RECEPCION",      activo: false },
  ],

  sucursales: [
    { id: 1, nombre: "Sucursal Centro",    direccion: "Av. Revolución 123, Tijuana",   telefono: "664-100-0001", activa: true  },
    { id: 2, nombre: "Sucursal Norte",     direccion: "Blvd. Agua Caliente 456, TJ",  telefono: "664-100-0002", activa: true  },
    { id: 3, nombre: "Sucursal Otay",      direccion: "Calz. Aeropuerto 789, TJ",     telefono: "664-100-0003", activa: false },
  ],

  especialidades: [
    { id: 1, nombre: "Medicina General",   descripcion: "Atención primaria y diagnóstico general" },
    { id: 2, nombre: "Cardiología",         descripcion: "Enfermedades del corazón y sistema cardiovascular" },
    { id: 3, nombre: "Pediatría",           descripcion: "Atención médica de niños y adolescentes" },
    { id: 4, nombre: "Dermatología",        descripcion: "Tratamiento de enfermedades de la piel" },
    { id: 5, nombre: "Ortopedia",           descripcion: "Diagnóstico y tratamiento del sistema musculoesquelético" },
  ],

  medicos: [
    { id: 1, nombre: "Dr. Carlos García",  especialidad_id: 1, sucursal_id: 1, telefono: "664-200-0001", activo: true },
    { id: 2, nombre: "Dra. Ana Luna",       especialidad_id: 2, sucursal_id: 1, telefono: "664-200-0002", activo: true },
    { id: 3, nombre: "Dr. Luis Reyes",      especialidad_id: 3, sucursal_id: 2, telefono: "664-200-0003", activo: true },
    { id: 4, nombre: "Dra. Sofía Vega",    especialidad_id: 4, sucursal_id: 2, telefono: "664-200-0004", activo: true },
    { id: 5, nombre: "Dr. Miguel Torres",  especialidad_id: 5, sucursal_id: 3, telefono: "664-200-0005", activo: false },
  ],

  horarios: [
    { id: 1, medico_id: 1, dias: ["Lunes","Martes","Miércoles","Jueves","Viernes"], hora_inicio: "08:00", hora_fin: "14:00" },
    { id: 2, medico_id: 2, dias: ["Lunes","Miércoles","Viernes"],                  hora_inicio: "10:00", hora_fin: "18:00" },
    { id: 3, medico_id: 3, dias: ["Martes","Jueves"],                               hora_inicio: "09:00", hora_fin: "15:00" },
    { id: 4, medico_id: 4, dias: ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"], hora_inicio: "07:00", hora_fin: "13:00" },
  ],

  pacientes: [
    { id: 1, nombre: "María López",       documento: "LOPM850312ABC", telefono: "664-300-0001", sexo: "F", fecha_nac: "1985-03-12", email: "maria@email.com", alergias: "Penicilina", antecedentes:["Hipertensión controlada"], medicamentos:["Losartán 50mg"], historial_consultas: [
      { fecha: today(-60), motivo: "Control de hipertensión", sintomas_ids:[5], sintomas_texto: "Dolor de cabeza", duracion: "4 días", diagnostico: "Cefalea tensional asociada a estrés", tratamiento: "Paracetamol 500mg c/8h por 3 días + hidratación", notas: "Monitorear presión arterial en casa" },
      { fecha: today(-20), motivo: "Palpitaciones y disnea leve", sintomas_ids:[3,4], sintomas_texto: "Dolor de pecho, Dificultad respiratoria", duracion: "2 días", diagnostico: "Angina estable probable", tratamiento: "Ajuste de antihipertensivo y ECG de control", notas: "Requiere seguimiento cardiológico" },
    ] },
    { id: 2, nombre: "José Ramírez",      documento: "RAJJ900518XYZ", telefono: "664-300-0002", sexo: "M", fecha_nac: "1990-05-18", email: "jose@email.com", alergias: "", antecedentes:["Tabaquismo social"], medicamentos:[], historial_consultas: [
      { fecha: today(-35), motivo: "Infección respiratoria", sintomas_ids:[1,2], sintomas_texto: "Fiebre, Tos", duracion: "5 días", diagnostico: "Faringitis viral aguda", tratamiento: "Reposo, hidratación y antipirético", notas: "Sin datos de alarma" },
    ] },
    { id: 3, nombre: "Elena Torres",      documento: "TOEE951120DEF", telefono: "664-300-0003", sexo: "F", fecha_nac: "1995-11-20", email: "elena@email.com", alergias: "", antecedentes:["Migraña episódica"], medicamentos:["Sumatriptán SOS"], historial_consultas: [] },
    { id: 4, nombre: "Roberto Sánchez",   documento: "SARR880704GHI", telefono: "664-300-0004", sexo: "M", fecha_nac: "1988-07-04", email: "roberto@email.com", alergias: "", antecedentes:["Rinitis alérgica"], medicamentos:["Loratadina 10mg"], historial_consultas: [] },
    { id: 5, nombre: "Patricia Morales",  documento: "MOPA700815JKL", telefono: "664-300-0005", sexo: "F", fecha_nac: "1970-08-15", email: "patricia@email.com", alergias: "Ácido acetilsalicílico", antecedentes:["Asma"], medicamentos:["Salbutamol inhalado"], historial_consultas: [
      { fecha: today(-40), motivo: "Exacerbación asmática", sintomas_ids:[2,4], sintomas_texto: "Tos, Dificultad respiratoria", duracion: "3 días", diagnostico: "Asma persistente con crisis leve", tratamiento: "Broncodilatador de rescate y esteroide inhalado", notas: "Evitar desencadenantes ambientales" },
    ] },
    { id: 6, nombre: "Diego Hernández",   documento: "HEDD020930MNO", telefono: "664-300-0006", sexo: "M", fecha_nac: "2002-09-30", email: "diego@email.com", alergias: "", antecedentes:["Sobrepeso"], medicamentos:[], historial_consultas: [] },
    { id: 7, nombre: "Camila Navarro",    documento: "NACC980214PQR", telefono: "664-300-0007", sexo: "F", fecha_nac: "1998-02-14", email: "camila@email.com", alergias: "Sulfas", antecedentes:["Hipotiroidismo"], medicamentos:["Levotiroxina 50mcg"], historial_consultas: [
      { fecha: today(-45), motivo: "Fiebre y tos nocturna", sintomas_ids:[1,2], sintomas_texto: "Fiebre, Tos", duracion: "6 días", diagnostico: "Bronquitis aguda", tratamiento: "Antitérmico y control en 72 horas", notas: "Mejoría parcial al tercer día" },
      { fecha: today(-12), motivo: "Persistencia de tos", sintomas_ids:[2,4], sintomas_texto: "Tos, Dificultad respiratoria", duracion: "10 días", diagnostico: "Hiperreactividad bronquial posinfecciosa", tratamiento: "Esteroide inhalado por 14 días", notas: "Revisar función pulmonar si persiste" },
    ] },
    { id: 8, nombre: "Fernando Ibarra",   documento: "IAFF760922STU", telefono: "664-300-0008", sexo: "M", fecha_nac: "1976-09-22", email: "fernando@email.com", alergias: "", antecedentes:["Diabetes mellitus tipo 2","Dislipidemia"], medicamentos:["Metformina 850mg c/12h","Atorvastatina 20mg nocturna"], historial_consultas: [
      { fecha: today(-70), motivo: "Control metabólico", sintomas_ids:[5], sintomas_texto: "Dolor de cabeza", duracion: "2 días", diagnostico: "Descontrol glucémico leve", tratamiento: "Ajuste dietético y ejercicio", notas: "Solicitar HbA1c en siguiente consulta" },
      { fecha: today(-18), motivo: "Opresión torácica al esfuerzo", sintomas_ids:[3,4], sintomas_texto: "Dolor de pecho, Dificultad respiratoria", duracion: "1 día", diagnostico: "Probable angina de esfuerzo", tratamiento: "Referencia a cardiología + prueba de esfuerzo", notas: "Acudir a urgencias si dolor en reposo" },
    ] },
  ],

  sintomas_catalogo: [
    { id: 1, nombre: "Fiebre", categoria: "infeccioso", riesgo: 2 },
    { id: 2, nombre: "Tos", categoria: "respiratorio", riesgo: 1 },
    { id: 3, nombre: "Dolor de pecho", categoria: "cardiovascular", riesgo: 5 },
    { id: 4, nombre: "Dificultad respiratoria", categoria: "respiratorio", riesgo: 5 },
    { id: 5, nombre: "Dolor de cabeza", categoria: "neurologico", riesgo: 2 },
  ],

  patrones_riesgo: [
    { id: 1, nombre: "Riesgo cardiaco", sintomas_ids: [3,4], frecuencia_umbral: 2, ventana_dias: 90, enfermedad_probable: "Evento cardiovascular", nivel_alerta: "critica" },
    { id: 2, nombre: "Infección recurrente", sintomas_ids: [1,2], frecuencia_umbral: 3, ventana_dias: 60, enfermedad_probable: "Infección respiratoria", nivel_alerta: "atencion" },
  ],

  alertas_predictivas: [],

  citas: [
    { id: 1, paciente_id: 1, medico_id: 1, fecha: today(-1), hora: "09:00", motivo: "Revisión general",     estado: "FINALIZADA" },
    { id: 2, paciente_id: 2, medico_id: 2, fecha: today(0),  hora: "10:30", motivo: "Dolor en el pecho",    estado: "PENDIENTE"  },
    { id: 3, paciente_id: 3, medico_id: 1, fecha: today(0),  hora: "11:00", motivo: "Consulta de seguimiento", estado: "PENDIENTE" },
    { id: 4, paciente_id: 4, medico_id: 3, fecha: today(0),  hora: "14:00", motivo: "Control pediatra",     estado: "PENDIENTE"  },
    { id: 5, paciente_id: 5, medico_id: 4, fecha: today(1),  hora: "08:30", motivo: "Revisión de piel",     estado: "PENDIENTE"  },
    { id: 6, paciente_id: 6, medico_id: 2, fecha: today(1),  hora: "16:00", motivo: "Electrocardiograma",   estado: "PENDIENTE"  },
    { id: 7, paciente_id: 1, medico_id: 3, fecha: today(-3), hora: "10:00", motivo: "Fiebre infantil",      estado: "FINALIZADA" },
    { id: 8, paciente_id: 2, medico_id: 1, fecha: today(-2), hora: "12:00", motivo: "Gripe",                estado: "CANCELADA"  },
    { id: 9, paciente_id: 7, medico_id: 1, fecha: today(-12), hora: "09:30", motivo: "Tos persistente y fatiga", estado: "FINALIZADA", sintomas_ids:[2,4] },
    { id: 10, paciente_id: 8, medico_id: 2, fecha: today(-18), hora: "11:30", motivo: "Opresión torácica al esfuerzo", estado: "FINALIZADA", sintomas_ids:[3,4] },
    { id: 11, paciente_id: 7, medico_id: 1, fecha: today(2), hora: "10:00", motivo: "Seguimiento respiratorio", estado: "PENDIENTE" },
    { id: 12, paciente_id: 8, medico_id: 2, fecha: today(3), hora: "13:30", motivo: "Control cardiometabólico", estado: "PENDIENTE" },
  ],

  bitacora: [
    { id: 1, usuario: "admin",     accion: "Inicio de sesión",           fecha: datetime(-0.01) },
    { id: 2, usuario: "recep01",   accion: "Creó cita para María López", fecha: datetime(-0.05) },
    { id: 3, usuario: "dr_garcia", accion: "Finalizó cita #1",           fecha: datetime(-0.1)  },
    { id: 4, usuario: "admin",     accion: "Agregó médico: Dr. Torres",  fecha: datetime(-0.5)  },
    { id: 5, usuario: "recep01",   accion: "Registró paciente nuevo",    fecha: datetime(-1)    },
    { id: 6, usuario: "admin",     accion: "Modificó sucursal Otay",     fecha: datetime(-1.5)  },
  ],

  nextId: { usuarios: 6, sucursales: 4, especialidades: 6, medicos: 6, pacientes: 9, citas: 13, bitacora: 7, horarios: 5 },
};

// Helpers para fechas relativas
function today(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}
function datetime(offsetDays = 0) {
  const d = new Date();
  d.setTime(d.getTime() + offsetDays * 86400000);
  return d.toLocaleString("es-MX");
}

// Helper: log to bitacora
function logAction(accion) {
  if (!DB.currentUser) return;
  DB.bitacora.unshift({
    id: DB.nextId.bitacora++,
    usuario: DB.currentUser.username,
    accion,
    fecha: new Date().toLocaleString("es-MX"),
  });
}

// Helper: get related name
function getMedicoNombre(id)      { return DB.medicos.find(m => m.id === id)?.nombre || "—"; }
function getPacienteNombre(id)    { return DB.pacientes.find(p => p.id === id)?.nombre || "—"; }
function getEspecialidadNombre(id){ return DB.especialidades.find(e => e.id === id)?.nombre || "—"; }
function getSucursalNombre(id)    { return DB.sucursales.find(s => s.id === id)?.nombre || "—"; }
