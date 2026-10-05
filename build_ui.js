const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd(), 'src');
const compDir = path.join(srcDir, 'components');
const hooksDir = path.join(srcDir, 'hooks');

if (!fs.existsSync(compDir)) fs.mkdirSync(compDir, { recursive: true });
if (!fs.existsSync(hooksDir)) fs.mkdirSync(hooksDir, { recursive: true });

const files = {
  "src/index.css": `@import "tailwindcss";

@font-face {
  font-family: 'PP Neue Montreal';
  src: url('https://assets.website-files.com/6009ec8cda7f305645c9d91b/60176f9bb43e36419997ecfe_PPNeueMontreal-Book.otf') format('opentype');
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: 'PP Neue Montreal';
  src: url('https://assets.website-files.com/6009ec8cda7f305645c9d91b/60176f9b39c5673e51a86f5a_PPNeueMontreal-Medium.otf') format('opentype');
  font-weight: 500;
  font-display: swap;
}
@font-face {
  font-family: 'PP Mondwest';
  src: url('/PPMondwest-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

@theme {
  --font-sans: "PP Neue Montreal", sans-serif;
  --font-serif: "PP Mondwest", serif;
}

body {
  background-color: #FFFFFF;
  color: #051A24;
  font-family: 'PP Neue Montreal', sans-serif;
  overflow-x: hidden;
}

.font-mondwest {
  font-family: 'PP Mondwest', serif;
}

@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 30s linear infinite;
}
@media (max-width: 768px) {
  .animate-marquee {
    animation: marquee 10s linear infinite;
  }
}
`,
  "src/hooks/useInViewAnimation.ts": `import { useEffect, useRef, useState } from 'react';

export function useInViewAnimation(options = { threshold: 0.1 }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}
`,
  "src/components/Button.tsx": `import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary';
  className?: string;
}

export const Button = ({ children, variant = 'primary', className = '' }: ButtonProps) => {
  const baseStyle = "rounded-full px-7 py-3 font-medium transition-all text-sm whitespace-nowrap";
  
  const variants = {
    primary: "bg-[#051A24] text-white shadow-[0_1px_2px_0_rgba(5,26,36,0.1),0_4px_4px_0_rgba(5,26,36,0.09),0_9px_6px_0_rgba(5,26,36,0.05),0_17px_7px_0_rgba(5,26,36,0.01),0_26px_7px_0_rgba(5,26,36,0),inset_0_2px_8px_0_rgba(255,255,255,0.5)] hover:scale-105",
    secondary: "bg-white text-[#051A24] shadow-[0_0_0_0.5px_rgba(0,0,0,0.05),0_4px_30px_rgba(0,0,0,0.08)] hover:scale-105",
    tertiary: "bg-white text-[#0D212C] shadow-[0_1px_2px_0_rgba(5,26,36,0.1),0_4px_4px_0_rgba(5,26,36,0.09),inset_0_2px_8px_0_rgba(255,255,255,0.5)] hover:scale-105"
  };

  return (
    <button className={\`\${baseStyle} \${variants[variant]} \${className}\`}>
      {children}
    </button>
  );
};
`,
  "src/components/TestimonialSection.tsx": `import React, { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import { useInViewAnimation } from '../hooks/useInViewAnimation';

export const TestimonialSection = () => {
  const { ref, isInView } = useInViewAnimation();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setOffset(window.scrollY * 0.1);
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={ref} className="py-24 px-6 max-w-2xl mx-auto text-center flex flex-col items-center">
      <div className={\`transition-all \${isInView ? 'animate-fade-in-up' : 'opacity-0'}\`} style={{ animationDelay: '0.1s' }}>
        <Quote className="w-6 h-6 text-slate-900 mb-8 mx-auto" />
      </div>
      <h2 className={\`text-[32px] md:text-[40px] lg:text-[44px] leading-[1.1] text-[#0D212C] tracking-tight mb-8 transition-all \${isInView ? 'animate-fade-in-up' : 'opacity-0'}\`} style={{ animationDelay: '0.2s' }}>
        'I am highly motivated to acquire new skills, apply my academic knowledge, and contribute to <span className="font-mondwest">impactful projects</span>'
      </h2>
      <p className={\`italic text-sm text-[#273C46] mb-12 transition-all \${isInView ? 'animate-fade-in-up' : 'opacity-0'}\`} style={{ animationDelay: '0.3s' }}>
        - Khánh Trần
      </p>
      <div className={\`flex items-center gap-8 text-slate-900 font-medium mb-16 transition-all \${isInView ? 'animate-fade-in-up' : 'opacity-0'}\`} style={{ animationDelay: '0.4s' }}>
        <span className="text-[24px] w-[80px]">FTU</span>
        <span className="text-[24px] w-[83px]">RemoBPO</span>
        <span className="text-[24px] w-[110px]">Google</span>
      </div>
      <div className={\`overflow-hidden rounded-2xl shadow-lg w-full max-w-xs transition-all \${isInView ? 'animate-fade-in-up' : 'opacity-0'}\`} style={{ animationDelay: '0.5s' }}>
        <img 
          src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260330_103804_7aa5494f-4d5b-432e-9dc7-20715275f143.png&w=1280&q=85" 
          alt="Parallax" 
          className="w-full object-cover scale-125"
          style={{ transform: \`translateY(-\${Math.min(offset, 200)}px)\` }}
        />
      </div>
    </section>
  );
};
`,
  "src/components/PricingSection.tsx": `import React from 'react';
import { Button } from './Button';
import { useInViewAnimation } from '../hooks/useInViewAnimation';

export const PricingSection = () => {
  const { ref, isInView } = useInViewAnimation();

  return (
    <section ref={ref} className="w-full py-12 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:justify-end md:max-w-4xl mx-auto">
        <div className={\`bg-[#051A24] rounded-[40px] pl-10 pr-10 md:pr-24 pt-12 pb-10 shadow-inner flex flex-col transition-all \${isInView ? 'animate-fade-in-up' : 'opacity-0'}\`} style={{ animationDelay: '0.1s' }}>
          <h3 className="text-[22px] font-medium text-[#F6FCFF] mb-4">Dedicated Role</h3>
          <p className="text-[#E0EBF0] mb-8 leading-relaxed text-sm">
            A dedicated data analyst & front-end dev. <br/>You work directly with Khánh.
          </p>
          <div className="mt-auto mb-8">
            <span className="text-2xl text-[#F6FCFF] block mb-1">Full-time</span>
            <span className="text-[#E0EBF0] text-sm">Partnership</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <Button variant="secondary">Start a chat</Button>
            <Button variant="tertiary">How it works</Button>
          </div>
        </div>

        <div className={\`bg-white rounded-[40px] pl-10 pr-10 md:pr-24 pt-12 pb-10 shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex flex-col transition-all \${isInView ? 'animate-fade-in-up' : 'opacity-0'}\`} style={{ animationDelay: '0.2s' }}>
          <h3 className="text-[22px] font-medium text-[#0D212C] mb-4">Custom Project</h3>
          <p className="text-[#051A24] mb-8 leading-relaxed text-sm">
            Fixed scope, fixed timeline. <br/>Same dedication, same standards.
          </p>
          <div className="mt-auto mb-8">
            <span className="text-2xl text-[#0D212C] block mb-1">Project-based</span>
            <span className="text-[#051A24] text-sm opacity-70">Flexible</span>
          </div>
          <div className="mt-auto">
            <Button variant="primary">Start a chat</Button>
          </div>
        </div>
      </div>
    </section>
  );
};
`,
  "src/components/TestimonialCarousel.tsx": `import React from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInViewAnimation } from '../hooks/useInViewAnimation';

export const TestimonialCarousel = () => {
  const { ref, isInView } = useInViewAnimation();

  return (
    <section ref={ref} className="w-full py-20 overflow-hidden">
      <div className={\`md:max-w-4xl mx-auto px-6 mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all \${isInView ? 'animate-fade-in-up' : 'opacity-0'}\`} style={{ animationDelay: '0.1s' }}>
        <h2 className="text-[32px] md:text-[40px] lg:text-[44px] text-[#0D212C] tracking-tight">
          What <span className="font-mondwest">builders</span> say
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-black text-black" />)}
          </div>
          <span className="text-[#0D212C] font-medium ml-2">Clutch 5/5</span>
        </div>
      </div>

      <div className={\`w-full overflow-hidden transition-all \${isInView ? 'animate-fade-in-up' : 'opacity-0'}\`} style={{ animationDelay: '0.2s' }}>
        <div className="flex gap-6 px-6 animate-marquee">
          {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((item, i) => (
            <div key={i} className="w-full max-w-[calc(100vw-48px)] sm:w-[427.5px] flex-shrink-0 bg-white rounded-[32px] md:rounded-[40px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] px-6 md:pl-10 md:pr-24 py-8">
              <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6 opacity-20">
                <path d="M13.5 0H0V13.5H8.5C8.5 17.5 5 21 0 21V24C7.5 24 13.5 18 13.5 10.5V0ZM32 0H18.5V13.5H27C27 17.5 23.5 21 18.5 21V24C26 24 32 18 32 10.5V0Z" fill="#0D212C"/>
              </svg>
              <p className="text-base text-[#0D212C] leading-relaxed mb-8">
                "With very little guidance, Khánh delivered work that was consistently spot on. His background in Economics brings a unique analytical rigor to his coding."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                  <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[#0D212C]">Marcus Anderson</h4>
                  <p className="text-xs text-[#051A24]/60">↗ CEO, Data.storage</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center gap-4 mt-12">
        <button className="w-12 h-12 rounded-full border border-[#0D212C]/20 flex items-center justify-center hover:bg-[#0D212C]/5 transition-colors">
          <ChevronLeft className="w-5 h-5 text-[#0D212C]" />
        </button>
        <button className="w-12 h-12 rounded-full border border-[#0D212C]/20 flex items-center justify-center hover:bg-[#0D212C]/5 transition-colors">
          <ChevronRight className="w-5 h-5 text-[#0D212C]" />
        </button>
      </div>
    </section>
  );
};
`,
  "src/components/ProjectsSection.tsx": `import React from 'react';
import { useInViewAnimation } from '../hooks/useInViewAnimation';

const ProjectItem = ({ name, desc, img, delay }: any) => {
  const { ref, isInView } = useInViewAnimation();
  return (
    <div ref={ref} className={\`w-full flex flex-col gap-6 transition-all \${isInView ? 'animate-fade-in-up' : 'opacity-0'}\`} style={{ animationDelay: \`\${delay}s\` }}>
      <div className="ml-10 md:ml-28">
        <h3 className="font-mondwest text-2xl md:text-3xl font-semibold text-[#051A24] mb-2">{name}</h3>
        <p className="text-sm md:text-base text-[#051A24]/70">{desc}</p>
      </div>
      <img src={img} alt={name} className="w-full rounded-2xl shadow-lg object-cover h-[300px] md:h-[500px]" />
    </div>
  );
};

export const ProjectsSection = () => {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-12 flex flex-col gap-16 md:gap-20">
      <ProjectItem 
        name="ZeroCoder Learning Platform" 
        desc="Interactive front-end interface and Firebase backend for FTU students."
        img="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200"
        delay={0.1}
      />
      <ProjectItem 
        name="Middle Income Trap Research" 
        desc="Empirical research pipeline using Cox Proportional Hazards survival model."
        img="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200"
        delay={0.2}
      />
      <ProjectItem 
        name="RemoBPO AI Testing" 
        desc="Evaluated and annotated Large Language Model (LLM) outputs to identify logic errors."
        img="https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif"
        delay={0.3}
      />
    </section>
  );
};
`,
  "src/components/PartnerSection.tsx": `import React from 'react';
import { Button } from './Button';
import { useInViewAnimation } from '../hooks/useInViewAnimation';

export const PartnerSection = () => {
  const { ref, isInView } = useInViewAnimation();

  return (
    <section ref={ref} className="w-full py-12 px-6">
      <div className={\`max-w-7xl mx-auto py-48 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] bg-white border border-gray-50 flex flex-col items-center justify-center transition-all \${isInView ? 'animate-fade-in-up' : 'opacity-0'}\`} style={{ animationDelay: '0.1s' }}>
        <h2 className="font-mondwest text-[48px] md:text-[64px] lg:text-[80px] text-[#0D212C] mb-12 text-center">
          Partner with us
        </h2>
        <Button variant="primary" className="flex items-center gap-3 pr-8">
          <img src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100" alt="Khánh" className="w-7 h-7 rounded-full object-cover -ml-2" />
          Start chat with Khánh
        </Button>
      </div>
    </section>
  );
};
`,
  "src/components/Footer.tsx": `import React from 'react';
import { Button } from './Button';
import { ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full py-12 px-6 max-w-[1200px] mx-auto border-t border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12">
        <div>
          <Button variant="primary">Start a chat</Button>
        </div>
        <div className="flex gap-16 md:gap-24">
          <ArrowUpRight className="text-[#051A24] w-6 h-6 mt-1 hidden md:block" />
          <div className="flex flex-col gap-4">
            <a href="#" className="text-base text-[#051A24] hover:opacity-70 transition-opacity">Services</a>
            <a href="#" className="text-base text-[#051A24] hover:opacity-70 transition-opacity">Work</a>
            <a href="#" className="text-base text-[#051A24] hover:opacity-70 transition-opacity">About</a>
          </div>
          <div className="flex flex-col gap-4">
            <a href="https://github.com/keieszero-2412" target="_blank" rel="noreferrer" className="text-base text-[#051A24] hover:opacity-70 transition-opacity">Github</a>
            <a href="https://www.linkedin.com/in/khanhtran2412/" target="_blank" rel="noreferrer" className="text-base text-[#051A24] hover:opacity-70 transition-opacity">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const CopyrightBar = () => {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 py-6 flex justify-between items-center text-sm text-[#051A24] border-t border-gray-100 mb-20">
      <span>Khánh Trần Studio</span>
      <span>Hanoi, Vietnam</span>
    </div>
  );
};

export const BottomNav = () => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white rounded-full px-8 py-2 shadow-[0_4px_30px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] flex items-center gap-6">
        <span className="font-mondwest text-2xl font-semibold text-[#051A24]">K</span>
        <Button variant="primary" className="py-2.5">Start a chat</Button>
      </div>
    </div>
  );
};
`,
  "src/App.tsx": `import React from 'react';
import { Button } from './components/Button';
import { TestimonialSection } from './components/TestimonialSection';
import { PricingSection } from './components/PricingSection';
import { TestimonialCarousel } from './components/TestimonialCarousel';
import { ProjectsSection } from './components/ProjectsSection';
import { PartnerSection } from './components/PartnerSection';
import { Footer, CopyrightBar, BottomNav } from './components/Footer';
import { useInViewAnimation } from './hooks/useInViewAnimation';

const HeroSection = () => {
  const { ref, isInView } = useInViewAnimation();

  return (
    <section ref={ref} className="w-full flex flex-col items-center text-center px-6 pt-12 md:pt-16 max-w-[440px] mx-auto">
      <h1 className={\`font-mondwest text-[32px] md:text-[40px] lg:text-[44px] font-semibold text-[#051A24] tracking-tight mb-4 transition-all \${isInView ? 'animate-fade-in-up' : 'opacity-0'}\`} style={{ animationDelay: '0.1s' }}>
        Khánh Trần
      </h1>
      
      <p className={\`font-mono text-xs md:text-sm text-[#051A24] mb-2 transition-all \${isInView ? 'animate-fade-in-up' : 'opacity-0'}\`} style={{ animationDelay: '0.2s' }}>
        The creative portfolio of Khánh Trần
      </p>
      
      <h2 className={\`text-[32px] md:text-[40px] lg:text-[44px] leading-[1.1] text-[#0D212C] tracking-tight whitespace-nowrap transition-all \${isInView ? 'animate-fade-in-up' : 'opacity-0'}\`} style={{ animationDelay: '0.3s' }}>
        Build the <span className="font-mondwest">next wave,</span><br/>
        <span className="font-mondwest">the bold way.</span>
      </h2>
      
      <div className="flex flex-col gap-6 text-sm md:text-base text-[#051A24] leading-relaxed mt-5 md:mt-6 text-left">
        <p className={\`transition-all \${isInView ? 'animate-fade-in-up' : 'opacity-0'}\`} style={{ animationDelay: '0.4s' }}>
          I am an undergraduate student at Foreign Trade University with a strong interest in Data Analysis, AI and Front-end Development.
        </p>
        <p className={\`transition-all \${isInView ? 'animate-fade-in-up' : 'opacity-0'}\`} style={{ animationDelay: '0.5s' }}>
          I spent time at RemoBPO as an AI Tester, evaluating and annotating Large Language Model (LLM) outputs to identify logic errors and edge cases.
        </p>
        <p className={\`transition-all \${isInView ? 'animate-fade-in-up' : 'opacity-0'}\`} style={{ animationDelay: '0.6s' }}>
          Projects start at limitless potential.
        </p>
      </div>

      <div className={\`flex flex-col sm:flex-row gap-3 md:gap-4 mt-5 md:mt-6 transition-all \${isInView ? 'animate-fade-in-up' : 'opacity-0'}\`} style={{ animationDelay: '0.7s' }}>
        <Button variant="primary">Start a chat</Button>
        <Button variant="secondary">View projects</Button>
      </div>
    </section>
  );
};

const InfiniteMarquee = () => {
  const gifs = [
    "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
    "https://motionsites.ai/assets/hero-portfolio-cosmic-preview-BpvWJ3Nc.gif",
    "https://motionsites.ai/assets/hero-velorah-preview-CJNTtbpd.gif",
    "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
    "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
    "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
    "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
    "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif"
  ];
  const allGifs = [...gifs, ...gifs]; // 16 items

  return (
    <section className="w-full mt-16 md:mt-20 mb-16 overflow-hidden">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {allGifs.map((src, i) => (
          <img key={i} src={src} alt="Showcase" className="h-[280px] md:h-[500px] w-auto object-cover mx-3 rounded-2xl shadow-lg" />
        ))}
      </div>
    </section>
  );
};

function App() {
  return (
    <div className="w-full min-h-screen bg-white">
      <HeroSection />
      <InfiniteMarquee />
      <TestimonialSection />
      <PricingSection />
      <TestimonialCarousel />
      <ProjectsSection />
      <PartnerSection />
      <Footer />
      <CopyrightBar />
      <BottomNav />
    </div>
  );
}

export default App;
`
};

for (const [file, content] of Object.entries(files)) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}
console.log("All UI components built successfully!");
