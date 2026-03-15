import sys
import xml.etree.ElementTree as ET
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import render
from render import FONT_FAMILY, FONT_SIZE_BODY, FONT_SIZE_SMALL, FONT_SIZE_TITLE

data = {
    "languages": [
        {"name": "Python", "proportion": 0.70},
        {"name": "JavaScript", "proportion": 0.30},
    ],
    "commits": 42,
    "pull_requests": 7,
    "issues": 3,
}

svg = render.render(data)

assert FONT_FAMILY in svg, f"FONT_FAMILY not found in SVG output"
assert FONT_SIZE_TITLE in svg, f"FONT_SIZE_TITLE not found in SVG output"
assert FONT_SIZE_BODY in svg, f"FONT_SIZE_BODY not found in SVG output"
assert FONT_SIZE_SMALL in svg, f"FONT_SIZE_SMALL not found in SVG output"

# Strip XML declaration before parsing
xml_body = svg.split("\n", 1)[1] if svg.startswith("<?xml") else svg
ET.fromstring(xml_body)

print("All font assertions passed.")
