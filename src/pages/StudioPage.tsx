import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  UploadCloud,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  ArrowLeft,
  FileImage,
  Check,
  FileText,
  Printer,
  X,
  RotateCcw,
  Activity,
  CheckCircle2,
  Stethoscope,
  Info,
} from 'lucide-react';
import { CountUp } from '../components/CountUp';
import { BeforeAfterCompare } from '../components/BeforeAfterCompare';
import { ValidationAlert } from '../components/ValidationAlert';

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
  findings: string;
  recommendations: string;
  rawImageIndex: number;
  heatmapImageIndex: number;
  suggestions: string[];
  probabilities: {
    normal: number;
    osteopenia: number;
    osteoporosis: number;
  };
}

interface BackendResult {
  prediction: string;
  confidence: number;
  class_probabilities: {
    normal: number;
    osteopenia: number;
    osteoporosis: number;
  };
  heatmap_base64: string;
}

const CLINICAL_SAMPLES: SampleCase[] = [
  {
    id: 'case-1',
    title: 'Knee AP View',
    view: 'Anteroposterior (AP) · Female, 68y',
    diagnosis: 'Osteoporosis Indication',
    score: 94,
    confidence: '94.2%',
    riskCategory: 'High Risk',
    riskColor: 'text-[#DC2626]',
    riskBadgeClass: 'bg-red-50 border-red-200 text-red-700',
    findings:
      'Marked rarefaction of horizontal trabeculae in the lateral femoral condyle. Cortical thinning visible along proximal tibial plateau. High probability of osteoporotic structural fragility.',
    recommendations:
      'Urgent dual-energy X-ray absorptiometry (DXA) recommended for spinal/hip T-score verification. Initiate anti-resorptive clinical pathway consultation.',
    rawImageIndex: 100,
    heatmapImageIndex: 299,
    probabilities: { normal: 1.8, osteopenia: 4.0, osteoporosis: 94.2 },
  },
  {
    id: 'case-2',
    title: 'Knee Lateral View',
    view: 'Lateral View · Female, 56y',
    diagnosis: 'Osteopenia (Mild Density Reduction)',
    score: 58,
    confidence: '86.7%',
    riskCategory: 'Moderate Risk',
    riskColor: 'text-[#D97706]',
    riskBadgeClass: 'bg-amber-50 border-amber-200 text-amber-700',
    findings:
      'Borderline trabecular attenuation in subchondral tibial zone. Cortical margin moderately intact with localised early density attenuation.',
    recommendations:
      'Lifestyle modifications, Vitamin D3 & calcium supplementation. Schedule repeat radiological surveillance in 12 months.',
    rawImageIndex: 200,
    heatmapImageIndex: 299,
    probabilities: { normal: 8.2, osteopenia: 86.7, osteoporosis: 5.1 },
  },
  {
    id: 'case-3',
    title: 'Bilateral Weight-Bearing View',
    view: 'Bilateral Stance · Male, 42y',
    diagnosis: 'Normal Healthy Bone Density',
    score: 14,
    confidence: '98.1%',
    riskCategory: 'Healthy / Low Risk',
    riskColor: 'text-[#16A34A]',
    riskBadgeClass: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    findings:
      'Uniform trabecular network preserved throughout distal femur and proximal tibia. Cortical thickness intact with physiological bone mineral density.',
    recommendations:
      'No evidence of osteoporotic deterioration. Maintain routine active wellness protocols.',
    rawImageIndex: 300,
    heatmapImageIndex: 301,
    probabilities: { normal: 98.1, osteopenia: 1.5, osteoporosis: 0.4 },
  },
];

const getFramePath = (index: number) =>
  `/frames/frame_${index.toString().padStart(6, '0')}.jpg`;

export const StudioPage: React.FC<StudioPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Primary State
  const [selectedCaseIdx, setSelectedCaseIdx] = useState<number | null>(0);
  const [activeLayer, setActiveLayer] = useState<'raw' | 'heatmap' | 'compare'>('heatmap');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, message: '' });
  const closeAlert = () => setAlertConfig({ isOpen: false, message: '' });

  // Custom Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [backendResult, setBackendResult] = useState<BackendResult | null>(null);
  const [uploadErrorToast, setUploadErrorToast] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ingest Local File
const ingestFile = useCallback((file: File) => {
    // NEW: 10 MB limit check
    if (file.size > 10485760) {
      setAlertConfig({ isOpen: true, message: 'File size exceeds the 10 MB limit. Please upload a smaller X-ray image.' });
      return;
    }  
      if (!file.type.includes('jpeg') && !file.type.includes('png') && !file.type.includes('jpg')) {
      setUploadErrorToast('Unsupported format. Please upload a PNG or JPEG knee radiograph.');
      setTimeout(() => setUploadErrorToast(null), 5000);
      return;
    }
    setUploadErrorToast(null);

    const img = new window.Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      setSelectedFile(file);
      setPreviewUrl(img.src);
      setBackendResult(null);
      setSelectedCaseIdx(null);
      setApiError(null);
      setActiveLayer('raw');
    };
    img.onerror = () => {
      setUploadErrorToast('Image decoding failed. Please verify that the file is an intact image.');
      setTimeout(() => setUploadErrorToast(null), 5000);
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) ingestFile(file);
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) ingestFile(file);
  };

  const selectClinicalSample = (idx: number) => {
    setSelectedCaseIdx(idx);
    setSelectedFile(null);
    setPreviewUrl(null);
    setBackendResult(null);
    setApiError(null);
    setActiveLayer('heatmap');
  };

  // Trigger AI Inference
  const triggerAnalysis = async () => {
    setIsAnalyzing(true);
    setApiError(null);

    if (selectedCaseIdx !== null) {
      setTimeout(() => {
        setIsAnalyzing(false);
        setActiveLayer('heatmap');
      }, 1000);
      return;
    }

    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await fetch('http://127.0.0.1:8000/predict', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || 'API request failed');
        }

        const data = await response.json();
        setBackendResult(data);
        setActiveLayer('heatmap');
      }  catch (err: any) {
        console.error(err);
        const errorMsg = err.message || 'Failed to reach OsteoVision AI backend. Ensure backend is running.';
        
        // NEW: Trigger the custom popup for backend rejections
        setAlertConfig({ isOpen: true, message: errorMsg });
        
        setApiError(errorMsg);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        setActiveLayer(l => (l === 'heatmap' ? 'raw' : 'heatmap'));
      }
      if (e.key.toLowerCase() === 'c') {
        setActiveLayer(l => (l === 'compare' ? 'heatmap' : 'compare'));
      }
      if (e.key === 'Escape' && showReportModal) {
        setShowReportModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showReportModal]);

  // Derived Display Case
  // Derived Display Case
  const getDisplayCase = (): SampleCase => {
    if (selectedCaseIdx !== null) return CLINICAL_SAMPLES[selectedCaseIdx];

    if (!backendResult) {
      return {
        id: 'custom',
        title: selectedFile?.name || 'Custom Radiograph',
        view: 'Uploaded Knee Radiograph · Ready to Analyze',
        diagnosis: 'Awaiting Diagnostic Analysis',
        score: 0,
        confidence: '0.0%',
        riskCategory: 'Moderate Risk',
        riskColor: 'text-[#64748B]',
        riskBadgeClass: 'bg-slate-100 border-slate-200 text-slate-600',
        findings: 'Radiograph uploaded. Click "Analyze Scan" to calculate bone mineral density and generate Grad-CAM++ heatmap.',
        recommendations: 'Pending automated ConvNeXt-Tiny classification.',
        
        // 1. ADDED FALLBACK SUGGESTIONS HERE
        suggestions: ['Upload and analyze a scan to receive actionable lifestyle suggestions.'], 
        
        rawImageIndex: 0,
        heatmapImageIndex: 0,
        probabilities: { normal: 0, osteopenia: 0, osteoporosis: 0 },
      };
    }

    const isOsteo = backendResult.prediction === 'osteoporosis';
    const isNormal = backendResult.prediction === 'normal';

    return {
      id: 'custom',
      title: selectedFile?.name || 'Custom Radiograph',
      view: 'Patient Radiograph · ConvNeXt-Tiny Inference',
      diagnosis: isOsteo ? 'Osteoporosis Indication' : isNormal ? 'Normal Healthy Bone Density' : 'Osteopenia (Mild Density Loss)',
      score: Math.round(backendResult.confidence),
      confidence: `${backendResult.confidence.toFixed(1)}%`,
      riskCategory: isOsteo ? 'High Risk' : isNormal ? 'Healthy / Low Risk' : 'Moderate Risk',
      riskColor: isOsteo ? 'text-[#DC2626]' : isNormal ? 'text-[#16A34A]' : 'text-[#D97706]',
      riskBadgeClass: isOsteo
        ? 'bg-red-50 border-red-200 text-red-700'
        : isNormal
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
          : 'bg-amber-50 border-amber-200 text-amber-700',
      findings: isOsteo
        ? 'ConvNeXt feature maps indicate marked trabecular thinning and localized bone mineral rarefaction in the periarticular knee region.'
        : isNormal
          ? 'Preserved cortical contour and physiological trabecular micro-mesh throughout femoral condyles and proximal tibia.'
          : 'Mild attenuation of subchondral trabecular network. Early density loss detected.',
      recommendations: isOsteo
        ? 'Dual-energy X-ray absorptiometry (DXA) recommended for spinal/hip T-score verification. Consult orthopedics specialist.'
        : isNormal
          ? 'Physiological bone mineral distribution confirmed. Maintain standard active lifestyle and nutritional calcium protocols.'
          : 'Lifestyle modification, Vitamin D3 & dietary calcium optimization. Repeat radiographic surveillance in 12 months.',
          
      suggestions: isOsteo
        ? [
            "See a bone specialist (endocrinologist or rheumatologist) to discuss treatment options.",
            "Talk to your doctor about medicines that can help stop further bone loss.",
            "Make your home safer to prevent falls (like removing loose rugs and adding grab bars).",
            "Ensure you are getting enough calcium and Vitamin D daily."
          ]
        : isNormal
          ? [
              "Keep eating a healthy diet rich in calcium (like milk, yogurt, almonds, or leafy greens).",
              "Keep your bones strong by doing simple daily exercises like brisk walking or yoga.",
              "Get a little bit of morning sunlight every day so your body can naturally make Vitamin D.",
              "Go for your regular yearly doctor check-ups."
            ]
          : [ // Osteopenia
              "Eat more calcium-rich foods to help strengthen your bones and prevent further loss.",
              "Start doing light exercises like walking or lifting small weights 3 to 4 days a week.",
              "Get another bone scan in 1 to 2 years to check if your bone health is changing.",
              "Try to cut down on smoking, alcohol, and excess caffeine to protect your bones."
            ],

      rawImageIndex: 0,
      heatmapImageIndex: 0,
      probabilities: backendResult.class_probabilities || (
        isOsteo
          ? { normal: 2.1, osteopenia: 5.4, osteoporosis: backendResult.confidence }
          : isNormal
            ? { normal: backendResult.confidence, osteopenia: 4.2, osteoporosis: 1.1 }
            : { normal: 9.3, osteopenia: backendResult.confidence, osteoporosis: 6.5 }
      ),
    };
  };
  
  const displayCase = getDisplayCase();

  const rawSrc =
    selectedCaseIdx !== null ? getFramePath(displayCase.rawImageIndex) : previewUrl ?? '';
  const overlaySrc =
    selectedCaseIdx !== null
      ? getFramePath(displayCase.heatmapImageIndex)
      : backendResult
        ? `data:image/jpeg;base64,${backendResult.heatmap_base64}`
        : previewUrl ?? '';

  const hasResult = selectedCaseIdx !== null || backendResult !== null;

  // SVG Circular Gauge Calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, displayCase.score)) / 100) * circumference;

  return (
    <div className={`pt-24 pb-16 min-h-screen bg-[#F8FAFC] text-[#0F172A] relative selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden print:overflow-visible print:bg-white print:p-0 ${showReportModal || alertConfig.isOpen ? 'z-[100]' : 'z-10'}`}>

      {/* Subtle Aurora Ambient Light */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden print:hidden" style={{ zIndex: 0 }}>
        <div
          className="absolute rounded-full"
          style={{
            width: '50vw', height: '50vw', top: '-15%', right: '-10%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '45vw', height: '45vw', top: '40%', left: '-15%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 print:hidden">

        {/* ══════════════════════════════════════════════════
            HEADER — Clean, Modern & Elegant
        ══════════════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <button
                onClick={() => onNavigate('/')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#2563EB] transition-colors cursor-pointer"
              >
                <ArrowLeft size={13} />
                <span>Home</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Analysis Studio
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              AI Knee X-Ray Analysis
            </h1>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowReportModal(true)}
              className="btn-tactile-light inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer shadow-xs"
            >
              <Printer size={14} className="text-[#2563EB]" />
              <span>Export Report (PDF)</span>
            </button>
            <button
              onClick={triggerAnalysis}
              disabled={isAnalyzing}
              className="btn-tactile-dark inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold cursor-pointer shadow-sm"
            >
              <Sparkles size={14} className={isAnalyzing ? 'animate-spin' : ''} />
              <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Scan'}</span>
            </button>
          </div>
        </div>

        {/* Global Toast Alert if upload fails */}
        {uploadErrorToast && (
          <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
              <span className="font-semibold">{uploadErrorToast}</span>
            </div>
            <button onClick={() => setUploadErrorToast(null)} className="p-1 text-red-400 hover:text-red-700 cursor-pointer">
              <X size={15} />
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            SLIM CONTROL STRIP: Quick Examples + Upload Button
            (Clean, minimal, zero clutter)
        ══════════════════════════════════════════════════ */}
        <div className="card-tactile p-3 sm:p-3.5 bg-white mb-6 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          
          {/* Quick Demo Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1 hidden sm:inline">
              Try an Example:
            </span>
            <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs gap-1">
              <button
                onClick={() => selectClinicalSample(0)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedCaseIdx === 0
                    ? 'bg-white text-red-700 shadow-xs border border-slate-200/70'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Osteoporosis (AP)
              </button>
              <button
                onClick={() => selectClinicalSample(1)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedCaseIdx === 1
                    ? 'bg-white text-amber-700 shadow-xs border border-slate-200/70'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Osteopenia (Lateral)
              </button>
              <button
                onClick={() => selectClinicalSample(2)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedCaseIdx === 2
                    ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/70'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Normal Healthy
              </button>
            </div>
          </div>

          {/* Upload Button */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                selectedCaseIdx === null && selectedFile
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'
              }`}
            >
              <UploadCloud size={14} />
              <span>{selectedFile ? 'Change Scan' : 'Upload Your X-Ray (PNG/JPG)'}</span>
            </button>
          </div>

        {/* ... End of SLIM CONTROL STRIP ... */}
        </div>

        {/* ══════════════════════════════════════════════════
            CLINICAL DISCLAIMER TICKER
        ══════════════════════════════════════════════════ */}
        <div className="w-full bg-amber-50 border border-amber-200 rounded-xl overflow-hidden mb-6 relative flex items-center shadow-sm">
          {/* Static Warning Icon on the Left */}
          <div className="absolute left-0 bg-amber-50/90 backdrop-blur-sm z-10 px-3 py-2 border-r border-amber-200 flex items-center justify-center">
            <AlertTriangle size={15} className="text-amber-600" />
          </div>
          
          {/* Scrolling Container */}
          <div className="flex-1 overflow-hidden relative py-2">
            <style>
              {`
                @keyframes scrollTicker {
                  0% { transform: translateX(70%); }
                  100% { transform: translateX(-100%); }
                }
                .animate-ticker {
                  display: inline-block;
                  white-space: nowrap;
                  animation: scrollTicker 30s linear infinite;
                  padding-left: 2rem;
                }
                .animate-ticker:hover {
                  animation-play-state: paused;
                }
              `}
            </style>
            <div className="animate-ticker text-[11px] sm:text-xs text-amber-800">
              <strong className="tracking-wider uppercase mr-2 text-amber-900">Clinical & Research Disclaimer:</strong>
              OsteoVision AI predictions are for educational and preliminary research demonstration only. Not intended to replace official diagnostic procedures (DXA). Clinical interpretation must be performed by a qualified orthopedic or radiology specialist.
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            MAIN 2-COLUMN WORKSTATION (FLUID & SCALABLE)
        ══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ─────────────────────────────────────────────
              LEFT: Master Radiograph Viewport (7 Cols)
          ───────────────────────────────────────────── */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            
            <div className="card-tactile p-4 sm:p-5 bg-white">
              
              {/* Viewport Top Ribbon */}
              <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A] tracking-tight truncate max-w-[240px] sm:max-w-none">
                    {displayCase.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {displayCase.view}
                  </p>
                </div>

                {/* Minimalist 3-Pill Layer Switcher */}
                <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80">
                  <button
                    onClick={() => setActiveLayer('raw')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeLayer === 'raw'
                        ? 'bg-white text-[#0F172A] shadow-xs border border-slate-200/70'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Original
                  </button>
                  <button
                    onClick={() => setActiveLayer('heatmap')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeLayer === 'heatmap'
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles size={11} />
                    <span>Heatmap</span>
                  </button>
                  <button
                    onClick={() => setActiveLayer('compare')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeLayer === 'compare'
                        ? 'bg-white text-[#0F172A] shadow-xs border border-slate-200/70'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Compare
                  </button>
                </div>
              </div>

              {/* Viewport Canvas Stage */}
              <div
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  relative rounded-2xl bg-[#090D16] aspect-[4/3] sm:aspect-[16/11] overflow-hidden flex items-center justify-center border shadow-inner group
                  ${isDragOver ? 'border-blue-500 ring-4 ring-blue-500/20' : 'border-slate-800'}
                `}
                style={{ touchAction: 'none' }}
              >
                {/* Visualizer Image Canvas */}
                {activeLayer === 'compare' && hasResult ? (
                  <div className="w-full h-full relative overflow-hidden">
                    <BeforeAfterCompare before={rawSrc} after={overlaySrc} />
                  </div>
                ) : (
                  rawSrc && (
                    <div className="w-full h-full flex items-center justify-center overflow-hidden relative">
                      <img
                        key={`${activeLayer}:${activeLayer === 'heatmap' ? overlaySrc : rawSrc}`}
                        src={activeLayer === 'heatmap' ? overlaySrc : rawSrc}
                        alt={activeLayer === 'heatmap' ? 'Visual Explanation' : 'Original X-ray'}
                        className={`w-full h-full object-contain ${activeLayer === 'heatmap' ? 'animate-heatReveal' : ''}`}
                      />
                    </div>
                  )
                )}

                {/* Animated Electric Cyan Laser Sweep Beam during layer switch / analysis */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.8)] animate-scanBeam"
                  style={{ zIndex: 15 }}
                />

                {/* Analyzing Overlay */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-[#090D16]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
                    <div className="relative mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-cyan-300 animate-pulse">
                        <Sparkles size={24} className="animate-spin" />
                      </div>
                    </div>
                    <p className="text-white text-base font-bold tracking-tight mb-1">
                      Analyzing Knee Joint Architecture
                    </p>
                    <p className="text-xs font-mono text-cyan-300">
                      Processing
                    </p>
                  </div>
                )}
              </div>

              {/* Viewport Caption / Helper */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Info size={12} className="text-[#2563EB]" />
                  Drag the slider in "Compare" mode to inspect bone density beneath heatmap.
                </span>
                <span className="font-mono text-[10px] text-slate-400 hidden sm:inline">
                  [SPACE] Toggle Heatmap · [C] Compare
                </span>
              </div>

            </div>

          </div>

          {/* ─────────────────────────────────────────────
              RIGHT: Live Clinical AI Verdict & Telemetry (5 Cols)
          ───────────────────────────────────────────── */}
          <div className="lg:col-span-5 flex flex-col gap-4">

            {/* ── CARD 1: DIAGNOSTIC VERDICT & SCORE RING ── */}
            <div className="card-tactile p-6 bg-white">
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Diagnostic Prediction
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${displayCase.riskBadgeClass}`}>
                  {displayCase.riskCategory}
                </span>
              </div>

              {/* Score Meter + Headline */}
              <div className="flex items-center gap-5 my-1">
                
                {/* SVG Radial Score Ring */}
                <div className="relative w-22 h-22 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke="#F1F5F9"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className={`${displayCase.riskColor} transition-all duration-700 ease-out`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-black font-mono tracking-tight text-[#0F172A]">
                      <CountUp end={displayCase.score} />%
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest -mt-0.5">
                      SCORE
                    </span>
                  </div>
                </div>

                {/* Verdict Title */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-extrabold text-[#0F172A] leading-snug tracking-tight mb-1">
                    {displayCase.diagnosis}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Certainty: <strong className="font-mono text-[#0F172A]">{displayCase.confidence}</strong>
                  </p>
                </div>
              </div>

            </div>

            {/* ── CARD 2: 3-CLASS PROBABILITY DISTRIBUTION ── */}
            <div className="card-tactile p-6 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Probability Breakdown
                </h4>
                <span className="text-[10px] font-mono text-slate-400">3-CLASS</span>
              </div>

              <div className="space-y-3">
                {/* Normal */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">Normal Healthy Bone</span>
                    <span className="font-mono text-emerald-600 font-bold">
                      {displayCase.probabilities.normal.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${displayCase.probabilities.normal}%` }}
                    />
                  </div>
                </div>

                {/* Osteopenia */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">Osteopenia (Mild Loss)</span>
                    <span className="font-mono text-amber-600 font-bold">
                      {displayCase.probabilities.osteopenia.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${displayCase.probabilities.osteopenia}%` }}
                    />
                  </div>
                </div>

                {/* Osteoporosis */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">Osteoporosis (High Risk)</span>
                    <span className="font-mono text-red-600 font-bold">
                      {displayCase.probabilities.osteoporosis.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-red-600 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${displayCase.probabilities.osteoporosis}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

       {/* ── CARD 3: RADIOLOGICAL FINDINGS & RECOMMENDATIONS ── */}
            <div className="card-tactile p-6 bg-white space-y-3.5">
              
              <div>
                <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Clinical Follow-Up Guidance</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal bg-blue-50/40 p-3 rounded-xl border border-blue-100/60">
                  {displayCase.recommendations}
                </p>
              </div>

              {/* NEW: Actionable Suggestions Block */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  <Activity size={14} className="text-blue-500" />
                  <span>Actionable Lifestyle Suggestions</span>
                </div>
                <ul className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {displayCase.suggestions?.map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed font-medium">
                      <span className="text-blue-500 font-bold mt-0.5">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* ── ACTION BUTTON: PRINT PDF SUMMARY ── */}
            <button
              onClick={() => setShowReportModal(true)}
              className="btn-tactile-dark w-full py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer hover:shadow-md transition-all"
            >
              <Printer size={18} />
              <span>Export Medical AI Report (PDF)</span>
            </button>

          </div>

        </div>

      </div>

      {/* ══════════════════════════════════════════════════
          OFFICIAL PRINTABLE CLINICAL AI REPORT MODAL
      ══════════════════════════════════════════════════ */}
      {showReportModal && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setShowReportModal(false)}
          // z-[9999] forces it over the header on the website, while print:static allows multi-page printing
          className="fixed inset-0 z-[9999] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto print:static print:block print:p-0 print:bg-white print:overflow-visible"
        >
          <div
            onClick={e => e.stopPropagation()}
            // print:block and print:h-auto remove flexbox restrictions so content flows naturally onto page 2
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn my-auto print:block print:w-full print:max-w-none print:h-auto print:max-h-none print:m-0 print:p-0 print:shadow-none print:border-none print:rounded-none print:overflow-visible"
          >
            {/* Modal Actions Header Bar */}
            {/* Modal Actions Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80 print:hidden">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-[#2563EB]" />
                <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Clinical AI Diagnostic Summary Preview
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => window.print()}
                  className="btn-tactile-dark inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            {/* ... KEEP THE REST OF YOUR EXISTING MODAL CODE EXACTLY THE SAME FROM HERE DOWN ... */}

            {/* Printable Document Body */}
            {/* ... KEEP THE REST OF YOUR EXISTING MODAL CODE EXACTLY THE SAME FROM HERE DOWN ... */}

            {/* Printable Document Body */}
            <div className="p-8 sm:p-10 overflow-y-auto space-y-6 text-[#0F172A]">
              
              {/* Institutional Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-slate-900 gap-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center p-1.5 flex-shrink-0 shadow-xs">
                      <img src="/favicon.png" alt="OsteoVision Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-xl font-black tracking-tight text-[#0F172A]">
                      OSTEOVISION AI CLINICAL REPORT
                    </h1>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Automated Knee Radiograph Osteoporosis Screening &amp; Grad-CAM++ Telemetry
                  </p>
                </div>
                <div className="text-left sm:text-right font-mono text-[11px] text-slate-500 space-y-0.5">
                  <p><strong className="text-slate-900">REPORT ID:</strong> OST-XRAY-{Math.abs(displayCase.title.split('').reduce((a,b)=>a+b.charCodeAt(0),0))}</p>
                  <p><strong className="text-slate-900">DATE:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  <p><strong className="text-slate-900">PROTOCOL:</strong> Knee AP</p>
                </div>
              </div>

              {/* Study Metadata Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Study Image</p>
                  <p className="font-bold text-slate-900 truncate">{displayCase.title}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">View / Projection</p>
                  <p className="font-bold text-slate-900">{displayCase.view}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Diagnostic Score</p>
                  <p className="font-bold font-mono text-blue-600">{displayCase.score} / 100</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Risk Classification</p>
                  <p className="font-bold text-slate-900">{displayCase.riskCategory}</p>
                </div>
              </div>

              {/* Primary AI Classification Callout */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">AI Classification Decision</p>
                  <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">{displayCase.diagnosis}</h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Model Confidence: <span className="font-mono font-bold text-blue-600">{displayCase.confidence}</span>
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider ${displayCase.riskBadgeClass}`}>
                  {displayCase.riskCategory}
                </div>
              </div>

              {/* Softmax Probability Distribution */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                  Softmax Probability Distribution Across 3 Target Classes
                </h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                    <p className="text-[11px] text-slate-500 mb-0.5">Normal Bone Density</p>
                    <p className="text-lg font-black font-mono text-emerald-600">{displayCase.probabilities.normal.toFixed(1)}%</p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                    <p className="text-[11px] text-slate-500 mb-0.5">Osteopenia</p>
                    <p className="text-lg font-black font-mono text-amber-600">{displayCase.probabilities.osteopenia.toFixed(1)}%</p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                    <p className="text-[11px] text-slate-500 mb-0.5">Osteoporosis</p>
                    <p className="text-lg font-black font-mono text-red-600">{displayCase.probabilities.osteoporosis.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              {/* Dual Visual Radiograph Thumbnails */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950 aspect-[4/3] flex flex-col justify-between">
                  <div className="flex-1 flex items-center justify-center p-2">
                    {rawSrc && <img src={rawSrc} alt="Original Radiograph" className="max-h-full max-w-full object-contain" />}
                  </div>
                  <div className="p-2 bg-slate-900 text-[10px] font-mono text-slate-300 text-center">
                    Original Radiograph (AP)
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950 aspect-[4/3] flex flex-col justify-between">
                  <div className="flex-1 flex items-center justify-center p-2">
                    {overlaySrc && <img src={overlaySrc} alt="Grad-CAM Explanation" className="max-h-full max-w-full object-contain" />}
                  </div>
                  <div className="p-2 bg-slate-900 text-[10px] font-mono text-cyan-300 text-center">
                    Grad-CAM++ Attention Heatmap
                  </div>
                </div>
              </div>

              {/* AI Interpretation & Actionable Suggestions */}
              <div className="space-y-4 text-xs text-slate-700 mt-6">
                
                {/* Non-Technical AI Reasoning */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 break-inside-avoid">
                  <strong className="block text-slate-900 mb-2 font-black uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Sparkles size={14} className="text-blue-600" />
                    How the AI Made This Decision
                  </strong>
                  <p className="leading-relaxed mb-3">
                    The OsteoVision AI examines the X-ray to check the overall density and structure of the knee joint. It compares the visual texture of the bone against thousands of verified cases to predict bone health. 
                  </p>
                  <p className="leading-relaxed">
                    Based on your scan, the system identified structural patterns matching <strong className="text-slate-900">{displayCase.diagnosis}</strong>. You can see exactly why the AI made this choice by looking at the <strong>Attention Heatmap</strong> above: the "hot" red and yellow spots highlight the specific areas of the bone that led to this result.
                  </p>
                </div>
                
                {/* Dynamic Suggestions List */}
                <div className="p-5 rounded-2xl bg-blue-50/40 border border-blue-100 break-inside-avoid">
                  <strong className="block text-slate-900 mb-3 font-black uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Activity size={14} className="text-blue-600" />
                    Actionable Lifestyle & Clinical Suggestions
                  </strong>
                  <ul className="space-y-2.5">
                    {displayCase.suggestions?.map((suggestion, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-slate-700 leading-relaxed font-medium">
                        <span className="text-blue-500 font-bold mt-0.5">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
              </div>

              {/* Signature Block & Clinical Disclaimer */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-[10px] text-slate-500">
                <div className="max-w-md">
                  <strong className="block text-slate-700 font-semibold mb-0.5">CLINICAL &amp; RESEARCH DISCLAIMER:</strong>
                  <span>
                    OsteoVision AI predictions are for educational and preliminary research demonstration only. Not intended to replace official diagnostic procedures (DXA). Clinical interpretation must be performed by a qualified orthopedic or radiology specialist.
                  </span>
                </div>
                <div className="w-48 text-right flex flex-col items-end">
                  <div className="w-36 border-b border-slate-400 mb-1" />
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">Reviewing Specialist / Signature</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
      <ValidationAlert 
        isOpen={alertConfig.isOpen} 
        message={alertConfig.message} 
        onClose={closeAlert} 
      />

    </div>
  );
};