import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

/**
 * Hook to detect and sync MUI's dark mode with Tailwind's dark class
 * Returns true if dark mode is active
 */
export function useDarkMode() {
  const theme = useTheme();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check MUI's color scheme attribute
    const colorScheme = document.documentElement.getAttribute('data-mui-color-scheme');
    const isDark = colorScheme === 'dark' || (!colorScheme && prefersDarkMode);

    setIsDarkMode(isDark);

    // Sync with Tailwind's dark class
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme.palette.mode, prefersDarkMode]);

  // Watch for changes to the data-mui-color-scheme attribute
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-mui-color-scheme') {
          const colorScheme = document.documentElement.getAttribute('data-mui-color-scheme');
          const isDark = colorScheme === 'dark' || (!colorScheme && prefersDarkMode);

          setIsDarkMode(isDark);

          if (isDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-mui-color-scheme'],
    });

    return () => observer.disconnect();
  }, [prefersDarkMode]);

  return isDarkMode;
}
