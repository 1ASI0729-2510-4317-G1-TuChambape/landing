import i18n from "../libs/i18n";

// Función para actualizar las etiquetas meta (título, descripción, keywords, etc.)
export const updateMetaTags = (lang) => {   
  // Actualizar el título de la página
  document.title = i18n[lang].meta.title;    

  // Actualizar la descripción meta
  const metaDescription = document.querySelector('meta[name="description"]');   
  if (metaDescription) {     
    metaDescription.content = i18n[lang].meta.description;   
  }    

  // Actualizar las palabras clave meta
  const metaKeywords = document.querySelector('meta[name="keywords"]');   
  if (metaKeywords) {     
    metaKeywords.content = i18n[lang].meta.keywords;   
  }    

  // Actualizar las etiquetas Open Graph para redes sociales
  const ogTitle = document.querySelector('meta[property="og:title"]');   
  const ogDescription = document.querySelector('meta[property="og:description"]');    

  if (ogTitle) {     
    ogTitle.content = i18n[lang].meta.og.title;   
  }    

  if (ogDescription) {     
    ogDescription.content = i18n[lang].meta.og.description;   
  }    

  // Actualizar las etiquetas de Twitter Card
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');   
  const twitterDescription = document.querySelector('meta[name="twitter:description"]');    

  if (twitterTitle) {     
    twitterTitle.content = i18n[lang].meta.twitter.title;   
  }    

  if (twitterDescription) {     
    twitterDescription.content = i18n[lang].meta.twitter.description;   
  } 
};
