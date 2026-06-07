
// ----------------------
// Chapter navigation
// ----------------------
function goToChapter(chapterFile) {
  if (chapterFile) {
    window.location.href = chapterFile;
  }
}

// ----------------------
// Theme toggle
// ----------------------
/* theme-toggle.js
   Usage:
   - Include the toggle markup somewhere in your page (see theme-switch.html)
   - Include CSS that defines body.light-theme and body.dark-theme
   - Add: <script src="static/theme-toggle.js" defer></script> at the end of <head> or before </body>
*/

// ==============================
// Global Theme Handling
// ==============================
(function () {
  const STORAGE_KEY = "theme";

  // Get saved theme or system default
  function getSavedTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "dark" || saved === "light") return saved;
    } catch (e) {}
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  // Apply theme to body
  function applyTheme(theme) {
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(theme === "dark" ? "dark-theme" : "light-theme");
  }

  // Save theme
  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}
  }

  // Initialize theme on load
  function initTheme() {
    const theme = getSavedTheme();
    applyTheme(theme);

    // Attach toggle only if it exists (settings.html)
    const toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.checked = theme === "dark";
      toggle.addEventListener("change", () => {
        const newTheme = toggle.checked ? "dark" : "light";
        applyTheme(newTheme);
        saveTheme(newTheme);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTheme);
  } else {
    initTheme();
  }
})();

// ======================================
// Apply saved font settings on all pages
// ======================================
document.addEventListener("DOMContentLoaded", () => {
  const savedFont = localStorage.getItem("preferredFont");
  const savedScale = parseFloat(localStorage.getItem("fontScale")) || 1;

  // If settings controls exist (only on Settings page)
  if (typeof fontSelect !== "undefined" && fontSelect) {
    if (!savedFont) {
      // ✅ No saved font → default mode
      fontSelect.value = "default";
      document.documentElement.style.setProperty("--sidebar-scale", 1);
      document.documentElement.style.setProperty("--icon-scale", 1);
    } else {
      // ✅ Saved font exists → apply it
      fontSelect.value = savedFont;
    }
  }

  // ✅ Apply saved font and scale to all text elements
  const textElements = document.querySelectorAll(
    "p, h1, h2, h3, h4, h5, h6, label, a, span"
  );

  textElements.forEach(el => {
    if (savedFont && savedFont !== "default") {
      el.style.fontFamily = savedFont;
    }

    // Store original font size if not yet set
    if (!el.dataset.originalSize) {
      const style = window.getComputedStyle(el);
      el.dataset.originalSize = parseFloat(style.fontSize);
    }

    el.style.fontSize = el.dataset.originalSize * savedScale + "px";
  });

  // ✅ Apply scale to sidebar and Lucide icons too
  document.documentElement.style.setProperty("--sidebar-scale", savedScale);
  document.documentElement.style.setProperty("--icon-scale", savedScale);
});

document.addEventListener("DOMContentLoaded", () => {
  const paragraphs = document.querySelectorAll("p, h1, h2, label, select, img,  a.book-link");
  paragraphs.forEach((p, i) => {
    p.style.animationDelay = `${i * 0.1}s`;
  });
});

// === Slide-in animation for page elements ===
document.addEventListener("DOMContentLoaded", () => {
  // Select text elements, dropdowns, and theme toggle
  const elements = document.querySelectorAll("h1, h2, h3, p, label, select");

  elements.forEach((el, i) => {
    el.style.animationDelay = `${i * 0.1}s`; // small staggered delay
  });
});


// ✅ Safe Search Bar Function (prevents sidebar crash on other pages)
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchBar");
  if (!searchInput) return; // ⛔ Stop if search bar doesn't exist (prevents crash)

  searchInput.addEventListener("keyup", function () {
    const searchTerm = this.value.toLowerCase().trim();
    const books = document.querySelectorAll("#bookList a");
    const noResults = document.getElementById("noResults");

    let matchCount = 0;

    books.forEach(book => {
      const text = book.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        book.style.display = "";
        matchCount++;
      } else {
        book.style.display = "none";
      }
    });

    if (noResults) {
      noResults.style.display = (matchCount === 0 && searchTerm.length > 0) ? "block" : "none";
    }
  });
});



// ----------------------
// BOOK SORTING (A–Z, Z–A, Random)
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
  const bookList = document.getElementById("bookList");
  if (!bookList) return; // only on homepage

  // Convert links (<a>) into an array
  const books = Array.from(bookList.getElementsByTagName("a"));

  // Read the user’s chosen sort order (default = A–Z)
  const sortOrder = localStorage.getItem("sortOrder") || "random";

  // Sort based on the saved option
  if (sortOrder === "az") {
    // A–Z order
    books.sort((a, b) => a.textContent.trim().localeCompare(b.textContent.trim()));
  } else if (sortOrder === "za") {
    // Z–A order
    books.sort((a, b) => b.textContent.trim().localeCompare(a.textContent.trim()));
  } else if (sortOrder === "random") {
    // TRUE random shuffle using Fisher–Yates algorithm
    for (let i = books.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [books[i], books[j]] = [books[j], books[i]];
    }
  }

  // Clear and reinsert sorted links
  bookList.innerHTML = "";
  books.forEach(book => bookList.appendChild(book));
});

// Optional: Automatically refresh homepage if sort setting changes in another tab
window.addEventListener("storage", (e) => {
  if (e.key === "sortOrder") location.reload();
});



// ================================
// BOOKMARK FEATURE (auto-inject + homepage list)
// ================================// ---------- Auto-insert Home icon on book pages ----------
// ---------- Auto-insert Home icon on book pages ----------
// ---------- Auto-insert Home icon on book pages ----------
if (window.location.pathname.includes('/book/')) {

  // Create a container that stays fixed in the top-right corner
  const homeContainer = document.createElement('div');
  homeContainer.style.position = 'absolute';
  homeContainer.style.top = '15px';
  homeContainer.style.right = '15px';
  homeContainer.style.zIndex = '9999';
  homeContainer.style.display = 'flex';
  homeContainer.style.alignItems = 'center';
  homeContainer.style.gap = '8px';
  homeContainer.style.cursor = 'pointer';
  homeContainer.style.transition = "transform 0.25s ease, opacity 0.25s";

  // Hover enlarge animation
  homeContainer.addEventListener("mouseenter", () => {
    homeContainer.style.transform = "scale(1.13)";
  });

  homeContainer.addEventListener("mouseleave", () => {
    homeContainer.style.transform = "scale(1)";
  });

  // Click → go home
  homeContainer.addEventListener('click', () => {
    window.location.href = "../../../sidebar/index.html";
  });

  // Home icon
  const homeBtn = document.createElement('div');
  homeBtn.className = 'icon-btn';
  homeBtn.innerHTML = `<i data-lucide="home"> `;

  // Icon styling
  homeBtn.style.background = "rgba(0,0,0,0.3)";
  homeBtn.style.border = "none";
  homeBtn.style.padding = "8px";
  homeBtn.style.borderRadius = "50%";
  homeBtn.style.backdropFilter = "blur(4px)";
  homeBtn.style.opacity = "0.85";
  homeBtn.style.marginTop = "30px";
  homeBtn.style.transition = "opacity 0.2s";

  homeBtn.addEventListener("mouseenter", () => homeBtn.style.opacity = "1");
  homeBtn.addEventListener("mouseleave", () => homeBtn.style.opacity = "0.85");

  // Home text
  const homeText = document.createElement("span");
  homeText.textContent = "Home";
  homeText.style.color = "white";
  homeText.style.fontSize = "18px";
  homeText.style.fontWeight = "500";
  homeText.style.marginRight = "30px";
  homeText.style.marginTop = "30px";
  homeText.style.fontFamily = "'Poppins', sans-serif";
  homeText.style.textShadow = "0 0 3px black";

  // Add to container
  homeContainer.appendChild(homeBtn);
  homeContainer.appendChild(homeText);

  // Add to page
  document.body.appendChild(homeContainer);

  // Slide-in fade animation
  homeContainer.style.opacity = "0";
  homeContainer.style.transform = "translateX(30px)";
  homeContainer.style.transition = "opacity 0.5s ease, transform 0.5s ease";

  setTimeout(() => {
    homeContainer.style.opacity = "1";
    homeContainer.style.transform = "translateX(0)";
  }, 100);

  // Render Lucide icons
  if (window.lucide) lucide.createIcons();
}



  // ----------------------
// Animate "Go to Chapter" dropdown
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
  const chapterLabel = document.querySelector('label[for="chapterSelect"]');
  const chapterSelect = document.getElementById("chapterSelect");

  if (chapterSelect) {
    // Set starting styles
    [chapterLabel, chapterSelect].forEach(el => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateX(-40px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });

    // Trigger the slide-in after a short delay
    setTimeout(() => {
      [chapterLabel, chapterSelect].forEach(el => {
        if (!el) return;
        el.style.opacity = "1";
        el.style.transform = "translateX(0)";
      });
    }, 200); // 0.2s delay
  }
});
