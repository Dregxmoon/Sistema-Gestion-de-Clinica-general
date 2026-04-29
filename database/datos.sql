-- ============================================
-- ARCHIVO: datos_completos.sql
-- SISTEMA MÉDICO - TODOS LOS DATOS
-- Ejecutar DESPUÉS de estructura_completa.sql
-- ============================================

USE SistemaMedico;
GO

-- ============================================
-- ROLES Y USUARIOS
-- ============================================
INSERT INTO roles VALUES (1, 'admin',      4);
INSERT INTO roles VALUES (2, 'medico',     3);
INSERT INTO roles VALUES (3, 'enfermero',  2);
INSERT INTO roles VALUES (4, 'secretaria', 1);
GO

INSERT INTO usuarios (id_rol, nombre, usuario, contrasena, estado) VALUES
(1, 'Administrador',     'admin',      '123456',        'activo'),
(2, 'Dr. Carlos Garcia', 'medico',     'medico123',     'activo'),
(3, 'Ana Martinez',      'enfermero',  'enfermero123',  'activo'),
(4, 'Maria Lopez',       'secretaria', 'secretaria123', 'activo');
GO

-- ============================================
-- PERMISOS POR ROL
-- ============================================

-- ADMIN: acceso total
INSERT INTO permisos (id_rol, modulo, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES
(1, 'usuarios',    1,1,1,1),
(1, 'pacientes',   1,1,1,1),
(1, 'consultas',   1,0,0,0),
(1, 'sintomas',    1,1,1,1),
(1, 'alertas',     1,0,1,1),
(1, 'backup',      1,1,1,1),
(1, 'auditoria',   1,0,0,0),
(1, 'config',      1,1,1,1),
(1, 'reportes',    1,1,0,0);

-- MÉDICO: gestión de sus pacientes y consultas
INSERT INTO permisos (id_rol, modulo, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES
(2, 'usuarios',    0,0,0,0),
(2, 'pacientes',   1,1,1,0),
(2, 'consultas',   1,1,1,0),
(2, 'sintomas',    1,0,0,0),
(2, 'alertas',     1,0,1,0),
(2, 'backup',      0,0,0,0),
(2, 'auditoria',   0,0,0,0),
(2, 'config',      0,0,0,0),
(2, 'reportes',    1,0,0,0);

-- ENFERMERO: solo lectura y signos vitales
INSERT INTO permisos (id_rol, modulo, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES
(3, 'usuarios',    0,0,0,0),
(3, 'pacientes',   1,0,0,0),
(3, 'consultas',   1,1,1,0),
(3, 'sintomas',    1,0,0,0),
(3, 'alertas',     1,0,0,0),
(3, 'backup',      0,0,0,0),
(3, 'auditoria',   0,0,0,0),
(3, 'config',      0,0,0,0),
(3, 'reportes',    0,0,0,0);

-- SECRETARIA: solo datos básicos
INSERT INTO permisos (id_rol, modulo, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES
(4, 'usuarios',    0,0,0,0),
(4, 'pacientes',   1,1,0,0),
(4, 'consultas',   0,0,0,0),
(4, 'sintomas',    0,0,0,0),
(4, 'alertas',     0,0,0,0),
(4, 'backup',      0,0,0,0),
(4, 'auditoria',   0,0,0,0),
(4, 'config',      0,0,0,0),
(4, 'reportes',    0,0,0,0);
GO

-- ============================================
-- CONFIGURACIÓN DEL SISTEMA Y BACKUP
-- ============================================
INSERT INTO configuracion_sistema (clave, valor, descripcion) VALUES
('ventana_dias',      '90',           'Dias de historial que analiza el algoritmo'),
('umbral_frecuencia', '3',            'Veces minimas que aparece un sintoma para alertar'),
('umbral_observacion','11',           'Puntaje minimo para alerta observacion'),
('umbral_atencion',   '21',           'Puntaje minimo para alerta atencion'),
('umbral_critica',    '36',           'Puntaje minimo para alerta critica'),
('nombre_clinica',    'Clinica Medica','Nombre de la clinica'),
('version_sistema',   '1.0.0',        'Version del sistema');
GO

INSERT INTO configuracion_backup (hora_ejecucion, dias_retencion, ruta_destino, backup_activo)
VALUES ('23:59', 30, 'backups\', 1);
GO

-- ============================================
-- SÍNTOMAS (155 síntomas, 11 categorías)
-- ============================================

-- CARDIOVASCULAR (25)
INSERT INTO sintomas_catalogo (nombre_sintoma, categoria, nivel_riesgo_base) VALUES
('Dolor en el pecho',              'Cardiovascular', 9),
('Palpitaciones',                  'Cardiovascular', 6),
('Presion arterial alta',          'Cardiovascular', 8),
('Presion arterial baja',          'Cardiovascular', 6),
('Taquicardia',                    'Cardiovascular', 7),
('Bradicardia',                    'Cardiovascular', 6),
('Disnea de esfuerzo',             'Cardiovascular', 7),
('Edema en piernas',               'Cardiovascular', 6),
('Cianosis',                       'Cardiovascular', 9),
('Fatiga extrema',                 'Cardiovascular', 6),
('Mareos al levantarse',           'Cardiovascular', 5),
('Dolor en brazo izquierdo',       'Cardiovascular', 9),
('Sudoracion fria',                'Cardiovascular', 8),
('Pulso irregular',                'Cardiovascular', 7),
('Desmayo',                        'Cardiovascular', 8),
('Hinchazón en tobillos',          'Cardiovascular', 6),
('Dificultad respirar acostado',   'Cardiovascular', 8),
('Tos nocturna persistente',       'Cardiovascular', 7),
('Presion arterial elevada',       'Cardiovascular', 8),
('Zumbido en oidos',               'Cardiovascular', 5),
('Sangrado nasal espontaneo',      'Cardiovascular', 7),
('Vision borrosa episodica',       'Cardiovascular', 7),
('Aumento de peso repentino',      'Cardiovascular', 5),
('Abdomen distendido por liquido', 'Cardiovascular', 7),
('Rubor facial',                   'Cardiovascular', 4);

-- RESPIRATORIO (20)
INSERT INTO sintomas_catalogo (nombre_sintoma, categoria, nivel_riesgo_base) VALUES
('Tos seca',                            'Respiratorio', 3),
('Tos con flema',                       'Respiratorio', 5),
('Tos con sangre',                      'Respiratorio', 9),
('Fiebre',                              'Respiratorio', 5),
('Dificultad para respirar',            'Respiratorio', 8),
('Respiracion sibilante',               'Respiratorio', 6),
('Dolor al respirar',                   'Respiratorio', 7),
('Congestion nasal',                    'Respiratorio', 2),
('Perdida del olfato',                  'Respiratorio', 4),
('Disnea en reposo',                    'Respiratorio', 9),
('Cianosis en labios y dedos',          'Respiratorio', 9),
('Tos matutina con flema',              'Respiratorio', 5),
('Infecciones respiratorias frecuentes','Respiratorio', 6),
('Opresion en el pecho',                'Respiratorio', 7),
('Crisis de ahogo episodicas',          'Respiratorio', 8),
('Insuficiencia respiratoria',          'Respiratorio', 10),
('Esputo amarillo',                     'Respiratorio', 5),
('Respiracion rapida',                  'Respiratorio', 7),
('Dolor de garganta',                   'Respiratorio', 3),
('Voz ronca',                           'Respiratorio', 3);

-- DIGESTIVO (20)
INSERT INTO sintomas_catalogo (nombre_sintoma, categoria, nivel_riesgo_base) VALUES
('Dolor abdominal',              'Digestivo', 5),
('Nauseas',                      'Digestivo', 4),
('Vomito',                       'Digestivo', 5),
('Diarrea',                      'Digestivo', 4),
('Estrenimiento',                'Digestivo', 3),
('Acidez estomacal',             'Digestivo', 4),
('Distension abdominal',         'Digestivo', 4),
('Perdida de apetito',           'Digestivo', 5),
('Sangre en heces',              'Digestivo', 9),
('Heces negras',                 'Digestivo', 9),
('Ictericia',                    'Digestivo', 8),
('Dificultad para tragar',       'Digestivo', 7),
('Dolor en boca del estomago',   'Digestivo', 5),
('Perdida de peso inexplicable', 'Digestivo', 8),
('Vomito con bilis',             'Digestivo', 7),
('Dolor estomacal en ayunas',    'Digestivo', 6),
('Dolor hipocondrio derecho',    'Digestivo', 6),
('Sangrado encias espontaneo',   'Digestivo', 7),
('Heces color arcilla',          'Digestivo', 8),
('Nauseas persistentes',         'Digestivo', 5);

-- NEUROLOGICO (21)
INSERT INTO sintomas_catalogo (nombre_sintoma, categoria, nivel_riesgo_base) VALUES
('Dolor de cabeza',                  'Neurologico', 5),
('Migrania',                         'Neurologico', 6),
('Mareos',                           'Neurologico', 5),
('Perdida del equilibrio',           'Neurologico', 7),
('Convulsiones',                     'Neurologico', 9),
('Perdida de consciencia',           'Neurologico', 9),
('Entumecimiento en extremidades',   'Neurologico', 6),
('Hormigueo',                        'Neurologico', 4),
('Debilidad muscular',               'Neurologico', 6),
('Temblores',                        'Neurologico', 6),
('Perdida de memoria',               'Neurologico', 7),
('Confusion mental',                 'Neurologico', 7),
('Dificultad para hablar',           'Neurologico', 8),
('Vision doble',                     'Neurologico', 7),
('Paralisis facial',                 'Neurologico', 9),
('Dolor de cabeza pulsatil',         'Neurologico', 5),
('Aura visual',                      'Neurologico', 7),
('Episodios de ausencia mental',     'Neurologico', 7),
('Convulsiones parciales',           'Neurologico', 9),
('Dolor de cabeza severo repentino', 'Neurologico', 9),
('Sensibilidad extrema a la luz',    'Neurologico', 5);

-- ENDOCRINO (20)
INSERT INTO sintomas_catalogo (nombre_sintoma, categoria, nivel_riesgo_base) VALUES
('Sed excesiva',                   'Endocrino', 7),
('Orina frecuente',                'Endocrino', 6),
('Hambre excesiva',                'Endocrino', 5),
('Fatiga cronica',                 'Endocrino', 5),
('Aumento de peso inexplicable',   'Endocrino', 6),
('Intolerancia al frio',           'Endocrino', 5),
('Intolerancia al calor',          'Endocrino', 5),
('Caida de cabello',               'Endocrino', 4),
('Unas fragiles',                  'Endocrino', 3),
('Glucosa alta en sangre',         'Endocrino', 8),
('Hormigueo en pies y manos',      'Endocrino', 7),
('Perdida sensibilidad pies',      'Endocrino', 8),
('Heridas que no cicatrizan',      'Endocrino', 7),
('Cara y parpados hinchados',      'Endocrino', 6),
('Ritmo cardiaco lento',           'Endocrino', 7),
('Perdida de peso repentina',      'Endocrino', 7),
('Vision con manchas flotantes',   'Endocrino', 8),
('Perdida de vision progresiva',   'Endocrino', 8),
('Ciclo menstrual irregular',      'Endocrino', 5),
('Bocio',                          'Endocrino', 7);

-- MUSCULOESQUELETICO (15)
INSERT INTO sintomas_catalogo (nombre_sintoma, categoria, nivel_riesgo_base) VALUES
('Dolor articular',                'Musculoesqueletico', 5),
('Inflamacion de articulaciones',  'Musculoesqueletico', 6),
('Rigidez matutina',               'Musculoesqueletico', 5),
('Dolor muscular',                 'Musculoesqueletico', 4),
('Calambres musculares',           'Musculoesqueletico', 4),
('Dolor de espalda baja',          'Musculoesqueletico', 5),
('Dolor de cuello',                'Musculoesqueletico', 4),
('Dolor de rodilla',               'Musculoesqueletico', 5),
('Deformidad articular',           'Musculoesqueletico', 7),
('Limitacion de movimiento',       'Musculoesqueletico', 6),
('Perdida de estatura progresiva', 'Musculoesqueletico', 6),
('Fractura por golpe leve',        'Musculoesqueletico', 8),
('Dolor articular migratorio',     'Musculoesqueletico', 6),
('Postura encorvada progresiva',   'Musculoesqueletico', 5),
('Dolor de cadera sin trauma',     'Musculoesqueletico', 7);

-- RENAL (15)
INSERT INTO sintomas_catalogo (nombre_sintoma, categoria, nivel_riesgo_base) VALUES
('Dolor al orinar',               'Renal', 6),
('Orina con sangre',              'Renal', 8),
('Orina turbia',                  'Renal', 5),
('Urgencia urinaria',             'Renal', 5),
('Retencion urinaria',            'Renal', 7),
('Dolor en rinones',              'Renal', 6),
('Espuma en la orina',            'Renal', 6),
('Orina disminuida',              'Renal', 8),
('Picazon generalizada sin causa','Renal', 6),
('Aliento con olor a amoniaco',   'Renal', 8),
('Hinchazón ojos al despertar',   'Renal', 6),
('Orina espumosa frecuente',      'Renal', 6),
('Confusion y somnolencia',       'Renal', 8),
('Calambres nocturnos frecuentes','Renal', 5),
('Edema generalizado',            'Renal', 7);

-- DERMATOLOGICO (12)
INSERT INTO sintomas_catalogo (nombre_sintoma, categoria, nivel_riesgo_base) VALUES
('Erupcion cutanea',            'Dermatologico', 5),
('Picazon generalizada',        'Dermatologico', 4),
('Manchas en la piel',          'Dermatologico', 5),
('Enrojecimiento de la piel',   'Dermatologico', 4),
('Urticaria',                   'Dermatologico', 5),
('Cambio en lunares',           'Dermatologico', 8),
('Sudoracion nocturna',         'Dermatologico', 5),
('Lunar con cambio de forma',   'Dermatologico', 8),
('Lunar con cambio de color',   'Dermatologico', 8),
('Sangrado espontaneo del lunar','Dermatologico', 9),
('Eccema',                      'Dermatologico', 4),
('Alopecia',                    'Dermatologico', 5);

-- OCULAR (10)
INSERT INTO sintomas_catalogo (nombre_sintoma, categoria, nivel_riesgo_base) VALUES
('Dolor en los ojos',          'Ocular', 5),
('Vision borrosa',             'Ocular', 6),
('Sensibilidad a la luz',      'Ocular', 4),
('Ojos rojos',                 'Ocular', 4),
('Perdida auditiva',           'Ocular', 6),
('Tinnitus',                   'Ocular', 5),
('Vision de halos',            'Ocular', 6),
('Perdida vision periferica',  'Ocular', 8),
('Vertigo posicional',         'Ocular', 6),
('Dolor de oidos',             'Ocular', 4);

-- REPRODUCTIVO (9)
INSERT INTO sintomas_catalogo (nombre_sintoma, categoria, nivel_riesgo_base) VALUES
('Dolor menstrual',            'Reproductivo', 5),
('Sangrado menstrual excesivo','Reproductivo', 6),
('Ausencia de menstruacion',   'Reproductivo', 6),
('Flujo vaginal anormal',      'Reproductivo', 5),
('Nodulos en mama',            'Reproductivo', 7),
('Dolor en mama',              'Reproductivo', 5),
('Disfuncion erectil',         'Reproductivo', 5),
('Dolor testicular',           'Reproductivo', 6),
('Dolor pelvico cronico',      'Reproductivo', 6);

-- INMUNOLOGICO (8)
INSERT INTO sintomas_catalogo (nombre_sintoma, categoria, nivel_riesgo_base) VALUES
('Erupcion mariposa en cara',  'Inmunologico', 8),
('Sensibilidad extrema al sol','Inmunologico', 6),
('Fiebre sin causa infecciosa','Inmunologico', 7),
('Caida cabello en mechones',  'Inmunologico', 6),
('Ulceras en boca recurrentes','Inmunologico', 5),
('Palidez progresiva',         'Inmunologico', 5),
('Dificultad para concentrarse','Inmunologico',4),
('Palpitaciones en reposo',    'Inmunologico', 6);
GO

-- ============================================
-- CADENAS DE EVOLUCIÓN (23)
-- ============================================
INSERT INTO cadenas_evolucion (nombre_cadena, enfermedad_final, categoria, nivel_final) VALUES
('Progresion a Infarto',               'Infarto al Miocardio',             'Cardiovascular',    'critico'),
('Progresion a Hipertension Cronica',  'Hipertension Arterial Cronica',    'Cardiovascular',    'urgente'),
('Progresion a Insuficiencia Cardiaca','Insuficiencia Cardiaca Congestiva','Cardiovascular',    'critico'),
('Progresion a Neumonia',              'Neumonia Grave',                   'Respiratorio',      'critico'),
('Progresion a EPOC',                  'EPOC',                             'Respiratorio',      'urgente'),
('Progresion a Asma Cronica',          'Asma Bronquial Cronica',           'Respiratorio',      'urgente'),
('Progresion a Ulcera Gastrica',       'Ulcera Gastrica',                  'Digestivo',         'urgente'),
('Progresion a Cirrosis',              'Cirrosis Hepatica',                'Digestivo',         'critico'),
('Progresion a Gastritis Cronica',     'Gastritis Cronica',                'Digestivo',         'moderado'),
('Progresion a ACV',                   'ACV Derrame Cerebral',             'Neurologico',       'critico'),
('Progresion a Migrana Cronica',       'Migrana Cronica',                  'Neurologico',       'urgente'),
('Progresion a Epilepsia',             'Epilepsia Cronica',                'Neurologico',       'urgente'),
('Progresion a Diabetes Tipo 2',       'Diabetes Tipo 2',                  'Endocrino',         'urgente'),
('Progresion a Diabetes Complicada',   'Diabetes con Complicaciones',      'Endocrino',         'critico'),
('Progresion a Hipotiroidismo',        'Hipotiroidismo Cronico',           'Endocrino',         'moderado'),
('Progresion a Artritis',              'Artritis Reumatoide',              'Musculoesqueletico','urgente'),
('Progresion a Osteoporosis',          'Osteoporosis con Fracturas',       'Musculoesqueletico','urgente'),
('Progresion a Insuficiencia Renal',   'Insuficiencia Renal Cronica',      'Renal',             'critico'),
('Progresion a Melanoma',              'Melanoma Cancer de Piel',          'Dermatologico',     'critico'),
('Progresion a Glaucoma',              'Glaucoma Cronico',                 'Ocular',            'urgente'),
('Progresion a Lupus',                 'Lupus Eritematoso Sistemico',      'Inmunologico',      'critico'),
('Progresion a Anemia Cronica',        'Anemia Cronica Severa',            'Inmunologico',      'urgente'),
('Progresion Insuficiencia Hormonal',  'Insuficiencia Hormonal Cronica',   'Reproductivo',      'urgente');
GO

-- ============================================
-- PASOS DE CADENAS
-- Usa el id_sintoma de la tabla sintomas_catalogo
-- Los IDs se asignan en orden de inserción
-- CARDIOVASCULAR: 1-25 | RESPIRATORIO: 26-45
-- DIGESTIVO: 46-65    | NEUROLOGICO: 66-86
-- ENDOCRINO: 87-106   | MUSCULO: 107-121
-- RENAL: 122-136      | DERMATO: 137-148
-- OCULAR: 149-158     | REPRO: 159-167
-- INMUNO: 168-175
-- ============================================

-- Cadena 1: Infarto (id_cadena=1)
-- Presion arterial alta(3), Dolor en el pecho(1), Dolor brazo izq(12), Sudoracion fria(13), Palpitaciones(2)
INSERT INTO cadena_pasos (id_cadena, id_sintoma, orden, es_critico) VALUES
(1,  3, 1, 0),
(1,  1, 2, 0),
(1, 12, 3, 1),
(1, 13, 4, 1),
(1,  2, 5, 1);

-- Cadena 2: Hipertensión (id_cadena=2)
-- Dolor de cabeza(66), Mareos al levantarse(11), Presion arterial elevada(19), Zumbido oidos(20), Vision borrosa episodica(22), Sangrado nasal espontaneo(21)
INSERT INTO cadena_pasos (id_cadena, id_sintoma, orden, es_critico) VALUES
(2, 66, 1, 0),
(2, 11, 2, 0),
(2, 19, 3, 1),
(2, 20, 4, 1),
(2, 22, 5, 1),
(2, 21, 6, 1);

-- Cadena 3: Insuficiencia Cardíaca (id_cadena=3)
-- Fatiga extrema(10), Hinchazón tobillos(16), Dificultad respirar acostado(17), Tos nocturna(18), Aumento peso repentino(23), Abdomen distendido(24)
INSERT INTO cadena_pasos (id_cadena, id_sintoma, orden, es_critico) VALUES
(3, 10, 1, 0),
(3, 16, 2, 0),
(3, 17, 3, 1),
(3, 18, 4, 1),
(3, 23, 5, 1),
(3, 24, 6, 1);

-- Cadena 4: Neumonía (id_cadena=4)
-- Tos seca(26), Fiebre(29), Tos con flema(27), Dificultad para respirar(30), Dolor al respirar(32), Insuficiencia respiratoria(41)
INSERT INTO cadena_pasos (id_cadena, id_sintoma, orden, es_critico) VALUES
(4, 26, 1, 0),
(4, 29, 2, 0),
(4, 27, 3, 0),
(4, 30, 4, 1),
(4, 32, 5, 1),
(4, 41, 6, 1);

-- Cadena 5: EPOC (id_cadena=5)
-- Tos matutina con flema(37), Disnea de esfuerzo(7), Respiracion sibilante(31), Infecciones frecuentes(38), Disnea en reposo(35), Cianosis labios(36)
INSERT INTO cadena_pasos (id_cadena, id_sintoma, orden, es_critico) VALUES
(5, 37, 1, 0),
(5,  7, 2, 0),
(5, 31, 3, 0),
(5, 38, 4, 1),
(5, 35, 5, 1),
(5, 36, 6, 1);

-- Cadena 6: Asma (id_cadena=6)
-- Tos seca(26), Opresion pecho(39), Respiracion sibilante(31), Crisis de ahogo(40), Dificultad respirar(30)
INSERT INTO cadena_pasos (id_cadena, id_sintoma, orden, es_critico) VALUES
(6, 26, 1, 0),
(6, 39, 2, 0),
(6, 31, 3, 0),
(6, 40, 4, 1),
(6, 30, 5, 1);

-- Cadena 7: Úlcera Gástrica (id_cadena=7)
-- Acidez estomacal(51), Dolor boca estomago(58), Nauseas(47), Vomito con bilis(60), Dolor estomacal ayunas(61), Heces negras(55)
INSERT INTO cadena_pasos (id_cadena, id_sintoma, orden, es_critico) VALUES
(7, 51, 1, 0),
(7, 58, 2, 0),
(7, 47, 3, 0),
(7, 60, 4, 1),
(7, 61, 5, 1),
(7, 55, 6, 1);

-- Cadena 8: Cirrosis (id_cadena=8)
-- Fatiga cronica(90), Perdida apetito(53), Dolor hipocondrio der(62), Ictericia(56), Distension abdominal(52), Sangrado encias(63), Confusion mental(77)
INSERT INTO cadena_pasos (id_cadena, id_sintoma, orden, es_critico) VALUES
(8, 90, 1, 0),
(8, 53, 2, 0),
(8, 62, 3, 0),
(8, 56, 4, 1),
(8, 52, 5, 1),
(8, 63, 6, 1),
(8, 77, 7, 1);

-- Cadena 9: Gastritis Crónica (id_cadena=9)
-- Distension abdominal(52), Acidez estomacal(51), Perdida apetito(53), Nauseas persistentes(65), Dolor abdominal(46)
INSERT INTO cadena_pasos (id_cadena, id_sintoma, orden, es_critico) VALUES
(9, 52, 1, 0),
(9, 51, 2, 0),
(9, 53, 3, 0),
(9, 65, 4, 1),
(9, 46, 5, 1);

-- Cadena 10: ACV (id_cadena=10)
-- Dolor cabeza severo(85), Vision borrosa episodica(22), Entumecimiento extremidades(72), Dificultad hablar(78), Paralisis facial(80)
INSERT INTO cadena_pasos (id_cadena, id_sintoma, orden, es_critico) VALUES
(10, 85, 1, 0),
(10, 22, 2, 0),
(10, 72, 3, 1),
(10, 78, 4, 1),
(10, 80, 5, 1);

-- Cadena 11: Migraña Crónica (id_cadena=11)
-- Dolor cabeza pulsatil(81), Sensibilidad luz(86), Nauseas(47), Aura visual(82), Convulsiones parciales(84)
INSERT INTO cadena_pasos (id_cadena, id_sintoma, orden, es_critico) VALUES
(11, 81, 1, 0),
(11, 86, 2, 0),
(11, 47, 3, 0),
(11, 82, 4, 1),
(11, 84, 5, 1);

-- Cadena 12: Epilepsia (id_cadena=12)
-- Episodios ausencia mental(83), Temblores(74), Confusion mental(77), Convulsiones parciales(84), Convulsiones(70)
INSERT INTO cadena_pasos (id_cadena, id_sintoma, orden, es_critico) VALUES
(12, 83, 1, 0),
(12, 74, 2, 0),
(12, 77, 3, 1),
(12, 84, 4, 1),
(12, 70, 5, 1);

-- Cadena 13: Diabetes Tipo 2 (id_cadena=13)
-- Sed excesiva(87), Orina frecuente(88), Fatiga cronica(90), Perdida peso repentina(101), Vision borrosa(150), Heridas no cicatrizan(98)
INSERT INTO cadena_pasos (id_cadena, id_sintoma, orden, es_critico) VALUES
(13, 87, 1, 0),
(13, 88, 2, 0),
(13, 90, 3, 0),
(13, 101,4, 1),
(13, 150,5, 1),
(13, 98, 6, 1);

-- Cadena 14: Diabetes Complicada (id_cadena=14)
-- Glucosa alta(96), Heridas no cicatrizan(98), Hormigueo pies manos(97), Perdida sensibilidad pies(97), Vision manchas flotantes(102), Perdida vision progresiva(103)
INSERT INTO cadena_pasos (id_cadena, id_sintoma, orden, es_critico) VALUES
(14, 96,  1, 0),
(14, 98,  2, 0),
(14, 97,  3, 1),
(14, 102, 4, 1),
(14, 103, 5, 1);

-- Cadena 15: Hipotiroidismo (id_cadena=15)
-- Fatiga cronica(90), Aumento peso inexplicable(91), Intolerancia frio(92), Unas fragiles(95), Estrenimiento(50), Cara parpados hinchados(99), Ritmo cardiaco lento(100)
INSERT INTO cadena_pasos (id_cadena, id_sintoma, orden, es_critico) VALUES
(15, 90, 1, 0),
(15, 91, 2, 0),
(15, 92, 3, 0),
(15, 95, 4, 0),
(15, 50, 5, 1),
(15, 99, 6, 1),
(15,100, 7, 1);

-- Cadena 16: Artritis (id_cadena=16)
-- Dolor articular(107), Rigidez matutina(109), Inflamacion articulaciones(108), Deformidad articular(115), Limitacion movimiento(116)
INSERT INTO cadena_pasos (id_cadena, id_sintoma, orden, es_critico) VALUES
(16, 107, 1, 0),
(16, 109, 2, 0),
(16, 108, 3, 0),
(16, 115, 4, 1),
(16, 116, 5, 1);

-- Cadena 17: Osteoporosis (id_cadena=17)
-- Dolor espalda baja(112), Perdida estatura progresiva(117), Postura encorvada(119), Fractura golpe leve(118)
INSERT INTO cadena_pasos (id_cadena, id_sintoma, orden, es_critico) VALUES
(17, 112, 1, 0),
(17, 117, 2, 0),
(17, 119, 3, 0),
(17, 118, 4, 1);

-- Cadena 18: Insuficiencia Renal (id_cadena=18)
-- Orina espumosa frecuente(127), Hinchazón ojos(126), Presion arterial alta(3), Orina disminuida(123), Picazon generalizada(124), Nauseas(47), Confusion somnolencia(128)
INSERT INTO cadena_pasos (id_cadena, id_sintoma, orden, es_critico) VALUES
(18, 127, 1, 0),
(18, 126, 2, 0),
(18,   3, 3, 0),
(18, 123, 4, 1),
(18, 124, 5, 1),
(18,  47, 6, 1),
(18, 128, 7, 1);

-- Cadena 19: Melanoma (id_cadena=19)
-- Lunar cambio forma(143), Lunar cambio color(144), Cambio en lunares(141), Manchas en piel(138), Sangrado espontaneo lunar(145)
INSERT INTO cadena_pasos (id_cadena, id_sintoma, orden, es_critico) VALUES
(19, 143, 1, 0),
(19, 144, 2, 0),
(19, 141, 3, 1),
(19, 138, 4, 1),
(19, 145, 5, 1);

-- Cadena 20: Glaucoma (id_cadena=20)
-- Vision borrosa(150), Dolor ojos(149), Vision de halos(153), Perdida vision periferica(154)
INSERT INTO cadena_pasos (id_cadena, id_sintoma, orden, es_critico) VALUES
(20, 150, 1, 0),
(20, 149, 2, 0),
(20, 153, 3, 0),
(20, 154, 4, 1);

-- Cadena 21: Lupus (id_cadena=21)
-- Fatiga cronica(90), Dolor articular migratorio(120), Erupcion mariposa(168), Sensibilidad sol(169), Fiebre sin causa(170)
INSERT INTO cadena_pasos (id_cadena, id_sintoma, orden, es_critico) VALUES
(21,  90, 1, 0),
(21, 120, 2, 0),
(21, 168, 3, 1),
(21, 169, 4, 1),
(21, 170, 5, 1);

-- Cadena 22: Anemia Crónica (id_cadena=22)
-- Palidez progresiva(173), Fatiga cronica(90), Dificultad concentrarse(174), Mareos(68), Palpitaciones reposo(175), Disnea esfuerzo(7)
INSERT INTO cadena_pasos (id_cadena, id_sintoma, orden, es_critico) VALUES
(22, 173, 1, 0),
(22,  90, 2, 0),
(22, 174, 3, 0),
(22,  68, 4, 1),
(22, 175, 5, 1),
(22,   7, 6, 1);

-- Cadena 23: Insuficiencia Hormonal (id_cadena=23)
-- Ciclo menstrual irregular(104), Dolor pelvico cronico(167), Sangrado menstrual excesivo(160), Ausencia menstruacion(161)
INSERT INTO cadena_pasos (id_cadena, id_sintoma, orden, es_critico) VALUES
(23, 104, 1, 0),
(23, 167, 2, 0),
(23, 160, 3, 0),
(23, 161, 4, 1);
GO

-- ============================================
-- PATRONES DE RIESGO PARA EL ALGORITMO
-- ============================================
INSERT INTO patrones_riesgo (nombre_patron, sintomas_ids, frecuencia_umbral, ventana_dias, enfermedad_probable, nivel_alerta) VALUES
('Riesgo cardiovascular alto',   '1,2,12,13',  2, 90, 'Infarto al Miocardio',       'critica'),
('Hipertension en desarrollo',   '3,19,20,66', 3, 90, 'Hipertension Cronica',        'atencion'),
('Progresion diabetes',          '87,88,90,96',3, 90, 'Diabetes Tipo 2',             'atencion'),
('Problema respiratorio cronico','26,27,30,38', 3, 90, 'EPOC o Asma',                'atencion'),
('Falla renal inicial',          '122,123,127',2, 90, 'Insuficiencia Renal',         'critica'),
('Riesgo neurologico',           '66,72,78,80',2, 60, 'ACV Derrame Cerebral',        'critica'),
('Problemas hepaticos',          '46,53,56,62',3, 90, 'Cirrosis Hepatica',           'atencion'),
('Riesgo dermatologico',         '141,143,144',2, 90, 'Melanoma',                    'critica'),
('Artritis en desarrollo',       '107,108,109',3, 90, 'Artritis Reumatoide',         'observacion'),
('Hipotiroidismo inicial',       '90,91,92,95',3, 90, 'Hipotiroidismo Cronico',      'observacion');
GO

-- ============================================
-- PACIENTES DE PRUEBA
-- ============================================
INSERT INTO pacientes (id_medico_asignado, nombre, apellido, fecha_nacimiento, genero, telefono, email, tipo_sangre, estado) VALUES
(2, 'Juan',    'Perez',     '1985-06-15', 'Masculino', '555-1001', 'juan.perez@email.com',    'O+',  'activo'),
(2, 'Maria',   'Lopez',     '1992-03-22', 'Femenino',  '555-1002', 'maria.lopez@email.com',   'A+',  'activo'),
(2, 'Carlos',  'Ramirez',   '1978-11-08', 'Masculino', '555-1003', 'carlos.r@email.com',      'B+',  'activo'),
(2, 'Ana',     'Torres',    '2000-07-30', 'Femenino',  '555-1004', 'ana.torres@email.com',    'AB+', 'activo'),
(2, 'Luis',    'Gutierrez', '1965-01-14', 'Masculino', '555-1005', 'luis.g@email.com',        'O-',  'activo');
GO

-- Antecedentes de los pacientes de prueba
INSERT INTO paciente_antecedentes (id_paciente, tipo, descripcion) VALUES
(1, 'familiar',    'Padre con hipertension arterial'),
(1, 'personal',    'Fumador por 10 años, dejó hace 3 años'),
(2, 'alergico',    'Alergia a penicilina'),
(2, 'familiar',    'Madre diabetica tipo 2'),
(3, 'quirurgico',  'Apendicectomia en 2010'),
(3, 'personal',    'Sobrepeso IMC 28'),
(4, 'personal',    'Migraña desde los 15 años'),
(5, 'familiar',    'Padre fallecio de infarto'),
(5, 'personal',    'Hipertension diagnosticada hace 2 años');
GO

-- Medicamentos base de pacientes
INSERT INTO paciente_medicamentos_base (id_paciente, medicamento, dosis, frecuencia, motivo, activo) VALUES
(5, 'Losartan',    '50mg', 'Una vez al dia', 'Hipertension arterial', 1),
(5, 'Aspirina',    '100mg','Una vez al dia', 'Prevencion cardiovascular', 1),
(2, 'Metformina',  '500mg','Dos veces al dia','Control glucosa', 1);
GO

-- ============================================
-- CONSULTAS DE PRUEBA CON SÍNTOMAS Y DIAGNÓSTICOS
-- ============================================

-- Consulta 1: Juan Perez - síntomas cardiovasculares (activa el algoritmo)
INSERT INTO consultas (id_paciente, id_medico, motivo, peso_kg, talla_cm, presion_arterial, temperatura, frecuencia_cardiaca, estado)
VALUES (1, 2, 'Dolor de pecho y cansancio al caminar', 82.5, 175.0, '140/90', 36.8, 88, 'finalizada');

INSERT INTO consulta_sintomas (id_consulta, id_sintoma, intensidad, duracion_dias) VALUES
(1,  1, 'moderado', 3),   -- Dolor en el pecho
(1,  3, 'leve',     7),   -- Presion arterial alta
(1, 10, 'moderado', 5);   -- Fatiga extrema

INSERT INTO diagnosticos (id_consulta, descripcion, codigo_cie10, categoria, nivel_gravedad, es_cronico)
VALUES (1, 'Hipertension arterial estadio 1 con dolor toracico atipico', 'I10', 'Cardiovascular', 3, 0);

INSERT INTO tratamientos (id_consulta, tipo, medicamento, dosis, duracion_dias, indicaciones)
VALUES (1, 'medicamento', 'Enalapril', '10mg', 30, 'Una vez al dia en ayunas, control en 30 dias');
GO

-- Consulta 2: Luis Gutierrez - riesgo cardiovascular alto
INSERT INTO consultas (id_paciente, id_medico, motivo, peso_kg, talla_cm, presion_arterial, temperatura, frecuencia_cardiaca, estado)
VALUES (5, 2, 'Control mensual hipertension, refiere mareos', 90.0, 170.0, '160/100', 36.5, 82, 'finalizada');

INSERT INTO consulta_sintomas (id_consulta, id_sintoma, intensidad, duracion_dias) VALUES
(2,  3, 'severo',   30),  -- Presion arterial alta
(2, 19, 'severo',   30),  -- Presion arterial elevada
(2, 66, 'moderado', 7),   -- Dolor de cabeza
(2, 11, 'leve',     4);   -- Mareos al levantarse

INSERT INTO diagnosticos (id_consulta, descripcion, codigo_cie10, categoria, nivel_gravedad, es_cronico)
VALUES (2, 'Hipertension arterial estadio 2, mal controlada', 'I10', 'Cardiovascular', 4, 1);

INSERT INTO tratamientos (id_consulta, tipo, medicamento, dosis, duracion_dias, indicaciones)
VALUES (2, 'medicamento', 'Amlodipino', '5mg', 30, 'Una vez al dia, evitar sal y alcohol');
GO

-- Consulta 3: Maria Lopez - síntomas endocrinos (posible diabetes)
INSERT INTO consultas (id_paciente, id_medico, motivo, peso_kg, talla_cm, presion_arterial, temperatura, frecuencia_cardiaca, estado)
VALUES (2, 2, 'Mucha sed y orina frecuente, cansancio', 68.0, 162.0, '120/80', 36.7, 78, 'finalizada');

INSERT INTO consulta_sintomas (id_consulta, id_sintoma, intensidad, duracion_dias) VALUES
(3, 87, 'moderado', 14),  -- Sed excesiva
(3, 88, 'moderado', 14),  -- Orina frecuente
(3, 90, 'leve',     21);  -- Fatiga cronica

INSERT INTO diagnosticos (id_consulta, descripcion, codigo_cie10, categoria, nivel_gravedad, es_cronico)
VALUES (3, 'Prediabetes, glucosa en ayunas elevada. Solicitar HbA1c', 'R73.0', 'Endocrino', 2, 0);

INSERT INTO tratamientos (id_consulta, tipo, medicamento, dosis, duracion_dias, indicaciones)
VALUES (3, 'terapia', 'Dieta y ejercicio', NULL, 90, 'Reducir carbohidratos, caminar 30min diarios. Control en 3 meses');
GO

-- ============================================
-- VERIFICACIÓN FINAL — CONTEO DE REGISTROS
-- ============================================
SELECT 'roles'                AS tabla, COUNT(*) AS total FROM roles
UNION ALL SELECT 'usuarios',            COUNT(*) FROM usuarios
UNION ALL SELECT 'permisos',            COUNT(*) FROM permisos
UNION ALL SELECT 'pacientes',           COUNT(*) FROM pacientes
UNION ALL SELECT 'paciente_antecedentes',COUNT(*) FROM paciente_antecedentes
UNION ALL SELECT 'paciente_medicamentos_base',COUNT(*) FROM paciente_medicamentos_base
UNION ALL SELECT 'sintomas_catalogo',   COUNT(*) FROM sintomas_catalogo
UNION ALL SELECT 'cadenas_evolucion',   COUNT(*) FROM cadenas_evolucion
UNION ALL SELECT 'cadena_pasos',        COUNT(*) FROM cadena_pasos
UNION ALL SELECT 'patrones_riesgo',     COUNT(*) FROM patrones_riesgo
UNION ALL SELECT 'consultas',           COUNT(*) FROM consultas
UNION ALL SELECT 'consulta_sintomas',   COUNT(*) FROM consulta_sintomas
UNION ALL SELECT 'diagnosticos',        COUNT(*) FROM diagnosticos
UNION ALL SELECT 'tratamientos',        COUNT(*) FROM tratamientos
UNION ALL SELECT 'configuracion_sistema',COUNT(*) FROM configuracion_sistema
UNION ALL SELECT 'configuracion_backup',COUNT(*) FROM configuracion_backup
ORDER BY tabla;
GO