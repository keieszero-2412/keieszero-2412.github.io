import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Quote,
  Star,
} from 'lucide-react'

const chatUrl = 'mailto:keieszero2412@gmail.com'
const marqueeImages = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-portfolio-cosmic-preview-BpvWJ3Nc.gif',
  'https://motionsites.ai/assets/hero-velorah-preview-CJNTtbpd.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
]

const useInViewAnimation = <T extends HTMLElement>() => {
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

const fade = (visible: boolean, delay = 0) => ({
  className: visible ? 'animate-fade-in-up' : 'opacity-0',
  style: { animationDelay: `${delay}s` },
})

type ButtonProps = {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'tertiary'
  href?: string
  className?: string
}

const Button = ({ children, variant = 'primary', href = chatUrl, className = '' }: ButtonProps) => (
  <a
    className={`inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5 ${variant === 'primary' ? 'bg-[#051A24] text-white shadow-primary' : variant === 'secondary' ? 'bg-white text-[#051A24] shadow-secondary' : 'bg-white text-[#051A24] shadow-tertiary'} ${className}`}
    href={href}
  >
    {children}
  </a>
)

const Hero = () => {
  const { ref, isVisible } = useInViewAnimation<HTMLElement>()
  return (
    <>
      <section id="about" ref={ref} className="mx-auto flex max-w-[440px] flex-col px-6 pt-12 md:pt-16">
        <p {...fade(isVisible, 0.1)} className="font-display mb-4 text-[32px] font-semibold tracking-tight text-[#051A24] md:text-[40px] lg:text-[44px]">Khánh Trần</p>
        <p {...fade(isVisible, 0.2)} className="font-mono text-xs text-[#051A24] md:text-sm">Data Analysis, AI &amp; Front-end Development</p>
        <h1 {...fade(isVisible, 0.3)} className="mt-5 whitespace-nowrap text-[32px] leading-[1.1] tracking-tight text-[#0D212C] md:text-[40px] lg:text-[44px]">
          Building with <span className="font-display">data, AI,</span><br />
          and the <span className="font-display">web.</span>
        </h1>
        <div {...fade(isVisible, 0.4)} className="mt-5 flex flex-col gap-6 text-sm leading-relaxed text-[#051A24] md:mt-6 md:text-base">
          <p>I am an undergraduate student at Foreign Trade University with a strong interest in Data Analysis, AI and Front-end Development.</p>
          <p>I am highly motivated to acquire new skills, apply my academic knowledge in practical settings, and contribute to impactful projects.</p>
          <p>Currently based in Hanoi, Vietnam.</p>
        </div>
        <div {...fade(isVisible, 0.5)} className="mt-5 flex flex-col gap-3 sm:flex-row md:mt-6 md:gap-4">
          <Button>Contact me</Button>
          <Button variant="secondary" href="#projects">View projects</Button>
        </div>
      </section>
      <Marquee />
    </>
  )
}

const Marquee = () => (
  <div className="mt-16 mb-16 w-full overflow-hidden md:mt-20">
    <div className="animate-marquee flex w-max">
      {[...marqueeImages, ...marqueeImages].map((src, index) => (
        <img key={`${src}-${index}`} src={src} alt="" className="mx-3 h-[280px] w-auto rounded-2xl object-cover shadow-lg md:h-[500px]" />
      ))}
    </div>
  </div>
)

const TestimonialSection = () => {
  const { ref, isVisible } = useInViewAnimation<HTMLElement>()
  const parallaxRef = useRef<HTMLImageElement>(null)
  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (parallaxRef.current) {
          const rect = parallaxRef.current.getBoundingClientRect()
          const offset = Math.max(-200, Math.min(200, (window.innerHeight / 2 - rect.top) * 0.12))
          parallaxRef.current.style.transform = `translateY(${offset}px)`
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])
  return (
    <section ref={ref} className="mx-auto flex max-w-2xl flex-col items-center px-6 py-12 text-center">
      <Quote {...fade(isVisible, 0.1)} className="h-6 w-6 text-slate-900" />
      <p {...fade(isVisible, 0.2)} className="mt-6 text-[32px] leading-[1.1] tracking-tight text-[#0D212C] md:text-[40px] lg:text-[44px]">Learning today to build <span className="font-display">impactful solutions</span> tomorrow.</p>
      <p {...fade(isVisible, 0.3)} className="mt-5 text-sm italic text-[#273C46]">Khánh Trần · International Economics @ FTU Hanoi</p>
      <div {...fade(isVisible, 0.4)} className="mt-10 flex items-center gap-7 text-2xl font-medium text-slate-900">
        <span className="w-20">Python</span><span className="w-[83px]">React</span><span className="w-[110px]">SQL</span>
      </div>
      <img ref={parallaxRef} {...fade(isVisible, 0.5)} className="mt-12 w-full max-w-xs rounded-2xl shadow-lg" src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260330_103804_7aa5494f-4d5b-432e-9dc7-20715275f143.png&w=1280&q=85" alt="Chris Halaska" />
    </section>
  )
}

const PricingSection = () => {
  const { ref, isVisible } = useInViewAnimation<HTMLElement>()
  return (
    <section id="services" ref={ref} className="w-full px-6 py-12">
      <div className="mx-auto grid max-w-4xl gap-8 md:justify-end md:grid-cols-2">
        <div {...fade(isVisible, 0.1)} className="rounded-[40px] bg-[#051A24] px-10 pt-3 pb-10 text-[#F6FCFF] shadow-inset-dark md:pr-24">
          <h2 className="mt-4 text-[22px] font-medium">Education</h2>
          <p className="mt-4 text-sm leading-relaxed text-[#E0EBF0]">Foreign Trade University<br />International Economics</p>
          <p className="mt-8 text-2xl">09/2024</p><p className="text-sm text-[#E0EBF0]">05/2028</p>
          <div className="mt-8 flex flex-wrap gap-3"><Button>Contact me</Button></div>
        </div>
        <div {...fade(isVisible, 0.2)} className="rounded-[40px] bg-white px-10 pt-3 pb-10 text-[#0D212C] shadow-card md:pr-24">
          <h2 className="mt-4 text-[22px] font-medium">Professional Experience</h2>
          <p className="mt-4 text-sm leading-relaxed">AI Tester · RemoBPO<br />Evaluating and annotating LLM outputs.</p>
          <p className="mt-8 text-2xl">04/2026</p><p className="text-sm">08/2026</p>
          <div className="mt-8"><Button variant="tertiary" href="https://www.linkedin.com/in/khanhtran2412/">View LinkedIn</Button></div>
        </div>
      </div>
    </section>
  )
}

type Testimonial = { name: string; role: string; company: string; quote: string; avatar: string }
const testimonials: Testimonial[] = [
  { name: 'Programming Languages', role: 'Python · JavaScript', company: 'SQL · R', quote: 'Building practical tools and research workflows with a focus on clarity and reliable results.', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&fit=crop&w=120&h=120' },
  { name: 'Frameworks & Libraries', role: 'React · Node.js', company: 'Express', quote: 'Creating responsive front-end experiences and connecting them to robust backend services.', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&fit=crop&w=120&h=120' },
  { name: 'Tools & Technologies', role: 'Git · Docker', company: 'SQL · REST APIs', quote: 'Comfortable working across development tools, databases, APIs, and deployment workflows.', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&fit=crop&w=120&h=120' },
  { name: 'Core Competencies', role: 'Data Analysis', company: 'Problem Solving', quote: 'Curious, collaborative, and motivated to turn complex questions into useful outcomes.', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&fit=crop&w=120&h=120' },
  { name: 'AI Testing', role: 'LLM evaluation', company: 'RemoBPO', quote: 'Evaluating model outputs, identifying edge cases, and providing structured feedback for AI training.', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&fit=crop&w=120&h=120' },
]

const TestimonialCarousel = () => {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused) return
    const timer = window.setInterval(() => setIndex((current) => current + 1), 3000)
    return () => window.clearInterval(timer)
  }, [paused])
  const cards = [...testimonials, ...testimonials, ...testimonials]
  return (
    <section className="w-full overflow-hidden py-20">
      <div className="mx-auto flex max-w-4xl items-end justify-between px-6">
        <h2 className="text-[32px] leading-[1.1] tracking-tight text-[#0D212C]">Technical <span className="font-display">skills</span></h2>
        <div className="hidden items-center gap-2 text-sm md:flex">{[1, 2, 3, 4, 5].map((star) => <Star key={star} className="h-5 w-5 fill-black" />)}<span className="ml-1">Clutch 5/5</span></div>
      </div>
      <div className="relative mt-10" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className="flex gap-6 transition-transform duration-700 ease-in-out" style={{ transform: `translateX(calc(-${index * 451.5}px + max(24px, (100vw - 1200px) / 2)))` }}>
          {cards.map((item, cardIndex) => <article key={`${item.name}-${cardIndex}`} className="w-[calc(100vw-48px)] shrink-0 rounded-[32px] bg-white px-6 py-8 shadow-card md:w-[427.5px] md:rounded-[40px] md:pl-10 md:pr-24">
            <Quote className="h-7 w-7 text-[#051A24]" />
            <p className="mt-6 text-base leading-relaxed text-[#0D212C]">{item.quote}</p>
            <div className="mt-8 flex items-center gap-3"><img className="h-12 w-12 rounded-full object-cover" src={item.avatar} alt="" /><div><p className="text-sm font-semibold">{item.name}</p><p className="text-xs text-[#273C46]">→ {item.role}, {item.company}</p></div></div>
          </article>)}
        </div>
        <div className="mx-auto mt-8 flex max-w-4xl gap-3 px-6"><button aria-label="Previous testimonial" onClick={() => setIndex((current) => Math.max(0, current - 1))} className="rounded-full border border-[#0D212C]/20 p-3"><ChevronLeft /></button><button aria-label="Next testimonial" onClick={() => setIndex((current) => current + 1)} className="rounded-full border border-[#0D212C]/20 p-3"><ChevronRight /></button></div>
      </div>
    </section>
  )
}

const ProjectsSection = () => {
  const projects = [
    ['ZeroCoder Learning Platform', 'An online platform for Foreign Trade University students to review and prepare for programming courses.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200'],
    ['Middle Income Trap Research', 'An empirical Cox Proportional Hazards survival model studying middle-income transitions.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200'],
  ]
  return <section id="projects" className="mx-auto max-w-[1200px] px-6 py-12">{projects.map(([name, description, image]) => {
    const { ref, isVisible } = useInViewAnimation<HTMLDivElement>()
    return <div ref={ref} key={name} {...fade(isVisible)} className="mb-16 last:mb-0 md:mb-20"><div className="ml-20 md:ml-28"><h3 className="font-display text-2xl font-semibold text-[#051A24] md:text-3xl">{name}</h3><p className="mt-2 text-sm text-[#051A24]/70 md:text-base">{description}</p></div><img className="mt-6 w-full rounded-2xl object-cover shadow-lg" src={image} alt={name} /></div>
  })}</section>
}

const PartnerSection = () => {
  const [trail, setTrail] = useState<{ id: number; src: string; x: number; y: number; rotate: number }[]>([])
  const lastSpawn = useRef(0)
  const nextId = useRef(0)
  const spawn = (event: React.MouseEvent<HTMLDivElement>) => {
    const now = performance.now()
    if (now - lastSpawn.current < 80) return
    lastSpawn.current = now
    const rect = event.currentTarget.getBoundingClientRect()
    const item = { id: nextId.current++, src: marqueeImages[Math.floor(Math.random() * marqueeImages.length)], x: event.clientX - rect.left, y: event.clientY - rect.top, rotate: Math.random() * 20 - 10 }
    setTrail((current) => [...current.slice(-12), item])
    window.setTimeout(() => setTrail((current) => current.filter((entry) => entry.id !== item.id)), 1000)
  }
  return <section className="w-full px-6 py-12"><div onMouseMove={spawn} className="relative mx-auto flex max-w-7xl flex-col items-center overflow-hidden rounded-[40px] bg-white py-48 shadow-card">{trail.map((item) => <img key={item.id} src={item.src} alt="" className="pointer-events-none absolute z-0 h-28 w-24 rounded-xl object-cover animate-trail" style={{ left: item.x, top: item.y, transform: `translate(-50%, -50%) rotate(${item.rotate}deg)` }} />)}<h2 className="relative z-10 mb-12 font-display text-[48px] text-[#0D212C] md:text-[64px] lg:text-[80px]">Let&apos;s connect</h2><Button className="relative z-10 gap-3 pl-2"><img className="h-10 w-10 rounded-full object-cover" src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&fit=crop&w=80&h=80" alt="" />Email Khánh</Button></div></section>
}

const Footer = () => <><footer className="mx-auto flex max-w-[1200px] flex-col gap-10 px-6 py-12 md:flex-row md:items-start md:justify-between"><Button>Contact me</Button><div className="flex gap-10"><ArrowUpRight /><div className="flex flex-col gap-3 text-base text-[#051A24]"><a href="#services">Skills</a><a href="#projects">Projects</a><a href="#about">About</a></div><div className="flex flex-col gap-3 text-base text-[#051A24]"><a href="mailto:keieszero2412@gmail.com">Email</a><a href="https://www.linkedin.com/in/khanhtran2412/" target="_blank" rel="noreferrer">LinkedIn</a></div></div></footer><div className="mx-auto flex max-w-[1200px] justify-between px-6 py-4 text-sm text-[#051A24]"><span>Khánh Trần</span><span>Hanoi, Vietnam</span></div></>

const BottomNav = () => <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-5 whitespace-nowrap rounded-full bg-white px-8 py-2 shadow-primary"><span className="font-display text-2xl font-semibold text-[#051A24]">K</span><Button>Contact me</Button></div>

export default function App() {
  return <main><Hero /><TestimonialSection /><PricingSection /><TestimonialCarousel /><ProjectsSection /><PartnerSection /><Footer /><BottomNav /></main>
}
