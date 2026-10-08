# Assylbek portfolio website

This folder is a complete static website. It does not require Node.js, PHP or a database.

## Preview locally
Open `index.html` in a browser. For the most accurate behavior, use a tiny local server:
- VS Code → install "Live Server" → right-click `index.html` → "Open with Live Server"
- or run `python -m http.server 8000` in this folder.

## Publish
### Netlify (easiest)
1. Sign in to Netlify.
2. Open the manual deploy / drag-and-drop area.
3. Drag this whole folder (`assylbek-site`) into Netlify.
4. Netlify gives you a public HTTPS link immediately.
5. You can later attach your own domain.

### GitHub Pages
1. Create a new public repository.
2. Upload everything from this folder to the repository root.
3. Repository Settings → Pages → Deploy from branch.
4. Select `main` and `/ (root)`.
5. Save and wait for the public URL.

### Vercel
Import a GitHub repository containing these files. No framework preset is required; it is a static site.

## Files
- `index.html` — the entire one-page portfolio
- `assets/styles.css` — design, mobile layout and animations
- `assets/app.js` — theme toggle, mobile menu, typing animation, reveal animation, project filters
- `assets/photo.jpg` — portrait
- legacy HTML files redirect old URLs to the matching section

## Privacy note
The old draft contained a phone number. It is intentionally not included in this public version. Only the email address is shown.
