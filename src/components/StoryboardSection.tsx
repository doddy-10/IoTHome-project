import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import { STORYBOARD_STEPS, TESTIMONIALS } from '../data/products';

export const StoryboardSection: React.FC = () => {
  const [showOriginalStoryboard, setShowOriginalStoryboard] = useState(false);

  return (
    <>
      {/* How It Works / Storyboard Narrative */}
      <section id="cara-kerja" className="py-14 lg:py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#0F52BA] mb-2">
                Dari Masalah Sehari-Hari ke Rumah Terkendali
              </p>
              <h2
                className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Bagaimana IoTHome Mengubah Cara Anda Mengelola Rumah
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowOriginalStoryboard((prev) => !prev)}
              aria-expanded={showOriginalStoryboard}
              className="self-start md:self-auto inline-flex items-center gap-2 min-h-[42px] px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs sm:text-sm font-medium text-slate-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <ImageIcon className="w-4 h-4 text-[#0F52BA]" />
              <span>
                {showOriginalStoryboard ? 'Tutup Gambar Storyboard' : 'Lihat Storyboard Resmi'}
              </span>
              {showOriginalStoryboard ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Expandable Original Storyboard Reference */}
          {showOriginalStoryboard && (
            <div className="mb-10 bg-white border border-slate-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <p className="text-sm font-semibold text-slate-900">
                  Storyboard Kampanye IoTHome — Scene 1 hingga Scene 8
                </p>
                <span className="text-xs text-slate-500">Your Smart Living Partner</span>
              </div>
              <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                <img
                  src="/assets/aistudio/Storyboard_dfeac7a6.png"
                  alt="Storyboard Iklan IoTHome dari Scene 1 hingga Scene 8"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          )}

          {/* 4 Editorial Storyboard Stages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STORYBOARD_STEPS.map((item) => (
              <div
                key={item.step}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-3">
                    <span className="font-mono font-semibold text-[#0F52BA]">{item.step}</span>
                    <span>{item.sceneRef}</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm italic text-slate-700 leading-relaxed">
                    {item.problem}
                  </p>
                </div>

                <p className="pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.solution}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Claim-to-Proof Adjacency: Testimonials */}
      <section id="testimoni" className="py-14 lg:py-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <p className="text-xs sm:text-sm font-medium text-[#0F52BA] mb-2">
              Pengalaman Pengguna Nyata
            </p>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Rumah Lebih Praktis dan Tagihan Listrik Lebih Terkendali
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {TESTIMONIALS.map((item) => (
              <blockquote
                key={item.name}
                className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6"
              >
                <div>
                  <p className="text-xs font-semibold text-[#0F52BA] mb-3">{item.outcome}</p>
                  <p className="text-sm text-slate-700 leading-relaxed">“{item.quote}”</p>
                </div>

                <footer className="pt-4 border-t border-slate-200">
                  <p className="font-display text-sm font-bold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
