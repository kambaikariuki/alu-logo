const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");
const overlay = document.getElementById("navOverlay");

function closeNav() {
  toggle.classList.remove("open");
  links.classList.remove("open");
  overlay.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
}

function openNav() {
  toggle.classList.add("open");
  links.classList.add("open");
  overlay.classList.add("open");
  toggle.setAttribute("aria-expanded", "true");
}

toggle.addEventListener("click", () => {
  const isOpen = links.classList.contains("open");
  isOpen ? closeNav() : openNav();
});

overlay.addEventListener("click", closeNav);

// Close automatically when a link is tapped
links.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNav);
});

// Close if the viewport is resized back to desktop
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) closeNav();
});
