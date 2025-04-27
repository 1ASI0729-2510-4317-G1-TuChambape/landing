// Importación del archivo de traducciones (i18n)
import { accessibility } from "./libs/accesibility.js";
import i18n from "./libs/i18n.js";
import { setLanguage } from "./libs/language.js";
import { imgLoadingLazy } from "./libs/performance.js";


// Evento de carga del contenido para realizar la configuración inicial
document.addEventListener("DOMContentLoaded", () => {
  // Declaración de elementos del menú móvil y controles de idioma
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");
  const mobileMenuLinks = mobileMenu
    ? mobileMenu.querySelectorAll(".nav__link")
    : [];
  const mobileMenuButtons = mobileMenu
    ? mobileMenu.querySelectorAll("button")
    : [];
  const languageToggle = document.getElementById("language-toggle");
  const languageDropdown = document.getElementById("language-dropdown");
  const languageOptions = document.querySelectorAll(".language-option");

  // Obtener el idioma actual de la URL o de localStorage
  const currentLang =
    new URLSearchParams(window.location.search).get("lang") ||
    localStorage.getItem("language") ||
    "en";

  setLanguage(currentLang);

  // Marcar la opción de idioma activa
  languageOptions.forEach((option) => {
    const optionLang = option.getAttribute("data-lang");
    if (optionLang === currentLang) {
      option.classList.add("language-option--active");
      option.setAttribute("aria-current", "true");
    }
  });

  // Función para manejar la animación del menú de idiomas
  languageToggle.addEventListener("click", (e) => {
    e.preventDefault();
    const isExpanded =
      languageDropdown.getAttribute("aria-expanded") === "true";

    if (!isExpanded) {
      languageDropdown.classList.add("language-dropdown--show");
      languageDropdown.animate(
        [
          { opacity: 0, transform: "translateY(-10px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 200,
          easing: "ease-in-out",
          fill: "forwards",
        }
      );

      languageDropdown.setAttribute("aria-expanded", "true");
    } else {
      const animationLanguageDropwdown = languageDropdown.animate(
        [
          { opacity: 1, transform: "translateY(0)" },
          { opacity: 0, transform: "translateY(-10px)" },
        ],
        {
          duration: 200,
          easing: "ease-in-out",
          fill: "forwards",
        }
      );

      animationLanguageDropwdown.addEventListener("finish", () => {
        languageDropdown.classList.remove("language-dropdown--show");
      });
      languageDropdown.setAttribute("aria-expanded", "false");
    }
  });

  // Manejo de navegación por teclado en el menú desplegable de idiomas
  languageToggle.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      languageToggle.setAttribute("aria-expanded", "true");
      languageDropdown.setAttribute("aria-hidden", "false");
      languageDropdown.classList.add("language-dropdown--show");

      languageOptions[0].focus();
    }
  });

  // Función para manejar las opciones de idioma
  languageOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const selectedLang = option.getAttribute("data-lang");
      window.history.pushState(
        { lang: selectedLang },
        "",
        window.location.pathname + "?lang=" + selectedLang
      );

      setLanguage(selectedLang);
      localStorage.setItem("language", selectedLang);

      // Actualizar la opción activa
      languageOptions.forEach((opt) => {
        opt.classList.remove("language-option--active");
        opt.removeAttribute("aria-current");
      });

      option.classList.add("language-option--active");
      option.setAttribute("aria-current", "true");

      languageToggle.setAttribute("aria-expanded", "false");
      languageDropdown.setAttribute("aria-hidden", "true");
    });
  });

  // Navegación por teclado entre opciones
  languageOptions.forEach((option, index) => {
    option.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (index < languageOptions.length - 1) {
            languageOptions[index + 1].focus();
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (index > 0) {
            languageOptions[index - 1].focus();
          } else {
            languageToggle.focus();
          }
          break;
        case "Escape":
          e.preventDefault();
          languageToggle.setAttribute("aria-expanded", "false");
          languageDropdown.setAttribute("aria-hidden", "true");
          languageDropdown.classList.remove("language-dropdown--show");
          languageToggle.focus();
          break;
      }
    });
  });

  // Función para manejar el enfoque del menú móvil
  const setupFocusTrap = (menu) => {
    const focusableElements = menu.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="email"], input[type="submit"]'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement =
      focusableElements[focusableElements.length - 1];

    // Establecer tabindex inicial para todos los elementos enfocados
    focusableElements.forEach((el) => {
      el.setAttribute("tabindex", "-1");
    });

    return {
      activate: () => {
        // Habilitar tabindex para todos los elementos enfocados
        focusableElements.forEach((el) => {
          el.setAttribute("tabindex", "0");
        });
        setTimeout(() => {
          firstFocusableElement.focus();
        }, 100);
      },
      deactivate: () => {
        focusableElements.forEach((el) => {
          el.setAttribute("tabindex", "-1");
        });
      },
      handleKeyDown: (e) => {
        const isTabPressed = e.key === "Tab" || e.keyCode === 9;
        const isEscapePressed = e.key === "Escape" || e.keyCode === 27;

        // Cerrar el menú cuando se presiona la tecla Escape
        if (isEscapePressed) {
          closeMenu();
          return;
        }
        if (!isTabPressed) {
          return;
        }
        // Manejar la navegación por tabulación para mantener el enfoque dentro del menú
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      },
    };
  };

  // Inicializar el enfoque del menú si existe
  const focusTrap = mobileMenu ? setupFocusTrap(mobileMenu) : null;

  // Funciones para abrir y cerrar el menú móvil
  const openMenu = () => {
    menuToggle.setAttribute("aria-expanded", "true");
    mobileMenu.classList.add("nav--mobile--active");
    mobileMenu.setAttribute("aria-hidden", "false");
    menuIcon.classList.add("icon--hidden");
    closeIcon.classList.remove("icon--hidden");

    if (focusTrap) {
      focusTrap.activate();
      document.addEventListener("keydown", focusTrap.handleKeyDown);
    }
  };

  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("nav--mobile--active");
    mobileMenu.setAttribute("aria-hidden", "true");
    menuIcon.classList.remove("icon--hidden");
    closeIcon.classList.add("icon--hidden");

    if (focusTrap) {
      focusTrap.deactivate();
      document.removeEventListener("keydown", focusTrap.handleKeyDown);
    }

    menuToggle.focus();
  };

  // Agregar eventos de clic para abrir/cerrar el menú
  if (menuToggle && mobileMenu && menuIcon && closeIcon) {
    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileMenuLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    mobileMenuButtons.forEach((button) => {
      button.addEventListener("click", closeMenu);
    });
  }

  // Validación mejorada en formularios
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const formStatus = document.getElementById("form-status");

    // Manejo del evento submit en el formulario de contacto
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const messageInput = document.getElementById("message");

      let isValid = true;

      if (formStatus) {
        formStatus.textContent = "";
        formStatus.className = "form-status sr-only";
      }

      // Validar nombre
      if (!nameInput.value.trim()) {
        showError(nameInput, "Por favor ingresa tu nombre");
        isValid = false;
      } else {
        removeError(nameInput);
      }

      // Validar correo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
        showError(emailInput, "Por favor ingresa un correo electrónico válido");
        isValid = false;
      } else {
        removeError(emailInput);
      }

      // Validar mensaje
      if (!messageInput.value.trim()) {
        showError(messageInput, "Por favor ingresa tu mensaje");
        isValid = false;
      } else {
        removeError(messageInput);
      }

      // Si el formulario es válido, mostrar éxito
      if (isValid) {
        showFormSuccess();
        contactForm.reset();
        nameInput.focus();
      } else {
        if (formStatus) {
          formStatus.textContent =
            "Hay errores en el formulario. Por favor, revisa los campos marcados.";
          formStatus.className = "form-status";
          formStatus.classList.remove("sr-only");
        }

        // Focalizar en el primer campo inválido
        const firstInvalidField = contactForm.querySelector(
          ".form-group__input--error, .form-group__textarea--error"
        );
        if (firstInvalidField) {
          firstInvalidField.focus();
        }
      }
    });

    // Mostrar errores de validación
    const showError = (input, message) => {
      const errorId = `${input.id}-error`;
      const errorElement = document.getElementById(errorId);

      if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove("sr-only");
      }

      input.classList.add("form-group__input--error");
      input.setAttribute("aria-invalid", "true");
      input.style.borderColor = "#e53e3e";
    };

    // Eliminar errores de validación
    const removeError = (input) => {
      const errorId = `${input.id}-error`;
      const errorElement = document.getElementById(errorId);

      if (errorElement) {
        errorElement.textContent = "";
        errorElement.classList.add("sr-only");
      }

      input.classList.remove("form-group__input--error");
      input.removeAttribute("aria-invalid");
      input.style.borderColor = "";
    };

    // Mostrar mensaje de éxito del formulario
    const showFormSuccess = () => {
      if (formStatus) {
        formStatus.textContent = i18n[currentLang].sucessForm.description;
        formStatus.className = "form-status form-success";
        formStatus.classList.remove("sr-only");
      } else {
        const successMessage = document.createElement("div");
        successMessage.className = "form-success";
        successMessage.setAttribute("role", "status");
        successMessage.setAttribute("aria-live", "polite");
        successMessage.textContent = i18n[currentLang].sucessForm.description;
        successMessage.style.backgroundColor = "#c6f6d5";
        successMessage.style.color = "#22543d";
        successMessage.style.padding = "1rem";
        successMessage.style.borderRadius = "0.375rem";
        successMessage.style.marginTop = "1rem";

        contactForm.parentNode.insertBefore(
          successMessage,
          contactForm.nextSibling
        );

        // Eliminar mensaje de éxito después de 5 segundos
        setTimeout(() => {
          successMessage.remove();
        }, 5000);
      }
    };

    // Agregar event listeners para retroalimentación en tiempo real en el formulario
    const formInputs = contactForm.querySelectorAll("input, textarea");
    formInputs.forEach((input) => {
      input.addEventListener("input", () => {
        if (this.hasAttribute("aria-invalid")) {
          // Revalidar en caso de error
          if (this.id === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value.trim() && emailRegex.test(this.value)) {
              removeError(this);
            }
          } else if (this.value.trim()) {
            removeError(this);
          }
        }
      });
    });
  }

  accessibility();
  imgLoadingLazy();

});
