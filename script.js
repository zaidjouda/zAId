// ========================
// المتغيرات العامة
// ========================
let currentServiceGroup = null;
const FEATURED_OFFER_ID = 1; // ← غيّر هذا الرقم إلى 1 أو 2 أو 3 أو 4

// ========================
// دوال مساعدة
// ========================
function hideAllPages() {
  document.querySelectorAll('section[id^="page-"]').forEach(section => {
    section.classList.add('hidden');
  });
}

// ✅ دالة showPage الوحيدة — تدعم الخدمات والعرض
function showPage(pageId) {
  hideAllPages();
  const target = document.getElementById(`page-${pageId}`);
  if (target) {
    target.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState(null, '', `#${pageId}`);

    // تشغيل المنطق حسب الصفحة
    if (pageId === 'offers') {
      renderOffers(); // ← جديد
    } else if (pageId === 'services') {
      renderServices('all'); // ضمان عرض جميع الخدمات عند الدخول
    }
  }

  // إغلاق القائمة المتنقلة
  const mobileNav = document.getElementById('mobileNav');
  if (mobileNav) {
    mobileNav.classList.remove('active');
  }
}

function updateNavIndicator(activeLink) {
  const indicator = document.querySelector('.nav-indicator');
  const navContainer = document.querySelector('.main-nav');
  if (!indicator || !navContainer || !activeLink) return;
  const navRect = navContainer.getBoundingClientRect();
  const linkRect = activeLink.getBoundingClientRect();
  const left = linkRect.left - navRect.left;
  const width = linkRect.width;
  indicator.style.width = `${width}px`;
  indicator.style.transform = `translateX(${left}px)`;
}

function closeServiceDetail() {
  const modal = document.getElementById('service-detail-modal');
  if (modal) modal.classList.remove('active');
}



// === عرض الخدمات حسب التصنيف ===
function renderServices(group = 'all') {
  const grid = document.getElementById('servicesGrid');
  const backBtn = document.getElementById('backBtn');
  const tabBtns = document.querySelectorAll('.tab-btn');

  // تحديث أزرار التصنيف
  tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.group === group);
  });

  // إظهار/إخفاء زر العودة
  if (backBtn) {
    backBtn.style.display = group === 'all' ? 'none' : 'block';
  }

  // تحديد البيانات حسب المجموعة
  let services = [];
  if (group === 'all') {
    // جمع جميع الخدمات
    for (const key in serviceDetails) {
      if (serviceDetails.hasOwnProperty(key)) {
        services = services.concat(serviceDetails[key]);
      }
    }
  } else {
    services = serviceDetails[group] || [];
  }

  // عرض الخدمات
  if (grid) {
    grid.innerHTML = services.map((service, index) => `
      <div class="service-card" onclick="openServiceModal(${JSON.stringify(service).replace(/"/g, '&quot;')})">
        <div class="service-icon">${service.icon}</div>
        <h3>${service.title}</h3>
        <p>${service.desc}</p>
      </div>
    `).join('');
  }
}

function openServiceDetail(service) {
  const modal = document.getElementById('serviceModal');
  if (!modal || !service) return;

  document.getElementById('modalIcon').textContent = service.icon;
  document.getElementById('modalTitle').textContent = service.title;
  document.getElementById('modalDesc').textContent = service.desc;
  document.getElementById('modalResults').innerHTML = service.results.split('<br>').map(r => `<li>${r.replace('✓ ', '')}</li>`).join('');

  modal.classList.add('active');
}

function closeServiceModal() {
  document.getElementById('serviceModal').classList.remove('active');
}

function showAllCategories() {
  renderServices('all');
}

// ========================
// === صفحة العروض الجديدة (4 عروض) ===
// ========================
// const offers = [
//   {
//     id: 1,
//     title: "شركاء التأسيس",
//     desc: "ادفع 20% فقط والباقي بعد نجاح التشغيل تماماً.",
//     price: "يبدأ من 50$",
//     buyers: 2,
//     maxBuyers: 30,
//     details: `<h2> عرض شركاء التأسيس</h2>
//     <h4>في ZAID، نؤمن بأن النتائج هي لغتنا الوحيدة. ولأننا شركة ناشئة تبحث عن بناء قصص نجاح حقيقية، قررنا أن نتحمل نحن المخاطرة بدلاً منك في خطوتك الأولى نحو الأتمتة</h4>
//     <h3>ماذا ستحصل عليه في هذا العرض؟</h3>
//     <ul><li>فقط لاول 30 مشتركا </li>
//         <li>نظام الدفع المرن: تدفع رسوم حجز 20% فقط، ولا نطلب منك الـ 80% المتبقية إلا بعد مرور أسبوع كامل على عمل نظامك بكفاءة وبدون أخطاء.</li> 
//         <li>أولوية "التنفيذ اليدوي": ستحصل على إشراف مباشر من المؤسسين لضمان أن الحل المخصص يناسب احتياجات عملك بدقة.</li>
//         <li>خصم "الولاء الدائم": كعضو في أول 30 شريكاً، ستحصل على خصم 40% ثابت على أي تطويرات أو اشتراكات مستقبلية لشركتك مدى الحياة.</li>
//         <li>مدة التسليم اسبوعين من تاريخ اتفاق الخدمة</li>
//         </ul>
//         <p>⚠️ <strong>ملاحظة:</strong> العرض ينتهي عند اكتمال 30 مشتريًا.</p>
//         <h3> شروط العرض </h3>
//         <p>  العرض متاح فقط لأول 30 طلباً مكتملاً.</p>
//         <p> في حال لم نتمكن من تشغيل النظام المتفق عليه تقنياً، نلتزم برد رسوم الحجز (20%) فوراً. </p>

//         `
//   },

// ];

function renderOffers() {
  const grid = document.getElementById('offersGrid');
  if (!grid) return;

  grid.innerHTML = offers.map(offer => {
    const percent = (offer.buyers / offer.maxBuyers) * 100;
    const isFull = offer.buyers >= offer.maxBuyers;
    return `
      <div class="offer-card" data-id="${offer.id}">
        <h3>${offer.title}</h3>
        <p class="desc">${offer.desc}</p>
        <div class="offer-price">${offer.price}</div>
        <div class="buyer-count">${offer.buyers} من ${offer.maxBuyers} مشتريًا</div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill${isFull ? ' full' : ''}" style="width: ${Math.min(percent, 100)}%;"></div>
        </div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.offer-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.id);
      const offer = offers.find(o => o.id === id);
      if (offer) {
        document.getElementById('offersGrid').classList.add('hidden');
        document.getElementById('offer-detail-section').classList.remove('hidden');
        document.getElementById('offer-detail-content').innerHTML = offer.details;
      }
    });
  });
}

function goBackToOffers() {
  document.getElementById('offersGrid').classList.remove('hidden');
  document.getElementById('offer-detail-section').classList.add('hidden');
}

// ========================
// الأحداث عند تحميل الصفحة
// ========================
document.addEventListener('DOMContentLoaded', () => {
  // إزالة شاشة التحميل
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 500);
    }
  });

  // عرض الصفحة الافتراضية
  const hash = window.location.hash.substring(1);
  const validPages = ['home', 'services', 'pricing', 'about', 'contact', 'offers'];
  const pageToShow = validPages.includes(hash) ? hash : 'home';
  showPage(pageToShow);
  if (validPages.includes(hash)) {
    showPage(hash);
  } else {
    // وإلا → اعرض الرئيسية
    showPage('home');
  }

  // ربط التنقل
  document.addEventListener('click', function(e) {
    const link = e.target.closest('[data-page]');
    if (link) {
      e.preventDefault();
      const pageId = link.getAttribute('data-page');
      showPage(pageId);
    }
  });

  // ربط بطاقات الخدمات الرئيسية
  const serviceCards = document.querySelectorAll('#page-services .card');
  const groups = ['ecommerce', 'influencers', 'small-business', 'enterprise', 'education', 'healthcare'];
  serviceCards.forEach((card, index) => {
    const group = groups[index];
    if (group) {
      card.addEventListener('click', () => showAudienceGroup(group));
    }
  });

  // القائمة المتنقلة للجوال
  document.querySelector('.mobile-menu-toggle').addEventListener('click', function() {
    document.getElementById('mobileNav').classList.toggle('active');
  });

  // إغلاق القائمة عند النقر خارجها
  document.addEventListener('click', function(e) {
    const panel = document.getElementById('mobileNav');
    const toggle = document.querySelector('.mobile-menu-toggle');
    if (panel.classList.contains('active')) {
      if (!panel.contains(e.target) && !toggle.contains(e.target)) {
        panel.classList.remove('active');
      }
    }
  });

  // إغلاق النافذة المنبثقة
  document.querySelector('.modal-close').addEventListener('click', closeServiceModal);
});

// دالة عرض مجموعة جمهور (للخدمات)
function showAudienceGroup(group) {
  hideAllPages();
  const page = document.getElementById('page-service-detail');
  if (!page) return;

  const titles = {
    ecommerce: "لأصحاب المتاجر الإلكترونية",
    influencers: "للمؤثرين على السوشيال ميديا",
    "small-business": "للشركات الصغيرة والمتوسطة",
    enterprise: "للشركات الكبرى والمؤسسات",
    education: "للقطاع التعليمي",
    healthcare: "للقطاع الطبي والمستشفيات"
  };

  const titleEl = document.getElementById('service-detail-title');
  if (titleEl) {
    titleEl.innerHTML = `<h2>${titles[group]}</h2><p class="group-intro">هذه بعض الخدمات التي يمكنك طلبها، ويمكنك إنشاء أي خدمة أخرى تتماشى مع طريقة عملك.</p>`;
  }

  const cardsContainer = document.getElementById('service-detail-cards');
  if (cardsContainer) {
    const services = serviceGroups[group] || [];
    cardsContainer.innerHTML = services.map((service, index) => `
      <div class="detail-card" onclick="openServiceModal(${JSON.stringify(service).replace(/"/g, '&quot;')})">
        <div class="detail-icon">${service.icon}</div>
        <h3>${service.title}</h3>
        <p>${service.desc}</p>
        <div class="view-more">عرض النتائج المتوقعة →</div>
      </div>
    `).join('');
  }

  page.classList.remove('hidden');
  currentServiceGroup = group;
  window.scrollTo({ top: page.offsetTop - 80, behavior: 'smooth' });
}

// دالة فتح النافذة المنبثقة (نسخة بديلة)
function openServiceModal(serviceStr) {
  const service = JSON.parse(serviceStr.replace(/&quot;/g, '"'));
  openServiceDetail(service);
}

// ========================
// === 1. تعريف بيانات الخدمات ===
// ========================

// --- المتاجر الإلكترونية ---
const ecommerce = [
  { title: "رد تلقائي على استفسارات العملاء", desc: "يجيب عن الأسئلة الشائعة مثل: الشحن، الاسترجاع، العروض — 24/7.", results: "✓ يقلل وقت الرد من 10 دقائق إلى 10 ثوانٍ<br>✓ يرفع رضا العملاء بنسبة 40%<br>✓ يوفر 25 ساعة أسبوعيًا لفريق الدعم", icon: "💬" },
  { title: "إضافة منتجات إلى السلة عبر الدردشة", desc: "العميل يطلب منتجًا بالكلام، والنظام يضيفه تلقائيًا لسلته.", results: "✓ يحوّل 22% من الزوار إلى مشترين<br>✓ يزيد متوسط قيمة الطلب بنسبة 18%<br>✓ لا حاجة لكتابة روابط أو أكواد", icon: "🛒" },
  { title: "تنبيهات الذكاء التنبؤي للمخزون", desc: "يُرسل تنبيهًا تلقائيًا عند انخفاض مخزون منتج شائع.", results: "✓ يمنع نفاد المخزون بنسبة 95%<br>✓ يقلل الخسائر الناتجة عن الطلبات الملغاة<br>✓ يربط مباشرة مع Google Sheets أو Shopify", icon: "📊" },
  { title: "تتبع طلبات الشحن تلقائيًا", desc: "يرسل تحديثات فورية للعميل بمجرد شحن الطلب أو توصيله.", results: "✓ يقلل استفسارات 'أين طلبي؟' بنسبة 70%<br>✓ يعزز الثقة في العلامة التجارية<br>✓ يتكامل مع Aramex, SMSA, DHL", icon: "📦" },
  { title: "عروض ترويجية ذكية بناءً على السلوك", desc: "يقدّم خصومات مخصصة للعملاء غير النشطين أو المترددين.", results: "✓ يستعيد 15% من العملاء المفقودين<br>✓ يرفع العائد على الحملات التسويقية 3x<br>✓ لا يحتاج إلى تصميم كوبونات يدويًا", icon: "🎁" }
];

// --- المؤثرون ---
const influencers = [
  { title: "ردود ذكية على التعليقات والرسائل", desc: "يحول المتابعين إلى عملاء عبر ردود مخصصة تحفّز على الشراء.", results: "✓ يزيد التفاعل بنسبة 50%<br>✓ يحول 12% من المتابعين إلى عملاء مدفوعين<br>✓ يعمل على إنستغرام، تيك توك، وواتساب", icon: "✨" },
  { title: "جدولة المنشورات التفاعلية", desc: "ينشر أسئلة أو استطلاعات تلقائية لزيادة التفاعل.", results: "✓ يرفع ظهور المحتوى في الخوارزميات<br>✓ يوفر 10 ساعات أسبوعيًا من الجدولة اليدوية<br>✓ يحلل أفضل أوقات النشر تلقائيًا", icon: "📅" },
  { title: "تحليل الجمهور وتقسيمه", desc: "يصنّف المتابعين حسب الاهتمامات لاستهداف أدق.", results: "✓ يحسّن جودة الجمهور المستهدف<br>✓ يقلل هدر الميزانية الإعلانية بنسبة 35%<br>✓ يولد تقارير أسبوعية بصيغة PDF", icon: "🎯" },
  { title: "أتمتة التعاون مع العلامات التجارية", desc: "يُرسل عروض تعاون تلقائية عند الوصول لعدد متابعين معيّن.", results: "✓ يفتح فرص تعاون تلقائية دون تدخل يدوي<br>✓ يحفظ سجل جميع العروض المرسلة والمستلمة<br>✓ يحسب ROI كل تعاون تلقائيًا", icon: "🤝" },
  { title: "حماية من الرسائل المزعجة", desc: "يفرز الرسائل التلقائية والاحتيالية ويحظرها.", results: "✓ يقلل الرسائل غير المرغوب فيها بنسبة 90%<br>✓ يحمي خصوصية الحساب<br>✓ يرسل تنبيهًا عند اكتشاف نشاط مشبوه", icon: "🛡️" }
];

// --- الشركات الصغيرة ---
const smallBusiness = [
  { title: "أتمتة الردود على الواتساب", desc: "يقلل الحاجة لموظف خدمة عملاء إضافي بنسبة 80%.", results: "✓ يوفر حتى 3000 ريال شهريًا من الرواتب<br>✓ يعمل 24/7 دون تعب<br>✓ يدعم الردود الصوتية والنصوص", icon: "📱" },
  { title: "ربط الفواتير مع Google Sheets", desc: "كل عملية بيع تُسجّل تلقائيًا في جدولك دون تدخل يدوي.", results: "✓ يلغي الأخطاء البشرية في المحاسبة<br>✓ يوفر 15 ساعة شهريًا من التسجيل اليدوي<br>✓ يُصدر تقارير ضريبية جاهزة", icon: "🧾" },
  { title: "تذكير العملاء بالمواعيد", desc: "يرسل رسائل تلقائية قبل الموعد بيوم أو ساعتين.", results: "✓ يقلل الغياب بنسبة 60%<br>✓ يحسّن سمعة الخدمة<br>✓ يدعم التذكير عبر SMS وواتساب", icon: "⏰" },
  { title: "إدارة الموظفين والمكافآت", desc: "يتابع أداء الموظفين ويسجّل الحضور والإنجازات.", results: "✓ يحفّز الفريق عبر مكافآت تلقائية<br>✓ يقلل التأخير بنسبة 45%<br>✓ يربط مع أنظمة الدفع المحلي", icon: "👥" },
  { title: "أتمتة طلبات الشراء من الموردين", desc: "يطلب المواد تلقائيًا عند انخفاض المخزون.", results: "✓ يضمن استمرارية العمل دون توقف<br>✓ يتفاوض تلقائيًا على أفضل الأسعار<br>✓ يسجل كل طلب مع فاتورة رقمية", icon: "🔄" }
];

// --- المؤسسات ---
const enterprise = [
  { title: "بوابة أتمتة مخصصة للشركة", desc: "لوحة تحكم مركزية لإدارة جميع سير العمل الآلي.", results: "✓ توفر 120 ساعة شهريًا من التنسيق بين الأقسام<br>✓ تمنح صلاحيات دخول مخصصة لكل موظف<br>✓ تدعم التكامل مع SAP, Oracle, Zoho", icon: "🏢" },
  { title: "تكامل مع أنظمة CRM و ERP", desc: "يزيد كفاءة الفرق عبر تحديث البيانات في الوقت الفعلي.", results: "✓ يقلل التكرار في إدخال البيانات بنسبة 90%<br>✓ يسرّع دورة المبيعات بنسبة 35%<br>✓ يخلق سجل عميل موحد (Single Customer View)", icon: "🔄" },
  { title: "تقارير أداء ذكية أسبوعية", desc: "يعرض ROI، الوقت المُوفّر، وعدد العملاء الجدد الناتجين عن الأتمتة.", results: "✓ يساعد الإدارة في اتخاذ قرارات دقيقة<br>✓ يُظهر العائد المالي لكل نظام آلي<br>✓ يُرسل التقارير تلقائيًا إلى البريد أو Slack", icon: "📈" },
  { title: "أمان متقدم وتدقيق كامل", desc: "يُسجّل كل نشاط مع تشفير من طرف لطرف.", results: "✓ يتوافق مع معايير ISO 27001<br>✓ يمنع التسريبات الداخلية<br>✓ يُصدر سجل تدقيق يومي لأي تغيير", icon: "🔒" },
  { title: "دعم فني مخصص 24/7", desc: "فريق دعم مخصص لشركتك فقط، لا يخدم عملاء آخرين.", results: "✓ وقت استجابة أقل من 15 دقيقة<br>✓ حلول مبنية على فهم عميق لعملك<br>✓ لا يوجد انتظار في قائمة الانتظار", icon: "📞" }
];

// --- التعليم ---
const education = [
  { title: "مساعد دراسي تفاعلي", desc: "يجيب على أسئلة الطلاب خارج أوقات المحاضرة.", results: "✓ يقلل العبء على المعلمين بنسبة 50%<br>✓ يرفع مستوى الفهم لدى الطلاب<br>✓ يدعم الرياضيات، العلوم، اللغات", icon: "🎓" },
  { title: "تذكير بالواجبات والامتحانات", desc: "يرسل تنبيهات شخصية لكل طالب حسب جدوله.", results: "✓ يقلل التأخير في تسليم الواجبات بنسبة 70%<br>✓ يحسّن نتائج الامتحانات<br>✓ يتكامل مع Moodle وGoogle Classroom", icon: "🔔" },
  { title: "تصحيح أولي للتمارين", desc: "يقدّم ملاحظات فورية على الإجابات القصيرة.", results: "✓ يوفر وقت التصحيح اليدوي<br>✓ يعطي تغذية راجعة فورية<br>✓ يُظهر نقاط الضعف لكل طالب", icon: "✅" },
  { title: "جدولة الاجتماعات بين الطلاب والمعلمين", desc: "يسمح للطلاب بحجز مواعيد استشارة تلقائيًا.", results: "✓ يلغي الحاجة لتنسيق يدوي<br>✓ يقلل التضارب في المواعيد<br>✓ يرسل تذكيرات تلقائية قبل 1 ساعة", icon: "📆" },
  { title: "تحليل أداء الفصل الدراسي", desc: "يُظهر إحصائيات التفاعل، المشاركة، والنتائج.", results: "✓ يساعد الإدارة في تقييم جودة التعليم<br>✓ يكشف الطلاب المتعثرين مبكرًا<br>✓ يُصدر تقارير شهرية للأهل", icon: "📊" }
];

// --- القطاع الطبي ---
const healthcare = [
  { title: "حجز مواعيد ذكي", desc: "المرضى يختارون وقتهم المناسب دون انتظار.", results: "✓ يقلل الغياب بنسبة 55%<br>✓ يملأ 95% من أوقات العيادة<br>✓ يدعم التذكير عبر SMS وواتساب", icon: "🏥" },
  { title: "تذكير بالأدوية والجرعات", desc: "يرسل تنبيهات يومية حسب وصفة الطبيب.", results: "✓ يحسّن التزام المرضى بالعلاج بنسبة 65%<br>✓ يقلل مضاعفات الجرعات المنسية<br>✓ يدعم التنبيه الصوتي لكبار السن", icon: "💊" },
  { title: "استبيانات ما قبل الزيارة", desc: "يجمع معلومات الحالة الصحية مسبقًا لتوفير الوقت.", results: "✓ يختصر وقت الزيارة بنسبة 40%<br>✓ يحسّن دقة التشخيص<br>✓ يخزن البيانات في السجل الطبي الإلكتروني", icon: "📋" },
  { title: "متابعة المرضى بعد الجراحة", desc: "يرسل أسئلة يومية لمراقبة التعافي.", results: "✓ يكتشف المضاعفات مبكرًا<br>✓ يقلل عدد الزيارات غير الضرورية<br>✓ يرفع رضا المرضى بنسبة 80%", icon: "❤️" },
  { title: "أتمتة الفواتير والتأمين", desc: "يرفع الفواتير تلقائيًا لشركات التأمين.", results: "✓ يقلل رفض المطالبات بنسبة 50%<br>✓ يسرّع استلام المبالغ المستحقة<br>✓ يتكامل مع أنظمة التأمين المحلية", icon: "🧾" }
];

// --- تجميع جميع الخدمات ---
const serviceGroups = {
  all: [...ecommerce, ...influencers, ...smallBusiness, ...enterprise, ...education, ...healthcare],
  ecommerce,
  influencers,
  "small-business": smallBusiness,
  enterprise,
  education,
  healthcare
};

// ========================
// === 2. عرض الخدمات في الشبكة ===
// ========================
function renderServices(group = 'all') {
  const grid = document.getElementById('servicesGrid');
  const backBtn = document.getElementById('backBtn');
  const tabBtns = document.querySelectorAll('.tab-btn');

  if (!grid) return;

  // تحديث حالة أزرار التصنيف
  tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.group === group);
  });

  // إظهار/إخفاء زر العودة
  if (backBtn) {
    backBtn.style.display = group === 'all' ? 'none' : 'block';
  }

  // جلب الخدمات
  const services = serviceGroups[group] || [];

  // عرض الخدمات
  grid.innerHTML = services.map((service, index) => `
    <div class="service-card" data-group="${group}" data-index="${index}">
      <div class="service-icon">${service.icon}</div>
      <h3>${service.title}</h3>
      <p>${service.desc}</p>
    </div>
  `).join('');

  // ربط حدث النقر على كل خدمة
  grid.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
      const group = card.dataset.group;
      const index = parseInt(card.dataset.index);
      const service = serviceGroups[group][index];
      openServiceModal(service);
    });
  });
}

// ========================
// === 3. فتح نافذة التفاصيل ===
// ========================
function openServiceModal(service) {
  if (!service) return;

  const modal = document.getElementById('serviceModal');
  if (!modal) return;

  // ملء المحتوى
  document.getElementById('modalIcon').textContent = service.icon;
  document.getElementById('modalTitle').textContent = service.title;
  document.getElementById('modalDesc').textContent = service.desc;
  document.getElementById('modalResults').innerHTML = 
    service.results.split('<br>').map(r => `<li>${r.replace('✓ ', '')}</li>`).join('');

  // إظهار النافذة
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// ========================
// === 4. إغلاق النافذة ===
// ========================
function closeServiceModal() {
  const modal = document.getElementById('serviceModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// ========================
// === 5. العودة إلى الفئات ===
// ========================
function showAllCategories() {
  renderServices('all');
}

// ========================
// === 6. ربط الأحداث عند التحميل ===
// ========================
document.addEventListener('DOMContentLoaded', () => {
  // عرض جميع الخدمات عند التحميل
  renderServices('all');
  loadFeaturedOffer();

  // ربط أزرار التصنيف
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group;
      renderServices(group);
    });
  });

  // ربط زر الإغلاق في النافذة
  const closeBtn = document.querySelector('.modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeServiceModal);
  }

  // إغلاق النافذة عند النقر على الخلفية
  const modal = document.getElementById('serviceModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeServiceModal();
      }
    });
  }
});
// التعامل مع زر الرجوع/التقدم في المتصفح
window.addEventListener('popstate', function() {
  const hash = window.location.hash.substring(1);
  const validPages = ['home', 'services', 'pricing', 'about', 'contact', 'offers', 'how-it-works', 'faq'];
  if (validPages.includes(hash)) {
    showPage(hash);
  } else {
    showPage('home');
  }
});

// === العرض الذي تحدده أنت ===
const featuredOffer = {
  id: 1,
  title: "عرض رمضان المبارك",
  desc: "اتمتة اول مهمة بعرض يصل الى 40%",
};

// تحميل البيانات
document.getElementById('bannerTitle').textContent = featuredOffer.title;
document.getElementById('bannerDesc').textContent = featuredOffer.desc;
document.getElementById('bannerPrice').textContent = featuredOffer.price;

// العناصر
const banner = document.getElementById('smartBanner');
const collapsed = document.querySelector('.banner-collapsed');
const expanded = document.querySelector('.banner-expanded');
const closeBtn = document.getElementById('bannerClose');
const detailBtn = document.getElementById('bannerDetailBtn');

let isExpanded = false;

// عند النقر على الشريط (باستثناء الزرين)
banner.addEventListener('click', function(e) {
  if (e.target === closeBtn || e.target === detailBtn) return;
  toggleBanner();
});

// عند النقر على زر الإغلاق
closeBtn.addEventListener('click', function(e) {
  e.stopPropagation();
  toggleBanner();
});

// عند النقر على "عرض التفاصيل"
detailBtn.addEventListener('click', function(e) {
  e.preventDefault();
  e.stopPropagation();
  
  // الانتقال إلى صفحة العروض وعرض التفاصيل
  // showPage('offers');
  // setTimeout(() => {
  //   const offer = offers.find(o => o.id === featuredOffer.id);
  //   if (offer) {
  //     const grid = document.getElementById('offersGrid');
  //     const detailSection = document.getElementById('offer-detail-section');
  //     const detailContent = document.getElementById('offer-detail-content');
      
  //     if (grid && detailSection && detailContent) {
  //       grid.classList.add('hidden');
  //       detailContent.innerHTML = offer.details;
  //       detailSection.classList.remove('hidden');
  //     }
  //   }
  //   if (isExpanded) toggleBanner();
  // }, 300);
});

function toggleBanner() {
  if (isExpanded) {
    expanded.classList.add('hidden');
    collapsed.classList.remove('hidden');
  } else {
    collapsed.classList.add('hidden');
    expanded.classList.remove('hidden');
  }
  isExpanded = !isExpanded;
}
// === تحميل تلقائي لبيانات العرض الأبرز ===
function loadFeaturedOffer() {
  const offer = offers.find(o => o.id === FEATURED_OFFER_ID);
  if (offer) {
    document.getElementById('bannerTitle').textContent = offer.title;
    document.getElementById('bannerDesc').textContent = offer.desc;
    document.getElementById('bannerPrice').textContent = offer.price;
  }
}

// === زر "عرض التفاصيل" في الشريط ===
document.getElementById('bannerDetailBtn')?.addEventListener('click', function(e) {
  e.preventDefault();
  e.stopPropagation();

  // اذهب إلى صفحة العروض
  showPage('offers');

  // بعد قليل، افتح تفاصيل العرض المحدد
  setTimeout(() => {
    const offer = offers.find(o => o.id === FEATURED_OFFER_ID);
    if (offer) {
      const grid = document.getElementById('offersGrid');
      const detailSection = document.getElementById('offer-detail-section');
      const detailContent = document.getElementById('offer-detail-content');

      if (grid && detailSection && detailContent) {
        grid.classList.add('hidden');
        detailContent.innerHTML = offer.details;
        detailSection.classList.remove('hidden');
      }
    }
  }, 300);
});
// === معالجة نموذج البريد الإلكتروني ===
function handleNewsletter(event) {
  event.preventDefault();
  const emailInput = event.target.querySelector('input[type="email"]');
  const email = emailInput.value.trim();
  
  if (!email) {
    alert('يرجى إدخال بريد إلكتروني صحيح');
    return;
  }
  
  // يمكنك إرسال البريد إلى خادمك هنا
  console.log('تم تسجيل البريد:', email);
  
  // عرض رسالة نجاح
  alert('تم تسجيل اشتراكك بنجاح! شكراً لك.');
  
  // إعادة تعيين النموذج
  event.target.reset();
}
// ========================
// === الهيرو سلايدر - إصلاح شامل ===
// ========================
let currentSlide = 1;
let totalSlides = 4;
let slideInterval;
let isAutoPlaying = true;

// عرض الشريحة المحددة
function showSlide(slideNumber) {
  // إخفاء جميع الشرائح
  document.querySelectorAll('.hero-modern-slide').forEach(slide => {
    slide.classList.remove('active');
  });
  
  // إخفاء جميع النقاط
  document.querySelectorAll('.dot').forEach(dot => {
    dot.classList.remove('active');
  });
  
  // عرض الشريحة المحددة
  const slideToShow = document.querySelector(`.hero-modern-slide[data-modern-slide="${slideNumber}"]`);
  if (slideToShow) {
    slideToShow.classList.add('active');
  }
  
  // تفعيل النقطة المحددة
  const dotToShow = document.querySelector(`.dot[data-dot="${slideNumber}"]`);
  if (dotToShow) {
    dotToShow.classList.add('active');
  }
  
  currentSlide = slideNumber;
}

// الشريحة التالية
function nextSlide() {
  let next = currentSlide + 1;
  if (next > totalSlides) next = 1;
  showSlide(next);
}

// الشريحة السابقة
function prevSlide() {
  let prev = currentSlide - 1;
  if (prev < 1) prev = totalSlides;
  showSlide(prev);
}

// بدء التمرير التلقائي
function startAutoSlide() {
  if (slideInterval) clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 5000); // كل 5 ثواني
  isAutoPlaying = true;
}

// إيقاف التمرير التلقائي
function stopAutoSlide() {
  clearInterval(slideInterval);
  isAutoPlaying = false;
}

// ========================
// === ربط الأحداث ===
// ========================
document.addEventListener('DOMContentLoaded', () => {
  // التحقق من وجود الهيرو
  const heroSection = document.querySelector('.hero-modern-section');
  if (!heroSection) return;
  
  // عرض الشريحة الأولى عند التحميل
  showSlide(1);
  
  // بدء التمرير التلقائي
  startAutoSlide();
  
  // ربط النقاط
  document.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      stopAutoSlide();
      const slideNumber = parseInt(dot.dataset.dot);
      showSlide(slideNumber);
      startAutoSlide();
    });
  });
  
  // إيقاف التمرير عند تمرير الماوس فوق الهيرو
  heroSection.addEventListener('mouseenter', () => {
    if (isAutoPlaying) {
      stopAutoSlide();
    }
  });
  
  // استئناف التمرير عند مغادرة الماوس
  heroSection.addEventListener('mouseleave', () => {
    if (!isAutoPlaying) {
      startAutoSlide();
    }
  });
  
  // منع التمرير التلقائي عند النقر على الهيرو
  heroSection.addEventListener('click', (e) => {
    // تجاهل النقر على الأزرار أو الروابط
    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
      return;
    }
    
    // إيقاف واستئناف التمرير بالنقر
    if (isAutoPlaying) {
      stopAutoSlide();
    } else {
      startAutoSlide();
    }
  });
  
  // دعم مفاتيح الأسهم
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      stopAutoSlide();
      nextSlide();
      startAutoSlide();
    } else if (e.key === 'ArrowLeft') {
      stopAutoSlide();
      prevSlide();
      startAutoSlide();
    }
  });
});
