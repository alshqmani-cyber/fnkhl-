/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Crown,
  GitMerge, 
  FolderHeart, 
  Dna, 
  Globe, 
  Plus, 
  Award, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Download, 
  Upload, 
  RotateCcw, 
  Settings, 
  Users, 
  Search, 
  FileText,
  Palette
} from 'lucide-react';

// استيراد الجداول الأساسية
import { 
  Pigeon, 
  Pair, 
  ProductionCycle, 
  ChickWeight, 
  MedicalRecord, 
  AviaryProfile, 
  Breed,
  MutationTrait
} from './types';

// استيراد الموك المبدئي
import { 
  DEFAULT_AVIARY_PROFILE, 
  DEFAULT_MUTATIONS,
  MOCK_BREEDS, 
  MOCK_PIGEONS, 
  MOCK_PAIRS, 
  MOCK_CYCLES, 
  MOCK_WEIGHTS, 
  MOCK_MEDICALS
} from './data';

// استيراد الترجمة واللغة
import { Language, translations } from './i18n';

// استيراد الشاشات الفرعية الخاصة بالحمام فقط
import DashboardView from './components/DashboardView';
import PigeonsView from './components/PigeonsView';
import PairsProductionView from './components/PairsProductionView';
import BreedsMutationsView from './components/BreedsMutationsView';
import RegisterModal from './components/RegisterModal';
import SaleCertificateModal from './components/SaleCertificateModal';
import PigeonDossierModal from './components/PigeonDossierModal';
import CommandPalette from './components/CommandPalette';

export default function App() {
  // ----------------------------------------------------
  // إدارة اللغة والاتجاه (Bilingual Engine: AR / EN)
  // ----------------------------------------------------
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang');
      if (urlLang === 'ar' || urlLang === 'en') return urlLang;
      const savedLang = localStorage.getItem('aviary_lang') as Language;
      if (savedLang === 'ar' || savedLang === 'en') return savedLang;
    }
    return 'ar'; // العربية كلغة افتراضية للمربي العربي
  });

  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem('aviary_lang', lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }, [lang]);

  // Tab State: مخصص للحمام والإنتاج والسلالات والتقييم فقط
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pigeons' | 'pairs' | 'breeds'>('dashboard');

  // Modals State
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);
  const [selectedCertPigeon, setSelectedCertPigeon] = useState<Pigeon | null>(null);
  const [selectedDossierPigeon, setSelectedDossierPigeon] = useState<Pigeon | null>(null);

  // Global Ctrl+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ----------------------------------------------------
  // بيانات اللوفت وسلالات وطفرات الحمام
  // ----------------------------------------------------
  const [profile, setProfile] = useState<AviaryProfile>(() => {
    const local = localStorage.getItem('aviary_profile_pigeon_v4');
    return local ? JSON.parse(local) : DEFAULT_AVIARY_PROFILE;
  });

  const [breeds, setBreeds] = useState<Breed[]>(() => {
    const local = localStorage.getItem('aviary_pigeon_breeds_v4');
    return local ? JSON.parse(local) : MOCK_BREEDS;
  });

  const [mutationsList, setMutationsList] = useState<MutationTrait[]>(() => {
    const local = localStorage.getItem('aviary_pigeon_mutations_v4');
    return local ? JSON.parse(local) : DEFAULT_MUTATIONS;
  });

  // ----------------------------------------------------
  // سجلات الحمام والأزواج والإنتاج والسجل الصحي
  // ----------------------------------------------------
  const [pigeons, setPigeons] = useState<Pigeon[]>(() => {
    const local = localStorage.getItem('erp_pigeons_v4');
    return local ? JSON.parse(local) : MOCK_PIGEONS;
  });

  const [pairs, setPairs] = useState<Pair[]>(() => {
    const local = localStorage.getItem('erp_pairs_v4');
    return local ? JSON.parse(local) : MOCK_PAIRS;
  });

  const [cycles, setCycles] = useState<ProductionCycle[]>(() => {
    const local = localStorage.getItem('erp_cycles_v4');
    return local ? JSON.parse(local) : MOCK_CYCLES;
  });

  const [weights, setWeights] = useState<ChickWeight[]>(() => {
    const local = localStorage.getItem('erp_weights_v4');
    return local ? JSON.parse(local) : MOCK_WEIGHTS;
  });

  const [medicals, setMedicals] = useState<MedicalRecord[]>(() => {
    const local = localStorage.getItem('erp_medicals_v4');
    return local ? JSON.parse(local) : MOCK_MEDICALS;
  });

  // حفظ التحديثات تلقائياً في LocalStorage
  useEffect(() => {
    localStorage.setItem('aviary_profile_pigeon_v4', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('aviary_pigeon_breeds_v4', JSON.stringify(breeds));
  }, [breeds]);

  useEffect(() => {
    localStorage.setItem('aviary_pigeon_mutations_v4', JSON.stringify(mutationsList));
  }, [mutationsList]);

  useEffect(() => {
    localStorage.setItem('erp_pigeons_v4', JSON.stringify(pigeons));
  }, [pigeons]);

  useEffect(() => {
    localStorage.setItem('erp_pairs_v4', JSON.stringify(pairs));
  }, [pairs]);

  useEffect(() => {
    localStorage.setItem('erp_cycles_v4', JSON.stringify(cycles));
  }, [cycles]);

  useEffect(() => {
    localStorage.setItem('erp_weights_v4', JSON.stringify(weights));
  }, [weights]);

  useEffect(() => {
    localStorage.setItem('erp_medicals_v4', JSON.stringify(medicals));
  }, [medicals]);

  // مزامنة الطائر المختار في الكشف عند التعديل
  useEffect(() => {
    if (selectedDossierPigeon) {
      const fresh = pigeons.find(p => p.id === selectedDossierPigeon.id);
      if (fresh) setSelectedDossierPigeon(fresh);
    }
  }, [pigeons]);

  // ----------------------------------------------------
  // المعالجات الخاصة بالطيور وسلالات الحمام
  // ----------------------------------------------------
  const handleCreatePigeon = (newB: Omit<Pigeon, 'id'>) => {
    const newlyCreated: Pigeon = {
      ...newB,
      id: `pigeon-${Date.now()}`
    };
    setPigeons(prev => [newlyCreated, ...prev]);
  };

  const handleUpdatePigeon = (id: string, updated: Partial<Pigeon>) => {
    setPigeons(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const handleDeletePigeon = (id: string) => {
    setPigeons(prev => prev.filter(p => p.id !== id));
    if (selectedDossierPigeon?.id === id) {
      setSelectedDossierPigeon(null);
    }
  };

  // معالجات سلالات وأنواع الحمام
  const handleAddBreed = (newBreed: Omit<Breed, 'id'>) => {
    const newlyCreated: Breed = { ...newBreed, id: `breed-${Date.now()}` };
    setBreeds(prev => [...prev, newlyCreated]);
  };

  const handleDeleteBreed = (id: string) => {
    if (breeds.length <= 1) return;
    setBreeds(prev => prev.filter(b => b.id !== id));
  };

  // معالجات الطفرات والجينات والألوان
  const handleAddMutation = (newMut: Omit<MutationTrait, 'id'>) => {
    const newlyCreated: MutationTrait = { ...newMut, id: `mut-${Date.now()}` };
    setMutationsList(prev => [...prev, newlyCreated]);
  };

  const handleDeleteMutation = (id: string) => {
    setMutationsList(prev => prev.filter(m => m.id !== id));
  };

  // معالجات الأزواج ودورات التحضين
  const handleAddPair = (newPair: Omit<Pair, 'id'>) => {
    const newlyCreated: Pair = { ...newPair, id: `pair-${Date.now()}` };
    setPairs(prev => [newlyCreated, ...prev]);
  };

  const handleUpdatePairStatus = (id: string, status: 'Active' | 'Separated') => {
    setPairs(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const handleAddCycle = (newCycle: Omit<ProductionCycle, 'id'>) => {
    const newlyCreated: ProductionCycle = { ...newCycle, id: `cycle-${Date.now()}` };
    setCycles(prev => [newlyCreated, ...prev]);
  };

  const handleUpdateCycle = (id: string, updated: Partial<ProductionCycle>) => {
    setCycles(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
  };

  // معالج إضافة سجل صحي أو علاج
  const handleAddMedicalRecord = (record: Omit<MedicalRecord, 'id'>) => {
    const newMed: MedicalRecord = {
      ...record,
      id: `med-${Date.now()}`
    };
    setMedicals(prev => [newMed, ...prev]);
  };

  // حفظ وتحديث ملف اللوفت
  const handleSaveProfile = (updated: AviaryProfile) => {
    setProfile(updated);
    setShowRegisterModal(false);
  };

  // تحميل لوفت أبطال نموذجي
  const handleLoadSampleLoft = () => {
    setPigeons(MOCK_PIGEONS);
    setPairs(MOCK_PAIRS);
    setCycles(MOCK_CYCLES);
    setWeights(MOCK_WEIGHTS);
    setMedicals(MOCK_MEDICALS);
    setBreeds(MOCK_BREEDS);
    setMutationsList(DEFAULT_MUTATIONS);
    setProfile(DEFAULT_AVIARY_PROFILE);
    setShowRegisterModal(false);
  };

  // تصدير ملف Excel / CSV
  const handleExportCsv = () => {
    if (pigeons.length === 0) {
      alert(lang === 'en' ? 'No pigeons to export.' : 'لا يوجد حمام مسجل لتصديره.');
      return;
    }

    const headers = [
      'ID', 'RingNumber', 'Name', 'Sex', 'Breed', 'Status', 
      'BirthDate', 'Phenotype', 'Genotype', 'FatherRing', 'MotherRing', 'Notes'
    ];
    
    const rows = pigeons.map(p => [
      p.id,
      `"${p.ring_number}"`,
      `"${p.name || ''}"`,
      p.sex,
      `"${p.breed}"`,
      p.status,
      p.birth_date,
      `"${p.phenotype}"`,
      `"${p.genotype}"`,
      `"${p.origin_father_ring || ''}"`,
      `"${p.origin_mother_ring || ''}"`,
      `"${(p.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pigeon_loft_registry_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // تصدير نسخة احتياطية كاملة JSON
  const handleExportBackup = () => {
    const backupData = {
      version: '4.0',
      exportedAt: new Date().toISOString(),
      profile,
      breeds,
      mutationsList,
      pigeons,
      pairs,
      cycles,
      weights,
      medicals
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pigeon_loft_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // استيراد نسخة احتياطية
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.profile) setProfile(json.profile);
        if (json.breeds) setBreeds(json.breeds);
        if (json.mutationsList) setMutationsList(json.mutationsList);
        if (json.pigeons) setPigeons(json.pigeons);
        if (json.pairs) setPairs(json.pairs);
        if (json.cycles) setCycles(json.cycles);
        if (json.weights) setWeights(json.weights);
        if (json.medicals) setMedicals(json.medicals);
        alert(lang === 'en' ? 'Pigeon loft backup restored successfully!' : 'تم استعادة نسخة لوفت الحمام بنجاح!');
      } catch (err) {
        alert(lang === 'en' ? 'Invalid JSON backup file.' : 'ملف النسخة الاحتياطية غير صالح.');
      }
    };
    reader.readAsText(file);
  };

  // تصفير السجلات
  const handleResetAll = () => {
    if (confirm(t.resetConfirm)) {
      setPigeons([]);
      setPairs([]);
      setCycles([]);
      setWeights([]);
      setMedicals([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/80 flex flex-col font-sans" dir={lang === 'ar' ? 'rtl' : 'ltr'} id="pigeon-erp-root">
      
      {/* الترويسة الرئيسية - Pigeon Loft Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo and Pigeon Loft Brand */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-amber-400 rounded-xl text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/20">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono font-bold text-amber-400 tracking-wider bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    نظام إدارة مزارع الحمام الاحترافي
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    • {profile.ringPrefix}
                  </span>
                </div>
                <h1 className="text-base sm:text-lg font-black tracking-tight leading-tight mt-0.5 text-white flex items-center gap-2">
                  <span>{profile.aviaryName}</span>
                </h1>
              </div>
            </div>
            
            {/* Right Action Controls: Search, Lang Toggle, Settings, Data Backup */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              
              {/* Spotlight Search (Ctrl+K) */}
              <button
                onClick={() => setShowCommandPalette(true)}
                className="bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs"
                title="البحث الشامل الفوري بالحجل والسلالة (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline font-mono text-[11px]">{lang === 'en' ? 'Search (Ctrl+K)' : 'بحث (Ctrl+K)'}</span>
              </button>

              {/* Language Switcher */}
              <button
                onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                className="bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold px-3 py-1.5 rounded-xl border border-slate-700 text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                title="Switch Language / تبديل اللغة"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="font-bold">{lang === 'en' ? 'العربية' : 'English'}</span>
              </button>

              {/* Loft Settings Button */}
              <button
                onClick={() => setShowRegisterModal(true)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
                title="إعدادات المنشأة واللوفت"
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{lang === 'en' ? 'Loft Profile' : 'إعدادات اللوفت'}</span>
              </button>

              {/* Data Tools: CSV, JSON */}
              <div className="hidden xl:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
                <button
                  onClick={handleExportCsv}
                  className="text-[11px] font-semibold text-slate-300 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-1"
                  title="تصدير سجل الحمام إلى ملف CSV / Excel"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>CSV</span>
                </button>

                <button
                  onClick={handleExportBackup}
                  className="text-[11px] font-semibold text-slate-300 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-1"
                  title="تصدير نسخة احتياطية JSON"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>نسخة</span>
                </button>

                <label className="text-[11px] font-semibold text-slate-300 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>استعادة</span>
                  <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                </label>

                <button
                  onClick={handleLoadSampleLoft}
                  className="text-[11px] font-semibold text-slate-300 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-1"
                  title="تحميل لوفت أبطال تجريبي"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>بيانات تجريبية</span>
                </button>
              </div>

              {/* Reset button */}
              <button 
                onClick={handleResetAll}
                className="text-[10px] font-bold bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-slate-950 px-2.5 py-1.5 rounded-xl border border-rose-500/20 transition-colors"
                title="تصفير السجلات"
              >
                تصفير ↺
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* شريط الملاحة المستعرض - مخصص للحمام والإنتاج والسلالات والتقييم فقط */}
      <nav className="bg-white border-b border-slate-200/90 shadow-3xs sticky top-[65px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <div className="flex space-x-1 sm:space-x-2 py-2">
            
            {/* 1. اللوحة الرئيسية والتقييم وسجل الشرف */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap leading-none ${activeTab === 'dashboard' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100/80'}`}
            >
              <Crown className="w-4 h-4 text-amber-500" />
              <span>{lang === 'en' ? 'Dashboard & Evaluations' : 'اللوحة الرئيسية والتقييم'}</span>
            </button>

            {/* 2. سجل الحمام والكشف الكامل */}
            <button
              onClick={() => setActiveTab('pigeons')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap leading-none ${activeTab === 'pigeons' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100/80'}`}
            >
              <GitMerge className="w-4 h-4 text-indigo-500" />
              <span>{lang === 'en' ? 'Pigeon Registry & Dossiers' : 'سجل الحمام والكشف الكامل'}</span>
            </button>

            {/* 3. أزواج التكاثر والإنتاج */}
            <button
              onClick={() => setActiveTab('pairs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap leading-none ${activeTab === 'pairs' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100/80'}`}
            >
              <FolderHeart className="w-4 h-4 text-rose-500" />
              <span>{lang === 'en' ? 'Breeding Pairs & Clutches' : 'أزواج التكاثر وحضانات البيض'}</span>
            </button>

            {/* 4. أنواع وسلالات وطفرات وألوان الحمام */}
            <button
              onClick={() => setActiveTab('breeds')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap leading-none ${activeTab === 'breeds' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100/80'}`}
            >
              <Palette className="w-4 h-4 text-purple-500" />
              <span>{lang === 'en' ? 'Pigeon Breeds & Mutations' : 'أنواع وسلالات وطفرات الحمام'}</span>
            </button>

          </div>
        </div>
      </nav>

      {/* المحتوى الرئيسي للتبويبات (Main Views) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* 1. اللوحة الرئيسية: تقييم أفضل فرد، أفضل زوج، أفضل وزن ولون، أكبر فرد، إحصائيات شاملة، ودخول مباشر لبيانات الفرد */}
        {activeTab === 'dashboard' && (
          <DashboardView 
            pigeons={pigeons}
            pairs={pairs}
            cycles={cycles}
            medicals={medicals}
            breeds={breeds}
            mutationsList={mutationsList}
            onAddCycle={handleAddCycle}
            onCreatePigeon={handleCreatePigeon}
            setActiveTab={setActiveTab}
            onSelectPigeonForDossier={(p) => setSelectedDossierPigeon(p)}
            lang={lang}
          />
        )}

        {/* 2. سجل الحمام مع إمكانية فتح الكشف الكامل وإضافة أنواع الحمام */}
        {activeTab === 'pigeons' && (
          <PigeonsView 
            pigeons={pigeons}
            cycles={cycles}
            breeds={breeds}
            mutationsList={mutationsList}
            onCreatePigeon={handleCreatePigeon}
            onUpdatePigeon={handleUpdatePigeon}
            onDeletePigeon={handleDeletePigeon}
            onAddBreed={handleAddBreed}
            onOpenSaleCertificate={(p) => setSelectedCertPigeon(p)}
            onOpenDossier={(p) => setSelectedDossierPigeon(p)}
            lang={lang}
          />
        )}

        {/* 3. تزاوج الأزواج والتحضين والحضانة والإنتاج */}
        {activeTab === 'pairs' && (
          <PairsProductionView 
            pairs={pairs}
            pigeons={pigeons}
            cycles={cycles}
            onAddPair={handleAddPair}
            onUpdatePairStatus={handleUpdatePairStatus}
            onAddCycle={handleAddCycle}
            onUpdateCycle={handleUpdateCycle}
            onDeletePair={() => {}}
          />
        )}

        {/* 4. إدارة سلالات وأنواع الحمام والطفرات والألوان والجينات والصفات */}
        {activeTab === 'breeds' && (
          <BreedsMutationsView 
            breeds={breeds}
            mutations={mutationsList}
            onAddBreed={handleAddBreed}
            onDeleteBreed={handleDeleteBreed}
            onAddMutation={handleAddMutation}
            onDeleteMutation={handleDeleteMutation}
            lang={lang}
          />
        )}

      </main>

      {/* تذييل الصفحة */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              <span className="font-bold text-white">
                {profile.aviaryName} • نظام إدارة مزارع الحمام الاحترافية
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-[11px] text-slate-400">
              <span>✓ فحص تخصيب البيض</span>
              <span>• ترقب الفقس</span>
              <span>• تركيب الحجول</span>
              <span>• سجل الزواجات وتفريد الزغاليل</span>
            </div>
          </div>
          <div className="border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-[11px] gap-2">
            <p className="flex items-center gap-1">
              مخصص بالكامل لسجلات الحمام وأنسابه وتقييم الأبطال والأزواج والأوزان وسلالات الحمام.
            </p>
            <p>جميع السجلات والصور والأوزان مخزنة محلياً لضمان الخصوصية والسرعة الفائقة.</p>
          </div>
        </div>
      </footer>

      {/* Register / Aviary Setup Wizard Modal */}
      <RegisterModal 
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        profile={profile}
        sections={[]}
        onSaveProfile={handleSaveProfile}
        onLoadDemoData={handleLoadSampleLoft}
        lang={lang}
        setLang={setLang}
      />

      {/* Sale Certificate Modal */}
      <SaleCertificateModal 
        isOpen={!!selectedCertPigeon}
        onClose={() => setSelectedCertPigeon(null)}
        pigeon={selectedCertPigeon}
        profile={profile}
        lang={lang}
      />

      {/* Pigeon Full Dossier Modal (الكشف الكامل للطير: الصور مع التواريخ، الأوزان، السجل المرضي، الزواجات السابقة، الطفرات والألوان) */}
      <PigeonDossierModal 
        isOpen={!!selectedDossierPigeon}
        onClose={() => setSelectedDossierPigeon(null)}
        pigeon={selectedDossierPigeon}
        allPigeons={pigeons}
        pairs={pairs}
        cycles={cycles}
        medicals={medicals}
        mutationsList={mutationsList}
        onUpdatePigeon={handleUpdatePigeon}
        onOpenSaleCertificate={(p) => setSelectedCertPigeon(p)}
        onAddNewGlobalMutation={handleAddMutation}
        onAddMedicalRecord={handleAddMedicalRecord}
        onSelectRelativePigeon={(rel) => setSelectedDossierPigeon(rel)}
        profile={profile}
        lang={lang}
      />

      {/* Spotlight Command Palette (Ctrl+K) */}
      <CommandPalette 
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        pigeons={pigeons}
        pairs={pairs}
        sections={[]}
        contacts={[]}
        onSelectTab={(tab) => {
          if (tab === 'dashboard' || tab === 'pigeons' || tab === 'pairs' || tab === 'breeds') {
            setActiveTab(tab);
          } else {
            setActiveTab('pigeons');
          }
        }}
        onOpenRegisterModal={() => setShowRegisterModal(true)}
        lang={lang}
      />

    </div>
  );
}
