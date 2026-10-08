/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Heart, 
  Layers, 
  Calendar, 
  CalendarCheck, 
  RefreshCcw, 
  User, 
  Plus, 
  ShieldCheck, 
  Sparkle, 
  PlusCircle, 
  HelpCircle,
  Share2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Pair, Pigeon, ProductionCycle, CycleEggStatus } from '../types';
import { toEnglishDigits } from '../utils/numberHelper';

interface PairsProductionViewProps {
  pairs: Pair[];
  pigeons: Pigeon[];
  cycles: ProductionCycle[];
  onAddPair: (p: Omit<Pair, 'id'>) => void;
  onUpdatePairStatus: (id: string, status: 'Active' | 'Separated') => void;
  onAddCycle: (c: Omit<ProductionCycle, 'id'>) => void;
  onUpdateCycle: (id: string, updated: Partial<ProductionCycle>) => void;
  onDeletePair: (id: string) => void;
}

export default function PairsProductionView({
  pairs,
  pigeons,
  cycles,
  onAddPair,
  onUpdatePairStatus,
  onAddCycle,
  onUpdateCycle,
  onDeletePair
}: PairsProductionViewProps) {
  const [showAddPairModal, setShowAddPairModal] = useState(false);
  const [maleId, setMaleId] = useState('');
  const [femaleId, setFemaleId] = useState('');
  const [cage, setCage] = useState('');

  // حالات الفتح السريع لدورات البيض والتحضين المخصصة لزوج معين
  const [selectedPair, setSelectedPair] = useState<Pair | null>(pairs[0] || null);

  // حالات تسجيل البيض الجديد
  const [showAddCycleModal, setShowAddCycleModal] = useState(false);
  const [egg1Date, setEgg1Date] = useState('');
  const [egg2Date, setEgg2Date] = useState('');

  // ميزة الحاضنة (Fostering Control)
  const [showFosterModal, setShowFosterModal] = useState(false);
  const [selectedCycleId, setSelectedCycleId] = useState('');
  const [targetFosterPairId, setTargetFosterPairId] = useState('');

  // تعديل نتائج البيض والفرخ لكل عش
  const [editingCycleId, setEditingCycleId] = useState<string | null>(null);
  const [editEgg1Status, setEditEgg1Status] = useState<CycleEggStatus>('Laid');
  const [editEgg2Status, setEditEgg2Status] = useState<CycleEggStatus>('Laid');
  const [editFertileCount, setEditFertileCount] = useState<number>(0);
  const [editHatchedCount, setEditHatchedCount] = useState<number>(0);
  const [editWeanedCount, setEditWeanedCount] = useState<number>(0);
  const [editActualHatchDate, setEditActualHatchDate] = useState<string>('');

  // استخراج الذكور والإناث النشطين غير المتزوجين حالياً لتفادي تعدد الازواج بنفس الوقت
  const matedMaleIds = pairs.filter(p => p.status === 'Active').map(p => p.male_id);
  const matedFemaleIds = pairs.filter(p => p.status === 'Active').map(p => p.female_id);

  const availableMales = pigeons.filter(p => p.sex === 'Male' && p.status === 'Active' && !matedMaleIds.includes(p.id));
  const availableFemales = pigeons.filter(p => p.sex === 'Female' && p.status === 'Active' && !matedFemaleIds.includes(p.id));

  const handleRegisterPair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maleId || !femaleId) return;

    const male = pigeons.find(p => p.id === maleId);
    const female = pigeons.find(p => p.id === femaleId);

    if (male && female) {
      onAddPair({
        male_id: maleId,
        male_ring: `${male.ring_number} (${male.breed})`,
        female_id: femaleId,
        female_ring: `${female.ring_number} (${female.breed})`,
        start_date: new Date().toISOString().split('T')[0],
        status: 'Active',
        cage_number: cage || 'غير محدد',
        pair_score_grade: 'A' // تصنيف افتراضي جيد يبدأ الحساب منه
      });

      setMaleId('');
      setFemaleId('');
      setCage('');
      setShowAddPairModal(false);
    }
  };

  const handleRegisterCycle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPair || !egg1Date) return;

    // حساب الفقس المتوقع آلياً (18 يوماً)
    const egg1 = new Date(egg1Date);
    const expected = new Date(egg1);
    expected.setDate(expected.getDate() + 18);

    onAddCycle({
      pair_id: selectedPair.id,
      pair_label: `${selectedPair.male_ring.split(' ')[0]} ♂ × ${selectedPair.female_ring.split(' ')[0]} ♀`,
      egg1_date: egg1Date,
      egg1_status: 'Laid',
      egg2_date: egg2Date || undefined,
      egg2_status: egg2Date ? 'Laid' : 'Broken',
      expected_hatch_date: expected.toISOString().split('T')[0],
      fertile_eggs_count: 0,
      hatched_chicks_count: 0,
      weaned_chicks_count: 0,
      is_fostered_in: false
    });

    setEgg1Date('');
    setEgg2Date('');
    setShowAddCycleModal(false);
  };

  const startEditingCycle = (c: ProductionCycle) => {
    setEditingCycleId(c.id);
    setEditEgg1Status(c.egg1_status);
    setEditEgg2Status(c.egg2_status);
    setEditFertileCount(c.fertile_eggs_count);
    setEditHatchedCount(c.hatched_chicks_count);
    setEditWeanedCount(c.weaned_chicks_count);
    setEditActualHatchDate(c.actual_hatch_date || '');
  };

  const saveEditedCycle = (id: string) => {
    onUpdateCycle(id, {
      egg1_status: editEgg1Status,
      egg2_status: editEgg2Status,
      fertile_eggs_count: Number(editFertileCount),
      hatched_chicks_count: Number(editHatchedCount),
      weaned_chicks_count: Number(editWeanedCount),
      actual_hatch_date: editActualHatchDate || undefined
    });
    setEditingCycleId(null);
  };

  const handleFosterAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCycleId || !targetFosterPairId) return;

    // تحديث الدورة السابقة ليرى أنها نُقلت لحاضن آخر
    const targetPair = pairs.find(p => p.id === targetFosterPairId);
    
    // تفعيل روت الحضانة
    onUpdateCycle(selectedCycleId, {
      fostered_to_pair_id: targetFosterPairId,
      notes: `تم نقل بيض هذا العش ليتولى تحضينه الزوج المربى في: ${targetPair?.cage_number || 'حضانة خارجية'}`
    });

    // إنشاء دورة "مستورد حضانة" موازية لدى الزوج الحاضن
    // مع بيان أنه غير بيولوجي لضمان شجرة النسب
    const origCycle = cycles.find(c => c.id === selectedCycleId);
    if (origCycle) {
      onAddCycle({
        pair_id: targetFosterPairId,
        pair_label: targetPair ? `${targetPair.male_ring.split(' ')[0]} ♂ × ${targetPair?.female_ring.split(' ')[0]} ♀` : 'غير مسجل الحاضن',
        egg1_date: origCycle.egg1_date,
        egg1_status: origCycle.egg1_status,
        egg2_date: origCycle.egg2_date,
        egg2_status: origCycle.egg2_status,
        expected_hatch_date: origCycle.expected_hatch_date,
        fertile_eggs_count: origCycle.fertile_eggs_count,
        hatched_chicks_count: origCycle.hatched_chicks_count,
        weaned_chicks_count: origCycle.weaned_chicks_count,
        is_fostered_in: true,
        biological_pair_id: origCycle.pair_id,
        notes: `عش مستورد للتحضين الزوج البيولوجي الأصلي هو (${origCycle.pair_label})`
      });
    }

    setSelectedCycleId('');
    setTargetFosterPairId('');
    setShowFosterModal(false);
  };

  // دورات الإنتاج المفلترة للزوج المختار حالياً
  const selectedPairCycles = cycles.filter(c => c.pair_id === selectedPair?.id);

  const getStatusLabel = (status: CycleEggStatus) => {
    switch (status) {
      case 'Laid': return 'موضوعة حديثاً';
      case 'Fertile': return 'مخصبة وعروق نبض';
      case 'Infertile': return 'بيضة فاسدة / غير ملقحة';
      case 'Broken': return 'كسرت أو تلفت';
      case 'Hatched': return 'فقست فرخ حي';
      default: return 'كبست بالبيضة / ميت بالداخل';
    }
  };

  const getStatusColor = (status: CycleEggStatus) => {
    switch (status) {
      case 'Hatched': return 'text-emerald-700 bg-emerald-50 border border-emerald-100';
      case 'Fertile': return 'text-amber-700 bg-amber-50 border border-amber-100';
      case 'Laid': return 'text-slate-600 bg-slate-100';
      default: return 'text-rose-700 bg-rose-50 border border-rose-100';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="pairs-cycles-container">
      
      {/* رأس الجزء الفني للتفريخ والتزاوج */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 animate-pulse" />
            إدارة تزاوج وأزواج التفريخ الفعالة
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            اربط الذكور بالإناث، تحكّم بأعشاش التفويض والحضانة، واستعلم عن مواعيد البيض والفقس والفرخ بكل دقة.
          </p>
        </div>

        <button
          onClick={() => setShowAddPairModal(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          تزاوج زوج جديد (♂ x ♀)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 1. قائمة الأزواج النشطة باليسار */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-3xs overflow-hidden">
            <div className="bg-slate-50 text-slate-500 font-bold text-xs p-3.5 border-b border-slate-100 flex items-center justify-between">
              <span>أزواج تفريخ المزرعة ({pairs.length})</span>
              <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded">عيون التفريخ 2026</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[480px] overflow-y-auto" id="pairs-list-box">
              {pairs.map(pair => (
                <div
                  key={pair.id}
                  onClick={() => setSelectedPair(pair)}
                  className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer group space-y-3 ${selectedPair?.id === pair.id ? 'bg-amber-50/75 border-r-4 border-r-amber-500' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold bg-amber-50 border border-amber-100 text-amber-800 px-2 py-0.5 rounded">
                      {pair.cage_number || 'بدون محكر'}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${pair.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {pair.status === 'Active' ? 'تزاوج فعال' : 'مفصول'}
                    </span>
                  </div>

                  <div className="text-xs space-y-1.5 font-medium">
                    <div className="flex items-center gap-1.5 text-blue-800">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span className="font-semibold text-[11px] leading-none shrink-0">ذكر:</span>
                      <span className="font-mono text-[11px] truncate">{pair.male_ring}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-rose-800">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      <span className="font-semibold text-[11px] leading-none shrink-0">أنثى:</span>
                      <span className="font-mono text-[11px] truncate">{pair.female_ring}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] pt-2 border-t border-slate-100/60 text-slate-400">
                    <span>تاريخ الاقتران: {pair.start_date}</span>
                    <span className="text-amber-700 font-extrabold text-[12px] bg-amber-50 rounded px-1 flex items-center gap-0.5">
                      <Sparkle className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      التقييم: {pair.pair_score_grade || 'A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. اليمين: عرض الأعشاش وتاريخ الإنتاج للزوج المختار والتحضين */}
        <div className="lg:col-span-2 space-y-4">
          {selectedPair ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-6">
              
              {/* ترويسة تفاصيل الزواج مع الأزرار التحضينية */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-rose-50 text-rose-500 rounded-xl">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">أعشاش ودورات إنتاج الزوج</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {selectedPair.male_ring.split(' ')[0]} x {selectedPair.female_ring.split(' ')[0]} | {selectedPair.cage_number || 'محكر عام'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (confirm('هل أنت متأكد من فصل هذا الزوج من التفريخ ونقله للاحتياطي الجماعي؟')) {
                        onUpdatePairStatus(selectedPair.id, selectedPair.status === 'Active' ? 'Separated' : 'Active');
                      }
                    }}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" />
                    {selectedPair.status === 'Active' ? 'فصل الزوج وإنهاء الربط' : 'إعادة ربط وتفعيل الزوج'}
                  </button>

                  <button
                    onClick={() => setShowAddCycleModal(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <PlusCircle className="w-4 h-4" />
                    تسجيل لوحة بيض جديدة
                  </button>
                </div>
              </div>

              {/* قائمة الأعشاش والجرد التفصيلي للتحقيب */}
              <div className="space-y-4" id="pair-cycles-timeline">
                <h4 className="font-bold text-slate-700 text-xs border-r-4 border-r-amber-500 pr-2">سجلات العشوش التاريخية</h4>
                
                {selectedPairCycles.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-100 rounded-xl">
                    لا يوجد أعشاش مسجلة لهذا الزوج بعد. اضغط في الأعلى على "تسجيل لوحة بيض جديدة" للبدء.
                  </div>
                ) : (
                  selectedPairCycles.map((cycle, index) => (
                    <div 
                      key={cycle.id} 
                      className={`p-4 rounded-xl border transition-all space-y-4 ${
                        cycle.is_fostered_in 
                          ? 'bg-blue-50/25 border-blue-200/60' 
                          : 'bg-slate-50/40 border-slate-200/50'
                      }`}
                    >
                      {/* ترويسة العش مع ملامح الحاضنة */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-2 mb-2 gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold font-mono text-slate-500">موسم #{selectedPairCycles.length - index}</span>
                          {cycle.is_fostered_in && (
                            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                              عش حاضن مستورد (Foster Home)
                            </span>
                          )}
                          {cycle.fostered_to_pair_id && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                              نُقل بيضه لحضانة زوج آخر
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-mono text-slate-400">عش إنتاجي معرف ({cycle.id})</div>
                      </div>

                      {/* التفاصيل العينية لبيضتين العش كشبق تفصيلي للقطيع */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-slate-600">
                        
                        {/* البيضة الأولى */}
                        <div className="bg-white p-3 rounded-lg border border-slate-200/40 space-y-1.5">
                          <div className="text-[10px] text-slate-400 leading-none">البيضة الأولى</div>
                          <div className="font-mono text-slate-700">{cycle.egg1_date || 'غير محدد'}</div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded block max-w-max ${getStatusColor(cycle.egg1_status)}`}>
                            {getStatusLabel(cycle.egg1_status)}
                          </span>
                        </div>

                        {/* البيضة الثانية */}
                        <div className="bg-white p-3 rounded-lg border border-slate-200/40 space-y-1.5">
                          <div className="text-[10px] text-slate-400 leading-none">البيضة الثانية</div>
                          <div className="font-mono text-slate-700">{cycle.egg2_date || 'غير محدد'}</div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded block max-w-max ${getStatusColor(cycle.egg2_status)}`}>
                            {getStatusLabel(cycle.egg2_status)}
                          </span>
                        </div>

                        {/* كمية التخصيب والفقس الفعلي */}
                        <div className="bg-white p-3 rounded-lg border border-slate-200/40 space-y-1">
                          <div className="text-[10px] text-slate-400 leading-none">فحص التلقيح والفقس</div>
                          <div className="text-slate-700 pt-0.5">
                            الخصوبة المعتمدة: <span className="font-mono font-bold text-slate-900">{cycle.fertile_eggs_count}</span> بيضتين
                          </div>
                          <div className="text-[11px] text-emerald-800 font-bold">
                            الفقس الفعلي: <span>{cycle.hatched_chicks_count}</span> زغاليل
                          </div>
                        </div>

                        {/* التواريخ والبيولوجيا المجدولة */}
                        <div className="bg-white p-3 rounded-lg border border-slate-200/40 space-y-1 font-medium">
                          <div className="text-[10px] text-slate-400 leading-none">تواريخ هامة</div>
                          <div className="text-[11px] text-slate-500">المرتقب: <span className="font-mono font-bold text-slate-700">{cycle.expected_hatch_date}</span></div>
                          {cycle.actual_hatch_date && (
                            <div className="text-[11px] text-emerald-800 font-semibold">فقس فعلي: <span className="font-mono font-bold">{cycle.actual_hatch_date}</span></div>
                          )}
                        </div>

                      </div>

                      {/* ملاحظات المربي للعش */}
                      {cycle.notes && (
                        <div className="bg-slate-100/40 p-2 rounded text-[11px] text-slate-400 leading-relaxed italic border border-slate-200/20">
                          {cycle.notes}
                        </div>
                      )}

                      {/* إجراءات العش المباشرة (تعديل - حضانة) */}
                      <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        {/* تفعيل أو إلغاء تعديل العش */}
                        {editingCycleId === cycle.id ? (
                          <div className="w-full bg-amber-50/40 p-4 rounded-lg border border-amber-200 space-y-3 font-semibold text-xs text-slate-600">
                            <h5 className="font-bold text-amber-800">تحديث وتصحيح تفاصيل العش</h5>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div>
                                <label className="block text-[10px] text-slate-400 mb-1">حالة البيضة 1</label>
                                <select 
                                  className="w-full bg-white border p-1.5 rounded" 
                                  value={editEgg1Status} 
                                  onChange={(e: any) => setEditEgg1Status(e.target.value)}
                                >
                                  <option value="Laid">موضوعة</option>
                                  <option value="Fertile">مخصبة / دم</option>
                                  <option value="Infertile">غير ملقحة / رائق</option>
                                  <option value="Broken">تالفة وعشوش ممزقة</option>
                                  <option value="Hatched">فقست بنجاح</option>
                                  <option value="DeadInShell">كبست بيضاً</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[10px] text-slate-400 mb-1">حالة البيضة 2</label>
                                <select 
                                  className="w-full bg-white border p-1.5 rounded" 
                                  value={editEgg2Status} 
                                  onChange={(e: any) => setEditEgg2Status(e.target.value)}
                                >
                                  <option value="Laid">موضوعة</option>
                                  <option value="Fertile">مخصبة / دم</option>
                                  <option value="Infertile">غير ملقحة</option>
                                  <option value="Broken">تالفة وبراش</option>
                                  <option value="Hatched">فقست فرخاً</option>
                                  <option value="DeadInShell">ماتت بداخل القشرة</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[10px] text-slate-400 mb-1">عدد البيض الملقح</label>
                                <input 
                                  type="number" min="0" max="2" 
                                  className="w-full bg-white border p-1 rounded font-mono text-center" 
                                  value={editFertileCount} 
                                  onChange={(e) => setEditFertileCount(Number(toEnglishDigits(e.target.value)) || 0)}
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] text-slate-400 mb-1">زغاليل العفج الحية</label>
                                <input 
                                  type="number" min="0" max="2" 
                                  className="w-full bg-white border p-1 rounded font-mono text-center" 
                                  value={editHatchedCount} 
                                  onChange={(e) => setEditHatchedCount(Number(toEnglishDigits(e.target.value)) || 0)}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                              <div>
                                <label className="block text-[10px] text-slate-400 mb-1">زغاليل تم فطامها بنجاح</label>
                                <input 
                                  type="number" min="0" max="2" 
                                  className="w-full bg-white border p-1.5 rounded font-mono text-center" 
                                  value={editWeanedCount} 
                                  onChange={(e) => setEditWeanedCount(Number(toEnglishDigits(e.target.value)) || 0)}
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] text-slate-400 mb-1">تاريخ الفقس الفعلي</label>
                                <input 
                                  type="date" 
                                  className="w-full bg-white border p-1 rounded font-mono text-center text-xs" 
                                  value={editActualHatchDate} 
                                  onChange={(e) => setEditActualHatchDate(e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t">
                              <button 
                                type="button" 
                                onClick={() => setEditingCycleId(null)}
                                className="px-3 py-1.5 border rounded"
                              >
                                تراجع
                              </button>
                              <button 
                                type="button" 
                                onClick={() => saveEditedCycle(cycle.id)}
                                className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded"
                              >
                                حفظ البيانات ✓
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* زر تفعيل ميزة الحضانة لبيض هذا العش */}
                            {!cycle.fostered_to_pair_id && !cycle.is_fostered_in && (
                              <button
                                onClick={() => {
                                  setSelectedCycleId(cycle.id);
                                  setShowFosterModal(true);
                                }}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                                نقل العش لزوج حاضن (Fostering)
                              </button>
                            )}

                            <button
                              onClick={() => startEditingCycle(cycle)}
                              className="text-xs font-semibold text-amber-700 hover:text-amber-900 bg-amber-50 border border-amber-100 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Layers className="w-3.5 h-3.5" />
                              تعديل حالة وفقس العشوش ✎
                            </button>
                          </>
                        )}
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          ) : (
            <div className="bg-white p-12 text-center text-slate-400 rounded-2xl border border-dashed border-slate-200">
              <Heart className="w-12 h-12 mx-auto opacity-35 mb-2" />
              <p className="text-sm">لا يوجد أزواج مسجلة. حدد زوجك الأول لتبدأ تتبع التخصيب والتحضين.</p>
            </div>
          )}
        </div>

      </div>

      {/* مودال ميزة الحضانة (Fostering Modal Setup) */}
      {showFosterModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-850 text-base flex items-center gap-2 text-indigo-700">
                <Share2 className="w-5 h-5 animate-pulse" />
                تحضين بيض (Fostering Eggs)
              </h3>
              <button onClick={() => setShowFosterModal(false)} className="text-slate-400 hover:text-slate-650">
                تراجع
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              تسمح هذه الميزة بنقل بيض (الزوج البيولوجي الأصلي) ليحضنه (زوج حاضن آخر) في محكره لكونه أكثر حناناً مثلاً، دون الإخلال بشجرة النسب والأمومة الوراثية للطيور.
            </p>

            <form onSubmit={handleFosterAction} className="space-y-4 font-semibold text-slate-600">
              <div>
                <label className="block text-xs text-slate-400 mb-1">الزوج الحاضن المقترح بالدليل</label>
                <select 
                  className="w-full text-xs border border-slate-200 p-2.5 rounded-lg bg-slate-50"
                  value={targetFosterPairId}
                  onChange={(e) => setTargetFosterPairId(e.target.value)}
                  required
                >
                  <option value="">-- اختر الزوج الحاضن المخصص --</option>
                  {pairs.filter(p => p.id !== selectedPair?.id && p.status === 'Active').map(p => (
                    <option key={p.id} value={p.id}>
                      محكر قفص ({p.cage_number}) | الآباء: الذكر {p.male_ring.split(' ')[0]} x الأنثى {p.female_ring.split(' ')[0]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[11px] p-3 rounded-xl leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-bounce" />
                <div>
                  <span className="font-bold">ملاحظة هامة للأنساب:</span> سيتم إنشاء سجل عش مماثل لدى الزوج المختار بتعريف (حضانة تابعة)، مع بقاء الأب والأب الأصليين ساريين في سجلات الأنساب تماماً للتفريد لاحقاً.
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowFosterModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  تأكيد نقل ورعاية العش ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال قيد التزاوج الجديد (Register New Coupling Pair) */}
      {showAddPairModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-xl space-y-4">
            <h3 className="font-bold text-slate-800 text-base">تسجيل زوج تزاوج تفريخي جديد</h3>
            
            <form onSubmit={handleRegisterPair} className="space-y-4 font-semibold text-slate-600 text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* قائمة الذكور الفردية المتاحة */}
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">الذكور الفرديين الأحرار</label>
                  <select
                    className="w-full text-xs border border-slate-200 p-2.5 rounded-lg bg-slate-50"
                    value={maleId}
                    onChange={(e) => setMaleId(e.target.value)}
                    required
                  >
                    <option value="">-- حدد ذكر القطيع --</option>
                    {availableMales.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.ring_number} ({m.breed} - {m.phenotype})
                      </option>
                    ))}
                  </select>
                </div>

                {/* قائمة الإناث الفردية المتاحة */}
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">الإناث الفرديات الحرة</label>
                  <select
                    className="w-full text-xs border border-slate-200 p-2.5 rounded-lg bg-slate-50"
                    value={femaleId}
                    onChange={(e) => setFemaleId(e.target.value)}
                    required
                  >
                    <option value="">-- حدد أنثى القطيع --</option>
                    {availableFemales.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.ring_number} ({f.breed} - {f.phenotype})
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div>
                <label className="block text-slate-400 mb-1">تحديد رقم المحكر أو القفص (العير)</label>
                <input
                  type="text"
                  placeholder="مثال: سلاكة 04 أو عين عزل 2"
                  className="w-full text-xs border border-slate-200 p-2.5 rounded-lg text-center font-bold"
                  value={cage}
                  onChange={(e) => setCage(e.target.value)}
                />
              </div>

              <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex items-start gap-2 text-indigo-900 leading-relaxed">
                <HelpCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">تنبيه حماية الأصول:</span> لا يمكن تكرار تزاوج حمامات مرتبطة بزوج قائم نشط حالياً لضمان عروة الإحصائيات ودقة الإخراج المالي والإنتاجي.
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddPairModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  تزاوج وحفظ ✓
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* تسجيل عش بيض للمودال الداخلي للزوج المختار */}
      {showAddCycleModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-100 shadow-xl space-y-4">
            <h3 className="font-bold text-slate-800 text-base">تسجيل لوحة فرخ وجيل بيض جديد للزوج</h3>
            
            <form onSubmit={handleRegisterCycle} className="space-y-4 font-semibold text-slate-600 text-xs">
              
              <div>
                <label className="block text-slate-400 mb-1">تاريخ البيضة الأولى (Egg 1)</label>
                <input
                  type="date"
                  className="w-full text-xs border border-slate-200 p-2.5 rounded-lg font-mono text-center"
                  value={egg1Date}
                  onChange={(e) => setEgg1Date(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">تاريخ البيضة الثانية إن وُجدت (Egg 2 - اختياري)</label>
                <input
                  type="date"
                  className="w-full text-xs border border-slate-200 p-2.5 rounded-lg font-mono text-center"
                  value={egg2Date}
                  onChange={(e) => setEgg2Date(e.target.value)}
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg leading-relaxed flex items-start gap-1.5">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">المواعيد المستهدفة:</span>
                  <p className="text-[10px] text-amber-700 mt-1">سيجدول النظام آلياً موعد فحص الروح بالبيض (بعد 5 أيام) وموعد الفقس المتوقع (بعد 18 يوماً) في مهام المزرعة الفعالة.</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddCycleModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  تراجع
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  تسجيل العش ✓
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
