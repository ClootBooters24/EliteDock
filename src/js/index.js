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

const lazyImages = document.querySelectorAll("img[data-src]");

if (lazyImages.length) {
	const hydrateImage = (img) => {
		const source = img.getAttribute("data-src");
		if (!source) {
			return;
		}

		img.src = source;
		img.removeAttribute("data-src");
	};

	if (!("IntersectionObserver" in window)) {
		lazyImages.forEach((img) => hydrateImage(img));
	} else {
		const imageObserver = new IntersectionObserver(
			(entries, obs) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) {
						return;
					}

					const target = entry.target;
					if (target instanceof HTMLImageElement) {
						hydrateImage(target);
					}
					obs.unobserve(target);
				});
			},
			{
				rootMargin: "150px 0px"
			}
		);

		lazyImages.forEach((img) => imageObserver.observe(img));
	}
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
			if (slideIndex === currentIndex && slide.dataset.src) {
				slide.src = slide.dataset.src;
				slide.removeAttribute("data-src");
			}
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

