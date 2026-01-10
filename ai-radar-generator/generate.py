#!/usr/bin/env python3
"""
JUXT AI Radar PDF Generator

Generates the quarterly AI Radar PDF from HTML templates.
"""

from pathlib import Path
from weasyprint import HTML, CSS
from datetime import datetime


def generate_pdf():
    """Generate the AI Radar PDF from HTML template."""

    # Set up paths
    base_dir = Path(__file__).parent
    templates_dir = base_dir / "output"
    output_dir = base_dir / "output"

    html_path = templates_dir / "radar.html"
    css_path = templates_dir / "styles.css"
    output_path = output_dir / "ai-radar.pdf"

    # Ensure output directory exists
    output_dir.mkdir(exist_ok=True)

    print(f"🚀 Generating AI Radar PDF...")
    print(f"   HTML: {html_path}")
    print(f"   CSS:  {css_path}")

    # Generate PDF
    html = HTML(filename=str(html_path))
    css = CSS(filename=str(css_path))

    html.write_pdf(
        output_path,
        stylesheets=[css],
    )

    # Get file size for reporting
    file_size = output_path.stat().st_size / 1024  # KB

    print(f"✅ PDF generated successfully!")
    print(f"   Output: {output_path}")
    print(f"   Size:   {file_size:.1f} KB")
    print(f"   Time:   {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")


if __name__ == "__main__":
    try:
        generate_pdf()
    except Exception as e:
        print(f"❌ Error generating PDF: {e}")
        raise
