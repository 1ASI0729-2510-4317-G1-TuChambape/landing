// Función auxiliar para obtener la traducción anidada
export const getNestedTranslation = (obj, path) => {   
  const keys = path.split(".");   
  let current = obj;    

  // Recorrer las claves anidadas en la traducción
  for (const key of keys) {     
    if (current && Object.prototype.hasOwnProperty.call(current, key)) {       
      current = current[key];     
    } else {       
      return null;     
    }   
  }    

  return current; 
};  