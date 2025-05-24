export const disableInspect = () => {
    // Disable right-click context menu
    document.addEventListener('contextmenu', (e) => e.preventDefault());
  
    // Disable F12, Ctrl+Shift+I/J/C/U, and other inspect shortcuts
    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    });
  };
  