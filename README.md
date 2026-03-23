# SATACT Tutoring Portfolio

This is a simple static website (HTML/CSS/JS). No build step required.

## Run locally

Open `index.html` in your browser.

## Customize

1. Tutor details
   - Edit the three tutor cards inside `index.html` under the `#tutors` section.
   - Replace `Tutor 1 (Replace with Name)`, `Tutor 2...`, `Tutor 3...`
2. Contact form (Formspree)
   - Sign up at [formspree.io](https://formspree.io) (free).
   - Create a new form and copy the form ID from the URL (e.g. `formspree.io/f/xYzAbC` → use `xYzAbC`).
   - In `script.js`, set `FORMSPREE_ID = "xYzAbC"` (your actual ID).
   - Formspree will email you new submissions. You can also connect Google Sheets in Formspree settings.
3. If you want to add real photos
   - Replace the `tutor-avatar` letters with `<img>` tags (or upload avatars and style them).

