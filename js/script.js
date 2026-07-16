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
    const educationSection = document.querySelector('.education-container');
    if (educationSection && progressBars.length) {
      const barObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateProgressBars(); // animate once, no reset on scroll
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      barObserver.observe(educationSection);
    }
  
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
          headers: { 'Content-Type': 'application/json',
                     'Accept': 'application/json'
           },
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
  
  // ======= SCROLL FADE-IN ANIMATION =======
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target); // animate once, stay visible
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
  
  const fadeObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target); // animate once, stay visible
      }
    });
  }, { threshold: 0.2 });
  
  document.querySelectorAll(".fade-section").forEach(el => {
    fadeObserver.observe(el);
  });
  
/* ================================================================
   THEME v2 interactions: intro, hero reveal, carousel, form success
   ================================================================ */
document.addEventListener("DOMContentLoaded", function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- intro: VL -> VARUN LAKSHMANAN -> title bar ---------- */
  const intro = document.getElementById("intro");
  const introName = document.getElementById("intro-name");
  const navTitle = document.getElementById("nav-title");
  const mobileTitle = document.querySelector(".mobile-title");
  const heroPhoto = document.getElementById("hero-photo");
  const heroStage = heroPhoto ? heroPhoto.closest(".hero-stage") || heroPhoto : null;

  function finishIntro(instant) {
    if (intro) intro.classList.add("done");
    if (navTitle) navTitle.classList.add("shown");
    if (mobileTitle) mobileTitle.classList.add("shown");
    setTimeout(() => { const st = heroPhoto && (heroPhoto.closest(".hero-stage") || heroPhoto); st && st.classList.add("revealed"); }, instant ? 0 : 250);
  }

  if (!intro || reduced || sessionStorage.getItem("introPlayed")) {
    document.body.classList.add("intro-skip");
    finishIntro(true);
  } else {
    sessionStorage.setItem("introPlayed", "1");
    // step 1: expand letters (VARUN reversed, LAKSHMANAN forward)
    requestAnimationFrame(() => requestAnimationFrame(() => introName.classList.add("go")));
    // step 2: fly the name to the navbar title position
    setTimeout(() => {
      const target = (navTitle && navTitle.offsetParent !== null) ? navTitle : mobileTitle;
      if (target) {
        const t = target.getBoundingClientRect();
        const s = introName.getBoundingClientRect();
        const scale = Math.min(t.height / s.height, 0.5);
        const dx = (t.left + t.width / 2) - (s.left + s.width / 2);
        const dy = (t.top + t.height / 2) - (s.top + s.height / 2);
        introName.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
        introName.style.textShadow = "none";
      }
    }, 950);
    // step 3: swap in the real title, fade overlay, reveal photo
    setTimeout(() => finishIntro(false), 1450);
  }

  /* ---------- hero photo: tap support for touch devices ---------- */
  if (heroStage && window.matchMedia("(pointer: coarse)").matches) {
    heroStage.addEventListener("click", (e) => {
      if (!heroStage.classList.contains("tapped")) {
        e.preventDefault();
        heroStage.classList.add("tapped");
      }
    });
    document.addEventListener("click", (e) => {
      if (!heroStage.contains(e.target)) heroStage.classList.remove("tapped");
    });
  }

  /* ---------- carousels (projects + skills) ---------- */
  const visibleCarousels = new Set();
  document.querySelectorAll(".carousel").forEach((car) => {
    const viewport = car.querySelector(".car-viewport");
    if (!viewport) return;
    const slides = Array.from(viewport.querySelectorAll(".car-slide"));
    const prevBtn = car.querySelector(".car-arrow.left");
    const nextBtn = car.querySelector(".car-arrow.right");
    const dotsWrap = car.parentElement.querySelector(".car-dots");
    let cur = 0;

    const dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.setAttribute("aria-label", "Go to item " + (i + 1));
      b.addEventListener("click", () => go(i));
      dotsWrap.appendChild(b);
      return b;
    });

    function render() {
      const n = slides.length;
      slides.forEach((s, i) => {
        s.classList.remove("center", "left", "right", "tapped");
        if (i === cur) s.classList.add("center");
        else if (i === (cur - 1 + n) % n) s.classList.add("left");
        else if (i === (cur + 1) % n) s.classList.add("right");
      });
      dots.forEach((d, i) => d.classList.toggle("on", i === cur));
    }
    function go(i) { cur = (i + slides.length) % slides.length; render(); }
    car._go = go; car._cur = () => cur;

    prevBtn.addEventListener("click", () => go(cur - 1));
    nextBtn.addEventListener("click", () => go(cur + 1));
    slides.forEach((s, i) => s.addEventListener("click", (e) => {
      if (i !== cur) { e.preventDefault(); go(i); return; }
      if (window.matchMedia("(pointer: coarse)").matches && s.querySelector(".proj-overlay") && !s.classList.contains("tapped")) {
        e.preventDefault();
        s.classList.add("tapped");
      }
    }));

    let sx = null;
    viewport.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
    viewport.addEventListener("touchend", (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
      sx = null;
    }, { passive: true });

    new IntersectionObserver((en) => {
      en.forEach((x) => x.isIntersecting ? visibleCarousels.add(car) : visibleCarousels.delete(car));
    }, { threshold: 0.3 }).observe(car);

    render();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    if (/INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
    const car = visibleCarousels.values().next().value;
    if (!car) return;
    car._go(car._cur() + (e.key === "ArrowRight" ? 1 : -1));
  });

  /* ---------- form success animation hook ---------- */
  const fm = document.getElementById("formMessage");
  if (fm) {
    new MutationObserver(() => {
      fm.classList.toggle("success", /sent|thank/i.test(fm.textContent));
    }).observe(fm, { childList: true, characterData: true, subtree: true });
  }
});
