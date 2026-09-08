# Approved GoldChest redesign

Eleventy and Sass remain the site’s build tools. Run `npm ci`, then `npm run build`; use `npm start` for development. Existing blog content and its templates are preserved.

The homepage, Services, Our Work, About, Contact and Action Plan use `src/_includes/layouts/studio.html`. This shared layout provides a fixed header, accessible mobile menu and footer. Main navigation uses separate routes, not homepage anchors. Service detail links target sections on the Services page.

## Fonts and assets
Manrope and Inter variable fonts are self-hosted in `src/fonts/`, alongside their SIL Open Font License files. Heading styles use Manrope, body/navigation use Inter. No external font request is required. The hero's website demonstration is responsive HTML/CSS with an explicit illustrative caption, not a client project or a screenshot of a real website. It contains no interactive controls.

## Adding approved client logos
Edit `src/_data/clients.json`, initially empty. Add entries of this form after getting approval to display the logos:

```json
{"name":"Client name","logo":"/images/clients/client-logo.svg"}
```

Save the corresponding files in `src/images/clients/`. Empty data shows labelled placeholders on the homepage; these must be replaced with approved client assets before a public launch if placeholders are not desired.

## Adding work
Edit `src/_data/projects.json`. Entries support `name`, `service`, `image`, `imageAlt`, `goal`, `work`, `result`, and optional `url`. Use only verified project facts and approved assets. Empty data shows an honest project-stories-in-preparation state with a contact link.

## Visitor tool
The homepage starts the journey at `/action-plan/?stage=none` or `?stage=dated`. The planner processes three answers locally and produces a downloadable text plan. It does not claim to inspect a website or send answers to a server. All 27 valid answer combinations should return three useful recommendations. No backend or email collection is needed.

## Review / publishing
The `.openai/hosting.json` registration belongs to the private review site. The existing Netlify build remains unchanged. The GitHub review branch is separate from the production main branch. Publishing to the live domain requires merging the reviewed change through the site's normal workflow.
