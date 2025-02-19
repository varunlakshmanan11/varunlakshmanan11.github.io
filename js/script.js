
// Hover Zoom Effect (Point to Zoom)
const zoomableSections = document.querySelectorAll('.zoomable');

zoomableSections.forEach(section => {
  section.addEventListener('mouseenter', () => {
    zoomableSections.forEach(other => {
      other.classList.remove('zoom-in');
      other.classList.add('zoom-out');
    });
    section.classList.remove('zoom-out');
    section.classList.add('zoom-in');
  });

  section.addEventListener('mouseleave', () => {
    zoomableSections.forEach(other => {
      other.classList.remove('zoom-in', 'zoom-out');
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const progressBars = document.querySelectorAll('.progress-bar');

  function animateProgressBars() {
      progressBars.forEach((bar) => {
          const width = bar.getAttribute('data-width'); // Read width from HTML attribute
          bar.style.width = width;
      });
  }

  // Check if Education section is visible and animate progress bars
  function checkScroll() {
      const educationSection = document.querySelector('.education-container');
      const sectionPosition = educationSection.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.5;

      if (sectionPosition < screenPosition) {
          animateProgressBars();
          window.removeEventListener('scroll', checkScroll); // Run only once
      }
  }

  window.addEventListener('scroll', checkScroll);
});
