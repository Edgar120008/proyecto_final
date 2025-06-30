// src/hooks/useMediaQuery.js
import { useState, useEffect } from 'react';

function useMediaQuery(query) {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const documentChangeHandler = (e) => setMatches(e.matches);

    // Escucha los cambios en el tamaño de la ventana
    mediaQueryList.addEventListener('change', documentChangeHandler);

    // Limpia el listener cuando el componente se desmonte
    return () => {
      mediaQueryList.removeEventListener('change', documentChangeHandler);
    };
  }, [query]);

  return matches;
}

export default useMediaQuery;