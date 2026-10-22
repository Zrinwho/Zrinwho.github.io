# Cheng Luoluo (Zrin) — personal site

Static site, no build step. Trilingual (EN / DE / 中文).

```
index.html          home page
project.html        project detail template (project.html?id=heat-seal …)
assets/style.css    all styles (colour tokens at the top)
assets/main.js      language switch + image placeholders
assets/projects.js  ALL project content and figures, in three languages
images/             portrait.jpg + one <project-id>.jpg per project
```

## Images

Drop photos into `images/` using these names (a labelled grey box shows until the file exists):

`portrait.jpg`, `heat-seal.jpg`, `anode-weight.jpg`, `rca-slurry.jpg`, `quanta-yield.jpg`,
`auto-valve.jpg`, `pneumatic-electric.jpg`, `megmeet-dispensing.jpg`, `field-support.jpg`,
`nsdi.jpg`, `barrier-film.jpg`

Wide landscape images (about 16:7) work best. Do not use photos of a former employer's lines without permission.

Unedited source videos are kept outside this repository, in `G:\for claude\_originals\`.

## Edit content

- Home page text: `index.html` — every sentence exists three times as `data-l="en|de|zh"`.
- Projects: `assets/projects.js` — each project is one object in the list `P`.

## Publish on GitHub Pages

1. Create a public repository named `<your-username>.github.io`.
2. Upload all files in this folder (keep the structure).
3. Repository → Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/ (root)`.
4. After a minute the site is live at `https://<your-username>.github.io`.

Preview locally: run `python -m http.server 8000` in this folder and open http://localhost:8000.
