/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Sliders, 
  Egg, 
  MapPin, 
  Globe, 
  Layers, 
  Calendar, 
  BadgePercent, 
  ChevronRight, 
  ChevronLeft,
  ShieldCheck,
  Award
} from 'lucide-react';
import { AviaryProfile, LoftSection } from '../types';
import { Language, translations } from '../i18n';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AviaryProfile;
  sections: LoftSection[];
  onSaveProfile: (profile: AviaryProfile, sections: LoftSection[]) => void;
  onLoadDemoData: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export default function RegisterModal({
  isOpen,
  onClose,
  profile,
  sections,
  onSaveProfile,
  onLoadDemoData,
  lang,
  setLang
}: RegisterModalProps) {
  if (!isOpen) return null;

  const t = translations[lang];
  const [step, setStep] = useState<number>(1);

  // Form states
  const [aviaryName, setAviaryName] = useState(profile.aviaryName || 'AviarySoft Loft');
  const [breederName, setBreederName] = useState(profile.breederName || 'Breeder Name');
  const [email, setEmail] = useState(profile.email || 'breeder@aviarysoft.com');
  const [phone, setPhone] = useState(profile.phone || '+1 555-0192');
  const [country, setCountry] = useState(profile.country || 'United States');
  const [city, setCity] = useState(profile.city || 'California');
  const [ringPrefix, setRingPrefix] = useState(profile.ringPrefix || 'AS-2026');
  const [ringYear, setRingYear] = useState(profile.ringYear || 2026);
  const [currency, setCurrency] = useState(profile.currency || 'USD ($)');
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>(profile.unitSystem || 'metric');
  const [dateFormat, setDateFormat] = useState<'YYYY-MM-DD' | 'DD/MM/YYYY'>(profile.dateFormat || 'YYYY-MM-DD');

  const [defaultSpecies, setDefaultSpecies] = useState(profile.defaultSpecies || 'Pigeon (Columba livia)');
  const [defaultIncubationDays, setDefaultIncubationDays] = useState(profile.defaultIncubationDays || 18);
  const [defaultClutchSize, setDefaultClutchSize] = useState(profile.defaultClutchSize || 2);
  const [candlingDays, setCandlingDays] = useState(profile.candlingDays || 5);
  const [bandingAgeDays, setBandingAgeDays] = useState(profile.bandingAgeDays || 7);
  const [weaningAgeDays, setWeaningAgeDays] = useState(profile.weaningAgeDays || 25);

  const [localSections, setLocalSections] = useState<LoftSection[]>(sections);

  const handleAddSection = () => {
    const newSec: LoftSection = {
      id: `sec-${Date.now()}`,
      name: lang === 'ar' ? `قسم إضافي جديد ${localSections.length + 1}` : `New Loft Section ${localSections.length + 1}`,
      type: 'Breeding',
      capacity: 20,
      nestBoxesCount: 10,
      description: 'Standard ventilated aviary pen.'
    };
    setLocalSections([...localSections, newSec]);
  };

  const handleUpdateSection = (id: string, updated: Partial<LoftSection>) => {
    setLocalSections(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const handleDeleteSection = (id: string) => {
    if (localSections.length <= 1) return;
    setLocalSections(prev => prev.filter(s => s.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile: AviaryProfile = {
      ...profile,
      aviaryName,
      breederName,
      email,
      phone,
      country,
      city,
      ringPrefix,
      ringYear: Number(ringYear),
      currency,
      unitSystem,
      dateFormat,
      defaultSpecies,
      defaultIncubationDays: Number(defaultIncubationDays),
      defaultClutchSize: Number(defaultClutchSize),
      candlingDays: Number(candlingDays),
      bandingAgeDays: Number(bandingAgeDays),
      weaningAgeDays: Number(weaningAgeDays),
      isRegistered: true,
    };
    onSaveProfile(updatedProfile, localSections);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-5 text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight">{t.registerTitle}</h2>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-400/30">
                  app.aviarysoft.com/register
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{t.registerSubtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Language toggle in modal */}
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold px-2.5 py-1.5 rounded-lg border border-slate-600 transition-colors flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Wizard Step Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between gap-1 overflow-x-auto text-xs font-semibold text-slate-600">
          <button
            onClick={() => setStep(1)}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${step === 1 ? 'bg-white text-slate-900 shadow-sm font-bold border border-slate-200' : 'hover:bg-slate-200/60'}`}
          >
            <span>{t.step1Loft}</span>
          </button>
          <button
            onClick={() => setStep(2)}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${step === 2 ? 'bg-white text-slate-900 shadow-sm font-bold border border-slate-200' : 'hover:bg-slate-200/60'}`}
          >
            <span>{t.step2Regional}</span>
          </button>
          <button
            onClick={() => setStep(3)}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${step === 3 ? 'bg-white text-slate-900 shadow-sm font-bold border border-slate-200' : 'hover:bg-slate-200/60'}`}
          >
            <span>{t.step3Species}</span>
          </button>
          <button
            onClick={() => setStep(4)}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${step === 4 ? 'bg-white text-slate-900 shadow-sm font-bold border border-slate-200' : 'hover:bg-slate-200/60'}`}
          >
            <span>{t.step4Incubation}</span>
          </button>
          <button
            onClick={() => setStep(5)}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${step === 5 ? 'bg-white text-slate-900 shadow-sm font-bold border border-slate-200' : 'hover:bg-slate-200/60'}`}
          >
            <span>{t.step5Layout}</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* STEP 1: Loft Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
                <Building2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <p className="font-bold">{lang === 'en' ? 'Loft Identity & Breeder Accreditation' : 'هوية اللوفت واعتماد المربي'}</p>
                  <p className="text-amber-700 mt-0.5">
                    {lang === 'en' 
                      ? 'This info will appear on your pedigree certificates, export reports, and sales transfer documents.'
                      : 'ستظهر هذه البيانات على شهادات الأنساب المطبوعة، تقارير التصدير ووثائق البيع الرسمية.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.aviaryName} *</label>
                  <input
                    type="text"
                    required
                    value={aviaryName}
                    onChange={(e) => setAviaryName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="e.g. Skyline Champions Aviary"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.breederName} *</label>
                  <input
                    type="text"
                    required
                    value={breederName}
                    onChange={(e) => setBreederName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="e.g. Alexander Vance"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.email} *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="breeder@example.com"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.phone}</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="+1 555-0192"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.country} *</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="e.g. United States / Saudi Arabia"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.city}</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="e.g. California / Riyadh"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Regional & Ring Codes */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.ringPrefix} *</label>
                  <input
                    type="text"
                    required
                    value={ringPrefix}
                    onChange={(e) => setRingPrefix(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="e.g. AS-2026 or BE-KBDB-"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    {lang === 'en' ? 'Default prefix automatically suggested when logging new hatchlings.' : 'البادئة التلقائية المقترحة عند تسجيل حجول الفراخ الجديدة.'}
                  </p>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.ringYear} *</label>
                  <input
                    type="number"
                    min="2020"
                    max="2035"
                    value={ringYear}
                    onChange={(e) => setRingYear(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.currency} *</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                    <option value="SAR (ر.س)">SAR (ر.س - Saudi Riyal)</option>
                    <option value="AED (د.إ)">AED (د.إ - UAE Dirham)</option>
                    <option value="KWD (د.ك)">KWD (د.ك - Kuwaiti Dinar)</option>
                    <option value="GBP (£)">GBP (£ - British Pound)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.unitSystem} *</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setUnitSystem('metric')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${unitSystem === 'metric' ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm' : 'bg-slate-50 border-slate-300 text-slate-700'}`}
                    >
                      {lang === 'en' ? 'Metric (g, kg, km)' : 'متري (جم، كجم، كم)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnitSystem('imperial')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${unitSystem === 'imperial' ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm' : 'bg-slate-50 border-slate-300 text-slate-700'}`}
                    >
                      {lang === 'en' ? 'Imperial (oz, lb, mi)' : 'إمبراطوري (أونصة، ميل)'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.dateFormat} *</label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601 Standard)</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY (Day/Month/Year)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Species & Breeds */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-xs">
                <label className="font-bold text-slate-700 block mb-1">{t.defaultSpecies} *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'Pigeon (Columba livia)', nameEn: 'Pigeons (Racing, Fancy, Meat)', nameAr: 'الحمام (الزاجل، الزينة، اللاحم)' },
                    { id: 'Canary (Serinus canaria)', nameEn: 'Canaries (Color, Song, Type)', nameAr: 'الكناري (الألوان، الصوت، النوع)' },
                    { id: 'Finch (Estrildidae)', nameEn: 'Finches (Gouldian, Zebra)', nameAr: 'الفينش والزيبرا والجولدين' },
                    { id: 'Parrot (Psittaciformes)', nameEn: 'Parrots & Cockatiels & Lovebirds', nameAr: 'الببغاوات والكروان والفيشر' }
                  ].map((sp) => (
                    <div
                      key={sp.id}
                      onClick={() => {
                        setDefaultSpecies(sp.id);
                        if (sp.id.includes('Canary') || sp.id.includes('Finch')) {
                          setDefaultIncubationDays(14);
                          setDefaultClutchSize(4);
                        } else {
                          setDefaultIncubationDays(18);
                          setDefaultClutchSize(2);
                        }
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${defaultSpecies === sp.id ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/20' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{lang === 'en' ? sp.nameEn : sp.nameAr}</span>
                        {defaultSpecies === sp.id && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">{sp.id}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Incubation Lifecycle */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 flex items-start gap-3">
                <Egg className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-900 leading-relaxed">
                  <p className="font-bold">{lang === 'en' ? 'Automated Incubation & Milestone Engine' : 'محرك روزنامة التحضين الآلية'}</p>
                  <p className="text-indigo-700 mt-0.5">
                    {lang === 'en'
                      ? 'AviarySoft calculates candling fertility alert dates, anticipated hatch days, chick banding days, and squab weaning dates automatically based on these rules.'
                      : 'يقوم AviarySoft بحساب تواريخ كشف التخصيب، موعد الفقس الدقيق، عمر تركيب الحجل وموعد الفطام تلقائياً.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.incubationDays} *</label>
                  <input
                    type="number"
                    min="10"
                    max="45"
                    value={defaultIncubationDays}
                    onChange={(e) => setDefaultIncubationDays(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">{lang === 'en' ? 'Default: 18 days for pigeons' : 'الافتراضي: 18 يوماً للحمام'}</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.clutchSize} *</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={defaultClutchSize}
                    onChange={(e) => setDefaultClutchSize(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">{lang === 'en' ? 'Pigeons lay 2 eggs per clutch' : 'الحمام يبيض بيضتين في كل دورة'}</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.candlingDay} *</label>
                  <input
                    type="number"
                    min="3"
                    max="12"
                    value={candlingDays}
                    onChange={(e) => setCandlingDays(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">{lang === 'en' ? 'Check blood spiderweb veins on day 5' : 'فحص العروق العنكبوتية بالضوء في اليوم 5'}</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.bandingDay} *</label>
                  <input
                    type="number"
                    min="4"
                    max="15"
                    value={bandingAgeDays}
                    onChange={(e) => setBandingAgeDays(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">{lang === 'en' ? 'Band ring size fit between days 6-8' : 'تركيب الحجل المعدني قبل نمو أصابع القدم'}</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.weaningDay} *</label>
                  <input
                    type="number"
                    min="15"
                    max="45"
                    value={weaningAgeDays}
                    onChange={(e) => setWeaningAgeDays(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">{lang === 'en' ? 'Move squabs to young bird section at 24-28d' : 'عزل الزغاليل لمطارات الشبابيات'}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Loft Structure */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800">{lang === 'en' ? 'Loft Sections & Aviary Compartments' : 'أقسام ومطارات وخانات المنشأة'}</h3>
                  <p className="text-[11px] text-slate-500">{lang === 'en' ? 'Configure your breeding pens, flight aviaries, and quarantine sections.' : 'خصص أقسام التفريخ، مطارات الطيران وحجر الأمان الصحي.'}</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  + {t.add}
                </button>
              </div>

              <div className="space-y-3">
                {localSections.map((sec, idx) => (
                  <div key={sec.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="font-mono text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">#{idx + 1}</span>
                        <input
                          type="text"
                          value={sec.name}
                          onChange={(e) => handleUpdateSection(sec.id, { name: e.target.value })}
                          className="font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs flex-1 focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <select
                        value={sec.type}
                        onChange={(e) => handleUpdateSection(sec.id, { type: e.target.value as any })}
                        className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold"
                      >
                        <option value="Breeding">{lang === 'en' ? 'Breeding Pens' : 'أزواج إنتاج'}</option>
                        <option value="Flying">{lang === 'en' ? 'Race / Flying Team' : 'طيران وسباق'}</option>
                        <option value="YoungBirds">{lang === 'en' ? 'Young Bird Aviary' : 'مطار الزغاليل'}</option>
                        <option value="Quarantine">{lang === 'en' ? 'Quarantine & Health' : 'عزل وحجر صحي'}</option>
                      </select>
                      {localSections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteSection(sec.id)}
                          className="text-rose-500 hover:text-rose-700 px-1 font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-500 block">{lang === 'en' ? 'Bird Capacity' : 'السعة الاستيعابية (طيور)'}</span>
                        <input
                          type="number"
                          value={sec.capacity}
                          onChange={(e) => handleUpdateSection(sec.id, { capacity: Number(e.target.value) })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 font-mono text-xs font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">{lang === 'en' ? 'Nest Boxes' : 'عدد خانات العشوش'}</span>
                        <input
                          type="number"
                          value={sec.nestBoxesCount}
                          onChange={(e) => handleUpdateSection(sec.id, { nestBoxesCount: Number(e.target.value) })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 font-mono text-xs font-bold"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-slate-500 block">{lang === 'en' ? 'Description' : 'الوصف'}</span>
                        <input
                          type="text"
                          value={sec.description || ''}
                          onChange={(e) => handleUpdateSection(sec.id, { description: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs"
                          placeholder="Ventilation, perches..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Demo Option */}
          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                onLoadDemoData();
                onClose();
              }}
              className="text-xs text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-2 rounded-xl font-bold transition-colors flex items-center gap-1.5 w-full sm:w-auto justify-center"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              {t.quickDemo}
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                  {lang === 'en' ? 'Previous' : 'السابق'}
                </button>
              )}
              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center gap-1"
                >
                  {lang === 'en' ? 'Next Step' : 'التالي'}
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {t.finishSetup}
                </button>
              )}
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
