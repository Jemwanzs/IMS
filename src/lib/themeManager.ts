export const applyColorScheme = () => {
    const savedScheme = JSON.parse(localStorage.getItem('activeColorScheme') || 'null');
    if (savedScheme) {
      document.documentElement.style.setProperty('--primary-color', savedScheme.primary);
      document.documentElement.style.setProperty('--secondary-color', savedScheme.secondary);
    }
  };  