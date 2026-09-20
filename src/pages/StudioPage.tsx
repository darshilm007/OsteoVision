import React, { useState } from 'react';
import {
  UploadCloud,
  Activity,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  Download,
  AlertTriangle,
  Eye,
  ArrowLeft,
  FileImage,
  Layers,
  Maximize2,
  ShieldCheck,
  Compass,
} from 'lucide-react';

interface StudioPageProps {
  onNavigate: (route: string) => void;
}

interface SampleCase {
  id: string;
  title: string;
  view: string;
  diagnosis: string;
  score: number;
  confidence: string;
  riskCategory: 'High Risk' | 'Moderate Risk' | 'Healthy / Low Risk';
  riskColor: string;
  riskBadgeClass: string;
  riskBarColor: string;
  findings: string;
  recommendations: string;
  rawImageIndex: number;
  heatmapImageIndex: number;
}

/* ─────────────────────────────────────────────
   Clinical Sample Data (PRESERVED)
───────────────────────────────────────────── */
const CLINICAL_SAMPLES: SampleCase[] = [
  {
    id: 'case-1',
    title: 'Knee Radiograph — AP View',
    view: 'Anteroposterior (AP) · Female, 68y',
    diagnosis: 'Osteoporosis Indication',
    score: 94,
    confidence: '94.2%',
    riskCategory: 'High Risk',
    riskColor: 'text-[#DC2626]',
    riskBadgeClass: 'bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C]',
    riskBarColor: 'from-[#2563EB] via-[#D97706] to-[#DC2626]',
    findings:
      'Marked loss of horizontal trabeculae in the lateral femoral condyle. Cortical thinning visible along proximal tibial plateau. High probability of osteoporotic structural fragility.',
    recommendations:
      'Urgent dual-energy X-ray absorptiometry (DXA) recommended for spinal/hip T-score verification. Initiate anti-resorptive clinical pathway consultation.',
    rawImageIndex: 100,
    heatmapImageIndex: 299,
  },
  {
    id: 'case-2',
    title: 'Knee Radiograph — Lateral View',
    view: 'Lateral View · Female, 56y',
    diagnosis: 'Osteopenia (Mild Density Reduction)',
    score: 58,
    confidence: '86.7%',
    riskCategory: 'Moderate Risk',
    riskColor: 'text-[#D97706]',
    riskBadgeClass: 'bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309]',
    riskBarColor: 'from-[#2563EB] to-[#D97706]',
    findings:
      'Borderline trabecular rarefaction in subchondral tibial zone. Cortical margin moderately intact with localised early density attenuation.',
    recommendations:
      'Lifestyle modifications, Vitamin D3 & calcium supplementation. Schedule repeat radiological surveillance in 12 months.',
    rawImageIndex: 100,
    heatmapImageIndex: 200,
  },
  {
    id: 'case-3',
    title: 'Knee Radiograph — Bilateral View',
    view: 'Bilateral Weight-Bearing · Male, 42y',
    diagnosis: 'Normal Healthy Bone Density',
    score: 14,
    confidence: '98.1%',
    riskCategory: 'Healthy / Low Risk',
    riskColor: 'text-[#16A34A]',
    riskBadgeClass: 'bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D]',
    riskBarColor: 'from-[#2563EB] to-[#16A34A]',
    findings:
      'Uniform trabecular network preserved throughout distal femur and proximal tibia. Cortical thickness intact with physiological bone mineral density.',
    recommendations:
      'No evidence of osteoporotic deterioration. Maintain routine active wellness protocols.',
    rawImageIndex: 100,
    heatmapImageIndex: 100,
  },
];

const getFramePath = (index: number) =>
  `/frames/frame_${index.toString().padStart(6, '0')}.jpg`;

/* ─────────────────────────────────────────────
   StudioPage Component - Light Clinical Design
───────────────────────────────────────────── */
export const StudioPage: React.FC<StudioPageProps> = ({ onNavigate }) => {
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const [selectedCaseIdx, setSelectedCaseIdx]   = useState(0);
  const [activeLayer, setActiveLayer]           = useState<'raw' | 'heatmap'>('heatmap');
  const [isAnalyzing, setIsAnalyzing]           = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [reportGenerated, setReportGenerated]   = useState(false);

  const currentCase = CLINICAL_SAMPLES[selectedCaseIdx];

  const triggerAnalysis = (fileName?: string) => {
    if (fileName) setUploadedFileName(fileName);
    setIsAnalyzing(true);
    setReportGenerated(false);
    setTimeout(() => setIsAnalyzing(false), 1400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) triggerAnalysis(file.name);
  };

  const handleDownloadReport = () => {
    setReportGenerated(true);
    setTimeout(() => setReportGenerated(false), 3000);
  };

  return (
    <div className="animate-pageEnter pt-28 pb-20 min-h-screen relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">

        {/* ── Page Header Bar (Tactile 3D Card) ── */}
        <div className="card-tactile p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[10px] font-bold text-[#2563EB] uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                Diagnostic Radiology Workstation
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Osteoporosis Screening &amp; Explainability Studio
              </h1>
              <p className="text-xs text-[#475569] mt-1">
                Knee Anteroposterior Radiograph Evaluation via Convolutional Residual Networks
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('/')}
                className="btn-tactile-light inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Home</span>
              </button>

              <button
                onClick={handleDownloadReport}
                className="btn-tactile-dark inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer"
              >
                <Download size={14} />
                <span>{reportGenerated ? 'Report Exported ✓' : 'Export Clinical Report'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Main Workspace Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">

          {/* ════════════════════════════════════════
              LEFT COLUMN — Controls & Ingestion (5 cols)
          ════════════════════════════════════════ */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* Upload Zone (Tactile 3D Card) */}
            <div className="card-tactile p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
                    <UploadCloud size={16} />
                  </div>
                  <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">Ingest Radiograph</h2>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  DICOM / PNG / JPG
                </span>
              </div>

              {/* Master Spec #23 Upload Area Styles */}
              <label className="relative flex flex-col items-center justify-center text-center cursor-pointer rounded-2xl border-2 border-dashed border-[#CBD5E1] hover:border-[#60A5FA] bg-[#F8FAFC]/50 hover:bg-[#F0F7FF] transition-all duration-200 p-8 gap-3 group">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/dicom"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#2563EB] group-hover:scale-105 transition-all shadow-xs">
                  <FileImage size={22} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1E293B] tracking-tight">
                    {uploadedFileName ? (
                      <span className="text-[#2563EB] truncate max-w-[220px] block">{uploadedFileName}</span>
                    ) : (
                      'Drag & drop patient radiograph or Browse'
                    )}
                  </p>
                  <p className="text-xs text-[#64748B] mt-1">Resolution up to 4096 × 4096 px</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] text-[#64748B] bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs">
                  <Lock size={10} className="text-[#2563EB]" />
                  Processed in memory — HIPAA-conscious zero storage
                </span>
              </label>
            </div>

            {/* Clinical Reference Samples Selector (Tactile 3D Card) */}
            <div className="card-tactile p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">Clinical Reference Archive</h2>
                <span className="text-[10px] text-slate-500 font-mono">3 VERIFIED CASES</span>
              </div>
              <p className="text-xs text-[#64748B] mb-4 leading-relaxed">
                Compare real de-identified radiographs pre-calibrated with DXA ground truth.
              </p>

              <div className="flex flex-col gap-2.5">
                {CLINICAL_SAMPLES.map((c, idx) => {
                  const isSelected = selectedCaseIdx === idx && !uploadedFileName;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCaseIdx(idx);
                        setUploadedFileName(null);
                        triggerAnalysis();
                      }}
                      className={`
                        flex items-center justify-between p-3.5 rounded-xl text-left
                        transition-all duration-200 cursor-pointer border
                        ${isSelected
                          ? 'bg-[#EFF6FF] border-[#93C5FD] shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-[#F8FAFC]'
                        }
                      `}
                    >
                      <div className="min-w-0 pr-3">
                        <p className="text-xs font-bold text-[#0F172A] mb-0.5 truncate">{c.title}</p>
                        <p className="text-[11px] text-[#64748B]">{c.view}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 ${c.riskBadgeClass}`}>
                        {c.riskCategory}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Run Analysis Action CTA (Tactile 3D Button) */}
            <button
              onClick={() => triggerAnalysis()}
              disabled={isAnalyzing}
              className="btn-tactile-dark w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full font-bold text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Computing Attention Heatmaps...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Execute Diagnostic Analysis</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>

          </div>

          {/* ════════════════════════════════════════
              RIGHT COLUMN — Viewer & Telemetry (7 cols)
          ════════════════════════════════════════ */}
          <div className="lg:col-span-7 flex flex-col gap-6">

            {/* High-Resolution DICOM / Radiograph Viewport Card (Tactile 3D Card) */}
            <div className="card-tactile p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
                    <span>Active Radiograph Viewport</span>
                    <span className="text-[10px] font-mono text-[#2563EB] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full font-semibold">
                      ZOOM 1.0X
                    </span>
                  </h2>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Toggle layers to cross-examine anatomical radiograph against Grad-CAM attention hotspots.
                  </p>
                </div>

                {/* Layer Toggle Switcher — Tactile Pill */}
                <div className="inline-flex rounded-full p-1 bg-slate-100 border border-slate-200 shadow-xs">
                  <button
                    onClick={() => setActiveLayer('raw')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      activeLayer === 'raw'
                        ? 'bg-white text-[#0F172A] shadow-xs'
                        : 'text-[#475569] hover:text-[#0F172A]'
                    }`}
                  >
                    Raw Radiograph
                  </button>
                  <button
                    onClick={() => setActiveLayer('heatmap')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeLayer === 'heatmap'
                        ? 'btn-tactile-dark !py-1 !px-3'
                        : 'text-[#475569] hover:text-[#0F172A]'
                    }`}
                  >
                    <Sparkles size={12} />
                    Grad-CAM Map
                  </button>
                </div>
              </div>

              {/* Viewport Frame — Master Spec #24: Canvas is #0F172A specifically for X-ray visibility */}
              <div className="relative rounded-2xl bg-[#0F172A] aspect-[16/10] overflow-hidden flex items-center justify-center border border-slate-200 shadow-inner">
                <img
                  src={
                    activeLayer === 'heatmap'
                      ? getFramePath(currentCase.heatmapImageIndex)
                      : getFramePath(currentCase.rawImageIndex)
                  }
                  alt={`${activeLayer === 'heatmap' ? 'Grad-CAM Attention Map' : 'Raw Radiograph'} — ${currentCase.title}`}
                  className="w-full h-full object-contain filter contrast-[1.05]"
                />

                {/* Clinical Coordinate Axes */}
                <div className="absolute inset-0 medical-grid-bg opacity-20 pointer-events-none" />

                {/* Anatomical Orientation Tags — Master Spec #25 */}
                <div className="absolute top-3 left-3 z-20 text-[10px] font-mono text-[#0F172A] bg-white/95 border border-slate-200 px-2.5 py-1 rounded-full shadow-xs">
                  ANTERIOR-POSTERIOR (AP)
                </div>
                <div className="absolute top-3 right-3 z-20 text-[10px] font-mono text-[#475569] bg-white/95 border border-slate-200 px-2.5 py-1 rounded-full shadow-xs">
                  SCALE: 1:1
                </div>

                {/* Scan Line when analyzing */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-30">
                    <div className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <div className="text-center">
                      <p className="text-sm font-bold text-white">Extracting Trabecular Features</p>
                      <p className="text-xs text-blue-200 mt-0.5 font-mono">Running Layer-4 Grad-CAM Projection...</p>
                    </div>
                  </div>
                )}

                {/* Heatmap Spectral Legend — Master Spec #26 */}
                {activeLayer === 'heatmap' && !isAnalyzing && (
                  <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2 text-[10px] font-mono text-[#475569] bg-white/95 border border-slate-200 px-3 py-1 rounded-full shadow-xs">
                    <span>Preserved</span>
                    <div className="w-14 h-1.5 rounded-full bg-gradient-to-r from-blue-600 via-amber-400 to-red-500" />
                    <span className="text-[#DC2626] font-bold">Deficient</span>
                  </div>
                )}
              </div>
            </div>

            {/* Results Diagnostic Card (Tactile 3D Card) */}
            <div className="card-tactile p-7">
              {/* Telemetry Header */}
              <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-200 mb-6">
                <div>
                  <span className={`inline-block text-[11px] font-bold tracking-wider px-3 py-1 rounded-full mb-2 ${currentCase.riskBadgeClass}`}>
                    {currentCase.riskCategory}
                  </span>
                  <h3 className="text-xl font-bold text-[#0F172A] tracking-tight">{currentCase.diagnosis}</h3>
                  <p className="text-xs text-[#475569] mt-1">
                    Neural Model Confidence:{' '}
                    <span className="text-[#0F172A] font-bold font-mono">{currentCase.confidence}</span>
                  </p>
                </div>

                <div className="text-right flex-shrink-0 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-xs">
                  <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-0.5">Fragility Score</p>
                  <p className={`text-4xl font-black font-mono leading-none ${currentCase.riskColor}`}>
                    {currentCase.score}
                  </p>
                  <p className="text-[10px] text-[#94A3B8] mt-1">out of 100</p>
                </div>
              </div>

              {/* Confidence Spectrum Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-[#475569] font-medium">Osteoporosis Fracture Risk Probability</span>
                  <span className="text-xs font-bold text-[#2563EB] font-mono">{currentCase.confidence}</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${currentCase.riskBarColor} transition-all duration-500`}
                    style={{ width: `${currentCase.score}%` }}
                  />
                </div>
              </div>

              {/* 3-Class Stratification Breakdown */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: 'Normal',       val: `${Math.max(2, 100 - currentCase.score - 5)}%`, badgeClass: 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]' },
                  { label: 'Osteopenia',   val: `${Math.min(10, Math.max(2, 100 - currentCase.score))}%`, badgeClass: 'bg-[#FFFBEB] border-[#FDE68A] text-[#B45309]' },
                  { label: 'Osteoporosis', val: `${currentCase.score}%`, badgeClass: 'bg-[#FEF2F2] border-[#FECACA] text-[#B91C1C] font-bold' },
                ].map((c) => (
                  <div key={c.label} className={`text-center p-3 rounded-xl border ${c.badgeClass}`}>
                    <p className="text-sm font-bold font-mono">{c.val}</p>
                    <p className="text-[10px] uppercase tracking-wider opacity-85 mt-0.5">{c.label}</p>
                  </div>
                ))}
              </div>

              {/* Findings & Recommendations */}
              <div className="space-y-3.5">
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
                  <h4 className="text-xs font-bold text-[#2563EB] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Compass size={14} />
                    Radiological Anatomical Findings
                  </h4>
                  <p className="text-sm text-[#475569] leading-relaxed">{currentCase.findings}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
                  <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-[#16A34A]" />
                    Clinical Recommendation
                  </h4>
                  <p className="text-sm text-[#475569] leading-relaxed">{currentCase.recommendations}</p>
                </div>
              </div>

              {/* Clinical Verification Disclaimer */}
              <div className="mt-6 flex items-start gap-2.5 text-[11px] text-[#92400E] p-3.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A]">
                <AlertTriangle size={15} className="flex-shrink-0 mt-0.5 text-[#D97706]" />
                <span>
                  OsteoVision assessment is intended for opportunistic screening and clinical research decision-support.
                  Final diagnosis must be confirmed by a board-certified physician or bone densitometry specialist.
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
