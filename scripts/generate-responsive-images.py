#!/usr/bin/env python3
"""Generate local responsive WebP variants for the portfolio image library."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageOps


REPO_ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = REPO_ROOT / "artifacts" / "samiam3d" / "public" / "assets" / "images"
OUTPUT_ROOT = REPO_ROOT / "artifacts" / "samiam3d" / "public" / "assets" / "responsive"
TARGET_WIDTHS = (480, 1200)
SUPPORTED_EXTENSIONS = {".avif", ".bmp", ".gif", ".jpeg", ".jpg", ".png", ".tif", ".tiff", ".webp"}
WEBP_QUALITY = 80


def prepare_for_webp(image: Image.Image) -> Image.Image:
    """Return an EXIF-corrected RGB/RGBA image suitable for WebP output."""
    corrected = ImageOps.exif_transpose(image)
    if corrected.mode in {"RGBA", "RGB"}:
        return corrected.copy()
    if corrected.mode in {"LA", "PA"} or "transparency" in corrected.info:
        return corrected.convert("RGBA")
    return corrected.convert("RGB")


def output_path(source: Path, width: int) -> Path:
    relative = source.relative_to(SOURCE_ROOT)
    return OUTPUT_ROOT / relative.parent / f"{source.stem}-{width}.webp"


def generate_variant(source_image: Image.Image, destination: Path, target_width: int) -> None:
    width = min(target_width, source_image.width)
    if width < source_image.width:
        height = max(1, round(source_image.height * width / source_image.width))
        variant = source_image.resize((width, height), Image.Resampling.LANCZOS)
    else:
        variant = source_image.copy()

    destination.parent.mkdir(parents=True, exist_ok=True)
    variant.save(
        destination,
        format="WEBP",
        quality=WEBP_QUALITY,
        method=4,
        exact=True,
    )
    variant.close()


def main() -> None:
    if not SOURCE_ROOT.is_dir():
        raise SystemExit(f"Image source directory does not exist: {SOURCE_ROOT}")

    sources = sorted(
        path
        for path in SOURCE_ROOT.rglob("*")
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS
    )

    generated = 0
    generated_bytes = 0
    failures: list[tuple[Path, str]] = []

    for source in sources:
        try:
            with Image.open(source) as opened:
                opened.seek(0)
                prepared = prepare_for_webp(opened)

            try:
                for target_width in TARGET_WIDTHS:
                    destination = output_path(source, target_width)
                    generate_variant(prepared, destination, target_width)
                    generated += 1
                    generated_bytes += destination.stat().st_size
            finally:
                prepared.close()
        except (OSError, ValueError) as error:
            failures.append((source, str(error)))

    print(f"Sources discovered: {len(sources)}")
    print(f"Variants generated: {generated}")
    print(f"Output size: {generated_bytes / (1024 * 1024):.2f} MiB")

    if failures:
        for source, error in failures:
            print(f"FAILED {source.relative_to(SOURCE_ROOT)}: {error}")
        raise SystemExit(f"Responsive generation failed for {len(failures)} source image(s).")


if __name__ == "__main__":
    main()
