/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Dna, 
  Plus, 
  Palette, 
  Tag, 
  Sparkles, 
  Layers, 
  Trash2, 
  CheckCircle2, 
  Scale, 
  Clock, 
  HelpCircle,
  Info
} from 'lucide-react';
import { Breed, MutationTrait } from '../types';
import { Language, translations } from '../i18n';

interface BreedsMutationsViewProps {
  breeds: Breed[];
  mutations: MutationTrait[];
  onAddBreed: (breed: Omit<Breed, 'id'>) => void;
  onDeleteBreed: (id: string) => void;
  onAddMutation: (mutation: Omit<MutationTrait, 'id'>) => void;
  onDeleteMutation: (id: string) => void;
  lang: Language;
}

export default function BreedsMutationsView({
  breeds,
  mutations,
  onAddBreed,
  onDeleteBreed,
  onAddMutation,
  onDeleteMutation,
  lang
}: BreedsMutationsViewProps) {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'breeds' | 'mutations'>('breeds');

  // Modal Breed
  const [showAddBreedModal, setShowAddBreedModal] = useState(false);
  const [breedName, setBreedName] = useState('');
  const [category, setCategory] = useState<Breed['category']>('Meat');
  const [originCountry, setOriginCountry] = useState('');
  const [isAutoSexing, setIsAutoSexing] = useState(false);
  const [incubationDays, setIncubationDays] = useState(18);
  const [standardWeight, setStandardWeight] = useState(700);
  const [breedDescription, setBreedDescription] = useState('');

  // Modal Mutation
  const [showAddMutationModal, setShowAddMutationModal] = useState(false);
  const [mutationName, setMutationName] = useState('');
  const [mutationType, setMutationType] = useState<MutationTrait['type']>('Color');
  const [colorHex, setColorHex] = useState('#3b82f6');
  const [mutationDescription, setMutationDescription] = useState('');

  const handleCreateBreed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!breedName.trim()) return;
    onAddBreed({
      breed_name: breedName.trim(),
      category,
      origin_country: originCountry || undefined,
      is_auto_sexing: isAutoSexing,
      incubation_days_default: Number(incubationDays) || 18,
      standard_weight_grams: Number(standardWeight) || undefined,
      description: breedDescription || undefined
    });
    setBreedName('');
    setOriginCountry('');
    setBreedDescription('');
    setShowAddBreedModal(false);
  };

  const handleCreateMutation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mutationName.trim()) return;
    onAddMutation({
      name: mutationName.trim(),
      type: mutationType,
      colorHex,
      description: mutationDescription || undefined
    });
    setMutationName('');
    setMutationDescription('');
    setShowAddMutationModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
              <Dna className="w-3.5 h-3.5 text-amber-400" />
              {lang === 'en' ? 'Pigeon Genetics & Taxonomy' : 'مكتبة سلالات وطفرات وألوان الحمام'}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {breeds.length} {lang === 'en' ? 'Breeds' : 'سلالة'} • {mutations.length} {lang === 'en' ? 'Mutations & Traits' : 'طفرة ولون'}
            </span>
          </div>
          <h2 className="text-2xl font-black mt-2 tracking-tight">
            {lang === 'en' ? 'Breeds, Mutations & Genetics Manager' : 'إدارة سلالات الحمام، الطفرات، والجينات'}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            {lang === 'en'
              ? 'Customize your pigeon breeds list, auto-sexing varieties, color mutations, and genetic plumage patterns. Added traits appear automatically across all bird cards.'
              : 'أضف أي نوع أو سلالة حمام جديدة مع خصائصها، وسجل الطفرات والألوان والجينات والصفات المورفولوجية لتظهر فوراً في بطاقات كل طائر.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddBreedModal(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-md shadow-amber-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {lang === 'en' ? 'Add Pigeon Breed' : 'إضافة نوع حمام جديد'}
          </button>

          <button
            onClick={() => setShowAddMutationModal(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            <Palette className="w-4 h-4" />
            {lang === 'en' ? 'Add Mutation / Color' : 'إضافة طفرة / لون'}
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('breeds')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'breeds' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
        >
          <Layers className="w-4 h-4 text-amber-500" />
          <span>{lang === 'en' ? 'Pigeon Breeds & Standards' : 'سلالات الحمام ومعاييرها'} ({breeds.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('mutations')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'mutations' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
        >
          <Palette className="w-4 h-4 text-indigo-500" />
          <span>{lang === 'en' ? 'Colors, Genes & Mutations' : 'الألوان، الجينات، والطفرات'} ({mutations.length})</span>
        </button>
      </div>

      {/* TAB 1: Breeds List */}
      {activeTab === 'breeds' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {breeds.map(b => (
            <div
              key={b.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-3xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                    {b.category === 'Meat' ? (lang === 'en' ? 'Meat / Squabbing' : 'لاحم / تسمين') :
                     b.category === 'Racing' ? (lang === 'en' ? 'Racing Homer' : 'سباق وزاجل') :
                     b.category === 'Fancy' ? (lang === 'en' ? 'Fancy / Exhibition' : 'حمام زينة') :
                     b.category === 'Flying' ? (lang === 'en' ? 'Performance Flyer' : 'طيار / بهلواني') : (lang === 'en' ? 'Dual' : 'ثنائي الغرض')}
                  </span>

                  {b.is_auto_sexing && (
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      {lang === 'en' ? 'Auto-Sexing' : 'تجنيس ذاتي'}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base">{b.breed_name}</h3>
                  {b.origin_country && (
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {lang === 'en' ? 'Origin:' : 'الموطن الأصلي:'} {b.origin_country}
                    </p>
                  )}
                </div>

                {b.description && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    {b.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{lang === 'en' ? 'Standard Weight:' : 'الوزن النموذجي:'}</span>
                    <span className="font-mono font-bold text-slate-800">{b.standard_weight_grams ? `${b.standard_weight_grams} g` : 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{lang === 'en' ? 'Incubation Days:' : 'أيام الحضانة:'}</span>
                    <span className="font-mono font-bold text-slate-800">{b.incubation_days_default} {lang === 'en' ? 'days' : 'يوم'}</span>
                  </div>
                </div>
              </div>

              {breeds.length > 1 && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => {
                      if (confirm(lang === 'en' ? `Delete breed ${b.breed_name}?` : `حذف سلالة ${b.breed_name}؟`)) {
                        onDeleteBreed(b.id);
                      }
                    }}
                    className="text-slate-400 hover:text-rose-600 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Delete' : 'حذف'}</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Mutations & Colors List */}
      {activeTab === 'mutations' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {mutations.map(m => (
            <div
              key={m.id}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-3xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs"
                      style={{ backgroundColor: m.colorHex || '#3b82f6' }}
                    />
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {m.type === 'Color' ? (lang === 'en' ? 'Color' : 'لون') :
                       m.type === 'Gene' ? (lang === 'en' ? 'Gene' : 'جين') :
                       m.type === 'Mutation' ? (lang === 'en' ? 'Mutation' : 'طفرة') : (lang === 'en' ? 'Trait' : 'صفة')}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteMutation(m.id)}
                    className="text-slate-300 hover:text-rose-600 transition-colors"
                    title={lang === 'en' ? 'Delete' : 'حذف'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{m.name}</h4>

                {m.description && (
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {m.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: Add New Pigeon Breed */}
      {showAddBreedModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black text-slate-900 mb-1 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-500" />
              {lang === 'en' ? 'Add Pigeon Breed' : 'إضافة سلالة حمام جديدة'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {lang === 'en' ? 'Enter breed name, category, and standard breeding metrics.' : 'أدخل اسم النوع، التصنيف، ومعايير التفريخ.'}
            </p>

            <form onSubmit={handleCreateBreed} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">{lang === 'en' ? 'Breed Name *' : 'اسم سلالة الحمام *'}</label>
                <input
                  type="text"
                  required
                  value={breedName}
                  onChange={(e) => setBreedName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white"
                  placeholder="e.g. French Mondain / شامي قطاوي"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{lang === 'en' ? 'Category' : 'تصنيف السلالة'}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                  >
                    <option value="Meat">{lang === 'en' ? 'Meat / Commercial' : 'لاحم وتسمين'}</option>
                    <option value="Racing">{lang === 'en' ? 'Racing Homer' : 'زاجل وسباق'}</option>
                    <option value="Fancy">{lang === 'en' ? 'Fancy & Exhibition' : 'حمام زينة وجمال'}</option>
                    <option value="Flying">{lang === 'en' ? 'Flight & Tumbler' : 'طيار وشقلباظ'}</option>
                    <option value="Dual">{lang === 'en' ? 'Dual Purpose' : 'ثنائي الغرض'}</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{lang === 'en' ? 'Country of Origin' : 'بلد المنشأ الأصلي'}</label>
                  <input
                    type="text"
                    value={originCountry}
                    onChange={(e) => setOriginCountry(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
                    placeholder="e.g. France / مصر"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{lang === 'en' ? 'Standard Adult Weight (g)' : 'الوزن القياسي للبالغ (جرام)'}</label>
                  <input
                    type="number"
                    value={standardWeight}
                    onChange={(e) => setStandardWeight(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{lang === 'en' ? 'Incubation Duration (days)' : 'أيام الحضانة (يوم)'}</label>
                  <input
                    type="number"
                    value={incubationDays}
                    onChange={(e) => setIncubationDays(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-900 block">{lang === 'en' ? 'Auto-Sexing Variety?' : 'سلالة ذاتية التجنيس فور الفقس؟'}</span>
                  <span className="text-[10px] text-amber-700">{lang === 'en' ? 'Allows sex determination by down density at hatching (like Texan).' : 'تتيح معرفة جنس الفرخ بمجرد الفقس من كثافة الريش (مثل التكسان).'}</span>
                </div>
                <input
                  type="checkbox"
                  checked={isAutoSexing}
                  onChange={(e) => setIsAutoSexing(e.target.checked)}
                  className="w-5 h-5 accent-amber-600 rounded"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{lang === 'en' ? 'Description & Physical Traits' : 'وصف ومميزات السلالة'}</label>
                <textarea
                  rows={2}
                  value={breedDescription}
                  onChange={(e) => setBreedDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white text-xs"
                  placeholder="عرض الصدر، شكل المنقار، الريش، وطباع الإنتاج..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddBreedModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black shadow-md shadow-amber-500/20"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add New Mutation / Color / Gene */}
      {showAddMutationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-black text-slate-900 mb-1 flex items-center gap-2">
              <Palette className="w-5 h-5 text-indigo-500" />
              {lang === 'en' ? 'Add Mutation, Color or Gene' : 'إضافة طفرة، لون، أو جين جديد'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {lang === 'en' ? 'Save any color or plumage mutation to your permanent genetics catalog.' : 'أضف أي صفة أو طفرة جديدة لتظهر في بطاقات الحمام.'}
            </p>

            <form onSubmit={handleCreateMutation} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">{lang === 'en' ? 'Mutation / Color Name *' : 'اسم الطفرة أو اللون *'}</label>
                <input
                  type="text"
                  required
                  value={mutationName}
                  onChange={(e) => setMutationName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white"
                  placeholder="e.g. ديلوت مخفف / أندلسي أوبال"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{lang === 'en' ? 'Type' : 'نوع الصفة'}</label>
                  <select
                    value={mutationType}
                    onChange={(e) => setMutationType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                  >
                    <option value="Color">{lang === 'en' ? 'Color / Pattern' : 'لون أو نقش ريش'}</option>
                    <option value="Gene">{lang === 'en' ? 'Gene Symbol' : 'رمز جيني وراثي'}</option>
                    <option value="Mutation">{lang === 'en' ? 'Genetic Mutation' : 'طفرة وراثية'}</option>
                    <option value="Trait">{lang === 'en' ? 'Physical Trait' : 'صفة شكلية (شروال/تاج)'}</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{lang === 'en' ? 'Badge Color' : 'لون الشارة المميزة'}</label>
                  <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="w-full h-10 p-1 bg-slate-50 border border-slate-300 rounded-xl cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{lang === 'en' ? 'Description / Genetics Rules' : 'الوصف والآلية الوراثية'}</label>
                <input
                  type="text"
                  value={mutationDescription}
                  onChange={(e) => setMutationDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
                  placeholder="سائد، متنحي، مرتبط بالجنس..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddMutationModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black shadow-md shadow-amber-500/20"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
