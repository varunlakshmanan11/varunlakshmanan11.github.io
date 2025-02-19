
// Hover Zoom Effect (Point to Zoom)
const zoomableSections = document.querySelectorAll('.zoomable');

let zoomTimeout; // Prevents rapid hover changes

zoomableSections.forEach((section) => {
  section.addEventListener('mouseenter', () => {
    clearTimeout(zoomTimeout); // Prevent multiple triggers
    zoomTimeout = setTimeout(() => {
      zoomableSections.forEach((other) => {
        other.classList.remove('zoom-in');
        other.classList.add('zoom-out');
      });
      section.classList.remove('zoom-out');
      section.classList.add('zoom-in');
    }, 100); // Slight delay to avoid flickering
  });

  section.addEventListener('mouseleave', () => {
    clearTimeout(zoomTimeout);
    zoomableSections.forEach((other) => {
      other.classList.remove('zoom-in', 'zoom-out');
    });
  });
});


document.addEventListener('DOMContentLoaded', function () {
  const progressBars = document.querySelectorAll('.progress-bar');

  function animateProgressBars() {
    progressBars.forEach((bar) => {
      const width = bar.getAttribute('data-width'); // Read width from HTML attribute
      bar.style.transition = "width 1.5s ease-in-out"; // Smooth transition
      bar.style.width = width;
    });
  }

  function checkScroll() {
    const educationSection = document.querySelector('.education-container');
    if (!educationSection) return;

    const sectionPosition = educationSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.5;

    if (sectionPosition < screenPosition) {
      animateProgressBars();
      window.removeEventListener('scroll', checkScroll); // Run once
    }
  }

  // Run once if section is already visible on load
  checkScroll();

  window.addEventListener('scroll', checkScroll);
});

function toggleMenu() {
  const navbar = document.querySelector('.navbar');
  navbar.classList.toggle('active');
}

document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.querySelector(".menu-icon");
  const navbar = document.querySelector(".navbar ul");

  menuIcon.addEventListener("click", function () {
      navbar.classList.toggle("active");
  });
});
