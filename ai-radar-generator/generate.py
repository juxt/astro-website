#!/usr/bin/env python3
"""
JUXT AI Radar PDF Generator

Generates the quarterly AI Radar PDF from HTML templates.
"""

import argparse
from pathlib import Path
from weasyprint import HTML, CSS
from datetime import datetime


def generate_pdf(print_mode: bool = False):
    """Generate the AI Radar PDF from HTML template.

    Args:
        print_mode: If True, generate a print-ready PDF with 3mm bleed
                   and printer's marks (crop marks and registration marks).
    """

    # Set up paths
    base_dir = Path(__file__).parent
    templates_dir = base_dir / "templates"
    output_dir = base_dir / "output"

    html_path = output_dir / "radar.html"
    css_path = output_dir / "styles.css"
    print_css_path = templates_dir / "print-overrides.css"

    if print_mode:
        output_path = output_dir / "ai-radar-print.pdf"
    else:
        output_path = output_dir / "ai-radar.pdf"

    # Ensure output directory exists
    output_dir.mkdir(exist_ok=True)

    mode_label = "print-ready" if print_mode else "standard"
    print(f"🚀 Generating AI Radar PDF ({mode_label})...")
    print(f"   HTML: {html_path}")
    print(f"   CSS:  {css_path}")
    if print_mode:
        print(f"   Print overrides: {print_css_path}")
        print(f"   Bleed: 3mm")
        print(f"   Marks: crop, cross (registration)")

    # Generate PDF
    html = HTML(filename=str(html_path))
    css = CSS(filename=str(css_path))

    stylesheets = [css]
    if print_mode:
        print_css = CSS(filename=str(print_css_path))
        stylesheets.append(print_css)

    html.write_pdf(
        output_path,
        stylesheets=stylesheets,
    )

    # Get file size for reporting
    file_size = output_path.stat().st_size / 1024  # KB

    print(f"✅ PDF generated successfully!")
    print(f"   Output: {output_path}")
    print(f"   Size:   {file_size:.1f} KB")
    print(f"   Time:   {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")


def main():
    parser = argparse.ArgumentParser(
        description="Generate the JUXT AI Radar PDF from HTML templates."
    )
    parser.add_argument(
        "--print",
        dest="print_mode",
        action="store_true",
        help="Generate a print-ready PDF with 3mm bleed and printer's marks",
    )
    args = parser.parse_args()

    generate_pdf(print_mode=args.print_mode)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"❌ Error generating PDF: {e}")
        raise
