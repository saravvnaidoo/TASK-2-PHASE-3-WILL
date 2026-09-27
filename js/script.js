"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-nav");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        navigation.classList.remove("is-open");
      }
    });
  }

  document.querySelectorAll("[data-year]").forEach((year) => {
    year.textContent = String(new Date().getFullYear());
  });

  const calculator = document.querySelector("#calculator-form");
  if (calculator) {
    const packageInput = calculator.querySelector("#package-type");
    const durationInput = calculator.querySelector("#duration");
    const peopleInput = calculator.querySelector("#people");
    const totalOutput = document.querySelector("#total-cost");
    const breakdown = document.querySelector("#total-breakdown");
    const error = document.querySelector("#calculator-error");
    const hourlyRates = { pc: 45, console: 35, vip: 85 };
    const packageNames = { pc: "PC Gaming", console: "Console Gaming", vip: "VIP Experience" };

    const updateTotal = () => {
      const hours = Number(durationInput.value);
      const players = Number(peopleInput.value);
      const isValid = Number.isInteger(hours) && hours >= 1 && hours <= 24
        && Number.isInteger(players) && players >= 1 && players <= 12;

      error.hidden = isValid;
      durationInput.setAttribute("aria-invalid", String(!(Number.isInteger(hours) && hours >= 1 && hours <= 24)));
      peopleInput.setAttribute("aria-invalid", String(!(Number.isInteger(players) && players >= 1 && players <= 12)));

      if (!isValid) {
        return;
      }

      const selectedPackage = packageInput.value;
      const total = hourlyRates[selectedPackage] * hours * players;
      totalOutput.textContent = `R ${total.toFixed(2)}`;
      breakdown.textContent = `${hours} ${hours === 1 ? "hour" : "hours"} · ${players} ${players === 1 ? "player" : "players"} · ${packageNames[selectedPackage]}`;
    };

    calculator.addEventListener("input", updateTotal);
    calculator.addEventListener("change", updateTotal);
    updateTotal();
  }

  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    const fields = {
      name: { input: contactForm.elements.name, error: document.querySelector("#name-error"), message: "Enter your name (at least 2 characters)." },
      email: { input: contactForm.elements.email, error: document.querySelector("#email-error"), message: "Enter a valid email address." },
      message: { input: contactForm.elements.message, error: document.querySelector("#message-error"), message: "Write a message of at least 10 characters." }
    };
    const success = document.querySelector("#form-success");

    const validateField = (key) => {
      const field = fields[key];
      const value = field.input.value.trim();
      let valid = value.length > 0;

      if (key === "name") valid = value.length >= 2;
      if (key === "email") valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
      if (key === "message") valid = value.length >= 10;

      field.input.setAttribute("aria-invalid", String(!valid));
      field.error.textContent = valid ? "" : field.message;
      return valid;
    };

    Object.keys(fields).forEach((key) => {
      fields[key].input.addEventListener("input", () => {
        validateField(key);
        success.hidden = true;
      });
      fields[key].input.addEventListener("blur", () => {
        validateField(key);
      });
    });

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const isValid = Object.keys(fields).map(validateField).every(Boolean);

      if (!isValid) {
        contactForm.querySelector('[aria-invalid="true"]').focus();
        success.hidden = true;
        return;
      }

      // There is no booking backend; validation succeeds locally and submission is simulated.
      success.hidden = false;
      success.focus();
      contactForm.reset();
      Object.values(fields).forEach(({ input }) => input.removeAttribute("aria-invalid"));
    });
  }
});