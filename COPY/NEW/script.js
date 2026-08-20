
/* ── 1. NAVBAR SCROLL SHRINK ── */
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
})();


/* ── 2. HAMBURGER / MOBILE MENU ── */
(function () {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close when clicking outside the menu
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', false);
    }
  });
})();

/* Global helper used by inline onclick="closeMenu()" in the HTML */
function closeMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  const hamburger  = document.getElementById('hamburger');
  if (mobileMenu) mobileMenu.classList.remove('open');
  if (hamburger)  hamburger.classList.remove('active');
}


/* ── 3. IMAGE SLIDESHOWS ── */
/**
 * Generic slideshow factory.
 * @param {string} slideClass   – class name on each slide element
 * @param {string} dotClass     – class name on each indicator dot
 * @param {number} interval     – ms between slides
 */
function createSlideshow(slideClass, dotClass, interval) {
  const slides = document.querySelectorAll('.' + slideClass);
  const dots   = document.querySelectorAll('.' + dotClass);
  if (!slides.length) return;

  let current = 0;

  function goTo(index) {
    slides[current].style.opacity = '0';
    if (dots[current]) dots[current].style.background = 'rgba(255,255,255,.35)';

    current = (index + slides.length) % slides.length;

    slides[current].style.opacity = '1';
    if (dots[current]) dots[current].style.background = 'rgba(255,255,255,.9)';
  }

  // Make dots clickable
  dots.forEach((dot, i) => {
    dot.style.cursor = 'pointer';
    dot.addEventListener('click', () => goTo(i));
  });

  setInterval(() => goTo(current + 1), interval);
}

// Venue slideshow — offset start so all three don't change at the same time
setTimeout(() => createSlideshow('venue-slide',  'venue-dot',  4000), 0);
setTimeout(() => createSlideshow('bridal-slide', 'bridal-dot', 4000), 1333);
setTimeout(() => createSlideshow('floral-slide', 'floral-dot', 4000), 2666);
setTimeout(() => createSlideshow('photographer', 'photographer', 4000), 5332);



/* ── 4. SCROLL-REVEAL FADE-IN ANIMATIONS ── */
(function () {
  const fadeEls = document.querySelectorAll('.fade');
  if (!fadeEls.length) return;

  // Initial state is set via CSS: opacity:0, transform:translateY(24px)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeEls.forEach(el => observer.observe(el));
})();


/* ── 5. CHAT WIDGET ── */
(function () {
  // Bot reply pool – keeps the demo feeling alive
  const botReplies = [
    "Great choice! 🌸 I'm searching our verified vendor database for the best matches in your budget. One moment…",
    "I found some wonderful options for you! Would you like to see venues, photographers, or caterers first?",
    "Based on your preferences, I'd recommend allocating roughly 40% to the venue, 20% to catering, and the rest across décor, photography, and music. Shall I draft a full budget plan?",
    "Absolutely! I can schedule a free video consultation with any of these vendors — just let me know which one caught your eye. 😊",
    "Your dream wedding is just a few clicks away. I'm here 24 × 7 whenever you need guidance! 🙏",
  ];
  let replyIndex = 0;

  function appendMessage(text, type /* 'bot' | 'user' */) {
    const body   = document.querySelector('.chat-body');
    if (!body) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'msg ' + type;

    const avatar  = document.createElement('div');
    avatar.className = 'msg-av ' + (type === 'bot' ? 'bot-av' : 'user-av');
    avatar.textContent = type === 'bot' ? '✦' : 'U';

    const bubble  = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.textContent = text;

    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    body.appendChild(wrapper);
    body.scrollTop = body.scrollHeight;
  }

  function showTypingIndicator() {
    const body = document.querySelector('.chat-body');
    if (!body) return null;

    const wrapper = document.createElement('div');
    wrapper.className = 'msg bot typing-indicator-wrapper';
    wrapper.id = 'typing-indicator';

    const avatar = document.createElement('div');
    avatar.className = 'msg-av bot-av';
    avatar.textContent = '✦';

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble typing-bubble';
    bubble.innerHTML = '<span></span><span></span><span></span>';

    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    body.appendChild(wrapper);
    body.scrollTop = body.scrollHeight;
    return wrapper;
  }

  window.sendMsg = function () {
    const input = document.querySelector('.chat-inp');
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    input.value = '';

    // Show typing indicator then reply after a short delay
    const indicator = showTypingIndicator();
    setTimeout(() => {
      if (indicator) indicator.remove();
      const reply = botReplies[replyIndex % botReplies.length];
      replyIndex++;
      appendMessage(reply, 'bot');
    }, 1200);
  };

  // Send on Enter key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const input = document.querySelector('.chat-inp');
      if (document.activeElement === input) {
        window.sendMsg();
      }
    }
  });
})();


/* ── 6. MEET AI OVERLAY ── */
window.openMeetAI = function () {
  const overlay = document.getElementById('meet-ai-overlay');
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden'; // prevent background scroll
};

window.closeMeetAI = function () {
  const overlay = document.getElementById('meet-ai-overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
};

// Close overlay on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') window.closeMeetAI();
});


/* ── 7. SMOOTH SCROLL FOR ANCHOR LINKS ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ── 8. CHIP ACTIVE-STATE TOGGLE (already inline, but centralised here) ── */
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', function () {
    this.classList.toggle('active');
  });
});

                     /*SMART BUDGET PLANS*/

/* ── FILTER TABS ── */
function setFilter(btn){
  document.querySelectorAll('.filter-tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
}

/* ── BUDGET SLIDER ── */
function updateSBudget(v){
  const n=Number(v);
  const f=n>=100000?'₹'+Math.round(n/100000).toLocaleString('en-IN')+',00,000':'₹'+n.toLocaleString('en-IN');
  const el=document.getElementById('sb-val');
  if(el) el.innerHTML=f+' <em>estimated</em>';
}

/* ── PAGINATION ── */
document.querySelectorAll('.pg-btn:not(.pg-btn--next)').forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll('.pg-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  };
});

/* ── FADE IN ── */
const obs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);}
  });
},{threshold:0.08});
document.querySelectorAll('.fade').forEach(el=>obs.observe(el));

/* ── FEATURES OVERLAY ── */
function opensmartPage(){
  const el=document.getElementById('smart-overlay');
  el.style.display='block';
  document.body.style.overflow='hidden';
  el.scrollTop=0;
}
function closesmartPage(){
  document.getElementById('smart-overlay').style.display='none';
  document.body.style.overflow='';
}
document.addEventListener('keydown',function(e){
  if(e.key==='Escape') closesmartPage();
});


/* ---VENDORS SECTION --- */

  function openVendors() {
    const overlay = document.getElementById('features-overlay');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    /* re-trigger entry animation */
    overlay.style.animation = 'none';
    overlay.offsetHeight; // reflow
    overlay.style.animation = 'foFadeIn 0.4s ease';
  }
 
  function closeVendors() {
    const overlay = document.getElementById('features-overlay');
    overlay.style.animation = 'foFadeOut 0.3s ease forwards';
    setTimeout(() => {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }, 280);
  }
 
  /* Close on Escape key */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVendors();
  });


  /* ─── CALENDAR ─── */
let calYear = 2025, calMonth = 11;
const calMonths = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const bookedDays = [5, 12, 14, 20, 25, 28];
const fullDays   = [7, 8, 18, 19, 21];
let selectedDay  = 14;
 
function renderCal() {
  document.getElementById('cal-month-label').textContent = calMonths[calMonth] + ' ' + calYear;
  const grid = document.getElementById('cal-grid');
  grid.querySelectorAll('.cal-day').forEach(d => d.remove());
 
  const first = new Date(calYear, calMonth, 1).getDay();
  const total = new Date(calYear, calMonth + 1, 0).getDate();
 
  for (let i = 0; i < first; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day empty';
    grid.appendChild(el);
  }
  for (let d = 1; d <= total; d++) {
    const el = document.createElement('div');
    let cls = 'cal-day';
    if (d === selectedDay)      cls += ' selected';
    else if (fullDays.includes(d))   cls += ' full';
    else if (bookedDays.includes(d)) cls += ' booked';
    el.className = cls;
    el.textContent = d;
    el.onclick = () => {
      if (fullDays.includes(d)) return;
      selectedDay = d;
      renderCal();
    };
    grid.appendChild(el);
  }
}
 
function changeMonth(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0)  { calMonth = 11; calYear--; }
  renderCal();
}
 
renderCal();
 
/* ─── TIME SLOTS ─── */
document.querySelectorAll('.time-slot:not(.busy)').forEach(slot => {
  slot.onclick = () => {
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('sel'));
    slot.classList.add('sel');
  };
});
 
/* ─── BOOKING OPTIONS PAGE ─── */
function openBookingPage() {
  const overlay = document.getElementById('booking-page-overlay');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
 
function closeBookingPage(e, force) {
  if (force || (e && e.target === document.getElementById('booking-page-overlay'))) {
    document.getElementById('booking-page-overlay').classList.remove('open');
    document.body.style.overflow = '';
  }
}
 
function selectBooking(card, type) {
  document.querySelectorAll('.bp-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  setTimeout(() => {
    alert('✦ ' + type + '\n\nProceed to booking — 30% advance secures your slot instantly.\n\nRedirecting to booking form…');
  }, 150);
}
 
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeBookingPage(null, true);
});




/* ── VENDOR DATA ── */
const vendorCategories = [
  {
    id: 'makeup', name: 'Makeup Artists', count: '800+',
    bg: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=700&q=80',
    heroBg: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1400&q=80',
    artists: [
      { name:'Pooja Munjal',       city:'Mumbai',              exp:'14 yrs', badge:"Editor's Pick", stars:'★★★★★', bio:'Celebrity bridal makeup artist known for flawless airbrush techniques and her signature dewy-glam look. Has worked with top Bollywood brides.',           img:'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500&q=80' },
      { name:'Shweta Gaur',        city:'Delhi',               exp:'12 yrs', badge:'Top Rated',     stars:'★★★★★', bio:'Award-winning MUA specializing in South Asian bridal looks, airbrush contouring, and HD makeup for photography-ready skin.',                        img:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80' },
      { name:'Namrata Soni',       city:'Mumbai · Jaipur',     exp:'18 yrs', badge:'Celebrity',     stars:'★★★★★', bio:"Bollywood's go-to makeup artist. Known for transforming brides into ethereal visions using luxury product lines exclusively.",                   img:'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80' },
      { name:'Anu Kaushik',        city:'Bangalore',           exp:'10 yrs', badge:'Verified',      stars:'★★★★☆', bio:'Specialist in Kannadiga and Tamil bridal looks, combining traditional gold-accented eye makeup with modern techniques.',                          img:'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80' },
      { name:'Drishti Patel',      city:'Ahmedabad',           exp:'9 yrs',  badge:'Trending',      stars:'★★★★★', bio:'Master of Gujarati bridal aesthetics—bright eyes, natural glow, and intricate eye work that photograph beautifully.',                             img:'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&q=80' },
      { name:'Meera Rajput',       city:'Jaipur',              exp:'11 yrs', badge:'Luxury',        stars:'★★★★★', bio:'Known for combining Rajasthani traditional elements with contemporary makeup artistry. Works exclusively with luxury bridal clients.',              img:'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&q=80' },
      { name:'Priya Thakur',       city:'Chennai',             exp:'8 yrs',  badge:'Verified',      stars:'★★★★☆', bio:'Expert in Tamil and Telugu bridal makeup with deep knowledge of regional traditions and preferred aesthetic palettes.',                             img:'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=500&q=80' },
      { name:'Ridhi Mehra',        city:'Delhi · Chandigarh',  exp:'15 yrs', badge:'Top Rated',     stars:'★★★★★', bio:'Punjabi bridal makeup specialist. Creates bold, vibrant looks that stay flawless through long ceremonies and dance floors.',                       img:'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=500&q=80' },
      { name:'Kavita Koushik',     city:'Hyderabad',           exp:'7 yrs',  badge:'Trending',      stars:'★★★★☆', bio:"Rising star in Hyderabad's bridal scene. Specialises in skin prep rituals and luminous, camera-ready finishes.",                                 img:'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&q=80' },
      { name:'Asmita Marwa',       city:'Pan-India',           exp:'20 yrs', badge:'Legend',        stars:'★★★★★', bio:'Pioneer of modern Indian bridal makeup. Has beautified over 5,000 brides and trained 300+ artists across the country.',                          img:'https://images.unsplash.com/photo-1464863979621-258859e62245?w=500&q=80' },
    ]
  },
  {
    id: 'planner', name: 'Wedding Planners', count: '650+',
    bg: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=700&q=80',
    heroBg: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1400&q=80',
    artists: [
      { name:'Weddingz.in',               city:'Pan-India',           exp:'12 yrs', badge:'Top Agency', stars:'★★★★★', bio:"India's largest wedding planning platform managing 10,000+ weddings annually across 50 cities. End-to-end planning with dedicated coordinators.",     img:'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&q=80' },
      { name:'Shaadi Squad',              city:'Mumbai · Goa',        exp:'9 yrs',  badge:'Luxury',     stars:'★★★★★', bio:'Boutique luxury wedding planner specializing in intimate beach and destination weddings. Known for breathtaking floral-forward aesthetics.',          img:'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80' },
      { name:'The Wedding Design Co.',    city:'Delhi',               exp:'11 yrs', badge:"Editor's Pick",stars:'★★★★★', bio:'Award-winning design-led planning studio. Creates cinematic, editorial weddings with a signature palette and storytelling.',                     img:'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80' },
      { name:'Ferns N Petals Events',     city:'Nationwide',          exp:'25 yrs', badge:'Legacy',     stars:'★★★★☆', bio:"The most recognized name in Indian wedding planning. Offers packages from intimate gatherings to grand celebrations for 5000+ guests.",             img:'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=500&q=80' },
      { name:'Bespoke Soirées',           city:'Bangalore · Hyderabad',exp:'8 yrs', badge:'Trending',   stars:'★★★★★', bio:"South India's favourite boutique planner. Combines contemporary aesthetics with regional traditions for truly unique celebrations.",                img:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80' },
      { name:'Royal Occasions',           city:'Jaipur · Udaipur',    exp:'16 yrs', badge:'Heritage',   stars:'★★★★★', bio:'Specialists in royal Rajasthan weddings. Expertise in palace venues, camel processions, folk performances, and luxury hospitality.',                img:'https://images.unsplash.com/photo-1513278974582-3e1b4a4fa21e?w=500&q=80' },
      { name:'Celebrations Unlimited',    city:'Mumbai',              exp:'14 yrs', badge:'Verified',   stars:'★★★★☆', bio:'Comprehensive event management with in-house décor, catering liaison, and photography coordination. 2,500+ successful weddings.',                  img:'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80' },
      { name:'The Big Fat Wedding',       city:'Delhi · Chandigarh',  exp:'10 yrs', badge:'Top Rated',  stars:'★★★★★', bio:'Masters of large-scale North Indian weddings. Handles logistics for 1,000–5,000 guests with military precision and creative flair.',               img:'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=500&q=80' },
      { name:'Dreamz Unlimited',          city:'Chennai · Kochi',     exp:'13 yrs', badge:'Verified',   stars:'★★★★☆', bio:'South-Indian wedding specialists with deep expertise in Tamil, Telugu, Malayalam, and Kannada ceremonies and customs.',                            img:'https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=500&q=80' },
      { name:'Starry Nights Events',      city:'Goa · Mumbai',        exp:'7 yrs',  badge:'Boutique',   stars:'★★★★★', bio:'Creating romantic destination weddings in Goa and the Konkan coast. Sunset ceremonies, beachside receptions, and midnight stargazing dinners.',    img:'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&q=80' },
    ]
  },
  {
    id: 'decorators', name: 'Decorators', count: '1,100+',
    bg: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=700&q=80',
    heroBg: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1400&q=80',
    artists: [
      { name:'Sabyasachi Décor',     city:'Kolkata · Delhi',  exp:'22 yrs', badge:'Legend',       stars:'★★★★★', bio:'Iconic luxury decorator known for maximalist Indian aesthetics—marigold walls, hand-painted backdrops, antique brass vessels.',                    img:'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=500&q=80' },
      { name:'Krasnova Décor',       city:'Mumbai',           exp:'10 yrs', badge:'Top Rated',    stars:'★★★★★', bio:'International-style decorator blending European elegance with Indian florals. Creates whimsical garden-party aesthetics for modern couples.',        img:'https://images.unsplash.com/photo-1501973801540-537f08ccae7b?w=500&q=80' },
      { name:'Rishi Patel Designs',  city:'Ahmedabad · Surat',exp:'14 yrs', badge:"Editor's Pick",stars:'★★★★★', bio:'Specialist in Gujarati traditional decor—LED-lit mandaps, Patola-inspired patterns, and vibrant colour palettes for festive gatherings.',          img:'https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?w=500&q=80' },
      { name:'Petal & Lace',         city:'Bangalore',        exp:'8 yrs',  badge:'Trending',     stars:'★★★★☆', bio:'Minimalist luxury decorator. Creates clean, editorial spaces with soft whites, blush pinks, and sculptural floral installations.',                 img:'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500&q=80' },
      { name:'Mughal Garden Décor',  city:'Delhi · Agra',     exp:'18 yrs', badge:'Heritage',     stars:'★★★★★', bio:'Recreates Mughal architectural splendour—arched jaalis, rose petal pathways, diyas, and rich jewel tones for Mughal-inspired weddings.',          img:'https://images.unsplash.com/photo-1509927083803-4bd519298ac4?w=500&q=80' },
      { name:'Bloom & Co.',          city:'Hyderabad',        exp:'9 yrs',  badge:'Verified',     stars:'★★★★☆', bio:'South Indian wedding decoration specialists known for jasmine garlands, turmeric installations, and dramatic banana leaf tablescapes.',            img:'https://images.unsplash.com/photo-1503789146722-cf137a3c0fea?w=500&q=80' },
      { name:'Grand Illusions Events',city:'Pan-India',       exp:'15 yrs', badge:'Luxury',       stars:'★★★★★', bio:'Creates breathtaking transformation of any space—ballrooms, lawns, and rooftops turned into fantasy worlds with elaborate theming.',                img:'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=500&q=80' },
      { name:'Threads & Blooms',     city:'Jaipur',           exp:'11 yrs', badge:'Verified',     stars:'★★★★★', bio:'Handcrafted décor using hand-block printed fabrics, marigold strings, and traditional Rajasthani motifs woven into contemporary setups.',         img:'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&q=80' },
      { name:'Luxe Tablescape',      city:'Mumbai · Pune',    exp:'7 yrs',  badge:'Boutique',     stars:'★★★★☆', bio:'Micro-event luxury specialists. Intimate sangeets, engagement parties, and bridal showers elevated with couture table styling.',                    img:'https://images.unsplash.com/photo-1478145787956-f9def6e1c7a0?w=500&q=80' },
      { name:'Anita Malik Décor',    city:'Chandigarh · Delhi',exp:'16 yrs',badge:'Top Rated',    stars:'★★★★★', bio:"Punjab's premier wedding decorator. Known for creating lush phulkari-inspired mandaps and grand dhol-and-diya ceremonial entrances.",              img:'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80' },
    ]
  },
  {
    id: 'caterers', name: 'Caterers', count: '900+',
    bg: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=700&q=80',
    heroBg: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=80',
    artists: [
      { name:'The Royal Kitchen',      city:'Pan-India',         exp:'20 yrs', badge:'Top Rated', stars:'★★★★★', bio:"India's most awarded wedding caterer. Multi-cuisine live stations, authentic regional thalis, and Michelin-trained executive chefs.",                  img:'https://images.unsplash.com/photo-1555244162-803834f70033?w=500&q=80' },
      { name:'Panchvati Caterers',     city:'Ahmedabad',         exp:'35 yrs', badge:'Legacy',    stars:'★★★★★', bio:'Three generations of catering excellence. Unmatched Gujarati thali experience with over 40 dishes served in traditional silver platters.',             img:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80' },
      { name:'Cuisine On Wheels',      city:'Mumbai · Pune',     exp:'12 yrs', badge:'Trending',  stars:'★★★★☆', bio:'Pioneering experiential dining at weddings—molecular gastronomy stations, street food trails, and interactive dessert counters.',                       img:'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&q=80' },
      { name:'Saffron Bite',           city:'Delhi · NCR',       exp:'16 yrs', badge:"Editor's Pick",stars:'★★★★★', bio:"North Indian cuisine specialists serving rich Mughlai, Lucknawi, and Punjabi fare. Known for their legendary dahi kebab and biryani.",           img:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80' },
      { name:'South Spice Caterers',   city:'Chennai · Bangalore',exp:'18 yrs',badge:'Verified',  stars:'★★★★★', bio:'Authentic South Indian wedding feast—banana leaf meals, filter coffee stations, chettinad curries, and traditional payasam desserts.',                img:'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=80' },
      { name:'Continental Affair',     city:'Mumbai',            exp:'9 yrs',  badge:'Luxury',    stars:'★★★★★', bio:'Specialists in fusion and continental wedding menus. Creates custom tasting menus for international couples and destination weddings.',                  img:'https://images.unsplash.com/photo-1546039907-7fa05f864c02?w=500&q=80' },
      { name:"Mithaiwala Sweets",      city:'Nationwide',        exp:'40 yrs', badge:'Legend',    stars:'★★★★★', bio:'The gold standard in Indian wedding sweets. From ornate ladoo towers to custom mithai boxes, an essential part of every Indian celebration.',          img:'https://images.unsplash.com/photo-1590080874088-eec64895b423?w=500&q=80' },
      { name:"Nawab's Kitchen",        city:'Hyderabad · Lucknow',exp:'22 yrs',badge:'Heritage',  stars:'★★★★★', bio:'Authentic dum biryani, haleem, and shahi tukda served in traditional copper vessels by khansamas trained in royal Nawabi kitchens.',               img:'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&q=80' },
      { name:'The Dessert Table',      city:'Bangalore · Goa',   exp:'7 yrs',  badge:'Boutique',  stars:'★★★★☆', bio:'Artisan wedding dessert specialists—custom cakes, macaron towers, gulab jamun cheesecake, and edible flower installations.',                          img:'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80' },
      { name:'Fusion Fire Caterers',   city:'Kolkata',           exp:'13 yrs', badge:'Verified',  stars:'★★★★☆', bio:'Bengali wedding feast experts. Authentic shorshe ilish, mishti doi, kosha mangsho, and elaborate 8-course traditional wedding menus.',               img:'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500&q=80' },
    ]
  },
  {
    id: 'jewellery', name: 'Jewellery', count: '500+',
    bg: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=700&q=80',
    heroBg: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=1400&q=80',
    artists: [
      { name:'House of Kundan',      city:'Jaipur · Mumbai', exp:'50 yrs', badge:'Legacy',    stars:'★★★★★', bio:'Seventh-generation Kundan and Polki jewellers. Every piece handcrafted by master karigars in Jaipur using techniques centuries old.',                 img:'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80' },
      { name:'Tanishq Bridal',       city:'Pan-India',       exp:'30 yrs', badge:'Top Brand', stars:'★★★★★', bio:"India's most trusted jewellery brand. Exclusive bridal collections featuring diamond-encrusted sets, temple jewellery, and modern fusion designs.",  img:'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=500&q=80' },
      { name:'Saraf Jewels',         city:'Kolkata · Delhi', exp:'45 yrs', badge:'Heritage',  stars:'★★★★★', bio:'Specialists in pure 22-karat gold Bengali bridal jewellery. Shankha-pola, loha, and traditional ceremonial sets crafted with precision.',            img:'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&q=80' },
      { name:'Diamond Avenue',       city:'Surat · Mumbai',  exp:'20 yrs', badge:'Certified', stars:'★★★★★', bio:'GIA-certified diamond bridal jewellery house. Custom engagement rings, cocktail sets, and full bridal parures with conflict-free stones.',            img:'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=500&q=80' },
      { name:'Pothys Jewellery',     city:'Chennai',         exp:'80 yrs', badge:'Legend',    stars:'★★★★★', bio:"South India's premier gold jewellery house. Temple jewellery, kemp-stone sets, and Kanjivaram-inspired bridal collections.",                       img:'https://images.unsplash.com/photo-1576022162027-01ef2f9feaa6?w=500&q=80' },
      { name:'Mehrasons Jewellers',  city:'Delhi',           exp:'70 yrs', badge:'Heritage',  stars:'★★★★★', bio:"Delhi's iconic jeweller since 1900. Kundan meenakari sets, Mughal-inspired chokers, and traditional north Indian bridal jewellery.",               img:'https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=500&q=80' },
      { name:'Tribhovandas Jewels',  city:'Mumbai',          exp:'100 yrs',badge:'Century',   stars:'★★★★★', bio:"Mumbai's oldest jewellery house. Marwari and Gujarati bridal sets with intricate enameling and heritage stone-setting craft.",                      img:'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500&q=80' },
      { name:'VBJ Jewellery',        city:'Chennai · Bangalore',exp:'60 yrs',badge:'Top Rated',stars:'★★★★★', bio:'Award-winning jeweller known for innovative temple jewellery designs fusing classical motifs with contemporary wearability.',                     img:'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80' },
      { name:'Orra Jewels',          city:'Pan-India',       exp:'25 yrs', badge:'Modern',    stars:'★★★★☆', bio:'Contemporary bridal jewellery for the modern Indian bride—lightweight gold, lab-grown diamonds, and minimalist statement pieces.',                  img:'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80' },
      { name:'Amrapali Jewels',      city:'Jaipur',          exp:'40 yrs', badge:'Artisan',   stars:'★★★★★', bio:'International award-winning jewellery house. Tribal silver, antique gold, and art jewellery for the discerning collector bride.',                  img:'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=500&q=80' },
    ]
  },
  {
    id: 'bridal', name: 'Bridal Designers', count: '450+',
    bg: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=700&q=80',
    heroBg: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1400&q=80',
    artists: [
      { name:'Sabyasachi Mukherjee', city:'Kolkata · Mumbai', exp:'25 yrs', badge:'Icon',         stars:'★★★★★', bio:"India's most celebrated bridal couturier. Hand-embroidered heritage textiles, Bengal handloom, and jewel-toned lehengas beloved by celebrities worldwide.", img:'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&q=80' },
      { name:'Manish Malhotra',      city:'Mumbai',           exp:'30 yrs', badge:'Legend',        stars:'★★★★★', bio:"Bollywood's most iconic designer. Signature sequin-heavy lehengas, fluid silhouettes, and modern bridal couture that photographs like a dream.",         img:'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&q=80' },
      { name:'Tarun Tahiliani',      city:'Delhi · Mumbai',   exp:'28 yrs', badge:'Top Couturier', stars:'★★★★★', bio:'Master of draping and luxe fabrics. Specialises in modern lehengas with antique zari work, layered nets, and dramatic trains.',                       img:'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80' },
      { name:'Meera Atelier',        city:'Delhi',            exp:'12 yrs', badge:'Bespoke',       stars:'★★★★★', bio:'Boutique bridal design studio. Each lehenga takes 6 months, hand-embroidered by 30+ artisans. Ultimate personalisation for the discerning bride.',      img:'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500&q=80' },
      { name:'Anita Dongre',         city:'Mumbai',           exp:'22 yrs', badge:'Sustainable',   stars:'★★★★★', bio:'Ethical luxury fashion house. Traditional Rajasthani block prints, organic fabrics, and handloom textiles for eco-conscious brides.',                  img:'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80' },
      { name:'House of Pataudi',     city:'Delhi',            exp:'15 yrs', badge:'Heritage',      stars:'★★★★★', bio:'Royal heritage-inspired bridal wear drawing from the archives of Nawabi and Mughal court dress. Every piece a work of historical art.',                img:'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80' },
      { name:'Ritu Kumar',           city:'Delhi',            exp:'50 yrs', badge:'Pioneer',       stars:'★★★★★', bio:"India's pioneer of fashion revival. Chikan embroidery, block prints, and hand-woven textiles from master artisans across India.",                     img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80' },
      { name:'Arpita Mehta',         city:'Mumbai',           exp:'10 yrs', badge:'Modern',        stars:'★★★★★', bio:"The bride's best friend. Versatile lehengas that transcend occasion—equally stunning in morning ceremonies and evening receptions.",                   img:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80' },
      { name:'Falguni Shane Peacock',city:'Mumbai',           exp:'15 yrs', badge:'Glamour',       stars:'★★★★★', bio:'Masters of embellishment. Crystal-encrusted gowns, dramatic lehengas, and Indo-western fusion for the maximalist modern bride.',                      img:'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=80' },
      { name:'Rimple & Harpreet',    city:'Delhi',            exp:'18 yrs', badge:'Artisan',       stars:'★★★★★', bio:'Zardosi maestros. Extraordinarily detailed metallic embroidery work, Persian-inspired motifs, and regal court-dress aesthetics.',                     img:'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=500&q=80' },
    ]
  },
  {
    id: 'entertainment', name: 'Entertainment', count: '700+',
    bg: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=700&q=80',
    heroBg: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&q=80',
    artists: [
      { name:'Shankar Mahadevan Live', city:'Mumbai · Pan-India', exp:'30 yrs', badge:'Star',        stars:'★★★★★', bio:'Legendary Bollywood singer performing live at weddings. Unforgettable sangeet and reception performances that leave guests speechless.',            img:'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=500&q=80' },
      { name:'Sufi Night Productions', city:'Delhi · Jaipur',     exp:'15 yrs', badge:'Soulful',     stars:'★★★★★', bio:'Mesmerising Sufi music performances for intimate baraats and post-dinner soirées. Qawwali sessions that transport guests to another world.',       img:'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=500&q=80' },
      { name:'Aakash Dance Company',   city:'Mumbai',              exp:'18 yrs', badge:'Top Rated',  stars:'★★★★★', bio:'Professional Bollywood and classical dance troupe. Sangeet choreography for families, flash mob performances, and theatrical entrances.',          img:'https://images.unsplash.com/photo-1547153760-18fc86324498?w=500&q=80' },
      { name:'Firefly Performers',     city:'Rajasthan',           exp:'12 yrs', badge:'Unique',     stars:'★★★★★', bio:'Fire dancers, kalbelia folk artists, and puppeteers from Rajasthan. Authentic folk entertainment that captures the spirit of royal weddings.',     img:'https://images.unsplash.com/photo-1518176258769-f227c798150e?w=500&q=80' },
      { name:'Stand-Up Connect',       city:'Pan-India',           exp:'8 yrs',  badge:'Trending',   stars:'★★★★☆', bio:"Corporate and wedding comedy events featuring top Indian stand-up comedians. Custom scripts woven around the couple's love story.",              img:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80' },
      { name:'Dhol Masters',           city:'Pan-India',           exp:'20 yrs', badge:'Traditional',stars:'★★★★★', bio:'Professional dhol players for baraat processions, sangeet nights, and festival celebrations. Pumping rhythms that get every guest dancing.',      img:'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&q=80' },
      { name:'Acrobatic India',        city:'Mumbai · Delhi',      exp:'25 yrs', badge:'Spectacular',stars:'★★★★★', bio:'Acrobats, aerial artists, and contortionists performing customised wedding entertainment acts. Grand theatre meets Indian wedding magic.',          img:'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80' },
      { name:'Magic Mehfil',           city:'Bangalore',           exp:'10 yrs', badge:'Verified',   stars:'★★★★☆', bio:'Professional magicians and illusionists specialising in wedding entertainment—mind-reading acts, levitation, and audience participation shows.', img:'https://images.unsplash.com/photo-1468234560759-2fb468d3e97f?w=500&q=80' },
      { name:'The Puppet House',       city:'Jaipur',              exp:'30 yrs', badge:'Heritage',   stars:'★★★★★', bio:"Kathputli puppet shows narrating the couple's love story in traditional Rajasthani style. Perfect for mehendi and sangeet evenings.",             img:'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&q=80' },
      { name:'Bollywood Nights Live',  city:'Mumbai',              exp:'14 yrs', badge:'Popular',    stars:'★★★★★', bio:'Live Bollywood music band performing across all decades. Customised set lists, costume changes, and high-energy reception shows.',                 img:'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80' },
    ]
  },
  {
    id: 'gifts', name: 'Gifts', count: '350+',
    bg: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=700&q=80',
    heroBg: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1400&q=80',
    artists: [
      { name:'Chumbak Gifting',     city:'Pan-India',       exp:'12 yrs', badge:'Top Brand',   stars:'★★★★★', bio:"India's most loved gifting brand. Quirky, colourful gifts that delight wedding guests—from miniature sculptures to artisan homeware.",             img:'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80' },
      { name:'The Gift Studio',     city:'Mumbai',          exp:'9 yrs',  badge:'Luxury',      stars:'★★★★★', bio:'Bespoke luxury hamper curation. Personalised gift boxes with premium Indian artisan products, sweets, and designer packaging.',                   img:'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500&q=80' },
      { name:'Wardrobe by WedMeGood',city:'Delhi',          exp:'6 yrs',  badge:'Trending',    stars:'★★★★☆', bio:'Wedding trousseau and gifting platform. Curated luxury gifts for bridesmaids, groomsmen, parents, and wedding guests.',                          img:'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=500&q=80' },
      { name:'Craft My Box',        city:'Bangalore',       exp:'7 yrs',  badge:'Custom',      stars:'★★★★★', bio:'Fully customisable gift boxes for every wedding function. Design your own packaging, choose contents, and add personalised messages.',             img:'https://images.unsplash.com/photo-1488370668813-c0a7de10a166?w=500&q=80' },
      { name:'The Hamper Store',    city:'Pan-India',       exp:'11 yrs', badge:'Verified',    stars:'★★★★☆', bio:'Premium wedding return gifts and corporate gifting for large weddings. Elegant wicker hampers filled with luxury artisan selections.',            img:'https://images.unsplash.com/photo-1576706696500-1a7f65e0c20f?w=500&q=80' },
      { name:'Artisanal India',     city:'Jaipur',          exp:'15 yrs', badge:'Heritage',    stars:'★★★★★', bio:'Traditional Indian craft gifting—block-printed textiles, blue pottery, embroidered cushions sourced from artisan cooperatives across India.',     img:'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80' },
      { name:'SugarBox Sweets',     city:'Mumbai · Delhi',  exp:'8 yrs',  badge:'Delicious',   stars:'★★★★★', bio:'Luxury wedding mithai and chocolate gifting. Custom-designed sweet boxes, Belgian chocolate barkhas, and artisan laddoo collections.',            img:'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=80' },
      { name:'Wonderbox',           city:'Bangalore',       exp:'5 yrs',  badge:'Boutique',    stars:'★★★★☆', bio:'Experiential gifting for modern couples. Curated boxes featuring local artisan products, wellness items, and personalised keepsakes.',            img:'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=500&q=80' },
      { name:'Nykaa Gifting',       city:'Pan-India',       exp:'10 yrs', badge:'Beauty',      stars:'★★★★★', bio:'Beauty and wellness wedding gifting. Luxury skincare sets, perfume collections, and spa hampers for the modern bridal party.',                   img:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80' },
      { name:'Engrave It India',    city:'Delhi',           exp:'13 yrs', badge:'Personalised',stars:'★★★★★', bio:'Laser engraving and personalisation specialists. Custom silver keepsakes, engraved name plates, and monogrammed wedding gifts.',                  img:'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=500&q=80' },
    ]
  },
  {
    id: 'honeymoon', name: 'Honeymoon', count: '400+',
    bg: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=700&q=80',
    heroBg: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1400&q=80',
    artists: [
      { name:'Thomas Cook India',       city:'Pan-India',       exp:'50 yrs', badge:'Trusted',      stars:'★★★★★', bio:"India's premier travel company. Exclusive honeymoon packages to Maldives, Switzerland, Bali, and beyond—all-inclusive from ₹80K.",              img:'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=500&q=80' },
      { name:'Kuoni Honeymoons',        city:'Mumbai · Delhi',  exp:'40 yrs', badge:'Luxury',       stars:'★★★★★', bio:'Bespoke luxury honeymoon planning. Private villa stays, overwater bungalows, and private yacht charters for the ultimate romantic escape.',        img:'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=500&q=80' },
      { name:'Wanderlust Honeymoons',   city:'Bangalore',       exp:'8 yrs',  badge:'Boutique',     stars:'★★★★★', bio:"India's most loved boutique honeymoon planner. Off-beat destinations, private experiences, and handcrafted itineraries for adventurous couples.", img:'https://images.unsplash.com/photo-1501696461415-6bd6660c6742?w=500&q=80' },
      { name:'Kashmir Romance',         city:'Srinagar',        exp:'20 yrs', badge:'Domestic',     stars:'★★★★★', bio:'Himalayan honeymoon specialists. Shikara rides on Dal Lake, meadow glamping in Pahalgam, and snowfall experiences in Gulmarg.',                  img:'https://images.unsplash.com/photo-1449452198679-05c7fd30f416?w=500&q=80' },
      { name:'Kerala Backwater Bliss',  city:'Kochi',           exp:'15 yrs', badge:'Scenic',       stars:'★★★★★', bio:"Luxury houseboat honeymoons through Kerala's enchanting backwaters. Private chef, sunset cruises, and Ayurvedic spa treatments.",               img:'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&q=80' },
      { name:'Europe Escapes',          city:'Mumbai',          exp:'12 yrs', badge:'International',stars:'★★★★★', bio:'Specialised European honeymoon packages—Santorini sunsets, Venice gondolas, Swiss Alps, and Paris city breaks with Indian-friendly services.',   img:'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=500&q=80' },
      { name:'Maldives by Luxe',        city:'Pan-India',       exp:'10 yrs', badge:'Paradise',     stars:'★★★★★', bio:'Maldives overwater villa specialists. Exclusive deals with top resorts—Soneva Fushi, One & Only, and Gili Lankanfushi.',                        img:'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=500&q=80' },
      { name:'South East Asia Dreams',  city:'Delhi',           exp:'14 yrs', badge:'Popular',      stars:'★★★★★', bio:'Bali, Thailand, Vietnam, and Singapore honeymoon specialists. Cultural immersions, temple tours, and private resort experiences.',                img:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&q=80' },
      { name:'Dubai Diamonds',          city:'Mumbai',          exp:'9 yrs',  badge:'Trending',     stars:'★★★★★', bio:'Luxury Dubai and UAE honeymoon packages. Desert safaris, Burj Khalifa dinners, yacht charters, and spa retreats in the desert.',                 img:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&q=80' },
      { name:'Himalayan High',          city:'Manali',          exp:'11 yrs', badge:'Adventure',    stars:'★★★★☆', bio:'Adventure honeymoon specialists. Camping under stars in Spiti, skiing in Manali, trekking in Ladakh—for the couple that loves thrills.',         img:'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=500&q=80' },
    ]
  },
  {
    id: 'photographers', name: 'Photographers', count: '1,200+',
    bg: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=700&q=80',
    heroBg: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&q=80',
    artists: [
      { name:'Rajan & Co. Studios',    city:'Mumbai · Delhi · Jaipur', exp:'16 yrs', badge:'Featured',  stars:'★★★★★', bio:"India's most awarded wedding photography studio. Cinematic storytelling, drone coverage, and signature candid moments that become heirlooms.",  img:'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=500&q=80' },
      { name:'Pixelworks Studio',      city:'Bangalore',               exp:'11 yrs', badge:'Top Rated', stars:'★★★★★', bio:'Award-winning destination wedding photographers. Editorial-style photography blending fashion sensibility with authentic emotional moments.',      img:'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80' },
      { name:'Anshika Khanna',         city:'Delhi',                   exp:'9 yrs',  badge:'Fine Art',  stars:'★★★★★', bio:'Fine art wedding photographer. Painterly compositions, soft natural light, and emotional storytelling that looks like cinema stills.',           img:'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=500&q=80' },
      { name:'Kalpit Rathod Films',    city:'Ahmedabad · Mumbai',      exp:'13 yrs', badge:'Cinematic', stars:'★★★★★', bio:'Bollywood-level wedding films. Drone cinematography, slow-motion dance sequences, and feature-length films that capture every emotion.',          img:'https://images.unsplash.com/photo-1488372759477-a6a4b8d3b67d?w=500&q=80' },
      { name:'Memories By Mahima',     city:'Chennai',                 exp:'8 yrs',  badge:'Candid',    stars:'★★★★★', bio:"South India's best candid wedding photographer. Unposed, in-the-moment captures during traditional Tamil and Telugu ceremonies.",               img:'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=80' },
      { name:'The Picture Co.',        city:'Goa',                     exp:'10 yrs', badge:'Beach',     stars:'★★★★★', bio:"Goa's premier destination wedding photographer. Sunset silhouettes, beach portraits, and warm golden-hour sessions for every couple.",          img:'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&q=80' },
      { name:'Two Souls One Frame',    city:'Jaipur · Udaipur',        exp:'12 yrs', badge:'Heritage',  stars:'★★★★★', bio:"Rajasthan's most loved heritage wedding photography duo. Palace backdrops, jharokha frames, and timeless royal compositions.",                   img:'https://images.unsplash.com/photo-1513278974582-3e1b4a4fa21e?w=500&q=80' },
      { name:'Priyam Photo Stories',   city:'Kolkata',                 exp:'7 yrs',  badge:'Bengali',   stars:'★★★★☆', bio:'Bengali wedding photography specialist. Traditional biye rituals documented with artistic precision and cultural sensitivity.',                  img:'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&q=80' },
      { name:'Lightbox Studios',       city:'Mumbai',                  exp:'18 yrs', badge:'Veteran',   stars:'★★★★★', bio:"Mumbai's most experienced wedding photography studio. Comprehensive coverage teams, same-day edits, and luxury album production.",              img:'https://images.unsplash.com/photo-1496024840928-4c417adf211d?w=500&q=80' },
      { name:'Drishti Media',          city:'Hyderabad',               exp:'14 yrs', badge:'Cinematic', stars:'★★★★★', bio:"Telangana's leading wedding film production house. Hybrid photography and videography teams delivering premium cinematic deliverables.",        img:'https://images.unsplash.com/photo-1476370648495-3533f64427a2?w=500&q=80' },
    ]
  },
  {
    id: 'venues', name: 'Venues', count: '800+',
    bg: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=700&q=80',
    heroBg: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1400&q=80',
    artists: [
      { name:'The Leela Palace',      city:'Udaipur · Jaipur', exp:'30 yrs', badge:'5-Star',    stars:'★★★★★', bio:"Rajasthan's most iconic luxury wedding destination. 900-guest capacity, lakefront ceremony lawns, and Michelin-star in-house catering.",          img:'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&q=80' },
      { name:'Umaid Bhawan Palace',   city:'Jodhpur',          exp:'90 yrs', badge:'Royal',     stars:'★★★★★', bio:"A living royal palace and the world's largest private residence. Host your wedding where actual maharajas still reside—opulence unmatched.",    img:'https://images.unsplash.com/photo-1513278974582-3e1b4a4fa21e?w=500&q=80' },
      { name:'The Taj Mahal Hotel',   city:'Mumbai',           exp:'100 yrs',badge:'Iconic',    stars:'★★★★★', bio:"Mumbai's most storied wedding venue. Art Deco ballrooms, sea-facing lawns, and legendary Taj hospitality for 50 to 3,000 guests.",             img:'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=500&q=80' },
      { name:'Falaknuma Palace',      city:'Hyderabad',        exp:'140 yrs',badge:'Nizam',     stars:'★★★★★', bio:'Once the Nizam of Hyderabad\'s private palace. Restored to its original grandeur, hosting royal banquets in breathtaking Italianate halls.',    img:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&q=80' },
      { name:'ITC Grand Chola',       city:'Chennai',          exp:'10 yrs', badge:'Luxury',    stars:'★★★★★', bio:"South India's grandest wedding hotel. Chola-architecture inspired design, 10,000 sq ft ballrooms, and 250-meter illuminated mandap setups.",   img:'https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?w=500&q=80' },
      { name:'Westin Pushkar Resort', city:'Pushkar',          exp:'12 yrs', badge:'Scenic',    stars:'★★★★★', bio:'Luxury resort overlooking the sacred Pushkar Lake. Desert glamour meets spiritual serenity in one of India\'s most photogenic locations.',       img:'https://images.unsplash.com/photo-1549294413-26f195200c16?w=500&q=80' },
      { name:'Amby Valley City',      city:'Pune',             exp:'20 yrs', badge:'Destination',stars:'★★★★★', bio:'Integrated township resort spread across 10,000 acres. Private airstrip, golf course, and capacity for 50,000-guest mega-weddings.',            img:'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500&q=80' },
      { name:'The Oberoi Udaivilas',  city:'Udaipur',          exp:'20 yrs', badge:'Palace',    stars:'★★★★★', bio:'Built in the style of the Mewar royal residences. Private boat transfers across Lake Pichola, and enchanted lakeside ceremony setups.',          img:'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=500&q=80' },
      { name:'Wildflower Hall',       city:'Shimla',           exp:'25 yrs', badge:'Mountain',  stars:'★★★★★', bio:"Oberoi's Himalayan estate perched at 8,250 feet. Snow-capped peak views, cedar forest backdrops, and intimate luxury mountain weddings.",        img:'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=500&q=80' },
      { name:'Coconut Lagoon',        city:'Kerala',           exp:'28 yrs', badge:'Backwater', stars:'★★★★★', bio:"CGH Earth's heritage resort on Vembanad Lake. Nalukettu-style Kerala architecture, backwater ceremonies, and Ayurvedic wellness retreats.",    img:'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&q=80' },
    ]
  },
  {
    id: 'mehndi', name: 'Mehndi Artists', count: '600+',
    bg: 'https://images.unsplash.com/photo-1604004555489-723a93d6ce74?w=700&q=80',
    heroBg: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80',
    artists: [
      { name:'Veena Nagda',            city:'Mumbai',             exp:'30 yrs', badge:'Celebrity',  stars:'★★★★★', bio:"Bollywood's most sought-after mehndi artist. Her signature dense, fine-work Rajasthani patterns adorn the hands of India's biggest stars.",    img:'https://images.unsplash.com/photo-1604004555489-723a93d6ce74?w=500&q=80' },
      { name:'Ash Kumar Mehndi',       city:'Delhi',              exp:'25 yrs', badge:'Master',     stars:'★★★★★', bio:"Pioneer of modern bridal mehndi design. Famous for intricate portrait mehndi with the couple's faces hidden in the design.",                   img:'https://images.unsplash.com/photo-1583394885032-763cf0f6d2ef?w=500&q=80' },
      { name:'Raju Mehandi Art',       city:'Jaipur',             exp:'20 yrs', badge:'Traditional',stars:'★★★★★', bio:'Authentic Rajasthani traditional mehndi with peacocks, elephant motifs, and intricate geometric patterns. Three generations of mastery.',      img:'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80' },
      { name:'Henna by Hemlata',       city:'Mumbai',             exp:'12 yrs', badge:'Modern',     stars:'★★★★★', bio:"Contemporary bridal mehndi fusing Arabic, Indian, and Indo-Western styles. Specialises in minimalist modern designs for today's bride.",       img:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80' },
      { name:'Seema Mehndi Creations', city:'Hyderabad',          exp:'14 yrs', badge:'South Indian',stars:'★★★★★', bio:'South Indian bridal mehndi specialist. Unique Naidu community patterns, Marathi-inspired designs, and Andhra traditional applications.',    img:'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=80' },
      { name:'Punjab Mehndi Masters',  city:'Chandigarh',         exp:'22 yrs', badge:'Punjabi',    stars:'★★★★★', bio:'Punjabi bridal mehndi with bolder strokes, deeper cone work, and vibrant patterns. Covers full arms with traditional chunri motifs.',          img:'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=500&q=80' },
      { name:'Suhani Mehandi Studio',  city:'Bangalore',          exp:'9 yrs',  badge:'Trending',   stars:'★★★★☆', bio:"Popular fusion mehndi studio. Arabic cones, glitter extensions, and personalised motifs like initials and quotes woven into the design.",    img:'https://images.unsplash.com/photo-1558611012118-696072aa579a?w=500&q=80' },
      { name:'Gujarat Mehndi House',   city:'Ahmedabad',          exp:'35 yrs', badge:'Heritage',   stars:'★★★★★', bio:'Authentic Gujarati mehndi traditions. Mandala-based patterns, religious motifs of Radha-Krishna, and dense covering styles.',                 img:'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80' },
      { name:'Glitter Henna Co.',      city:'Mumbai',             exp:'6 yrs',  badge:'Modern',     stars:'★★★★☆', bio:'Specialises in white henna, glitter mehndi, and coloured henna art for bold, fashion-forward brides who love to stand out.',                  img:'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=500&q=80' },
      { name:'Mehndi Maestros',        city:'Delhi',              exp:'18 yrs', badge:'Expert',     stars:'★★★★★', bio:'Large-scale mehndi teams for big fat Indian weddings. Can handle 200+ guest mehndi functions with trained artists and premium cones.',         img:'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&q=80' },
    ]
  },
  {
    id: 'invitations', name: 'Invitation Designers', count: '400+',
    bg: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=700&q=80',
    heroBg: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1400&q=80',
    artists: [
      { name:'Paper & Thread Co.',  city:'Delhi',     exp:'10 yrs', badge:'Luxury',       stars:'★★★★★', bio:'Bespoke luxury wedding stationery. Hand-pressed letterpress, foil stamping, and hand-painted watercolour invitation suites.',                        img:'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=500&q=80' },
      { name:'Invites by Megh',     city:'Mumbai',    exp:'8 yrs',  badge:'Top Rated',    stars:'★★★★★', bio:'Digital and print invitation specialist. From WhatsApp-ready video invitations to grand boxed invitation sets with dry fruits and sweets.',          img:'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=500&q=80' },
      { name:'Ananya Cards',        city:'Jaipur',    exp:'15 yrs', badge:'Traditional',  stars:'★★★★★', bio:'Handmade Rajasthani paper invitations with block-printing, mirrorwork, and traditional motifs. Eco-friendly seed-paper options available.',         img:'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?w=500&q=80' },
      { name:'VideoCardz',          city:'Pan-India', exp:'6 yrs',  badge:'Digital',      stars:'★★★★★', bio:"India's leading video invitation platform. Animated wedding e-invites, WhatsApp video invitations, and social media announcement reels.",           img:'https://images.unsplash.com/photo-1488372759477-a6a4b8d3b67d?w=500&q=80' },
      { name:'Lasercuts Luxury',    city:'Bangalore', exp:'9 yrs',  badge:'Modern',       stars:'★★★★☆', bio:'Laser-cut acrylic and wooden invitation specialists. Stunning translucent designs with engraved text and custom die-cut shapes.',                   img:'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80' },
      { name:'The Folio House',     city:'Mumbai',    exp:'12 yrs', badge:'Editorial',    stars:'★★★★★', bio:'Magazine-style booklet wedding invitations printed on premium art paper. Full-spread photo inserts and editorial-grade typography.',                 img:'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=500&q=80' },
      { name:'Zara Invitations',    city:'Chennai',   exp:'7 yrs',  badge:'South Indian', stars:'★★★★☆', bio:'Tamil, Telugu, and Malayalam wedding invitation specialists. Traditional south Indian script layouts with modern design sensibility.',               img:'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?w=500&q=80' },
      { name:'Royal Scroll Designs',city:'Rajasthan', exp:'20 yrs', badge:'Heritage',     stars:'★★★★★', bio:'Hand-painted scroll invitations in the Mughal miniature tradition. Gold-leafed borders, cloth wrapping, and royal seal wax stamping.',             img:'https://images.unsplash.com/photo-1569511166557-b79f42d24e74?w=500&q=80' },
      { name:'Boxed Bliss',         city:'Delhi',     exp:'8 yrs',  badge:'Hamper',       stars:'★★★★★', bio:'Luxury boxed invitation hampers including personalised sweets, mithai, dried flowers, and first-class stationery in one grand package.',           img:'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500&q=80' },
      { name:'Serif Design Studio', city:'Bangalore', exp:'5 yrs',  badge:'Minimalist',   stars:'★★★★★', bio:'Clean, modern wedding invitation design for contemporary couples. Swiss typography, muted palettes, and architectural layout sensibility.',          img:'https://images.unsplash.com/photo-1561061164-5e37f3a6f8ae?w=500&q=80' },
    ]
  },
  {
    id: 'dj', name: 'DJ & Live Music', count: '550+',
    bg: 'https://www.blueavenue.com.au/wp-content/uploads/2022/03/live-corporate-band-min-scaled.jpg',
    heroBg: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1400&q=80',
    artists: [
      { name:'DJ Chetas',             city:'Mumbai · Pan-India', exp:'18 yrs', badge:'Celebrity',  stars:'★★★★★', bio:"India's most booked celebrity DJ. Bollywood, EDM, hip-hop—his sets keep dance floors packed from sangeet to reception.",                    img:'https://images.unsplash.com/photo-1571266028243-d220c6f8ca0b?w=500&q=80' },
      { name:'DJ Suketu',             city:'Mumbai',             exp:'22 yrs', badge:'Legend',     stars:'★★★★★', bio:'Veteran Bollywood DJ who has performed at over 3,000 weddings. Known for perfectly reading the crowd and seamless Bollywood transitions.',   img:'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&q=80' },
      { name:'The Band Baja Co.',     city:'Delhi',              exp:'12 yrs', badge:'Live Band',  stars:'★★★★★', bio:'Premium live wedding band performing Bollywood, Punjabi folk, and fusion sets. Dhol, tabla, keyboards, and vocals in one epic package.',     img:'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=500&q=80' },
      { name:'DJ NYK',                city:'Pan-India',          exp:'15 yrs', badge:'Top Rated',  stars:'★★★★★', bio:'International-circuit DJ bringing global EDM and Bollywood fusion to Indian weddings. Known for theatrical lighting shows and drops.',        img:'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&q=80' },
      { name:'The Jazz Affair',       city:'Mumbai',             exp:'20 yrs', badge:'Sophisticated',stars:'★★★★★', bio:'Live jazz ensemble for cocktail hours and intimate dinner receptions. Classic standards, bossa nova, and custom requests.',              img:'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=500&q=80' },
      { name:'Sufi Soul Band',        city:'Delhi · Jaipur',     exp:'14 yrs', badge:'Soulful',    stars:'★★★★★', bio:'Live Sufi music ensemble for rooftop sangeets and pre-wedding evenings. Haunting qawwali and ghazal performances under starlit skies.',    img:'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80' },
      { name:'DJ Ravish',             city:'Kolkata',            exp:'11 yrs', badge:'East India',  stars:'★★★★☆', bio:"Kolkata's most in-demand wedding DJ. Bengali band baaja, Rabindra sangeet remixes, and high-energy Bollywood for reception nights.",      img:'https://images.unsplash.com/photo-1468234560759-2fb468d3e97f?w=500&q=80' },
      { name:'Carnatic Fusion Band',  city:'Chennai · Bangalore',exp:'16 yrs', badge:'Classical',  stars:'★★★★★', bio:'South Indian classical meets contemporary fusion. Violin, mridangam, and veena playing original compositions for wedding ceremonies.',      img:'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&q=80' },
      { name:'DJ Amyra',              city:'Pan-India',          exp:'9 yrs',  badge:'Female DJ',  stars:'★★★★★', bio:"India's top female wedding DJ. High-energy sets fusing Punjabi pop, Bollywood, commercial house, and hip-hop for electric dance floors.",  img:'https://images.unsplash.com/photo-1547153760-18fc86324498?w=500&q=80' },
      { name:'The Strings Quartet',   city:'Bangalore · Mumbai', exp:'13 yrs', badge:'Classical',  stars:'★★★★★', bio:'Western classical string quartet for church weddings and fusion ceremonies. Bollywood arrangements on strings—unexpectedly magical.',       img:'https://images.unsplash.com/photo-1507808973436-a4ed7b5e87c9?w=500&q=80' },
    ]
  },
  {
    id: 'cars', name: 'Wedding Cars', count: '300+',
    bg: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=700&q=80',
    heroBg: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&q=80',
    artists: [
      { name:'Rolls-Royce Rentals India', city:'Mumbai · Delhi',    exp:'20 yrs', badge:'Ultra Luxury',stars:'★★★★★', bio:'Bridal entry in a Rolls-Royce Ghost or Phantom—the ultimate luxury statement. Chauffeur-driven with decor and champagne included.',       img:'https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&q=80' },
      { name:'Vintage Car Club',          city:'Rajasthan',          exp:'35 yrs', badge:'Heritage',    stars:'★★★★★', bio:'Heritage vintage car fleet—1930s Packard, Rolls-Royce Silver Cloud, and Bentley S1 for royal-style baraat processions.',                  img:'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&q=80' },
      { name:'Lamborghini Weddings',      city:'Mumbai · Delhi',    exp:'8 yrs',  badge:'Sports',      stars:'★★★★★', bio:'Supercar rental for groom arrivals—Lamborghini Huracán, Ferrari 488, and McLaren 720S for the ultimate head-turning entrance.',            img:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&q=80' },
      { name:'Royal Buggy & Carriage',    city:'Jaipur',             exp:'25 yrs', badge:'Royal',       stars:'★★★★★', bio:'Horse-drawn carriages and elephant processions for traditional baraat entries. Fully decorated with marigolds, bells, and velvet draping.',img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80' },
      { name:'EV Wedding Cars',           city:'Bangalore · Delhi',  exp:'4 yrs',  badge:'Eco Luxury',  stars:'★★★★★', bio:'Tesla Model S and BMW i7 fleet for eco-conscious couples. Electric luxury vehicles decorated in flowers for sustainable yet stylish arrivals.',img:'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500&q=80' },
      { name:'Heritage Motors Pune',      city:'Pune',               exp:'18 yrs', badge:'Classic',     stars:'★★★★★', bio:'Classic Ambassador and Jeep fleet for rustic, retro-themed weddings. Completely restored and decorated in traditional Indian style.',        img:'https://images.unsplash.com/photo-1471479917193-f00955256257?w=500&q=80' },
      { name:'Luxury Fleet Mumbai',       city:'Mumbai',             exp:'14 yrs', badge:'Corporate',   stars:'★★★★☆', bio:'Fleet of 50+ luxury Mercedes, BMWs, and Audi Q8s for comprehensive wedding convoy management, guest transfers, and baraat vehicles.',       img:'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=500&q=80' },
      { name:'Buggy Barn India',          city:'Pan-India',          exp:'10 yrs', badge:'Fun',         stars:'★★★★☆', bio:'Golf buggy fleets for resort and destination weddings. Decorated buggies for bride and groom entries at lawn and beach weddings.',          img:'https://images.unsplash.com/photo-1528277342758-f1d7613953a2?w=500&q=80' },
      { name:'RR Weddings',               city:'Hyderabad',          exp:'12 yrs', badge:'Prestige',    stars:'★★★★★', bio:"Hyderabad's premium luxury car rental for weddings. Rolls-Royce, Bentley, and Cadillac Escalade with professional chauffeurs.",             img:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80' },
      { name:'Hummer Baraat',             city:'Delhi · Chandigarh', exp:'11 yrs', badge:'Bold',        stars:'★★★★☆', bio:'Hummer H2 limos and stretched SUVs for big fat Punjabi baraats. Party inside the vehicle with music, lights, and a sunroof.',               img:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&q=80' },
    ]
  },
  {
    id: 'pandits', name: 'Pandits', count: '450+',
    bg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRvhXEGzT2bWoS4UCEe7638em6qCPnC9496g&s',
    heroBg: 'https://images.unsplash.com/photo-1601059405453-7e0c8d5e8ede?w=1400&q=80',
    artists: [
      { name:'Pt. Suresh Sharma',      city:'Varanasi · Pan-India',   exp:'40 yrs', badge:'Vedic Master',stars:'★★★★★', bio:'Celebrated Vedic scholar and pandit. Performs Vedic, Hindu, and regional ceremonies with deep knowledge and clear Sanskrit recitation.',     img:'https://images.unsplash.com/photo-1609431543557-04e4d83f50e2?w=500&q=80' },
      { name:'Pt. Ramesh Trivedi',     city:'Jaipur · Udaipur',       exp:'35 yrs', badge:'Rajasthani',  stars:'★★★★★', bio:"Rajasthan's most respected wedding pandit. Expertise in Mewari, Marwari, and Dhundhari wedding rituals. Available for palace venue ceremonies.", img:'https://images.unsplash.com/photo-1601059405453-7e0c8d5e8ede?w=500&q=80' },
      { name:'Pandit Acharya Group',   city:'Delhi · Agra',           exp:'30 yrs', badge:'Team',        stars:'★★★★★', bio:'Professional team of pandits for large weddings requiring multiple rituals simultaneously. North Indian shaadi vidhi experts.',                 img:'https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?w=500&q=80' },
      { name:'NRI Wedding Pandits',    city:'Pan-India',              exp:'20 yrs', badge:'Global',      stars:'★★★★★', bio:'Experienced pandits who conduct English-explained ceremonies for NRI couples and international guests. Available internationally.',              img:'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80' },
      { name:'Tamil Agama Pandits',    city:'Chennai · Madurai',      exp:'45 yrs', badge:'Agama',       stars:'★★★★★', bio:'Authorized Agama pandits for temple-style wedding ceremonies. Deep expertise in Shaivite and Vaishnavite marriage traditions.',                img:'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=500&q=80' },
      { name:'Andhra Vedic Pandits',   city:'Hyderabad · Vijayawada', exp:'30 yrs', badge:'Telugu',      stars:'★★★★★', bio:'Telugu Brahmin wedding pandit specialists. Complete Vivah Panchami rituals, Saptapadi, Kanyadaan, and Talambralu ceremonies.',                 img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80' },
      { name:'Pt. Kavindra Mishra',    city:'Lucknow · Varanasi',     exp:'28 yrs', badge:'Awadhi',      stars:'★★★★★', bio:'Specialist in Awadhi and Purbi UP wedding traditions. Known for his melodious recitation, detailed explanation, and blessed ceremonies.',      img:'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=500&q=80' },
      { name:'Konkani Purohit Seva',   city:'Goa · Mangalore',        exp:'25 yrs', badge:'Konkani',     stars:'★★★★★', bio:'Gaud Saraswat Brahmin wedding pandits. Expertise in Konkani vidhi with Sanskrit mantras and traditional GSB marriage customs.',               img:'https://images.unsplash.com/photo-1449452198679-05c7fd30f416?w=500&q=80' },
      { name:'Bengali Purohit Mandal', city:'Kolkata',                exp:'35 yrs', badge:'Bengali',     stars:'★★★★★', bio:'Bengali Brahmin wedding priests. Shastric puja, Sampradaan, Sindurdaan, and Lajahoma rituals with full traditional observance.',               img:'https://images.unsplash.com/photo-1501696461415-6bd6660c6742?w=500&q=80' },
      { name:'Namboothiri Vedic Society',city:'Kerala',               exp:'50 yrs', badge:'Kerala',      stars:'★★★★★', bio:'Kerala Namboothiri pandits for traditional Hindu and Nair wedding ceremonies. Vedic chanting, Nischayam, and Vivah rituals.',                  img:'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&q=80' },
    ]
  },
];

/* ── FEATURE PAGE FUNCTIONS ── */

function openFeaturePage() {
  document.getElementById('featurePage').style.display = 'block';
  document.body.style.overflow = 'hidden';
  renderCategories();
}

function closeFeaturePage() {
  document.getElementById('featurePage').style.display = 'none';
  document.body.style.overflow = '';
}

function openArtistPage(catId) {
  const cat = vendorCategories.find(c => c.id === catId);
  if (!cat) return;

  const ap = document.getElementById('artistPage');
  ap.style.display = 'block';
  document.getElementById('apHero').style.backgroundImage = `url('${cat.heroBg}')`;
  document.getElementById('apHeroCat').textContent = `✦ ${cat.count} Verified Professionals`;
  document.getElementById('apHeroTitle').textContent = cat.name;
  document.getElementById('apArtistsList').innerHTML = cat.artists.map(a => `
    <div class="artist-card">
      <div class="artist-img" style="background-image:url('${a.img}')">
        <div class="artist-img-overlay"></div>
        <div class="artist-badge">${a.badge}</div>
        <div class="artist-stars">${a.stars}</div>
      </div>
      <div class="artist-body">
        <div class="artist-name">${a.name}</div>
        <div class="artist-city">📍 ${a.city}</div>
        <div class="artist-exp">⏳ ${a.exp} Experience</div>
        <div class="artist-bio">${a.bio}</div>
        <button class="artist-book" onclick="alert('Booking enquiry sent to ${a.name}!')">Book Now →</button>
      </div>
    </div>
  `).join('');
  ap.scrollTop = 0;
}

function closeArtistPage() {
  document.getElementById('artistPage').style.display = 'none';
}

function renderCategories() {
  document.getElementById('fpCategoriesGrid').innerHTML = vendorCategories.map((cat, i) => `
    <div class="fp-cat-card" onclick="openArtistPage('${cat.id}')">
      <div class="fp-cat-bg" style="background-image:url('${cat.bg}')"></div>
      <div class="fp-cat-gradient"></div>
      <div class="fp-cat-overlay"></div>
      <div class="fp-cat-arrow">→</div>
      <div class="fp-cat-info">
        <div class="fp-cat-num">${String(i + 1).padStart(2, '0')} — Category</div>
        <div class="fp-cat-name">${cat.name}</div>
        <div class="fp-cat-count">✦ ${cat.count} Vendors Available</div>
      </div>
    </div>
  `).join('');
}

/* ── KEYBOARD CLOSE (Escape) ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.getElementById('artistPage').style.display === 'block') closeArtistPage();
    else if (document.getElementById('featurePage').style.display === 'block') closeFeaturePage();
  }
});


/* ══ VIDEOS PAGE ══ */
function openVideosPage() {
  const vp = document.getElementById('videos-page');
  vp.classList.add('is-open');
  vp.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closeVideosPage() {
  document.getElementById('videos-page').classList.remove('is-open');
  document.body.style.overflow = '';
}

function filterVideos(cat, btn) {
  document.querySelectorAll('.vp-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.vp-card').forEach(card => {
    if (cat === 'all' || card.dataset.cat === cat) {
      card.style.display = '';
      card.style.animation = 'vpFadeIn .35s ease forwards';
    } else {
      card.style.display = 'none';
    }
  });
}
/* ══ VIDEO MODAL ══ */
function openVideoModal(card) {
  const modal = document.getElementById('video-modal');

  const title    = card.querySelector('.vp-card-title').innerHTML;
  const meta     = card.querySelector('.vp-card-meta').textContent;
  const desc     = card.querySelector('.vp-card-desc').textContent;
  const dur      = card.querySelector('.vp-card-duration').textContent;
  const typeText = card.querySelector('.vp-card-type').textContent;
  const mediaEl  = card.querySelector('.vp-card-media');
  const bgImg    = mediaEl ? mediaEl.style.backgroundImage : '';
  const personName   = card.querySelector('.vp-person-name').textContent;
  const personDetail = card.querySelector('.vp-person-detail').textContent;
  const avs = card.querySelectorAll('.vp-person-av');

  document.getElementById('vm-title').innerHTML = title;
  document.getElementById('vm-meta').textContent  = meta;
  document.getElementById('vm-desc').textContent  = desc;
  document.getElementById('vm-dur').textContent   = dur;
  document.getElementById('vm-type').textContent  = typeText;

  const vmBg = document.getElementById('vm-bg');
  if (bgImg) {
    vmBg.style.backgroundImage    = bgImg;
    vmBg.style.backgroundSize     = 'cover';
    vmBg.style.backgroundPosition = 'center';
  }

  let avsHTML = '';
  avs.forEach((av, i) => {
    avsHTML += `<div class="vm-av" style="background:${av.style.background};${i > 0 ? 'margin-left:-10px;' : ''}">${av.textContent}</div>`;
  });

  document.getElementById('vm-person').innerHTML =
    `<div class="vm-avs">${avsHTML}</div>
     <div class="vm-person-text">
       <div class="vm-person-name">${personName}</div>
       <div class="vm-person-detail">${personDetail}</div>
     </div>`;

  modal.classList.add('is-open');
}

function closeVideoModal() {
  document.getElementById('video-modal').classList.remove('is-open');
}

document.getElementById('video-modal').addEventListener('click', function(e) {
  if (e.target === this) closeVideoModal();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') { closeVideoModal(); closeVideosPage(); }
});

   /*PLANNING TOOLS SECTION*/
  /* ── Tab Switcher ── */
  function switchTab(id, btn) {
    document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tool-tab').forEach(t  => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    btn.classList.add('active');
  }

  /* ── Open / Close More Planning Tools Modal ── */
  function openMPT() {
    document.getElementById('more-tools-overlay').style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
  function closeMPT() {
    document.getElementById('more-tools-overlay').style.display = 'none';
    document.body.style.overflow = '';
  }

  /* ── Live search / filter ── */
  function filterTools(q) {
    const term = q.toLowerCase().trim();
    document.querySelectorAll('.mpt-card').forEach(card => {
      const text = (
        card.dataset.name + ' ' +
        card.querySelector('.mpt-card-name').textContent + ' ' +
        card.querySelector('.mpt-card-cat').textContent
      ).toLowerCase();
      card.style.display = (!term || text.includes(term)) ? '' : 'none';
    });
  }

  /* ── Close modal on Escape ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMPT();
  });

                       /*HONEY MOON PACKAGES*/
  /* ── Open / Close Overlay ── */
  function openPkgPage() {
    const overlay = document.getElementById('pkg-overlay');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => overlay.classList.add('open'));
  }

  function closePkgPage() {
    const overlay = document.getElementById('pkg-overlay');
    overlay.classList.remove('open');
    overlay.addEventListener('transitionend', () => {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }, { once: true });
  }

  /* Close on Escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePkgPage();
  });

  /* ── Filter Packages ── */
  function filterPkgs(btn, cat) {
    document.querySelectorAll('.pkg-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('#pkg-grid .pkg-card').forEach(card => {
      card.style.display =
        (cat === 'all' || card.dataset.cat.includes(cat)) ? 'block' : 'none';
    });
  }

  /* ── Wishlist Heart Toggle ── */
  function toggleHeart(el) {
    const saved = el.textContent === '♥';
    el.textContent = saved ? '♡' : '♥';
    el.style.color  = saved ? '' : '#BF9B5C';
  }