/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  Printer, 
  X, 
  CheckCircle2, 
  Building2, 
  QrCode, 
  FileText,
  DollarSign
} from 'lucide-react';
import { Pigeon, AviaryProfile, SaleCertificate } from '../types';
import { Language, translations } from '../i18n';

interface SaleCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  pigeon: Pigeon | null;
  profile: AviaryProfile;
  lang: Language;
}

export default function SaleCertificateModal({
  isOpen,
  onClose,
  pigeon,
  profile,
  lang
}: SaleCertificateModalProps) {
  if (!isOpen || !pigeon) return null;

  const t = translations[lang];
  const [buyerName, setBuyerName] = useState(pigeon.buyer_name || 'Dr. Julian Foster');
  const [buyerContact, setBuyerContact] = useState('+1 (555) 782-9011');
  const [salePrice, setSalePrice] = useState<number>(pigeon.sale_price || 450);
  const [saleDate, setSaleDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [transferNotes, setTransferNotes] = useState('Full transfer of pedigree rights, ring ownership, and breeding stock certification.');

  const certNumber = `CERT-AS-${pigeon.ring_number.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now().toString().slice(-4)}`;
  const signatureHash = `SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}-VERIFIED`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border-4 border-slate-900 overflow-hidden animate-in fade-in zoom-in-95 print:border-none print:shadow-none">
        
        {/* Certificate Header Bar */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-widest block">
                Official AviarySoft Stock Transfer
              </span>
              <h2 className="text-lg font-black text-white tracking-tight">
                {lang === 'en' ? 'Pigeon Pedigree & Sale Certificate' : 'شهادة بيع ونقل ملكية نسب طير رسمية'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors print:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Printable Body */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800 relative bg-amber-50/20" id="sale-certificate-print-area">
          
          {/* Watermark stamp background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <Award className="w-96 h-96" />
          </div>

          {/* Top Aviary Information */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 gap-4">
            <div>
              <h3 className="font-black text-slate-900 text-base">{profile.aviaryName}</h3>
              <p className="text-xs text-slate-600">{profile.breederName} • {profile.country} ({profile.city})</p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">{profile.email} • {profile.phone}</p>
            </div>
            <div className="text-left rtl:text-right font-mono text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">{lang === 'en' ? 'Certificate No:' : 'رقم الشهادة:'}</span>
              <span className="font-bold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded border border-amber-200 block mt-0.5">
                {certNumber}
              </span>
            </div>
          </div>

          {/* Bird Credentials Box */}
          <div className="p-5 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-3">
            <span className="text-[10px] uppercase font-black tracking-wider text-amber-600 block">
              {lang === 'en' ? '1. Certified Bird Profile' : '١. بيانات وهوية الطير المعتمدة'}
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block">{t.ringNumber}</span>
                <span className="font-mono font-black text-sm text-slate-900">{pigeon.ring_number}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block">{t.breed}</span>
                <span className="font-bold text-slate-800">{pigeon.breed}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block">{lang === 'en' ? 'Sex' : 'الجنس'}</span>
                <span className="font-bold text-slate-800">
                  {pigeon.sex === 'Male' ? 'Cock (Male ♂)' : pigeon.sex === 'Female' ? 'Hen (Female ♀)' : 'Unknown (?)'}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block">{t.hatchDate}</span>
                <span className="font-mono font-bold text-slate-800">{pigeon.birth_date}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block">{t.phenotype}</span>
                <span className="font-semibold text-slate-800">{pigeon.phenotype}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">{t.genotype}</span>
                <span className="font-mono text-slate-700">{pigeon.genotype}</span>
              </div>
            </div>

            {/* Ancestry summary */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <div>
                <span className="text-slate-400">{t.father}:</span> <span className="font-mono font-bold">{pigeon.origin_father_ring || 'Pure Stock Foundation'}</span>
              </div>
              <div>
                <span className="text-slate-400">{t.mother}:</span> <span className="font-mono font-bold">{pigeon.origin_mother_ring || 'Pure Stock Foundation'}</span>
              </div>
            </div>
          </div>

          {/* Transfer & Buyer Details Form / View */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 text-xs space-y-3">
            <span className="text-[10px] uppercase font-black tracking-wider text-amber-600 block">
              {lang === 'en' ? '2. Buyer & Transfer Registration' : '٢. بيانات المشتري وتفاصيل النقل'}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">{lang === 'en' ? 'Buyer Full Name' : 'اسم المشتري بالكامل'}</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-900 focus:bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">{lang === 'en' ? 'Buyer Phone / Contact' : 'هاتف المشتري'}</label>
                <input
                  type="text"
                  value={buyerContact}
                  onChange={(e) => setBuyerContact(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">{lang === 'en' ? 'Sale Price' : 'قيمة البيع'}</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 focus:bg-white"
                  />
                  <span className="font-bold text-slate-600 font-mono">{profile.currency}</span>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">{lang === 'en' ? 'Transfer Date' : 'تاريخ النقل'}</label>
                <input
                  type="date"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">{lang === 'en' ? 'Terms & Transfer Note' : 'شروط وملاحظات النقل'}</label>
              <input
                type="text"
                value={transferNotes}
                onChange={(e) => setTransferNotes(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white text-xs"
              />
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center font-mono font-black text-amber-700 text-[10px]">
                SEAL
              </div>
              <div>
                <span className="font-mono text-[10px] text-slate-400 block">DIGITAL FINGERPRINT</span>
                <span className="font-mono text-[10px] font-bold text-slate-700">{signatureHash}</span>
              </div>
            </div>

            <div className="text-center sm:text-right rtl:sm:text-left">
              <span className="text-[10px] text-slate-400 block">{lang === 'en' ? 'Certified Breeder Signature' : 'توقيع واعتماد المربي'}</span>
              <span className="font-serif italic font-bold text-slate-800 text-sm mt-1 block">
                {profile.breederName}
              </span>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-end gap-3 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200"
          >
            {t.close}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            {lang === 'en' ? 'Print Official Certificate' : 'طباعة الشهادة الرسمية'}
          </button>
        </div>

      </div>
    </div>
  );
}
