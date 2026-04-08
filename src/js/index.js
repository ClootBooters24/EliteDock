const yearEl = document.getElementById("copyright-year");
if (yearEl) {
	yearEl.textContent = String(new Date().getFullYear());
}

const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');

if (menuToggle && nav) {
	menuToggle.addEventListener("click", () => {
		const expanded = menuToggle.getAttribute("aria-expanded") === "true";
		menuToggle.setAttribute("aria-expanded", String(!expanded));
		nav.classList.toggle("is-open");
	});

	navLinks.forEach((link) => {
		link.addEventListener("click", () => {
			menuToggle.setAttribute("aria-expanded", "false");
			nav.classList.remove("is-open");
		});
	});
}

const observedSections = document.querySelectorAll("main section[id]");

if (observedSections.length && navLinks.length) {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) {
					return;
				}

				navLinks.forEach((link) => {
					const targetId = link.getAttribute("href")?.replace("#", "");
					const isMatch = targetId === entry.target.id;
					link.classList.toggle("active", Boolean(isMatch));
				});
			});
		},
		{
			rootMargin: "-40% 0px -45% 0px",
			threshold: 0.01
		}
	);

	observedSections.forEach((section) => observer.observe(section));
}

// Placeholder form handling until backend submit endpoint is connected.
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
	contactForm.addEventListener("submit", (event) => {
		event.preventDefault();
		window.alert("Form endpoint not connected yet. Replace this handler when backend is ready.");
	});
}

