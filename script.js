import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * REFACTORED SCRIPT - 1:1 REPLICA V3 (Three.js 3D Integration)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypingEffect();
  initThreeScene();
  initScrollEffects();
});

/**
 * Terminal Typing Effect for Hero
 */
function initTypingEffect() {
  const roleText = document.getElementById('hero-role');
  if (!roleText) return;
  const originalContent = roleText.innerHTML;
  roleText.innerHTML = '';

  let i = 0;
  const speed = 50;

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
 * Three.js 3D Scene Implementation
 */
function initThreeScene() {
  const container = document.getElementById('avatar-canvas'); // Reusing ID for container
  if (!container) return;

  // Scene Setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.0); // Increased intensity
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 3.0); // High intensity for CRT display
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // GLTF Loading
  const loader = new GLTFLoader();
  let model;

  loader.load('assets/computer.glb', (gltf) => {
    model = gltf.scene;

    // Center and scale the model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    model.scale.set(1.5, 1.5, 1.5);
    scene.add(model);

    // Initial position adjust (optional)
    model.rotation.y = -Math.PI / 6;
  }, undefined, (error) => {
    console.error('Error loading 3D model:', error);
  });

  // Animation & Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) / 100;
    mouseY = (event.clientY - window.innerHeight / 2) / 100;
  });

  function animate() {
    requestAnimationFrame(animate);

    if (model) {
      // Floating effect (Bobbing)
      const time = Date.now() * 0.001;
      model.position.y = Math.sin(time) * 0.1;

      // Smooth parallax follow
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      model.rotation.y = -Math.PI / 6 + targetX * 0.1;
      model.rotation.x = targetY * 0.1;
    }

    renderer.render(scene, camera);
  }

  animate();

  // Resize handling
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

/**
 * Scroll Effects & UI Inversion
 */
function initScrollEffects() {
  const crtOverlay = document.querySelector('.crt-overlay');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const viewportHeight = window.innerHeight;

    // Hide CRT overlay as we scroll past hero
    if (crtOverlay) {
      if (scrolled > viewportHeight) {
        crtOverlay.style.display = 'none';
      } else {
        crtOverlay.style.display = 'block';
        crtOverlay.style.opacity = 1 - (scrolled / viewportHeight);
      }
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
  const menuLinks = document.querySelectorAll('.menu-content nav a, .social-sidebar a');

  if (menuToggle && menuOverlay) {
    menuToggle.addEventListener('click', () => {
      menuOverlay.classList.add('active');
    });
  }

  if (closeMenu && menuOverlay) {
    closeMenu.addEventListener('click', () => {
      menuOverlay.classList.remove('active');
    });
  }

  // Smooth Scroll
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetEl = document.querySelector(targetId === '#home' ? '#hero' : targetId);
        if (targetEl) {
          if (menuOverlay) menuOverlay.classList.remove('active');
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}
