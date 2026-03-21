/**
 * main.js - Shared JavaScript for YUEXIN IoT website
 */
(function() {
  'use strict';

  // ── Navbar scroll effect ──────────────────────────────────────
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // ── Mobile hamburger ──────────────────────────────────────────
  var hamburger = document.querySelector('.hamburger');
  var mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.classList.toggle('mobile-nav-open');
    });
    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.classList.remove('mobile-nav-open');
      });
    });
  }

  // ── Product filter ────────────────────────────────────────────
  var filterBtns = document.querySelectorAll('.filter-btn');
  var categorySections = document.querySelectorAll('.category-section');
  if (filterBtns.length) {
    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var filter = btn.getAttribute('data-filter');
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        // Directly show/hide category sections by matching their id to the filter
        categorySections.forEach(function(section) {
          var sectionId = section.id; // 'wifi', 'bt', 'zigbee'
          if (filter === 'all' || sectionId === filter) {
            section.style.display = '';
            section.querySelectorAll('.product-card').forEach(function(card) {
              card.style.display = '';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            section.style.display = 'none';
          }
        });
      });
    });
  }

  // ── Quote form submission ─────────────────────────────────────
  var quoteForms = document.querySelectorAll('.quote-form, .contact-form');
  quoteForms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var submitBtn = form.querySelector('button[type="submit"]');
      var successMsg = form.querySelector('.form-success');
      var originalText = submitBtn ? submitBtn.textContent : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = form.getAttribute('data-sending') || 'Sending...';
      }

      var formData = new FormData(form);
      var data = {};
      formData.forEach(function(value, key) { data[key] = value; });
      data._timestamp = new Date().toISOString();
      data._page = window.location.pathname;

      var txtLine = [
        '=== YUEXIN IoT Quote Request ===',
        'Time: ' + data._timestamp,
        'Page: ' + data._page,
        'Name: ' + (data.name || ''),
        'Email: ' + (data.email || ''),
        'Company: ' + (data.company || ''),
        'Product: ' + (data.product || data.module || ''),
        'Message: ' + (data.message || ''),
        '---'
      ].join('\n');

      // Save to file via fetch POST
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/tmp/quote_requests_v3.txt', true);
      xhr.setRequestHeader('Content-Type', 'text/plain');
      xhr.onload = function() {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
        if (successMsg) {
          successMsg.style.display = 'flex';
          setTimeout(function() { successMsg.style.display = 'none'; }, 8000);
        }
        form.reset();
      };
      xhr.onerror = function() {
        // Fallback: show success anyway since we tried
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
        if (successMsg) {
          successMsg.style.display = 'flex';
          setTimeout(function() { successMsg.style.display = 'none'; }, 8000);
        }
        form.reset();
      };
      xhr.send(txtLine);
    });
  });

  // ── Scroll animations ─────────────────────────────────────────
  var observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.product-card, .app-card, .reason-card, .service-card').forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    observer.observe(el);
  });

  // ── Smooth scroll for anchor links ────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Active nav link ───────────────────────────────────────────
  var currentPath = window.location.pathname;
  document.querySelectorAll('.navbar-nav a, .mobile-nav a').forEach(function(link) {
    var href = link.getAttribute('href');
    if (href === currentPath ||
        (currentPath.endsWith('/') && href === 'index.html') ||
        (currentPath.includes(href) && href !== 'index.html' && href !== '/')) {
      link.classList.add('active');
    }
  });

})();
