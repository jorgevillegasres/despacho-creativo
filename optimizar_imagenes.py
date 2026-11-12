"""Genera las copias livianas de las imágenes que usa el juego.

Uso (desde la carpeta del juego):  python optimizar_imagenes.py
Requiere Pillow:                    pip install pillow

- avatares/*.png  ->  avatares/*.webp   (conserva la transparencia)
- bg/*.png        ->  bg/*.jpg
- bg/*.jpg pesados se recomprimen en el mismo archivo

Solo procesa lo que falta o lo que cambió, así que puede ejecutarse cuantas
veces haga falta. Los PNG originales se quedan en la carpeta y no se publican.
"""
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).parent
ALTO_AVATAR = 1200      # los personajes más altos se reducen a este alto
ANCHO_FONDO = 1920      # los fondos más anchos se reducen a este ancho
JPG_PESADO = 0.6        # bytes por píxel a partir de los cuales un JPG se recomprime


def kb(ruta):
    return f"{ruta.stat().st_size / 1024:.0f} KB"


def pendiente(origen, destino):
    return not destino.exists() or origen.stat().st_mtime > destino.stat().st_mtime


def reducir(im, ancho=None, alto=None):
    w, h = im.size
    f = min(ancho / w if ancho else 1, alto / h if alto else 1, 1)
    return im if f == 1 else im.resize((round(w * f), round(h * f)), Image.LANCZOS)


def avatares():
    for png in sorted((RAIZ / "avatares").glob("*.png")):
        if png.stem.endswith("_cuerpo_entero"):
            continue    # respaldos que el juego no usa
        webp = png.with_suffix(".webp")
        if pendiente(png, webp):
            im = Image.open(png).convert("RGBA")
            if im.height > ALTO_AVATAR * 1.1:
                im = reducir(im, alto=ALTO_AVATAR)
            im.save(webp, "WEBP", quality=90, alpha_quality=100, method=6)
            print(f"{png.name}: {kb(png)} -> {webp.name}: {kb(webp)}")


def fondos():
    carpeta = RAIZ / "bg"
    for png in sorted(carpeta.glob("*.png")):
        jpg = png.with_suffix(".jpg")
        if pendiente(png, jpg):
            reducir(Image.open(png).convert("RGB"), ancho=ANCHO_FONDO).save(
                jpg, "JPEG", quality=85, optimize=True, progressive=True)
            print(f"{png.name}: {kb(png)} -> {jpg.name}: {kb(jpg)}")
    for jpg in sorted(carpeta.glob("*.jpg")):
        im = Image.open(jpg)
        if jpg.stat().st_size / (im.width * im.height) > JPG_PESADO:
            antes = kb(jpg)
            im = reducir(im.convert("RGB"), ancho=ANCHO_FONDO)
            im.save(jpg, "JPEG", quality=85, optimize=True, progressive=True)
            print(f"{jpg.name}: {antes} -> {kb(jpg)}")


if __name__ == "__main__":
    avatares()
    fondos()
    print("Listo.")
