/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'ar';

export interface Translations {
  appName: string;
  appSubtitle: string;
  badgeVersion: string;
  registerLoft: string;
  loftSettings: string;
  resetAll: string;
  resetConfirm: string;
  backupExport: string;
  restoreImport: string;
  loadDemoData: string;
  offlineReady: string;
  cloudSynced: string;
  
  // Navigation tabs
  tabDashboard: string;
  tabPigeons: string;
  tabPairs: string;
  tabAviaryLayout: string;
  tabRings: string;
  tabExhibitions: string;
  tabContacts: string;
  tabScoring: string;
  tabFinances: string;
  tabAiAdvisor: string;
  feedCalculator: string;
  commandPalette: string;

  // Onboarding / Register
  registerTitle: string;
  registerSubtitle: string;
  step1Loft: string;
  step2Regional: string;
  step3Species: string;
  step4Incubation: string;
  step5Layout: string;
  aviaryName: string;
  breederName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  ringPrefix: string;
  ringYear: string;
  currency: string;
  unitSystem: string;
  dateFormat: string;
  defaultSpecies: string;
  incubationDays: string;
  clutchSize: string;
  candlingDay: string;
  bandingDay: string;
  weaningDay: string;
  sectionsCount: string;
  finishSetup: string;
  quickDemo: string;
  close: string;
  saveChanges: string;

  // Common terms
  male: string;
  female: string;
  unknown: string;
  active: string;
  breeding: string;
  racing: string;
  sold: string;
  dead: string;
  isolated: string;
  ringNumber: string;
  breed: string;
  phenotype: string;
  genotype: string;
  hatchDate: string;
  father: string;
  mother: string;
  notes: string;
  actions: string;
  cancel: string;
  save: string;
  add: string;
  delete: string;
  edit: string;
  print: string;
  filter: string;
  search: string;
  all: string;
  egg: string;
  chick: string;
  pair: string;
  cage: string;
  section: string;
  coi: string;
  pedigree: string;
  saleCertificate: string;

  // Footer & info
  footerBiosecurity: string;
  footerRights: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "AviarySoft",
    appSubtitle: "Cloud Loft & Aviary Breeding ERP",
    badgeVersion: "Cloud v4.2 • Pro Edition",
    registerLoft: "Aviary Setup / Register",
    loftSettings: "Loft Profile & Settings",
    resetAll: "Reset Data ↺",
    resetConfirm: "Are you sure you want to reset all records and start fresh?",
    backupExport: "Export Backup",
    restoreImport: "Restore Backup",
    loadDemoData: "Load Sample Loft",
    offlineReady: "Offline-First Ready",
    cloudSynced: "Sync Active",

    tabDashboard: "Dashboard & Workflow",
    tabPigeons: "Bird Registry & Pedigrees",
    tabPairs: "Breeding Pairs & Clutches",
    tabAviaryLayout: "Lofts & Nest Boxes",
    tabRings: "Rings Stock & Bands",
    tabExhibitions: "Races & Exhibitions",
    tabContacts: "Breeders & Vets Directory",
    tabScoring: "Genetics & A+ Scoring",
    tabFinances: "Finances & Sales Certs",
    tabAiAdvisor: "AviarySoft AI Advisor",
    feedCalculator: "Feed & Squab Cost Calculator",
    commandPalette: "Quick Spotlight Search",

    registerTitle: "Welcome to AviarySoft Setup",
    registerSubtitle: "Configure your aviary, ring codes, species rules, and loft layout in minutes.",
    step1Loft: "1. Aviary Profile",
    step2Regional: "2. Regional Settings",
    step3Species: "3. Species & Rules",
    step4Incubation: "4. Incubation Calendar",
    step5Layout: "5. Loft Structure",
    aviaryName: "Aviary / Loft Name",
    breederName: "Breeder / Owner Name",
    email: "Email Address",
    phone: "Phone / WhatsApp",
    country: "Country",
    city: "City / Region",
    ringPrefix: "Club / Federation Ring Prefix",
    ringYear: "Ring Year",
    currency: "Currency",
    unitSystem: "Units System",
    dateFormat: "Date Format",
    defaultSpecies: "Primary Bird Species",
    incubationDays: "Incubation Duration (Days)",
    clutchSize: "Standard Clutch Size (Eggs)",
    candlingDay: "Egg Candling Fertility Check (Day)",
    bandingDay: "Chick Banding Age (Days)",
    weaningDay: "Weaning / Separation Age (Days)",
    sectionsCount: "Loft Sections / Aviaries Count",
    finishSetup: "Save & Enter AviarySoft",
    quickDemo: "Fill With Champion Demo Loft",
    close: "Close",
    saveChanges: "Save Profile",

    male: "Cock (Male ♂)",
    female: "Hen (Female ♀)",
    unknown: "Unknown (?)",
    active: "Active",
    breeding: "Breeding",
    racing: "Racing / Competition",
    sold: "Sold",
    dead: "Deceased",
    isolated: "Quarantine / Hospital",
    ringNumber: "Ring / Band ID",
    breed: "Breed / Variety",
    phenotype: "Color & Phenotype",
    genotype: "Genotype / Genetics",
    hatchDate: "Hatch Date",
    father: "Sire (Father)",
    mother: "Dam (Mother)",
    notes: "Notes & Achievements",
    actions: "Actions",
    cancel: "Cancel",
    save: "Save",
    add: "Add New",
    delete: "Delete",
    edit: "Edit",
    print: "Print / Export",
    filter: "Filter",
    search: "Search by Ring, Color, Breed...",
    all: "All",
    egg: "Egg",
    chick: "Chick",
    pair: "Pair",
    cage: "Nest Box / Cage",
    section: "Section / Loft",
    coi: "COI (Inbreeding)",
    pedigree: "Multi-Gen Pedigree",
    saleCertificate: "Sale Certificate",

    footerBiosecurity: "AviarySoft Biosecurity & Genetics Cloud ERP • Automated candling (5d), hatch alerts (18d), and banding schedules.",
    footerRights: "All data encrypted and stored locally in your browser for absolute confidentiality and offline availability."
  },
  ar: {
    appName: "أفياري سوفت | AviarySoft",
    appSubtitle: "نظام إدارة مزارع وطيور الحمام السحابي",
    badgeVersion: "إصدار السحابة v4.2 • الاحترافي",
    registerLoft: "تسجيل / إعداد اللوفت",
    loftSettings: "بيانات المنشأة واللوفت",
    resetAll: "تصفير السجلات ↺",
    resetConfirm: "هل أنت متأكد من تصفير كافة السجلات والبدء بسجل فارغ؟",
    backupExport: "تصدير نسخة احتياطية",
    restoreImport: "استعادة نسخة",
    loadDemoData: "تحميل بيانات تجريبية",
    offlineReady: "يعمل أوفلاين بالكامل",
    cloudSynced: "المزامنة نشطة",

    tabDashboard: "لوحة التحكم والكانبان",
    tabPigeons: "سجل الطيور والأنساب",
    tabPairs: "الأزواج وحضانات البيض",
    tabAviaryLayout: "أقسام اللوفت وخانات العيون",
    tabRings: "مخزون الحجول والدبل الرسمية",
    tabExhibitions: "السباقات والمعارض",
    tabContacts: "دليل المربين والبيطريين",
    tabScoring: "الوراثة وتقييم الأزواج (A+)",
    tabFinances: "المالية وشهادات البيع",
    tabAiAdvisor: "مساعد AviarySoft الذكي",
    feedCalculator: "حاسبة الأعلاف وتكلفة الزغلول",
    commandPalette: "البحث الشامل الفوري",

    registerTitle: "مرحباً بك في معالج إعداد AviarySoft",
    registerSubtitle: "قم بتهيئة اللوفت، رموز الحجول، قواعد الحضانة وهيكل الأقفاص بسهولة.",
    step1Loft: "١. بيانات المزرعة واللوفت",
    step2Regional: "٢. الإعدادات الإقليمية",
    step3Species: "٣. السلالات والقواعد",
    step4Incubation: "٤. روزنامة التحضين والتفريخ",
    step5Layout: "٥. هيكل اللوفت والأقسام",
    aviaryName: "اسم المزرعة / اللوفت",
    breederName: "اسم المربي / المالك",
    email: "البريد الإلكتروني",
    phone: "الهاتف / واتساب",
    country: "الدولة",
    city: "المدينة / المنطقة",
    ringPrefix: "بادئة حجول النادي / الاتحاد",
    ringYear: "سنة الحجول",
    currency: "العملة",
    unitSystem: "نظام القياس",
    dateFormat: "صيغة التاريخ",
    defaultSpecies: "نوع الطيور الرئيسي",
    incubationDays: "مدة حضانة البيض (أيام)",
    clutchSize: "حجم العش القياسي (بيض)",
    candlingDay: "كشف تخصيب البيض (يوم)",
    bandingDay: "عمر تركيب الحجل للفرخ (أيام)",
    weaningDay: "عمر الفطام والعزل (أيام)",
    sectionsCount: "عدد أقسام ومطارات اللوفت",
    finishSetup: "حفظ وبدء استخدام AviarySoft",
    quickDemo: "تعبئة ببيانات لوفت أبطال تجريبية",
    close: "إغلاق",
    saveChanges: "حفظ الإعدادات",

    male: "ذكر ♂ (Cock)",
    female: "أنثى ♀ (Hen)",
    unknown: "غير محدد (?)",
    active: "نشط باللوفت",
    breeding: "مخصص للإنتاج",
    racing: "فريق السباقات والطيران",
    sold: "تم البيع",
    dead: "نافق",
    isolated: "عزل صحي / حجر",
    ringNumber: "رقم الحجل / الدبلة",
    breed: "السلالة / النوع",
    phenotype: "اللون والمظهر الخارجي",
    genotype: "التركيب الوراثي (Genotype)",
    hatchDate: "تاريخ الفقس والولادة",
    father: "الأب (Sire)",
    mother: "الأم (Dam)",
    notes: "الملاحظات والإنجازات",
    actions: "الإجراءات",
    cancel: "إلغاء",
    save: "حفظ",
    add: "إضافة جديد",
    delete: "حذف",
    edit: "تعديل",
    print: "طباعة / تصدير",
    filter: "تصفية",
    search: "بحث بالحجل، اللون، السلالة...",
    all: "الكل",
    egg: "بيضة",
    chick: "فرخ / زغلول",
    pair: "زوج",
    cage: "خانة العش / العين",
    section: "قسم / مطار",
    coi: "معامل المصاهرة (COI)",
    pedigree: "شجرة النسب الموثقة",
    saleCertificate: "شهادة نقل وبيوع رسمية",

    footerBiosecurity: "منصة AviarySoft لإدارة مزارع الحمام والأمان الحيوي • الكشف الآلي (5 أيام) والفقس (18 يوماً) والفطام.",
    footerRights: "كافة البيانات مشفرة ومحفوظة محلياً بجهازك لضمان أعلى درجات السرية والعمل دون إنترنت."
  }
};
