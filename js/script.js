document.addEventListener("DOMContentLoaded", () => {
  // Add preloader for initial page load
  createPreloader();

  const timeframeButtons = document.querySelectorAll(".timeframe");
  const cardsContainer = document.querySelector(".dashboard__cards");
  const profileCard = document.querySelector(".dashboard__profile");

  // Default timeframe
  let currentTimeframe = "weekly";
  let animationsEnabled = true;

  // Create preloader
  function createPreloader() {
    const preloader = document.createElement("div");
    preloader.classList.add("preloader");

    const spinner = document.createElement("div");
    spinner.classList.add("preloader__spinner");

    preloader.appendChild(spinner);
    document.body.appendChild(preloader);

    // Hide preloader after content loads
    window.addEventListener("load", () => {
      setTimeout(() => {
        preloader.classList.add("hidden");
        setTimeout(() => {
          preloader.remove();
        }, 700);
      }, 500);
    });
  }

  // Generate activity cards with animation
  function generateCards(timeframe, animate = true) {
    if (animate && animationsEnabled) {
      // Add fade-out animation to existing cards
      const existingCards = document.querySelectorAll(".card");
      existingCards.forEach((card) => {
        card.classList.add("fade-out");
      });

      // Delay generating new cards for animation to complete
      setTimeout(() => {
        renderCards(timeframe);
      }, 300);
    } else {
      renderCards(timeframe);
    }
  }

  // Render cards with data
  function renderCards(timeframe) {
    cardsContainer.innerHTML = "";

    timeData.forEach((activity, index) => {
      const title = activity.title;
      const current = activity.timeframes[timeframe].current;
      const previous = activity.timeframes[timeframe].previous;

      // Convert title to kebab-case for CSS class
      const titleClass = title.toLowerCase().replace(" ", "-");

      // Get the appropriate text for the previous period
      let timeframeText = "";
      switch (timeframe) {
        case "daily":
          timeframeText = "Yesterday";
          break;
        case "weekly":
          timeframeText = "Last Week";
          break;
        case "monthly":
          timeframeText = "Last Month";
          break;
      }

      const cardHTML = `
        <div class="card card--${titleClass}">
          <div class="card__bg"></div>
          <div class="card__content">
            <div class="card__header">
              <h2 class="card__title">${title}</h2>
              <button class="card__menu" aria-label="Menu">
                <img src="./images/icon-ellipsis.svg" alt="Menu">
              </button>
            </div>
            <div class="card__times">
              <p class="card__current" data-value="${current}">0hrs</p>
              <p class="card__previous">${timeframeText} - ${previous}hrs</p>
            </div>
          </div>
        </div>
      `;

      cardsContainer.insertAdjacentHTML("beforeend", cardHTML);

      // Delay for staggered animation
      const delay = 100 * index;
      setTimeout(() => {
        const card = document.querySelectorAll(".card")[index];
        if (card) {
          // Trigger animations
          card.classList.add("fade-in");

          // Animate the counter
          animateCounter(card.querySelector(".card__current"), current);

          // Apply flip animation
          setTimeout(() => {
            card.classList.add("flip-card");
          }, 200);
        }
      }, delay);
    });
  }

  // Animate number counter
  function animateCounter(element, targetValue) {
    if (!animationsEnabled) {
      element.textContent = `${targetValue}hrs`;
      return;
    }

    element.classList.add("counting-animation");

    const duration = 1200; // ms
    const frameDuration = 1000 / 60; // duration of one frame at 60fps
    const totalFrames = Math.round(duration / frameDuration);

    let frame = 0;
    const startValue = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentValue = Math.round(
        startValue + (targetValue - startValue) * progress
      );

      element.textContent = `${currentValue}hrs`;

      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameDuration);
  }

  // Set active timeframe button with animation
  function setActiveTimeframe(timeframe) {
    timeframeButtons.forEach((button) => {
      if (button.dataset.timeframe === timeframe) {
        button.classList.add("active");

        // Add pulse animation
        if (animationsEnabled) {
          button.style.animation = "pulse 0.5s var(--bounce) forwards";
          setTimeout(() => {
            button.style.animation = "";
          }, 500);
        }
      } else {
        button.classList.remove("active");
      }
    });
  }

  // Toggle animations on/off (accessibility feature)
  function setupAnimationToggle() {
    // Create a toggle button
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "Animations: On";
    toggleBtn.style.position = "fixed";
    toggleBtn.style.top = "10px";
    toggleBtn.style.right = "10px";
    toggleBtn.style.background = "var(--dark-blue)";
    toggleBtn.style.color = "white";
    toggleBtn.style.border = "none";
    toggleBtn.style.borderRadius = "5px";
    toggleBtn.style.padding = "5px 10px";
    toggleBtn.style.cursor = "pointer";
    toggleBtn.style.zIndex = "100";

    toggleBtn.addEventListener("click", () => {
      animationsEnabled = !animationsEnabled;
      toggleBtn.textContent = animationsEnabled
        ? "Animations: On"
        : "Animations: Off";

      // Apply reduced-motion class to body
      if (animationsEnabled) {
        document.body.classList.remove("reduced-motion");
      } else {
        document.body.classList.add("reduced-motion");
      }

      // Regenerate cards with current settings
      generateCards(currentTimeframe, false);
    });

    document.body.appendChild(toggleBtn);

    // Check for user preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animationsEnabled = false;
      toggleBtn.textContent = "Animations: Off";
      document.body.classList.add("reduced-motion");
    }
  }

  // Add hover animations to profile card
  function setupProfileAnimations() {
    if (!profileCard) return;

    profileCard.addEventListener("mouseenter", () => {
      if (!animationsEnabled) return;

      const avatar = profileCard.querySelector(".profile__avatar");
      if (avatar) {
        avatar.style.animation = "pulse 1s var(--bounce) forwards";
      }
    });

    profileCard.addEventListener("mouseleave", () => {
      if (!animationsEnabled) return;

      const avatar = profileCard.querySelector(".profile__avatar");
      if (avatar) {
        avatar.style.animation = "";
      }
    });
  }

  // Initialize dashboard
  function initDashboard() {
    // Set up animation toggle for accessibility
    setupAnimationToggle();

    // Set up profile card animations
    setupProfileAnimations();

    // Generate cards with initial timeframe
    generateCards(currentTimeframe, false);
    setActiveTimeframe(currentTimeframe);

    // Add event listeners to timeframe buttons
    timeframeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const timeframe = button.dataset.timeframe;
        if (timeframe === currentTimeframe) return;

        currentTimeframe = timeframe;
        generateCards(timeframe, true);
        setActiveTimeframe(timeframe);
      });
    });

    // Add hover animations to ellipsis buttons
    document.addEventListener("click", (e) => {
      if (e.target.closest(".card__menu")) {
        const menuButton = e.target.closest(".card__menu");
        menuButton.style.animation = "pulse 0.5s var(--bounce) forwards";
        setTimeout(() => {
          menuButton.style.animation = "";
        }, 500);
      }
    });
  }

  // Check for prefers-reduced-motion setting
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );
  if (prefersReducedMotion.matches) {
    animationsEnabled = false;
    document.body.classList.add("reduced-motion");
  }

  // Initialize everything
  initDashboard();

  // Add window scroll animations for cards
  window.addEventListener("scroll", () => {
    if (!animationsEnabled) return;

    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      const cardPosition = card.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;

      if (cardPosition < screenPosition) {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }
    });
  });
});

// Add dark/light mode toggle functionality
function setupThemeToggle() {
  const themeToggle = document.createElement("button");
  themeToggle.textContent = "🌙";
  themeToggle.id = "theme-toggle";
  themeToggle.style.position = "fixed";
  themeToggle.style.top = "10px";
  themeToggle.style.left = "10px";
  themeToggle.style.background = "var(--dark-blue)";
  themeToggle.style.color = "white";
  themeToggle.style.border = "none";
  themeToggle.style.borderRadius = "50%";
  themeToggle.style.width = "40px";
  themeToggle.style.height = "40px";
  themeToggle.style.cursor = "pointer";
  themeToggle.style.zIndex = "100";
  themeToggle.style.fontSize = "20px";
  themeToggle.style.display = "flex";
  themeToggle.style.justifyContent = "center";
  themeToggle.style.alignItems = "center";

  document.body.appendChild(themeToggle);

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    themeToggle.textContent = document.body.classList.contains("light-theme")
      ? "☀️"
      : "🌙";
  });
}

// Call theme toggle setup on load
window.addEventListener("load", setupThemeToggle);
