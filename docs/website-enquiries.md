# Website enquiries

Homepage entry: the section between client logos and services.
Campaign destination: `/start-a-project/`.

The page asks for a goal (new website, redesign or customer enquiries), business name,
project details, name and email. Website, location, timing and budget are optional.
It does not subscribe people to marketing or require a call. Existing services and the
free action planner are unchanged.

## Receiving enquiries

1. Enable form detection in the GoldChest project's Netlify Forms settings, with the owner's approval.
2. Deploy this change to the development branch. Keep the existing site access controls.
3. Confirm `website-enquiry` appears in Netlify Forms. Check current plan allowances before launching outreach.
4. Submit a clearly labelled test enquiry and verify all fields in the Forms dashboard, including optional fields and the spam folder. Do not assume a thank-you page alone proves storage.
5. Configure submission notifications to the owner's chosen inbox if wanted; no email destination is hardcoded or configured by this change.
6. Review enquiries in the dashboard. Netlify Forms does not provide a full sales pipeline: track qualification and follow-up separately.

Form detection must be enabled before deploying or followed by a new deploy.
The local static preview intentionally refuses to send; it cannot store enquiries.
Without JavaScript, the deployed form uses standard HTML POST and Netlify's success redirect.
With JavaScript, failures retain the visitor's answers and duplicate clicks are blocked.
There are no API keys, file uploads, browser storage of personal information, or automatic URL fetching.
Netlify provides server-side processing and spam filtering; the honeypot is additional protection.
Browser field validation is a usability layer, not a trust boundary. Treat dashboard submissions and supplied links as untrusted.

Development and production deployments belong to the same Netlify project and may share form submissions. Clearly label test entries.
Before collecting real leads, agree internal access, follow-up ownership and a retention/deletion schedule. A form-specific privacy notice was added; the older unrelated privacy-policy sections were not audited.

## Editing and validation

- `src/start-a-project.njk`: page wording and form fields.
- `src/_includes/layouts/home.html`: homepage entry.
- `src/sass/home.scss`: responsive styling.
- `src/js/enquiry.js`: enhanced submission and error handling.
- `src/enquiry-received.njk`: follow-up explanation.

Run `npm run build` then `npm test`. Test desktop and mobile, empty required fields,
invalid email, optional details, unavailable network, and a real Netlify submission after registration.
Do not publish the development branch to the main domain merely to test this feature.
