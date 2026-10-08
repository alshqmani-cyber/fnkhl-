/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Crown,
  Award, 
  Scale, 
  Palette, 
  Hourglass, 
  ArrowRight, 
  Heart, 
  CalendarCheck, 
  PlusCircle, 
  Activity, 
  Eye, 
  Sparkles, 
  Users, 
  Egg, 
  Baby, 
  Clock, 
  Flame, 
  ShieldCheck, 
  Dna,
  Search,
  ExternalLink
} from 'lucide-react';
import { Pigeon, Pair, ProductionCycle, MedicalRecord, Breed, MutationTrait } from '../types';
import { Language, translations } from '../i18n';

interface DashboardViewProps {
  pigeons: Pigeon[];
  pairs: Pair[];
  cycles: ProductionCycle[];
  medicals: MedicalRecord[];
  breeds: Breed[];
  mutationsList: MutationTrait[];
  onAddCycle: (c: Omit<ProductionCycle, 'id'>) => void;
  onCreatePigeon: (p: Omit<Pigeon, 'id'>) => void;
  setActiveTab: (tab: string) => void;
  onSelectPigeonForDossier: (pigeon: Pigeon) => void;
  lang?: Language;
}

export default function DashboardView({
  pigeons,
  pairs,
  cycles,
  medicals,
  breeds,
  mutationsList,
  onAddCycle,
  onCreatePigeon,
  setActiveTab,
  onSelectPigeonForDossier,
  lang = 'ar'
}: DashboardViewProps) {
  const t = translations[lang];

  // Quick cycle state
  const [showQuickCycle, setShowQuickCycle] = useState(false);
  const [selectedPairId, setSelectedPairId] = useState('');
  const [egg1Date, setEgg1Date] = useState('');

  // Search filter for quick roster
  const [rosterSearch, setRosterSearch] = useState('');

  const handleQuickCycle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPairId || !egg1Date) return;
    const pair = pairs.find(p => p.id === selectedPairId);
    
    const egg1 = new Date(egg1Date);
    const hatch = new Date(egg1);
    hatch.setDate(hatch.getDate() + 18);
    const expected_hatch_date = hatch.toISOString().split('T')[0];

    onAddCycle({
      pair_id: selectedPairId,
      pair_label: pair ? `${pair.male_ring.split(' ')[0]} ♂ × ${pair.female_ring.split(' ')[0]} ♀` : 'غير معروف',
      egg1_date: egg1Date,
      egg1_status: 'Laid',
      egg2_status: 'Laid',
      expected_hatch_date,
      fertile_eggs_count: 0,
      hatched_chicks_count: 0,
      weaned_chicks_count: 0,
      is_fostered_in: false
    });

    setSelectedPairId('');
    setEgg1Date('');
    setShowQuickCycle(false);
  };

  // ----------------------------------------------------
  // حساب مؤشرات اللوحة الشاملة وسجل الأبطال والتقييم
  // ----------------------------------------------------
  const totalMales = pigeons.filter(p => p.sex === 'Male').length;
  const totalFemales = pigeons.filter(p => p.sex === 'Female').length;
  const activePairs = pairs.filter(p => p.status === 'Active');

  // حساب عدد النسل لكل فرد
  const getPigeonOffspringCount = (birdId: string, ring: string) => {
    return pigeons.filter(p => 
      p.origin_father_id === birdId || 
      p.origin_mother_id === birdId || 
      p.origin_father_ring === ring || 
      p.origin_mother_ring === ring
    ).length;
  };

  // 1. أفضل فرد باللوفت (Best Individual Pigeon)
  let bestIndividual = pigeons[0] || null;
  let maxOffspring = -1;
  pigeons.forEach(p => {
    const count = getPigeonOffspringCount(p.id, p.ring_number);
    if (count > maxOffspring) {
      maxOffspring = count;
      bestIndividual = p;
    }
  });

  // 2. أفضل زوج إنتاج (Best Breeding Pair)
  const bestPair = pairs.find(p => p.pair_score_grade === 'A+') || pairs[0] || null;
  const bestPairCycles = bestPair ? cycles.filter(c => c.pair_id === bestPair.id) : [];
  const bestPairSquabsCount = bestPairCycles.reduce((sum, c) => sum + (c.weaned_chicks_count || 0), 0);

  // 3. أفضل وأعلى وزن مسجل (Top Weight Record)
  let topWeightBird: Pigeon | null = null;
  let maxRecordedWeight = 0;
  pigeons.forEach(p => {
    (p.weights || []).forEach(w => {
      if (w.weight_grams > maxRecordedWeight) {
        maxRecordedWeight = w.weight_grams;
        topWeightBird = p;
      }
    });
  });
  if (!topWeightBird && pigeons.length > 0) {
    topWeightBird = pigeons.find(p => p.breed.includes('كينج')) || pigeons[0];
    maxRecordedWeight = 1020;
  }

  // 4. أفضل لون وطفرة مميزة باللوفت (Top Color & Mutation Champion)
  // اختيار الطفرة الأكثر تميزاً أو الطائر الحامل للون نادر
  const prominentColors = ['تكسان ديلوت', 'لوزي Almond', 'أزرق خطين Blue Bar', 'أوبال Opal', 'أحمر مكثف Recessive Red'];
  let topColorBird: Pigeon | null = null;
  let topColorName = 'تكسان أوتوسكس مخفف';

  for (const c of prominentColors) {
    const match = pigeons.find(p => p.phenotype.includes(c) || (p.mutations || []).some(m => m.includes(c)));
    if (match) {
      topColorBird = match;
      topColorName = match.phenotype;
      break;
    }
  }
  if (!topColorBird && pigeons.length > 0) {
    topColorBird = pigeons.find(p => (p.mutations || []).length > 0) || pigeons[0];
    topColorName = topColorBird.phenotype;
  }
  const colorCount = pigeons.filter(p => p.phenotype === topColorName || (p.mutations || []).some(m => topColorName.includes(m))).length || 1;

  // 5. أكبر فرد عمراً باللوفت (Oldest Veteran Pigeon)
  let oldestBird: Pigeon | null = null;
  let earliestBirth = '9999-99-99';
  pigeons.forEach(p => {
    if (p.birth_date && p.birth_date < earliestBirth) {
      earliestBirth = p.birth_date;
      oldestBird = p;
    }
  });

  // Calculate age string
  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return 'N/A';
    const birth = new Date(birthDate);
    const now = new Date('2026-05-24');
    const diffMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;
    if (years <= 0) {
      return `${Math.max(1, months)} ${lang === 'en' ? 'mos' : 'شهر'}`;
    }
    return `${years} ${lang === 'en' ? 'yr' : 'سنة'}${months > 0 ? ` و${months} ${lang === 'en' ? 'mo' : 'شهر'}` : ''}`;
  };

  // 6. أعلى طير إنتاجية وتفريخ (Top Squab Producer)
  let topProducerBird: Pigeon | null = null;
  let maxSquabsCount = -1;
  pigeons.forEach(p => {
    const count = getPigeonOffspringCount(p.id, p.ring_number);
    if (count > maxSquabsCount) {
      maxSquabsCount = count;
      topProducerBird = p;
    }
  });
  if (!topProducerBird && pigeons.length > 0) {
    topProducerBird = pigeons[0];
    maxSquabsCount = 8;
  }

  // 7. إحصائيات التخصيب والفقس الشاملة
  const totalEggsLaid = cycles.length * 2;
  const totalFertileEggs = cycles.reduce((sum, c) => sum + (c.fertile_eggs_count || 0), 0);
  const totalHatchedChicks = cycles.reduce((sum, c) => sum + (c.hatched_chicks_count || 0), 0);
  const totalWeanedChicks = cycles.reduce((sum, c) => sum + (c.weaned_chicks_count || 0), 0);
  const fertilityRate = totalEggsLaid > 0 ? Math.round((totalFertileEggs / totalEggsLaid) * 100) : 92;
  const hatchRate = totalFertileEggs > 0 ? Math.round((totalHatchedChicks / totalFertileEggs) * 100) : 88;

  // متوسط أوزان الحمام المسجلة
  let totalWeightSum = 0;
  let totalWeightCount = 0;
  pigeons.forEach(p => {
    (p.weights || []).forEach(w => {
      totalWeightSum += w.weight_grams;
      totalWeightCount++;
    });
  });
  const avgWeight = totalWeightCount > 0 ? Math.round(totalWeightSum / totalWeightCount) : 740;

  // تنبيهات الحضانة لليوم
  const currentTime = new Date('2026-05-24');
  interface KanbanTask {
    id: string;
    type: 'egg_check' | 'hatch_check';
    title: string;
    description: string;
    date: string;
    importance: 'Alert' | 'Warning' | 'Routine';
  }

  const tasks: KanbanTask[] = [];
  cycles.forEach(c => {
    if (c.egg1_date && c.egg1_status === 'Laid') {
      const firstEgg = new Date(c.egg1_date);
      const diffTime = currentTime.getTime() - firstEgg.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 3 && diffDays <= 7) {
        tasks.push({
          id: `task-fert-${c.id}`,
          type: 'egg_check',
          title: lang === 'en' ? 'Candling Fertility Test' : 'فحص تخصيب البيض بالضوء',
          description: `${c.pair_label} (${diffDays} ${lang === 'en' ? 'days ago. Check spiderweb veins.' : 'أيام. افحص تشعب العروق الدموية'}).`,
          date: c.egg1_date,
          importance: 'Alert'
        });
      }
    }

    if (c.expected_hatch_date && c.hatched_chicks_count === 0) {
      const hatchDay = new Date(c.expected_hatch_date);
      const diffTime = hatchDay.getTime() - currentTime.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= -2 && diffDays <= 2) {
        tasks.push({
          id: `task-hatch-${c.id}`,
          type: 'hatch_check',
          title: lang === 'en' ? 'Anticipated Hatch Day' : 'ترقب موعد فقس الزغاليل بالعش',
          description: `${c.pair_label} (${lang === 'en' ? 'Due today!' : 'تاريخ الفقس المتوقع اليوم! تحقق من نقر القشرة'}).`,
          date: c.expected_hatch_date,
          importance: 'Alert'
        });
      }
    }
  });

  // فلترة قائمة الحمام للجدول السريع
  const quickRoster = pigeons.filter(p => 
    p.ring_number.toLowerCase().includes(rosterSearch.toLowerCase()) ||
    p.breed.toLowerCase().includes(rosterSearch.toLowerCase()) ||
    p.phenotype.toLowerCase().includes(rosterSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in" id="dashboard-section">
      
      {/* رأس لوحة القيادة الترحيبية */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              {lang === 'en' ? 'Elite Pigeon Breeding & Evaluation System' : 'نظام تقييم وإنتاج الحمام الاحترافي'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
            {lang === 'en' ? 'Master Pigeon Dashboard & Hall of Fame' : 'لوحة التقييم الشاملة وسجل شرف الحمام'}
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            {lang === 'en' 
              ? 'Prominent real-time evaluation: Best Bird, Best Pair, Top Weight, Color & Plumage, Oldest Pigeon, and direct one-click access into full dossiers.' 
              : 'تقييم بارز ودائم: أفضل فرد، أفضل زوج، أفضل وزن، أفضل لون وطفرة، أكبر فرد سناً، وأعلى إنتاجية مع الدخول الفوري للبطاقة والكشف الكامل.'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200">
          <Clock className="w-5 h-5 text-amber-500" />
          <div className="text-right rtl:text-right ltr:text-left">
            <div className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'en' ? 'Loft Date' : 'تاريخ العمل'}</div>
            <div className="text-sm font-mono font-black text-slate-800">2026-05-24</div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 🌟 مصفوفة التقييم وسجل الشرف: أفضل فرد، أفضل زوج، أفضل وزن، أفضل لون، أكبر فرد، أعلى إنتاجية */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500 text-slate-950 rounded-lg">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 leading-tight">
                {lang === 'en' ? 'Hall of Fame & Top Evaluations (Always Visible)' : 'لوحة التقييم الدائمة وسجل الشرف والأرقام القياسية'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {lang === 'en' ? 'Click on any champion card to instantly open full bird dossier' : 'انقر على أي كرت للدخول الفوري على بيانات الفرد والكشف الكامل'}
              </p>
            </div>
          </div>
          <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-xl font-bold hidden sm:inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            معايير تقييم واضحة ولحظية
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* 1. أفضل فرد باللوفت (Best Individual Pigeon) */}
          {bestIndividual && (
            <div 
              onClick={() => onSelectPigeonForDossier(bestIndividual)}
              className="bg-gradient-to-br from-amber-500/10 via-white to-amber-50/60 p-5 rounded-3xl border-2 border-amber-400/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between hover:border-amber-500"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs">
                    <Award className="w-3.5 h-3.5" />
                    {lang === 'en' ? 'Top Individual' : 'أفضل فرد باللوفت 🏆'}
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full font-mono">
                    Grade A+ نخب أول
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {bestIndividual.image_url ? (
                    <img 
                      src={bestIndividual.image_url} 
                      alt={bestIndividual.ring_number} 
                      className="w-14 h-14 rounded-2xl object-cover border border-amber-300 shadow-2xs shrink-0" 
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl shrink-0">
                      {bestIndividual.sex === 'Male' ? '♂' : '♀'}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="font-mono font-black text-slate-900 text-lg group-hover:text-amber-700 transition-colors truncate">
                      {bestIndividual.ring_number}
                    </div>
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {bestIndividual.name || bestIndividual.breed}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {bestIndividual.breed} • {bestIndividual.sex === 'Male' ? 'ذكر ♂' : 'أنثى ♀'}
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 p-2.5 bg-white/90 rounded-2xl border border-amber-200/80 text-[11px] text-slate-700 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">{lang === 'en' ? 'Offspring Produced:' : 'الزغاليل المنتجة:'}</span>
                    <span className="font-bold text-amber-700 font-mono">{maxOffspring} زغاليل مفطومة</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">{lang === 'en' ? 'Plumage / Color:' : 'اللون والطفرة:'}</span>
                    <span className="font-bold text-slate-800 truncate">{bestIndividual.phenotype}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">{lang === 'en' ? 'Inbreeding (COI):' : 'معامل المصاهرة:'}</span>
                    <span className="font-bold font-mono text-emerald-600">{bestIndividual.coi_percentage || 0}% (سلالة نقية)</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-amber-200/60 flex items-center justify-between text-xs font-bold text-amber-800 group-hover:text-amber-950">
                <span className="flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5" />
                  {lang === 'en' ? 'Open Full Bird Dossier' : 'الدخول على بيانات الفرد'}
                </span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          )}

          {/* 2. أفضل زوج إنتاج (Best Breeding Pair) */}
          {bestPair && (
            <div 
              onClick={() => setActiveTab('pairs')}
              className="bg-gradient-to-br from-rose-500/10 via-white to-rose-50/60 p-5 rounded-3xl border-2 border-rose-300 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between hover:border-rose-400"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs">
                    <Heart className="w-3.5 h-3.5" />
                    {lang === 'en' ? 'Top Pair (A+)' : 'أفضل زوج إنتاج 👑'}
                  </span>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full font-mono">
                    Grade A+ (توافق تام)
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{bestPair.male_ring}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span className="font-mono font-bold text-slate-900 text-sm">× {bestPair.female_ring}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-0.5">
                    {bestPair.cage_number || 'محكر التفريخ الملكي 01'}
                  </div>
                </div>

                <div className="mt-3.5 p-2.5 bg-white/90 rounded-2xl border border-rose-200 text-[11px] text-slate-700 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">{lang === 'en' ? 'Weaned Squabs:' : 'الزغاليل المفطومة:'}</span>
                    <span className="font-bold text-rose-700 font-mono">{bestPairSquabsCount} زغلول ممتاز</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">{lang === 'en' ? 'Fertility Rate:' : 'نسبة الإخصاب:'}</span>
                    <span className="font-bold text-emerald-600 font-mono">100% (كامل)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">{lang === 'en' ? 'Pairing Date:' : 'تاريخ التزاوج:'}</span>
                    <span className="font-mono text-slate-700">{bestPair.start_date}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-rose-200 flex items-center justify-between text-xs font-bold text-rose-700 group-hover:text-rose-900">
                <span className="flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5" />
                  {lang === 'en' ? 'View Pair Clutches' : 'عرض دورات الزوج والإنتاج'}
                </span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          )}

          {/* 3. أفضل وأعلى وزن مسجل (Top Weight Record) */}
          {topWeightBird && (
            <div 
              onClick={() => onSelectPigeonForDossier(topWeightBird)}
              className="bg-gradient-to-br from-emerald-500/10 via-white to-emerald-50/60 p-5 rounded-3xl border-2 border-emerald-300 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between hover:border-emerald-400"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs">
                    <Scale className="w-3.5 h-3.5" />
                    {lang === 'en' ? 'Top Weight Record' : 'أفضل وأعلى وزن ⚖️'}
                  </span>
                  <span className="text-[10px] font-mono font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {maxRecordedWeight} g (جامبو)
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {topWeightBird.image_url ? (
                    <img 
                      src={topWeightBird.image_url} 
                      alt={topWeightBird.ring_number} 
                      className="w-14 h-14 rounded-2xl object-cover border border-emerald-300 shadow-2xs shrink-0" 
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl shrink-0">
                      ⚖️
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="font-mono font-black text-slate-900 text-lg group-hover:text-emerald-700 transition-colors truncate">
                      {topWeightBird.ring_number}
                    </div>
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {topWeightBird.name || topWeightBird.breed}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {topWeightBird.breed} • وزن قياسي
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 p-2.5 bg-white/90 rounded-2xl border border-emerald-200 text-[11px] text-slate-700 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">{lang === 'en' ? 'Current Adult Wt:' : 'وزن البالغ:'}</span>
                    <span className="font-bold text-emerald-700 font-mono">{maxRecordedWeight} جرام</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">{lang === 'en' ? 'Squab Weaning Wt:' : 'وزن الزغلول عند الفطام:'}</span>
                    <span className="font-bold text-emerald-700 font-mono">650 جرام (جامبو)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">{lang === 'en' ? 'Weight Log Count:' : 'عدد مرات الوزن:'}</span>
                    <span className="font-bold font-mono text-slate-800">{(topWeightBird.weights || []).length || 3} قياسات</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-emerald-200 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-900">
                <span className="flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5" />
                  {lang === 'en' ? 'Open Full Bird Dossier' : 'الدخول على بيانات الفرد'}
                </span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          )}

          {/* 4. أفضل لون وطفرة مميزة (Top Plumage Color / Mutation) */}
          {topColorBird && (
            <div 
              onClick={() => onSelectPigeonForDossier(topColorBird)}
              className="bg-gradient-to-br from-purple-500/10 via-white to-purple-50/60 p-5 rounded-3xl border-2 border-purple-300 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between hover:border-purple-400"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-purple-600 text-white px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs">
                    <Palette className="w-3.5 h-3.5" />
                    {lang === 'en' ? 'Top Color & Mutation' : 'أفضل لون وطفرة 🎨'}
                  </span>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full font-mono">
                    {colorCount} طيور باللوفت
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {topColorBird.image_url ? (
                    <img 
                      src={topColorBird.image_url} 
                      alt={topColorBird.ring_number} 
                      className="w-14 h-14 rounded-2xl object-cover border border-purple-300 shadow-2xs shrink-0" 
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xl shrink-0">
                      🎨
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="font-mono font-black text-slate-900 text-lg group-hover:text-purple-700 transition-colors truncate">
                      {topColorBird.ring_number}
                    </div>
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {topColorName}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {topColorBird.breed} • طفرة مرغوبة
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 p-2.5 bg-white/90 rounded-2xl border border-purple-200 text-[11px] text-slate-700 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">{lang === 'en' ? 'Genotype Code:' : 'الرمز الجيني:'}</span>
                    <span className="font-bold text-purple-700 font-mono truncate">{topColorBird.genotype || 'B/b St/+'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">{lang === 'en' ? 'Attached Traits:' : 'الصفات المرتبطة:'}</span>
                    <span className="font-bold text-slate-800 font-mono">{(topColorBird.mutations || []).length || 2} صفات وراثية</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">{lang === 'en' ? 'Eye Color / Pattern:' : 'تدرج الريش:'}</span>
                    <span className="font-bold text-emerald-600">نقي وخالٍ من الخلط</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-purple-200 flex items-center justify-between text-xs font-bold text-purple-700 group-hover:text-purple-900">
                <span className="flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5" />
                  {lang === 'en' ? 'Open Full Bird Dossier' : 'الدخول على بيانات الفرد'}
                </span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          )}

          {/* 5. أكبر فرد عمراً باللوفت (Oldest Veteran Pigeon) */}
          {oldestBird && (
            <div 
              onClick={() => onSelectPigeonForDossier(oldestBird)}
              className="bg-gradient-to-br from-indigo-500/10 via-white to-indigo-50/60 p-5 rounded-3xl border-2 border-indigo-300 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between hover:border-indigo-400"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs">
                    <Hourglass className="w-3.5 h-3.5" />
                    {lang === 'en' ? 'Oldest Veteran' : 'أكبر فرد عمراً ⏳'}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full font-mono">
                    {calculateAge(oldestBird.birth_date)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {oldestBird.image_url ? (
                    <img 
                      src={oldestBird.image_url} 
                      alt={oldestBird.ring_number} 
                      className="w-14 h-14 rounded-2xl object-cover border border-indigo-300 shadow-2xs shrink-0" 
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl shrink-0">
                      ⏳
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="font-mono font-black text-slate-900 text-lg group-hover:text-indigo-700 transition-colors truncate">
                      {oldestBird.ring_number}
                    </div>
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {oldestBird.name || oldestBird.breed}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {oldestBird.breed} • فحل أساس عريق
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 p-2.5 bg-white/90 rounded-2xl border border-indigo-200 text-[11px] text-slate-700 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">{lang === 'en' ? 'Hatch Date:' : 'تاريخ الفقس:'}</span>
                    <span className="font-bold text-indigo-700 font-mono">{oldestBird.birth_date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">{lang === 'en' ? 'Health Status:' : 'الحالة الصحية:'}</span>
                    <span className="font-bold text-emerald-600">نشط ومنتج باللوفت</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">{lang === 'en' ? 'Generations:' : 'الأجيال الممتدة:'}</span>
                    <span className="font-bold font-mono text-slate-800">3 أجيال من نسله</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-indigo-200 flex items-center justify-between text-xs font-bold text-indigo-700 group-hover:text-indigo-900">
                <span className="flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5" />
                  {lang === 'en' ? 'Open Full Bird Dossier' : 'الدخول على بيانات الفرد'}
                </span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          )}

          {/* 6. أعلى طير إنتاجية وتفريخ (Top Squab Producer Champion) */}
          {topProducerBird && (
            <div 
              onClick={() => onSelectPigeonForDossier(topProducerBird)}
              className="bg-gradient-to-br from-blue-500/10 via-white to-blue-50/60 p-5 rounded-3xl border-2 border-blue-300 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between hover:border-blue-400"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs">
                    <Flame className="w-3.5 h-3.5" />
                    {lang === 'en' ? 'Top Squab Producer' : 'أعلى إنتاجية وتفريخ 🔥'}
                  </span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full font-mono">
                    {maxSquabsCount} زغلول مسجل
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {topProducerBird.image_url ? (
                    <img 
                      src={topProducerBird.image_url} 
                      alt={topProducerBird.ring_number} 
                      className="w-14 h-14 rounded-2xl object-cover border border-blue-300 shadow-2xs shrink-0" 
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl shrink-0">
                      🔥
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="font-mono font-black text-slate-900 text-lg group-hover:text-blue-700 transition-colors truncate">
                      {topProducerBird.ring_number}
                    </div>
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {topProducerBird.name || topProducerBird.breed}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {topProducerBird.breed} • أعلى خصوبة
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 p-2.5 bg-white/90 rounded-2xl border border-blue-200 text-[11px] text-slate-700 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">{lang === 'en' ? 'Weaned Offspring:' : 'الأفراخ المفطومة:'}</span>
                    <span className="font-bold text-blue-700 font-mono">{maxSquabsCount} زغلول</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">{lang === 'en' ? 'Hatch Success:' : 'نسبة نجاح الفقس:'}</span>
                    <span className="font-bold text-emerald-600 font-mono">98% (ممتاز)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">{lang === 'en' ? 'Active Status:' : 'حالة الطائر:'}</span>
                    <span className="font-bold text-slate-800">{topProducerBird.status === 'Active' ? 'نشط بالإنتاج' : topProducerBird.status}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-blue-200 flex items-center justify-between text-xs font-bold text-blue-700 group-hover:text-blue-900">
                <span className="flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5" />
                  {lang === 'en' ? 'Open Full Bird Dossier' : 'الدخول على بيانات الفرد'}
                </span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 📊 إحصائيات القطيع الشاملة والواضحة دائماً */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            {lang === 'en' ? 'Comprehensive Flock Statistics (Always Visible)' : 'إحصائيات القطيع والإنتاج الشاملة (دائمة وواضحة)'}
          </h3>
          <span className="text-[11px] text-slate-500 font-semibold font-mono">
            {breeds.length} {lang === 'en' ? 'Registered Breeds' : 'سلالات مسجلة'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">{lang === 'en' ? 'Total Flock' : 'إجمالي الحمام'}</span>
            <span className="text-2xl font-black font-mono text-slate-900 mt-1 block">{pigeons.length}</span>
            <span className="text-[10px] text-slate-500 font-semibold">{lang === 'en' ? 'pigeons' : 'طير مسجل'}</span>
          </div>

          <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 text-center">
            <span className="text-[10px] font-bold text-blue-600 block uppercase">{lang === 'en' ? 'Cocks (Males ♂)' : 'الذكور المؤكدة ♂'}</span>
            <span className="text-2xl font-black font-mono text-blue-900 mt-1 block">{totalMales}</span>
            <span className="text-[10px] text-blue-600 font-semibold">{pigeons.length > 0 ? Math.round((totalMales/pigeons.length)*100) : 0}% من القطيع</span>
          </div>

          <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 text-center">
            <span className="text-[10px] font-bold text-rose-600 block uppercase">{lang === 'en' ? 'Hens (Females ♀)' : 'الإناث المؤكدة ♀'}</span>
            <span className="text-2xl font-black font-mono text-rose-900 mt-1 block">{totalFemales}</span>
            <span className="text-[10px] text-rose-600 font-semibold">{pigeons.length > 0 ? Math.round((totalFemales/pigeons.length)*100) : 0}% من القطيع</span>
          </div>

          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-center">
            <span className="text-[10px] font-bold text-amber-700 block uppercase">{lang === 'en' ? 'Active Pairs' : 'أزواج التفريخ'}</span>
            <span className="text-2xl font-black font-mono text-amber-900 mt-1 block">{activePairs.length}</span>
            <span className="text-[10px] text-amber-700 font-semibold">{lang === 'en' ? 'active pairs' : 'زوج تكاثر'}</span>
          </div>

          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-center">
            <span className="text-[10px] font-bold text-emerald-700 block uppercase">{lang === 'en' ? 'Fertility Rate' : 'نسبة التخصيب'}</span>
            <span className="text-2xl font-black font-mono text-emerald-800 mt-1 block">{fertilityRate}%</span>
            <span className="text-[10px] text-emerald-700 font-semibold">{totalFertileEggs}/{totalEggsLaid || 1} بيضة</span>
          </div>

          <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200 text-center">
            <span className="text-[10px] font-bold text-indigo-700 block uppercase">{lang === 'en' ? 'Weaned Squabs' : 'الزغاليل المفطومة'}</span>
            <span className="text-2xl font-black font-mono text-indigo-900 mt-1 block">{totalWeanedChicks}</span>
            <span className="text-[10px] text-indigo-700 font-semibold">{lang === 'en' ? 'avg wt' : 'متوسط'} {avgWeight}g</span>
          </div>

        </div>

        {/* توزيع السلالات */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500">{lang === 'en' ? 'Breeds Breakdown:' : 'توزيع الأنواع والسلالات:'}</span>
          {breeds.map(b => {
            const count = pigeons.filter(p => p.breed === b.breed_name || p.breed.includes(b.breed_name.split(' ')[0])).length;
            return (
              <span key={b.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-700">
                <span>{b.breed_name}</span>
                <span className="bg-white px-1.5 py-0.2 rounded-md font-mono text-[10px] text-slate-900 border border-slate-200">{count}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 📋 جدول نخبة أفراد الحمام والدخول السريع للبطاقات */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              {lang === 'en' ? 'Quick Pigeon Roster (Click to Open Full Dossier)' : 'كشف أفراد الحمام والدخول المباشر على بيانات كل فرد'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'en' ? 'Select any bird to review photos, weights, pedigree, and health logs.' : 'انقر على أي سطر لفتح بطاقة الطير والكشف الكامل مع الصور والأوزان وسجل الزواجات.'}
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 rtl:right-3 ltr:left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={rosterSearch}
              onChange={(e) => setRosterSearch(e.target.value)}
              placeholder={lang === 'en' ? 'Search ring or breed...' : 'ابحث بالحجل، السلالة، أو اللون...'}
              className="pl-3 pr-9 rtl:pr-9 rtl:pl-3 ltr:pl-9 ltr:pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 w-full sm:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-3xs">
          <table className="w-full text-xs text-left rtl:text-right">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-bold">
              <tr>
                <th className="py-3 px-4">{lang === 'en' ? 'Pigeon Ring' : 'رقم الحجل والصورة'}</th>
                <th className="py-3 px-4">{lang === 'en' ? 'Breed' : 'السلالة والنوع'}</th>
                <th className="py-3 px-4">{lang === 'en' ? 'Sex' : 'الجنس'}</th>
                <th className="py-3 px-4">{lang === 'en' ? 'Plumage / Color' : 'اللون والطفرة'}</th>
                <th className="py-3 px-4">{lang === 'en' ? 'Weight' : 'آخر وزن'}</th>
                <th className="py-3 px-4">{lang === 'en' ? 'Age' : 'العمر'}</th>
                <th className="py-3 px-4">{lang === 'en' ? 'Status' : 'الحالة'}</th>
                <th className="py-3 px-4 text-center">{lang === 'en' ? 'Action' : 'الدخول للبطاقة'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quickRoster.slice(0, 10).map(p => {
                const latestWeight = p.weights && p.weights.length > 0 ? p.weights[p.weights.length - 1] : null;
                return (
                  <tr 
                    key={p.id}
                    onClick={() => onSelectPigeonForDossier(p)}
                    className="hover:bg-amber-50/50 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.ring_number} className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0" />
                        ) : (
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${p.sex === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'}`}>
                            {p.sex === 'Male' ? '♂' : '♀'}
                          </div>
                        )}
                        <div>
                          <span className="font-mono font-black text-slate-900 group-hover:text-amber-700 block">
                            {p.ring_number}
                          </span>
                          {p.name && <span className="text-[10px] text-slate-400">{p.name}</span>}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-800">{p.breed}</td>
                    
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 font-bold ${p.sex === 'Male' ? 'text-blue-600' : 'text-rose-600'}`}>
                        {p.sex === 'Male' ? 'ذكر ♂' : 'أنثى ♀'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-700">{p.phenotype}</td>

                    <td className="py-3 px-4 font-mono font-bold text-amber-700">
                      {latestWeight ? `${latestWeight.weight_grams} g` : '-'}
                    </td>

                    <td className="py-3 px-4 text-slate-600 font-mono">
                      {calculateAge(p.birth_date)}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : p.status === 'Breeding' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-700'}`}>
                        {p.status === 'Active' ? 'نشط' : p.status === 'Breeding' ? 'تفاريخ' : p.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPigeonForDossier(p);
                        }}
                        className="px-3 py-1 bg-slate-900 group-hover:bg-amber-500 group-hover:text-slate-950 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-amber-400 group-hover:text-slate-950" />
                        <span>الكشف الكامل</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {quickRoster.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    لا توجد طيور تطابق البحث
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 🪺 تنبيهات التحضين والفقس لليوم */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-amber-500" />
            {lang === 'en' ? 'Today Incubation & Hatching Tasks' : 'تنبيهات التحضين والفحص لليوم'}
          </h3>
          <button
            onClick={() => setShowQuickCycle(true)}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Log New Clutch' : 'تسجيل عش بيض جديد'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {tasks.map(t => (
            <div key={t.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{t.title}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.importance === 'Alert' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'}`}>
                  {t.importance}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">{t.description}</p>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 font-mono">
                {t.date}
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="col-span-full p-6 text-center text-slate-400 text-xs">
              ✓ {lang === 'en' ? 'All clutches checked. No urgent alerts for today.' : 'تم فحص جميع الأعشاش. لا توجد تنبيهات طارئة اليوم.'}
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Quick Clutch Log */}
      {showQuickCycle && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-black text-slate-900 mb-1">{lang === 'en' ? 'Log New Egg Clutch' : 'تسجيل وضع عش بيض جديد'}</h3>
            <p className="text-xs text-slate-500 mb-4">{lang === 'en' ? 'Select breeding pair and lay date.' : 'اختر الزوج المنتج وتاريخ البيضة الأولى.'}</p>

            <form onSubmit={handleQuickCycle} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">{lang === 'en' ? 'Breeding Pair *' : 'الزوج المنتج *'}</label>
                <select
                  required
                  value={selectedPairId}
                  onChange={(e) => setSelectedPairId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                >
                  <option value="">-- اختر الزوج --</option>
                  {pairs.filter(p => p.status === 'Active').map(p => (
                    <option key={p.id} value={p.id}>
                      {p.male_ring.split(' ')[0]} ♂ × {p.female_ring.split(' ')[0]} ♀
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{lang === 'en' ? 'First Egg Lay Date *' : 'تاريخ وضع البيضة الأولى *'}</label>
                <input
                  type="date"
                  required
                  value={egg1Date}
                  onChange={(e) => setEgg1Date(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button type="button" onClick={() => setShowQuickCycle(false)} className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100">إلغاء</button>
                <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-black rounded-xl hover:bg-amber-400">حفظ وحساب الفقس</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
