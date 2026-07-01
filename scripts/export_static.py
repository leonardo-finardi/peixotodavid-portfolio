"""Export the Flask/Jinja site to static files for Firebase Hosting."""

from __future__ import annotations

import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"

sys.path.insert(0, str(ROOT))

from app import app  # noqa: E402


def export() -> None:
    if DIST.exists():
        shutil.rmtree(DIST)

    DIST.mkdir(parents=True)
    shutil.copytree(ROOT / "static", DIST / "static")

    with app.test_client() as client:
        response = client.get("/")
        if response.status_code != 200:
            raise SystemExit(f"Export failed: GET / returned {response.status_code}")

        html = response.get_data(as_text=True)

    (DIST / "index.html").write_text(html, encoding="utf-8")

    static_files = list((DIST / "static").rglob("*"))
    file_count = sum(1 for p in static_files if p.is_file())
    if file_count < 3:
        raise SystemExit("Export incomplete: dist/static/ is missing files.")

    print(f"Static export OK -> {DIST} ({file_count} assets)")


if __name__ == "__main__":
    export()
