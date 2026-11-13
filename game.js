document.addEventListener('DOMContentLoaded', () => {
    // --- REFERENCIAS A ELEMENTOS DEL DOM ---
    const loadGameButton = document.getElementById('load-game-button');
    const mainMenuContainer = document.getElementById('main-menu-container');
    const gameContainer = document.getElementById('game-container');
    const backgroundScene = document.getElementById('background-scene');
    const characterArea = document.getElementById('character-area');
    const avatarImage = document.getElementById('avatar-image');
    const dialogueArea = document.getElementById('dialogue-area');
    const dialogueBox = document.getElementById('dialogue-box');
    const dialogueText = document.getElementById('dialogue-text');
    const characterName = document.getElementById('character-name');
    const choicesBox = document.getElementById('choices-box');
    const tooltip = document.getElementById('tooltip');
    const playerNameInput = document.getElementById('player-name');

    // --- VARIABLES DE ESTADO DEL JUEGO ---
    let desempeño = 0;
    let nombreJugador = 'Colega';
    let typewriterInterval = null;
    let currentFullText = '';
    let activeCase = null;
    let activeCaseId = null;
    let currentNodeKey = null;
    let respondidas = new Set();   // preguntas ya contestadas: solo el primer intento cuenta para el desempeño
    const SAVE_KEY = 'despacho_creativo_partida';

    // Nombre que se muestra para cada personaje
    const NOMBRES = {
        villegas: 'Villegas',
        anselmo: 'Anselmo',
        sofia: 'Sofía',
        ricardo: 'Ricardo',
        elena: 'Elena',
        hernan: 'Hernán',
        valentina: 'Valentina',
        julian: 'Julián',
        martin: 'Martín',
        octavio: 'Octavio',
        fabio: 'Fabio',
        jueza: 'Jueza',
        inspectora: 'Inspectora',
        laura: 'Laura'
    };

    // Orden en que se agrupan los casos en el menú
    const AREAS = ['Derecho de autor'];

    // --- RUTAS DE LAS IMÁGENES ---
    const AVATARS = {
        villegas: "avatares/avatar_villegas.webp",
        jugador: "avatares/avatar_jugador.webp",
        anselmo: "avatares/avatar_anselmo.webp",
        sofia: "avatares/avatar_sofia.webp",
        ricardo: "avatares/avatar_ricardo.webp",
        elena: "avatares/avatar_elena.webp",
        hernan: "avatares/avatar_hernan.webp",
        valentina: "avatares/avatar_valentina.webp",
        julian: "avatares/avatar_julian.webp",
        martin: "avatares/avatar_martin.webp",
        octavio: "avatares/avatar_octavio.webp",
        fabio: "avatares/avatar_fabio.webp",
        jueza: "avatares/avatar_jueza.webp",
        inspectora: "avatares/avatar_inspectora.webp",
        laura: "avatares/avatar_laura.webp",
        none: ""
    };
    
    const BACKGROUNDS = {
        oficina: `url('bg/fondo_oficina.jpg')`,
        estudio: `url('bg/fondo_estudio.jpg')`,
        libreria: `url('bg/fondo_libreria.jpg')`,
        dnda: `url('bg/fondo_dnda.jpg')`,
        editorial: `url('bg/fondo_editorial.jpg')`,
        sistemas: `url('bg/fondo_sistemas.jpg')`,
        juzgado: `url('bg/fondo_juzgado.jpg')`,
        teatro: `url('bg/fondo_teatro.jpg')`,
        restaurante: `url('bg/fondo_restaurante.jpg')`,
        campo: `url('bg/fondo_campo.jpg')`,
        granja: `url('bg/fondo_granja.jpg')`
    };

    // --- GLOSARIO DE TÉRMINOS JURÍDICOS ---
    const glossary = {
        // --- Derecho de autor: conceptos básicos ---
        'obra': 'Toda creación intelectual original de naturaleza artística, científica o literaria, susceptible de ser divulgada o reproducida en cualquier forma (Decisión 351, art. 3).',
        'autor': 'Persona física que realiza la creación intelectual (Decisión 351, art. 3). Se presume autor, salvo prueba en contrario, a quien aparece con su nombre, seudónimo o signo en la obra (art. 8).',
        'originalidad': 'Requisito de protección: que la obra sea propia de su autor y no copia de otra, y que refleje su individualidad. No exige novedad ni mérito artístico.',
        'decisión 351': 'Régimen Común sobre Derecho de Autor y Derechos Conexos de la Comunidad Andina (1993). En las materias que regula se aplica en Colombia con preferencia sobre la ley nacional.',
        'derechos morales': 'Vinculan personalmente al autor con su obra: decidir si la divulga o la mantiene inédita, reivindicar su paternidad y oponerse a que la deformen o mutilen. Son inalienables, inembargables, imprescriptibles e irrenunciables (Decisión 351, art. 11).',
        'derechos patrimoniales': 'Derecho exclusivo de realizar, autorizar o prohibir la explotación de la obra: reproducción, comunicación pública, distribución, importación y transformación (Decisión 351, art. 13). Son transferibles y temporales.',
        'derechos conexos': 'Derechos de los artistas intérpretes o ejecutantes, los productores de fonogramas y los organismos de radiodifusión sobre sus interpretaciones, fonogramas y emisiones. Son distintos del derecho del autor sobre la obra.',
        'paternidad': 'Derecho moral del autor a ser reconocido como tal y a que su nombre figure en la obra. Puede reivindicarlo en cualquier momento (Decisión 351, art. 11).',
        'integridad': 'Derecho moral a oponerse a toda deformación, mutilación o modificación que atente contra el decoro de la obra o la reputación del autor (Decisión 351, art. 11).',
        'obra inédita': 'Obra que no ha sido divulgada. Está protegida desde su creación, y solo el autor decide si la divulga y cuándo (Decisión 351, art. 11).',
        'registro': 'Inscripción voluntaria de la obra ante la DNDA. Es declarativo y no constitutivo de derechos: hace presumir ciertos los hechos inscritos, salvo prueba en contrario, y deja a salvo los derechos de terceros (Decisión 351, art. 53). Omitirlo no impide gozar ni ejercer los derechos (art. 52).',
        'plagio': 'Presentar como propia, en todo o en parte, la obra de otro. Lesiona el derecho moral de paternidad y, si hay explotación, también los derechos patrimoniales.',
        // --- Derecho de autor: actos de explotación ---
        'reproducción': 'Fijación de la obra en un medio que permita su comunicación o la obtención de copias de toda o parte de ella, por cualquier medio o procedimiento (impresión, digitalización, carga de un archivo en un servidor).',
        'distribución': 'Puesta a disposición del público de ejemplares o copias de la obra mediante venta, arrendamiento o alquiler (Decisión 351, art. 13).',
        'comunicación pública': 'Acto por el cual un público accede a la obra sin que se le entreguen ejemplares: ejecución en establecimientos abiertos al público, radio, televisión o transmisión en línea.',
        'puesta a disposición': 'Modalidad digital de la comunicación pública: el público accede a la obra desde el lugar y en el momento que elige (plataformas, descargas, transmisión en línea).',
        'obra derivada': 'Traducción, adaptación, transformación o arreglo de una obra preexistente. Es obra distinta de la original, pero requiere la autorización previa del autor de esta (Decisión 351, art. 5).',
        'compilación': 'Antología o reunión de obras o datos que, por la selección o disposición de las materias, constituye una creación personal (Decisión 351, art. 4, lit. ll).',
        'programa de ordenador': 'Software. Se protege en los mismos términos que las obras literarias, tanto en código fuente como en código objeto, e incluye la documentación técnica y los manuales de uso (Decisión 351, arts. 3 y 23).',
        'copia de seguridad': 'Copia de un programa de ordenador que el propietario de un ejemplar lícito puede hacer si es indispensable para utilizarlo, o con fines de archivo para sustituir el original dañado o perdido (Decisión 351, art. 24).',
        // --- Derecho de autor: titulares y contratos ---
        'coautor': 'Quien aporta creativamente a la obra (música o letra) de forma esencial. Comparte la titularidad con los demás autores según lo que acuerden.',
        'arreglista': 'Autor de la adaptación o arreglo (obra derivada), hecho con autorización del titular de la obra original.',
        'productor fonográfico': 'Titular de derechos conexos sobre la fijación sonora (fonograma). No debe confundirse con el autor o compositor de la obra.',
        'fonograma': 'Fijación sonora de una interpretación o de otros sonidos. Sobre él recaen los derechos conexos del productor fonográfico, distintos del derecho de autor sobre la obra musical.',
        'titular derivado': 'Persona natural o jurídica, distinta del autor, que adquiere derechos patrimoniales sobre la obra por contrato, encargo, relación laboral o sucesión. Nunca adquiere los derechos morales.',
        'cesión': 'Transferencia total o parcial de derechos patrimoniales a un tercero. Se entiende limitada a las formas de explotación pactadas expresamente en el contrato (Decisión 351, art. 31).',
        'licencia': 'Autorización de uso que el titular concede a un tercero sin transferirle el derecho. Solo cubre las formas de explotación pactadas expresamente (Decisión 351, art. 31).',
        // --- Derecho de autor: gestión y entidades ---
        'dnda': 'Dirección Nacional de Derecho de Autor: administra el Registro Nacional de Derecho de Autor, autoriza y vigila a las sociedades de gestión colectiva y puede intervenir como conciliadora (Decisión 351, art. 51).',
        'sayco': 'Sociedad de Autores y Compositores de Colombia: sociedad de gestión colectiva que recauda por la comunicación pública de las obras musicales de sus afiliados.',
        'acinpro': 'Asociación Colombiana de Intérpretes y Productores Fonográficos: sociedad de gestión colectiva de derechos conexos.',
        'gestión colectiva': 'Administración de los derechos patrimoniales por una sociedad sin ánimo de lucro que recauda y distribuye las remuneraciones como mandataria de sus afiliados (Ley 44 de 1993, arts. 10 y 13).',
        'gestión individual': 'Opción del titular de autorizar y cobrar por sí mismo los usos de su obra, sin afiliarse a una sociedad de gestión colectiva. La afiliación es facultativa.',
        'comprobante de pago': 'Constancia del pago de derechos de autor por la ejecución pública de obras musicales. Los establecimientos deben mantenerla y presentarla al día (Ley 1801 de 2016, art. 87, num. 5).',
        // --- Derecho de autor: defensa ---
        'medida cautelar': 'Instrumento provisional con el que se protege un derecho mientras dura el proceso, para que la sentencia no llegue tarde. No es una sanción ni decide el fondo del asunto.',
        'secuestro preventivo': 'Medida cautelar que el titular puede pedir al juez sobre las obras o ejemplares y sobre el producido de su venta, de su alquiler o de la taquilla de un espectáculo (Ley 23 de 1982, art. 244).',
        'caución': 'Garantía que presta quien pide una medida cautelar para responder por los perjuicios que la medida cause si resulta infundada.',
        'prueba sumaria': 'Prueba que reúne las condiciones de una plena prueba, pero que todavía no ha sido controvertida por la parte contra la cual se aduce (Corte Constitucional, C-523 de 2009).',
        'responsabilidad solidaria': 'Quien autoriza el uso de una obra o presta su apoyo para ello, sin que el usuario tenga autorización previa y expresa del titular, responde junto con el infractor (Decisión 351, art. 54).',
        'reparación integral': 'Principio según el cual la víctima debe recibir ni más ni menos que la pérdida efectivamente sufrida que pueda valorarse económicamente.'
    };

    // Formas abreviadas que remiten a un término del glosario
    const GLOSSARY_ALIASES = {
        'morales': 'derechos morales',
        'patrimoniales': 'derechos patrimoniales'
    };

    // --- ESTRUCTURA DE CASOS ---
    const cases = {
        // --- Caso 1: Derechos de Autor ---
        caso1: {
            area: 'Derecho de autor',
            startNode: 'caso1_start',
            title: 'Caso 1: El Beat Prestado',
            nodes: {
                caso1_start: {
                    background: 'estudio',
                    speaker: 'sofia',
                    text: 'Doctor Villegas, gracias por venir al estudio. Compuse una canción con Ricardo como productor y firmamos contrato de <keyword>cesión</keyword> parcial de <keyword>derechos patrimoniales</keyword> para distribución digital. Ayer vi un canal de YouTube que subió mi tema completo sin permiso, y además un bar del barrio lo suena cada fin de semana. ¿Qué hacemos?',
                    next: 'caso1_contexto',
                    avatarDirection: 'right'
                },

                caso1_contexto: {
                    background: 'estudio',
                    speaker: 'villegas',
                    text: 'Vamos por partes, ${playerName}. Primero, clasifiquemos los derechos en juego. ¿Qué diferencia esencial existe entre <keyword>derechos morales</keyword> y <keyword>derechos patrimoniales</keyword>?',
                    choices: [
                        { text: 'Morales: vínculo personal e inalienables; Patrimoniales: explotación económica, transferibles.', next: 'caso1_r1_ok', efecto: 1 },
                        { text: 'Morales y patrimoniales son lo mismo; solo cambia el nombre.', next: 'caso1_r1_badA', efecto: -1 },
                        { text: 'Morales son de la disquera; patrimoniales siempre del autor.', next: 'caso1_r1_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },

                caso1_r1_badA: {
                    background: 'estudio',
                    speaker: 'villegas',
                    text: 'No. Los <keyword>derechos morales</keyword> protegen el vínculo personal (paternidad, integridad, inédito, retracto, modificación) y no se ceden. Los <keyword>patrimoniales</keyword> permiten autorizar o prohibir usos y sí se ceden o licencian.',
                    next: 'caso1_contexto',
                    avatarDirection: 'left'
                },
                caso1_r1_badB: {
                    background: 'estudio',
                    speaker: 'villegas',
                    text: 'Cuidado: los <keyword>morales</keyword> residen en la persona autora; los <keyword>patrimoniales</keyword> pueden ser del autor o de un tercero por cesión o licencia. ',
                    next: 'caso1_contexto',
                    avatarDirection: 'left'
                },
                caso1_r1_ok: {
                    background: 'estudio',
                    speaker: 'villegas',
                    text: 'Exacto. Ahora, sobre el canal de YouTube que subió el tema completo: ¿qué acto se configura?',
                    next: 'caso1_pregunta_2',
                    avatarDirection: 'left'
                },

                caso1_pregunta_2: {
                    background: 'estudio',
                    speaker: 'villegas',
                    text: 'Subir la canción completa al canal, disponible para cualquiera en línea, ¿es <keyword>reproducción</keyword>, <keyword>comunicación pública</keyword> o <keyword>puesta a disposición</keyword>?',
                    choices: [
                        { text: 'Puesta a disposición (forma de comunicación pública en entorno digital).', next: 'caso1_r2_ok', efecto: 1 },
                        { text: 'Solo reproducción, no hay comunicación pública.', next: 'caso1_r2_badA', efecto: -1 },
                        { text: 'Distribución física de ejemplares.', next: 'caso1_r2_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso1_r2_badA: {
                    background: 'estudio',
                    speaker: 'villegas',
                    text: 'Subirla al servidor implica reproducción digital, sí; pero lo esencial es que cualquiera accede “cuando quiere”: es <keyword>puesta a disposición</keyword> (comunicación pública en línea).',
                    next: 'caso1_pregunta_2',
                    avatarDirection: 'left'
                },
                caso1_r2_badB: {
                    background: 'estudio',
                    speaker: 'villegas',
                    text: 'La <keyword>distribución</keyword> alude a ejemplares materiales (CD, vinilo). En plataformas, prima la comunicación pública/puesta a disposición.',
                    next: 'caso1_pregunta_2',
                    avatarDirection: 'left'
                },
                caso1_r2_ok: {
                    background: 'estudio',
                    speaker: 'villegas',
                    text: 'Correcto. Procede reclamar por infracción patrimonial (y retirar contenido). Pasemos al bar.',
                    next: 'caso1_pregunta_3',
                    avatarDirection: 'left'
                },

                caso1_pregunta_3: {
                    background: 'estudio',
                    speaker: 'villegas',
                    text: 'Si un bar comunica públicamente fonogramas sin licencias, ¿qué entidades intervienen típicamente en Colombia?',
                    choices: [
                        { text: 'SAYCO (autores/compositores) y ACINPRO (intérpretes/productores fonográficos).', next: 'caso1_r3_ok', efecto: 1 },
                        { text: 'Únicamente la DNDA otorga permisos de ejecución pública.', next: 'caso1_r3_badA', efecto: -1 },
                        { text: 'Ninguna; los bares son uso privado.', next: 'caso1_r3_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso1_r3_badA: {
                    background: 'estudio',
                    speaker: 'villegas',
                    text: 'La DNDA tutela y registra; la gestión de cobro/licencias de comunicación pública es de <keyword>SAYCO</keyword> y <keyword>ACINPRO</keyword>.',
                    next: 'caso1_pregunta_3',
                    avatarDirection: 'left'
                },
                caso1_r3_badB: {
                    background: 'estudio',
                    speaker: 'villegas',
                    text: 'Un bar es establecimiento abierto al público: allí hay <keyword>comunicación pública</keyword>, no uso privado.',
                    next: 'caso1_pregunta_3',
                    avatarDirection: 'left'
                },
                caso1_r3_ok: {
                    background: 'estudio',
                    speaker: 'villegas',
                    text: 'Bien. Debemos requerir licencias y pagos. Falta un ángulo aquí en la consola: el “beat” de Ricardo.',
                    next: 'caso1_pregunta_4',
                    avatarDirection: 'left'
                },

                caso1_pregunta_4: {
                    background: 'estudio',
                    speaker: 'ricardo',
                    text: 'Yo hice el beat y la producción aquí en el estudio. ¿Soy <keyword>coautor</keyword> de la obra musical o mi aporte es de <keyword>arreglista</keyword> (obra derivada)?',
                    choices: [
                        { text: 'Coautor si tu aporte creativo incide en la melodía/letra/estructura original; arreglista si adaptas sin crear obra autónoma.', next: 'caso1_r4_ok', efecto: 1 },
                        { text: 'Siempre coautor: todo productor es autor.', next: 'caso1_r4_badA', efecto: -1 },
                        { text: 'Nunca coautor: el productor jamás tiene derechos.', next: 'caso1_r4_badB', efecto: -1 }
                    ],
                    avatarDirection: 'right'
                },
                caso1_r4_badA: {
                    background: 'estudio',
                    speaker: 'villegas',
                    text: 'No siempre. Depende del aporte creativo a la obra (música/letra). Si solo es fijación/producción del <keyword>fonograma</keyword>, hablamos de derecho conexo y de productor fonográfico.',
                    next: 'caso1_pregunta_4',
                    avatarDirection: 'left'
                },
                caso1_r4_badB: {
                    background: 'estudio',
                    speaker: 'villegas',
                    text: 'Tampoco. El <keyword>productor fonográfico</keyword> ostenta derechos conexos sobre la fijación sonora. Y si su aporte creativo modifica la obra, puede nacer una <keyword>obra derivada</keyword> (con autorización).',
                    next: 'caso1_pregunta_4',
                    avatarDirection: 'left'
                },
                caso1_r4_ok: {
                    background: 'estudio',
                    speaker: 'villegas',
                    text: 'Exacto. La calificación cambia obligaciones y repartos. Vamos al cierre.',
                    next: 'caso1_pregunta_final',
                    avatarDirection: 'left'
                },

                caso1_pregunta_final: {
                    background: 'estudio',
                    speaker: 'villegas',
                    text: 'Para una estrategia rápida: 1) Takedown en YouTube por <keyword>puesta a disposición</keyword> no autorizada; 2) Requerimiento al bar por <keyword>comunicación pública</keyword> sin licencia de <keyword>SAYCO</keyword>/<keyword>ACINPRO</keyword>. ¿Qué añadirías?',
                    choices: [
                        { text: 'Recomendación de registro voluntario en la DNDA para prueba y consolidar contratos de cesión/licencia.', next: 'caso1_evaluar', efecto: 1 },
                        { text: 'Nada más; los derechos morales se ceden con el contrato.', next: 'caso1_evaluar', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },

                caso1_evaluar: {
                    logic: true,
                    onLoad: () => {
                        if (desempeño >= 3) showNode('caso1_final_excelente');
                        else if (desempeño > 0) showNode('caso1_final_adecuado');
                        else showNode('caso1_final_repaso');
                    }
                },

                caso1_final_excelente: {
                    background: 'estudio',
                    speaker: 'villegas',
                    text: 'Impecable, ${playerName}. Diferenciaste derechos, actos de uso y ruta práctica (takedown + licencias).',
                    end: true,
                    avatarDirection: 'left'
                },
                caso1_final_adecuado: {
                    background: 'estudio',
                    speaker: 'villegas',
                    text: 'Buen trabajo, ${playerName}. Ajusta los matices entre coautoría/derivada y fortalece la prueba en DNDA.',
                    end: true,
                    avatarDirection: 'left'
                },
                caso1_final_repaso: {
                    background: 'estudio',
                    speaker: 'villegas',
                    text: '${playerName}, repasa <keyword>derechos morales</keyword>/<keyword>patrimoniales</keyword> y los actos de <keyword>comunicación pública</keyword>/<keyword>puesta a disposición</keyword>.',
                    end: true,
                    avatarDirection: 'left'
                }
            }
        },

        // =====================================================================
        // CASOS 2 A 6
        // Construidos sobre las providencias del índice de jurisprudencia de la
        // DNDA (medidas civiles y policivas). Las partes y los hechos son ficticios.
        // Villegas es el abogado titular del despacho; el jugador es su colega.
        // =====================================================================

        // --- Caso 2: registro, obra inédita, idea y forma, obra derivada, derechos morales ---
        // Fuente: Tribunal de Justicia de la Comunidad Andina, Proceso 20-IP-2007.
        caso2: {
            area: 'Derecho de autor',
            startNode: 'caso2_start',
            title: 'Caso 2: El Manuscrito y el Registro',
            nodes: {
                caso2_start: { background: 'oficina', speaker: 'elena', text: 'Gracias por recibirme, Doctor Villegas. Durante tres años escribí unas memorias sobre mi abuelo. Nunca las publiqué ni las registré. Le presté el manuscrito a Martín, un escritor conocido, para que me diera su opinión. Hoy su novela está en las librerías: es mi texto con otro final, y él figura como autor.', next: 'caso2_presentacion_2', avatarDirection: 'right' },
                caso2_presentacion_2: { background: 'libreria', speaker: 'martin', text: 'Elena exagera. Yo inscribí la novela en la <keyword>DNDA</keyword> a mi nombre hace seis meses y tengo el certificado oficial. La registré yo, así que la obra que ven en estas vitrinas es mía.', next: 'caso2_pregunta_1', avatarDirection: 'right' },
                caso2_pregunta_1: {
                    background: 'libreria',
                    speaker: 'villegas',
                    text: 'Empecemos por lo básico, ${playerName}. Elena nunca hizo el <keyword>registro</keyword> de su manuscrito y Martín sí registró la novela. ¿Perdió Elena su derecho?',
                    choices: [
                        { text: 'No. El derecho nace con la creación; el registro solo lo declara.', next: 'caso2_r1_ok', efecto: 1 },
                        { text: 'Sí. El derecho de autor es de quien registra primero.', next: 'caso2_r1_badA', efecto: -1 },
                        { text: 'Sí, porque una obra que nunca se publicó no está protegida.', next: 'caso2_r1_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso2_r1_badA: { background: 'libreria', speaker: 'villegas', text: 'Así funciona la propiedad industrial, no el derecho de autor. La <keyword>Decisión 351</keyword> dice que la protección no está subordinada a ninguna formalidad y que el <keyword>registro</keyword> es declarativo, no constitutivo de derechos (arts. 52 y 53).', next: 'caso2_pregunta_1', avatarDirection: 'left' },
                caso2_r1_badB: { background: 'libreria', speaker: 'villegas', text: 'Al contrario: la <keyword>obra inédita</keyword> está protegida desde que existe. Mantenerla inédita o divulgarla es, de hecho, una decisión que solo le corresponde a la autora (Decisión 351, art. 11).', next: 'caso2_pregunta_1', avatarDirection: 'left' },
                caso2_r1_ok: {
                    background: 'libreria',
                    speaker: 'villegas',
                    text: 'Exacto. La omisión del registro no impide el goce ni el ejercicio de los derechos (Decisión 351, art. 52). Pero entonces, ¿qué valor tiene el certificado que exhibe Martín?',
                    choices: [
                        { text: 'Hace presumir ciertos los hechos inscritos, pero admite prueba en contrario.', next: 'caso2_r2_ok', efecto: 1 },
                        { text: 'Es prueba definitiva de autoría; ya no se puede discutir.', next: 'caso2_r2_badA', efecto: -1 },
                        { text: 'Ninguno. El registro es un trámite inútil.', next: 'caso2_r2_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso2_r2_badA: { background: 'libreria', speaker: 'villegas', text: 'No. La inscripción crea una presunción que cede ante la prueba en contrario, y además deja a salvo los derechos de terceros (Decisión 351, art. 53). Elena es precisamente ese tercero.', next: 'caso2_r1_ok', avatarDirection: 'left' },
                caso2_r2_badB: { background: 'libreria', speaker: 'villegas', text: 'Tampoco. El <keyword>registro</keyword> no crea el derecho, pero da una ventaja probatoria: hoy es Elena quien debe desvirtuar lo que dice el certificado. Por eso conviene registrar.', next: 'caso2_r1_ok', avatarDirection: 'left' },
                caso2_r2_ok: {
                    background: 'libreria',
                    speaker: 'villegas',
                    text: 'Bien. Nos toca probar que el manuscrito de Elena es anterior: borradores, correos con fecha, testigos, el archivo que ella le envió. Escuchemos cómo se defiende Martín.',
                    next: 'caso2_martin_idea',
                    avatarDirection: 'left'
                },
                caso2_martin_idea: {
                    background: 'libreria',
                    speaker: 'martin',
                    text: 'Solo tomé la idea; la vida de un abuelo en el campo no es propiedad de nadie. Además le cambié el final.',
                    next: 'caso2_pregunta_3',
                    avatarDirection: 'right'
                },
                caso2_pregunta_3: {
                    background: 'libreria',
                    speaker: 'villegas',
                    text: 'Martín alega que solo tomó la idea y que cambió el final. ¿Qué respondemos, ${playerName}?',
                    choices: [
                        { text: 'Las ideas y los hechos son libres; lo protegido es la forma en que Elena los expresó. Hay que comparar los textos.', next: 'caso2_r3_ok', efecto: 1 },
                        { text: 'Las ideas también se protegen: nadie más puede escribir sobre ese abuelo.', next: 'caso2_r3_badA', efecto: -1 },
                        { text: 'Tiene razón: si cambió el final, ya es una obra distinta.', next: 'caso2_r3_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso2_r3_badA: { background: 'libreria', speaker: 'villegas', text: 'Cuidado: no son objeto de protección las ideas contenidas en las obras (Decisión 351, art. 7). Cualquiera puede escribir sobre el abuelo. Lo que nadie puede hacer es copiar la forma en que Elena lo contó.', next: 'caso2_pregunta_3', avatarDirection: 'left' },
                caso2_r3_badB: { background: 'libreria', speaker: 'villegas', text: 'No. Cambiar el final no borra la copia del resto. Lo que se compara es la expresión: párrafos, estructura, giros propios. Si eso es de Elena, hay <keyword>reproducción</keyword> y transformación no autorizadas.', next: 'caso2_pregunta_3', avatarDirection: 'left' },
                caso2_r3_ok: {
                    background: 'libreria',
                    speaker: 'villegas',
                    text: 'Correcto: se protege la forma, no la idea (Decisión 351, art. 7). Pero Martín insiste con un segundo argumento.',
                    next: 'caso2_martin_derivada',
                    avatarDirection: 'left'
                },
                caso2_martin_derivada: {
                    background: 'libreria',
                    speaker: 'martin',
                    text: 'Mi novela es una adaptación libre de ese borrador. Por lo tanto, es una <keyword>obra derivada</keyword> independiente y los derechos sobre ella me pertenecen.',
                    next: 'caso2_pregunta_4',
                    avatarDirection: 'right'
                },
                caso2_pregunta_4: {
                    background: 'libreria',
                    speaker: 'villegas',
                    text: 'Martín sostiene que su novela es una “adaptación” y que por eso es una <keyword>obra derivada</keyword> que le pertenece. ¿Es así, ${playerName}?',
                    choices: [
                        { text: 'Solo si tuviera autorización previa de Elena; sin ella, la adaptación es una infracción.', next: 'caso2_r4_ok', efecto: 1 },
                        { text: 'Sí. Toda transformación crea una obra nueva e independiente.', next: 'caso2_r4_badA', efecto: -1 },
                        { text: 'No, porque las adaptaciones nunca tienen protección.', next: 'caso2_r4_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso2_r4_badA: { background: 'libreria', speaker: 'villegas', text: 'Falta la mitad de la regla. La adaptación es una obra distinta de la original, pero sin perjuicio de los derechos del autor de la obra preexistente y de su previa autorización (Decisión 351, art. 5).', next: 'caso2_pregunta_4', avatarDirection: 'left' },
                caso2_r4_badB: { background: 'libreria', speaker: 'villegas', text: 'Sí la tienen: traducciones, adaptaciones y arreglos son obras protegidas. Pero la condición es la autorización previa del autor de la obra original (Decisión 351, art. 5). Aquí no la hubo.', next: 'caso2_pregunta_4', avatarDirection: 'left' },
                caso2_r4_ok: {
                    background: 'libreria',
                    speaker: 'villegas',
                    text: 'Así es. Queda lo más personal. Martín publicó lo que Elena mantenía guardado, puso su propio nombre (eso es <keyword>plagio</keyword>) y le cambió el final. ¿Qué <keyword>derechos morales</keyword> están comprometidos?',
                    choices: [
                        { text: 'Tres: decidir la divulgación, la paternidad y la integridad de la obra.', next: 'caso2_r5_ok', efecto: 1 },
                        { text: 'Ninguno: los perdió al entregarle el manuscrito.', next: 'caso2_r5_badA', efecto: -1 },
                        { text: 'Ninguno: los derechos morales prescriben si no se reclaman pronto.', next: 'caso2_r5_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso2_r5_badA: { background: 'libreria', speaker: 'villegas', text: 'Entregar el papel no es entregar el derecho: los derechos de autor son independientes de la propiedad del objeto material que contiene la obra (Decisión 351, art. 6). Y los <keyword>morales</keyword>, además, son inalienables.', next: 'caso2_r4_ok', avatarDirection: 'left' },
                caso2_r5_badB: { background: 'libreria', speaker: 'villegas', text: 'Los <keyword>derechos morales</keyword> son imprescriptibles e irrenunciables (Decisión 351, art. 11). Elena puede reivindicar su <keyword>paternidad</keyword> en cualquier momento.', next: 'caso2_r4_ok', avatarDirection: 'left' },
                caso2_r5_ok: { background: 'dnda', speaker: 'villegas', text: 'Exacto: divulgación, <keyword>paternidad</keyword> e <keyword>integridad</keyword> (Decisión 351, art. 11). Pediremos que se reconozca su autoría, el retiro de los ejemplares y la indemnización. Y acompañamos a Elena a la sede de la <keyword>DNDA</keyword>.', next: 'caso2_laura_registro', avatarDirection: 'left' },
                caso2_laura_registro: {
                    background: 'dnda',
                    speaker: 'laura',
                    text: 'Bienvenida a la <keyword>DNDA</keyword>, señora Elena. Aquí tiene el certificado de <keyword>registro</keyword> de su manuscrito. Su derecho nació cuando lo escribió; la inscripción no lo crea, pero hace presumir ciertos los hechos inscritos mientras nadie pruebe lo contrario.',
                    next: 'evaluar_final_caso2',
                    avatarDirection: 'right'
                },
                evaluar_final_caso2: {
                    logic: true,
                    onLoad: () => {
                        if (desempeño >= 3) showNode('caso2_final_excelente');
                        else if (desempeño > 0) showNode('caso2_final_adecuado');
                        else showNode('caso2_final_repaso');
                    }
                },
                caso2_final_excelente: { background: 'dnda', speaker: 'villegas', text: 'Impecable, ${playerName}. Distinguiste creación y registro, idea y forma, y los tres derechos morales en juego. Elena está en buenas manos.', end: true, avatarDirection: 'left' },
                caso2_final_adecuado: { background: 'dnda', speaker: 'villegas', text: 'Buen trabajo, ${playerName}. Llegaste a la solución, con algunos tropiezos. Repasa el valor probatorio del registro y el régimen de la obra derivada.', end: true, avatarDirection: 'left' },
                caso2_final_repaso: { background: 'dnda', speaker: 'villegas', text: '${playerName}, conviene volver sobre lo esencial: la protección nace con la creación, se protege la forma y no la idea, y los derechos morales no se pierden. Repasa la Decisión 351, arts. 5, 7, 11, 52 y 53.', end: true, avatarDirection: 'left' }
            }
        },

        // --- Caso 3: textos legales, compilaciones, originalidad, titularidad, indemnización ---
        // Fuente: Tribunal de Justicia de la Comunidad Andina, Proceso 150-IP-2006.
        caso3: {
            area: 'Derecho de autor',
            startNode: 'caso3_start',
            title: 'Caso 3: El Código en Carpeta',
            nodes: {
                caso3_start: { background: 'editorial', speaker: 'hernan', text: 'Gracias por venir a nuestra editorial, Doctor Villegas. Publicamos desde hace diez años un Código Civil concordado: cada artículo lleva concordancias, notas y un índice analítico que elaboró nuestro equipo. Un competidor está vendiendo un folleto en carpeta plástica idéntico al nuestro, a mitad de precio.', next: 'caso3_presentacion_2', avatarDirection: 'right' },
                caso3_presentacion_2: { background: 'editorial', speaker: 'hernan', text: 'Copió el texto de la ley, pero también nuestras concordancias, el índice y hasta los errores de digitación. Quiero que nadie más pueda publicar ese Código.', next: 'caso3_pregunta_1', avatarDirection: 'right' },
                caso3_pregunta_1: {
                    background: 'editorial',
                    speaker: 'villegas',
                    text: 'Hernán pide más de lo que el derecho le da, ${playerName}. ¿Puede impedir que otros publiquen el texto del Código Civil?',
                    choices: [
                        { text: 'No. El texto de la ley es público; nadie puede apropiárselo.', next: 'caso3_r1_ok', efecto: 1 },
                        { text: 'Sí, porque su editorial lo publicó primero.', next: 'caso3_r1_badA', efecto: -1 },
                        { text: 'Sí, si registró su edición en la DNDA.', next: 'caso3_r1_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso3_r1_badA: { background: 'editorial', speaker: 'villegas', text: 'Publicar primero no da exclusividad sobre la ley. El Tribunal Andino lo dijo en un caso muy parecido: nadie puede monopolizar ni apropiarse de las normas jurídicas, que son de carácter público (Proceso 150-IP-2006).', next: 'caso3_pregunta_1', avatarDirection: 'left' },
                caso3_r1_badB: { background: 'editorial', speaker: 'villegas', text: 'El <keyword>registro</keyword> no convierte en propio lo que es de todos. Declara derechos sobre una <keyword>obra</keyword>; no los crea, y menos sobre el texto de una ley.', next: 'caso3_pregunta_1', avatarDirection: 'left' },
                caso3_r1_ok: {
                    background: 'editorial',
                    speaker: 'villegas',
                    text: 'Correcto. Entonces afinemos: si el texto legal es de todos, ¿qué parte de la edición de Hernán sí está protegida?',
                    choices: [
                        { text: 'Lo que su equipo creó: la selección, las concordancias, las notas y el índice.', next: 'caso3_r2_ok', efecto: 1 },
                        { text: 'Nada. Si el contenido es ley, toda la edición es de dominio público.', next: 'caso3_r2_badA', efecto: -1 },
                        { text: 'Todo, incluido el texto legal, por el dinero y el esfuerzo invertidos.', next: 'caso3_r2_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso3_r2_badA: { background: 'editorial', speaker: 'villegas', text: 'No tan rápido. Las compilaciones que por la selección o disposición de las materias constituyen creaciones personales son obras protegidas (Decisión 351, art. 4, lit. ll). El trabajo sobre la ley sí puede generar derechos.', next: 'caso3_r1_ok', avatarDirection: 'left' },
                caso3_r2_badB: { background: 'editorial', speaker: 'villegas', text: 'La inversión no es el criterio. La protección no depende de la complejidad del trabajo ni de los recursos empleados, sino de que haya <keyword>originalidad</keyword>. Y el texto legal no la tiene: no es creación de la editorial.', next: 'caso3_r1_ok', avatarDirection: 'left' },
                caso3_r2_ok: {
                    background: 'editorial',
                    speaker: 'villegas',
                    text: 'Exacto: es una <keyword>compilación</keyword>, protegida en lo que tiene de creación propia. El competidor contesta que unas concordancias “no tienen mérito literario”. ¿Importa?',
                    choices: [
                        { text: 'No. Se exige originalidad, no mérito ni novedad.', next: 'caso3_r3_ok', efecto: 1 },
                        { text: 'Sí. Solo se protegen las obras con valor artístico o literario.', next: 'caso3_r3_badA', efecto: -1 },
                        { text: 'Sí. Debe ser novedosa frente a todo lo publicado antes.', next: 'caso3_r3_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso3_r3_badA: { background: 'editorial', speaker: 'villegas', text: 'La <keyword>Decisión 351</keyword> protege las obras cualquiera que sea su género y sin importar el mérito literario o artístico ni su destino (art. 1). Un índice analítico puede ser tan protegible como un poema.', next: 'caso3_r2_ok', avatarDirection: 'left' },
                caso3_r3_badB: { background: 'editorial', speaker: 'villegas', text: 'Eso se parece más al examen de una patente. En derecho de autor, <keyword>originalidad</keyword> significa que la obra sea propia de su autor y no copia de otra; no que mejore lo que ya existía.', next: 'caso3_r2_ok', avatarDirection: 'left' },
                caso3_r3_ok: {
                    background: 'editorial',
                    speaker: 'villegas',
                    text: 'Bien. Ahora la titularidad: las concordancias las hicieron tres abogados empleados de la editorial, con contrato de trabajo escrito. ¿Quién es <keyword>autor</keyword> y quién puede demandar?',
                    choices: [
                        { text: 'Autores son los abogados; la editorial es titular derivada de los derechos patrimoniales y puede demandar.', next: 'caso3_r4_ok', efecto: 1 },
                        { text: 'La editorial es la autora, porque pagó los salarios.', next: 'caso3_r4_badA', efecto: -1 },
                        { text: 'Solo los tres abogados pueden demandar; la editorial no tiene ningún derecho.', next: 'caso3_r4_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso3_r4_badA: { background: 'editorial', speaker: 'villegas', text: 'Autor solo puede ser la persona física que realiza la creación (Decisión 351, art. 3). Una sociedad puede ser <keyword>titular derivado</keyword> de derechos patrimoniales, pero nunca autora, y los <keyword>derechos morales</keyword> se quedan con quienes crearon.', next: 'caso3_r3_ok', avatarDirection: 'left' },
                caso3_r4_badB: { background: 'editorial', speaker: 'villegas', text: 'La ley presume, salvo pacto en contrario, que los <keyword>derechos patrimoniales</keyword> pasan al empleador en la medida necesaria para sus actividades habituales, siempre que el contrato conste por escrito (Ley 23 de 1982, art. 20).', next: 'caso3_r3_ok', avatarDirection: 'left' },
                caso3_r4_ok: {
                    background: 'editorial',
                    speaker: 'villegas',
                    text: 'Correcto: con contrato escrito opera la presunción de transferencia al empleador (Ley 23 de 1982, art. 20). Última cuestión. Hernán quiere “que lo arruinen”. Según el Tribunal Andino, ¿cómo se mide la indemnización?',
                    choices: [
                        { text: 'Por el daño efectivamente sufrido y probado: ni más ni menos.', next: 'caso3_r5_ok', efecto: 1 },
                        { text: 'Por lo que haga falta para castigar al infractor y que no reincida.', next: 'caso3_r5_badA', efecto: -1 },
                        { text: 'No hay indemnización; solo se retiran los ejemplares.', next: 'caso3_r5_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso3_r5_badA: { background: 'editorial', speaker: 'villegas', text: 'La indemnización repara, no castiga. Rige la <keyword>reparación integral</keyword>: la víctima recibe ni más ni menos que la pérdida que pueda valorarse económicamente. El castigo es asunto de las sanciones penales.', next: 'caso3_r4_ok', avatarDirection: 'left' },
                caso3_r5_badB: { background: 'editorial', speaker: 'villegas', text: 'La autoridad puede ordenar las dos cosas: una indemnización adecuada por los daños y el retiro definitivo de los ejemplares infractores de los canales comerciales, además de las costas (Decisión 351, art. 57).', next: 'caso3_r4_ok', avatarDirection: 'left' },
                caso3_r5_ok: { background: 'editorial', speaker: 'villegas', text: 'Exacto: <keyword>reparación integral</keyword>. Ten presente que la ley colombiana permite al titular elegir entre probar sus perjuicios o acogerse a un sistema de indemnizaciones preestablecidas, sujeto a reglamentación (Ley 1915 de 2018, art. 32). Pediremos indemnización, costas y retiro de los folletos.', next: 'evaluar_final_caso3', avatarDirection: 'left' },
                evaluar_final_caso3: {
                    logic: true,
                    onLoad: () => {
                        if (desempeño >= 3) showNode('caso3_final_excelente');
                        else if (desempeño > 0) showNode('caso3_final_adecuado');
                        else showNode('caso3_final_repaso');
                    }
                },
                caso3_final_excelente: { background: 'editorial', speaker: 'villegas', text: 'Excelente, ${playerName}. Separaste lo que es de todos de lo que es de la editorial, y no confundiste autor con titular. Ese es el criterio.', end: true, avatarDirection: 'left' },
                caso3_final_adecuado: { background: 'editorial', speaker: 'villegas', text: 'Buen trabajo, ${playerName}. El resultado es correcto, aunque dudaste en el camino. Repasa la originalidad en las compilaciones y la titularidad en las obras hechas bajo contrato.', end: true, avatarDirection: 'left' },
                caso3_final_repaso: { background: 'editorial', speaker: 'villegas', text: '${playerName}, hay que afianzar las bases: qué es una obra, qué exige la originalidad y quién puede ser autor. Repasa la Decisión 351, arts. 1, 3 y 4, y el art. 20 de la Ley 23 de 1982.', end: true, avatarDirection: 'left' }
            }
        },

        // --- Caso 4: software, alcance de la licencia, copia de seguridad, cautelares, responsabilidad solidaria ---
        // Fuente: Tribunal de Justicia de la Comunidad Andina, Proceso 24-IP-98.
        caso4: {
            area: 'Derecho de autor',
            startNode: 'caso4_start',
            title: 'Caso 4: Una Licencia, Veinte Equipos',
            nodes: {
                caso4_start: { background: 'oficina', speaker: 'valentina', text: 'Gracias por recibirme, Doctor Villegas. Soy ingeniera de software. Desarrollé un programa de contabilidad y se lo licencié a una firma de asesores: una <keyword>licencia</keyword>, para un solo equipo. Ayer fui a darles soporte y lo encontré instalado en la red, funcionando en veinte computadores.', next: 'caso4_presentacion_2', avatarDirection: 'right' },
                caso4_presentacion_2: { background: 'sistemas', speaker: 'octavio', text: 'Nosotros ya pagamos por ese programa y lo usamos dentro de nuestra propia oficina. Además hicimos copias en varios discos duros “por seguridad”. No veo cuál es el problema.', next: 'caso4_pregunta_1', avatarDirection: 'right' },
                caso4_pregunta_1: {
                    background: 'sistemas',
                    speaker: 'villegas',
                    text: 'Primero la base, ${playerName}. ¿El <keyword>programa de ordenador</keyword> de Valentina está protegido por el derecho de autor?',
                    choices: [
                        { text: 'Sí, como obra literaria: código fuente, código objeto y manuales.', next: 'caso4_r1_ok', efecto: 1 },
                        { text: 'No. El software solo se protege si se patenta.', next: 'caso4_r1_badA', efecto: -1 },
                        { text: 'Solo el código fuente; el programa ya instalado no.', next: 'caso4_r1_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso4_r1_badA: { background: 'sistemas', speaker: 'villegas', text: 'La <keyword>Decisión 351</keyword> incluye expresamente los programas de ordenador entre las obras protegidas (art. 4, lit. l) y los protege en los mismos términos que las obras literarias (art. 23). No hace falta patente ni registro.', next: 'caso4_pregunta_1', avatarDirection: 'left' },
                caso4_r1_badB: { background: 'sistemas', speaker: 'villegas', text: 'La protección cubre tanto el código fuente como el código objeto, y tanto los programas operativos como los aplicativos (Decisión 351, art. 23). También la documentación técnica y los manuales de uso.', next: 'caso4_pregunta_1', avatarDirection: 'left' },
                caso4_r1_ok: {
                    background: 'sistemas',
                    speaker: 'villegas',
                    text: 'Correcto, y sin necesidad de registro. Ahora revisemos el argumento de Octavio: “Pagamos la licencia, podemos usarlo como queramos en la firma”. ¿Tiene razón?',
                    choices: [
                        { text: 'No. La licencia solo cubre el uso pactado: un equipo. El uso en red necesita otra autorización.', next: 'caso4_r2_ok', efecto: 1 },
                        { text: 'Sí. Al pagar la licencia, el programa pasó a ser suyo.', next: 'caso4_r2_badA', efecto: -1 },
                        { text: 'Sí, mientras todos los equipos sean de la misma firma.', next: 'caso4_r2_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso4_r2_badA: { background: 'sistemas', speaker: 'villegas', text: 'Una <keyword>licencia</keyword> autoriza un uso; no transfiere el derecho. Y toda licencia se entiende limitada a las formas de explotación pactadas expresamente en el contrato (Decisión 351, art. 31).', next: 'caso4_r1_ok', avatarDirection: 'left' },
                caso4_r2_badB: { background: 'sistemas', speaker: 'villegas', text: 'La norma dice lo contrario: no es lícito el aprovechamiento del programa por varias personas mediante redes o estaciones de trabajo sin el consentimiento del titular (Decisión 351, art. 26).', next: 'caso4_r1_ok', avatarDirection: 'left' },
                caso4_r2_ok: {
                    background: 'sistemas',
                    speaker: 'villegas',
                    text: 'Exacto. Los <keyword>derechos patrimoniales</keyword> son independientes entre sí: autorizar un uso no autoriza los demás. ¿Y las copias “por seguridad” que guardan en varios discos?',
                    choices: [
                        { text: 'Se permite una copia de respaldo para reemplazar el original si se daña, no para usarla en otros equipos.', next: 'caso4_r3_ok', efecto: 1 },
                        { text: 'Toda copia es ilícita; ni siquiera pueden tener un respaldo.', next: 'caso4_r3_badA', efecto: -1 },
                        { text: 'Pueden hacer las copias que quieran mientras no las vendan.', next: 'caso4_r3_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso4_r3_badA: { background: 'sistemas', speaker: 'villegas', text: 'Hay una excepción. El propietario de un ejemplar lícito puede hacer una copia si es indispensable para usar el programa o con fines de archivo, para sustituir el original dañado o perdido (Decisión 351, art. 24).', next: 'caso4_r2_ok', avatarDirection: 'left' },
                caso4_r3_badB: { background: 'sistemas', speaker: 'villegas', text: 'La <keyword>reproducción</keyword> es un derecho exclusivo aunque no haya venta. La <keyword>copia de seguridad</keyword> es una excepción, y las excepciones se interpretan de forma restrictiva: solo sirve para reemplazar el ejemplar legítimo.', next: 'caso4_r2_ok', avatarDirection: 'left' },
                caso4_r3_ok: {
                    background: 'juzgado',
                    speaker: 'villegas',
                    text: 'Bien. Valentina quiere acudir mañana mismo al juzgado civil para pedir el secuestro de los veinte computadores como <keyword>medida cautelar</keyword>.',
                    next: 'caso4_jueza_cautelar',
                    avatarDirection: 'left'
                },
                caso4_jueza_cautelar: {
                    background: 'juzgado',
                    speaker: 'jueza',
                    text: 'Como jueza civil puedo ordenar el cese de la actividad ilícita y el secuestro de los ejemplares o equipos, pero quien solicita la <keyword>medida cautelar</keyword> debe prestar <keyword>caución</keyword> e identificar con precisión al infractor y los bienes.',
                    next: 'caso4_pregunta_4',
                    avatarDirection: 'right'
                },
                caso4_pregunta_4: {
                    background: 'juzgado',
                    speaker: 'villegas',
                    text: 'Teniendo en cuenta la advertencia del juzgado, ¿qué debemos prevenirle a Valentina antes de pedir la <keyword>medida cautelar</keyword>, ${playerName}?',
                    choices: [
                        { text: 'Que identifique bien al infractor y los equipos: si la medida es infundada o afecta a un tercero, ella responde.', next: 'caso4_r4_ok', efecto: 1 },
                        { text: 'Nada. Las medidas cautelares nunca generan responsabilidad para quien las pide.', next: 'caso4_r4_badA', efecto: -1 },
                        { text: 'Que no se puede: solo hay medidas después de la sentencia.', next: 'caso4_r4_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso4_r4_badA: { background: 'juzgado', speaker: 'villegas', text: 'Sí la generan; por eso se exige <keyword>caución</keyword>. En el caso que estudió el Tribunal Andino (24-IP-98), una sociedad alegó que el secuestro había recaído sobre sus bienes y no sobre los de la empresa investigada, y demandó por daños.', next: 'caso4_pregunta_4', avatarDirection: 'left' },
                caso4_r4_badB: { background: 'juzgado', speaker: 'villegas', text: 'Al contrario: las medidas cautelares pueden pedirse antes de la demanda. La autoridad puede ordenar el cese de la actividad ilícita y el secuestro de los ejemplares y de los medios usados para la infracción (Decisión 351, art. 56).', next: 'caso4_pregunta_4', avatarDirection: 'left' },
                caso4_r4_ok: {
                    background: 'sistemas',
                    speaker: 'villegas',
                    text: 'Correcto: verificar primero, pedir después. De vuelta en la firma, escuchemos la última excusa de Octavio.',
                    next: 'caso4_octavio_excusa',
                    avatarDirection: 'left'
                },
                caso4_octavio_excusa: {
                    background: 'sistemas',
                    speaker: 'octavio',
                    text: 'Un momento: a mí no me metan en eso. Yo no instalé nada en la red; eso lo hizo el técnico de sistemas. Yo solo lo permití como gerente.',
                    next: 'caso4_pregunta_5',
                    avatarDirection: 'right'
                },
                caso4_pregunta_5: {
                    background: 'sistemas',
                    speaker: 'villegas',
                    text: 'Octavio dice que él no instaló las copias, que solo lo permitió. ¿Eso lo exonera, ${playerName}?',
                    choices: [
                        { text: 'No. Quien autoriza o apoya el uso sin permiso del titular responde solidariamente.', next: 'caso4_r5_ok', efecto: 1 },
                        { text: 'Sí. Solo responde quien materialmente hizo las copias.', next: 'caso4_r5_badA', efecto: -1 },
                        { text: 'Sí, porque la responsabilidad es de la firma y nunca de las personas.', next: 'caso4_r5_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso4_r5_badA: { background: 'sistemas', speaker: 'villegas', text: 'Nadie puede autorizar la utilización de una obra, ni prestar su apoyo para ello, si el usuario no tiene autorización previa y expresa del titular. Quien lo hace es solidariamente responsable (Decisión 351, art. 54).', next: 'caso4_pregunta_5', avatarDirection: 'left' },
                caso4_r5_badB: { background: 'sistemas', speaker: 'villegas', text: 'El artículo 54 de la Decisión 351 se refiere a toda persona, natural o jurídica: alcanza a ambas. Y según el Tribunal Andino, apoyar incluye permitir o tolerar: también las conductas omisivas.', next: 'caso4_pregunta_5', avatarDirection: 'left' },
                caso4_r5_ok: { background: 'sistemas', speaker: 'villegas', text: 'Exacto: <keyword>responsabilidad solidaria</keyword> (Decisión 351, art. 54). Requeriremos a la firma para que regularice sus licencias o cese el uso, y dejaremos lista la solicitud de medidas con su caución.', next: 'evaluar_final_caso4', avatarDirection: 'left' },
                evaluar_final_caso4: {
                    logic: true,
                    onLoad: () => {
                        if (desempeño >= 3) showNode('caso4_final_excelente');
                        else if (desempeño > 0) showNode('caso4_final_adecuado');
                        else showNode('caso4_final_repaso');
                    }
                },
                caso4_final_excelente: { background: 'sistemas', speaker: 'villegas', text: 'Muy bien, ${playerName}. Entendiste que una licencia delimita y no regala, y que una medida cautelar mal pedida se devuelve contra la cliente. Así se asesora a Valentina.', end: true, avatarDirection: 'left' },
                caso4_final_adecuado: { background: 'sistemas', speaker: 'villegas', text: 'Buen trabajo, ${playerName}. Vas bien, pero afina dos puntos: el alcance exacto de la licencia y los riesgos de pedir un secuestro sin verificar.', end: true, avatarDirection: 'left' },
                caso4_final_repaso: { background: 'sistemas', speaker: 'villegas', text: '${playerName}, repasa cómo se protege el software y qué cubre una licencia: Decisión 351, arts. 23, 24, 26 y 31. Luego vuelve sobre las medidas cautelares y la responsabilidad solidaria (arts. 54 y 56).', end: true, avatarDirection: 'left' }
            }
        },

        // --- Caso 5: suspensión de un espectáculo, juez competente, prueba sumaria, caución, debido proceso ---
        // Fuentes: Corte Constitucional, C-523 de 2009 y C-1118 de 2005; Ley 23 de 1982, arts. 244 a 247.
        caso5: {
            area: 'Derecho de autor',
            startNode: 'caso5_start',
            title: 'Caso 5: Se Suspende la Función',
            nodes: {
                caso5_start: { background: 'teatro', speaker: 'julian', text: 'Necesito ayuda urgente, Doctor Villegas. Soy dramaturgo. Fabio, un empresario de espectáculos, anuncia para este sábado en este teatro de Cali el estreno de mi obra “La Última Cosecha”. Jamás le di autorización. Hoy es miércoles y yo vivo en Bogotá.', next: 'caso5_presentacion_2', avatarDirection: 'right' },
                caso5_presentacion_2: { background: 'teatro', speaker: 'julian', text: 'Ya vendió casi toda la boletería. Si espero a un juicio ordinario, la función se hace este sábado, él cobra la taquilla y después vaya uno a encontrarlo.', next: 'caso5_pregunta_1', avatarDirection: 'right' },
                caso5_pregunta_1: {
                    background: 'teatro',
                    speaker: 'villegas',
                    text: 'El tiempo es el problema, ${playerName}. ¿Qué herramienta le da la ley a Julián para actuar antes del sábado?',
                    choices: [
                        { text: 'Pedir al juez que suspenda la función y secuestre lo recaudado en taquilla.', next: 'caso5_r1_ok', efecto: 1 },
                        { text: 'Ninguna: mientras la función no ocurra, no hay infracción que reclamar.', next: 'caso5_r1_badA', efecto: -1 },
                        { text: 'Enviar una carta y esperar; un juez no puede intervenir antes del juicio.', next: 'caso5_r1_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso5_r1_badA: { background: 'teatro', speaker: 'villegas', text: 'Sí la hay. El titular puede pedir al juez que suspenda la representación de una obra que se va a presentar en público sin la debida autorización (Ley 23 de 1982, art. 245). La medida es precisamente preventiva.', next: 'caso5_pregunta_1', avatarDirection: 'left' },
                caso5_r1_badB: { background: 'teatro', speaker: 'villegas', text: 'Puede y debe: para eso existe la <keyword>medida cautelar</keyword>. Protege el derecho de forma provisional mientras se decide el proceso, para que la sentencia no llegue cuando el daño ya es irreversible.', next: 'caso5_pregunta_1', avatarDirection: 'left' },
                caso5_r1_ok: {
                    background: 'teatro',
                    speaker: 'villegas',
                    text: 'Exacto: suspensión de la representación (art. 245) y <keyword>secuestro preventivo</keyword> del producido (art. 244 de la Ley 23 de 1982). El proceso de fondo quizá le corresponda a otro juez. ¿Ante quién pedimos la medida urgente?',
                    choices: [
                        { text: 'Ante el juez municipal o del circuito de Cali, donde será el espectáculo.', next: 'caso5_r2_ok', efecto: 1 },
                        { text: 'Solo ante el juez del domicilio del empresario, aunque tarde más.', next: 'caso5_r2_badA', efecto: -1 },
                        { text: 'Ante la sociedad de gestión colectiva, que ordena suspender espectáculos.', next: 'caso5_r2_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso5_r2_badA: { background: 'teatro', speaker: 'villegas', text: 'La ley pensó en la urgencia: la medida puede decretarla el juez municipal o del circuito del lugar del espectáculo, a prevención, aunque no sea el competente para conocer del juicio (Ley 23 de 1982, art. 247).', next: 'caso5_r1_ok', avatarDirection: 'left' },
                caso5_r2_badB: { background: 'teatro', speaker: 'villegas', text: 'Las sociedades de <keyword>gestión colectiva</keyword> recaudan y representan a sus afiliados, pero no son autoridades: no pueden ordenar nada. La suspensión la decreta un juez.', next: 'caso5_r1_ok', avatarDirection: 'left' },
                caso5_r2_ok: {
                    background: 'teatro',
                    speaker: 'villegas',
                    text: 'Bien. La Corte Constitucional avaló esa competencia en la sentencia C-523 de 2009, porque facilita la protección inmediata. ¿Qué debemos acompañar a la solicitud?',
                    choices: [
                        { text: 'Prueba sumaria del derecho de Julián y una caución por los posibles perjuicios.', next: 'caso5_r3_ok', efecto: 1 },
                        { text: 'Una sentencia en firme que declare la infracción.', next: 'caso5_r3_badA', efecto: -1 },
                        { text: 'Nada: basta con que el autor lo afirme.', next: 'caso5_r3_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso5_r3_badA: { background: 'teatro', speaker: 'villegas', text: 'Si hubiera que esperar la sentencia, la medida no serviría de nada. Para decretarla no se exige un derecho ya declarado, sino su <keyword>prueba sumaria</keyword> (Ley 23 de 1982, art. 247).', next: 'caso5_r2_ok', avatarDirection: 'left' },
                caso5_r3_badB: { background: 'teatro', speaker: 'villegas', text: 'No basta la palabra. El artículo 247 exige dos cosas: <keyword>prueba sumaria</keyword> del derecho y <keyword>caución</keyword> suficiente para garantizar los perjuicios que la medida pueda causar al empresario.', next: 'caso5_r2_ok', avatarDirection: 'left' },
                caso5_r3_ok: {
                    background: 'juzgado',
                    speaker: 'villegas',
                    text: 'Correcto. Para el secuestro, además, hay que afirmar que se demandó o se va a demandar al empresario (art. 246). Precisemos ante el juzgado un concepto que suele confundirse: ¿qué es una <keyword>prueba sumaria</keyword>?',
                    choices: [
                        { text: 'Una prueba completa que todavía no ha sido controvertida por la contraparte.', next: 'caso5_r4_ok', efecto: 1 },
                        { text: 'Una prueba incompleta, un simple indicio.', next: 'caso5_r4_badA', efecto: -1 },
                        { text: 'La declaración juramentada de quien pide la medida.', next: 'caso5_r4_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso5_r4_badA: { background: 'juzgado', speaker: 'villegas', text: 'Sumaria no significa débil. Según la Corte, debe reunir las mismas condiciones de fondo de cualquier prueba; lo único que le falta es haber sido sometida a contradicción.', next: 'caso5_r3_ok', avatarDirection: 'left' },
                caso5_r4_badB: { background: 'juzgado', speaker: 'villegas', text: 'No necesariamente. Lo que la define no es el medio, sino que aún no ha sido controvertida. Aquí servirían el certificado de <keyword>registro</keyword> de la obra, el libreto publicado con su nombre o un contrato anterior.', next: 'caso5_r3_ok', avatarDirection: 'left' },
                caso5_r4_ok: {
                    background: 'juzgado',
                    speaker: 'villegas',
                    text: 'Exacto. Con el certificado de registro del libreto y la póliza de <keyword>caución</keyword>, radicamos la solicitud urgente en el juzgado de Cali.',
                    next: 'caso5_jueza_auto',
                    avatarDirection: 'left'
                },
                caso5_jueza_auto: {
                    background: 'juzgado',
                    speaker: 'jueza',
                    text: 'Acreditada con <keyword>prueba sumaria</keyword> la autoría de Julián sobre “La Última Cosecha” y prestada la <keyword>caución</keyword> de ley, este despacho decreta la suspensión inmediata de la función y el <keyword>secuestro preventivo</keyword> de la taquilla.',
                    next: 'caso5_fabio_protesta',
                    avatarDirection: 'right'
                },
                caso5_fabio_protesta: {
                    background: 'teatro',
                    speaker: 'fabio',
                    text: '¡Esto es un abuso! Yo invertí en publicidad y alquiler de este teatro, y me suspenden el espectáculo sin siquiera haberme oído antes. ¡Están violando mi debido proceso!',
                    next: 'caso5_pregunta_5',
                    avatarDirection: 'right'
                },
                caso5_pregunta_5: {
                    background: 'teatro',
                    speaker: 'villegas',
                    text: 'Fabio protesta porque le suspendieron la función sin oírlo previamente. ¿Qué respondió la Corte Constitucional a ese argumento, ${playerName}?',
                    choices: [
                        { text: 'Que no hay violación: la medida es provisional, no es sanción, y la caución cubre sus perjuicios.', next: 'caso5_r5_ok', efecto: 1 },
                        { text: 'Que tiene razón: ninguna medida puede decretarse sin oír antes al afectado.', next: 'caso5_r5_badA', efecto: -1 },
                        { text: 'Que el derecho de autor prevalece siempre y el debido proceso no aplica.', next: 'caso5_r5_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso5_r5_badA: { background: 'teatro', speaker: 'villegas', text: 'La Corte declaró exequible el artículo 247 (C-523 de 2009). Las medidas cautelares se decretan antes de vencer en juicio justamente por su urgencia; el debate completo sobre la titularidad se da después, en el proceso.', next: 'caso5_pregunta_5', avatarDirection: 'left' },
                caso5_r5_badB: { background: 'teatro', speaker: 'villegas', text: 'La Corte no dijo eso. Advirtió que el legislador debe obrar con cuidado, porque la medida afecta a alguien que aún no ha sido vencido en juicio; por eso se exigen prueba, caución y proporcionalidad.', next: 'caso5_pregunta_5', avatarDirection: 'left' },
                caso5_r5_ok: { background: 'teatro', speaker: 'villegas', text: 'Así es. Pero recuérdale a Julián la otra cara: si al final su pretensión no prospera, deberá resarcir los perjuicios causados con la medida. Y antes de radicar la demanda, verifica el trámite vigente en el Código General del Proceso.', next: 'evaluar_final_caso5', avatarDirection: 'left' },
                evaluar_final_caso5: {
                    logic: true,
                    onLoad: () => {
                        if (desempeño >= 3) showNode('caso5_final_excelente');
                        else if (desempeño > 0) showNode('caso5_final_adecuado');
                        else showNode('caso5_final_repaso');
                    }
                },
                caso5_final_excelente: { background: 'teatro', speaker: 'villegas', text: 'Excelente, ${playerName}. Actuaste a tiempo, ante la jueza correcta y con los requisitos completos. Julián llegará al sábado con su derecho protegido.', end: true, avatarDirection: 'left' },
                caso5_final_adecuado: { background: 'teatro', speaker: 'villegas', text: 'Buen trabajo, ${playerName}. Conoces la herramienta, pero aún dudas en sus requisitos. Repasa qué es prueba sumaria y para qué sirve la caución.', end: true, avatarDirection: 'left' },
                caso5_final_repaso: { background: 'teatro', speaker: 'villegas', text: '${playerName}, con una función a tres días no hay margen para dudar. Repasa los artículos 244 a 247 de la Ley 23 de 1982 y la sentencia C-523 de 2009.', end: true, avatarDirection: 'left' }
            }
        },

        // --- Caso 6: comunicación pública, gestión individual, comprobante de pago, vía policiva, prescripción ---
        // Fuentes: Consejo de Estado, Sección Cuarta, 23-mar-2001 (rad. 3593-01); Corte Constitucional,
        // C-1236 de 2005, C-1197 de 2005 y C-1118 de 2005; Ley 1801 de 2016 y Ley 1915 de 2018.
        caso6: {
            area: 'Derecho de autor',
            startNode: 'caso6_start',
            title: 'Caso 6: Música para el Almuerzo',
            nodes: {
                caso6_start: { background: 'oficina', speaker: 'sofia', text: 'Gracias por recibirme. Soy compositora. No estoy afiliada a ninguna sociedad; yo misma licencio mis canciones. En el restaurante campestre de Don Anselmo suenan mis temas todos los fines de semana y nunca me ha pagado un peso.', next: 'caso6_presentacion_2', avatarDirection: 'right' },
                caso6_presentacion_2: { background: 'restaurante', speaker: 'anselmo', text: 'Yo no le debo nada a nadie. Aquí en mi restaurante la música es para ambientar el almuerzo, no cobro entrada, y la saco de una aplicación que pago cada mes. Además tengo mi recibo de <keyword>SAYCO</keyword> y <keyword>ACINPRO</keyword> al día.', next: 'caso6_pregunta_1', avatarDirection: 'right' },
                caso6_pregunta_1: {
                    background: 'restaurante',
                    speaker: 'villegas',
                    text: 'Empecemos por el acto, ${playerName}. Poner música por esos parlantes en el salón de un restaurante, ¿es <keyword>comunicación pública</keyword>?',
                    choices: [
                        { text: 'Sí. Es un establecimiento abierto al público, aunque no cobre entrada.', next: 'caso6_r1_ok', efecto: 1 },
                        { text: 'No, porque no cobra por escuchar la música.', next: 'caso6_r1_badA', efecto: -1 },
                        { text: 'No, porque ya paga la suscripción de la aplicación.', next: 'caso6_r1_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso6_r1_badA: { background: 'restaurante', speaker: 'villegas', text: 'Cobrar entrada no es el criterio. La Ley 23 de 1982 menciona expresamente a los restaurantes entre los establecimientos donde se ejecutan públicamente obras musicales (art. 163). Distinto sería oírla en privado.', next: 'caso6_pregunta_1', avatarDirection: 'left' },
                caso6_r1_badB: { background: 'restaurante', speaker: 'villegas', text: 'Pagar por acceder a la música para uso propio no autoriza a difundirla a los clientes. Los <keyword>derechos patrimoniales</keyword> son independientes entre sí: cada forma de uso necesita su propia autorización.', next: 'caso6_pregunta_1', avatarDirection: 'left' },
                caso6_r1_ok: {
                    background: 'restaurante',
                    speaker: 'villegas',
                    text: 'Correcto. Segundo punto: Sofía no pertenece a SAYCO ni a ninguna otra sociedad. ¿Puede cobrar ella misma por el uso de sus canciones?',
                    choices: [
                        { text: 'Sí. La gestión individual es válida; afiliarse a una sociedad es facultativo.', next: 'caso6_r2_ok', efecto: 1 },
                        { text: 'No. Solo las sociedades de gestión colectiva pueden cobrar derechos de autor.', next: 'caso6_r2_badA', efecto: -1 },
                        { text: 'Solo si antes obtiene permiso de la DNDA para recaudar.', next: 'caso6_r2_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso6_r2_badA: { background: 'restaurante', speaker: 'villegas', text: 'La Corte Constitucional ha dicho lo contrario: las sociedades de gestión colectiva no son la única forma de gestionar los derechos patrimoniales; el titular puede hacerlo mediante otras formas de asociación o de manera individual.', next: 'caso6_r1_ok', avatarDirection: 'left' },
                caso6_r2_badB: { background: 'restaurante', speaker: 'villegas', text: 'La autorización de la <keyword>DNDA</keyword> se exige para funcionar como sociedad de <keyword>gestión colectiva</keyword>, no para que una autora cobre por sus propias obras. La <keyword>gestión individual</keyword> no requiere permiso.', next: 'caso6_r1_ok', avatarDirection: 'left' },
                caso6_r2_ok: {
                    background: 'restaurante',
                    speaker: 'villegas',
                    text: 'Exacto: <keyword>gestión individual</keyword>. Don Anselmo insiste en que su recibo de SAYCO y ACINPRO lo cubre frente a todos. ¿Cubre también las canciones de Sofía?',
                    choices: [
                        { text: 'No. Esas sociedades actúan como mandatarias de sus afiliados, y Sofía no lo es.', next: 'caso6_r3_ok', efecto: 1 },
                        { text: 'Sí. Ese pago libera al establecimiento frente a cualquier autor.', next: 'caso6_r3_badA', efecto: -1 },
                        { text: 'Sí, y Sofía debe reclamarle su parte a SAYCO.', next: 'caso6_r3_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso6_r3_badA: { background: 'restaurante', speaker: 'villegas', text: 'Las sociedades recaudan como mandatarias de sus asociados, por el acto de afiliación (Ley 44 de 1993, art. 13). No representan a quien decidió gestionar por su cuenta: con Sofía el pago debe acordarse directamente.', next: 'caso6_r2_ok', avatarDirection: 'left' },
                caso6_r3_badB: { background: 'restaurante', speaker: 'villegas', text: 'SAYCO no recaudó a nombre de Sofía, porque ella no le dio mandato. La Corte precisó que el <keyword>comprobante de pago</keyword> también debe exigirse respecto de los autores que reclaman en forma individual.', next: 'caso6_r2_ok', avatarDirection: 'left' },
                caso6_r3_ok: {
                    background: 'restaurante',
                    speaker: 'villegas',
                    text: 'Bien. Si Don Anselmo se niega a pagar, además de la demanda civil hay una vía ante las autoridades de policía. ¿En qué norma se apoya hoy?',
                    choices: [
                        { text: 'En el Código Nacional de Policía (Ley 1801 de 2016), que exige el comprobante de pago al día.', next: 'caso6_r4_ok', efecto: 1 },
                        { text: 'En la Ley 232 de 1995, sobre funcionamiento de establecimientos comerciales.', next: 'caso6_r4_badA', efecto: -1 },
                        { text: 'En ninguna: la policía no tiene nada que ver con el derecho de autor.', next: 'caso6_r4_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso6_r4_badA: { background: 'restaurante', speaker: 'villegas', text: 'Esa era la norma, y la verás citada en sentencias anteriores a 2016. Pero la Ley 232 de 1995 fue derogada por el Código Nacional de Policía (Ley 1801 de 2016, art. 242). Verificar la vigencia es parte del oficio.', next: 'caso6_r3_ok', avatarDirection: 'left' },
                caso6_r4_badB: { background: 'restaurante', speaker: 'villegas', text: 'Sí tiene que ver. Mantener y presentar el <keyword>comprobante de pago</keyword> al día es un requisito para ejercer la actividad económica cuando se ejecutan públicamente obras musicales (Ley 1801 de 2016, art. 87, num. 5).', next: 'caso6_r3_ok', avatarDirection: 'left' },
                caso6_r4_ok: {
                    background: 'restaurante',
                    speaker: 'villegas',
                    text: 'Correcto. No presentar el comprobante da lugar a multa y suspensión temporal de la actividad (Ley 1801 de 2016, art. 92, num. 2). Veamos qué ocurre cuando la inspectora de policía visita el restaurante.',
                    next: 'caso6_inspectora_visita',
                    avatarDirection: 'left'
                },
                caso6_inspectora_visita: {
                    background: 'restaurante',
                    speaker: 'inspectora',
                    text: 'Buenas tardes, Don Anselmo. En verificación de los requisitos de la Ley 1801 de 2016 (art. 87, num. 5), le solicito presentar el <keyword>comprobante de pago</keyword> vigente por las obras musicales de gestión individual que suenan en su establecimiento.',
                    next: 'caso6_anselmo_protesta',
                    avatarDirection: 'right'
                },
                caso6_anselmo_protesta: {
                    background: 'restaurante',
                    speaker: 'anselmo',
                    text: '¡Un momento, señora inspectora! Sin la sentencia de un juez usted no puede exigirme ningún comprobante ni amenazarme con suspender el restaurante.',
                    next: 'caso6_pregunta_5',
                    avatarDirection: 'right'
                },
                caso6_pregunta_5: {
                    background: 'restaurante',
                    speaker: 'villegas',
                    text: 'Don Anselmo protesta: “Sin sentencia de un juez la inspectora no puede exigirme nada”. ¿Tiene razón, ${playerName}?',
                    choices: [
                        { text: 'No. Verificar un requisito no es cobrar una deuda; pero deben darle oportunidad de acreditarlo.', next: 'caso6_r5_ok', efecto: 1 },
                        { text: 'Sí. Ninguna autoridad puede exigir documentos sin orden judicial.', next: 'caso6_r5_badA', efecto: -1 },
                        { text: 'No, y pueden cerrarle el local de inmediato sin escucharlo.', next: 'caso6_r5_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso6_r5_badA: { background: 'restaurante', speaker: 'villegas', text: 'El Consejo de Estado resolvió un caso así en 2001: exigir los recibos no es librar un mandamiento de pago, es corroborar que se cumple una obligación. Por eso negó la tutela del restaurante.', next: 'caso6_pregunta_5', avatarDirection: 'left' },
                caso6_r5_badB: { background: 'restaurante', speaker: 'villegas', text: 'Tampoco. En ese caso el cierre se consideró válido porque antes se le permitió a la propietaria acreditar el pago y exponer sus razones. Una actuación arbitraria sí podría controvertirse.', next: 'caso6_pregunta_5', avatarDirection: 'left' },
                caso6_r5_ok: {
                    background: 'oficina',
                    speaker: 'villegas',
                    text: 'Exacto: control de un requisito, con debido proceso. De regreso en el despacho, última pregunta: Sofía piensa afiliarse a una sociedad de gestión. Si lo hace y deja sin cobrar una liquidación, ¿la pierde?',
                    choices: [
                        { text: 'Sí, pero hoy a los diez años de notificado el proyecto de reparto; antes eran tres.', next: 'caso6_r6_ok', efecto: 1 },
                        { text: 'No. Las regalías, como los derechos morales, nunca prescriben.', next: 'caso6_r6_badA', efecto: -1 },
                        { text: 'Sí, a los tres años, como dice la sentencia C-1118 de 2005.', next: 'caso6_r6_badB', efecto: -1 }
                    ],
                    avatarDirection: 'left'
                },
                caso6_r6_badA: { background: 'oficina', speaker: 'villegas', text: 'Los que no prescriben son los <keyword>derechos morales</keyword>. Las remuneraciones son derechos patrimoniales, y la Corte aceptó que la ley les fije un plazo razonable de prescripción (C-1118 de 2005).', next: 'caso6_r5_ok', avatarDirection: 'left' },
                caso6_r6_badB: { background: 'oficina', speaker: 'villegas', text: 'Ese era el plazo cuando se dictó la sentencia. La Ley 1915 de 2018 (art. 34) lo amplió a diez años; los tres años quedaron solo para obras o prestaciones no identificadas. Otra vez: vigencia.', next: 'caso6_r5_ok', avatarDirection: 'left' },
                caso6_r6_ok: { background: 'oficina', speaker: 'villegas', text: 'Correcto: diez años desde la notificación del proyecto de repartición (Ley 44 de 1993, art. 22, modificado por la Ley 1915 de 2018). Una sentencia enseña el criterio; la norma vigente hay que confirmarla siempre.', next: 'evaluar_final_caso6', avatarDirection: 'left' },
                evaluar_final_caso6: {
                    logic: true,
                    onLoad: () => {
                        if (desempeño >= 4) showNode('caso6_final_excelente');
                        else if (desempeño > 0) showNode('caso6_final_adecuado');
                        else showNode('caso6_final_repaso');
                    }
                },
                caso6_final_excelente: { background: 'oficina', speaker: 'villegas', text: 'Sobresaliente, ${playerName}. Manejaste la gestión individual, la vía policiva y, sobre todo, no te quedaste con la norma derogada. Eso distingue a un buen abogado.', end: true, avatarDirection: 'left' },
                caso6_final_adecuado: { background: 'oficina', speaker: 'villegas', text: 'Buen trabajo, ${playerName}. Tienes claro el fondo, pero cuida la vigencia: la Ley 232 de 1995 ya no rige y el plazo de prescripción cambió en 2018.', end: true, avatarDirection: 'left' },
                caso6_final_repaso: { background: 'oficina', speaker: 'villegas', text: '${playerName}, repasa qué es comunicación pública y cómo se gestionan los derechos. Y antes de citar una norma, confirma que siga vigente: revisa la Ley 1801 de 2016 (arts. 87 y 92) y la Ley 1915 de 2018 (art. 34).', end: true, avatarDirection: 'left' }
            }
        }
    };

    // --- LÓGICA DEL MENÚ DE SELECCIÓN DE CASOS ---
    const caseSelectionMenu = document.getElementById('case-selection-menu');

    function populateCaseMenu() {
        if (!caseSelectionMenu) return;
        caseSelectionMenu.innerHTML = '';
        // Los casos se agrupan por área; las áreas no listadas en AREAS van al final
        const areaDe = id => cases[id].area || 'Otros';
        const areas = new Set(AREAS.concat(Object.keys(cases).map(areaDe)));
        areas.forEach(area => {
            const ids = Object.keys(cases).filter(id => areaDe(id) === area);
            if (!ids.length) return;
            const heading = document.createElement('h2');
            heading.classList.add('menu-area');
            heading.textContent = area;
            caseSelectionMenu.appendChild(heading);
            ids.forEach(caseId => {
                const button = document.createElement('button');
                button.classList.add('menu-button', 'case-button');
                button.textContent = cases[caseId].title;
                button.onclick = () => startGame(caseId);
                caseSelectionMenu.appendChild(button);
            });
        });
    }

    // Si se pasa una partida guardada, el caso se retoma donde quedó
    // Descarga de antemano los fondos y personajes del caso, para que cada escena aparezca sin demora
    function precargarImagenes(caso) {
        const rutas = new Set();
        Object.values(caso.nodes).forEach(n => {
            const fondo = BACKGROUNDS[n.background];
            if (fondo) rutas.add(fondo.match(/url\('(.+)'\)/)[1]);
            if (AVATARS[n.speaker]) rutas.add(AVATARS[n.speaker]);
        });
        rutas.forEach(ruta => { new Image().src = ruta; });
    }

    function startGame(caseId, partida) {
        activeCase = cases[caseId];
        activeCaseId = caseId;
        precargarImagenes(activeCase);
        if (partida) {
            nombreJugador = partida.nombre || 'Colega';
            desempeño = partida.puntaje || 0;
            respondidas = new Set(partida.respondidas || []);
        } else {
            nombreJugador = (playerNameInput && playerNameInput.value.trim()) || 'Colega';
            desempeño = 0;
            respondidas = new Set();
        }
        
        if (mainMenuContainer) mainMenuContainer.style.display = 'none';
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = '#2c2c2c';
        if (gameContainer) gameContainer.style.display = 'block';
        
        showNode(partida ? partida.nodo : activeCase.startNode);
    }
    
    // --- FUNCIONES DEL JUEGO ---
    function typewriteText(element, htmlString) {
        if (typewriterInterval) clearInterval(typewriterInterval);
        currentFullText = htmlString;
        element.innerHTML = '';

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlString;
        
        const nodes = Array.from(tempDiv.childNodes);
        let nodeIndex = 0;
        let textIndex = 0;
        
        typewriterInterval = setInterval(() => {
            if (nodeIndex >= nodes.length) {
                clearInterval(typewriterInterval);
                typewriterInterval = null;
                return;
            }

            const currentNode = nodes[nodeIndex];

            if (currentNode.nodeType === Node.TEXT_NODE) {
                if (textIndex < currentNode.textContent.length) {
                    element.innerHTML += currentNode.textContent[textIndex];
                    textIndex++;
                } else {
                    nodeIndex++;
                    textIndex = 0;
                }
            } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
                element.appendChild(currentNode.cloneNode(true));
                nodeIndex++;
                textIndex = 0;
            }
        }, 25);
    }

    function mezclar(lista) {
        const copia = lista.slice();
        for (let i = copia.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copia[i], copia[j]] = [copia[j], copia[i]];
        }
        return copia;
    }

    function skipTypewriter() {
        if (typewriterInterval) {
            clearInterval(typewriterInterval);
            typewriterInterval = null;
            dialogueText.innerHTML = currentFullText;
        }
    }

    function showNode(nodeKey) {
        const node = activeCase.nodes[nodeKey];
        if (!node) {
            console.error('Nodo no encontrado:', nodeKey);
            return;
        }

        if (node.logic && node.onLoad) {
            node.onLoad();
            return;
        }

        currentNodeKey = nodeKey;
        if (node.end) borrarPartida(); else guardarPartida();
        
        if (node.background && BACKGROUNDS[node.background]) {
            backgroundScene.style.backgroundImage = BACKGROUNDS[node.background];
        } else if (!backgroundScene.style.backgroundImage) {
            backgroundScene.style.backgroundImage = BACKGROUNDS.oficina;
        }

        const speaker = node.speaker;
        const isAvatarVisible = speaker && speaker !== 'none';

        avatarImage.classList.remove('avatar-left', 'avatar-right');

        if (isAvatarVisible) {
            const avatarKey = AVATARS[speaker] ? speaker : 'none';
            avatarImage.src = AVATARS[avatarKey];
            avatarImage.style.opacity = 1;

            if (speaker === 'jugador') {
                characterName.textContent = nombreJugador;
            } else {
                characterName.textContent = NOMBRES[speaker] || (speaker.charAt(0).toUpperCase() + speaker.slice(1));
            }
            
            if (node.avatarDirection === 'right') {
                avatarImage.classList.add('avatar-right');
            } else {
                avatarImage.classList.add('avatar-left');
            }
        } else {
            avatarImage.src = AVATARS.none;
            avatarImage.style.opacity = 0;
            characterName.textContent = '(Pensando...)';
        }
        
        const rawText = node.text.replace(/\${playerName}/g, nombreJugador);
        const finalHtmlText = processSpecialFormatting(rawText);

        typewriteText(dialogueText, finalHtmlText);

        choicesBox.innerHTML = '';
        if (node.choices) {
            // Las opciones se muestran en orden aleatorio para que la posición no delate la correcta
            mezclar(node.choices).forEach(choice => {
                const button = document.createElement('button');
                // Los botones muestran texto plano: se retiran las etiquetas <keyword>
                button.textContent = choice.text.replace(/<\/?keyword>/g, '');
                button.classList.add('choice-button');
                button.onclick = () => {
                    // Solo el primer intento en cada pregunta cuenta para el desempeño
                    if (choice.efecto !== undefined && !respondidas.has(nodeKey)) {
                        desempeño += choice.efecto;
                        respondidas.add(nodeKey);
                    }
                    showNode(choice.next);
                };
                choicesBox.appendChild(button);
            });
        } else if (node.next) {
            const button = document.createElement('button');
            button.textContent = 'Continuar...';
            button.classList.add('choice-button');
            button.onclick = () => showNode(node.next);
            choicesBox.appendChild(button);
        } else if (node.end) {
            const backToMenuButton = document.createElement('button');
            backToMenuButton.textContent = 'Volver al Menú Principal';
            backToMenuButton.classList.add('choice-button');
            backToMenuButton.onclick = () => {
                gameContainer.style.display = 'none';
                mainMenuContainer.style.display = 'flex';
                document.body.style.backgroundImage = `url('bg/inicial.jpg')`;
                actualizarBotonCarga();
            };
            choicesBox.appendChild(backToMenuButton);
        }
    }
    
    function processSpecialFormatting(text) {
        return text.replace(/<keyword>(.*?)<\/keyword>/g, (match, word) => {
            const keyword = word.toLowerCase().trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
            return `<span class="keyword" data-key="${keyword}">${word}</span>`;
        });
    }
    
    // --- LÓGICA DE EVENTOS ---
    dialogueBox.addEventListener('click', skipTypewriter);
    
    if (tooltip) {
        dialogueText.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('keyword')) {
                const key = e.target.dataset.key;
                const definicion = glossary[key] || glossary[GLOSSARY_ALIASES[key]];
                if (definicion) {
                    tooltip.innerHTML = `<strong>${e.target.textContent}:</strong> ${processSpecialFormatting(definicion)}`;
                    tooltip.style.display = 'block';
                }
            }
        });

        gameContainer.addEventListener('mousemove', (e) => {
            if (tooltip.style.display === 'block') {
                const containerRect = gameContainer.getBoundingClientRect();
                const escala = (containerRect.width / gameContainer.offsetWidth) || 1;   // el escenario puede estar reducido
                const x = (e.clientX - containerRect.left) / escala;
                const y = (e.clientY - containerRect.top) / escala;
                
                const tooltipWidth = tooltip.offsetWidth;
                const tooltipHeight = tooltip.offsetHeight;
                const containerWidth = gameContainer.offsetWidth;
                const containerHeight = gameContainer.offsetHeight;
                
                let leftPos = x + 20;
                if (leftPos + tooltipWidth > containerWidth - 10) {
                    leftPos = x - tooltipWidth - 20;
                }
                if (leftPos < 10) leftPos = 10;
                
                let topPos = y - tooltipHeight - 15;
                if (topPos < 10) topPos = y + 20;
                if (topPos + tooltipHeight > containerHeight - 10) {
                    topPos = containerHeight - tooltipHeight - 10;
                }
                
                tooltip.style.left = `${leftPos}px`;
                tooltip.style.top = `${topPos}px`;
            }
        });

        dialogueText.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('keyword')) {
                tooltip.style.display = 'none';
            }
        });

        dialogueText.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });

        document.addEventListener('click', () => {
            tooltip.style.display = 'none';
        });
    }

    // --- GUARDADO Y CARGA DE PARTIDA ---
    // La partida se guarda sola en el navegador cada vez que avanza el diálogo.
    function guardarPartida() {
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify({
                caso: activeCaseId,
                nodo: currentNodeKey,
                puntaje: desempeño,
                nombre: nombreJugador,
                respondidas: Array.from(respondidas)
            }));
        } catch (e) { /* almacenamiento no disponible: el juego sigue sin guardar */ }
    }

    function leerPartida() {
        try {
            const partida = JSON.parse(localStorage.getItem(SAVE_KEY));
            const valida = partida && cases[partida.caso] && cases[partida.caso].nodes[partida.nodo];
            return valida ? partida : null;
        } catch (e) { return null; }
    }

    function borrarPartida() {
        try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* sin almacenamiento */ }
    }

    function actualizarBotonCarga() {
        if (!loadGameButton) return;
        const partida = leerPartida();
        loadGameButton.disabled = !partida;
        loadGameButton.title = partida ? `Continuar: ${cases[partida.caso].title}` : 'No hay ninguna partida guardada';
    }

    if (loadGameButton) {
        loadGameButton.onclick = () => {
            const partida = leerPartida();
            if (partida) startGame(partida.caso, partida);
        };
    }

    // --- AJUSTE A LA PANTALLA ---
    // El escenario mide 1280x720. En ventanas más pequeñas se reduce para que no se corten las opciones.
    function ajustarEscala() {
        if (!gameContainer) return;
        const escala = Math.min(window.innerWidth / 1280, window.innerHeight / 720, 1);
        gameContainer.style.transform = escala < 1 ? `scale(${escala})` : '';
    }
    window.addEventListener('resize', ajustarEscala);
    ajustarEscala();

    // --- LÓGICA DE INICIO DEL JUEGO ---
    populateCaseMenu();
    actualizarBotonCarga();
});
