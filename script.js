const content = document.querySelector("#letter-content");

function formatInline(text) {
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

function makeLetter(markdown) {
  const blocks = markdown
    .replace(/\r/g, "")
    .trim()
    .split(/\n\s*\n/);
  content.innerHTML = "";
  blocks.forEach((block) => {
    const clean = block.trim();
    let el;
    if (clean === "---") el = document.createElement("hr");
    else if (clean.startsWith("# ")) {
      el = document.createElement("h1");
      el.innerHTML = formatInline(clean.slice(2));
    } else if (clean.startsWith("> ")) {
      el = document.createElement("blockquote");
      const p = document.createElement("p");
      p.innerHTML = formatInline(
        clean.replace(/^> ?/gm, "").replace(/\n/g, "<br>"),
      );
      el.append(p);
    } else {
      el = document.createElement("p");
      el.innerHTML = formatInline(clean.replace(/\n/g, "<br>"));
    }
    el.classList.add("reveal");
    content.append(el);
  });
  observeReveals();
}

function observeReveals() {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.08 },
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

fetch("letter.md")
  .then((res) => {
    if (!res.ok) throw new Error("Letter unavailable");
    return res.text();
  })
  .then(makeLetter)
  .catch(() => {
    content.innerHTML =
      "<p>The letter could not be opened. Please run this site with a local web server.</p>";
  });

document
  .querySelector("#enter-letter")
  .addEventListener("click", () =>
    document.querySelector("#letter").scrollIntoView({ behavior: "smooth" }),
  );
document
  .querySelector("#back-top")
  .addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );

const points = [
  [16, 57],
  [30, 29],
  [46, 45],
  [64, 19],
  [79, 39],
  [69, 73],
  [41, 82],
  [24, 76],
];
const constellation = document.querySelector("#constellation");
const ns = "http://www.w3.org/2000/svg";
const svg = document.createElementNS(ns, "svg");
for (let i = 0; i < points.length - 1; i++) {
  const line = document.createElementNS(ns, "line");
  line.setAttribute("x1", points[i][0] + "%");
  line.setAttribute("y1", points[i][1] + "%");
  line.setAttribute("x2", points[i + 1][0] + "%");
  line.setAttribute("y2", points[i + 1][1] + "%");
  svg.append(line);
}
constellation.append(svg);
let lit = 0;
points.forEach(([x, y], i) => {
  const b = document.createElement("button");
  b.className = "star-button";
  b.style.left = x + "%";
  b.style.top = y + "%";
  b.setAttribute("aria-label", "Light a small star");
  b.addEventListener("click", () => {
    if (!b.classList.contains("lit")) {
      b.classList.add("lit");
      lit++;
      if (lit === points.length) constellation.classList.add("complete");
    }
  });
  constellation.append(b);
});
