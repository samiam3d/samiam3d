const html = document.documentElement;
const body = document.body;
const masthead = document.querySelector("#masthead");
const branding = document.querySelector(".site-branding");
const navigation = document.querySelector("#site-navigation");
const contactPanel = document.querySelector("#secondary");
const desktopBreakpoint = 800;
let mastheadHeight = masthead?.offsetHeight || 0;
let scrollFrame = 0;

navigation?.style.setProperty("display", "block");
contactPanel?.style.setProperty("display", "block");

function setDrawer(drawer) {
  const navigationWillOpen = drawer === "navigation" && !body.classList.contains("main-navigation-open");
  const contactWillOpen = drawer === "contact" && !body.classList.contains("widget-area-open");

  body.classList.toggle("main-navigation-open", navigationWillOpen);
  body.classList.toggle("widget-area-open", contactWillOpen);
  html.classList.toggle("disable-scroll", navigationWillOpen || contactWillOpen);
}

document.querySelectorAll(".main-navigation-toggle, #mobile-menu-close").forEach((toggle) => {
  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    setDrawer("navigation");
  });
});

document.querySelectorAll(".widget-area-toggle").forEach((toggle) => {
  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    setDrawer("contact");
  });
});

document.addEventListener("keyup", (event) => {
  if (event.key === "Escape") setDrawer(null);
});

function updateHeader() {
  scrollFrame = 0;
  if (!masthead || !branding) return;

  if (window.innerWidth <= desktopBreakpoint) {
    masthead.style.height = `${mastheadHeight}px`;
    branding.style.opacity = "1";
    return;
  }

  const y = window.scrollY;
  const height = Math.max(0, mastheadHeight - y);
  masthead.style.height = `${height}px`;
  masthead.style.overflow = "hidden";
  branding.style.opacity = String(Math.max(0, 1 - (y / mastheadHeight) * 2));
}

function requestHeaderUpdate() {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(updateHeader);
}

window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
window.addEventListener("resize", () => {
  if (window.scrollY === 0 && masthead) mastheadHeight = masthead.scrollHeight || masthead.offsetHeight;
  requestHeaderUpdate();
});

updateHeader();
