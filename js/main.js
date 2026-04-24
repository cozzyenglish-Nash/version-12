// ─────────────────────────────────────────────────────────────────────────────
// COZY ENGLISH — MAIN.JS
// Language: localStorage key 'ce_lang'. TR = default (full site).
// EN = shows a persistent top banner offering to contact in English.
// The toggle is always visible, always works, no redirects, no broken pages.
// ─────────────────────────────────────────────────────────────────────────────

const LANG_KEY = 'ce_lang';
function getLang() { return localStorage.getItem(LANG_KEY) || 'tr'; }

// ── LANGUAGE ─────────────────────────────────────────────────────────────────
function applyLang(lang) {
  localStorage.setItem(LANG_KEY, lang);

  // Update button states
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });
  document.documentElement.lang = lang;

  // Show or hide the EN banner
  const banner = document.getElementById('en-banner');
  if (banner) banner.style.display = lang === 'en' ? 'flex' : 'none';

  // Swap any elements that have both data-tr and data-en
  document.querySelectorAll('[data-tr][data-en]').forEach(el => {
    el.textContent = lang === 'en' ? el.dataset.en : el.dataset.tr;
  });

  // Swap href attributes (for links that differ by lang)
  document.querySelectorAll('[data-href-tr][data-href-en]').forEach(el => {
    el.href = lang === 'en' ? el.dataset.hrefEn : el.dataset.hrefTr;
  });
}

// Inject the EN banner into the page (once, if not already present)
function injectEnBanner() {
  if (document.getElementById('en-banner')) return;

  const root = getRoot();

  const banner = document.createElement('div');
  banner.id = 'en-banner';
  banner.style.cssText = [
    'display:none',
    'position:fixed',
    'top:68px',
    'left:0','right:0',
    'z-index:190',
    'background:#003A66',
    'color:#fff',
    'padding:10px 2rem',
    'align-items:center',
    'justify-content:space-between',
    'gap:1rem',
    'flex-wrap:wrap',
    'font-family:Outfit,sans-serif',
    'font-size:0.875rem',
    'box-shadow:0 4px 20px rgba(0,0,0,0.2)',
    'border-bottom:2px solid #f1ae62',
  ].join(';');

  banner.innerHTML = `
    <span style="color:rgba(255,255,255,0.85);line-height:1.5;">
      🌐 <strong style="color:#f1ae62;">English version coming soon.</strong>
      Nash teaches in English — feel free to reach out directly in English.
    </span>
    <div style="display:flex;gap:0.75rem;align-items:center;flex-shrink:0;">
      <a href="${root}/contact.html"
         style="padding:7px 18px;background:#f1ae62;color:#fff;border-radius:6px;
                text-decoration:none;font-weight:500;font-size:0.8125rem;white-space:nowrap;">
        Contact in English →
      </a>
      <button onclick="applyLang('tr')"
              style="padding:7px 14px;background:rgba(255,255,255,0.12);color:rgba(255,255,255,0.7);
                     border:1px solid rgba(255,255,255,0.2);border-radius:6px;cursor:pointer;
                     font-family:Outfit,sans-serif;font-size:0.8125rem;white-space:nowrap;">
        × Switch to Turkish
      </button>
    </div>`;

  // Insert right after <body> opens (before nav)
  document.body.insertBefore(banner, document.body.firstChild);
}

// ── ROOT PATH ─────────────────────────────────────────────────────────────────
function getRoot() {
  const loc = window.location;
  const parts = loc.pathname.split('/').filter(p => p && !p.includes('.'));
  const subfolders = ['programs','articles','en'];
  const rootParts = parts.filter(d => !subfolders.includes(d));
  return loc.origin + (rootParts.length ? '/' + rootParts.join('/') : '');
}

// ── LOGO ─────────────────────────────────────────────────────────────────────
function initLogo() {
  // src is set directly in HTML — just handle fallback visibility
  document.querySelectorAll('.logo-img-slot').forEach(img => {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('loaded');
      const parent = img.parentElement;
      parent.querySelectorAll('.logo-fb-lg, .logo-fb, .footer-logo-mark-fb').forEach(fb => fb.style.display = 'none');
      const fb = document.getElementById('footerFallbackLogo');
      if (fb) fb.style.display = 'none';
    } else {
      img.onload = () => {
        img.classList.add('loaded');
        const parent = img.parentElement;
        parent.querySelectorAll('.logo-fb-lg, .logo-fb, .footer-logo-mark-fb').forEach(fb => fb.style.display = 'none');
        const fb = document.getElementById('footerFallbackLogo');
        if (fb) fb.style.display = 'none';
      };
    }
  });
}

// ── SCROLL REVEAL ─────────────────────────────────────────────────────────────
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  els.forEach(el => io.observe(el));
}

// ── NAV SCROLL ────────────────────────────────────────────────────────────────
function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  const fn = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', fn, { passive: true }); fn();
}

// ── MOBILE MENU ───────────────────────────────────────────────────────────────
function initMobileMenu() {
  const ham = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-menu');
  if (!ham || !menu) return;
  ham.addEventListener('click', () => {
    const open = ham.classList.toggle('open');
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      ham.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── ACTIVE NAV ────────────────────────────────────────────────────────────────
function initActiveNav() {
  const slug = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (href === slug) a.classList.add('active');
  });
}

// ── PARALLAX ──────────────────────────────────────────────────────────────────
function initParallax() {
  const bg = document.querySelector('.hero-parallax-bg');
  if (!bg) return;
  window.addEventListener('scroll', () => {
    bg.style.transform = `translateY(${window.scrollY * 0.35}px)`;
  }, { passive: true });
}

// ── HERO LINE DRAW ────────────────────────────────────────────────────────────
function initHeroLine() {
  setTimeout(() => {
    document.querySelectorAll('.hero-title-italic').forEach(el => el.classList.add('drawn'));
  }, 900);
}

// ── FLIP CARDS ────────────────────────────────────────────────────────────────
function initFlipCards() {
  const isMobile = () => window.innerWidth < 768;
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
      if (isMobile()) card.classList.toggle('flipped');
    });
  });
}

// ── EXPAND CARDS ──────────────────────────────────────────────────────────────
function initExpandCards() {
  document.querySelectorAll('.expand-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('a')) return;
      const wasOpen = card.classList.contains('open');
      const group = card.closest('.expand-group');
      if (group) group.querySelectorAll('.expand-card').forEach(c => c.classList.remove('open'));
      if (!wasOpen) card.classList.add('open');
    });
  });
}

// ── DROPDOWN MENUS ────────────────────────────────────────────────────────────
function initDropdownMenus() {
  document.querySelectorAll('.nav-dropdown').forEach(item => {
    const toggle = item.querySelector('.nav-dropdown-toggle');
    const menu = item.querySelector('.nav-dropdown-menu');
    if (!toggle || !menu) return;
    item.addEventListener('mouseenter', () => menu.classList.add('open'));
    item.addEventListener('mouseleave', () => menu.classList.remove('open'));
    toggle.addEventListener('click', e => {
      if (window.innerWidth < 900) { e.preventDefault(); menu.classList.toggle('open'); }
    });
  });
}

// ── METHOD PILLS ──────────────────────────────────────────────────────────────
function initMethodPills() {
  const modal = document.getElementById('methodModal');
  if (!modal) return;
  document.querySelectorAll('.pill[data-method]').forEach(pill => {
    pill.addEventListener('click', () => {
      const data = METHOD_EXPLANATIONS[pill.dataset.method];
      if (!data) return;
      modal.querySelector('.modal-title').textContent = data.title;
      modal.querySelector('.modal-body').innerHTML = data.body;
      modal.classList.add('open');
    });
  });
  modal.querySelector('.modal-close').addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
}

const METHOD_EXPLANATIONS = {
  tbl:  { title: 'Task-Based Learning', body: '<p>Görev Temelli Öğrenme. Bu yaklaşım, dil becerilerini gerçek dünya görevleri üzerinden geliştirerek motivasyonu ve bilgiyi içselleştirmeyi artırır. Öğrencilerimiz rol yapma ve proje tabanlı aktivitelerle dili sadece öğrenmekle kalmaz, anlamlı bağlamlarda kullanmayı da deneyimler</p>' },
  ibi:  { title: 'Input-Based Instruction', body: '<p>Beyin anlaşılabilir girdi yoluyla dili edinir. Seviyenizin hemen üzerinde içerikle maruz kalmak, gramer kurallarını ezberlemekten çok daha güçlü bir temel oluşturur.</p>' },
  ecrif:{ title: 'ECRIF Framework', body: '<p>Encounter → Clarify → Remember → Internalize → Fluently Use. Her yeni dil unsuru önce doğal bir bağlamda karşılaşılır, sonra netleştirilir, ardından pekiştirilir ve en son akıcı kullanıma geçilir.</p>' },
  pi:   { title: 'Processing Instruction', body: '<p>Gramer öğretiminde öğrencinin dikkatini form-anlam bağlantısına yönlendiren yapılandırılmış yaklaşım. Anlamlı bağlamlarda defalarca "işlemek" beyinde kalıcı bağlantılar oluşturur.</p>' },
  clt:  { title: 'Communicative Language Teaching', body: '<p>Dilin iletişim için öğrenildiği ilkesine dayanan yaklaşımda dersin %70-80\'i gerçek iletişim etkinliklerine ayrılır. Gramer ihtiyaç duyulduğu anda öğretilir.</p>' },
  sr:   { title: 'Strategic Repetition', body: '<p>Spaced repetition bilimine dayalı strateji. Beyin, tam unutmak üzereyken yapılan tekrarda en güçlü hafıza izini oluşturur.</p>' },
  ctx:  { title: 'Contextual Teaching', body: '<p>Kelimeler asla izole biçimde öğretilmez. Araştırmalar bağlamsal öğrenmenin kelime kalıcılığını %60\'a kadar artırdığını gösteriyor.</p>' },
  ie:   { title: 'Input Enhancement', body: '<p>Öğrenilmesi gereken dil yapıları doğal bağlamda görsel veya sözlü olarak ön plana çıkarılır. Farkındalık olmadan kazanım mümkün değildir.</p>' },
};

// ── COMMUNITY TABS ────────────────────────────────────────────────────────────
function initCommunityTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  if (!tabs.length) return;

  function activateTab(tabId) {
    const validTabs = ['blog','tips','testimonials','faq'];
    if (!validTabs.includes(tabId)) tabId = 'blog';
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + tabId));
    const panel = document.getElementById('panel-' + tabId);
    if (panel) panel.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    history.replaceState(null, '', '#' + tabId);
    // Scroll so tab-bar is at top of viewport (below fixed nav)
    const tabBar = document.getElementById('tabBar');
    if (tabBar) {
      const y = tabBar.getBoundingClientRect().top + window.scrollY - 68;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  function showLanding(show) {
    const landing = document.getElementById('communityLanding');
    const tabBar = document.getElementById('tabBar');
    if (landing) landing.style.display = show ? '' : 'none';
    if (tabBar) tabBar.style.display = show ? 'none' : '';
    if (show) {
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    }
  }

  tabs.forEach(btn => {
    btn.addEventListener('click', () => { showLanding(false); activateTab(btn.dataset.tab); });
  });

  document.querySelectorAll('.community-landing-card').forEach(btn => {
    btn.addEventListener('click', () => {
      showLanding(false);
      activateTab(btn.dataset.goto);
      history.replaceState(null, '', '#' + btn.dataset.goto);
    });
    btn.addEventListener('mouseenter', () => { btn.style.boxShadow = 'var(--shadow-md)'; btn.style.transform = 'translateY(-3px)'; });
    btn.addEventListener('mouseleave', () => { btn.style.boxShadow = ''; btn.style.transform = ''; });
  });

  // Handle back-to-overview button
  const backBtn = document.getElementById('communityBackBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      showLanding(true);
      history.replaceState(null, '', window.location.pathname);
    });
  }

  // Initial state from hash
  const hash = (window.location.hash || '').replace('#', '');
  const validTabs = ['blog','tips','testimonials','faq'];
  if (hash && validTabs.includes(hash)) {
    showLanding(false);
    activateTab(hash);
  } else {
    showLanding(true);
  }
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function initFaq() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        const ic = i.querySelector('.faq-icon');
        if (ic) ic.textContent = '+';
      });
      if (!wasOpen) {
        item.classList.add('open');
        const ic = btn.querySelector('.faq-icon');
        if (ic) ic.textContent = '×';
      }
    });
  });
}

// ── BOOT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectEnBanner();
  applyLang(getLang());

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });

  initReveal();
  initNavScroll();
  initMobileMenu();
  initActiveNav();
  initLogo();
  initParallax();
  initHeroLine();
  initFlipCards();
  initExpandCards();
  initDropdownMenus();
  initMethodPills();
  initCommunityTabs();
  initFaq();
});
