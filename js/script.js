document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");

  // ======= HAMBURGER MENU FUNCTIONALITY (Mobile) =======
  const menuIcon = document.querySelector(".menu-icon");
  const navbarMenu = document.querySelector(".navbar ul");
  const menuLinks = navbarMenu ? navbarMenu.querySelectorAll("a") : [];

  if (menuIcon && navbarMenu) {
      // Toggle menu on hamburger icon click
      menuIcon.addEventListener("click", function (event) {
          event.stopPropagation(); // Prevent event from bubbling up
          navbarMenu.classList.toggle("active");
          // Change icon: show "✖" if active, else "☰"
          menuIcon.textContent = navbarMenu.classList.contains("active") ? "✖" : "☰";
      });

      // Close menu when clicking outside the menu icon and menu
      document.addEventListener("click", function (event) {
          if (!menuIcon.contains(event.target) && !navbarMenu.contains(event.target)) {
              navbarMenu.classList.remove("active");
              menuIcon.textContent = "☰"; // Reset icon to hamburger
          }
      });

      // Close menu when clicking any navigation link
      menuLinks.forEach((link) => {
          link.addEventListener("click", function () {
              navbarMenu.classList.remove("active");
              menuIcon.textContent = "☰"; // Reset icon
          });
      });
  }

  // ======= HOVER ZOOM EFFECT (for .zoomable elements) =======
  const zoomableSections = document.querySelectorAll('.zoomable');
  zoomableSections.forEach((section) => {
      section.addEventListener('mouseenter', () => {
          // Remove zoom-in class from all, then add to hovered element
          zoomableSections.forEach((other) => other.classList.remove('zoom-in'));
          section.classList.add('zoom-in');
      });
      section.addEventListener('mouseleave', () => {
          section.classList.remove('zoom-in');
      });
  });

  // ======= PROGRESS BAR ANIMATION ON SCROLL =======
  const progressBars = document.querySelectorAll('.progress-bar');

  function animateProgressBars() {
      progressBars.forEach((bar) => {
          const width = bar.getAttribute('data-width'); // e.g., "80%"
          bar.style.transition = "width 1.5s ease-in-out"; // Smooth animation
          bar.style.width = width;
      });
  }

  function resetProgressBars() {
      progressBars.forEach((bar) => {
          bar.style.transition = "none"; // Remove transition when resetting
          bar.style.width = "0%";
      });
  }

  function checkScroll() {
      const educationSection = document.querySelector('.education-container');
      if (!educationSection) return;
      const sectionPosition = educationSection.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.5;
      if (sectionPosition < screenPosition) {
          animateProgressBars();
      } else {
          resetProgressBars();
      }
  }

  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Run check on load
});
