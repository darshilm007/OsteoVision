import React from 'react';
import { ArrowLeft, ShieldCheck, AlertTriangle } from 'lucide-react';

interface PrivacyPageProps {
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

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="pt-24 pb-14 relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 md:px-10 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <SectionLabel>Privacy &amp; Data Handling</SectionLabel>
          <button
            onClick={() => onNavigate('/')}
            className="btn-tactile-light inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Home</span>
          </button>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-[#475569] text-base leading-relaxed mb-8">
          OsteoVision is an academic, educational and research-oriented AI project. This page
          describes how image data is handled by the current implementation, in plain terms and
          without overstating guarantees.
        </p>

        <div className="card-tactile p-6 sm:p-7 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
              <ShieldCheck size={18} />
            </div>
            <h2 className="text-lg font-bold text-[#0F172A] tracking-tight">How an uploaded image is processed</h2>
          </div>
          <ul className="space-y-3 text-sm text-[#475569] leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />
              <span>When you analyze an image, the selected file is sent from your browser to the project's analysis backend to generate the classification and visual explanation.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />
              <span>The backend checks that the upload is a valid image, runs the model, and returns a predicted class, a confidence score, and a heatmap.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />
              <span>The current code does not include a database or file store that persistently saves uploaded images.</span>
            </li>
          </ul>
        </div>

        <div className="card-tactile p-6 sm:p-7 mb-6">
          <h2 className="text-lg font-bold text-[#0F172A] tracking-tight mb-3">What we do not claim</h2>
          <p className="text-sm text-[#475569] leading-relaxed mb-3">
            To keep this policy accurate, the following are explicitly not promised, because they
            depend on how the project is deployed and run:
          </p>
          <ul className="space-y-3 text-sm text-[#475569] leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#94A3B8] flex-shrink-0" />
              <span>A guaranteed deletion time or a fixed data-retention period.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#94A3B8] flex-shrink-0" />
              <span>Absence of logging, caching, or network-level storage that may exist in a given hosting environment.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#94A3B8] flex-shrink-0" />
              <span>Compliance with any specific medical or data-protection regulation (for example HIPAA or GDPR).</span>
            </li>
          </ul>
        </div>

        <div className="card-tactile p-6 sm:p-7 mb-8">
          <h2 className="text-lg font-bold text-[#0F172A] tracking-tight mb-3">A note on medical data</h2>
          <p className="text-sm text-[#475569] leading-relaxed">
            Please do not upload images containing identifiable patient information. Because this is
            a research prototype rather than a clinical system, avoid submitting any data you would
            not want processed by an experimental tool.
          </p>
        </div>

        <div className="flex items-start gap-2.5 text-[12px] text-[#92400E] p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A]">
          <AlertTriangle size={16} className="flex-shrink-0 mt-0.5 text-[#D97706]" />
          <span>
            OsteoVision is an educational and research-oriented AI project. Its outputs are generated
            by a machine-learning model and may contain errors. Results must not be used as a
            substitute for professional medical evaluation, diagnosis, or treatment decisions. Consult
            a qualified healthcare professional for clinical assessment.
          </span>
        </div>
      </div>
    </div>
  );
};
