# Two-Column Resume Template

A single-page resume site with a sidebar and a main column. All content and colours come from one file, `config/data.json`, so you can publish your own resume on GitHub Pages without touching the HTML, CSS or JavaScript.

- Light and dark mode, following the visitor's system setting, with a toggle
- Responsive: two columns on desktop, one on mobile
- Prints to a clean two-column PDF
- No build step and nothing to install

## Use it for your own resume

1. Click **Use this template → Create a new repository** at the top of this page. Keep the repository **public** (GitHub Pages needs that on free accounts).
2. In your new repository, edit `config/data.json` with your own details, and replace `images/profile.svg` with your photo (see [Images](#images)).
3. Go to **Settings → Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose branch `main` and folder `/ (root)`, then **Save**.

After a minute or two your resume is live at `https://<your-username>.github.io/<repository-name>/`. Every later change you push to `main` is published automatically.

## Preview on your computer

Opening `index.html` directly does not work, because browsers block the page from reading `config/data.json` over `file://`. Start a local server in the project folder instead:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Editing `config/data.json`

The file must stay valid JSON: double quotes around every key and text value, and no comma after the last item in a list or object. If the page shows "Could not load resume data", paste the file into a JSON validator to find the typo.

**Every section is optional.** Delete a key, or leave its list empty, and that section disappears from the page.

### `personalInfo`

| Key | Shown as |
| --- | --- |
| `name`, `title` | Heading under the photo. `name` is also used for the browser tab title. |
| `profileImage` | Path to your photo, for example `images/me.jpg`. |
| `faviconPath` | Path to the browser tab icon. |
| `location`, `phone`, `email` | Contact list. A phone number written with a leading `+` stays dialable. |
| `websiteURL`, `websiteLabel` | Website link and the text shown for it. |
| `linkedinURL`, `linkedinUser` | LinkedIn link and the text shown for it. |
| `githubURL`, `githubUser` | GitHub link and the text shown for it. |

### `sections.sidebar`

| Key | Format |
| --- | --- |
| `aboutMe` | Text. |
| `skills` | List of `{ "category": "...", "items": ["...", "..."] }`. |
| `languages` | List of `{ "name": "...", "level": "..." }`. |
| `interests` | List of text items. |

### `sections.main`

| Key | Fields of each item |
| --- | --- |
| `education` | `degree`, `institution`, `period`, `gpa`, `details`, `achievements` (list) |
| `experience` | `title`, `company`, `location`, `period`, `summary`, `responsibilities` (list) |
| `projects` | `name`, `technologies`, `description`, `link`, `githubLink` |
| `publications` | `title`, `authors`, `venue`, `year`, `link`, `linkText` |

Within an item, any field you leave out is simply not shown.

### `themeSettings`

`light` and `dark` each take the same colour keys: `primaryColor`, `backgroundColor`, `sidebarBackgroundColor`, `mainContentBackgroundColor`, `textColor`, `subtextColor`, `borderColor` and `cardShadow`. Any CSS colour value works.

### `footer`

`text` is the line at the bottom of the page. `repoLink` and `repoLinkText` add a link after it; remove both to hide the link.

## Images

Put your photo in `images/` and set `personalInfo.profileImage` to its path. A square image of about 400×400 pixels looks best; it is cropped to a circle. To change the browser tab icon, add your own file and point `personalInfo.faviconPath` at it.

## Save as PDF

Open the page, press <kbd>Ctrl</kbd>+<kbd>P</kbd> (<kbd>Cmd</kbd>+<kbd>P</kbd> on macOS) and choose **Save as PDF**. The print layout keeps both columns and hides the theme toggle and footer.

## Good to know

- Section headings such as "Education" and "About Me" are written in `index.html`. Edit them there if you want different wording or another language.
- Tailwind CSS, Font Awesome and the fonts load from public CDNs, so the page needs an internet connection to look right.

## License

[MIT](LICENSE)
