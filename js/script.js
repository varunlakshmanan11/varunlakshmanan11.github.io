document.addEventListener("DOMContentLoaded", function () {
    // ======= MOBILE HAMBURGER MENU FUNCTIONALITY =======
    const menuIcon = document.getElementById("menu-icon");
    const mobileNav = document.getElementById("mobile-nav");
  
    if (menuIcon && mobileNav) {
      // Toggle mobile menu when hamburger icon is clicked
      menuIcon.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevents click event from bubbling up
        mobileNav.classList.toggle("active");
      });
  
      // Close mobile menu when clicking outside of it
      document.addEventListener("click", function (event) {
        if (!menuIcon.contains(event.target) && !mobileNav.contains(event.target)) {
          mobileNav.classList.remove("active");
          menuIcon.textContent = "☰";
        }
      });
  
      // Close mobile menu when clicking any link
      document.querySelectorAll("#mobile-nav a").forEach(link => {
        link.addEventListener("click", function () {
          mobileNav.classList.remove("active");
        });
      });
    }
  
    // ======= HOVER ZOOM EFFECT (for elements with .zoomable) =======
    const zoomableSections = document.querySelectorAll('.zoomable');
    zoomableSections.forEach((section) => {
      section.addEventListener('mouseenter', () => {
        zoomableSections.forEach(other => other.classList.remove('zoom-in'));
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
        bar.style.transition = "width 1.5s ease-in-out";
        bar.style.width = width;
      });
    }
    function resetProgressBars() {
      progressBars.forEach((bar) => {
        bar.style.transition = "none";
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
    checkScroll(); // Run on page load
  
    // ======= FORMSPREE FORM SUBMISSION (INLINE SUCCESS MESSAGE) =======
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage'); // Where we'll show feedback
  
    if (contactForm && formMessage) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent the default form behavior
  
        // Collect the form data
        const formData = {
          name: contactForm.querySelector('input[name="name"]').value,
          email: contactForm.querySelector('input[name="email"]').value,
          message: contactForm.querySelector('textarea[name="message"]').value
        };
  
        // Submit to Formspree
        fetch('https://formspree.io/f/mqaenyed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        .then(async (response) => {
          if (response.ok) {
            // If the response was 2xx (Formspree accepted the submission)
            formMessage.textContent = "Thank you! Your message has been sent.";
            formMessage.style.color = "green";
            contactForm.reset(); // Clear form fields
          } else {
            // If there's a problem, parse the JSON for any error messages
            const errorData = await response.json();
            if (errorData && errorData.errors) {
              formMessage.textContent = errorData.errors.map(err => err.message).join(", ");
            } else {
              formMessage.textContent = "Oops! There was a problem submitting the form.";
            }
            formMessage.style.color = "red";
          }
        })
        .catch(error => {
          console.error('Error submitting form:', error);
          formMessage.textContent = "Oops! There was a problem submitting the form.";
          formMessage.style.color = "red";
        });
      });
    }
  });
  