import React from 'react';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (route: string) => void;
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 mb-6">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2563EB] opacity-60" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2563EB]" />
    </span>
    <span className="text-[11px] font-bold tracking-wider text-[#1D4ED8] uppercase">
      {children}
    </span>
  </div>
);

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="animate-pageEnter pt-28 pb-24 relative overflow-hidden">
      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <div className="max-w-4xl mx-auto px-6 md:px-10 pt-8 pb-16 text-center relative z-10">
        <SectionLabel>Scientific Foundation &amp; Architecture</SectionLabel>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] leading-[1.12] tracking-tight mb-6">
          Quantitative Radiograph Analysis for{' '}
          <span className="text-[#2563EB] block mt-1">Bone Fragility Diagnostics</span>
        </h1>
        <p className="text-[#475569] text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto font-normal">
          We transform standard routine knee radiographs into actionable, explainable
          osteoporosis risk assessments — catching bone loss years before fragility fractures occur.
        </p>
      </div>

      {/* ═══════════════════════════════════════
          PROBLEM & SOLUTION — 2 COL CLINICAL CARDS
      ═══════════════════════════════════════ */}
      <section className="relative py-16 z-10">
        <div className="max-w-6xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Problem Card */}
          <div className="card-tactile p-8 sm:p-9 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-[#DC2626] shadow-xs">
                  <Activity size={20} />
                </div>
                <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">The Under-Diagnosis Crisis</h2>
              </div>
              <p className="text-sm text-[#475569] leading-relaxed mb-6 font-normal">
                Osteoporosis is a silent condition. Over{' '}
                <strong className="text-[#0F172A] font-semibold">70% of patients</strong> with
                fragility-level bone loss remain undiagnosed until their first catastrophic fracture.
                DXA scans, while diagnostic, are expensive, rarely available in primary clinics, and
                infrequently requested until clinical symptoms manifest.
              </p>
              <ul className="space-y-3 text-sm text-[#475569] font-normal">
                {[
                  'Over 200 million people suffer from untreated osteoporosis worldwide.',
                  'Routine knee X-rays are widely performed for joint pain and arthritis.',
                  'Subtle trabecular bone loss often escapes unaided visual inspection.',
                  'Delayed diagnosis translates directly to hip fractures and loss of mobility.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#DC2626] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] font-mono text-[#64748B]">
              CLINICAL EPIDEMIOLOGY BENCHMARK
            </div>
          </div>

          {/* Solution Card */}
          <div className="card-tactile p-8 sm:p-9 border-blue-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] shadow-xs">
                  <Sparkles size={20} />
                </div>
                <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Opportunistic Knee Screening</h2>
              </div>
              <p className="text-sm text-[#475569] leading-relaxed mb-6 font-normal">
                OsteoVision opportunistically screens routine knee radiographs using quantitative image processing —
                quantifying micro-architectural trabecular loss and cortical thinning in seconds without requiring extra radiation or cost.
              </p>
              <ul className="space-y-3 text-sm text-[#475569] font-normal">
                {[
                  'Sub-second inference directly in browser or clinical PACS workstation.',
                  'Grad-CAM attention heatmaps highlight exact bone regions influencing decision.',
                  'Rigorous validation against dual-energy X-ray absorptiometry (DXA) ground truth.',
                  'Identifies osteopenia early, enabling lifestyle and pharmacological intervention.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-[#16A34A] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] font-mono text-[#2563EB] font-semibold">
              OPPORTUNISTIC SCREENING PROTOCOL
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          TECHNOLOGY ARCHITECTURE (GRAD-CAM)
      ═══════════════════════════════════════ */}
      <section className="relative py-20 max-w-6xl mx-auto px-6 md:px-10 z-10">
        <div className="max-w-2xl mb-14">
          <SectionLabel>Technical Architecture</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mb-3 tracking-tight">
            How Grad-CAM Explainability Operates
          </h2>
          <p className="text-[#475569] text-base leading-relaxed">
            Medical practitioners cannot rely on opaque black-box algorithms. OsteoVision integrates
            Gradient-weighted Class Activation Mapping to project the neural network's visual
            attention directly onto the patient's radiograph.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              num: '01',
              title: 'Multi-Scale Feature Extraction',
              body: 'Multi-scale convolutional layers extract cortical thickness, joint-space narrowing, and trabecular micro-architecture across distal femur and proximal tibia.',
            },
            {
              num: '02',
              title: 'Gradient Backpropagation',
              body: 'Gradients corresponding to the Osteoporosis class probability flow back into the final convolutional feature maps, isolating localized diagnostic weight.',
            },
            {
              num: '03',
              title: 'Spectral Heatmap Projection',
              body: 'A spectral heatmap (blue to red) is rendered over the raw radiograph, verifying that the AI focused on true anatomical landmarks rather than image artefacts.',
            },
          ].map((step) => (
            <div key={step.num} className="card-tactile p-7 group flex flex-col justify-between">
              <div>
                <span className="text-3xl font-black font-mono text-slate-300 group-hover:text-[#2563EB] transition-colors block mb-4">
                  {step.num}
                </span>
                <h3 className="text-lg font-bold text-[#0F172A] mb-2 tracking-tight">{step.title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed font-normal">{step.body}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                PIPELINE STAGE {step.num}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PERFORMANCE BENCHMARKS
      ═══════════════════════════════════════ */}
      <section className="relative py-16 z-10">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '94.2%', label: 'Clinical Accuracy',  note: 'Validated vs DXA T-scores' },
              { value: '< 0.8s', label: 'Inference Speed',   note: 'Per radiograph scan' },
              { value: '100%',  label: 'Zero Retention',    note: 'In-memory ephemeral execution' },
              { value: 'DICOM', label: 'Hospital Ready',    note: 'Standard medical format compatible' },
            ].map((m) => (
              <div key={m.label} className="card-tactile p-7">
                <p className="text-3xl sm:text-4xl font-extrabold text-[#2563EB] mb-1 font-mono">
                  {m.value}
                </p>
                <p className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1">
                  {m.label}
                </p>
                <p className="text-[11px] text-[#64748B]">{m.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          BOTTOM CTA (TACTILE 3D CARD)
      ═══════════════════════════════════════ */}
      <section className="relative py-16 max-w-4xl mx-auto px-6 md:px-10 text-center z-10">
        <div className="card-tactile p-10 sm:p-14 bg-gradient-to-b from-white to-[#F8FAFC]">
          <SectionLabel>Clinical Verification</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mb-3 tracking-tight">
            Ready to Test the Diagnostic Pipeline?
          </h2>
          <p className="text-[#475569] text-base leading-relaxed mb-8 max-w-xl mx-auto font-normal">
            Upload an existing knee radiograph or explore pre-loaded clinical reference cases
            in the AI Diagnostic Studio.
          </p>
          <button
            onClick={() => onNavigate('/studio')}
            className="btn-tactile-dark inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold cursor-pointer"
          >
            <span>Launch AI Diagnostic Studio</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </section>

    </div>
  );
};
