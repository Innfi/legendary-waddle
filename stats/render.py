import json
import xml.etree.ElementTree as ET
from pathlib import Path

PALETTE = [
    "#f1e05a",  # yellow
    "#3572A5",  # blue
    "#e34c26",  # orange-red
    "#b07219",  # brown
    "#563d7c",  # purple
    "#00ADD8",  # cyan
    "#4F5D95",  # indigo
    "#89e051",  # green
    "#c6538c",  # pink
    "#41b883",  # teal
]

BG = "#0d1117"
TEXT = "#c9d1d9"
WIDTH = 400
PADDING = 20
BAR_HEIGHT = 18
ROW_GAP = 10
TITLE_H = 50
STATS_H = 70


def render(data: dict) -> str:
    languages = data["languages"]
    commits = data["commits"]
    pull_requests = data["pull_requests"]
    issues = data["issues"]

    lang_section_h = len(languages) * (BAR_HEIGHT + ROW_GAP) + ROW_GAP
    height = TITLE_H + lang_section_h + STATS_H + PADDING

    ET.register_namespace("", "http://www.w3.org/2000/svg")
    svg = ET.Element(
        "svg",
        {
            "xmlns": "http://www.w3.org/2000/svg",
            "width": str(WIDTH),
            "height": str(height),
        },
    )

    # Background
    ET.SubElement(svg, "rect", {"width": str(WIDTH), "height": str(height), "fill": BG})

    # Title
    title = ET.SubElement(
        svg,
        "text",
        {
            "x": str(WIDTH // 2),
            "y": "32",
            "text-anchor": "middle",
            "font-family": "monospace",
            "font-size": "18",
            "font-weight": "bold",
            "fill": TEXT,
        },
    )
    title.text = "GitHub Stats 2026"

    bar_max_w = WIDTH - 2 * PADDING - 120  # room for label + pct

    for i, lang in enumerate(languages):
        y = TITLE_H + i * (BAR_HEIGHT + ROW_GAP) + ROW_GAP
        color = PALETTE[i % len(PALETTE)]
        bar_w = max(2, int(lang["proportion"] * bar_max_w))
        pct = f"{lang['proportion'] * 100:.1f}%"

        # Language name
        name_text = ET.SubElement(
            svg,
            "text",
            {
                "x": str(PADDING),
                "y": str(y + BAR_HEIGHT - 4),
                "font-family": "monospace",
                "font-size": "12",
                "fill": TEXT,
            },
        )
        name_text.text = lang["name"]

        bar_x = PADDING + 90
        ET.SubElement(
            svg,
            "rect",
            {
                "x": str(bar_x),
                "y": str(y),
                "width": str(bar_w),
                "height": str(BAR_HEIGHT),
                "fill": color,
                "rx": "3",
            },
        )

        pct_text = ET.SubElement(
            svg,
            "text",
            {
                "x": str(bar_x + bar_w + 6),
                "y": str(y + BAR_HEIGHT - 4),
                "font-family": "monospace",
                "font-size": "11",
                "fill": TEXT,
            },
        )
        pct_text.text = pct

    # Stats row
    stats_y = TITLE_H + lang_section_h + PADDING
    stats = [("Commits", commits), ("Pull Requests", pull_requests), ("Issues", issues)]
    col_w = WIDTH // len(stats)

    for i, (label, value) in enumerate(stats):
        cx = col_w * i + col_w // 2

        val_text = ET.SubElement(
            svg,
            "text",
            {
                "x": str(cx),
                "y": str(stats_y + 20),
                "text-anchor": "middle",
                "font-family": "monospace",
                "font-size": "20",
                "font-weight": "bold",
                "fill": TEXT,
            },
        )
        val_text.text = str(value)

        lbl_text = ET.SubElement(
            svg,
            "text",
            {
                "x": str(cx),
                "y": str(stats_y + 40),
                "text-anchor": "middle",
                "font-family": "monospace",
                "font-size": "11",
                "fill": "#8b949e",
            },
        )
        lbl_text.text = label

    ET.indent(svg, space="  ")
    xml_bytes = ET.tostring(svg, encoding="unicode", xml_declaration=False)
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + xml_bytes


if __name__ == "__main__":
    data_path = Path(__file__).parent / "data.json"
    out_path = Path(__file__).parent / "stats.svg"

    with open(data_path, encoding="utf-8") as f:
        data = json.load(f)

    svg_content = render(data)
    out_path.write_text(svg_content, encoding="utf-8")
    print(f"Written {out_path}")
