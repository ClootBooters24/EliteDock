const yearEl = document.getElementById("copyright-year");
if (yearEl) {
	yearEl.textContent = String(new Date().getFullYear());
}

const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const navMenuLinks = document.querySelectorAll(".site-nav a");
const sectionNavLinks = document.querySelectorAll('.site-nav a[href^="#"]');

if (menuToggle && nav) {
	menuToggle.addEventListener("click", () => {
		const expanded = menuToggle.getAttribute("aria-expanded") === "true";
		menuToggle.setAttribute("aria-expanded", String(!expanded));
		nav.classList.toggle("is-open");
	});

	navMenuLinks.forEach((link) => {
		link.addEventListener("click", () => {
			menuToggle.setAttribute("aria-expanded", "false");
			nav.classList.remove("is-open");
		});
	});

	document.addEventListener("click", (event) => {
		const target = event.target;
		if (!(target instanceof Element)) {
			return;
		}

		if (!nav.contains(target) && !menuToggle.contains(target)) {
			menuToggle.setAttribute("aria-expanded", "false");
			nav.classList.remove("is-open");
		}
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			menuToggle.setAttribute("aria-expanded", "false");
			nav.classList.remove("is-open");
		}
	});
}

const observedSections = document.querySelectorAll("main section[id]");

if (observedSections.length && sectionNavLinks.length) {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) {
					return;
				}

				sectionNavLinks.forEach((link) => {
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

const heroSlider = document.querySelector("[data-hero-slider]");

if (heroSlider) {
	const slides = Array.from(heroSlider.querySelectorAll(".hero-slide"));
	const dots = Array.from(heroSlider.querySelectorAll("[data-hero-dot]"));
	const prevButton = heroSlider.querySelector("[data-hero-prev]");
	const nextButton = heroSlider.querySelector("[data-hero-next]");
	let currentIndex = 0;
	let autoRotateId;
	let touchStartX = 0;
	let touchCurrentX = 0;
	let isSwiping = false;

	const setSlide = (index) => {
		currentIndex = (index + slides.length) % slides.length;

		slides.forEach((slide, slideIndex) => {
			slide.classList.toggle("is-active", slideIndex === currentIndex);
		});

		dots.forEach((dot, dotIndex) => {
			dot.classList.toggle("is-active", dotIndex === currentIndex);
		});
	};

	const restartAutoRotate = () => {
		if (autoRotateId) {
			window.clearInterval(autoRotateId);
		}
		autoRotateId = window.setInterval(() => {
			setSlide(currentIndex + 1);
		}, 5000);
	};

	if (prevButton) {
		prevButton.addEventListener("click", () => {
			setSlide(currentIndex - 1);
			restartAutoRotate();
		});
	}

	if (nextButton) {
		nextButton.addEventListener("click", () => {
			setSlide(currentIndex + 1);
			restartAutoRotate();
		});
	}

	dots.forEach((dot) => {
		dot.addEventListener("click", () => {
			const targetIndex = Number(dot.getAttribute("data-hero-dot"));
			if (!Number.isNaN(targetIndex)) {
				setSlide(targetIndex);
				restartAutoRotate();
			}
		});
	});

	heroSlider.addEventListener("mouseenter", () => {
		if (autoRotateId) {
			window.clearInterval(autoRotateId);
		}
	});

	heroSlider.addEventListener("mouseleave", restartAutoRotate);

	heroSlider.addEventListener("touchstart", (event) => {
		const touch = event.touches[0];
		if (!touch) {
			return;
		}
		touchStartX = touch.clientX;
		touchCurrentX = touch.clientX;
		isSwiping = true;
		if (autoRotateId) {
			window.clearInterval(autoRotateId);
		}
	}, { passive: true });

	heroSlider.addEventListener("touchmove", (event) => {
		if (!isSwiping) {
			return;
		}
		const touch = event.touches[0];
		if (!touch) {
			return;
		}
		touchCurrentX = touch.clientX;
	}, { passive: true });

	heroSlider.addEventListener("touchend", () => {
		if (!isSwiping) {
			return;
		}

		const swipeDistance = touchCurrentX - touchStartX;
		const swipeThreshold = 40;

		if (Math.abs(swipeDistance) >= swipeThreshold) {
			if (swipeDistance < 0) {
				setSlide(currentIndex + 1);
			} else {
				setSlide(currentIndex - 1);
			}
		}

		isSwiping = false;
		restartAutoRotate();
	});

	setSlide(0);
	restartAutoRotate();
}

const contactForm = document.querySelector("[data-contact-form]");
const contactModal = document.querySelector("[data-contact-modal]");
const contactModalMessage = document.getElementById("contact-modal-message");
const contactModalCloseButton = document.querySelector("[data-contact-modal-close]");

if (contactForm instanceof HTMLFormElement && contactModal instanceof HTMLElement) {
	const openContactModal = (message) => {
		if (contactModalMessage) {
			contactModalMessage.textContent = message;
		}

		contactModal.classList.add("is-open");
		contactModal.setAttribute("aria-hidden", "false");
		if (contactModalCloseButton instanceof HTMLButtonElement) {
			contactModalCloseButton.focus();
		}
	};

	const closeContactModal = () => {
		contactModal.classList.remove("is-open");
		contactModal.setAttribute("aria-hidden", "true");
	};

	const submitButton = contactForm.querySelector("button[type='submit']");

	contactForm.addEventListener("submit", async (event) => {
		event.preventDefault();

		if (submitButton instanceof HTMLButtonElement) {
			submitButton.disabled = true;
			submitButton.textContent = "Sending...";
		}

		try {
			const formData = new FormData(contactForm);
			const response = await fetch(contactForm.action, {
				method: "POST",
				body: formData,
				headers: {
					Accept: "application/json"
				}
			});

			if (!response.ok) {
				throw new Error("Unable to send form.");
			}

			contactForm.reset();
			openContactModal("Thank you. Your request has been sent and we will reach out soon.");
		} catch (error) {
			openContactModal("We could not send your request right now. Please call us at (918) 786-0553.");
		} finally {
			if (submitButton instanceof HTMLButtonElement) {
				submitButton.disabled = false;
				submitButton.textContent = "Send Request";
			}
		}
	});

	if (contactModalCloseButton instanceof HTMLButtonElement) {
		contactModalCloseButton.addEventListener("click", closeContactModal);
	}

	contactModal.addEventListener("click", (event) => {
		if (event.target === contactModal) {
			closeContactModal();
		}
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && contactModal.classList.contains("is-open")) {
			closeContactModal();
		}
	});
}

