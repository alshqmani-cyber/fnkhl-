/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  GitMerge, 
  FolderHeart, 
  Layers, 
  Trophy, 
  Bot, 
  Calculator, 
  CircleDot, 
  Users, 
  Plus, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Pigeon, Pair, LoftSection, Contact } from '../types';
import { Language, translations } from '../i18n';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  pigeons: Pigeon[];
  pairs: Pair[];
  sections: LoftSection[];
  contacts: Contact[];
  onSelectTab: (tab: string) => void;
  onOpenRegisterModal: () => void;
  lang: Language;
}

export default function CommandPalette({
  isOpen,
  onClose,
  pigeons,
  pairs,
  sections,
  contacts,
  onSelectTab,
  onOpenRegisterModal,
  lang
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  // Keyboard shortcut Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter items
  const matchedBirds = pigeons.filter(p => 
    p.ring_number.toLowerCase().includes(query.toLowerCase()) ||
    p.breed.toLowerCase().includes(query.toLowerCase()) ||
    p.phenotype.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const matchedPairs = pairs.filter(p => 
    p.male_ring.toLowerCase().includes(query.toLowerCase()) ||
    p.female_ring.toLowerCase().includes(query.toLowerCase()) ||
    (p.cage_number && p.cage_number.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 3);

  const matchedSections = sections.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 2);

  const quickNav = [
    { id: 'dashboard', labelEn: 'Dashboard & KPIs', labelAr: 'لوحة الإدارة والكانبان', icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
    { id: 'pigeons', labelEn: 'Bird Registry & Pedigrees', labelAr: 'سجل الطيور والأنساب', icon: <GitMerge className="w-4 h-4 text-indigo-500" /> },
    { id: 'pairs', labelEn: 'Breeding Pairs & Clutches', labelAr: 'الأزواج وحضانات البيض', icon: <FolderHeart className="w-4 h-4 text-rose-500" /> },
    { id: 'layout', labelEn: 'Aviary & Loft Facilities', labelAr: 'أقسام ومطارات وخانات اللوفت', icon: <Layers className="w-4 h-4 text-blue-500" /> },
    { id: 'rings', labelEn: 'Rings & Band Stock Manager', labelAr: 'مخزون الحجول والدبل الرسمية', icon: <CircleDot className="w-4 h-4 text-amber-500" /> },
    { id: 'exhibitions', labelEn: 'Races & Exhibitions Ledger', labelAr: 'سجل السباقات والمعارض', icon: <Trophy className="w-4 h-4 text-amber-500" /> },
    { id: 'contacts', labelEn: 'Breeders & Vet Directory', labelAr: 'دليل المربين والعيادات البيطرية', icon: <Users className="w-4 h-4 text-purple-500" /> },
    { id: 'advisor', labelEn: 'AviarySoft AI Loft Advisor', labelAr: 'مستشار الذكاء الاصطناعي للوفت', icon: <Bot className="w-4 h-4 text-amber-400" /> },
  ].filter(n => !query || n.labelEn.toLowerCase().includes(query.toLowerCase()) || n.labelAr.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-amber-500 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === 'en' ? 'Type to search birds, pairs, lofts, contacts... (ESC to close)' : 'اكتب للبحث السريع عن طير، حجل، زوج، قفص، أو جهة اتصال...'}
            className="flex-1 bg-transparent text-sm font-semibold text-slate-900 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[380px] overflow-y-auto p-3 space-y-4 text-xs">
          
          {/* Quick Jump Modules */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
              {lang === 'en' ? 'Navigation Modules' : 'الانتقال المباشر للأقسام'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {quickNav.map(nav => (
                <button
                  key={nav.id}
                  onClick={() => {
                    onSelectTab(nav.id);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl hover:bg-slate-100/80 text-left rtl:text-right flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-2 font-bold text-slate-800 group-hover:text-amber-600">
                    {nav.icon}
                    <span>{lang === 'en' ? nav.labelEn : nav.labelAr}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-500 rtl:rotate-180 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Matched Birds */}
          {matchedBirds.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
                {lang === 'en' ? 'Birds Matching Ring / Breed' : 'الطيور المطابقة للبحث'}
              </span>
              <div className="space-y-1">
                {matchedBirds.map(b => (
                  <button
                    key={b.id}
                    onClick={() => {
                      onSelectTab('pigeons');
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-amber-50/70 border border-slate-100 hover:border-amber-300 text-left rtl:text-right flex items-center justify-between group transition-all"
                  >
                    <div>
                      <span className="font-mono font-bold text-slate-900 group-hover:text-amber-700">{b.ring_number}</span>
                      <span className="text-slate-500 text-[11px] block">{b.breed} • {b.phenotype}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {b.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Pairs */}
          {matchedPairs.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
                {lang === 'en' ? 'Matching Breeding Pairs' : 'أزواج التفريخ المطابقة'}
              </span>
              <div className="space-y-1">
                {matchedPairs.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectTab('pairs');
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-rose-50/70 border border-slate-100 text-left rtl:text-right flex items-center justify-between group transition-all"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{p.male_ring.split(' ')[0]} ♂ × {p.female_ring.split(' ')[0]} ♀</span>
                      <span className="text-slate-400 text-[10px] block">{p.cage_number || 'Box'}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                      {p.pair_score_grade || 'Active'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Press ESC to exit</span>
          <span>AviarySoft Spotlight Search</span>
        </div>

      </div>
    </div>
  );
}
