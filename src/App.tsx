import React, { useEffect, useRef } from 'react';
import {
  ArrowRight,
  PlayCircle,
  Cpu,
  BarChart2,
  ShieldCheck,
  Heart,
  Eye,
  CheckCircle,
  UploadCloud,
  Target,
  Monitor,
  Lock,
  Linkedin,
  Instagram,
  Twitter,
  Bone
} from 'lucide-react';

const Navbar = () => (
  <nav className="flex items-center justify-between py-6 px-8 max-w-7xl mx-auto w-full">
    <div className="flex items-center gap-2 cursor-pointer">
      <div className="text-blue-400">
        <Bone size={32} />
      </div>
      <div>
        <h1 className="text-xl font-bold text-white leading-none">OsteoVision</h1>
        <p className="text-[10px] text-gray-400 mt-1">See Deeper. For Stronger Tomorrows.</p>
      </div>
    </div>

    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
      <a href="#" className="text-white relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-blue-500 after:rounded-full">Home</a>
      <a href="#" className="hover:text-white transition-colors">About</a>
      <a href="#" className="hover:text-white transition-colors">How it Works</a>
      <a href="#" className="hover:text-white transition-colors">Features</a>
      <a href="#" className="hover:text-white transition-colors">Try Now</a>
      <a href="#" className="hover:text-white transition-colors">Contact</a>
    </div>

    <button className="hidden md:flex items-center gap-2 bg-transparent border border-white/20 hover:bg-white/10 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer">
      Get Started
      <ArrowRight size={16} />
    </button>
  </nav>
);

const Tag = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center justify-center border border-white/10 bg-white/5 px-4 py-1.5 rounded-full mb-6">
    <span className="text-xs font-semibold tracking-wider text-gray-300 uppercase">{children}</span>
  </div>
);

const Hero = () => (
  <section className="max-w-7xl mx-auto px-8 py-20 flex flex-col lg:flex-row items-center gap-16 relative">
    <div className="flex-1">
      <Tag>AI For Stronger Bones</Tag>
      <h1 className="text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-6">
        Osteoporosis Detection<br />
        <span className="text-[#60A5FA]">Made Smarter with AI</span>
      </h1>
      <p className="text-gray-400 text-lg mb-10 max-w-xl leading-relaxed">
        OsteoVision is an explainable AI-based system that classifies osteoporosis from knee X-ray images, helping in early detection and better bone health decisions.
      </p>
      <div className="flex flex-wrap items-center gap-6">
        <button className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-full font-medium transition-colors cursor-pointer">
          Upload X-Ray
          <ArrowRight size={18} />
        </button>
        <button className="flex items-center gap-3 text-white hover:text-gray-300 transition-colors font-medium cursor-pointer">
          <PlayCircle size={24} className="text-blue-400" />
          Watch Demo
        </button>
      </div>
    </div>

    <div className="flex-1 relative w-full flex justify-center lg:justify-end">
      {/* Abstract representation of the glowing knee image since background is omitted */}
      <div className="relative w-[400px] h-[500px] rounded-3xl border border-white/10 bg-gradient-to-b from-blue-900/20 to-transparent flex items-center justify-center overflow-hidden">
        {/* Framing brackets */}
        <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-white/30 rounded-tl-lg"></div>
        <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-white/30 rounded-tr-lg"></div>
        <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-white/30 rounded-bl-lg"></div>
        <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-white/30 rounded-br-lg"></div>

        <div className="opacity-50 text-blue-400">
          <Bone size={120} strokeWidth={1} />
        </div>
      </div>

      {/* Hand-drawn arrow and text abstraction */}
      <div className="absolute -bottom-4 right-4 md:-right-8 flex flex-col items-start rotate-[-8deg] z-10 pointer-events-none">
        <p className="font-['Caveat',_cursive] text-3xl md:text-4xl text-gray-200 transform -rotate-6 mb-[-4px]">Early Detection</p>
        <p className="font-['Caveat',_cursive] text-3xl md:text-4xl text-gray-200 transform -rotate-6 ml-6">Stronger Lives</p>
        {/* Curved arrow pointing towards the knee */}
        <svg width="150" height="100" viewBox="0 0 150 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -left-32 -top-6 opacity-90 drop-shadow-md">
          {/* Main curve */}
          <path d="M130 65 Q 80 100 20 30" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Arrowhead */}
          <path d="M20 30 L 35 25 M 20 30 L 25 45" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
    </div>
  </section>
);

const FeatureBar = () => (
  <div className="max-w-7xl mx-auto px-8 pb-24">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      <div className="flex items-center gap-4 justify-center">
        <Cpu className="text-gray-400" size={24} />
        <span className="text-gray-200 font-medium">AI Powered</span>
      </div>
      <div className="flex items-center gap-4 justify-center">
        <BarChart2 className="text-gray-400" size={24} />
        <span className="text-gray-200 font-medium">Explainable Results</span>
      </div>
      <div className="flex items-center gap-4 justify-center">
        <ShieldCheck className="text-gray-400" size={24} />
        <span className="text-gray-200 font-medium">Secure & Private</span>
      </div>
      <div className="flex items-center gap-4 justify-center">
        <Heart className="text-gray-400" size={24} />
        <span className="text-gray-200 font-medium">For a Healthier Tomorrow</span>
      </div>
    </div>
  </div>
);

const Intro = () => (
  <section className="max-w-5xl mx-auto px-8 py-24 text-center">
    <Tag>Introduction</Tag>
    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
      What is <span className="text-[#60A5FA]">OsteoVision?</span>
    </h2>
    <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-16 leading-relaxed">
      OsteoVision is an explainable AI-based web platform that classifies osteoporosis from knee X-ray images using advanced deep learning models. It not only predicts but also shows why, so that results are transparent and trustworthy.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-[#121827] border border-white/5 rounded-2xl p-8 text-left flex flex-col items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
          <Cpu className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">AI-Powered<br />Classification</h3>
          <p className="text-gray-500 text-sm leading-relaxed">Accurate detection of osteoporosis from knee X-ray images.</p>
        </div>
      </div>

      <div className="bg-[#121827] border border-white/5 rounded-2xl p-8 text-left flex flex-col items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
          <Eye className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Explainable AI<br />&nbsp;</h3>
          <p className="text-gray-500 text-sm leading-relaxed">Visual explanations (heatmaps) showing important regions.</p>
        </div>
      </div>

      <div className="bg-[#121827] border border-white/5 rounded-2xl p-8 text-left flex flex-col items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
          <CheckCircle className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Accessible & Easy to Use</h3>
          <p className="text-gray-500 text-sm leading-relaxed">A simple web platform for faster and reliable analysis.</p>
        </div>
      </div>
    </div>
  </section>
);

const HowItWorks = () => (
  <section className="max-w-7xl mx-auto px-8 py-24">
    <div className="text-center mb-16">
      <Tag>Step by Step</Tag>
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
        How It <span className="text-[#60A5FA]">Works</span>
      </h2>
      <p className="text-gray-400 text-lg">
        From upload to insights — get osteoporosis prediction in just a few steps.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Step 1 */}
      <div className="bg-[#121827] border border-white/5 rounded-2xl p-6 relative flex flex-col">
        <span className="text-blue-500 text-2xl font-bold mb-4">01</span>
        <h3 className="text-xl font-bold text-white mb-2">Upload X-Ray</h3>
        <p className="text-gray-500 text-sm mb-6 flex-1">Upload a knee X-ray image in standard format (JPG, PNG).</p>
        <div className="border border-dashed border-white/20 rounded-xl bg-white/5 h-48 flex flex-col items-center justify-center gap-4 text-center p-4">
          <UploadCloud className="text-gray-400" size={32} />
          <p className="text-gray-400 text-xs">Drag & drop your X-ray<br />or <span className="text-white font-medium">browse files</span></p>
        </div>
      </div>

      {/* Step 2 */}
      <div className="bg-[#121827] border border-white/5 rounded-2xl p-6 relative flex flex-col">
        <span className="text-blue-500 text-2xl font-bold mb-4">02</span>
        <h3 className="text-xl font-bold text-white mb-2">AI Analysis</h3>
        <p className="text-gray-500 text-sm mb-6 flex-1">Our deep learning model analyzes the image.</p>
        <div className="rounded-xl bg-[#0B0F19] h-48 border border-white/5 overflow-hidden relative flex items-center justify-center group">
          <Bone className="text-gray-600 w-24 h-24" strokeWidth={1.5} />
          {/* Scanning line animation mock */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-blue-500 shadow-[0_0_10px_2px_#3B82F6]"></div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-blue-400 border-t-transparent animate-spin"></div>
            <span className="text-xs text-white">Processing...</span>
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div className="bg-[#121827] border border-white/5 rounded-2xl p-6 relative flex flex-col">
        <span className="text-blue-500 text-2xl font-bold mb-4">03</span>
        <h3 className="text-xl font-bold text-white mb-2">Get Results</h3>
        <p className="text-gray-500 text-sm mb-6 flex-1">View classification with confidence score.</p>
        <div className="rounded-xl bg-[#0B0F19] h-48 border border-white/5 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mb-3">
            <span className="font-bold">!</span>
          </div>
          <h4 className="text-red-500 font-semibold mb-6">Osteoporosis Detected</h4>

          <div className="w-full text-left">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-400">Confidence Score</span>
              <span className="text-white font-bold">92%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[92%] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 4 */}
      <div className="bg-[#121827] border border-white/5 rounded-2xl p-6 relative flex flex-col">
        <span className="text-blue-500 text-2xl font-bold mb-4">04</span>
        <h3 className="text-xl font-bold text-white mb-2">See Explanation</h3>
        <p className="text-gray-500 text-sm mb-6 flex-1">Visualize AI explanations with heatmaps.</p>
        <div className="rounded-xl bg-[#0B0F19] h-48 border border-white/5 relative flex items-center justify-center p-2">
          <div className="w-full h-full relative border border-white/10 rounded-lg overflow-hidden flex items-center justify-center">
            <Bone className="text-gray-600 w-24 h-24" strokeWidth={1} />
            {/* Heatmap blob mock */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-red-500/40 rounded-full blur-xl mix-blend-screen"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-yellow-400/60 rounded-full blur-lg mix-blend-screen"></div>
          </div>

          {/* Color scale legend */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center h-32">
            <span className="text-[8px] text-gray-500 mb-1">High<br />Importance</span>
            <div className="flex-1 w-1.5 rounded-full bg-gradient-to-b from-red-500 via-yellow-500 to-blue-900"></div>
            <span className="text-[8px] text-gray-500 mt-1">Low<br />Importance</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Features = () => (
  <section className="max-w-7xl mx-auto px-8 py-24 text-center">
    <Tag>Key Features</Tag>
    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
      Why Choose <span className="text-[#60A5FA]">OsteoVision?</span>
    </h2>
    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-16">
      Combining AI accuracy with explainability, accessibility, and trust.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-[#121827] border border-white/5 rounded-2xl p-8 text-left">
        <Target className="text-blue-400 mb-6" size={32} />
        <h3 className="text-xl font-bold text-white mb-3">High Accuracy</h3>
        <p className="text-gray-500 text-sm leading-relaxed">Advanced deep learning for reliable classification.</p>
      </div>

      <div className="bg-[#121827] border border-white/5 rounded-2xl p-8 text-left">
        <Eye className="text-blue-400 mb-6" size={32} />
        <h3 className="text-xl font-bold text-white mb-3">Explainable Results</h3>
        <p className="text-gray-500 text-sm leading-relaxed">Heatmaps highlight important bone regions.</p>
      </div>

      <div className="bg-[#121827] border border-white/5 rounded-2xl p-8 text-left">
        <Monitor className="text-blue-400 mb-6" size={32} />
        <h3 className="text-xl font-bold text-white mb-3">Web-Based Platform</h3>
        <p className="text-gray-500 text-sm leading-relaxed">No installation required. Access from anywhere.</p>
      </div>

      <div className="bg-[#121827] border border-white/5 rounded-2xl p-8 text-left">
        <Lock className="text-blue-400 mb-6" size={32} />
        <h3 className="text-xl font-bold text-white mb-3">Privacy Focused</h3>
        <p className="text-gray-500 text-sm leading-relaxed">Your data stays secure and confidential.</p>
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section className="max-w-4xl mx-auto px-8 py-24 text-center">
    <Tag>Get Started</Tag>
    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
      Analyze Your Knee X-Ray <span className="text-[#60A5FA]">Today</span>
    </h2>
    <p className="text-gray-400 text-lg mb-10">
      Take a step towards stronger bones with AI-powered insights.
    </p>

    <div className="flex flex-col items-center gap-6">
      <button className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-full font-medium transition-colors cursor-pointer">
        Upload Your X-Ray
        <ArrowRight size={18} />
      </button>

      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <Lock size={14} />
        <span>Your data is safe with us.</span>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t border-white/10 mt-12 pt-12 pb-8">
    <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">

      <div className="flex items-center gap-2 cursor-pointer">
        <div className="text-blue-400">
          <Bone size={28} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white leading-none">OsteoVision</h1>
          <p className="text-[9px] text-gray-500 mt-1">See Deeper. For Stronger Tomorrows.</p>
        </div>
      </div>

      <div className="flex gap-8 text-sm text-gray-400">
        <a href="#" className="hover:text-white transition-colors cursor-pointer">Home</a>
        <a href="#" className="hover:text-white transition-colors cursor-pointer">About</a>
        <a href="#" className="hover:text-white transition-colors cursor-pointer">Features</a>
        <a href="#" className="hover:text-white transition-colors cursor-pointer">Contact</a>
      </div>

      <div className="flex gap-4 text-gray-400">
        <a href="#" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
        <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
        <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-8 mt-12 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
      <p>&copy; 2025 OsteoVision. All rights reserved.</p>
      <p className="mt-4 md:mt-0">Early Detection. Healthier Tomorrows.</p>
    </div>
  </footer>
);

const CanvasBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const frameCount = 300;
    const currentFrame = (index: number) => (
      `/frames/frame_${index.toString().padStart(6, '0')}.jpg`
    );

    const images: HTMLImageElement[] = [];
    const preloadImages = () => {
      for (let i = 0; i < frameCount; i++) {
        images[i] = new Image();
        images[i].src = currentFrame(i);
      }
    };

    const img = new Image();
    img.src = currentFrame(0);
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);
    };

    const updateImage = (index: number) => {
      if (images[index] && images[index].complete) {
        context.drawImage(images[index], 0, 0);
      } else {
        img.src = currentFrame(index);
        context.drawImage(img, 0, 0);
      }
    };

    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
      );

      requestAnimationFrame(() => updateImage(frameIndex));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    preloadImages();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[100vw] min-h-[100vh] -z-10"
    />
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-[#0B0F19]/60 relative font-sans selection:bg-blue-500/30">
      <CanvasBackground />
      <Navbar />
      <Hero />
      <FeatureBar />
      <Intro />
      <HowItWorks />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}
