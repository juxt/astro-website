# JUXT AI Radar PDF Generator

Generates the quarterly AI Radar PDF. The flow is:

1. Build `output/radar.html` from MDX content (Bun + TypeScript)
2. Convert `output/radar.html` to PDF using WeasyPrint (Python)

## Setup

1. **Install system dependencies (macOS with Homebrew):**

   ```bash
   brew install pango gdk-pixbuf libffi
   ```

2. **Create a virtual environment:**

   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install --upgrade pip
   pip install weasyprint
   ```

## Usage

**Easy way** - Use the convenience script (build HTML then PDF):

```bash
./generate.sh
```

**Manual way (HTML only)** - Build `output/radar.html` from MDX:

```bash
cd ai-radar-generator
bun run build:html
```

**Manual way (PDF only)** - Run the Python script directly:

```bash
export DYLD_LIBRARY_PATH="/opt/homebrew/lib:$DYLD_LIBRARY_PATH"
source venv/bin/activate
python generate.py
```

The PDF will be created in `output/ai-radar.pdf`

## Project Structure

```
ai-radar-generator/
├── pyproject.toml             # Python project configuration
├── generate.py                # PDF generation (WeasyPrint)
├── generate.sh                # Convenience script: HTML + PDF
├── package.json               # Bun/Node deps for HTML generation
├── tsconfig.json
├── config.json                # Content order, thresholds, extras
├── templates/
│   ├── _internal/             # System templates (auto-generated content)
│   │   ├── radar-at-a-glance.html
│   │   └── full-radar.html
│   ├── pages/                 # User content pages
│   │   ├── introduction.html
│   │   ├── contributors.html
│   │   └── thank-you.html
│   ├── cover.html             # Cover page layout
│   ├── category-cover.html    # Category cover layout
│   └── styles.css             # Paged media CSS
└── output/                    # Generated files (gitignored)
    ├── radar.html
    ├── styles.css
    └── ai-radar.pdf
```

## Configuration (`config.json`)

- `sourceRoot`: Root MDX folder (e.g. `../../src/pages/ai-radar`)
- `sections`: Ordered list rendered in order; supports:
  - MDX-backed section: `{ "label": "Languages & frameworks", "dir": "languages-frameworks" }`
  - Raw HTML section: `{ "htmlFile": "templates/pages/contributors.html" }`
- `pagination.pageTargetWordCount`: Target words per page when packing content
- `pagination.smallSubsectionMaxWords`: Max words to treat an item as “small” (default 150)
- `pagination.minWordsOnCurrentPageForLongSubsection`: For “long” items, only keep on current page if at least this many words already exist on that page (default 50)
- `categoryCoverTemplatePath`: Path to HTML template injected as a cover before each MDX category. The template may contain placeholders:
  - `{category name}`, `{category description}`
  - `{adopt entries}` (and `{adpot entries}`), `{trial entries}`, `{assess entries}`, `{hold entries}`
  - `{quadrant svg}` (left empty by the generator)
- `cover`: Optional cover metadata (title, subtitle, date, logo path)
- `output.radarHtmlPath`: Where to write the built HTML

## How content is split into pages

- Content is parsed from each section MDX in the configured order.
- We drop MDX imports, custom components (e.g. `SingleQuadrantData`) and radar markers.
- Headings are normalised so:
  - `#` (Adopt/Trial/Assess/Hold) => `<h2>`
  - `##` (technology/item headings) => `<h3>`
- Page splitting uses a word threshold:
  - We pack whole “subsections” (an item `<h3>` and its following paragraphs) without splitting across pages.
  - If adding a subsection would exceed the page target:
    - If it’s “small” (<= `smallSubsectionMaxWords`), we move it to the next page only if the current page’s content would be smaller than the content starting the next page. Otherwise we keep it on the current page.
    - If it’s “long”, we keep it on the current page only if there are at least `minWordsOnCurrentPageForLongSubsection` words already on the page; otherwise we push it to the next page.
  - Category headings and intro paragraphs start a new page for that category.

## Editing

- Edit website content in `src/pages/ai-radar/**/index.mdx`
- Configure order/thresholds in `ai-radar-generator/config.json`
- Edit styling in `ai-radar-generator/templates/styles.css`
- Edit content pages in `templates/pages/`
- Build HTML with `bun run build:html`
- Run `generate.py` to produce the PDF
