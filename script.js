document.addEventListener('DOMContentLoaded', function () {
  // ========== Navbar scroll effect ==========
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // ========== Mobile menu toggle ==========
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      if (hamburgerIcon && closeIcon) {
        hamburgerIcon.style.display = isOpen ? 'none' : 'block';
        closeIcon.style.display = isOpen ? 'block' : 'none';
      }
    });

    // Close menu on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        if (hamburgerIcon && closeIcon) {
          hamburgerIcon.style.display = 'block';
          closeIcon.style.display = 'none';
        }
      });
    });
  }

  // ========== Active nav link ==========
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a, .mobile-menu a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ========== Intersection Observer: fade-up ==========
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length > 0) {
    const fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Stagger children if data-stagger
          const delay = entry.target.dataset.delay || 0;
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay * 1000);
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    fadeEls.forEach(function (el) {
      fadeObserver.observe(el);
    });
  }

  // ========== Animated Counters ==========
  const counters = document.querySelectorAll('.counter');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  function animateCounter(el) {
    var target = el.dataset.target;
    var match = target.match(/^([\d,]+)(.*)$/);
    if (!match) return;
    var numericTarget = parseInt(match[1].replace(/,/g, ''), 10);
    var suffix = match[2] || '';
    var duration = 2000;
    var startTime = performance.now();

    function tick(currentTime) {
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * numericTarget);
      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = numericTarget.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(tick);
  }

  // ========== Progress bars (Statistics page) ==========
  const progressBars = document.querySelectorAll('.progress-fill');
  if (progressBars.length > 0) {
    const progressObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var target = entry.target.dataset.width;
          entry.target.style.width = target;
          progressObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    progressBars.forEach(function (bar) {
      progressObserver.observe(bar);
    });
  }

  // ========== Bar chart animation ==========
  const bars = document.querySelectorAll('.bar');
  if (bars.length > 0) {
    const barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var target = entry.target.dataset.height;
          entry.target.style.height = target;
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    bars.forEach(function (bar) {
      barObserver.observe(bar);
    });
  }

  // ========== Contact form validation ==========
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot check
      var hp = document.getElementById('website');
      if (hp && hp.value) return;

      var valid = true;
      clearErrors();

      var name = document.getElementById('name');
      var email = document.getElementById('email');
      var message = document.getElementById('message');
      var phone = document.getElementById('phone');

      if (!name.value.trim()) { showError('name', 'Name is required'); valid = false; }
      else if (name.value.length > 100) { showError('name', 'Name must be under 100 characters'); valid = false; }

      if (!email.value.trim()) { showError('email', 'Email is required'); valid = false; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { showError('email', 'Invalid email format'); valid = false; }

      if (!message.value.trim()) { showError('message', 'Message is required'); valid = false; }
      else if (message.value.length > 2000) { showError('message', 'Message must be under 2000 characters'); valid = false; }

      if (phone.value && !/^[\d\s\-\(\)\+]*$/.test(phone.value)) { showError('phone', 'Invalid phone format'); valid = false; }

      if (!valid) return;

      // Show toast
      showToast('Message Sent!', 'Thank you for contacting Fit2Fight. We\'ll respond within 24 hours.');
      contactForm.reset();
    });
  }

  function showError(fieldId, msg) {
    var field = document.getElementById(fieldId);
    if (!field) return;
    var errEl = field.parentElement.querySelector('.form-error');
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.className = 'form-error';
      field.parentElement.appendChild(errEl);
    }
    errEl.textContent = msg;
  }

  function clearErrors() {
    document.querySelectorAll('.form-error').forEach(function (el) {
      el.remove();
    });
  }

  // ========== Toast ==========
  function showToast(title, desc) {
    var toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      toast.innerHTML = '<p class="toast-title"></p><p class="toast-desc"></p>';
      document.body.appendChild(toast);
    }
    toast.querySelector('.toast-title').textContent = title;
    toast.querySelector('.toast-desc').textContent = desc;
    toast.classList.add('show');

    setTimeout(function () {
      toast.classList.remove('show');
    }, 4000);
  }

  // ========== Footer year ==========
  var yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
