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
  
        // Optionally, close the mobile menu when clicking any link
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
  
    // ======= FORMSPREE FORM SUBMISSION =======
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent the default form submission
  
            // Collect the form data and create a JSON object
            const formData = {
                name: contactForm.querySelector('input[name="name"]').value,
                email: contactForm.querySelector('input[name="email"]').value,
                message: contactForm.querySelector('textarea[name="message"]').value
            };
  
            // Submit the data to Formspree as JSON
            fetch('https://formspree.io/f/mqaenyed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Form successfully submitted:', data);
                // Optionally, display a success message or clear the form here.
            })
            .catch(error => console.error('Error submitting form:', error));
        });
    }
  });
  