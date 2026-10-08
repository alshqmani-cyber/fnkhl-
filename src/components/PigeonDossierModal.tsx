/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Calendar, 
  Scale, 
  Heart, 
  Camera, 
  Plus, 
  Stethoscope, 
  GitCommit, 
  Sparkles, 
  Printer, 
  FileCheck2, 
  Award, 
  Tag, 
  Layers,
  Dna,
  Clock,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Palette,
  Baby
} from 'lucide-react';
import { Pigeon, Pair, ProductionCycle, MedicalRecord, MutationTrait, PigeonPhoto, PigeonWeightRecord, AviaryProfile } from '../types';
import { Language, translations } from '../i18n';

interface PigeonDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  pigeon: Pigeon | null;
  allPigeons: Pigeon[];
  pairs: Pair[];
  cycles: ProductionCycle[];
  medicals: MedicalRecord[];
  mutationsList: MutationTrait[];
  onUpdatePigeon: (id: string, updated: Partial<Pigeon>) => void;
  onOpenSaleCertificate?: (pigeon: Pigeon) => void;
  onAddNewGlobalMutation?: (mutation: Omit<MutationTrait, 'id'>) => void;
  onAddMedicalRecord?: (record: Omit<MedicalRecord, 'id'>) => void;
  onSelectRelativePigeon?: (pigeon: Pigeon) => void;
  profile: AviaryProfile;
  lang: Language;
}

export default function PigeonDossierModal({
  isOpen,
  onClose,
  pigeon,
  allPigeons,
  pairs,
  cycles,
  medicals,
  mutationsList,
  onUpdatePigeon,
  onOpenSaleCertificate,
  onAddNewGlobalMutation,
  onAddMedicalRecord,
  onSelectRelativePigeon,
  profile,
  lang = 'ar'
}: PigeonDossierModalProps) {
  if (!isOpen || !pigeon) return null;

  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'overview' | 'photos' | 'weights' | 'marriages' | 'medical' | 'pedigree'>('overview');

  // ----------------------------------------------------
  // إدارات النماذج التفاعلية داخل البطاقة (Photos, Weights, Traits, Medical)
  // ----------------------------------------------------
  // إضافة صورة
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoDate, setNewPhotoDate] = useState(new Date().toISOString().split('T')[0]);
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [photoInputMode, setPhotoInputMode] = useState<'upload' | 'url'>('upload');

  // إضافة وزن
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [newWeightGrams, setNewWeightGrams] = useState<number>(750);
  const [newWeightDate, setNewWeightDate] = useState(new Date().toISOString().split('T')[0]);
  const [newWeightNote, setNewWeightNote] = useState('');

  // إضافة طفرة / جين / لون / صفة جديدة
  const [showAddMutationQuick, setShowAddMutationQuick] = useState(false);
  const [newQuickMutationName, setNewQuickMutationName] = useState('');
  const [newQuickMutationType, setNewQuickMutationType] = useState<MutationTrait['type']>('Color');
  const [newQuickMutationColorHex, setNewQuickMutationColorHex] = useState('#f59e0b');
  const [newQuickMutationDesc, setNewQuickMutationDesc] = useState('');

  // إضافة سجل مرضي جديد
  const [showAddMedical, setShowAddMedical] = useState(false);
  const [medDisease, setMedDisease] = useState('');
  const [medMedicine, setMedMedicine] = useState('');
  const [medStartDate, setMedStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [medEndDate, setMedEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [medType, setMedType] = useState<MedicalRecord['type']>('Treatment');
  const [medIsActive, setMedIsActive] = useState(true);

  // ----------------------------------------------------
  // المعالجات الخاصة بالصور
  // ----------------------------------------------------
  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;
    const photo: PigeonPhoto = {
      id: `ph-${Date.now()}`,
      url: newPhotoUrl.trim(),
      date: newPhotoDate,
      caption: newPhotoCaption.trim() || undefined
    };
    const updatedPhotos = [...(pigeon.photos || []), photo];
    onUpdatePigeon(pigeon.id, { 
      photos: updatedPhotos, 
      image_url: pigeon.image_url || photo.url 
    });
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setShowAddPhoto(false);
  };

  const handleSetPrimaryPhoto = (photoUrl: string) => {
    onUpdatePigeon(pigeon.id, { image_url: photoUrl });
  };

  const handleDeletePhoto = (photoId: string) => {
    const updated = (pigeon.photos || []).filter(p => p.id !== photoId);
    onUpdatePigeon(pigeon.id, { photos: updated });
  };

  // ----------------------------------------------------
  // المعالجات الخاصة بالأوزان
  // ----------------------------------------------------
  const handleAddWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeightGrams) return;
    const record: PigeonWeightRecord = {
      id: `pw-${Date.now()}`,
      date: newWeightDate,
      weight_grams: Number(newWeightGrams),
      notes: newWeightNote.trim() || undefined
    };
    const updatedWeights = [...(pigeon.weights || []), record].sort((a, b) => a.date.localeCompare(b.date));
    onUpdatePigeon(pigeon.id, { weights: updatedWeights });
    setNewWeightNote('');
    setShowAddWeight(false);
  };

  const handleDeleteWeight = (weightId: string) => {
    const updated = (pigeon.weights || []).filter(w => w.id !== weightId);
    onUpdatePigeon(pigeon.id, { weights: updated });
  };

  // ----------------------------------------------------
  // المعالجات الخاصة بالطفرات والجينات والألوان
  // ----------------------------------------------------
  const handleToggleMutation = (mutName: string) => {
    const current = pigeon.mutations || [];
    const updated = current.includes(mutName)
      ? current.filter(m => m !== mutName)
      : [...current, mutName];
    onUpdatePigeon(pigeon.id, { mutations: updated });
  };

  const handleCreateQuickMutation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuickMutationName.trim()) return;
    const name = newQuickMutationName.trim();
    if (onAddNewGlobalMutation) {
      onAddNewGlobalMutation({
        name,
        type: newQuickMutationType,
        colorHex: newQuickMutationColorHex,
        description: newQuickMutationDesc || undefined
      });
    }
    const current = pigeon.mutations || [];
    if (!current.includes(name)) {
      onUpdatePigeon(pigeon.id, { mutations: [...current, name] });
    }
    setNewQuickMutationName('');
    setNewQuickMutationDesc('');
    setShowAddMutationQuick(false);
  };

  // ----------------------------------------------------
  // المعالجات الخاصة بالسجل الطبي
  // ----------------------------------------------------
  const handleAddMedicalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medDisease.trim()) return;
    if (onAddMedicalRecord) {
      onAddMedicalRecord({
        pigeon_id: pigeon.id,
        disease_symptoms: medDisease.trim(),
        medicine_name: medMedicine.trim() || 'علاج روتيني',
        start_date: medStartDate,
        end_date: medEndDate,
        withdrawal_days: 5,
        is_active: medIsActive,
        type: medType
      });
    }
    setMedDisease('');
    setMedMedicine('');
    setShowAddMedical(false);
  };

  // ----------------------------------------------------
  // تاريخ الزيجات والتزاوج السابقة والحالية
  // ----------------------------------------------------
  const marriagePairs = pairs.filter(p => 
    p.male_id === pigeon.id || 
    p.female_id === pigeon.id || 
    p.male_ring.includes(pigeon.ring_number) || 
    p.female_ring.includes(pigeon.ring_number)
  );

  // النسل المنتج من هذا الطائر
  const offspringList = allPigeons.filter(p => 
    p.origin_father_id === pigeon.id || 
    p.origin_mother_id === pigeon.id || 
    p.origin_father_ring === pigeon.ring_number || 
    p.origin_mother_ring === pigeon.ring_number
  );

  // السجل المرضي الخاص بهذا الطائر
  const pigeonMedicals = medicals.filter(m => m.pigeon_id === pigeon.id);

  // تفاصيل النسب للأجداد
  const getPigeonDetail = (idOrRing?: string) => {
    if (!idOrRing) return null;
    return allPigeons.find(p => p.id === idOrRing || p.ring_number === idOrRing) || null;
  };

  const father = getPigeonDetail(pigeon.origin_father_id || pigeon.origin_father_ring);
  const mother = getPigeonDetail(pigeon.origin_mother_id || pigeon.origin_mother_ring);
  const patGrandfather = father ? getPigeonDetail(father.origin_father_id || father.origin_father_ring) : null;
  const patGrandmother = father ? getPigeonDetail(father.origin_mother_id || father.origin_mother_ring) : null;
  const matGrandfather = mother ? getPigeonDetail(mother.origin_father_id || mother.origin_father_ring) : null;
  const matGrandmother = mother ? getPigeonDetail(mother.origin_mother_id || mother.origin_mother_ring) : null;

  // آخر وزن مسجل
  const latestWeight = pigeon.weights && pigeon.weights.length > 0 
    ? pigeon.weights[pigeon.weights.length - 1] 
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header: هوية الطائر وشريط الأدوات */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-5 text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3.5">
            {pigeon.image_url ? (
              <img 
                src={pigeon.image_url} 
                alt={pigeon.ring_number} 
                className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-md shrink-0" 
              />
            ) : (
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md shrink-0 ${pigeon.sex === 'Male' ? 'bg-blue-600 text-white' : pigeon.sex === 'Female' ? 'bg-rose-500 text-white' : 'bg-slate-700 text-slate-200'}`}>
                {pigeon.sex === 'Male' ? '♂' : pigeon.sex === 'Female' ? '♀' : '?'}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-xl text-amber-400">{pigeon.ring_number}</span>
                {pigeon.name && <span className="font-bold text-sm text-white">({pigeon.name})</span>}
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${pigeon.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : pigeon.status === 'Breeding' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-700 text-slate-300'}`}>
                  {pigeon.status === 'Active' ? 'نشط' : pigeon.status === 'Breeding' ? 'تفريخ' : pigeon.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {pigeon.breed} • {pigeon.phenotype} {pigeon.nest_box_number ? `• خانة ${pigeon.nest_box_number}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenSaleCertificate && (
              <button
                onClick={() => onOpenSaleCertificate(pigeon)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition-colors flex items-center gap-1 shadow-xs"
                title="إصدار شهادة نسب وبيع رسمية"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'en' ? 'Sale Cert' : 'شهادة نسب'}</span>
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors"
              title="طباعة بطاقة الكشف الكامل"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dossier Navigation Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-1 overflow-x-auto text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'overview' ? 'bg-white text-slate-900 shadow-xs font-bold border border-slate-200' : 'hover:bg-slate-200/60'}`}
          >
            <UserCheck className="w-4 h-4 text-amber-500" />
            <span>{lang === 'en' ? 'Overview & Traits' : 'الكشف العام والطفرات'}</span>
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'photos' ? 'bg-white text-slate-900 shadow-xs font-bold border border-slate-200' : 'hover:bg-slate-200/60'}`}
          >
            <Camera className="w-4 h-4 text-blue-500" />
            <span>{lang === 'en' ? 'Photos & Dates' : 'معرض الصور المؤرخة'} ({(pigeon.photos || []).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('weights')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'weights' ? 'bg-white text-slate-900 shadow-xs font-bold border border-slate-200' : 'hover:bg-slate-200/60'}`}
          >
            <Scale className="w-4 h-4 text-emerald-500" />
            <span>{lang === 'en' ? 'Weight Log' : 'سجل الأوزان والنمو'} ({(pigeon.weights || []).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('marriages')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'marriages' ? 'bg-white text-slate-900 shadow-xs font-bold border border-slate-200' : 'hover:bg-slate-200/60'}`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>{lang === 'en' ? 'Mating History' : 'سجل الزواجات السابقة'} ({marriagePairs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('medical')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'medical' ? 'bg-white text-slate-900 shadow-xs font-bold border border-slate-200' : 'hover:bg-slate-200/60'}`}
          >
            <Stethoscope className="w-4 h-4 text-purple-500" />
            <span>{lang === 'en' ? 'Medical Log' : 'السجل المرضي والعلاجي'} ({pigeonMedicals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pedigree')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'pedigree' ? 'bg-white text-slate-900 shadow-xs font-bold border border-slate-200' : 'hover:bg-slate-200/60'}`}
          >
            <GitCommit className="w-4 h-4 text-amber-500" />
            <span>{lang === 'en' ? 'Pedigree & Offspring' : 'شجرة النسب والنسل'} ({offspringList.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* TAB 1: Overview & Mutations & Colors */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">{t.hatchDate}</span>
                  <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">{pigeon.birth_date}</span>
                </div>

                <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 block font-bold uppercase">{lang === 'en' ? 'Latest Weight' : 'آخر وزن مسجل'}</span>
                  <span className="font-mono font-black text-emerald-800 text-sm mt-0.5 block">
                    {latestWeight ? `${latestWeight.weight_grams} g` : 'غير مسجل'}
                  </span>
                </div>

                <div className="p-3.5 bg-indigo-50/70 rounded-2xl border border-indigo-200">
                  <span className="text-[10px] text-indigo-700 block font-bold uppercase">{lang === 'en' ? 'Inbreeding (COI)' : 'معامل المصاهرة'}</span>
                  <span className="font-mono font-bold text-indigo-900 text-sm mt-0.5 block">
                    {pigeon.coi_percentage !== undefined ? `${pigeon.coi_percentage}%` : '0.0% (نقي)'}
                  </span>
                </div>

                <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200">
                  <span className="text-[10px] text-amber-700 block font-bold uppercase">{lang === 'en' ? 'Genotype' : 'الرمز الجيني'}</span>
                  <span className="font-mono font-bold text-amber-900 text-sm mt-0.5 block truncate">{pigeon.genotype || 'B/b St/+'}</span>
                </div>
              </div>

              {/* قسم الطفرات والجينات والألوان المدمجة مع إمكانية إضافة أي جديد */}
              <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-3xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                      <Palette className="w-4 h-4 text-amber-500" />
                      {lang === 'en' ? 'Plumage Colors, Mutations & Genetic Traits' : 'الطفرات، الجينات، الألوان، والصفات الوراثية والشكلية'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {lang === 'en' 
                        ? 'All traits and colors are listed. Click to link/unlink, or add any new trait or color on the fly.' 
                        : 'جميع الطفرات والألوان مدرجة. انقر على أي صفة لربطها بالطائر، أو أضف أي طفرة، جين، أو لون جديد فوراً.'}
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddMutationQuick(true)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 self-start sm:self-auto shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>{lang === 'en' ? 'Add New Trait / Color' : 'إضافة طفرة أو جين أو لون جديد'}</span>
                  </button>
                </div>

                {/* قائمة الطفرات والألوان المدرجة كأزرار وشارات تفاعلية */}
                <div className="space-y-3 pt-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">
                    {lang === 'en' ? 'Available Catalog (Click to toggle on this bird)' : 'مكتبة الطفرات والألوان (انقر للإضافة أو الحذف من هذا الطير):'}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {mutationsList.map(m => {
                      const isSelected = (pigeon.mutations || []).includes(m.name);
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => handleToggleMutation(m.name)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${isSelected ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs ring-2 ring-amber-400/30' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'}`}
                        >
                          <span 
                            className="w-3 h-3 rounded-full border border-black/20 shrink-0 shadow-2xs" 
                            style={{ backgroundColor: m.colorHex || '#f59e0b' }} 
                          />
                          <span>{m.name}</span>
                          <span className="text-[10px] opacity-60 font-mono">({m.type === 'Color' ? 'لون' : m.type === 'Gene' ? 'جين' : m.type === 'Mutation' ? 'طفرة' : 'صفة'})</span>
                          {isSelected && <span className="font-black text-xs">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* نموذج إضافة طفرة أو جين أو لون جديد فورياً */}
                {showAddMutationQuick && (
                  <form onSubmit={handleCreateQuickMutation} className="mt-4 p-4 bg-amber-50/80 rounded-2xl border border-amber-300 text-xs space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        {lang === 'en' ? 'Register New Trait, Gene, or Color' : 'تسجيل وإدراج طفرة أو جين أو لون جديد'}
                      </span>
                      <button type="button" onClick={() => setShowAddMutationQuick(false)} className="text-slate-400 hover:text-slate-700">✕</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="sm:col-span-2">
                        <label className="font-bold text-slate-700 block mb-1">اسم الطفرة أو اللون أو الصفة *</label>
                        <input
                          type="text"
                          required
                          value={newQuickMutationName}
                          onChange={(e) => setNewQuickMutationName(e.target.value)}
                          placeholder="مثال: شروال ريش كثيف، ديلوت، أندلسي، بارلس..."
                          className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-slate-900 font-bold focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">التصنيف *</label>
                        <select
                          value={newQuickMutationType}
                          onChange={(e) => setNewQuickMutationType(e.target.value as any)}
                          className="w-full p-2.5 bg-white border border-amber-300 rounded-xl font-bold"
                        >
                          <option value="Color">لون / نمط ريش</option>
                          <option value="Gene">جين وراثي</option>
                          <option value="Mutation">طفرة وراثية</option>
                          <option value="Trait">صفة شكلية / مورفولوجية</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">اللون الدلالي</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={newQuickMutationColorHex}
                            onChange={(e) => setNewQuickMutationColorHex(e.target.value)}
                            className="w-10 h-9 p-0.5 border border-amber-300 rounded-lg cursor-pointer bg-white"
                          />
                          <span className="font-mono text-slate-600">{newQuickMutationColorHex}</span>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="font-bold text-slate-700 block mb-1">ملاحظة أو وصف الوراثة</label>
                        <input
                          type="text"
                          value={newQuickMutationDesc}
                          onChange={(e) => setNewQuickMutationDesc(e.target.value)}
                          placeholder="مثال: سائد، متنحي مرتبط بالجنس، تأثير على الجناح..."
                          className="w-full p-2 bg-white border border-amber-300 rounded-xl text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-amber-200">
                      <button
                        type="button"
                        onClick={() => setShowAddMutationQuick(false)}
                        className="px-3.5 py-1.5 text-slate-600 font-bold hover:bg-amber-100 rounded-xl"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-amber-500 text-slate-950 font-black rounded-xl hover:bg-amber-400 transition-colors shadow-xs"
                      >
                        حفظ وإدراج للطائر فوراً
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* ملاحظات المربي */}
              {pigeon.notes && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <h4 className="font-bold text-slate-700 mb-1">{t.notes}:</h4>
                  <p className="text-slate-600 leading-relaxed italic">"{pigeon.notes}"</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Photo Gallery with Dates (إضافة صورة مع تاريخها) */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{lang === 'en' ? 'Dated Photo Inspection Archive' : 'معرض وأرشيف الصور المؤرخة للطائر'}</h4>
                  <p className="text-[11px] text-slate-500">{lang === 'en' ? 'Add photos with specific capture dates to track plumage development, condition, and eye sign.' : 'أضف صور الطائر مع تاريخ التقاط كل صورة لتتبع تطور الريش، الوقفة، وبصمة العين عبر الزمن.'}</p>
                </div>
                <button
                  onClick={() => setShowAddPhoto(true)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'en' ? 'Add Dated Photo' : 'إضافة صورة مع تاريخها'}</span>
                </button>
              </div>

              {/* نموذج إضافة صورة جديدة مع تاريخها */}
              {showAddPhoto && (
                <form onSubmit={handleAddPhotoSubmit} className="p-5 bg-slate-50 rounded-3xl border border-slate-300 text-xs space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-slate-900">{lang === 'en' ? 'New Dated Photo Entry' : 'تسجيل صورة جديدة مؤرخة'}</span>
                    <div className="flex items-center gap-2">
                      <button 
                        type="button" 
                        onClick={() => setPhotoInputMode('upload')}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${photoInputMode === 'upload' ? 'bg-slate-900 text-white' : 'bg-white border text-slate-600'}`}
                      >
                        رفع من الجهاز
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setPhotoInputMode('url')}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${photoInputMode === 'url' ? 'bg-slate-900 text-white' : 'bg-white border text-slate-600'}`}
                      >
                        رابط إنترنت
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      {photoInputMode === 'upload' ? (
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">اختر ملف الصورة من جهازك *</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoFileUpload}
                            className="w-full p-2 bg-white border border-slate-300 rounded-xl"
                          />
                          {newPhotoUrl && (
                            <div className="mt-2 text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> تم تحميل الصورة للمعاينة بنجاح
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">رابط الصورة (Image URL) *</label>
                          <input
                            type="url"
                            required
                            value={newPhotoUrl}
                            onChange={(e) => setNewPhotoUrl(e.target.value)}
                            placeholder="https://..."
                            className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">تاريخ التقاط الصورة *</label>
                      <input
                        type="date"
                        required
                        value={newPhotoDate}
                        onChange={(e) => setNewPhotoDate(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">ملاحظة أو وصف الصورة (اختياري)</label>
                    <input
                      type="text"
                      value={newPhotoCaption}
                      onChange={(e) => setNewPhotoCaption(e.target.value)}
                      placeholder="مثال: فحص جودة وقفة الطير، ريش الجناح بعد القلش، تصفية لون الصدر..."
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                    <button type="button" onClick={() => setShowAddPhoto(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-xl">إلغاء</button>
                    <button type="submit" disabled={!newPhotoUrl} className="px-5 py-2 bg-amber-500 disabled:opacity-50 text-slate-950 font-black rounded-xl hover:bg-amber-400">حفظ الصورة</button>
                  </div>
                </form>
              )}

              {/* معرض الصور الحالي */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(pigeon.photos || []).map(ph => (
                  <div key={ph.id} className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between group">
                    <div className="relative aspect-4/3 bg-slate-200">
                      <img 
                        src={ph.url} 
                        alt={ph.caption || pigeon.ring_number} 
                        className="w-full h-full object-cover" 
                      />
                      {pigeon.image_url === ph.url && (
                        <span className="absolute top-2 right-2 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow-md">
                          صورة البروفايل الرئيسية ⭐
                        </span>
                      )}
                    </div>

                    <div className="p-3 text-xs space-y-2">
                      <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-500" />
                          {ph.date}
                        </span>
                      </div>
                      {ph.caption && (
                        <p className="text-slate-800 font-medium text-[11px] leading-tight">{ph.caption}</p>
                      )}

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                        {pigeon.image_url !== ph.url ? (
                          <button
                            onClick={() => handleSetPrimaryPhoto(ph.url)}
                            className="text-[10px] font-bold text-amber-700 hover:text-amber-900"
                          >
                            تعيين كرئيسية
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-bold">الرئيسية الحالية</span>
                        )}

                        <button
                          onClick={() => handleDeletePhoto(ph.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="حذف الصورة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {(!pigeon.photos || pigeon.photos.length === 0) && (
                  <div className="col-span-full p-10 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400 text-xs">
                    <Camera className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    لا توجد صور مؤرخة مسجلة لهذا الطير حتى الآن. أضف صورته الأولى لمتابعة تطوره.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Weight Log (سجل الأوزان والنمو) */}
          {activeTab === 'weights' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{lang === 'en' ? 'Chronological Weight & Growth Log' : 'سجل قياس الأوزان والنمو الزمني'}</h4>
                  <p className="text-[11px] text-slate-500">{lang === 'en' ? 'Track bird weights across growth phases from squab weaning to adult breeding condition.' : 'سجل قياسات الوزن للزغاليل وللطيور البالغة مع مراقبة مؤشر التغير.'}</p>
                </div>
                <button
                  onClick={() => setShowAddWeight(true)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'en' ? 'Record Weight' : 'تسجيل وزن جديد'}</span>
                </button>
              </div>

              {/* Add Weight Form */}
              {showAddWeight && (
                <form onSubmit={handleAddWeightSubmit} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3 animate-in fade-in">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">الوزن بالجرام *</label>
                      <input
                        type="number"
                        required
                        value={newWeightGrams}
                        onChange={(e) => setNewWeightGrams(Number(e.target.value))}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-base"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">تاريخ الوزن *</label>
                      <input
                        type="date"
                        required
                        value={newWeightDate}
                        onChange={(e) => setNewWeightDate(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">ملاحظة الوزن (مرحلة النمو)</label>
                    <input
                      type="text"
                      value={newWeightNote}
                      onChange={(e) => setNewWeightNote(e.target.value)}
                      placeholder="مثال: وزن الفطام عمر 25 يوم، تغذية مكثفة، وزن موسم التزاوج..."
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                    <button type="button" onClick={() => setShowAddWeight(false)} className="px-3 py-1.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl">إلغاء</button>
                    <button type="submit" className="px-4 py-1.5 bg-amber-500 text-slate-950 font-black rounded-xl hover:bg-amber-400">حفظ الوزن</button>
                  </div>
                </form>
              )}

              {/* Weights Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-3xs">
                <table className="w-full text-xs text-left rtl:text-right">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold">
                    <tr>
                      <th className="py-2.5 px-4">تاريخ القياس</th>
                      <th className="py-2.5 px-4">الوزن المسجل</th>
                      <th className="py-2.5 px-4">ملاحظة مرحلة النمو</th>
                      <th className="py-2.5 px-4 text-center">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(pigeon.weights || []).map((w, idx) => {
                      const prevW = idx > 0 ? (pigeon.weights || [])[idx - 1].weight_grams : null;
                      const diff = prevW !== null ? w.weight_grams - prevW : null;
                      return (
                        <tr key={w.id} className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-4 font-mono font-semibold text-slate-700">{w.date}</td>
                          <td className="py-2.5 px-4 font-mono font-black text-amber-700 text-sm">
                            {w.weight_grams} g
                            {diff !== null && (
                              <span className={`text-[10px] ml-1.5 mr-1.5 font-bold ${diff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                ({diff >= 0 ? `+${diff}` : diff} g)
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-slate-600">{w.notes || '-'}</td>
                          <td className="py-2.5 px-4 text-center">
                            <button 
                              onClick={() => handleDeleteWeight(w.id)}
                              className="text-slate-300 hover:text-rose-600 p-1"
                              title="حذف القياس"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {(!pigeon.weights || pigeon.weights.length === 0) && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400">
                          لا توجد قياسات أوزان مسجلة لهذا الطير حتى الآن.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Marriage / Mating History (سجل الزواجات السابقة والحالية) */}
          {activeTab === 'marriages' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{lang === 'en' ? 'Mating & Marriage History' : 'سجل التزاوج والزيجات السابقة والحالية للطائر'}</h4>
                <p className="text-[11px] text-slate-500">{lang === 'en' ? 'Complete history of all mates, breeding cages, clutches, and offspring produced with each partner.' : 'كشف كامل بجميع الشركاء، أقفاص التزاوج، عدد الأعشاش المنتجة، والزغاليل الناتجة مع كل شريك.'}</p>
              </div>

              <div className="space-y-3">
                {marriagePairs.map(pr => {
                  const mateRing = pr.male_id === pigeon.id ? pr.female_ring : pr.male_ring;
                  const partnerPigeon = allPigeons.find(p => p.ring_number === mateRing.split(' ')[0] || p.id === (pr.male_id === pigeon.id ? pr.female_id : pr.male_id));
                  const pairCycles = cycles.filter(c => c.pair_id === pr.id);
                  const totalEggs = pairCycles.length * 2;
                  const totalFertile = pairCycles.reduce((sum, c) => sum + (c.fertile_eggs_count || 0), 0);
                  const totalSquabs = pairCycles.reduce((sum, c) => sum + (c.weaned_chicks_count || 0), 0);

                  // زغاليل هذا التزاوج
                  const pairOffspring = allPigeons.filter(o => 
                    (o.origin_father_id === pr.male_id && o.origin_mother_id === pr.female_id) ||
                    (o.origin_father_ring === pr.male_ring && o.origin_mother_ring === pr.female_ring)
                  );

                  return (
                    <div key={pr.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
                            <Heart className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 text-sm">
                              {lang === 'en' ? 'Partner:' : 'الشريك في الزواج:'} <span className="font-mono text-indigo-900 font-black">{mateRing}</span>
                            </span>
                            {partnerPigeon && (
                              <span className="text-[11px] text-slate-500 block">
                                {partnerPigeon.breed} • {partnerPigeon.phenotype}
                              </span>
                            )}
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${pr.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                          {pr.status === 'Active' ? (lang === 'en' ? 'Active Marriage' : 'زواج حالي نشط') : (lang === 'en' ? 'Separated' : 'زواج سابق (مفصول)')}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-slate-600 text-[11px]">
                        <div>
                          <span className="text-slate-400 block font-bold">تاريخ بداية التزاوج:</span>
                          <span className="font-mono font-bold text-slate-800">{pr.start_date}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-bold">خانة المحكر:</span>
                          <span className="font-semibold text-slate-800">{pr.cage_number || 'محكر تفريخ'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-bold">الأعشاش والبيض:</span>
                          <span className="font-mono font-bold text-slate-800">{pairCycles.length} عشوش ({totalFertile}/{totalEggs || 1} بيضة مخصبة)</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-bold">الزغاليل المفطومة:</span>
                          <span className="font-mono font-black text-amber-700">{totalSquabs} زغلول</span>
                        </div>
                      </div>

                      {/* قائمة الزغاليل من هذا الشريك */}
                      {pairOffspring.length > 0 && (
                        <div className="pt-2 border-t border-slate-200">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                            النسل المسجل من هذا الزواج ({pairOffspring.length}):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {pairOffspring.map(chick => (
                              <button
                                key={chick.id}
                                onClick={() => onSelectRelativePigeon && onSelectRelativePigeon(chick)}
                                className="px-2 py-1 bg-white hover:bg-amber-100 border border-slate-200 rounded-lg text-[11px] font-mono font-bold text-slate-800 transition-colors flex items-center gap-1"
                              >
                                <span>{chick.ring_number}</span>
                                <span className="text-[9px] text-slate-400">({chick.sex === 'Male' ? 'ذكر' : 'أنثى'})</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {marriagePairs.length === 0 && (
                  <div className="p-10 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400 text-xs">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    لم يسجل لهذا الطير أي تزاوج سابق حتى الآن.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: Medical History & Vaccines (السجل المرضي والعلاجي) */}
          {activeTab === 'medical' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{lang === 'en' ? 'Veterinary Treatments & Health Log' : 'السجل المرضي، العلاجات، والتطعيمات'}</h4>
                  <p className="text-[11px] text-slate-500">{lang === 'en' ? 'Track health diagnoses, antibiotic courses, and vaccines directly for this pigeon.' : 'سجل الأمراض، العلاجات المقدمة، فترات الأمان الدوائي وحالة شفاء الطائر.'}</p>
                </div>
                <button
                  onClick={() => setShowAddMedical(true)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'en' ? 'Add Medical Record' : 'تسجيل حالة مرضية أو علاج'}</span>
                </button>
              </div>

              {/* نموذج إضافة سجل طبي جديد */}
              {showAddMedical && (
                <form onSubmit={handleAddMedicalSubmit} className="p-4 bg-slate-50 rounded-2xl border border-slate-300 text-xs space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-slate-900">تسجيل علاج أو تحصين جديد</span>
                    <button type="button" onClick={() => setShowAddMedical(false)} className="text-slate-400">✕</button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">التشخيص أو المرض أو نوع التطعيم *</label>
                      <input
                        type="text"
                        required
                        value={medDisease}
                        onChange={(e) => setMedDisease(e.target.value)}
                        placeholder="مثال: كنكر خفيف، سلاسل تنفسية، تطعيم بارامكسو..."
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">اسم الدواء أو التحصين</label>
                      <input
                        type="text"
                        value={medMedicine}
                        onChange={(e) => setMedMedicine(e.target.value)}
                        placeholder="مثال: رونيدازول، تايلوزين، لقاح كولومبوفاك..."
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">تاريخ البداية</label>
                      <input
                        type="date"
                        required
                        value={medStartDate}
                        onChange={(e) => setMedStartDate(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">تاريخ النهاية</label>
                      <input
                        type="date"
                        required
                        value={medEndDate}
                        onChange={(e) => setMedEndDate(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">النوع والحالة</label>
                      <div className="flex items-center gap-2 mt-1">
                        <select
                          value={medType}
                          onChange={(e) => setMedType(e.target.value as any)}
                          className="p-2 bg-white border border-slate-300 rounded-xl font-bold text-xs"
                        >
                          <option value="Treatment">علاج مرضي</option>
                          <option value="Vaccination">تطعيم وقائي</option>
                          <option value="Routine">جرعة دورية</option>
                        </select>
                        <label className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                          <input
                            type="checkbox"
                            checked={medIsActive}
                            onChange={(e) => setMedIsActive(e.target.checked)}
                          />
                          قيد العلاج
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                    <button type="button" onClick={() => setShowAddMedical(false)} className="px-3.5 py-1.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl">إلغاء</button>
                    <button type="submit" className="px-4 py-1.5 bg-amber-500 text-slate-950 font-black rounded-xl hover:bg-amber-400">حفظ السجل الصحي</button>
                  </div>
                </form>
              )}

              {/* بطاقات السجلات الطبية السابقة */}
              <div className="space-y-3">
                {pigeonMedicals.map(m => (
                  <div key={m.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{m.disease_symptoms}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.is_active ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {m.is_active ? 'قيد العلاج حالياً' : 'تم الشفاء التام ✓'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-200 text-slate-600 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">الدواء:</span>
                        <span className="font-bold text-indigo-700">{m.medicine_name}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">فترة العلاج:</span>
                        <span className="font-mono text-slate-800">{m.start_date} إلى {m.end_date}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">فترة الأمان (سحب):</span>
                        <span className="font-mono font-bold text-amber-700">{m.withdrawal_days} أيام</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">التصنيف:</span>
                        <span className="font-semibold text-slate-800">{m.type || 'علاجي'}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {pigeonMedicals.length === 0 && (
                  <div className="p-10 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400 text-xs">
                    <Stethoscope className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    لا توجد سجلات مرضية أو علاجات مسجلة لهذا الطير. الطائر بصحة جيدة وسليمة.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: Pedigree Tree & Offspring (شجرة النسب والنسل) */}
          {activeTab === 'pedigree' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{lang === 'en' ? 'Official Multi-Generation Pedigree Tree' : 'شجرة الأنساب والأصول الموثقة حتى 3 أجيال'}</h4>
                <p className="text-[11px] text-slate-500">{lang === 'en' ? 'Lineage pedigree with direct click to navigate between parents and ancestors.' : 'سجل الأب، الأم، وأجداد الأب والأم مع إمكانية النقر لفتح بطاقة أي فرد.'}</p>
              </div>

              {/* شجرة الأنساب */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* Generation 1: الأب والأم */}
                <div className="space-y-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">الجيل الأول (الأبوين):</div>

                  <div 
                    onClick={() => father && onSelectRelativePigeon && onSelectRelativePigeon(father)}
                    className={`p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200 ${father ? 'cursor-pointer hover:bg-blue-100/60' : ''}`}
                  >
                    <span className="text-[10px] text-blue-600 font-bold block">الأب البيولوجي (Father ♂)</span>
                    <span className="font-mono font-black text-slate-900 block text-sm mt-0.5">{father ? father.ring_number : pigeon.origin_father_ring || 'غير مسجل'}</span>
                    <span className="text-[10px] text-slate-500 block">{father ? `${father.breed} • ${father.phenotype}` : '-'}</span>
                  </div>

                  <div 
                    onClick={() => mother && onSelectRelativePigeon && onSelectRelativePigeon(mother)}
                    className={`p-3.5 bg-rose-50/60 rounded-2xl border border-rose-200 ${mother ? 'cursor-pointer hover:bg-rose-100/60' : ''}`}
                  >
                    <span className="text-[10px] text-rose-600 font-bold block">الأم البيولوجية (Mother ♀)</span>
                    <span className="font-mono font-black text-slate-900 block text-sm mt-0.5">{mother ? mother.ring_number : pigeon.origin_mother_ring || 'غير مسجل'}</span>
                    <span className="text-[10px] text-slate-500 block">{mother ? `${mother.breed} • ${mother.phenotype}` : '-'}</span>
                  </div>
                </div>

                {/* Generation 2: أجداد من جهة الأب */}
                <div className="space-y-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">أجداد من جهة الأب:</div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block">جد الأب ♂</span>
                    <span className="font-mono font-bold text-slate-800 block">{patGrandfather ? patGrandfather.ring_number : 'مستورد أو غير مسجل'}</span>
                    <span className="text-[10px] text-slate-400 block">{patGrandfather?.breed || '-'}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block">جدة الأب ♀</span>
                    <span className="font-mono font-bold text-slate-800 block">{patGrandmother ? patGrandmother.ring_number : 'مستوردة أو غير مسجلة'}</span>
                    <span className="text-[10px] text-slate-400 block">{patGrandmother?.breed || '-'}</span>
                  </div>
                </div>

                {/* Generation 2: أجداد من جهة الأم */}
                <div className="space-y-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">أجداد من جهة الأم:</div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block">جد الأم ♂</span>
                    <span className="font-mono font-bold text-slate-800 block">{matGrandfather ? matGrandfather.ring_number : 'مستورد أو غير مسجل'}</span>
                    <span className="text-[10px] text-slate-400 block">{matGrandfather?.breed || '-'}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block">جدة الأم ♀</span>
                    <span className="font-mono font-bold text-slate-800 block">{matGrandmother ? matGrandmother.ring_number : 'مستوردة أو غير مسجلة'}</span>
                    <span className="text-[10px] text-slate-400 block">{matGrandmother?.breed || '-'}</span>
                  </div>
                </div>
              </div>

              {/* قائمة النسل الكامل المنتج */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Baby className="w-4 h-4 text-indigo-600" />
                    جميع الزغاليل والأفراخ المنتجة من هذا الطائر ({offspringList.length})
                  </h5>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {offspringList.map(chick => (
                    <div 
                      key={chick.id}
                      onClick={() => onSelectRelativePigeon && onSelectRelativePigeon(chick)}
                      className="p-3 bg-slate-50 hover:bg-amber-50/80 rounded-2xl border border-slate-200 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${chick.sex === 'Male' ? 'bg-blue-500' : 'bg-rose-500'}`}></span>
                          <span className="font-mono font-black text-slate-900 text-xs">{chick.ring_number}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5">{chick.breed} • {chick.phenotype}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{chick.birth_date}</span>
                    </div>
                  ))}

                  {offspringList.length === 0 && (
                    <div className="col-span-full p-6 text-center text-slate-400 text-xs">
                      لم يتم تسجيل أو فطام أي زغاليل مباشرة لهذا الطير حتى الآن.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
