/**
 * ============================================================
 * AVIKA TRIVEDI - PERSONAL PORTFOLIO INTERACTIVITY SCRIPT
 * Vanilla JS with zero dependencies: Theme toggle, filtering,
 * animations, clipboard copy, and contact form handling.
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------------------------
  // 1. THEME TOGGLE (DARK / LIGHT MODE)
  // ----------------------------------------------------------
  const htmlElement = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggle');
  const STORAGE_KEY = 'avika_portfolio_theme';

  // Retrieve saved preference or check OS preference
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'dark'); // default dark

  htmlElement.setAttribute('data-theme', initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem(STORAGE_KEY, newTheme);
      
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode!`);
    });
  }

  // ----------------------------------------------------------
  // 2. MOBILE NAVIGATION MENU
  // ----------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const mobileBackdrop = document.getElementById('mobileBackdrop');
  const navLinks = document.querySelectorAll('.nav-link');

  function toggleMobileMenu() {
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    navMenu.classList.add('open');
    mobileBackdrop.classList.add('open');
    mobileMenuBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    navMenu.classList.remove('open');
    mobileBackdrop.classList.remove('open');
    mobileMenuBtn.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileMenu);
  }

  // Close menu when clicking on any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeMobileMenu();
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // ----------------------------------------------------------
  // 3. TYPEWRITER EFFECT IN HERO ROLE
  // ----------------------------------------------------------
  const roleTypewriter = document.getElementById('roleTypewriter');
  const roles = [
    'B.Tech Student & AI Enthusiast',
    'Curious Technologist',
    'Modern Web Developer',
    'Digital Productivity Advocate',
    'Passionate Practical Learner'
  ];

  let currentRoleIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeRole() {
    if (!roleTypewriter) return;

    const currentRole = roles[currentRoleIndex];

    if (isDeleting) {
      currentCharIndex--;
      roleTypewriter.textContent = currentRole.substring(0, currentCharIndex);
      typingSpeed = 50;
    } else {
      currentCharIndex++;
      roleTypewriter.textContent = currentRole.substring(0, currentCharIndex);
      typingSpeed = 110;
    }

    if (!isDeleting && currentCharIndex === currentRole.length) {
      // Pause at full word
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && currentCharIndex === 0) {
      isDeleting = false;
      currentRoleIndex = (currentRoleIndex + 1) % roles.length;
      typingSpeed = 500;
    }

    setTimeout(typeRole, typingSpeed);
  }

  // Start typewriter after a short delay
  setTimeout(typeRole, 1000);

  // ----------------------------------------------------------
  // 4. ACTIVE NAVIGATION LINK ON SCROLL
  // ----------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ----------------------------------------------------------
  // 5. SKILLS CATEGORY FILTERING
  // ----------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // ----------------------------------------------------------
  // 6. COPY EMAIL TO CLIPBOARD WITH TOAST FEEDBACK
  // ----------------------------------------------------------
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const emailToCopy = 'avikatrivedi13@gmail.com';

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(emailToCopy);
        } else {
          // Fallback textarea method
          const tempTextArea = document.createElement('textarea');
          tempTextArea.value = emailToCopy;
          tempTextArea.style.position = 'fixed';
          tempTextArea.style.left = '-999999px';
          document.body.appendChild(tempTextArea);
          tempTextArea.focus();
          tempTextArea.select();
          document.execCommand('copy');
          document.body.removeChild(tempTextArea);
        }

        // Change copy icon temporarily
        const icon = copyEmailBtn.querySelector('i');
        icon.className = 'fa-solid fa-check';
        copyEmailBtn.style.color = 'var(--accent-emerald)';

        showToast('Email copied to clipboard: ' + emailToCopy);

        setTimeout(() => {
          icon.className = 'fa-regular fa-copy';
          copyEmailBtn.style.color = '';
        }, 2200);
      } catch (err) {
        showToast('Failed to copy. Email: ' + emailToCopy);
      }
    });
  }

  // ----------------------------------------------------------
  // 7. TOAST NOTIFICATION UTILITY
  // ----------------------------------------------------------
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  function showToast(message) {
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // ----------------------------------------------------------
  // 8. INTERACTIVE CONTACT FORM WITH VALIDATION & DIRECT EMAIL
  // ----------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('senderName');
  const emailInput = document.getElementById('senderEmail');
  const subjectInput = document.getElementById('messageSubject');
  const messageInput = document.getElementById('senderMessage');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const subjectError = document.getElementById('subjectError');
  const messageError = document.getElementById('messageError');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Reset errors
      nameError.textContent = '';
      emailError.textContent = '';
      subjectError.textContent = '';
      messageError.textContent = '';

      // Validate Name
      if (!nameInput.value.trim()) {
        nameError.textContent = 'Please enter your name.';
        isValid = false;
      }

      // Validate Email
      if (!emailInput.value.trim()) {
        emailError.textContent = 'Please enter your email address.';
        isValid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        subjectError.textContent = 'Please provide a subject.';
        isValid = false;
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageError.textContent = 'Please write a message.';
        isValid = false;
      } else if (messageInput.value.trim().length < 10) {
        messageError.textContent = 'Message should be at least 10 characters.';
        isValid = false;
      }

      if (!isValid) return;

      // Create pre-filled mailto link
      const name = encodeURIComponent(nameInput.value.trim());
      const email = encodeURIComponent(emailInput.value.trim());
      const subject = encodeURIComponent(subjectInput.value.trim());
      const body = encodeURIComponent(
        `Hi Avika,\n\n${messageInput.value.trim()}\n\nBest regards,\n${nameInput.value.trim()} (${emailInput.value.trim()})`
      );

      const mailtoUrl = `mailto:avikatrivedi13@gmail.com?subject=${subject}&body=${body}`;

      // Open email client
      window.location.href = mailtoUrl;

      showToast('Opening your email client to send message...');

      // Optional form reset
      setTimeout(() => {
        contactForm.reset();
      }, 1000);
    });
  }

  // ----------------------------------------------------------
  // 9. ANIMATE SKILL PROGRESS BARS ON SCROLL
  // ----------------------------------------------------------
  const progressBars = document.querySelectorAll('.progress-fill');
  
  const observerOptions = {
    threshold: 0.2
  };

  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const targetWidth = fill.style.getPropertyValue('--target-width') || '80%';
        fill.style.width = targetWidth;
        observer.unobserve(fill);
      }
    });
  }, observerOptions);

  progressBars.forEach(bar => {
    // Start collapsed and animate when scrolled into view
    bar.style.width = '0%';
    skillObserver.observe(bar);
  });

});
