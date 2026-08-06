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
