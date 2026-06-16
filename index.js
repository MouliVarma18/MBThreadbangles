// --- M&B THREAD BANGLES - INTERACTIVE JS ---

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroSlider();
  initThreadCanvas();
  initInstagramLightbox();
  initOutfitMatcher();
  initBangleCustomizer();
  initScrollReveal();
});

// --- 1. NAVBAR SCROLL & MENU ---
function initNavbar() {
  const header = document.getElementById('main-header');
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = navMenu.querySelectorAll('a');

  // Change nav background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Toggle mobile menu
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu on click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

// --- 2. HERO IMAGE SLIDER ---
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length === 0) return;
  let currentSlide = 0;

  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 6000); // Transition every 6 seconds
}

// --- 3. FLOATING THREADS ANIMATION (CANVAS) ---
function initThreadCanvas() {
  const canvas = document.getElementById('thread-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = (canvas.width = window.innerWidth);
    height = (canvas.height = window.innerHeight);
  });

  // Thread particle class
  class Thread {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 100;
      this.length = 100 + Math.random() * 200;
      this.speed = 0.4 + Math.random() * 0.8;
      this.amplitude = 10 + Math.random() * 25;
      this.frequency = 0.005 + Math.random() * 0.01;
      this.phase = Math.random() * Math.PI * 2;
      this.color = Math.random() > 0.5 ? 'rgba(197, 160, 89, 0.15)' : 'rgba(232, 197, 200, 0.12)'; // Gold or Blush Pink
      this.thickness = 1 + Math.random() * 1.5;
    }

    update() {
      this.y -= this.speed;
      this.phase += 0.01;
      
      // Reset if offscreen
      if (this.y + this.length < 0) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.thickness;

      // Draw a wavy thread line using Bezier curve approximation
      for (let i = 0; i < this.length; i += 10) {
        const py = this.y + i;
        const px = this.x + Math.sin(py * this.frequency + this.phase) * this.amplitude;
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    }
  }

  const threads = Array.from({ length: 15 }, () => new Thread());

  function animate() {
    ctx.clearRect(0, 0, width, height);
    threads.forEach(thread => {
      thread.update();
      thread.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

// --- 4. INSTAGRAM LIGHTBOX GALLERY ---
function initInstagramLightbox() {
  const gallery = document.getElementById('instagram-gallery');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!gallery || !lightbox || !lightboxImg || !lightboxVideo || !lightboxCaption) return;

  const items = Array.from(gallery.querySelectorAll('.lookbook-card'));
  const tabs = gallery.querySelectorAll('.tab-btn');
  let visibleItems = [...items];
  let currentIndex = 0;

  function isVideoFile(src) {
    if (!src) return false;
    return src.includes('bridal_collection.png') ||
           src.includes('insta_photo_10.png') ||
           src.includes('insta_photo_7.png') ||
           src.includes('insta_photo_8.png') ||
           src.includes('insta_photo_9.png');
  }

  function showImage(index) {
    currentIndex = index;
    const item = visibleItems[currentIndex];
    if (item) {
      const src = item.getAttribute('data-src');
      lightboxCaption.textContent = item.getAttribute('data-caption');

      if (isVideoFile(src)) {
        lightboxImg.style.display = 'none';
        lightboxVideo.style.display = 'block';
        lightboxVideo.src = src;
        lightboxVideo.load();
        lightboxVideo.play().catch(err => console.log('Video autoplay blocked: ', err));
      } else {
        lightboxVideo.style.display = 'none';
        lightboxVideo.pause();
        lightboxVideo.src = '';
        lightboxImg.style.display = 'block';
        lightboxImg.src = src;
      }
    }
  }

  function updateVisibleItems() {
    visibleItems = items.filter(item => !item.classList.contains('hidden'));
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxVideo.style.display = 'none';
    lightboxVideo.pause();
    lightboxVideo.src = '';
  }

  // Handle Tab Filtering
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filterValue = tab.getAttribute('data-filter');

      items.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
      updateVisibleItems();
    });
  });

  // Open Lightbox on card click
  items.forEach(item => {
    item.addEventListener('click', () => {
      updateVisibleItems();
      const index = visibleItems.indexOf(item);
      if (index !== -1) {
        lightbox.classList.add('active');
        showImage(index);
        document.body.style.overflow = 'hidden'; // Lock scrolling
      }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    updateVisibleItems();
    if (visibleItems.length > 0) {
      currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
      showImage(currentIndex);
    }
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    updateVisibleItems();
    if (visibleItems.length > 0) {
      currentIndex = (currentIndex + 1) % visibleItems.length;
      showImage(currentIndex);
    }
  });

  // Prevent closing when clicking content
  lightboxImg.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  lightboxVideo.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Click background to close
  lightbox.addEventListener('click', closeLightbox);
}
// --- 5. MATCH MY OUTFIT ENGINE ---
function initOutfitMatcher() {
  const fileInput = document.getElementById('outfit-file-input');
  const previewContainer = document.getElementById('outfit-preview-container');
  const previewImg = document.getElementById('outfit-preview-img');
  const resetBtn = document.getElementById('btn-reset-outfit');
  const shareBtn = document.getElementById('btn-share-matching');
  const presetBtns = document.querySelectorAll('.preset-btn');

  if (!fileInput || !previewContainer || !previewImg || !resetBtn || !shareBtn) return;

  let hasOutfit = false;
  let selectedPreset = '';

  // Handle Preset Outfits
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const presetName = btn.getAttribute('data-preset');
      let presetImgUrl = '';
      
      switch (presetName) {
        case 'red-silk':
          presetImgUrl = 'assets/hero_bangle_1.png';
          selectedPreset = 'Red Silk Saree';
          break;
        case 'emerald-green':
          presetImgUrl = 'assets/artisan_crafting.png';
          selectedPreset = 'Emerald Green Lehenga';
          break;
        case 'mustard-yellow':
          presetImgUrl = 'assets/mehendi_collection.png';
          selectedPreset = 'Mustard Yellow Anarkali';
          break;
        case 'blush-pink':
          presetImgUrl = 'assets/hero_bangle_2.png';
          selectedPreset = 'Blush Pink Saree';
          break;
      }
      
      previewImg.src = presetImgUrl;
      previewContainer.style.display = 'block';
      hasOutfit = true;
    });
  });

  // Handle file upload
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      previewImg.src = event.target.result;
      previewContainer.style.display = 'block';
      hasOutfit = true;
      selectedPreset = ''; // custom upload
    };
    reader.readAsDataURL(file);
  });

  resetBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.value = '';
    previewContainer.style.display = 'none';
    previewImg.src = '';
    hasOutfit = false;
    selectedPreset = '';
  });

  // Share matching request on WhatsApp
  shareBtn.addEventListener('click', () => {
    let msg = `Hi M&B Thread Bangles! I'd like to get matching accessories for my outfit.`;
    if (hasOutfit) {
      if (selectedPreset) {
        msg += ` I selected the preset outfit: "${selectedPreset}".`;
      } else {
        msg += ` I have an outfit photo ready to send you!`;
      }
    } else {
      msg += ` I want to send you my outfit photo to design matching bangles and accessories.`;
    }
    msg += ` Let's discuss details and customization on WhatsApp.`;
    
    const url = `https://wa.me/917569483440?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  });
}

// --- 6. BANGLE CUSTOMIZATION STUDIO ---
function initBangleCustomizer() {
  const canvas = document.getElementById('bangle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  // Customizer state
  let currentThreadColor = '#4A0E17';
  let currentThreadName = 'Deep Maroon';
  let currentStyle = 'kundan';
  let currentPearls = 'yes';
  let currentSize = '2.6';
  let customName = '';

  // DOM Elements
  const threadColorPicker = document.getElementById('thread-colors-picker');
  const stoneStylePicker = document.getElementById('stone-styles-picker');
  const pearlTogglePicker = document.getElementById('pearl-toggle-picker');
  const sizePicker = document.getElementById('bangle-size-picker');
  const nameInput = document.getElementById('customizer-name-input');
  
  const labelThread = document.getElementById('label-thread-color');
  const labelStone = document.getElementById('label-stone-style');
  const labelPearl = document.getElementById('label-pearl-toggle');
  const labelSize = document.getElementById('label-bangle-size');
  
  const previewTitle = document.getElementById('custom-preview-title');
  const previewDesc = document.getElementById('custom-preview-desc');
  const submitBtn = document.getElementById('btn-submit-design');

  // Draw initial bangle
  drawBangle();

  // Thread Color Change
  threadColorPicker.addEventListener('click', (e) => {
    const option = e.target.closest('.color-option');
    if (!option) return;
    
    threadColorPicker.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
    option.classList.add('active');
    
    currentThreadColor = option.getAttribute('data-color');
    currentThreadName = option.getAttribute('data-name');
    labelThread.textContent = currentThreadName;
    
    updatePreviewLabels();
    drawBangle();
  });

  // Embellishment Style Change
  stoneStylePicker.addEventListener('click', (e) => {
    const option = e.target.closest('.style-option');
    if (!option) return;
    
    stoneStylePicker.querySelectorAll('.style-option').forEach(o => o.classList.remove('active'));
    option.classList.add('active');
    
    currentStyle = option.getAttribute('data-style');
    labelStone.textContent = option.textContent;
    
    updatePreviewLabels();
    drawBangle();
  });

  // Pearl Toggle Change
  pearlTogglePicker.addEventListener('click', (e) => {
    const option = e.target.closest('.style-option');
    if (!option) return;
    
    pearlTogglePicker.querySelectorAll('.style-option').forEach(o => o.classList.remove('active'));
    option.classList.add('active');
    
    currentPearls = option.getAttribute('data-pearl');
    labelPearl.textContent = currentPearls === 'yes' ? 'Active' : 'Inactive';
    
    updatePreviewLabels();
    drawBangle();
  });

  // Size Selector Change
  sizePicker.addEventListener('click', (e) => {
    const option = e.target.closest('.size-option');
    if (!option) return;
    
    sizePicker.querySelectorAll('.size-option').forEach(o => o.classList.remove('active'));
    option.classList.add('active');
    
    currentSize = option.getAttribute('data-size');
    labelSize.textContent = currentSize;
    
    updatePreviewLabels();
  });

  // Name input change
  nameInput.addEventListener('input', (e) => {
    customName = e.target.value;
    updatePreviewLabels();
    drawBangle();
  });

  function updatePreviewLabels() {
    const pearlText = currentPearls === 'yes' ? 'Pearl Borders' : 'Plain Borders';
    let styleText = 'Kundan Embellishments';
    if (currentStyle === 'mirror') styleText = 'Mirror Work';
    if (currentStyle === 'pearl-only') styleText = 'Classic Beads';
    
    previewTitle.textContent = customName ? `Bangle: "${customName}"` : "Bespoke Thread Bangle";
    previewDesc.textContent = `${currentThreadName} • ${styleText} • ${pearlText}`;
  }

  function drawBangle() {
    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    
    ctx.clearRect(0, 0, width, height);

    // 1. Draw soft drop shadow for the bangle
    ctx.beginPath();
    ctx.arc(cx, cy, 185, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(74, 14, 23, 0.06)';
    ctx.filter = 'blur(10px)';
    ctx.fill();
    ctx.filter = 'none';

    // 2. Draw Silk Thread Base (Inner Ring Filling)
    const R_out = 180;
    const R_in = 135;
    const R_mid = (R_out + R_in) / 2;
    const thickness = R_out - R_in;

    ctx.beginPath();
    ctx.arc(cx, cy, R_mid, 0, Math.PI * 2);
    ctx.lineWidth = thickness;
    
    // Gradient to make silk thread look cylindrical and glossy
    const grad = ctx.createRadialGradient(cx, cy, R_in - 5, cx, cy, R_out + 5);
    grad.addColorStop(0, adjustColorBrightness(currentThreadColor, -25)); // Inner dark shadow
    grad.addColorStop(0.2, currentThreadColor); // Core shade
    grad.addColorStop(0.5, adjustColorBrightness(currentThreadColor, 35));  // Silk thread high shine highlight
    grad.addColorStop(0.8, currentThreadColor); // Core shade
    grad.addColorStop(1, adjustColorBrightness(currentThreadColor, -35));  // Outer dark edge shadow
    
    ctx.strokeStyle = grad;
    ctx.stroke();

    // 3. Draw Gold Metallic Borders
    drawMetallicGoldRing(cx, cy, R_in + 1, 2);
    drawMetallicGoldRing(cx, cy, R_out - 1, 2);

    // 4. Draw Pearl Borders (if enabled)
    if (currentPearls === 'yes') {
      const pearlRadius = 5;
      const pearlCountOuter = 72;
      const pearlCountInner = 56;
      
      // Outer Pearl ring
      drawPearlRing(cx, cy, R_out + pearlRadius + 1, pearlRadius, pearlCountOuter);
      // Inner Pearl ring
      drawPearlRing(cx, cy, R_in - pearlRadius - 1, pearlRadius, pearlCountInner);
    }

    // 5. Draw Embellishment details (stones/mirror/beads)
    const count = 18;
    for (let i = 0; i < count; i++) {
      const angle = (i * Math.PI * 2) / count;
      const x = cx + Math.cos(angle) * R_mid;
      const y = cy + Math.sin(angle) * R_mid;

      if (currentStyle === 'kundan') {
        // Draw Gold Kundan Square Frame
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        ctx.beginPath();
        ctx.rect(-10, -10, 20, 20);
        const goldGrad = ctx.createLinearGradient(-10, -10, 10, 10);
        goldGrad.addColorStop(0, '#917235');
        goldGrad.addColorStop(0.5, '#E5C184');
        goldGrad.addColorStop(1, '#917235');
        ctx.fillStyle = goldGrad;
        ctx.fill();
        ctx.strokeStyle = '#C5A059';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Inner Glassy Crystal Stone
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        const crystalGrad = ctx.createRadialGradient(-2, -2, 1, 0, 0, 6);
        crystalGrad.addColorStop(0, '#FFFFFF');
        crystalGrad.addColorStop(0.3, '#E6F3F7');
        crystalGrad.addColorStop(1, '#B0CCD4');
        ctx.fillStyle = crystalGrad;
        ctx.fill();
        
        ctx.restore();
      } 
      
      else if (currentStyle === 'mirror') {
        // Draw round mirror frame
        ctx.beginPath();
        ctx.arc(x, y, 11, 0, Math.PI * 2);
        const goldFrame = ctx.createRadialGradient(x, y, 8, x, y, 11);
        goldFrame.addColorStop(0, '#E5C184');
        goldFrame.addColorStop(1, '#917235');
        ctx.strokeStyle = goldFrame;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Shiny Silver Mirror center
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        const mirrorGrad = ctx.createLinearGradient(x - 8, y - 8, x + 8, y + 8);
        mirrorGrad.addColorStop(0, '#FFFFFF');
        mirrorGrad.addColorStop(0.5, '#D0D0D0');
        mirrorGrad.addColorStop(1, '#7C7C7C');
        ctx.fillStyle = mirrorGrad;
        ctx.fill();
      } 
      
      else if (currentStyle === 'pearl-only') {
        // Draw simple elegant gold beads
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        const beadGrad = ctx.createRadialGradient(x - 3, y - 3, 1, x, y, 8);
        beadGrad.addColorStop(0, '#FFF3C2');
        beadGrad.addColorStop(0.5, '#D4AF37');
        beadGrad.addColorStop(1, '#8C6C1B');
        ctx.fillStyle = beadGrad;
        ctx.fill();
      }
    }

    // 6. Draw custom couples' name inside the bangle loop
    if (customName) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Draw golden text badge background
      ctx.beginPath();
      ctx.arc(cx, cy, 95, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(253, 251, 247, 0.95)';
      ctx.strokeStyle = 'rgba(197, 160, 89, 0.3)';
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();

      // Gold border accent
      ctx.beginPath();
      ctx.arc(cx, cy, 88, 0, Math.PI * 2);
      ctx.strokeStyle = '#C5A059';
      ctx.stroke();

      // Name Text
      ctx.font = "italic 400 20px 'Cinzel', serif";
      ctx.fillStyle = '#4A0E17';
      ctx.fillText(customName, cx, cy);
      
      // Small decoration
      ctx.font = "12px 'Cinzel', serif";
      ctx.fillStyle = '#C5A059';
      ctx.fillText("♦ MADE FOR YOU ♦", cx, cy + 30);
    }
  }

  function drawMetallicGoldRing(cx, cy, radius, width) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.lineWidth = width;
    const goldGrad = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
    goldGrad.addColorStop(0, '#917235');
    goldGrad.addColorStop(0.3, '#E5C184');
    goldGrad.addColorStop(0.5, '#C5A059');
    goldGrad.addColorStop(0.7, '#E5C184');
    goldGrad.addColorStop(1, '#917235');
    ctx.strokeStyle = goldGrad;
    ctx.stroke();
  }

  function drawPearlRing(cx, cy, radius, pearlR, count) {
    for (let i = 0; i < count; i++) {
      const angle = (i * Math.PI * 2) / count;
      const px = cx + Math.cos(angle) * radius;
      const py = cy + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.arc(px, py, pearlR, 0, Math.PI * 2);
      
      // Radial shading for pearl luster
      const pearlGrad = ctx.createRadialGradient(px - pearlR/3, py - pearlR/3, pearlR/6, px, py, pearlR);
      pearlGrad.addColorStop(0, '#FFFFFF'); // Pearl highlight
      pearlGrad.addColorStop(0.3, '#FFFBF0'); // Soft warm white
      pearlGrad.addColorStop(0.8, '#EADEC9'); // Shaded shadow
      pearlGrad.addColorStop(1, '#C2B59D'); // Deep border shadow
      
      ctx.fillStyle = pearlGrad;
      ctx.fill();
    }
  }

  // Adjust hexadecimal color brightness programmatically
  function adjustColorBrightness(hex, percent) {
    let R = parseInt(hex.substring(1,3),16);
    let G = parseInt(hex.substring(3,5),16);
    let B = parseInt(hex.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255; R = (R>0)?R:0;
    G = (G<255)?G:255; G = (G>0)?G:0;
    B = (B<255)?B:255; B = (B>0)?B:0;

    const rHex = Math.round(R).toString(16).padStart(2,'0');
    const gHex = Math.round(G).toString(16).padStart(2,'0');
    const bHex = Math.round(B).toString(16).padStart(2,'0');

    return `#${rHex}${gHex}${bHex}`;
  }

  // Submit customization details to WhatsApp
  submitBtn.addEventListener('click', () => {
    const pearlChoice = currentPearls === 'yes' ? 'Yes' : 'No';
    let styleText = 'Kundan Stones';
    if (currentStyle === 'mirror') styleText = 'Mirror Work';
    if (currentStyle === 'pearl-only') styleText = 'Classic Beads';
    
    let message = `Hi M&B Thread Bangles! I just designed a custom bangle on your showroom studio and would like to order:
- Base Thread: ${currentThreadName} (${currentThreadColor})
- Stone Style: ${styleText}
- Pearl Borders: ${pearlChoice}
- Bangle Size: ${currentSize}`;

    if (customName) {
      message += `\n- Custom Studded Name: "${customName}"`;
    }

    message += `\nCan you please share pricing and order processing time for this design? Thank you!`;
    
    const url = `https://wa.me/917569483440?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  });
}

// --- 7. SCROLL REVEAL ANIMATIONS ---
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  function revealOnScroll() {
    const triggerBottom = window.innerHeight * 0.85;

    revealElements.forEach(el => {
      const elTop = el.getBoundingClientRect().top;

      if (elTop < triggerBottom) {
        el.classList.add('active');
      }
    });
  }

  // Initial trigger
  revealOnScroll();
  
  window.addEventListener('scroll', revealOnScroll);
}

