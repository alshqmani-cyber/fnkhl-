/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  FolderPlus, 
  GitCommit, 
  Baby, 
  ArrowLeftRight, 
  BookOpen, 
  Trash2, 
  Heart,
  UserCheck,
  Award,
  Sparkles,
  Printer,
  FileCheck2,
  X
} from 'lucide-react';
import { Pigeon, ProductionCycle, Breed, MutationTrait } from '../types';
import { Language, translations } from '../i18n';

interface PigeonsViewProps {
  pigeons: Pigeon[];
  cycles: ProductionCycle[];
  breeds?: Breed[];
  mutationsList?: MutationTrait[];
  onCreatePigeon: (p: Omit<Pigeon, 'id'>) => void;
  onUpdatePigeon: (id: string, updated: Partial<Pigeon>) => void;
  onDeletePigeon: (id: string) => void;
  onAddBreed?: (b: Omit<Breed, 'id'>) => void;
  onOpenSaleCertificate?: (pigeon: Pigeon) => void;
  onOpenDossier?: (pigeon: Pigeon) => void;
  lang?: Language;
}

export default function PigeonsView({
  pigeons,
  cycles,
  breeds = [],
  mutationsList = [],
  onCreatePigeon,
  onUpdatePigeon,
  onDeletePigeon,
  onAddBreed,
  onOpenSaleCertificate,
  onOpenDossier,
  lang = 'ar'
}: PigeonsViewProps) {
  const t = translations[lang];
  // حالات البحث والفلترة
  const [searchTerm, setSearchTerm] = useState('');
  const [sexFilter, setSexFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('Active');
  const [breedFilter, setBreedFilter] = useState<string>('All');

  // طائر مُختار لعرضه بالتخصيص وشجرة العائلة
  const [selectedPigeon, setSelectedPigeon] = useState<Pigeon | null>(pigeons[0] || null);

  // حالات الإضافة الجديدة لطيور بالقطيع
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRing, setNewRing] = useState('');
  const [newSex, setNewSex] = useState<'Male' | 'Female' | 'Unknown'>('Unknown');
  const [newBreed, setNewBreed] = useState('تكسان (Texan)');
  const [newBirth, setNewBirth] = useState('2026-01-01');
  const [newPhenotype, setNewPhenotype] = useState('');
  const [newGenotype, setNewGenotype] = useState('');
  const [newFatherRing, setNewFatherRing] = useState('');
  const [newMotherRing, setNewMotherRing] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // إضافة نوع حمام جديد مضمن بالنموذج
  const [showInlineAddBreed, setShowInlineAddBreed] = useState(false);
  const [inlineBreedName, setInlineBreedName] = useState('');
  const [inlineBreedCategory, setInlineBreedCategory] = useState<Breed['category']>('Meat');

  // حالات "تفريد وفطام الزغاليل" (Graduation Module)
  const [showGraduateModal, setShowGraduateModal] = useState(false);
  const [graduatingChickName, setGraduatingChickName] = useState('');
  const [graduatingFatherId, setGraduatingFatherId] = useState('');
  const [graduatingMotherId, setGraduatingMotherId] = useState('');
  const [graduateRing, setGraduateRing] = useState('');
  const [graduateSex, setGraduateSex] = useState<'Male' | 'Female' | 'Unknown'>('Unknown');
  const [graduateBreed, setGraduateBreed] = useState('تكسان (Texan)');

  // ----------------------------------------------------
  // تجميع قائمة تفريد الزغالب المتاحة من الدورات القديمة
  // ----------------------------------------------------
  // نعتبر أي زغولة في دورة تم فطامها ولم تدرج كطير مستقل (أي زغاليل weaning) كمحتوى للتفريد
  // لتسهيل المحاكاة، سنعرض قائمة افتراضية بالزغلين في دورة c1 التي تبلغ الفطام
  const weanedChicksOptions = [
    { id: 'opt1', name: 'زغلول التكسان الذكر من العش c1', fatherId: 'p1', motherId: 'p2', fatherRing: 'TX-2025-0100', motherRing: 'TX-2025-0112', breed: 'تكسان (Texan)' },
    { id: 'opt2', name: 'زغلول التكسان الأنثى من العش c1 (داكن)', fatherId: 'p1', motherId: 'p2', fatherRing: 'TX-2025-0100', motherRing: 'TX-2025-0112', breed: 'تكسان (Texan)' },
    { id: 'opt3', name: 'زغلول البطل الزاجل من العش c2', fatherId: 'p5', motherId: 'p6', fatherRing: 'RC-2024-9981', motherRing: 'RC-2024-9988', breed: 'زاجل (Racing Homer)' },
  ];

  const handleAddPigeon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRing) return;

    // استعلام الآباء إن وجدوا بالرقم التعريفى
    const fBird = pigeons.find(p => p.ring_number === newFatherRing);
    const mBird = pigeons.find(p => p.ring_number === newMotherRing);

    onCreatePigeon({
      ring_number: newRing,
      sex: newSex,
      breed: newBreed,
      birth_date: newBirth,
      status: 'Active',
      phenotype: newPhenotype || 'غير مسجل اللون',
      genotype: newGenotype || 'رموز افتراضية',
      origin_father_id: fBird?.id,
      origin_father_ring: newFatherRing || undefined,
      origin_mother_id: mBird?.id,
      origin_mother_ring: newMotherRing || undefined,
      notes: newNotes
    });

    setNewRing('');
    setNewPhenotype('');
    setNewGenotype('');
    setNewFatherRing('');
    setNewMotherRing('');
    setNewNotes('');
    setShowAddModal(false);
  };

  const handleGraduatePigeon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!graduateRing) return;

    const father = pigeons.find(p => p.id === graduatingFatherId);
    const mother = pigeons.find(p => p.id === graduatingMotherId);

    // إضافة الطير كفرد نشط
    onCreatePigeon({
      ring_number: graduateRing,
      sex: graduateSex,
      breed: graduateBreed,
      birth_date: new Date().toISOString().split('T')[0],
      status: 'Active',
      phenotype: graduateSex === 'Male' && graduateBreed.includes('تكسان') ? 'أبيض تكسان مخفف جينياً' : 'لون بري عادي داكن',
      genotype: graduateSex === 'Male' ? 'St/St (حسب قاعدة التكسان)' : 'St/Y (داكنة لكونها أنثى تكسان)',
      origin_father_id: graduatingFatherId || undefined,
      origin_father_ring: father?.ring_number || undefined,
      origin_mother_id: graduatingMotherId || undefined,
      origin_mother_ring: mother?.ring_number || undefined,
      notes: `تم تفريده وفطامه آلياً من خيار التفريد: ${graduatingChickName}`
    });

    setGraduateRing('');
    setShowGraduateModal(false);
  };

  // فلترة الطيور
  const filteredPigeons = pigeons.filter(p => {
    const matchesSearch = p.ring_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.phenotype.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSex = sexFilter === 'All' || p.sex === sexFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesBreed = breedFilter === 'All' || p.breed === breedFilter;

    return matchesSearch && matchesSex && matchesStatus && matchesBreed;
  });

  // ----------------------------------------------------
  // محرك شجرة الأنسب المستمر حتى 3 أجيال (Pedigree Generator)
  // ----------------------------------------------------
  const getPigeonDetail = (idOrRing?: string) => {
    if (!idOrRing) return null;
    return pigeons.find(p => p.id === idOrRing || p.ring_number === idOrRing) || null;
  };

  const renderPedigreeTree = (bird: Pigeon) => {
    // الأب والأم اللحظيين
    const father = getPigeonDetail(bird.origin_father_id || bird.origin_father_ring);
    const mother = getPigeonDetail(bird.origin_mother_id || bird.origin_mother_ring);

    // أجداد من جهة الأب
    const paternalGrandfather = father ? getPigeonDetail(father.origin_father_id || father.origin_father_ring) : null;
    const paternalGrandmother = father ? getPigeonDetail(father.origin_mother_id || father.origin_mother_ring) : null;

    // أجداد من جهة الأم
    const maternalGrandfather = mother ? getPigeonDetail(mother.origin_father_id || mother.origin_father_ring) : null;
    const maternalGrandmother = mother ? getPigeonDetail(mother.origin_mother_id || mother.origin_mother_ring) : null;

    return (
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 mt-4 text-center select-none shadow-inner" id="pedigree-visualizer">
        <div className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-wider flex items-center justify-center gap-2">
          <GitCommit className="w-4 h-4 text-amber-500 animate-spin" />
          شجرة السلالة وعلم الأنساب الموثق (Pedigree)
        </div>

        {/* تخطيط شجرة الأبعاد ثلاثية الطبقات برسم خطوط مبسط */}
        <div className="grid grid-cols-3 gap-4 relative text-xs">
          
          {/* العمود الأول: الجيل الثالث (الأجداد) */}
          <div className="flex flex-col justify-around space-y-4">
            <span className="text-[10px] text-slate-400 font-semibold border-b pb-1">الأجداد (Grandparents)</span>
            
            {/* أجداد الأب */}
            <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-3xs space-y-1">
              <div className="font-bold text-[9px] text-blue-600">جد الأب ♂</div>
              <div className="font-mono font-bold text-slate-700">{paternalGrandfather?.ring_number || 'غير مسجل'}</div>
              <div className="text-[9px] text-slate-400">{paternalGrandfather?.breed || 'سلالة مجهولة'}</div>
            </div>

            <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-3xs space-y-1">
              <div className="font-bold text-[9px] text-rose-500">جدة الأب ♀</div>
              <div className="font-mono font-bold text-slate-700">{paternalGrandmother?.ring_number || 'غير مسجل'}</div>
              <div className="text-[9px] text-slate-400">{paternalGrandmother?.breed || 'سلالة مجهولة'}</div>
            </div>

            {/* أجداد الأم */}
            <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-3xs space-y-1 pt-4 border-t-2 border-t-slate-100">
              <div className="font-bold text-[9px] text-blue-600">جد الأم ♂</div>
              <div className="font-mono font-bold text-slate-700">{maternalGrandfather?.ring_number || 'غير مسجل'}</div>
              <div className="text-[9px] text-slate-400">{maternalGrandfather?.breed || 'سلالة مجهولة'}</div>
            </div>

            <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-3xs space-y-1">
              <div className="font-bold text-[9px] text-rose-500">جدة الأم ♀</div>
              <div className="font-mono font-bold text-slate-700">{maternalGrandmother?.ring_number || 'غير مسجل'}</div>
              <div className="text-[9px] text-slate-400">{maternalGrandmother?.breed || 'سلالة مجهولة'}</div>
            </div>
          </div>

          {/* العمود الثاني: الجيل الثاني (الآباء) */}
          <div className="flex flex-col justify-around py-4">
            <span className="text-[10px] text-slate-400 font-semibold border-b pb-1">الآباء (Parents)</span>
            
            {/* الأب */}
            <div className="bg-blue-50/50 p-2.5 rounded-xl border border-blue-200 shadow-2xs space-y-1 relative group cursor-pointer" onClick={() => father && setSelectedPigeon(father)}>
              <div className="font-bold text-[10px] text-blue-700 flex items-center justify-center gap-1">
                الأب الحقيقي ♂ {father && <Sparkles className="w-3 h-3 text-amber-500" />}
              </div>
              <div className="font-mono font-bold text-slate-800">{father?.ring_number || bird.origin_father_ring || 'غير مسجل'}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{father?.phenotype || 'لون غير معلوم'}</div>
            </div>

            {/* الأم */}
            <div className="bg-rose-50/50 p-2.5 rounded-xl border border-rose-200 shadow-2xs space-y-1 cursor-pointer" onClick={() => mother && setSelectedPigeon(mother)}>
              <div className="font-bold text-[10px] text-rose-700">الأم المغذية ♀</div>
              <div className="font-mono font-bold text-slate-800">{mother?.ring_number || bird.origin_mother_ring || 'غير مسجل'}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{mother?.phenotype || 'لون غير معلوم'}</div>
            </div>
          </div>

          {/* العمود الثالث: الطائر المستهدف */}
          <div className="flex flex-col justify-center">
            <span className="text-[10px] text-slate-400 font-semibold border-b pb-1 mb-4">الطائر الحاضر</span>
            
            <div className="bg-amber-50 p-4 rounded-xl border-2 border-amber-400 shadow-xs space-y-1 mr-2 text-center">
              <div className="font-bold text-xs text-amber-900 border-b border-amber-200 pb-1 flex items-center justify-center gap-1">
                <Award className="w-4 h-4 text-amber-500" />
                {bird.sex === 'Male' ? 'ذكر منتج ♂' : bird.sex === 'Female' ? 'أنثى منتجة ♀' : 'فرخ غير محدد'}
              </div>
              <div className="font-mono font-extrabold text-slate-900 text-sm py-1">{bird.ring_number}</div>
              <div className="text-[10px] text-slate-600 leading-relaxed font-semibold">{bird.phenotype}</div>
              <div className="text-[10px] bg-white/80 border border-amber-100 px-1 py-0.5 rounded text-amber-800 font-mono text-[9px]">
                {bird.genotype}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const deletePigeonWithConfirmation = (p: Pigeon) => {
    if (confirm(`هل أنت متأكد من حذف الحمام ذو الحجل (${p.ring_number}) من سجل القطيع؟`)) {
      onDeletePigeon(p.id);
      setSelectedPigeon(pigeons.find(item => item.id !== p.id) || null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="pigeons-view-container">
      
      {/* قسم الإجراءات والتفريد العلوي */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-500" />
            سجل طيور القطيع والأنساب الفردية
          </h2>
          <p className="text-slate-500 text-xs mt-1">أضف الطيور البالغة، وعالج أصول كل طير لتوليد شجرة أنساب أوتوماتيكية مانعة للقرابة والعيوب الوراثية.</p>
        </div>
        
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* زر الفطام الفوري */}
          <button
            onClick={() => setShowGraduateModal(true)}
            className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 px-4 py-2.5 rounded-lg text-xs font-bold transition-all"
          >
            <Baby className="w-4 h-4" />
            فطام ونقل الزغاليل للقطيع 
          </button>

          {/* زر الإضافة اليدوية */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            <FolderPlus className="w-4 h-4" />
            إضافة طير بالغ جديد
          </button>
        </div>
      </div>

      {/* المحتوى الرئيسي المقسم لعمودين */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* العمود الأيمن: فلاتر وبطاقات الطيور */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs space-y-4">
            
            {/* شريط البحث المباشر */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              <input
                type="text"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 py-2.5 text-right font-medium"
                placeholder="ابحث بالحجل، اللون أو السلالة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* الفلاتر الجانبية */}
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-500">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">فلتر الجنس</label>
                <select className="w-full bg-slate-50 border border-slate-200 p-2 rounded-md" value={sexFilter} onChange={(e) => setSexFilter(e.target.value)}>
                  <option value="All">الجميع</option>
                  <option value="Male">ذكر ♂</option>
                  <option value="Female">أنثى ♀</option>
                  <option value="Unknown">غير محدد</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">فلتر الحالة</label>
                <select className="w-full bg-slate-50 border border-slate-200 p-2 rounded-md" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">الكل</option>
                  <option value="Active">نشط في العناصر</option>
                  <option value="Sold">تم بيعه</option>
                  <option value="Dead">توفى / ميت</option>
                  <option value="Isolated">في العزل الطبي</option>
                </select>
              </div>
            </div>

          </div>

          {/* قائمة الطيور المفلترة الفردية */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-3xs overflow-hidden">
            <div className="bg-slate-50 text-slate-500 font-bold text-xs p-3.5 border-b border-slate-100 flex items-center justify-between">
              <span>الطيور المطابقة ({filteredPigeons.length})</span>
              <span className="text-[10px] font-mono">2026-05-24</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto" id="pigeons-list">
              {filteredPigeons.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">لا يوجد طيور تطابق الفلترة الحالية</div>
              ) : (
                filteredPigeons.map(p => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPigeon(p)}
                    className={`p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer flex items-center justify-between group ${selectedPigeon?.id === p.id ? 'bg-amber-100/40 border-r-4 border-r-amber-500' : ''}`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${p.sex === 'Male' ? 'bg-blue-500' : p.sex === 'Female' ? 'bg-rose-500' : 'bg-slate-300'}`}></span>
                        <span className="font-mono font-bold text-slate-800 text-xs">{p.ring_number}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{p.breed} • {p.phenotype}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${p.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : p.status === 'Sold' ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-700'}`}>
                        {p.status === 'Active' ? 'نشط' : p.status === 'Sold' ? 'مباع' : 'ميت'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* العمود الأيسر: بطاقة التفاصيل الفردية وشجرة الأنساب */}
        <div className="lg:col-span-2 space-y-4">
          {selectedPigeon ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-6">
              
              {/* ترويسة الطائر المختار وإجراءات الحذف السريع */}
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${selectedPigeon.sex === 'Male' ? 'bg-blue-50 text-blue-600' : selectedPigeon.sex === 'Female' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-mono font-extrabold text-slate-800 text-base">{selectedPigeon.ring_number}</h3>
                    <p className="text-xs text-slate-400">{selectedPigeon.breed} • {selectedPigeon.phenotype}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {onOpenDossier && (
                    <button
                      onClick={() => onOpenDossier(selectedPigeon)}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs shadow-xs transition-colors flex items-center gap-1.5"
                      title={lang === 'en' ? 'Open Full Bird Dossier (Weights, Photos, Marriages)' : 'الكشف الكامل: الأوزان، الصور، والزيجات'}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lang === 'en' ? 'Full Dossier' : 'الكشف الكامل للبطاقة'}</span>
                    </button>
                  )}

                  {onOpenSaleCertificate && (
                    <button
                      onClick={() => onOpenSaleCertificate(selectedPigeon)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-xs transition-colors flex items-center gap-1.5"
                      title={lang === 'en' ? 'Issue Official Sale & Pedigree Certificate' : 'إصدار شهادة بيع ونسب رسمية'}
                    >
                      <FileCheck2 className="w-4 h-4" />
                      <span className="hidden sm:inline">{lang === 'en' ? 'Sale Cert' : 'شهادة بيع'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                        window.print();
                    }}
                    className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                    title={lang === 'en' ? 'Print Pedigree' : 'طباعة بطاقة النسب ومسح الباركود'}
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => deletePigeonWithConfirmation(selectedPigeon)}
                    className="p-2 border border-rose-200 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                    title={lang === 'en' ? 'Delete from loft' : 'حذف من السجل'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* التفاصيل التقنية والجينية */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="pigeon-card-metadata">
                <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-200/40 text-center">
                  <div className="text-[10px] text-slate-400 font-semibold mb-1">اللغة الوراثية (Genotype)</div>
                  <div className="text-xs font-mono font-bold text-amber-900 bg-amber-50 rounded px-2 py-1 max-w-max mx-auto border border-amber-100">
                    {selectedPigeon.genotype}
                  </div>
                </div>

                <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-200/40 text-center">
                  <div className="text-[10px] text-slate-400 font-semibold mb-1">عمر الطائر</div>
                  <div className="text-xs font-bold text-slate-700">
                    {selectedPigeon.birth_date} (ولد بموسم 2025)
                  </div>
                </div>

                <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-200/40 text-center">
                  <div className="text-[10px] text-slate-400 font-semibold mb-1">رابط الحضانة الحقيقي</div>
                  <div className="text-xs font-bold text-slate-700">
                    {selectedPigeon.origin_father_id ? 'شجرة أصول كاملة' : 'لا يوجد سجلات آباء'}
                  </div>
                </div>
              </div>

              {/* ملاحظات المربي */}
              {selectedPigeon.notes && (
                <div className="bg-amber-50/40 p-3.5 border border-amber-200/40 rounded-xl">
                  <h4 className="font-bold text-slate-700 text-xs mb-1">ملاحظات التربية:</h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed italic">"{selectedPigeon.notes}"</p>
                </div>
              )}

              {/* رسم شجرة النسب */}
              {renderPedigreeTree(selectedPigeon)}

            </div>
          ) : (
            <div className="bg-white p-12 text-center text-slate-400 rounded-2xl border border-dashed border-slate-200">
              <Users className="w-12 h-12 mx-auto opacity-35 mb-2" />
              <p className="text-sm">لم تختر أو تسجل أي حمام حتى الآن. سجل طيرك الأول للبدء.</p>
            </div>
          )}
        </div>

      </div>

      {/* مودال الفطام والتفريد السريع (Graduation Weaning Modal) */}
      {showGraduateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Baby className="w-5 h-5 text-indigo-600" />
                تفريد وفطام زغاليل دورات الإنتاج
              </h3>
              <button onClick={() => setShowGraduateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              اختر فرخ مكثّم ناضج من العشوش المسجلة لتفريده في محكر الطيور الفردية، وسيقوم النظام اوتوماتيكياً بربطه بأبيه وأمه البيولوجية الموثقة.
            </p>

            <form onSubmit={handleGraduatePigeon} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">الزغاليل الجاهزة للفطام بالعنابر</label>
                <select
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50"
                  onChange={(e) => {
                    const opt = weanedChicksOptions.find(o => o.id === e.target.value);
                    if (opt) {
                      setGraduatingChickName(opt.name);
                      setGraduatingFatherId(opt.fatherId);
                      setGraduatingMotherId(opt.motherId);
                      setGraduateBreed(opt.breed);
                    }
                  }}
                  required
                >
                  <option value="">-- حدد زغلول العش المراد فطامه --</option>
                  {weanedChicksOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name} (أبويه: {opt.fatherRing} x {opt.motherRing})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3" id="graduation-details">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">الحجل الجديد (Unique Ring)</label>
                  <input
                    type="text"
                    placeholder="مثال: TX-2026-F1"
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 font-mono text-center"
                    value={graduateRing}
                    onChange={(e) => setGraduateRing(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">الجنس المرئي (Sex)</label>
                  <select
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50"
                    value={graduateSex}
                    onChange={(e: any) => setGraduateSex(e.target.value)}
                  >
                    <option value="Unknown">غير محدد بعد</option>
                    <option value="Male">ذكر ♂ (أبيض بالتكسان)</option>
                    <option value="Female">أنثى ♀ (ملونة بالتكسان)</option>
                  </select>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex items-start gap-2 text-indigo-900 text-xs">
                <BookOpen className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold">مستند النسب الأوتوماتيكي:</div>
                  <div className="text-[10px] text-indigo-700 leading-relaxed">
                    من خلال إتمام الفطام، سيتم ربط الطائر الجديد دائمًا بأصوله، مما يضمن ظهورهم في شجرة النسب وتفادي عيوب زواج الإخوة في دورات التزاوج اللاحقة.
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowGraduateModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  الإنهاء تفريد الطير ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال الإضافة اليدوية لطير بالغ (Manual Adult Pigeon Modal) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-100 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-amber-500" />
                إضافة طير بالغ جديد للتفريخ
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPigeon} className="space-y-3 font-semibold text-slate-600">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">رقم حجل التعريف (مثال: RC-2025-102)</label>
                  <input
                    type="text"
                    className="w-full text-xs border border-slate-200 p-2.5 rounded-lg text-center font-mono font-bold"
                    placeholder="حجل تعريفي مميز"
                    value={newRing}
                    onChange={(e) => setNewRing(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs text-slate-500 font-bold">نوع أو سلالة الحمام</label>
                    <button
                      type="button"
                      onClick={() => setShowInlineAddBreed(prev => !prev)}
                      className="text-[10px] text-amber-700 hover:text-amber-900 font-bold underline"
                    >
                      {showInlineAddBreed ? 'إلغاء' : '+ نوع جديد'}
                    </button>
                  </div>

                  {!showInlineAddBreed ? (
                    <select
                      className="w-full text-xs border border-slate-200 p-2.5 rounded-lg font-bold text-slate-800"
                      value={newBreed}
                      onChange={(e) => setNewBreed(e.target.value)}
                    >
                      {breeds.length > 0 ? (
                        breeds.map(b => (
                          <option key={b.id} value={b.breed_name}>
                            {b.breed_name} {b.is_auto_sexing ? '• (ذاتي التجنيس)' : ''}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="تكسان (Texan Pioneer)">تكسان التمازج التلقائي (Texan Pioneer)</option>
                          <option value="زاجل أصيل (Racing Homer)">زاجل الطيران الطويل (Racing Homer)</option>
                          <option value="كينج جامبو (King Squabbing)">كينج اللحم لحم التسمين (King)</option>
                          <option value="كاريار (English Carrier)">كاريار العنق الطويل</option>
                        </>
                      )}
                    </select>
                  ) : (
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-300 space-y-2 text-xs">
                      <input
                        type="text"
                        placeholder="اسم النوع الجديد (مثال: لاحم فرنسي، مودنا)..."
                        value={inlineBreedName}
                        onChange={(e) => setInlineBreedName(e.target.value)}
                        className="w-full p-2 bg-white border border-amber-300 rounded-lg font-bold"
                      />
                      <div className="flex items-center justify-between gap-2">
                        <select
                          value={inlineBreedCategory}
                          onChange={(e: any) => setInlineBreedCategory(e.target.value)}
                          className="p-1.5 bg-white border border-amber-300 rounded-lg text-[11px] font-bold"
                        >
                          <option value="Meat">لحم وإنتاج</option>
                          <option value="Fancy">زينة وشكلي</option>
                          <option value="Flying">طيار وقلاب</option>
                          <option value="Dual">ثنائي الغرض</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            if (!inlineBreedName.trim()) return;
                            const bName = inlineBreedName.trim();
                            if (onAddBreed) {
                              onAddBreed({
                                breed_name: bName,
                                category: inlineBreedCategory,
                                is_auto_sexing: false,
                                incubation_days_default: 18,
                                standard_weight_grams: 750
                              });
                            }
                            setNewBreed(bName);
                            setInlineBreedName('');
                            setShowInlineAddBreed(false);
                          }}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-[11px]"
                        >
                          إضافة واختيار
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">تاريخ الميلاد</label>
                  <input
                    type="date"
                    className="w-full text-xs border border-slate-200 p-2 rounded-lg font-mono text-center"
                    value={newBirth}
                    onChange={(e) => setNewBirth(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">الجنس</label>
                  <select
                    className="w-full text-xs border border-slate-200 p-2 rounded-lg"
                    value={newSex}
                    onChange={(e: any) => setNewSex(e.target.value)}
                  >
                    <option value="Male">ذكر ♂</option>
                    <option value="Female">أنثى ♀</option>
                    <option value="Unknown">غير معروف بعد</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">الجينات المخفية (Genotype)</label>
                  <input
                    type="text"
                    className="w-full text-xs border border-slate-200 p-2 rounded-lg text-center font-mono"
                    placeholder="St/Y or b/b"
                    value={newGenotype}
                    onChange={(e) => setNewGenotype(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">اللون والمظهر الخارجي</label>
                  <input
                    type="text"
                    className="w-full text-xs border border-slate-200 p-2.5 rounded-lg"
                    placeholder="أبيض منقط بالرمادي"
                    value={newPhenotype}
                    onChange={(e) => setNewPhenotype(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">أرقام حجل الآباء إن كانت معلومة</label>
                  <div className="grid grid-cols-2 gap-1">
                    <input
                      type="text"
                      className="w-full text-[10px] border border-slate-200 p-2 rounded text-center"
                      placeholder="حجل الأب"
                      value={newFatherRing}
                      onChange={(e) => setNewFatherRing(e.target.value)}
                    />
                    <input
                      type="text"
                      className="w-full text-[10px] border border-slate-200 p-2 rounded text-center"
                      placeholder="حجل الأم"
                      value={newMotherRing}
                      onChange={(e) => setNewMotherRing(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">ملاحظات ومصدر الطائر</label>
                <textarea
                  className="w-full text-xs border border-slate-200 p-2 rounded-lg h-20"
                  placeholder="ملاحظات الإنتاج أو المصدر المشترى منه..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  حفظ الطير بالغرفة ✓
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
