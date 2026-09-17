# Editing the Services page

Open src/_data/servicesPage.json to change the wording. You do not need to edit HTML or the services.njk template.

- title and description: browser title and search description.
- hero: the introduction at the top of the page.
- services: the six service sections, in their displayed order.
- closing: the final invitation to use the planning tool.

Within a service:

- label is the small service name.
- heading contains one quoted string per visible heading line. Use one item for a single line, or two for a line break.
- content contains paragraphs (text), smaller headings (heading) and lists (bullets), in display order.
- link.text is the clickable wording; link.url is its destination.
- Keep id unchanged: homepage links use it to reach the section.

Edit text inside double quotes. Separate items with commas, but do not add a comma after the final item in a list or object. Write & normally; HTML tags are not needed and will display as text.

Save, preview using the usual development workflow, then commit and push using GitHub Desktop. These fields affect the Services page only; shorter homepage cards remain in src/_includes/layouts/home.html.
