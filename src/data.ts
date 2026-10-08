/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Pigeon, 
  Breed, 
  Pair, 
  ProductionCycle, 
  ChickWeight, 
  MedicalRecord, 
  InventoryItem, 
  Transaction, 
  AviaryProfile, 
  LoftSection, 
  NestBox, 
  MutationTrait,
  RingStock,
  Contact
} from './types';

// الملف التعريفي لمنشأة اللوفت ومزرعة الحمام
export const DEFAULT_AVIARY_PROFILE: AviaryProfile = {
  id: 'aviary-pigeons-main',
  aviaryName: 'لوفت الأبطال الملكي لإنتاج الحمام | Royal Pigeon Loft',
  breederName: 'الكابتن محمد الشقماني & فريق اللوفت',
  email: 'alshqmani@gmail.com',
  phone: '+966 50 882 1920',
  country: 'المملكة العربية السعودية',
  city: 'الرياض - غرفة التفريخ الرئيسية',
  ringPrefix: 'KSA-2026',
  ringYear: 2026,
  currency: 'SAR (ر.س)',
  unitSystem: 'metric',
  dateFormat: 'YYYY-MM-DD',
  defaultSpecies: 'حمام (Columba livia)',
  defaultIncubationDays: 18,
  defaultClutchSize: 2,
  candlingDays: 5,
  bandingAgeDays: 7,
  weaningAgeDays: 25,
  isRegistered: true,
  createdAt: '2026-01-15',
};

// سلالات الحمام المعتمدة وإمكانية إضافة المزيد
export const MOCK_BREEDS: Breed[] = [
  { 
    id: 'b1', 
    breed_name: 'تكسan (Texan Pioneer)', 
    category: 'Meat', 
    origin_country: 'الولايات المتحدة',
    is_auto_sexing: true, 
    incubation_days_default: 18,
    standard_weight_grams: 850,
    description: 'سلالة لاحمة ممتازة ذات تجنيس ذاتي فور الفقس: الذكر ريش خفيف فاتح والأنثى ريش كثيف داكن.' 
  },
  { 
    id: 'b2', 
    breed_name: 'زاجل أصيل (Racing Homer)', 
    category: 'Racing', 
    origin_country: 'بلجيكا',
    is_auto_sexing: false, 
    incubation_days_default: 18,
    standard_weight_grams: 480,
    description: 'أقوى سلالة طيران ورجوع، بنية عضلية قوية وجهاز مناعي فولاذي.' 
  },
  { 
    id: 'b3', 
    breed_name: 'كينج جامبو (King Squabbing)', 
    category: 'Meat', 
    origin_country: 'أمريكا',
    is_auto_sexing: false, 
    incubation_days_default: 18,
    standard_weight_grams: 980,
    description: 'سلالة ثقيلة جداً لإنتاج أضخم زغاليل لحم تجارية.' 
  },
  { 
    id: 'b4', 
    breed_name: 'بخارى ترامبيتر (Bokhara Trumpeter)', 
    category: 'Fancy', 
    origin_country: 'آسيا الوسطى',
    is_auto_sexing: false, 
    incubation_days_default: 18,
    standard_weight_grams: 600,
    description: 'حمام زينة ملكي ذو تاج مزدوج وشروال ريشي ضخم وصوت تغريد يشبه البوق.' 
  },
  { 
    id: 'b5', 
    breed_name: 'مودينا جازي (Modena Gazzi)', 
    category: 'Fancy', 
    origin_country: 'إيطاليا',
    is_auto_sexing: false, 
    incubation_days_default: 18,
    standard_weight_grams: 420,
    description: 'حمام بشكل مميز يشبه الدجاجة مع ذيل مرتفع وألوان نقية.' 
  },
  { 
    id: 'b6', 
    breed_name: 'فانتيل هندي (Indian Fantail)', 
    category: 'Fancy', 
    origin_country: 'الهند',
    is_auto_sexing: false, 
    incubation_days_default: 18,
    standard_weight_grams: 450,
    description: 'ذيل مروحي دائري يشبه ريش الطاووس بوقفة فخورة وشروال للأرجل.' 
  },
  { 
    id: 'b7', 
    breed_name: 'مونداين فرنسي (French Mondain)', 
    category: 'Meat', 
    origin_country: 'فرنسا',
    is_auto_sexing: false, 
    incubation_days_default: 18,
    standard_weight_grams: 950,
    description: 'حمام لحم فرنسي عريض الصدر وهادئ الطباع وغزير الإنتاج.' 
  }
];

// مكتبة الطفرات، الألوان، الجينات، والصفات الشكلية للحمام
export const DEFAULT_MUTATIONS: MutationTrait[] = [
  { id: 'm-1', name: 'أزرق خطين (Blue Bar)', type: 'Color', colorHex: '#3b82f6', description: 'النمط البري الأساسي بخطين أسودين على الجناح' },
  { id: 'm-2', name: 'أزرق مبقع (Blue Checker)', type: 'Color', colorHex: '#2563eb', description: 'نقوش شطرنجية داكنة فوق اللون الأزرق' },
  { id: 'm-3', name: 'لوزي ألموند (Almond St/+)', type: 'Mutation', colorHex: '#d97706', description: 'طفرة التخفيف المرتبطة بالجنس، تعطي ألواناً مبقعة ساحرة' },
  { id: 'm-4', name: 'أبيض تكسان مخفف (Faded Double St/St)', type: 'Gene', colorHex: '#e2e8f0', description: 'جين التخفيف المزدوج للذكور ذاتية التجنيس' },
  { id: 'm-5', name: 'أحمر قرميدي (Ash-Red BA)', type: 'Color', colorHex: '#dc2626', description: 'الجين السائد للأحمر القرميدي مع أطراف أجنحة رمادية' },
  { id: 'm-6', name: 'أسود فحمي نقي (Spread Black)', type: 'Color', colorHex: '#1e293b', description: 'جين التغطية الكاملة للون الأسود الحالك' },
  { id: 'm-7', name: 'أبيض نقي متنحي (Recessive White z/z)', type: 'Gene', colorHex: '#f8fafc', description: 'أبيض صافي مع عيون كرزية أو سوداء داكنة' },
  { id: 'm-8', name: 'تايجر جريزل (Tiger Grizzle)', type: 'Mutation', colorHex: '#78716c', description: 'تداخل الريش الأبيض والملون بنمط مرخم يشبه جلد النمر' },
  { id: 'm-9', name: 'شروال أرجل ريشي (Grouse / Muffed)', type: 'Trait', colorHex: '#64748b', description: 'ريش كثيف يغطي الأرجل والأصابع' },
  { id: 'm-10', name: 'تاج وقنبرة خلفية (Crest / Hood)', type: 'Trait', colorHex: '#a855f7', description: 'تاج من الريش المنتصب في مؤخرة الرأس' }
];

// سجل الحمام الفردي مع سجل الأوزان والصور والزيجات
export const MOCK_PIGEONS: Pigeon[] = [
  {
    id: 'p1',
    ring_number: 'TX-2025-0100',
    name: 'الزعيم تكسان 👑',
    sex: 'Male',
    breed: 'تكسان (Texan Pioneer)',
    birth_date: '2024-04-10',
    status: 'Breeding',
    phenotype: 'أبيض منقط برسمة خفيفة (Faded)',
    genotype: 'St/St (جين التخفيف المزدوج)',
    mutations: ['أبيض تكسان مخفف (Faded Double St/St)'],
    loft_section_id: 'sec-1',
    nest_box_number: 'Box 01-A',
    coi_percentage: 1.2,
    image_url: 'https://images.unsplash.com/photo-1549608276-5786777e6587?w=600&auto=format&fit=crop&q=80',
    notes: 'ذكر منتج قياسي فحل، أعلى نسبة إخصاب، بطل السلالة وحجم عريض 880 جرام.',
    purchase_price: 350,
    photos: [
      { id: 'ph-1', url: 'https://images.unsplash.com/photo-1549608276-5786777e6587?w=600&auto=format&fit=crop&q=80', date: '2025-01-15', caption: 'فحص البنية وريش الجناح الكامل' },
      { id: 'ph-2', url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=600&auto=format&fit=crop&q=80', date: '2025-08-20', caption: 'في عين التفريخ رقم 01-A' }
    ],
    weights: [
      { id: 'pw-1', date: '2025-01-10', weight_grams: 820, notes: 'وزن بداية الموسم' },
      { id: 'pw-2', date: '2025-06-15', weight_grams: 860, notes: 'قمة اللياقة والإنتاج' },
      { id: 'pw-3', date: '2026-02-01', weight_grams: 885, notes: 'أعلى وزن مسجل' }
    ]
  },
  {
    id: 'p2',
    ring_number: 'TX-2025-0112',
    name: 'الأميرة اللوزية 💎',
    sex: 'Female',
    breed: 'تكسان (Texan Pioneer)',
    birth_date: '2024-05-15',
    status: 'Breeding',
    phenotype: 'لوزي داكن (Almond)',
    genotype: 'St/+ (غير متماثل الأم)',
    mutations: ['لوزي ألموند (Almond St/+)'],
    loft_section_id: 'sec-1',
    nest_box_number: 'Box 01-A',
    coi_percentage: 1.2,
    image_url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&auto=format&fit=crop&q=80',
    notes: 'أنثى حنونة جداً، معدل فقس 100%، ترعى الزغاليل بحرص شديد.',
    purchase_price: 320,
    photos: [
      { id: 'ph-3', url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&auto=format&fit=crop&q=80', date: '2025-02-10', caption: 'صورة توثيق اللون اللوزي النقي' }
    ],
    weights: [
      { id: 'pw-4', date: '2025-02-15', weight_grams: 740, notes: 'قبل وضع أول عش' },
      { id: 'pw-5', date: '2025-11-20', weight_grams: 775, notes: 'وزن مستقر وصحة ممتازة' }
    ]
  },
  {
    id: 'p3',
    ring_number: 'TX-2025-0210',
    name: 'رعد التكسان الابن',
    sex: 'Male',
    breed: 'تكسان (Texan Pioneer)',
    birth_date: '2025-03-24',
    status: 'Active',
    phenotype: 'أبيض مغبر متجانس',
    genotype: 'St/St',
    mutations: ['أبيض تكسان مخفف (Faded Double St/St)'],
    loft_section_id: 'sec-2',
    coi_percentage: 2.1,
    image_url: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=600&auto=format&fit=crop&q=80',
    notes: 'ابن الفحل (0100) والأنثى (0112). وزن قياسي عند الفطام 620 جرام.',
    origin_father_id: 'p1',
    origin_father_ring: 'TX-2025-0100',
    origin_mother_id: 'p2',
    origin_mother_ring: 'TX-2025-0112',
    weights: [
      { id: 'pw-6', date: '2025-04-21', weight_grams: 620, notes: 'عمر 28 يوم - فطام قياسي' },
      { id: 'pw-7', date: '2025-09-01', weight_grams: 790, notes: 'عمر 5 شهور' }
    ]
  },
  {
    id: 'p4',
    ring_number: 'TX-2025-0222',
    name: 'ياقوتة سوداء',
    sex: 'Female',
    breed: 'تكسان (Texan Pioneer)',
    birth_date: '2025-03-24',
    status: 'Active',
    phenotype: 'أسود فحمي داكن',
    genotype: '+/Y (جين بري عادي)',
    mutations: ['أسود فحمي نقي (Spread Black)'],
    loft_section_id: 'sec-2',
    coi_percentage: 2.1,
    image_url: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=600&auto=format&fit=crop&q=80',
    notes: 'ابنة الفحل (0100) والأنثى (0112). ظهرت بلون داكن دليلاً على التجنيس الذاتي للأنثى.',
    origin_father_id: 'p1',
    origin_father_ring: 'TX-2025-0100',
    origin_mother_id: 'p2',
    origin_mother_ring: 'TX-2025-0112',
    weights: [
      { id: 'pw-8', date: '2025-04-21', weight_grams: 580, notes: 'عمر 28 يوم' }
    ]
  },
  {
    id: 'p5',
    ring_number: 'RC-2024-9981',
    name: 'البرق الأزرق (البطل 400كم)',
    sex: 'Male',
    breed: 'زاجل أصيل (Racing Homer)',
    birth_date: '2024-01-10',
    status: 'Breeding',
    phenotype: 'أزرق خطين (Blue Bar)',
    genotype: 'd+/d+ (أزرق مكثف)',
    mutations: ['أزرق خطين (Blue Bar)'],
    loft_section_id: 'sec-1',
    nest_box_number: 'Box 02-A',
    coi_percentage: 0.8,
    image_url: 'https://images.unsplash.com/photo-1549608276-5786777e6587?w=600&auto=format&fit=crop&q=80',
    notes: 'أسرع عودة في سباق 400 كم، صدر عريض وريش زيتي ناعم عازل للماء.',
    purchase_price: 800,
    weights: [
      { id: 'pw-9', date: '2025-01-01', weight_grams: 485, notes: 'وزن مثالي للطيران السريع' }
    ]
  },
  {
    id: 'p6',
    ring_number: 'RC-2024-9988',
    name: 'نجمة الرياح',
    sex: 'Female',
    breed: 'زاجل أصيل (Racing Homer)',
    birth_date: '2024-02-12',
    status: 'Breeding',
    phenotype: 'أزرق مبقع (Blue Checker)',
    genotype: 'C/C (مبقع وراثياً)',
    mutations: ['أزرق مبقع (Blue Checker)'],
    loft_section_id: 'sec-1',
    nest_box_number: 'Box 02-A',
    coi_percentage: 0.8,
    image_url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&auto=format&fit=crop&q=80',
    notes: 'أنثى من خطوط طيران جبلية ممتدة وسرعة عودة فائقة.',
    weights: [
      { id: 'pw-10', date: '2025-01-01', weight_grams: 450, notes: 'وزن إنتاجي' }
    ]
  },
  {
    id: 'p7',
    ring_number: 'KG-2025-0402',
    name: 'العملاق الأبيض (كينج جامبو)',
    sex: 'Male',
    breed: 'كينج جامبو (King Squabbing)',
    birth_date: '2023-11-05',
    status: 'Breeding',
    phenotype: 'أبيض ثلجي عيون سوداء',
    genotype: 'z/z (أبيض متنحي)',
    mutations: ['أبيض نقي متنحي (Recessive White z/z)'],
    loft_section_id: 'sec-1',
    nest_box_number: 'Box 03-A',
    coi_percentage: 1.5,
    image_url: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=600&auto=format&fit=crop&q=80',
    notes: 'أضخم فرد في اللوفت بوزن 1,020 جرام! ينتج أثقل زغاليل للتسمين التجاري.',
    purchase_price: 500,
    weights: [
      { id: 'pw-11', date: '2025-03-01', weight_grams: 990, notes: 'وزن الربيع' },
      { id: 'pw-12', date: '2026-01-10', weight_grams: 1020, notes: 'أعلى وزن مسجل باللوفت 🏆' }
    ]
  },
  {
    id: 'p8',
    ring_number: 'KG-2025-0409',
    name: 'ملكة الكينج الفضية',
    sex: 'Female',
    breed: 'كينج جامبو (King Squabbing)',
    birth_date: '2024-01-28',
    status: 'Breeding',
    phenotype: 'فضي فاتح',
    genotype: 'z/z',
    mutations: ['أبيض نقي متنحي (Recessive White z/z)'],
    loft_section_id: 'sec-1',
    nest_box_number: 'Box 03-A',
    coi_percentage: 1.5,
    notes: 'شريكة العملاق الأبيض في القفص 03-A، تنتج زغاليل وزن 700 جم عند الفطام.',
    weights: [
      { id: 'pw-13', date: '2025-03-01', weight_grams: 880, notes: 'وزن قياسي لأنثى كينج' }
    ]
  }
];

// الأزواج المنتجة
export const MOCK_PAIRS: Pair[] = [
  {
    id: 'pair1',
    male_id: 'p1',
    male_ring: 'TX-2025-0100 (الزعيم تكسان 👑)',
    female_id: 'p2',
    female_ring: 'TX-2025-0112 (الأميرة اللوزية 💎)',
    start_date: '2025-01-15',
    status: 'Active',
    cage_number: 'عين التفريخ 01-A',
    section_id: 'sec-1',
    pair_score_grade: 'A+'
  },
  {
    id: 'pair2',
    male_id: 'p5',
    male_ring: 'RC-2024-9981 (البرق الأزرق 400كم)',
    female_id: 'p6',
    female_ring: 'RC-2024-9988 (نجمة الرياح)',
    start_date: '2025-02-01',
    status: 'Active',
    cage_number: 'عين الزواجل 02-A',
    section_id: 'sec-1',
    pair_score_grade: 'A'
  },
  {
    id: 'pair3',
    male_id: 'p7',
    male_ring: 'KG-2025-0402 (العملاق الأبيض 1020جم)',
    female_id: 'p8',
    female_ring: 'KG-2025-0409 (ملكة الكينج)',
    start_date: '2025-02-20',
    status: 'Active',
    cage_number: 'قسم اللاحم 03-A',
    section_id: 'sec-1',
    pair_score_grade: 'A+'
  }
];

// دورات وحضانات البيض
export const MOCK_CYCLES: ProductionCycle[] = [
  {
    id: 'c1',
    pair_id: 'pair1',
    pair_label: 'TX-2025-0100 ♂ × TX-2025-0112 ♀',
    egg1_date: '2025-03-05',
    egg1_status: 'Hatched',
    egg2_date: '2025-03-07',
    egg2_status: 'Hatched',
    expected_hatch_date: '2025-03-23',
    actual_hatch_date: '2025-03-24',
    fertile_eggs_count: 2,
    hatched_chicks_count: 2,
    weaned_chicks_count: 2,
    is_fostered_in: false,
    notes: 'دورة تفريخ نموذجية 100%، تم فطام الزغلولين (p3, p4).'
  },
  {
    id: 'c2',
    pair_id: 'pair2',
    pair_label: 'RC-2024-9981 ♂ × RC-2024-9988 ♀',
    egg1_date: '2025-04-10',
    egg1_status: 'Hatched',
    egg2_date: '2025-04-12',
    egg2_status: 'Hatched',
    expected_hatch_date: '2025-04-28',
    actual_hatch_date: '2025-04-29',
    fertile_eggs_count: 2,
    hatched_chicks_count: 2,
    weaned_chicks_count: 2,
    is_fostered_in: false,
    notes: 'فقس فرخين زاجل بصحة ممتازة وتغذية متوازنة.'
  },
  {
    id: 'c3',
    pair_id: 'pair1',
    pair_label: 'TX-2025-0100 ♂ × TX-2025-0112 ♀',
    egg1_date: '2026-05-20',
    egg1_status: 'Fertile',
    egg2_date: '2026-05-22',
    egg2_status: 'Fertile',
    expected_hatch_date: '2026-06-07',
    fertile_eggs_count: 2,
    hatched_chicks_count: 0,
    weaned_chicks_count: 0,
    is_fostered_in: false,
    notes: 'تم فحص التخصيب بالضوء: شبكة دموية عنكبوتية حية بالبيضتين.'
  },
  {
    id: 'c4',
    pair_id: 'pair3',
    pair_label: 'KG-2025-0402 ♂ × KG-2025-0409 ♀',
    egg1_date: '2026-05-06',
    egg1_status: 'Fertile',
    egg2_date: '2026-05-08',
    egg2_status: 'Fertile',
    expected_hatch_date: '2026-05-24',
    fertile_eggs_count: 2,
    hatched_chicks_count: 0,
    weaned_chicks_count: 0,
    is_fostered_in: false,
    notes: 'موعد الفقس المتوقع اليوم! تفقد طاسة العش للنقر الأول.'
  }
];

// أوزان الزغاليل
export const MOCK_WEIGHTS: ChickWeight[] = [
  { id: 'w1', cycle_id: 'c1', chick_identifier: 'رعد التكسان (p3)', weight_date: '2025-03-31', weight_grams: 130, notes: 'عمر 7 أيام - تركيب الحجل' },
  { id: 'w2', cycle_id: 'c1', chick_identifier: 'رعد التكسان (p3)', weight_date: '2025-04-07', weight_grams: 310, notes: 'عمر 14 يوم' },
  { id: 'w3', cycle_id: 'c1', chick_identifier: 'رعد التكسان (p3)', weight_date: '2025-04-14', weight_grams: 520, notes: 'عمر 21 يوم' },
  { id: 'w4', cycle_id: 'c1', chick_identifier: 'رعد التكسان (p3)', weight_date: '2025-04-21', weight_grams: 620, notes: 'عمر 28 يوم - فطام قياسي 🏆' },
  { id: 'w5', cycle_id: 'c1', chick_identifier: 'ياقوتة سوداء (p4)', weight_date: '2025-04-21', weight_grams: 580, notes: 'عمر 28 يوم' }
];

// السجلات الطبية
export const MOCK_MEDICALS: MedicalRecord[] = [
  {
    id: 'm1',
    pigeon_id: 'p6',
    disease_symptoms: 'التهاب في الحويصلة وبدايات تكنكر (Canker)',
    medicine_name: 'مترونيدازول (Metronidazole - فلاجيل طيور)',
    start_date: '2026-05-20',
    end_date: '2026-05-25',
    withdrawal_days: 7,
    is_active: true,
    type: 'Treatment'
  },
  {
    id: 'm2',
    pigeon_id: 'p1',
    disease_symptoms: 'تحصين النيوكاسل (الصرع) السنوي الوقائي',
    medicine_name: 'لقاح باراميكسو فيروس ميت زيتي (PMV-1)',
    start_date: '2026-01-15',
    end_date: '2026-01-15',
    withdrawal_days: 0,
    is_active: false,
    type: 'Vaccination'
  }
];

// أقسام المنشأة واللوفت
export const DEFAULT_LOFT_SECTIONS: LoftSection[] = [
  {
    id: 'sec-1',
    name: 'غرفة التفريخ الملكية (Royal Breeding Loft)',
    type: 'Breeding',
    capacity: 24,
    nestBoxesCount: 12,
    description: 'خانات تفريخ محكمة الإغلاق ومكيفة مع نظام إضاءة شروق وغروب آلي.'
  },
  {
    id: 'sec-2',
    name: 'مطار الزغاليل والشبابيات (Young Bird Aviary)',
    type: 'YoungBirds',
    capacity: 40,
    nestBoxesCount: 0,
    description: 'مطار شمسي واسع لتدريب الزغاليل بعد الفطام وبناء العضلات.'
  },
  {
    id: 'sec-3',
    name: 'عنبر العزل والأمان الحيوي (Bio-Quarantine Bay)',
    type: 'Quarantine',
    capacity: 10,
    nestBoxesCount: 4,
    description: 'غرفة معزولة لاستقبال الطيور الجديدة وفحصها قبل دخول اللوفت.'
  }
];

// خانات العشوش
export const DEFAULT_NEST_BOXES: NestBox[] = [
  { id: 'box-101', sectionId: 'sec-1', boxNumber: 'Box 01-A', currentPairId: 'pair1', status: 'Incubating', notes: 'زوج التكسان الزعيم والأميرة' },
  { id: 'box-102', sectionId: 'sec-1', boxNumber: 'Box 02-A', currentPairId: 'pair2', status: 'Occupied', notes: 'زوج الزاجل البطل' },
  { id: 'box-103', sectionId: 'sec-1', boxNumber: 'Box 03-A', currentPairId: 'pair3', status: 'FeedingChicks', notes: 'زوج الكينج الجامبو' },
  { id: 'box-104', sectionId: 'sec-1', boxNumber: 'Box 04-A', status: 'Empty', notes: 'معقمة ونظيفة ومجهزة بنشارة خشب أرز' },
  { id: 'box-105', sectionId: 'sec-1', boxNumber: 'Box 05-B', status: 'Empty', notes: 'جاهزة لتزويج جديد' },
];

// مخزون الحجول المعدنية
export const DEFAULT_RING_STOCKS: RingStock[] = [
  {
    id: 'ring-batch-2026',
    year: 2026,
    prefix: 'KSA-2026',
    seriesStart: 100,
    seriesEnd: 300,
    currentNumber: 125,
    ringSizeMm: 8.0,
    clubName: 'الاتحاد الوطني للحمام',
    colorHex: '#f59e0b',
    assignedRings: {
      'TX-2025-0100': { birdId: 'p1', date: '2026-01-10' },
      'TX-2025-0112': { birdId: 'p2', date: '2026-02-15' },
      'TX-2025-0210': { birdId: 'p3', date: '2026-03-24' }
    }
  }
];

// جهات الاتصال والمربين
export const DEFAULT_CONTACTS: Contact[] = [
  {
    id: 'c-1',
    name: 'د. يوسف الشامي (طبيب بيطري مختص طيور)',
    type: 'Vet',
    phone: '+966 50 123 4567',
    email: 'dr.shami@vet-pigeon.com',
    city: 'الرياض',
    notes: 'مختص تحاليل PCR والتطعيمات والكنكر والسالمونيلا',
    rating: 5
  },
  {
    id: 'c-2',
    name: 'الكابتن فهد الدوسري (مربي زاجل وتكسان)',
    type: 'Breeder',
    phone: '+966 55 987 6543',
    city: 'الدمام',
    notes: 'مصدر سلالة التكسان الفحل الزعيم',
    rating: 5
  }
];

// مخزون الأعلاف
export const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: 'i1',
    item_name: 'ذرة صفراء وبيضاء مجروشة ناعم',
    category: 'Feed',
    quantity_available: 45,
    unit: 'كجم',
    minimum_alert_level: 50,
    price_per_unit: 1.2
  },
  {
    id: 'i2',
    item_name: 'خلطة بروتين مشكل كلفة حمام (بازلاء، عصفر، ذرة عويجة)',
    category: 'Feed',
    quantity_available: 140,
    unit: 'كجم',
    minimum_alert_level: 30,
    price_per_unit: 2.2
  },
  {
    id: 'i3',
    item_name: 'أقراص فلاجيل علاج الكنكر والنزلات المعوية',
    category: 'Medicine',
    quantity_available: 12,
    unit: 'علبة',
    minimum_alert_level: 5,
    expiry_date: '2027-10-14',
    price_per_unit: 14.5
  },
  {
    id: 'i4',
    item_name: 'لقاح النيوكاسل (تحصين الصرع الميت)',
    category: 'Medicine',
    quantity_available: 2,
    unit: 'أمبول 100 جرعة',
    minimum_alert_level: 3,
    expiry_date: '2026-11-20',
    price_per_unit: 25.0
  }
];

// المعاملات المالية
export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', transaction_type: 'Expense', amount: 150, date: '2026-05-01', category: 'شراء أعلاف', description: 'شراء 75كجم كلفة بروتينية حمام متميزة' },
  { id: 't2', transaction_type: 'Income', amount: 450, date: '2026-05-05', category: 'مبيعات طيور', description: 'بيع زوج حمام كينج جامبو بعمر الفطام' },
  { id: 't3', transaction_type: 'Expense', amount: 45, date: '2026-05-12', category: 'أدوية ومعدات', description: 'علبتين علاج معوي ومكمل فيتامينات طاقة' },
  { id: 't4', transaction_type: 'Income', amount: 600, date: '2026-05-18', category: 'مبيعات طيور', description: 'بيع فرخ تكسان لاحم ذو نسب موثق' }
];

export interface ScoreWeights {
  cycle_speed: number;
  hatch_rate: number;
  chick_weight: number;
  health_resilience: number;
}

export const DEFAULT_SCORE_WEIGHTS: ScoreWeights = {
  cycle_speed: 25,
  hatch_rate: 25,
  chick_weight: 25,
  health_resilience: 25
};
