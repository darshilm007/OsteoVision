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
    <div className="pt-24 pb-14 relative overflow-hidden">
      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <div className="max-w-4xl mx-auto px-6 md:px-10 pt-4 pb-10 text-center relative z-10">
        <SectionLabel>About The Project</SectionLabel>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] leading-[1.12] tracking-tight mb-6">
          About OsteoVision{' '}
          <span className="text-[#2563EB] block mt-1">An Explainable AI Knee X-Ray Project</span>
        </h1>
        <p className="text-[#475569] text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto font-normal">
          OsteoVision is an academic, web-based AI project that classifies knee X-ray images into
          Normal, Osteopenia, and Osteoporosis categories, presenting the model's prediction along
          with a confidence score and a visual explanation where available.
        </p>
      </div>

      {/* ═══════════════════════════════════════
          CINEMATIC RESEARCH LAB BANNER
      ═══════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 mb-8 md:mb-12 relative z-10">
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200/80 shadow-xl group aspect-[16/8] sm:aspect-[21/9] max-h-[360px] bg-slate-950">
          <img
            src="/images/about_research_lab.jpg"
            alt="OsteoVision AI Academic Research Laboratory"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent flex items-end p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-300 block mb-1">
                  Research &amp; Development Environment
                </span>
                <p className="text-white text-base md:text-lg font-bold tracking-tight">
                  Academic Deep Learning Architecture for Bone Density Screening
                </p>
              </div>
              <span className="text-[11px] font-mono px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-slate-200 border border-white/20 self-start sm:self-auto flex-shrink-0">
                ConvNeXt-Tiny · Grad-CAM++
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          PROBLEM & SOLUTION — 2 COL CLINICAL CARDS
      ═══════════════════════════════════════ */}
      <section className="relative py-8 md:py-10 z-10">
        <div className="max-w-6xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Problem Card */}
          <div className="card-tactile p-8 sm:p-9 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-[#DC2626] shadow-xs">
                  <Activity size={20} />
                </div>
                <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Project Motivation</h2>
              </div>
              <p className="text-sm text-[#475569] leading-relaxed mb-6 font-normal">
                Osteoporosis is often described as a silent condition, and dedicated bone-density
                scans such as DXA are not always accessible. This project explores whether standard,
                already-acquired knee X-ray images can be used to{' '}
                <strong className="text-[#0F172A] font-semibold">support preliminary research</strong>{' '}
                into bone-health classification using AI.
              </p>
              <ul className="space-y-3 text-sm text-[#475569] font-normal">
                {[
                  'Knee X-rays are widely captured during routine clinical imaging.',
                  'The project studies whether AI can separate images into three classes.',
                  'It is intended for educational and research exploration, not diagnosis.',
                  'Any clinical interpretation requires evaluation by a qualified professional.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#DC2626] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] font-mono text-[#64748B]">
              EDUCATIONAL &amp; RESEARCH SCOPE
            </div>
          </div>

          {/* Solution Card */}
          <div className="card-tactile p-8 sm:p-9 border-blue-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] shadow-xs">
                  <Sparkles size={20} />
                </div>
                <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">What OsteoVision Explores</h2>
              </div>
              <p className="text-sm text-[#475569] leading-relaxed mb-6 font-normal">
                OsteoVision demonstrates a browser-based workflow: upload a knee X-ray, run the model's
                inference, and review the returned classification, confidence score, and visual explanation.
              </p>
              <ul className="space-y-3 text-sm text-[#475569] font-normal">
                {[
                  'Browser-based image upload and result review.',
                  'AI-based classification into Normal, Osteopenia, or Osteoporosis.',
                  'A confidence score derived from the model output, where available.',
                  'A Grad-CAM++ visual explanation highlighting regions associated with the prediction.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-[#16A34A] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] font-mono text-[#2563EB] font-semibold">
              CAPABILITIES (AS IMPLEMENTED)
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          TECHNOLOGY ARCHITECTURE (GRAD-CAM)
      ═══════════════════════════════════════ */}
      <section className="relative py-20 max-w-6xl mx-auto px-6 md:px-10 z-10">
        <div className="max-w-2xl mb-14">
          <SectionLabel>Explainability</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mb-3 tracking-tight">
            Making AI Predictions More Interpretable
          </h2>
          <p className="text-[#475569] text-base leading-relaxed">
            To make its predictions easier to inspect, OsteoVision uses Grad-CAM++ (where supported) to
            generate a heatmap that highlights regions of the image associated with the model's
            prediction. A heatmap is a visualization aid: it does not independently establish osteoporosis,
            nor does it prove the model is focusing on clinically meaningful features.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              num: '01',
              title: 'Image Feature Extraction',
              body: 'A ConvNeXt-Tiny model processes the input image and builds internal feature maps that its classifier uses to decide between the three classes.',
            },
            {
              num: '02',
              title: 'Gradient Weighting',
              body: 'Grad-CAM++ flows the gradients of the predicted class back into the final convolutional layer to estimate which regions most influenced the output.',
            },
            {
              num: '03',
              title: 'Heatmap Overlay',
              body: 'A heatmap is overlaid on the original image to show regions associated with the prediction. Stronger color does not confirm disease or clinical relevance.',
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
      <section className="relative py-10 md:py-12 z-10">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">Model &amp; Implementation Overview</h2>
            <p className="text-sm text-[#475569] mt-2 max-w-2xl mx-auto">Verified details from the current project implementation. Independent evaluation metrics and dataset specifics have not been published, so none are claimed here.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: 'ConvNeXt-Tiny', label: 'Model Architecture', note: 'Classifier used for inference' },
              { value: '3 Classes', label: 'Output Categories', note: 'Normal · Osteopenia · Osteoporosis' },
              { value: 'Grad-CAM++', label: 'Visual Explanation', note: 'Generated where supported' },
              { value: 'PNG / JPG', label: 'Supported Input', note: 'Standard image formats' },
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
          <SectionLabel>Try The Project</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mb-3 tracking-tight">
            Ready to Analyze a Knee X-ray?
          </h2>
          <p className="text-[#475569] text-base leading-relaxed mb-4 max-w-xl mx-auto font-normal">
            Upload a knee X-ray image or explore the illustrative example cases in the analysis studio.
          </p>
          <p className="text-xs text-[#64748B] mb-8 max-w-xl mx-auto font-normal">
            For educational and research purposes. Not a substitute for professional medical diagnosis.
          </p>
          <button
            onClick={() => onNavigate('/studio')}
            className="btn-tactile-dark inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold cursor-pointer"
          >
            <span>Analyze an X-ray</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </section>

    </div>
  );
};
