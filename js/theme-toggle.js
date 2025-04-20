/**
 * Theme Toggle Functionality
 * Handles switching between light and dark themes with user preference persistence
 */

document.addEventListener("DOMContentLoaded", () => {
  // Create the theme toggle button
  createThemeToggle();

  // Check for saved user preferences
  checkUserThemePreference();

  // Listen for system preference changes
  setupSystemPreferenceListener();

  // Apply initial animations for theme elements
  applyThemeAnimations();
});

/**
 * Creates and appends the theme toggle button to the document
 */
function createThemeToggle() {
  const themeToggle = document.createElement("button");
  themeToggle.textContent = "🌙";
  themeToggle.id = "theme-toggle";
  themeToggle.setAttribute("aria-label", "Toggle dark/light theme");
  themeToggle.setAttribute("title", "Toggle dark/light theme");

  // Apply initial styling
  applyToggleButtonStyles(themeToggle);

  // Append to document
  document.body.appendChild(themeToggle);

  // Add click event listener
  themeToggle.addEventListener("click", toggleTheme);
}

/**
 * Apply styles to the toggle button
 */
function applyToggleButtonStyles(button) {
  const styles = {
    position: "fixed",
    top: "10px",
    left: "10px",
    background: "var(--dark-blue)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    cursor: "pointer",
    zIndex: "100",
    fontSize: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  };

  Object.assign(button.style, styles);
}

/**
 * Toggles between light and dark themes
 */
function toggleTheme() {
  // Toggle the theme class
  document.body.classList.toggle("light-theme");

  // Update button text
  const themeToggle = document.getElementById("theme-toggle");
  const isLightTheme = document.body.classList.contains("light-theme");

  // Change button icon
  themeToggle.textContent = isLightTheme ? "☀️" : "🌙";

  // Add button animation
  themeToggle.style.animation =
    "pulse 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
  setTimeout(() => {
    themeToggle.style.animation = "";
  }, 500);

  // Save preference to localStorage
  saveThemePreference(isLightTheme);

  // Apply theme specific animations
  triggerThemeChangeAnimations(isLightTheme);
}

/**
 * Save user's theme preference to localStorage
 */
function saveThemePreference(isLightTheme) {
  localStorage.setItem("prefersDarkTheme", !isLightTheme);
}

/**
 * Check for saved user theme preference in localStorage
 */
function checkUserThemePreference() {
  // Check localStorage first
  const savedPreference = localStorage.getItem("prefersDarkTheme");

  if (savedPreference !== null) {
    // User has a saved preference
    const prefersDarkTheme = savedPreference === "true";
    applyTheme(prefersDarkTheme);
    return;
  }

  // No saved preference, check system preference
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  applyTheme(prefersDarkMode);
}

/**
 * Apply theme based on preference
 */
function applyTheme(prefersDarkTheme) {
  // Update document class
  if (!prefersDarkTheme) {
    document.body.classList.add("light-theme");
  } else {
    document.body.classList.remove("light-theme");
  }

  // Update button text
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.textContent = prefersDarkTheme ? "🌙" : "☀️";
  }
}

/**
 * Set up listener for system preference changes
 */
function setupSystemPreferenceListener() {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      // Only apply system preference if user hasn't set their own
      if (localStorage.getItem("prefersDarkTheme") === null) {
        const prefersDarkTheme = e.matches;
        applyTheme(prefersDarkTheme);
      }
    });
}

/**
 * Trigger animations when theme changes
 */
function triggerThemeChangeAnimations(isLightTheme) {
  // Apply animations to cards
  const cards = document.querySelectorAll(".card");
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.style.animation =
        "flipAnimation 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      setTimeout(() => {
        card.style.animation = "";
      }, 600);
    }, index * 50);
  });

  // Animate profile card
  const profileCard = document.querySelector(".dashboard__profile");
  if (profileCard) {
    profileCard.style.animation =
      "scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    setTimeout(() => {
      profileCard.style.animation = "";
    }, 500);
  }

  // Animate current time numbers
  const timeElements = document.querySelectorAll(".card__current");
  timeElements.forEach((element) => {
    element.style.animation =
      "pulse 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    setTimeout(() => {
      element.style.animation = "";
    }, 500);
  });
}

/**
 * Apply initial animations for theme elements
 */
function applyThemeAnimations() {
  // Add subtle hover animations for the toggle button
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("mouseenter", () => {
      themeToggle.style.transform = "scale(1.1)";
    });

    themeToggle.addEventListener("mouseleave", () => {
      themeToggle.style.transform = "scale(1)";
    });
  }
}
