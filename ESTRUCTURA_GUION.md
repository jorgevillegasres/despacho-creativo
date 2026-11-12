# Estructura para Guiones de Escenarios - Despacho Creativo

Despacho Creativo es un juego de casos de derecho de autor. El abogado Villegas, titular del despacho, guía al estudiante (su colega) por cada caso.

## Información General del Caso

### Metadatos
```javascript
caso[ID]: {
    area: 'Derecho de autor',   // grupo bajo el cual aparece en el menú
    startNode: 'caso[ID]_start',
    title: 'Caso [N]: [Título Descriptivo]',
    nodes: {
        // Nodos del caso aquí
    }
}
```

### Elementos Requeridos
- **Área**: Grupo bajo el cual aparece el caso en el menú. Las áreas se muestran en el orden de la constante `AREAS` de `game.js`; un área nueva se agrega al final.
- **Fuente**: Encima de cada caso, un comentario con la providencia o norma en que se basa.
- **ID del caso**: Identificador único (ej: `caso1`, `caso2`)
- **Título**: Descriptivo y atractivo (ej: "El Manuscrito y el Registro")
- **Nodo inicial**: Siempre debe ser `caso[ID]_start`

## Estructura de Nodos

### Nodo Básico de Diálogo
```javascript
nodo_id: {
    background: 'oficina|campo|granja',  // Fondo del escenario
    speaker: 'villegas|sofia|ricardo|elena|hernan|valentina|julian|martin|octavio|fabio|anselmo|jueza|inspectora|laura|jugador|none',  // Personaje que habla
    text: 'Texto del diálogo con ${playerName} para el nombre del jugador',
    next: 'siguiente_nodo',  // Nodo que sigue automáticamente
    avatarDirection: 'left|right'  // Dirección del avatar
}
```

### Nodo con Opciones de Respuesta
```javascript
nodo_pregunta: {
    background: 'oficina',
    speaker: 'villegas',
    text: 'Pregunta con <keyword>términos jurídicos</keyword> resaltados',
    choices: [
        { 
            text: 'Opción A - Correcta', 
            next: 'nodo_respuesta_correcta', 
            efecto: 1  // Suma al desempeño
        },
        { 
            text: 'Opción B - Incorrecta', 
            next: 'nodo_respuesta_incorrecta_A', 
            efecto: -1  // Resta del desempeño
        },
        { 
            text: 'Opción C - Neutral', 
            next: 'nodo_respuesta_neutral', 
            efecto: 0  // Sin cambio en desempeño
        }
    ],
    avatarDirection: 'left'
}
```

### Nodo de Evaluación Final
```javascript
evaluar_final_caso[ID]: {
    logic: true,
    onLoad: () => {
        if (desempeño >= 3) showNode('caso[ID]_final_excelente');
        else if (desempeño > 0) showNode('caso[ID]_final_adecuado');
        else showNode('caso[ID]_final_repaso');
    }
}
```

### Nodos de Final
```javascript
caso[ID]_final_excelente: { 
    speaker: 'villegas', 
    text: 'Mensaje de felicitación por excelente desempeño', 
    end: true, 
    avatarDirection: 'left' 
},
caso[ID]_final_adecuado: { 
    speaker: 'villegas', 
    text: 'Mensaje de buen trabajo con sugerencias', 
    end: true, 
    avatarDirection: 'left' 
},
caso[ID]_final_repaso: { 
    speaker: 'villegas', 
    text: 'Mensaje sugiriendo repaso de conceptos', 
    end: true, 
    avatarDirection: 'left' 
}
```

## Elementos del Sistema

### Personajes Disponibles
- **villegas**: Abogado titular del despacho. Formula las preguntas y da la retroalimentación. Los clientes lo tratan de «Doctor Villegas».
- **sofia**: Compositora (Casos 1 y 6)
- **ricardo**: Productor musical (Caso 1)
- **elena**: Escritora, autora del manuscrito (Caso 2)
- **hernan**: Editor jurídico (Caso 3)
- **valentina**: Ingeniera de software (Caso 4)
- **julian**: Dramaturgo (Caso 5)
- **martin**: Escritor que publicó la novela ajena (Caso 2)
- **octavio**: Gerente de la firma que usa el software (Caso 4)
- **fabio**: Empresario de espectáculos (Caso 5)
- **anselmo**: Dueño de un restaurante campestre (Caso 6)
- **jueza**: Jueza civil que decide las medidas cautelares (Casos 4 y 5)
- **inspectora**: Inspectora de policía (Caso 6)
- **laura**: Funcionaria de la DNDA (Caso 2)
- **jugador**: El estudiante/usuario; Villegas lo llama por su nombre o «Colega»
- **none**: Sin avatar visible

El nombre que se muestra sobre el diálogo sale de la constante `NOMBRES` de `game.js` (por ejemplo, `sofia` se muestra como «Sofía»).

### Cómo Agregar un Personaje
1. Guardar la imagen en `avatares/` con el nombre `avatar_[id].png` (minúsculas, sin tildes ni espacios).
2. Ejecutar `python optimizar_imagenes.py` en la carpeta del juego. Crea `avatar_[id].webp`, la copia liviana que usa el juego; el PNG original se queda en la carpeta y no se publica.
3. Agregar la ruta en la constante `AVATARS` de `game.js`: `elena: "avatares/avatar_elena.webp"`.
4. Agregar el nombre visible en la constante `NOMBRES`: `elena: 'Elena'`.
5. Usar el `id` en el campo `speaker` de los nodos.

### Requisitos de la Imagen de un Personaje
- **Formato**: PNG con fondo transparente.
- **Proporción**: vertical, cercana a 3:4 (por ejemplo 896 × 1152 o 896 × 1200 píxeles, como el avatar de Villegas).
- **Encuadre**: de medio muslo hacia arriba, con el personaje ocupando casi toda la altura y las piernas cortadas por el borde inferior. El motor apoya la imagen en la base del escenario; un cuerpo entero con márgenes se ve pequeño al lado de los demás.
- **Orientación**: de frente o girado levemente. El motor voltea la imagen cuando el nodo usa `avatarDirection: 'right'`, así que no debe llevar texto ni logotipos legibles.
- **Estilo**: ilustración tipo anime de línea limpia, sombreado plano con degradados suaves, proporciones realistas y colores sobrios, igual que los avatares existentes.

### Fondos Disponibles
- **oficina**: `bg/fondo_oficina.jpg`
- **campo**: `bg/fondo_campo.jpg` 
- **granja**: `bg/fondo_granja.jpg`

Un fondo nuevo se guarda en `bg/` (en PNG o JPG) y se pasa por `python optimizar_imagenes.py`, que deja un JPG liviano. Luego se agrega a la constante `BACKGROUNDS` de `game.js`.

### Direcciones de Avatar
- **left**: Avatar mirando hacia la izquierda (por defecto)
- **right**: Avatar mirando hacia la derecha (volteado)

## Palabras Clave del Glosario

### Términos Implementados
Usar formato `<keyword>término</keyword>` para activar el tooltip:

- Conceptos básicos: `obra`, `autor`, `originalidad`, `decisión 351`, `derechos morales`, `derechos patrimoniales`, `derechos conexos`, `paternidad`, `integridad`, `obra inédita`, `registro`, `plagio`
- Actos de explotación: `reproducción`, `distribución`, `comunicación pública`, `puesta a disposición`, `obra derivada`, `compilación`, `programa de ordenador`, `copia de seguridad`
- Titulares y contratos: `coautor`, `arreglista`, `productor fonográfico`, `fonograma`, `titular derivado`, `cesión`, `licencia`
- Gestión y entidades: `dnda`, `sayco`, `acinpro`, `gestión colectiva`, `gestión individual`, `comprobante de pago`
- Defensa: `medida cautelar`, `secuestro preventivo`, `caución`, `prueba sumaria`, `responsabilidad solidaria`, `reparación integral`

Las mayúsculas no importan: `<keyword>DNDA</keyword>` encuentra `dnda`.

Las formas abreviadas `morales` y `patrimoniales` remiten a `derechos morales` y `derechos patrimoniales` mediante la constante `GLOSSARY_ALIASES`.

### Agregar Nuevos Términos
Para agregar términos al glosario, editar el objeto `glossary` en `game.js`:

```javascript
const glossary = {
    'nuevo_termino': 'Definición completa del término jurídico, con la norma que la respalda.',
    // ... otros términos
};
```

## Convenciones de Nomenclatura

### Nodos
- `caso[ID]_start`: Nodo inicial
- `caso[ID]_presentacion_[N]`: Presentación del caso
- `caso[ID]_pregunta_[N]`: Pregunta al estudiante
- `caso[ID]_r[N]_ok`: Respuesta correcta a la pregunta N (suele contener la pregunta siguiente)
- `caso[ID]_r[N]_badA`, `caso[ID]_r[N]_badB`: Explicación de cada respuesta incorrecta; vuelve a la pregunta
- `evaluar_final_caso[ID]`: Evaluación automática
- `caso[ID]_final_[excelente/adecuado/repaso]`: Finales según desempeño

### Variables del Sistema
- `${playerName}`: Nombre del jugador
- `desempeño`: Contador de puntuación (suma/resta según respuestas)

## Sistema de Puntuación

### Efectos de Respuestas
- **+1**: Respuesta completamente correcta
- **0**: Respuesta neutral o parcialmente correcta
- **-1**: Respuesta incorrecta

### Reglas del Motor
- **Solo cuenta el primer intento.** Si el estudiante falla, ve la explicación y vuelve a la pregunta; el segundo intento ya no suma ni resta.
- **Las opciones salen en orden aleatorio.** No escribir opciones que dependan de la posición («todas las anteriores», «la primera»).
- **Exactamente una opción con `efecto: 1`** por pregunta.

### Evaluación Final
- **≥ 3 puntos**: Final excelente (≥ 4 si el caso tiene seis preguntas)
- **1-2 puntos**: Final adecuado  
- **≤ 0 puntos**: Final de repaso

### Guardado
La partida se guarda sola en el navegador cada vez que avanza el diálogo y se borra al terminar el caso. El botón «Cargar Partida» retoma la última partida sin terminar.

## Ejemplo Completo de Caso

```javascript
caso7: {
    area: 'Derecho de autor',
    startNode: 'caso7_start',
    title: 'Caso 7: Ejemplo Didáctico',
    nodes: {
        caso7_start: { 
            background: 'oficina', 
            speaker: 'sofia', 
            text: 'Doctor Villegas, gracias por recibirme. Mi problema es este...', 
            next: 'caso7_pregunta_1', 
            avatarDirection: 'right' 
        },
        caso7_pregunta_1: {
            background: 'oficina',
            speaker: 'villegas',
            text: '${playerName}, ¿necesita Sofía el <keyword>registro</keyword> para reclamar?',
            choices: [
                { text: 'No; el derecho nace con la creación.', next: 'caso7_r1_ok', efecto: 1 },
                { text: 'Sí; sin registro no hay derecho.', next: 'caso7_r1_badA', efecto: -1 }
            ],
            avatarDirection: 'left'
        },
        caso7_r1_badA: {
            speaker: 'villegas',
            text: 'No. El registro es declarativo, no constitutivo (Decisión 351, art. 53).',
            next: 'caso7_pregunta_1',
            avatarDirection: 'left'
        },
        caso7_r1_ok: {
            speaker: 'villegas',
            text: 'Correcto. Sigamos...',
            next: 'evaluar_final_caso7',
            avatarDirection: 'left'
        },
        // ... resto de nodos
        evaluar_final_caso7: {
            logic: true,
            onLoad: () => {
                if (desempeño >= 3) showNode('caso7_final_excelente');
                else if (desempeño > 0) showNode('caso7_final_adecuado');
                else showNode('caso7_final_repaso');
            }
        },
        caso7_final_excelente: { 
            speaker: 'villegas', 
            text: '¡Excelente trabajo, ${playerName}!', 
            end: true, 
            avatarDirection: 'left' 
        }
        // ... finales adecuado y repaso
    }
}
```

## Notas Importantes

1. **Consistencia**: Mantener la nomenclatura establecida
2. **Keywords**: Siempre usar términos del glosario existente
3. **Personajes**: Respetar las personalidades establecidas
4. **Flujo**: Asegurar que todos los nodos tengan salida (next, choices, o end)
5. **Evaluación**: Incluir siempre nodo de evaluación automática
6. **Finales**: Crear tres finales diferentes según desempeño
7. **Keywords solo en diálogos**: No usar `<keyword>` en el texto de las opciones; los botones muestran texto plano
8. **Longitud**: Diálogos de hasta unos 350 caracteres y opciones de hasta unos 120, para que todo quepa en pantalla
9. **Comillas**: Dentro de los textos usar comillas tipográficas (“ ”), no comillas simples, que cierran la cadena de JavaScript
10. **Vigencia**: Antes de citar una norma, confirmar que siga vigente. Si el caso parte de una sentencia antigua, decir qué cambió después

## Casos Existentes

| ID | Título | Temas | Fuente |
|---|---|---|---|
| `caso1` | El Beat Prestado | Derechos morales y patrimoniales, puesta a disposición, coautoría | — |
| `caso2` | El Manuscrito y el Registro | Registro, obra inédita, idea y forma, obra derivada, derechos morales | TJCA, Proceso 20-IP-2007 |
| `caso3` | El Código en Carpeta | Textos legales, compilaciones, originalidad, titularidad, indemnización | TJCA, Proceso 150-IP-2006 |
| `caso4` | Una Licencia, Veinte Equipos | Software, alcance de la licencia, copia de seguridad, cautelares, responsabilidad solidaria | TJCA, Proceso 24-IP-98 |
| `caso5` | Se Suspende la Función | Suspensión de espectáculo, juez competente, prueba sumaria, caución | Corte Constitucional, C-523/09 y C-1118/05 |
| `caso6` | Música para el Almuerzo | Comunicación pública, gestión individual, comprobante de pago, vía policiva, prescripción | Consejo de Estado, rad. 3593-01; C-1236/05, C-1197/05, C-1118/05; Leyes 1801/2016 y 1915/2018 |

Las partes y los hechos de los casos 2 a 6 son ficticios; solo la regla jurídica viene de la providencia.

Los casos de bienes de la versión original («El Poseedor de la Tierra» y «Lo que la Finca se Llevó») se retiraron de esta edición; siguen en las carpetas `Vigo Abogado Game` y `game`.
