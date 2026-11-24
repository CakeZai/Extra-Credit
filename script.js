/* ==========================================================================
   WashU · MS in Cybersecurity Engineering · page interactions
   --------------------------------------------------------------------------
   Plain JavaScript, no libraries. Each block below wires up one feature:
     1. Mobile menu            5. Faculty photo rail
     2. "On this page" nav     6. FAQ expand / collapse all
     3. Course planner         7. Next-deadline countdown
     4. Elective filters and   8. Floating "Apply now" bar (phones)
        course-number toggle
   State is shown with `is-*` classes (styled in style.css) and ARIA attributes.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Helpers ---------- */
  const select = (selector, root = document) => root.querySelector(selector);
  const selectAll = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Set an element's text only if it exists, so one missing element never stops the script. */
  const setText = (selector, text) => {
    const element = select(selector);
    if (element) element.textContent = text;
  };


  /* ---------- 1. Mobile menu ---------- */
  const menuButton = select(".menu-button");
  const mainNav = select("#main-nav");

  if (menuButton && mainNav) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      mainNav.classList.toggle("is-open", !isOpen);
    });
  }


  /* ---------- 2. "On this page" navigation ----------
     Desktop: a sticky sidebar that highlights the section in view.
     Phones:  a bar pinned to the top that opens a drop-down list. */
  const tocToggle = select(".toc__toggle");
  const tocPanel = select("#toc-list");
  const tocCurrentLabel = select("#toc-current");
  const tocLinks = selectAll(".toc ol a");
  const tocSections = tocLinks.map(link => select(link.getAttribute("href"))).filter(Boolean);
  const hasToc = Boolean(tocToggle && tocPanel && tocCurrentLabel && tocSections.length);

  const closeToc = () => {
    tocToggle.setAttribute("aria-expanded", "false");
    tocPanel.classList.remove("is-open");
  };

  if (hasToc) {
    tocToggle.addEventListener("click", () => {
      const isOpen = tocToggle.getAttribute("aria-expanded") === "true";
      tocToggle.setAttribute("aria-expanded", String(!isOpen));
      tocPanel.classList.toggle("is-open", !isOpen);
    });
    tocLinks.forEach(link => link.addEventListener("click", closeToc));
    document.addEventListener("click", event => { if (!event.target.closest(".toc")) closeToc(); });
    document.addEventListener("keydown", event => { if (event.key === "Escape") closeToc(); });
  }

  /** Mark the link for `sectionId` as current, in the sidebar and the phone bar. */
  const setActiveSection = sectionId => {
    tocLinks.forEach(link => {
      const isCurrent = link.getAttribute("href") === "#" + sectionId;
      link.classList.toggle("is-active", isCurrent);
      if (isCurrent) {
        link.setAttribute("aria-current", "true");
        tocCurrentLabel.textContent = link.textContent;
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  /** The current section is the last one whose top has passed 30% of the screen. */
  const updateActiveSection = () => {
    if (!hasToc) return;
    const triggerLine = window.innerHeight * 0.3;
    let currentSection = tocSections[0];
    for (const section of tocSections) {
      if (section.getBoundingClientRect().top <= triggerLine) currentSection = section;
    }
    setActiveSection(currentSection.id);
  };


  /* ---------- 3. Course planner ----------
     Visitors pick up to six electives; the unit bar and count update live. */
  const MAX_ELECTIVES = 6;
  const UNITS_PER_COURSE = 3;
  const REQUIRED_UNITS = 12; // 6 core + 6 capstone
  const ELECTIVE_UNITS = MAX_ELECTIVES * UNITS_PER_COURSE;  // 18
  const TOTAL_UNITS = REQUIRED_UNITS + ELECTIVE_UNITS;      // 30

  const electiveCards = selectAll(".course--elective");
  const unitCount = select("#unit-count");
  const electiveFill = select("#elective-fill");
  const electiveLabel = select("#elective-label");
  const plannerMessage = select("#planner-message");
  const hasPlanner = Boolean(electiveCards.length && unitCount && electiveFill && electiveLabel && plannerMessage);

  const countSelectedElectives = () =>
    electiveCards.filter(card => card.getAttribute("aria-pressed") === "true").length;

  const updatePlanner = () => {
    const selected = countSelectedElectives();
    const remaining = MAX_ELECTIVES - selected;

    unitCount.textContent = REQUIRED_UNITS + selected * UNITS_PER_COURSE;
    electiveFill.style.width = (selected / MAX_ELECTIVES) * 100 + "%";
    electiveLabel.textContent = "Electives · " + selected * UNITS_PER_COURSE + " / " + ELECTIVE_UNITS;

    plannerMessage.classList.remove("is-warn");
    if (selected === MAX_ELECTIVES) plannerMessage.textContent = "That's " + TOTAL_UNITS + " units — a complete degree plan.";
    else if (selected === 0) plannerMessage.textContent = "";
    else plannerMessage.textContent = remaining + " more elective" + (remaining === 1 ? "" : "s") + " to go.";
  };

  if (hasPlanner) {
    electiveCards.forEach(card => {
      // Remove the shake class when it finishes, so the next blocked pick can replay it.
      card.addEventListener("animationend", () => card.classList.remove("is-shake"));

      card.addEventListener("click", () => {
        const isSelected = card.getAttribute("aria-pressed") === "true";

        // Block a pick beyond the limit: explain why and give the card a short shake.
        if (!isSelected && countSelectedElectives() >= MAX_ELECTIVES) {
          plannerMessage.textContent = "You've already picked " + MAX_ELECTIVES + " electives. Remove one first.";
          plannerMessage.classList.add("is-warn");
          card.classList.add("is-shake");
          return;
        }

        card.setAttribute("aria-pressed", String(!isSelected));
        updatePlanner();
      });
    });
  }


  /* ---------- 4a. Elective topic filters ---------- */
  const filterChips = selectAll(".filter-chip");

  filterChips.forEach(chip => chip.addEventListener("click", () => {
    filterChips.forEach(other => {
      const isChosen = other === chip;
      other.classList.toggle("is-selected", isChosen);
      other.setAttribute("aria-pressed", String(isChosen));
    });

    const topic = chip.dataset.filter;
    electiveCards.forEach(card => {
      const matches = topic === "all" || card.dataset.tags.split(" ").includes(topic);
      card.classList.toggle("is-hidden", !matches);
    });
  }));

  /* ---------- 4b. Current vs. pre-Fall 2025 course numbers ---------- */
  const numberButtons = selectAll(".number-toggle button");

  numberButtons.forEach(button => button.addEventListener("click", () => {
    numberButtons.forEach(other => {
      const isChosen = other === button;
      other.classList.toggle("is-selected", isChosen);
      other.setAttribute("aria-pressed", String(isChosen));
    });

    // Each course number stores both versions: data-new and data-old.
    const format = button.dataset.format;
    selectAll(".course__number").forEach(number => { number.textContent = number.dataset[format]; });
  }));


  /* ---------- 5. Faculty photo rail: arrow buttons scroll one card ---------- */
  const facultyList = select("#faculty-list");

  if (facultyList) {
    selectAll(".faculty-rail__button").forEach(button => button.addEventListener("click", () => {
      const firstCard = facultyList.querySelector(".faculty-card");
      const cardGap = parseFloat(getComputedStyle(facultyList).columnGap) || 0; // read from style.css, never duplicated
      const step = firstCard ? firstCard.getBoundingClientRect().width + cardGap : facultyList.clientWidth;
      facultyList.scrollBy({
        left: step * Number(button.dataset.direction),
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    }));
  }


  /* ---------- 6. FAQ: expand / collapse all ---------- */
  const expandAllButton = select(".expand-all");

  if (expandAllButton) {
    const faqItems = selectAll("#faq-list details");

    /** Keep the button's label in step with the questions, however they were opened. */
    const syncExpandButton = () => {
      const allOpen = faqItems.every(item => item.open);
      expandAllButton.textContent = allOpen ? "Collapse all" : "Expand all";
      expandAllButton.setAttribute("aria-expanded", String(allOpen));
    };

    expandAllButton.addEventListener("click", () => {
      const shouldOpen = !faqItems.every(item => item.open);
      faqItems.forEach(item => { item.open = shouldOpen; });
      syncExpandButton();
    });
    faqItems.forEach(item => item.addEventListener("toggle", syncExpandButton));
  }


  /* ---------- 7. Next-deadline countdown ----------
     Full-time master's deadlines (McKelvey), 11:59 p.m.:
       Dec. 31  early decision   → Fall of the next year
       March 1  regular deadline → Fall of the same year
       Oct. 1   regular deadline → Spring of the next year
     Note: uses the visitor's local time zone; official deadlines are Eastern. */
  const DAY_IN_MS = 86400000;
  const today = new Date();
  const thisYear = today.getFullYear();
  const deadlines = [];

  for (const year of [thisYear - 1, thisYear, thisYear + 1]) {
    deadlines.push({ date: new Date(year, 2, 1, 23, 59),   term: "Fall " + year,         type: "Regular deadline", label: "March 1" });
    deadlines.push({ date: new Date(year, 9, 1, 23, 59),   term: "Spring " + (year + 1), type: "Regular deadline", label: "Oct. 1" });
    deadlines.push({ date: new Date(year, 11, 31, 23, 59), term: "Fall " + (year + 1),   type: "Early decision",   label: "Dec. 31" });
  }
  deadlines.sort((a, b) => a.date - b.date);

  const nextDeadline = deadlines.find(deadline => deadline.date >= today);
  if (nextDeadline) {
    const daysLeft = Math.ceil((nextDeadline.date - today) / DAY_IN_MS);
    setText("#next-term-name", nextDeadline.term);
    setText("#next-term-type", nextDeadline.type);
    setText("#next-term-days", daysLeft);
    setText("#next-term-date", "Apply by " + nextDeadline.label + ", " + nextDeadline.date.getFullYear());
    setText("#apply-band-note", nextDeadline.term + " applications are open. Apply by " + nextDeadline.label + ".");
  }


  /* ---------- 8. Floating "Apply now" bar (phones) ----------
     Shown once the hero has scrolled away; hidden again at the closing apply band. */
  const mobileApplyBar = select(".mobile-apply");
  const hero = select(".hero");
  const applyBand = select(".apply-band");

  const updateMobileApplyBar = () => {
    if (!mobileApplyBar || !hero || !applyBand) return;
    const scrolledPastHero = hero.getBoundingClientRect().bottom < 0;
    const applyBandInView = applyBand.getBoundingClientRect().top < window.innerHeight;
    mobileApplyBar.classList.toggle("is-visible", scrolledPastHero && !applyBandInView);
  };


  /* ---------- Scroll handling: one update per animation frame ---------- */
  let frameRequested = false;
  window.addEventListener("scroll", () => {
    if (frameRequested) return;
    frameRequested = true;
    requestAnimationFrame(() => {
      updateActiveSection();
      updateMobileApplyBar();
      frameRequested = false;
    });
  }, { passive: true });

  updateActiveSection();
  updateMobileApplyBar();
})();
