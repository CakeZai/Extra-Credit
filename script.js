/* WashU · MS in Cybersecurity Engineering — page interactions */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile main menu ---------- */
  const menuBtn = $(".menu-btn");
  const mainnav = $("#mainnav");
  menuBtn.addEventListener("click", () => {
    const open = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!open));
    mainnav.classList.toggle("is-open", !open);
  });

  /* ---------- Hero terminal ---------- */
  const term = $("#termBody");
  const lines = [
    ['<span class="p">$</span> cse degree --program ms-cybersecurity', 0],
    ['<span class="k">loading McKelvey School of Engineering…</span> <span class="g">ok</span>', 1],
    ["", 1],
    ['<span class="k">units     </span> 30', 1],
    ['<span class="k">core      </span> CSE 4303 · CSE 5203', 1],
    ['<span class="k">electives </span> 6 of 11', 1],
    ['<span class="k">capstone  </span> CSE 7998 (project | thesis)', 1],
    ['<span class="k">min_gpa   </span> 2.70', 1],
    ["", 1],
    ['<span class="p">$</span> apply --term fall', 0]
  ];
  // The summary is already in the HTML, so the hero never shows an empty frame.
  // With motion allowed, only the closing command is typed out once.
  if (!reduceMotion) {
    const last = lines[lines.length - 1][0];
    const prompt = '<span class="p">$</span> ';
    const text = last.replace(prompt, "");
    const base = lines.slice(0, -1).map(l => l[0]).join("\n") + "\n" + prompt;
    let c = 0;
    term.innerHTML = base + '<span class="cursor"></span>';
    const tick = () => {
      term.innerHTML = base + text.slice(0, c) + '<span class="cursor"></span>';
      if (c++ < text.length) setTimeout(tick, 45);
    };
    setTimeout(tick, 900);
  }

  /* ---------- On-this-page: mobile toggle + scrollspy ---------- */
  const tocToggle = $(".toc__toggle");
  const tocPanel = $("#tocList");
  const tocCurrent = $("#tocCurrent");
  const tocLinks = $$(".toc ol a");
  const closeToc = () => { tocToggle.setAttribute("aria-expanded", "false"); tocPanel.classList.remove("is-open"); };
  tocToggle.addEventListener("click", () => {
    const open = tocToggle.getAttribute("aria-expanded") === "true";
    tocToggle.setAttribute("aria-expanded", String(!open));
    tocPanel.classList.toggle("is-open", !open);
  });
  tocLinks.forEach(a => a.addEventListener("click", closeToc));
  document.addEventListener("click", e => { if (!e.target.closest(".toc")) closeToc(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeToc(); });

  const sections = tocLinks.map(a => $(a.getAttribute("href")));
  const setActive = id => {
    tocLinks.forEach(a => {
      const on = a.getAttribute("href") === "#" + id;
      a.classList.toggle("is-active", on);
      if (on) { a.setAttribute("aria-current", "true"); tocCurrent.textContent = a.textContent; }
      else a.removeAttribute("aria-current");
    });
  };
  const spy = () => {
    const y = window.innerHeight * 0.3;
    let current = sections[0];
    for (const s of sections) if (s.getBoundingClientRect().top <= y) current = s;
    setActive(current.id);
  };
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(() => { spy(); stickyApply(); ticking = false; }); ticking = true; }
  }, { passive: true });

  /* ---------- Course planner ---------- */
  const MAX = 6;
  const electives = $$(".is-elec");
  const unitCount = $("#unitCount");
  const elecFill = $("#elecFill");
  const elecLbl = $("#elecLbl");
  const msg = $("#plannerMsg");
  const updatePlanner = () => {
    const n = electives.filter(b => b.getAttribute("aria-pressed") === "true").length;
    unitCount.textContent = 12 + n * 3;
    elecFill.style.width = (n / MAX) * 100 + "%";
    elecLbl.textContent = "Electives · " + n * 3 + " / 18";
    msg.classList.remove("is-warn");
    if (n === MAX) msg.textContent = "That's 30 units — a complete degree plan.";
    else if (n === 0) msg.textContent = "";
    else msg.textContent = (MAX - n) + " more elective" + (MAX - n === 1 ? "" : "s") + " to go.";
  };
  electives.forEach(btn => btn.addEventListener("click", () => {
    const on = btn.getAttribute("aria-pressed") === "true";
    const n = electives.filter(b => b.getAttribute("aria-pressed") === "true").length;
    if (!on && n >= MAX) {
      msg.textContent = "You've already picked six electives. Remove one first.";
      msg.classList.add("is-warn");
      btn.classList.remove("is-shake"); void btn.offsetWidth; btn.classList.add("is-shake");
      return;
    }
    btn.setAttribute("aria-pressed", String(!on));
    updatePlanner();
  }));

  /* filters */
  const chips = $$(".chip");
  chips.forEach(chip => chip.addEventListener("click", () => {
    chips.forEach(c => { c.classList.toggle("is-on", c === chip); c.setAttribute("aria-pressed", String(c === chip)); });
    const f = chip.dataset.filter;
    electives.forEach(b => b.classList.toggle("is-hidden", f !== "all" && !b.dataset.tags.split(" ").includes(f)));
  }));

  /* course number format */
  const numBtns = $$(".numtoggle button");
  numBtns.forEach(btn => btn.addEventListener("click", () => {
    numBtns.forEach(b => { const on = b === btn; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", String(on)); });
    $$(".course__num").forEach(el => { el.textContent = el.dataset[btn.dataset.num]; });
  }));

  /* ---------- Faculty rail ---------- */
  const rail = $("#facultyRail");
  $$(".rail-btn").forEach(b => b.addEventListener("click", () => {
    const card = rail.querySelector(".prof");
    const step = card ? card.getBoundingClientRect().width + 16 : 260;
    rail.scrollBy({ left: step * Number(b.dataset.dir), behavior: reduceMotion ? "auto" : "smooth" });
  }));

  /* ---------- FAQ: expand / collapse all ---------- */
  const expandAll = $(".expand-all");
  if (expandAll) {
    const faqs = $$("#faqList details");
    const sync = () => {
      const allOpen = faqs.every(d => d.open);
      expandAll.textContent = allOpen ? "Collapse all" : "Expand all";
      expandAll.setAttribute("aria-expanded", String(allOpen));
    };
    expandAll.addEventListener("click", () => {
      const open = !faqs.every(d => d.open);
      faqs.forEach(d => { d.open = open; });
      sync();
    });
    faqs.forEach(d => d.addEventListener("toggle", sync));
  }

  /* ---------- Next start term countdown ---------- */
  // Full-time master's deadlines (McKelvey): Early decision Dec 31 → Fall of next year,
  // Fall regular Mar 1 → Fall same year, Spring Oct 1 → Spring of next year. 11:59 p.m. ET.
  const now = new Date();
  const y = now.getFullYear();
  const deadlines = [];
  for (const yr of [y - 1, y, y + 1]) {
    deadlines.push({ d: new Date(yr, 2, 1, 23, 59), term: "Fall " + yr, what: "Regular deadline", label: "March 1" });
    deadlines.push({ d: new Date(yr, 9, 1, 23, 59), term: "Spring " + (yr + 1), what: "Regular deadline", label: "Oct. 1" });
    deadlines.push({ d: new Date(yr, 11, 31, 23, 59), term: "Fall " + (yr + 1), what: "Early decision", label: "Dec. 31" });
  }
  deadlines.sort((a, b) => a.d - b.d);
  const next = deadlines.find(x => x.d >= now);
  if (next) {
    const days = Math.ceil((next.d - now) / 86400000);
    $("#ntTerm").textContent = next.term;
    $("#ntWhat").textContent = next.what;
    $("#ntDays").textContent = days;
    $("#ntDate").textContent = "Apply by " + next.label + ", " + next.d.getFullYear();
    const bandSub = $("#bandSub");
    if (bandSub) bandSub.textContent = next.term + " applications are open. Apply by " + next.label + ".";
  }

  /* ---------- Mobile sticky apply button ---------- */
  const mobileApply = $(".mobile-apply");
  const hero = $(".hero");
  const band = $(".band");
  function stickyApply() {
    const pastHero = hero.getBoundingClientRect().bottom < 0;
    const bandVisible = band.getBoundingClientRect().top < window.innerHeight;
    mobileApply.classList.toggle("is-visible", pastHero && !bandVisible);
  }

  spy(); stickyApply();
})();
