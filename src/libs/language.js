import { getNestedTranslation } from "../utils/getNestedTranslation.js";
import { updateMetaTags } from "../utils/updateMetaTags.js";
import i18n from "./i18n.js";

// Función principal para cambiar el idioma de la página
export const setLanguage = (lang) => {   
  // Establecer el idioma en el atributo lang del documento
  document.documentElement.lang = lang;    

  // Actualizar todos los elementos que tienen el atributo "data-i18n"
  const elements = document.querySelectorAll("[data-i18n]");   
  elements.forEach((element) => {     
    const key = element.getAttribute("data-i18n");     
    const translation = getNestedTranslation(i18n[lang], key);      

    // Si la traducción es encontrada, actualizar el texto del elemento
    if (translation) {       
      element.textContent = translation;     
    }   
  });    

  // Actualizar todos los elementos con el atributo "data-i18n-placeholder"
  const placeholders = document.querySelectorAll("[data-i18n-placeholder]");   
  placeholders.forEach((element) => {     
    const key = element.getAttribute("data-i18n-placeholder");     
    const translation = getNestedTranslation(i18n[lang], key);      

    // Si la traducción es encontrada, actualizar el placeholder
    if (translation) {       
      element.placeholder = translation;     
    }   
  });    

  // Actualizar todos los elementos con el atributo "data-i18n-alt"
  const alts = document.querySelectorAll("[data-i18n-alt]");   
  alts.forEach((element) => {     
    const key = element.getAttribute("data-i18n-alt");     
    const translation = getNestedTranslation(i18n[lang], key);      

    // Si la traducción es encontrada, actualizar el atributo "alt"
    if (translation) {       
      element.alt = translation;     
    }   
  });    

  // Actualizar las etiquetas meta de la página
  updateMetaTags(lang);    

  // Actualizar el idioma que se muestra en la interfaz de usuario
  document.querySelector(".current-language").textContent = lang.toUpperCase(); 
};  


