/**
 * Pre-paint theme script. Reads the user's saved preference (or OS
 * preference) and applies the `dark` class to <html> before first paint,
 * preventing a flash-of-light-theme on dark-mode users.
 *
 * Inlined as a string into a <Script strategy="beforeInteractive"> in
 * app/layout.tsx. Keep this small — it blocks the first paint.
 */
export const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`
