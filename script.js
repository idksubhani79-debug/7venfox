/**
 * 7venfox Case Studies & Work Interactive Script
 * - Responsive Mobile Navigation Drawer
 * - Neural Mesh Canvas Particle Network (Mouse + Touch Support)
 * - Cursor Spotlight Follow
 * - 3D Interactive Parallax Tilt
 * - Category Filter Engine (with URL Param & Hash Support)
 * - Project Case Study Deep-Dive Modal with Image Rendering
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------
     0. RESPONSIVE MOBILE NAVIGATION DRAWER
  ---------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    if (!mobileMenuBtn || !mobileNavDrawer) return;
    mobileMenuBtn.classList.add('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    mobileNavDrawer.classList.add('active');
    mobileNavDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileMenuBtn || !mobileNavDrawer) return;
    mobileMenuBtn.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileNavDrawer.classList.remove('active');
    mobileNavDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      if (mobileNavDrawer && mobileNavDrawer.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  if (mobileNavDrawer) {
    mobileNavDrawer.addEventListener('click', (e) => {
      if (e.target === mobileNavDrawer) closeMobileMenu();
    });
  }


  /* ----------------------------------------------------
     1. INTERACTIVE DIGITAL GROWTH NEURAL MESH (CANVAS)
  ---------------------------------------------------- */
  const canvas = document.getElementById('neuralBgCanvas');
  const spotlight = document.getElementById('cursorSpotlight');

  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 100);
    });

    const mouse = { x: width * 0.5, y: height * 0.4, radius: 180 };

    function updatePointer(clientX, clientY) {
      mouse.x = clientX;
      mouse.y = clientY;
      if (spotlight) {
        spotlight.style.left = `${clientX}px`;
        spotlight.style.top = `${clientY}px`;
      }
    }

    window.addEventListener('mousemove', (e) => {
      updatePointer(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length > 0) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length > 0) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    class GrowthNode {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.55;
        this.vy = (Math.random() - 0.5) * 0.55;
        this.radius = Math.random() * 2 + 1;
        this.baseAlpha = Math.random() * 0.4 + 0.12;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${this.baseAlpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00e5ff';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const nodeDensity = window.innerWidth < 768 ? 25000 : 18000;
    const nodeCount = Math.min(80, Math.floor((width * height) / nodeDensity));
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) nodes.push(new GrowthNode());

    function connectNodes() {
      const maxDistance = window.innerWidth < 768 ? 120 : 150;
      for (let a = 0; a < nodes.length; a++) {
        for (let b = a + 1; b < nodes.length; b++) {
          const dx = nodes[a].x - nodes[b].x;
          const dy = nodes[a].y - nodes[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const opacity = (1 - dist / maxDistance) * 0.22;
            ctx.beginPath();
            ctx.moveTo(nodes[a].x, nodes[a].y);
            ctx.lineTo(nodes[b].x, nodes[b].y);
            ctx.strokeStyle = `rgba(0, 229, 255, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        const mdx = mouse.x - nodes[a].x;
        const mdy = mouse.y - nodes[a].y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < 180) {
          const mOpacity = (1 - mdist / 180) * 0.38;
          ctx.beginPath();
          ctx.moveTo(nodes[a].x, nodes[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${mOpacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    function animateLoop() {
      ctx.clearRect(0, 0, width, height);
      nodes.forEach((node) => {
        node.update();
        node.draw();
      });
      connectNodes();
      requestAnimationFrame(animateLoop);
    }
    animateLoop();
  }


  /* ----------------------------------------------------
     2. CATEGORY FILTER TABS & URL PARAMETER PARSER
  ---------------------------------------------------- */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  function applyCategoryFilter(cat) {
    const category = cat.toLowerCase();

    filterTabs.forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.filter === category);
    });

    projectCards.forEach((card) => {
      const cardCategory = (card.dataset.category || '').toLowerCase();
      const catList = cardCategory.split(' ');
      if (category === 'all' || catList.includes(category) || cardCategory === category) {
        card.style.display = 'block';
        card.style.animation = 'fadeInCard 0.4s cubic-bezier(0.16, 1, 0.3, 1) both';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      applyCategoryFilter(tab.dataset.filter);
    });
  });

  // Check if URL has ?filter=web or hash #web
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter');
  const hashParam = window.location.hash.replace('#', '');

  const validFilters = ['web', 'services', 'fitness', 'ecommerce', 'saas', 'fintech'];
  if (filterParam) {
    applyCategoryFilter(filterParam);
  } else if (hashParam && validFilters.includes(hashParam)) {
    applyCategoryFilter(hashParam);
  }


  /* ----------------------------------------------------
     3. 3D INTERACTIVE TILT MICRO-INTERACTION (DESKTOP)
  ---------------------------------------------------- */
  if (window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)').matches) {
    projectCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }


  /* ----------------------------------------------------
     4. PROJECT CASE STUDY DETAILS MODAL
  ---------------------------------------------------- */
  const modal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalImg = document.getElementById('modalImg');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTechRow = document.getElementById('modalTechRow');
  const metric1Val = document.getElementById('metric1Val');
  const metric1Lbl = document.getElementById('metric1Lbl');
  const metric2Val = document.getElementById('metric2Val');
  const metric2Lbl = document.getElementById('metric2Lbl');
  const metric3Val = document.getElementById('metric3Val');
  const metric3Lbl = document.getElementById('metric3Lbl');

  function openModal(card) {
    if (!modal) return;
    const title = card.dataset.title || card.querySelector('.project-card__name').textContent;
    const tag = card.dataset.tag || card.querySelector('.project-card__category').textContent;
    const desc = card.dataset.desc || "High-performance architecture engineered with modern scalable technologies.";
    const tech = (card.dataset.tech || "").split(',');
    const imgSrc = card.dataset.image || card.querySelector('.project-card__img')?.getAttribute('src');

    if (modalImg && imgSrc) {
      modalImg.src = imgSrc;
      modalImg.alt = title;
      modalImg.parentElement.style.display = 'block';
    } else if (modalImg) {
      modalImg.parentElement.style.display = 'none';
    }

    modalCategory.textContent = tag;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;

    metric1Val.textContent = card.dataset.metric || "+240%";
    metric1Lbl.textContent = card.dataset.metricLabel || "Growth";
    metric2Val.textContent = card.dataset.metric2 || "0.4s";
    metric2Lbl.textContent = card.dataset.metric2Label || "Load Time";
    metric3Val.textContent = card.dataset.metric3 || "99.9%";
    metric3Lbl.textContent = card.dataset.metric3Label || "Uptime";

    if (modalTechRow) {
      modalTechRow.innerHTML = tech
        .map((t) => `<span class="tech-tag" style="border-color: rgba(0,229,255,0.3); color: var(--text-pure);">${t.trim()}</span>`)
        .join('');
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  projectCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('http')) return;
      openModal(card);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeMobileMenu();
    }
  });

  console.log('7venfox Work & Case Studies module loaded.');
});