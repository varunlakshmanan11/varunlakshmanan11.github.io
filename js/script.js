document.addEventListener("DOMContentLoaded", function () {
  // ======= HAMBURGER MENU FUNCTIONALITY =======
  const menuIcon = document.querySelector(".menu-icon");
  const navbarMenu = document.querySelector(".navbar ul");
  const menuLinks = navbarMenu.querySelectorAll("a");

  if (menuIcon && navbarMenu) {
    menuIcon.addEventListener("click", function () {
      navbarMenu.classList.toggle("active");
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (event) {
      if (!menuIcon.contains(event.target) && !navbarMenu.contains(event.target)) {
        navbarMenu.classList.remove("active");
      }
    });

    // Close menu when clicking a link
    menuLinks.forEach((link) => {
      link.addEventListener("click", function () {
        navbarMenu.classList.remove("active");
      });
    });
  }

  // ======= HOVER ZOOM EFFECT (Point to Zoom) =======
  const zoomableSections = document.querySelectorAll('.zoomable');

  zoomableSections.forEach((section) => {
    section.addEventListener('mouseenter', () => {
      zoomableSections.forEach((other) => {
        other.classList.remove('zoom-in');
      });
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
      const width = bar.getAttribute('data-width'); // Read width from HTML attribute
      bar.style.transition = "width 1.5s ease-in-out"; // Smooth transition
      bar.style.width = width;
    });
  }

  function resetProgressBars() {
    progressBars.forEach((bar) => {
      bar.style.transition = "none"; // Instantly reset width
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
  checkScroll(); // Run once on load
});
