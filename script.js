/**
 * REFACTORED SCRIPT - 1:1 REPLICA V2
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypingEffect();
  initAvatarDots();
  initScrollEffects();
});

/**
 * Terminal Typing Effect for Hero
 */
function initTypingEffect() {
  const roleText = document.getElementById('hero-role');
  const originalContent = roleText.innerHTML;
  roleText.innerHTML = '';

  let i = 0;
  const speed = 50;

  // Simple mock typing for the role
  function type() {
    if (i < originalContent.length) {
      roleText.innerHTML += originalContent.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  // Delay start for dramatic effect
  setTimeout(type, 1000);
}

/**
 * Dot Matrix Avatar (Refined)
 */
function initAvatarDots() {
  const canvas = document.getElementById('avatar-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = 300;
  canvas.height = 400;

  const dotSize = 3;
  const spacing = 6;

  // Simple silhouette data (1 = dot, 0 = no dot)
  const silhouette = [
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1], // Eyes
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0], // Neck
    [0, 0, 1, 1, 1, 1, 1, 0, 0], // Shoulders
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

  function drawDots() {
    ctx.fillStyle = '#f6d4b1';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(50, 50);

    silhouette.forEach((row, rowIndex) => {
      row.forEach((dot, colIndex) => {
        if (dot) {
          // Staggered flicker
          if (Math.random() > 0.15) {
            ctx.globalAlpha = Math.random() * 0.6 + 0.4;
            const x = colIndex * (dotSize + spacing);
            const y = rowIndex * (dotSize + spacing);
            ctx.beginPath();
            ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });
    });
    ctx.restore();
  }

  setInterval(drawDots, 100);
}

/**
 * Scroll Effects & UI Inversion
 */
function initScrollEffects() {
  const hero = document.getElementById('hero');
  const crtOverlay = document.querySelector('.crt-overlay');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const viewportHeight = window.innerHeight;

    // Hide CRT overlay as we scroll past hero
    if (scrolled > viewportHeight) {
      crtOverlay.style.display = 'none';
    } else {
      crtOverlay.style.display = 'block';
      crtOverlay.style.opacity = 1 - (scrolled / viewportHeight);
    }

    // Subtle parallax or fade for hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.opacity = 1 - (scrolled / (viewportHeight * 0.5));
      heroContent.style.transform = `translateY(-${scrolled * 0.2}px)`;
    }
  });

  // Menu Logic
  const menuToggle = document.getElementById('menuToggle');
  const closeMenu = document.getElementById('closeMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const menuLinks = document.querySelectorAll('.menu-content a, .social-sidebar a');

  menuToggle.addEventListener('click', () => {
    menuOverlay.classList.add('active');
  });

  closeMenu.addEventListener('click', () => {
    menuOverlay.classList.remove('active');
  });

  // Smooth Scroll
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.startsWith('#')) {
        e.preventDefault();
        const targetEl = document.querySelector(targetId === '#home' ? '#hero' : targetId);
        if (targetEl) {
          menuOverlay.classList.remove('active');
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}
