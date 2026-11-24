# MS in Cybersecurity Engineering: Program Page Redesign

A redesign of the Washington University in St. Louis (WashU) McKelvey School of Engineering program page for the **Master of Science in Cybersecurity Engineering**, built for the extra credit assignment in a Fall 2026 web development course.

> **⚠️ Please fact-check this information yourself.**
> This is a student concept, not an official WashU page. The information on this site may be inaccurate, incomplete or out of date: tuition, deadlines, requirements, courses and contacts change every year, and some details were gathered or checked with AI assistance. **Do not rely on this site for admissions, financial or academic decisions.** Always confirm details on the [official program page](https://cse.washu.edu/academics/graduate/MS-in-Cybersecurity-Engineering.html) or with the CSE graduate office before acting on them.

## Viewing the site

No build step or installs are needed. It's plain HTML, CSS and JavaScript.

- **Quickest:** open `index.html` in any modern browser.
- **Local server (recommended):** from this folder, run

  ```bash
  python3 -m http.server 8000
  ```

  then open <http://localhost:8000>.

An internet connection is needed for the web fonts (Google Fonts), the WashU logo and the faculty photos, which load from WashU's servers.

## Files

```
Extra Credit/
├── index.html                      Page markup and content
├── style.css                       All styles, including the phone and tablet layouts
├── script.js                       Interactive features (no libraries)
├── images/
│   └── students-cybersecurity.jpg  Hero photo, 1200px, 59 KB (WashU CSE's own program photo)
├── README.md                       This file
└── CONTRIBUTORS.md                 Who made this, and tools used
```

## Code conventions

- **CSS class names use [BEM](https://getbem.com/naming/):** `block__element--modifier`, written in full words (`faculty-card__name`, `course--elective`, `btn--primary`).
- **`is-*` classes are states**: `script.js` adds and removes `is-open`, `is-active`, `is-selected`, `is-visible`, `is-hidden`, `is-warn` and `is-shake`; `is-current` marks the current page in the main navigation.
- **IDs and data attributes are kebab-case** (`unit-count`, `faq-list`, `data-format`, `data-direction`). IDs exist only for in-page links, ARIA references and JavaScript hooks.
- **Colors come from tokens.** Every repeated color is a named custom property in `:root` (for example `--red-on-dark`, `--text-on-dark`).
- **`style.css` is ordered** as tokens → base → layout → components (in page order) → responsive (1080px → 920px → 720px) → reduced motion. Colors, fonts and spacing come from the CSS custom properties in `:root`.
- **`script.js` is plain JavaScript in one IIFE**, split into numbered, commented blocks (one per feature), with `const` names that describe what they hold.
- **HTML comments** label each major region (`==== Header ====`) and each content section (`---- Courses ----`). Open content questions are listed under [Known limitations](#known-limitations) rather than left in the markup.

## What's on the page

| Section | What it does |
|---|---|
| Hero | Program name, one-line pitch, **Apply now** and **Attend an info session**, the $75 fee-waiver note, a real student photo, and a key-facts row (units, electives, study format, tuition, deadlines) |
| On this page | A sticky section list on the right that highlights where you are; on phones it becomes a drop-down bar pinned to the top |
| Program Overview | Description, launch year and the two prerequisite courses |
| Program Benefits | Four benefits with custom SVG icons |
| Courses | **Interactive course planner**: pick 6 of 11 electives and watch the 30-unit bar fill, filter by topic, and switch between current and pre-Fall 2025 course numbers |
| Degree Requirements | GPA, grading, independent-study and substitution rules |
| Master's Capstone | Project vs. thesis, a semester timeline, and expandable details on progress reports and termination |
| Admissions | Application checklist (letters, test scores, English proficiency, fee) |
| Next Start Term | A live countdown to the next full-time deadline, the full deadline table and upcoming info sessions |
| Featured Faculty | A scrollable row of Security & Privacy faculty with arrow controls |
| Careers & Outcomes | National job-market figures from the U.S. Bureau of Labor Statistics (clearly labeled) and a link to WashU's graduate outcomes dashboard |
| Tuition & Financial Aid | 2026–27 tuition and fees, plus four funding options |
| FAQs | Eight questions, each expandable, with an **Expand all / Collapse all** button |
| Contacts, Explore, Apply band | Program contacts, related programs and a closing call to action |

## Interactive features (script.js)

- Mobile menu toggle
- "On this page" scroll tracking and the phone drop-down
- Course planner: elective selection (blocks a 7th pick), topic filters, course-number toggle
- Faculty photo row arrow buttons
- Deadline countdown, calculated from today's date
- Floating **Apply now** button on phones (hidden on the hero and at the bottom band)
- FAQ expand / collapse all

## Responsive design and accessibility

- **Tested at 6 widths**, from 320px (small phone) to 820px (tablet), plus desktop at 1024px and 1440px. An automated touch test of every interactive feature passes at phone and tablet sizes.
- On phones: single-column layout, the deadline table becomes cards, buttons go full width, and every link and control outside running text is at least 44px tall.
- Skip-to-content link, visible keyboard focus, labeled controls (`aria-expanded`, `aria-pressed`, `aria-current`), alt text on images, and a screen-reader live region for planner messages.
- Respects **reduced motion**: animations and smooth scrolling turn off when the user's system asks for it.

## Sources

Facts were checked against these official sources on **November 24, 2026**. That check was a best effort, not a guarantee: the sources can change and mistakes can slip through, so verify anything important yourself.

- Program page: <https://cse.washu.edu/academics/graduate/MS-in-Cybersecurity-Engineering.html>
- CSE Master's Program Handbook (updated June 2026): <https://cse.washu.edu/documents/CSE-Department-Masters-Program-Handbook.pdf>
- Application checklist: <https://engineering.washu.edu/academics/graduate-admissions/application-checklist.html>
- Deadlines: <https://engineering.washu.edu/academics/graduate-admissions/deadlines.html>
- Info sessions: <https://engineering.washu.edu/academics/graduate-admissions/recruitment-schedule.html>
- Costs and funding (2026–27): <https://engineering.washu.edu/academics/graduate-admissions/tuition-financial-assistance/index.html>
- Faculty: <https://cse.washu.edu/faculty-research/research-areas/Cybersecurity.html> and individual McKelvey faculty profiles
- Career figures: [U.S. Bureau of Labor Statistics, Occupational Outlook Handbook: Information Security Analysts](https://www.bls.gov/ooh/computer-and-information-technology/information-security-analysts.htm) (last modified Aug. 27, 2026)

## Known limitations

- **Capstone grading:** the program page says CSE 7998 is graded Pass/No Pass, but the June 2026 handbook says letter grades. This page follows the program page; confirm with the department.
- **No program-specific career data:** WashU doesn't publish outcomes for this program alone, so the Careers section uses national BLS figures, labeled as such.
- **Dates go stale:** info session dates, tuition and the scholarship year are for the 2026–27 cycle and need updating each year. The deadline countdown updates itself.
- Faculty photos, the logo and the favicon load from WashU's servers, so they won't show offline.
- **Not published by the department:** a typical time to degree, and which faculty teach in this program. The Featured Faculty section lists the Security & Privacy research area instead.

## Credits

WashU name, logo and hero photo belong to Washington University in St. Louis and are used here for a non-commercial class project. See [CONTRIBUTORS.md](CONTRIBUTORS.md) for authorship.
