# Personajes de Despacho Creativo

Reparto propuesto y prompts para generar las imágenes con el mismo diseño de los avatares actuales.

## Cómo usar este archivo

1. Copia el prompt completo del personaje en tu generador de imágenes. Están en inglés porque los generadores responden mejor así.
2. Si el generador acepta una imagen de referencia de estilo, adjunta `avatares/avatar_villegas.png`. Es lo que más ayuda a mantener la coherencia.
3. Guarda cada imagen en `avatares/` con el nombre de archivo indicado.
4. Si la imagen sale con fondo blanco y no transparente, guárdala igual: el fondo se puede quitar después.

## Requisitos de la imagen

| Aspecto | Valor |
|---|---|
| Formato | PNG, idealmente con fondo transparente; si no, fondo blanco liso |
| Proporción | Vertical 3:4 (por ejemplo 896 × 1152, como `avatar_villegas.png`) |
| Encuadre | De medio muslo hacia arriba; el personaje ocupa casi toda la altura |
| Orientación | Cuerpo girado levemente hacia la derecha de quien mira, rostro al frente |
| Prohibido | Texto, letras, logotipos, marcas de agua, fondos con escenario |

El encuadre importa: `avatar_ricardo.png` y `avatar_anselmo.png` son de cuerpo entero y en el juego se ven más pequeños que Villegas. Al final hay prompts para rehacerlos con el encuadre común.

## Reparto

| Prioridad | Id | Archivo | Quién es | Dónde aparece |
|---|---|---|---|---|
| Ya existe | `villegas` | `avatar_villegas.png` | Abogado titular del despacho | Todos los casos |
| Ya existe | `sofia` | `avatar_sofia.png` | Compositora | Casos 1 y 6 |
| Ya existe | `ricardo` | `avatar_ricardo.png` | Productor musical | Caso 1 |
| Ya existe | `anselmo` | `avatar_anselmo.png` | Dueño del restaurante campestre | Caso 6 |
| A. Clientes | `elena` | `avatar_elena.png` | Escritora, autora del manuscrito | Caso 2 |
| A. Clientes | `hernan` | `avatar_hernan.png` | Editor jurídico | Caso 3 |
| A. Clientes | `valentina` | `avatar_valentina.png` | Ingeniera de software | Caso 4 |
| A. Clientes | `julian` | `avatar_julian.png` | Dramaturgo | Caso 5 |
| B. Contrapartes | `martin` | `avatar_martin.png` | Escritor que publicó la novela ajena | Caso 2 |
| B. Contrapartes | `octavio` | `avatar_octavio.png` | Gerente de la firma que usa el software | Caso 4 |
| B. Contrapartes | `fabio` | `avatar_fabio.png` | Empresario de espectáculos | Caso 5 |
| C. Autoridades | `jueza` | `avatar_jueza.png` | Jueza civil que decide las medidas cautelares | Casos 4 y 5 |
| C. Autoridades | `inspectora` | `avatar_inspectora.png` | Inspectora de policía | Caso 6 |
| C. Autoridades | `laura` | `avatar_laura.png` | Funcionaria de la DNDA (registro) | Caso 2 |

Con el grupo A cada caso tiene su propio cliente, y Sofía y Ricardo dejan de representar a varias personas distintas. Con el grupo B la contraparte aparece y discute en pantalla, en vez de ser solo citada. El grupo C sirve para estos casos y para los que se escriban después.

## Bloque de estilo

Todos los prompts terminan con este mismo bloque. Si creas un personaje nuevo, escribe su descripción y pega el bloque al final.

```text
Clean modern anime / webtoon style character illustration, like a visual-novel character sprite. Crisp dark-brown outlines of even weight, flat cel shading with one soft shadow tone and subtle gradients, muted natural colors, realistic adult proportions, simple expressive face with a small nose and clearly drawn eyes. Three-quarter length shot from mid-thigh up, standing upright, body turned slightly to the viewer's right, face toward the viewer, character centered and filling about 90% of the frame height, legs cropped by the bottom edge. Soft even lighting from the front, no cast shadow. Plain pure white background, nothing else in the frame. No text, no letters, no logos, no watermark, no border. Vertical 3:4 image.
```

Si el generador tiene campo de prompt negativo:

```text
photorealistic, 3D render, chibi, oversized head, scenery, background objects, text, letters, logo, watermark, extra fingers, cropped head, full body with empty margins
```

## Grupo A: clientes

### Elena, escritora (`avatar_elena.png`)

```text
A Colombian woman in her mid-fifties, a writer. Warm tan skin, shoulder-length wavy salt-and-pepper hair, thin round tortoiseshell glasses. Mustard-yellow knit cardigan over a cream blouse, long terracotta skirt. She hugs a worn brown leather folder full of loose manuscript pages against her chest with one arm. Worried but dignified expression, lips pressed together. Clean modern anime / webtoon style character illustration, like a visual-novel character sprite. Crisp dark-brown outlines of even weight, flat cel shading with one soft shadow tone and subtle gradients, muted natural colors, realistic adult proportions, simple expressive face with a small nose and clearly drawn eyes. Three-quarter length shot from mid-thigh up, standing upright, body turned slightly to the viewer's right, face toward the viewer, character centered and filling about 90% of the frame height, legs cropped by the bottom edge. Soft even lighting from the front, no cast shadow. Plain pure white background, nothing else in the frame. No text, no letters, no logos, no watermark, no border. Vertical 3:4 image.
```

### Hernán, editor jurídico (`avatar_hernan.png`)

```text
A Colombian man in his early sixties, owner of a small legal publishing house. Light olive skin, neatly combed white hair, trimmed white mustache, reading glasses pushed up on his forehead. Burgundy sleeveless knit vest over a light-blue shirt with rolled-up sleeves, dark gray trousers. He holds a thick hardbound book with a plain dark-green blank cover under one arm. Indignant, frowning expression. Clean modern anime / webtoon style character illustration, like a visual-novel character sprite. Crisp dark-brown outlines of even weight, flat cel shading with one soft shadow tone and subtle gradients, muted natural colors, realistic adult proportions, simple expressive face with a small nose and clearly drawn eyes. Three-quarter length shot from mid-thigh up, standing upright, body turned slightly to the viewer's right, face toward the viewer, character centered and filling about 90% of the frame height, legs cropped by the bottom edge. Soft even lighting from the front, no cast shadow. Plain pure white background, nothing else in the frame. No text, no letters, no logos, no watermark, no border. Vertical 3:4 image.
```

### Valentina, ingeniera de software (`avatar_valentina.png`)

```text
A Colombian woman about thirty years old, a software engineer. Dark brown skin, natural curly black hair tied up in a high puff. Teal casual blazer over a plain light-gray t-shirt with no print, dark jeans. She carries a slim closed laptop under one arm. Determined, slightly frustrated expression, one eyebrow raised. Clean modern anime / webtoon style character illustration, like a visual-novel character sprite. Crisp dark-brown outlines of even weight, flat cel shading with one soft shadow tone and subtle gradients, muted natural colors, realistic adult proportions, simple expressive face with a small nose and clearly drawn eyes. Three-quarter length shot from mid-thigh up, standing upright, body turned slightly to the viewer's right, face toward the viewer, character centered and filling about 90% of the frame height, legs cropped by the bottom edge. Soft even lighting from the front, no cast shadow. Plain pure white background, nothing else in the frame. No text, no letters, no logos, no watermark, no border. Vertical 3:4 image.
```

### Julián, dramaturgo (`avatar_julian.png`)

```text
A Colombian man about forty years old, a playwright. Medium brown skin, messy dark wavy hair, short stubble. Black turtleneck sweater, long dark-olive coat left open, charcoal scarf hanging loosely around his neck. He grips a rolled-up theater script made of blank pages in one hand. Anxious, urgent expression, brows drawn together. Clean modern anime / webtoon style character illustration, like a visual-novel character sprite. Crisp dark-brown outlines of even weight, flat cel shading with one soft shadow tone and subtle gradients, muted natural colors, realistic adult proportions, simple expressive face with a small nose and clearly drawn eyes. Three-quarter length shot from mid-thigh up, standing upright, body turned slightly to the viewer's right, face toward the viewer, character centered and filling about 90% of the frame height, legs cropped by the bottom edge. Soft even lighting from the front, no cast shadow. Plain pure white background, nothing else in the frame. No text, no letters, no logos, no watermark, no border. Vertical 3:4 image.
```

## Grupo B: contrapartes

### Martín, escritor reconocido (`avatar_martin.png`)

```text
A Colombian man in his mid-forties, a well-known novelist, vain and self-assured. Fair skin, slicked-back dark hair with gray temples, well-groomed short beard. Tailored camel blazer over a black shirt with no tie, a silk pocket square. He holds a hardcover novel with a plain dark-red blank cover at chest height, as if showing it off. Smug half-smile, one eyebrow raised. Clean modern anime / webtoon style character illustration, like a visual-novel character sprite. Crisp dark-brown outlines of even weight, flat cel shading with one soft shadow tone and subtle gradients, muted natural colors, realistic adult proportions, simple expressive face with a small nose and clearly drawn eyes. Three-quarter length shot from mid-thigh up, standing upright, body turned slightly to the viewer's right, face toward the viewer, character centered and filling about 90% of the frame height, legs cropped by the bottom edge. Soft even lighting from the front, no cast shadow. Plain pure white background, nothing else in the frame. No text, no letters, no logos, no watermark, no border. Vertical 3:4 image.
```

### Octavio, gerente de la firma de asesores (`avatar_octavio.png`)

```text
A heavyset Colombian man about fifty years old, manager of an accounting firm, defensive and dismissive. Light brown skin, short receding black hair, clean-shaven. Light-gray suit that fits a little tight, pale-pink shirt, loosened red tie. He holds a smartphone in one hand and raises the other hand palm-out in a dismissive gesture. Annoyed expression, mouth slightly twisted. Clean modern anime / webtoon style character illustration, like a visual-novel character sprite. Crisp dark-brown outlines of even weight, flat cel shading with one soft shadow tone and subtle gradients, muted natural colors, realistic adult proportions, simple expressive face with a small nose and clearly drawn eyes. Three-quarter length shot from mid-thigh up, standing upright, body turned slightly to the viewer's right, face toward the viewer, character centered and filling about 90% of the frame height, legs cropped by the bottom edge. Soft even lighting from the front, no cast shadow. Plain pure white background, nothing else in the frame. No text, no letters, no logos, no watermark, no border. Vertical 3:4 image.
```

### Fabio, empresario de espectáculos (`avatar_fabio.png`)

```text
A Colombian man in his mid-fifties, a flashy show-business promoter. Tanned skin, dyed jet-black hair combed back, thin mustache. Wine-red velvet blazer, black open-collar shirt, a gold chain and a gold ring. Both hands open at waist height in a persuasive salesman gesture. Wide confident showman grin. Clean modern anime / webtoon style character illustration, like a visual-novel character sprite. Crisp dark-brown outlines of even weight, flat cel shading with one soft shadow tone and subtle gradients, muted natural colors, realistic adult proportions, simple expressive face with a small nose and clearly drawn eyes. Three-quarter length shot from mid-thigh up, standing upright, body turned slightly to the viewer's right, face toward the viewer, character centered and filling about 90% of the frame height, legs cropped by the bottom edge. Soft even lighting from the front, no cast shadow. Plain pure white background, nothing else in the frame. No text, no letters, no logos, no watermark, no border. Vertical 3:4 image.
```

## Grupo C: autoridades

### La jueza (`avatar_jueza.png`)

```text
A Colombian woman in her late fifties, a civil court judge. Dark brown skin, short silver-gray natural hair, reading glasses hanging from a thin chain. Black judicial robe over a white blouse. She holds a closed plain manila case file against her side with both hands. Serene, authoritative expression, steady gaze. Clean modern anime / webtoon style character illustration, like a visual-novel character sprite. Crisp dark-brown outlines of even weight, flat cel shading with one soft shadow tone and subtle gradients, muted natural colors, realistic adult proportions, simple expressive face with a small nose and clearly drawn eyes. Three-quarter length shot from mid-thigh up, standing upright, body turned slightly to the viewer's right, face toward the viewer, character centered and filling about 90% of the frame height, legs cropped by the bottom edge. Soft even lighting from the front, no cast shadow. Plain pure white background, nothing else in the frame. No text, no letters, no logos, no watermark, no border. Vertical 3:4 image.
```

### La inspectora de policía (`avatar_inspectora.png`)

```text
A Colombian woman about forty years old, a municipal police inspector, a civilian official and not a uniformed officer. Olive skin, dark hair in a low bun. Navy field vest with several pockets over a white polo shirt, no insignia and no lettering, a blank ID badge holder clipped to the vest. She holds a clipboard with blank forms and a pen. Firm but courteous expression. Clean modern anime / webtoon style character illustration, like a visual-novel character sprite. Crisp dark-brown outlines of even weight, flat cel shading with one soft shadow tone and subtle gradients, muted natural colors, realistic adult proportions, simple expressive face with a small nose and clearly drawn eyes. Three-quarter length shot from mid-thigh up, standing upright, body turned slightly to the viewer's right, face toward the viewer, character centered and filling about 90% of the frame height, legs cropped by the bottom edge. Soft even lighting from the front, no cast shadow. Plain pure white background, nothing else in the frame. No text, no letters, no logos, no watermark, no border. Vertical 3:4 image.
```

### Laura, funcionaria de la DNDA (`avatar_laura.png`)

```text
A Colombian woman in her mid-thirties, a public official at a copyright registry office. Light brown skin, straight black bob haircut. Emerald-green blazer over a white blouse, dark trousers. She holds an open plain folder with a blank certificate inside, offering it forward with both hands. Friendly, professional smile. Clean modern anime / webtoon style character illustration, like a visual-novel character sprite. Crisp dark-brown outlines of even weight, flat cel shading with one soft shadow tone and subtle gradients, muted natural colors, realistic adult proportions, simple expressive face with a small nose and clearly drawn eyes. Three-quarter length shot from mid-thigh up, standing upright, body turned slightly to the viewer's right, face toward the viewer, character centered and filling about 90% of the frame height, legs cropped by the bottom edge. Soft even lighting from the front, no cast shadow. Plain pure white background, nothing else in the frame. No text, no letters, no logos, no watermark, no border. Vertical 3:4 image.
```

## Opcional: rehacer dos avatares con el encuadre común

Estos prompts describen a los personajes tal como están hoy, pero de medio muslo hacia arriba. Si el generador lo permite, adjunta también la imagen actual del personaje como referencia.

### Ricardo, productor musical (`avatar_ricardo.png`)

```text
A slim Colombian man in his late thirties, a music producer dressed formally for a meeting. Light skin, short brown hair combed back, clean-shaven. Charcoal-gray two-button suit, white shirt, navy tie with light diagonal stripes. Arms crossed over his chest. Calm, confident slight smile. Clean modern anime / webtoon style character illustration, like a visual-novel character sprite. Crisp dark-brown outlines of even weight, flat cel shading with one soft shadow tone and subtle gradients, muted natural colors, realistic adult proportions, simple expressive face with a small nose and clearly drawn eyes. Three-quarter length shot from mid-thigh up, standing upright, body turned slightly to the viewer's right, face toward the viewer, character centered and filling about 90% of the frame height, legs cropped by the bottom edge. Soft even lighting from the front, no cast shadow. Plain pure white background, nothing else in the frame. No text, no letters, no logos, no watermark, no border. Vertical 3:4 image.
```

### Don Anselmo, dueño del restaurante campestre (`avatar_anselmo.png`)

```text
A sturdy Colombian countryside man in his mid-sixties, owner of a rustic roadside restaurant. Weathered tan skin, short tousled gray-white hair, full white beard. Cream linen shirt with rolled-up sleeves, brown leather vest, olive-green trousers, brown leather belt with a small leather pouch. Hands on his hips. Proud, stubborn expression with a hint of a smile. Clean modern anime / webtoon style character illustration, like a visual-novel character sprite. Crisp dark-brown outlines of even weight, flat cel shading with one soft shadow tone and subtle gradients, muted natural colors, realistic adult proportions, simple expressive face with a small nose and clearly drawn eyes. Three-quarter length shot from mid-thigh up, standing upright, body turned slightly to the viewer's right, face toward the viewer, character centered and filling about 90% of the frame height, legs cropped by the bottom edge. Soft even lighting from the front, no cast shadow. Plain pure white background, nothing else in the frame. No text, no letters, no logos, no watermark, no border. Vertical 3:4 image.
```
