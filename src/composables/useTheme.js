import { ref, onMounted, watch } from "vue";

// Singleton state
const theme = ref("dark");

export function useTheme() {
  
  const applyTheme = () => {
    const root = document.documentElement;
    if (theme.value === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  };

  const initTheme = () => {
    // Check localStorage first
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      theme.value = storedTheme;
    } else {
      // Fallback to system preference
      theme.value = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    applyTheme();
  };

  const toggleTheme = () => {
    theme.value = theme.value === "dark" ? "light" : "dark";
    localStorage.setItem("theme", theme.value);
    applyTheme();
  };

  onMounted(() => {
    // Ensure theme is applied on mount, but only init if needed
    // Actually, hitting initTheme multiples times is fine, it just reads localstorage
    initTheme();
  });
  
  return {
    theme,
    toggleTheme,
    initTheme
  };
}
