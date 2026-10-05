import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  ArrowUpRight,
} from 'lucide-react'
import * as THREE from 'three'

const chatUrl = 'mailto:keieszero2412@gmail.com'

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

const periodicRows: Array<Array<string | null>> = [
  ['H', ...Array(16).fill(null), 'He'],
  ['Li', 'Be', ...Array(10).fill(null), 'B', 'C', 'N', 'O', 'F', 'Ne'],
  ['Na', 'Mg', ...Array(10).fill(null), 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'],
  ['K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr'],
  ['Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe'],
  ['Cs', 'Ba', 'La', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn'],
  ['Fr', 'Ra', 'Ac', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'],
  [null, null, null, 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu'],
  [null, null, null, 'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr'],
]

const periodicElements = periodicRows.flatMap((row, rowIndex) =>
  row.flatMap((symbol, columnIndex) => symbol ? [{ symbol, row: rowIndex + 1, column: columnIndex + 1 }] : []),
)

const ThreeParticleField = () => {
  const pointsRef = useRef<THREE.Points>(null)
  const meshRef = useRef<THREE.Group>(null)
  const particles = Array.from({ length: 110 }, (_, index) => {
    const angle = index * 2.39996
    const radius = 1.5 + (index % 11) * 0.65
    return [Math.cos(angle) * radius, ((index * 17) % 20) - 10, Math.sin(angle) * radius] as const
  })
  const positions = new Float32Array(particles.flat())

  useFrame(({ clock, pointer }) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = clock.elapsedTime * 0.025 + pointer.x * 0.08
    pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.15) * 0.04 + pointer.y * 0.04
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.elapsedTime * 0.08 + pointer.y * 0.12
      meshRef.current.rotation.y = clock.elapsedTime * 0.12 + pointer.x * 0.16
      meshRef.current.position.y = Math.sin(clock.elapsedTime * 0.35) * 0.18
    }
  })

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#73e9f3" size={0.07} sizeAttenuation transparent opacity={0.86} />
      </points>
      <group ref={meshRef} position={[2.5, 0.4, -1]}>
        <mesh>
          <icosahedronGeometry args={[1.35, 1]} />
          <meshBasicMaterial color="#328aa8" wireframe transparent opacity={0.28} />
        </mesh>
        <mesh scale={0.68}>
          <icosahedronGeometry args={[1.35, 1]} />
          <meshBasicMaterial color="#73e9f3" wireframe transparent opacity={0.16} />
        </mesh>
      </group>
    </>
  )
}

const ThreeSceneBackground = () => (
  <div className="three-scene-background absolute inset-0 opacity-70" aria-hidden="true">
    <Canvas
      camera={{ position: [0, 0, 8], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      onCreated={({ scene }) => {
        scene.background = null
      }}
      style={{ pointerEvents: 'none' }}
    >
      <ThreeParticleField />
    </Canvas>
  </div>
)

const PeriodicTableBackground = () => {
  const [assembled, setAssembled] = useState(false)
  useEffect(() => {
    let timer = 0
    const animate = () => {
      setAssembled(false)
      timer = window.setTimeout(() => setAssembled(true), 3500)
    }
    animate()
    const loop = window.setInterval(animate, 18000)
    return () => {
      window.clearTimeout(timer)
      window.clearInterval(loop)
    }
  }, [])

  return (
    <div className="periodic-background" aria-hidden="true">
      <ThreeSceneBackground />
      <div className={`periodic-table ${assembled ? 'periodic-table-assembled' : ''}`}>
        {periodicElements.map((element, index) => (
          <span
            key={element.symbol}
            className="periodic-element"
            style={{
              gridColumn: element.column,
              gridRow: element.row,
              '--scatter-x': `${((index * 47) % 120) - 60}px`,
              '--scatter-y': `${((index * 71) % 100) - 50}px`,
              '--scatter-rotate': `${((index * 29) % 24) - 12}deg`,
              animationDelay: `${(index % 12) * 0.08}s`,
            } as React.CSSProperties}
          >
            <b>{element.symbol}</b>
            <small>{index + 1}</small>
          </span>
        ))}
      </div>
    </div>
  )
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
      <section id="about" ref={ref} className="mx-auto max-w-6xl px-6 pt-12 md:pt-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex max-w-[440px] flex-col">
            <p {...fade(isVisible, 0.1)} className="font-display mb-4 text-[32px] font-semibold tracking-tight text-white md:text-[40px] lg:text-[44px]">Khánh Trần</p>
            <p {...fade(isVisible, 0.2)} className="font-mono text-xs text-[#BDEFF5] md:text-sm">Data Analysis, AI &amp; Front-end Development</p>
          </div>
          <span className="hidden md:block" aria-hidden="true" />
        </div>
        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col">
            <h1 {...fade(isVisible, 0.3)} className="max-w-full break-words text-[32px] leading-[1.1] tracking-tight text-white md:text-[40px] lg:text-[44px]">
              Architecting solutions through <span className="font-display">data, AI,</span><br />
              and <span className="font-display">web interfaces.</span>
            </h1>
            <div {...fade(isVisible, 0.5)} className="mt-8 flex flex-col gap-3 sm:flex-row md:gap-4">
              <Button variant="secondary" href="#projects">View projects</Button>
            </div>
          </div>
          <div>
            <div {...fade(isVisible, 0.4)} className="flex flex-col gap-6 text-sm leading-relaxed text-[#E0EBF0] md:text-base">
              <p>I am an undergraduate student at Foreign Trade University with a strong interest in Data Analysis, AI and Front-end Development.</p>
              <p>I am highly motivated to acquire new skills, apply my academic knowledge in practical settings, and contribute to impactful projects.</p>
              <p>Currently based in Hanoi, Vietnam.</p>
            </div>
            <nav {...fade(isVisible, 0.5)} aria-label="Contact information" className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#BDEFF5]">
              <a href="mailto:keieszero2412@gmail.com">keieszero2412@gmail.com</a>
              <a href="https://github.com/keieszero-2412" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://www.linkedin.com/in/khanhtran2412/" target="_blank" rel="noreferrer">LinkedIn</a>
            </nav>
          </div>
        </div>
      </section>
    </>
  )
}

const PricingSection = () => {
  const { ref, isVisible } = useInViewAnimation<HTMLElement>()
  return (
    <section id="services" ref={ref} className="w-full px-6 py-12">
      <div className="mx-auto grid max-w-4xl items-stretch gap-8 md:grid-cols-[repeat(2,minmax(0,1fr))]">
        <div {...fade(isVisible, 0.1)} className="neon-card neon-card-accent h-full min-w-0 px-8 py-8 text-[#F6FCFF] md:px-10 md:py-9">
          <p className="card-kicker">Education</p>
          <h2 className="mt-3 text-[22px] font-medium">Foreign Trade University</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#C7E0E6]">International Economics</p>
          <p className="mt-8 text-sm font-medium text-[#73e9f3]">09/2024 - 05/2028</p>
        </div>
        <div {...fade(isVisible, 0.2)} className="neon-card neon-card-contrast h-full min-w-0 px-8 py-8 text-[#F6FCFF] md:px-10 md:py-9">
          <p className="card-kicker">Professional Experience</p>
          <div className="mt-5 space-y-6 text-sm leading-relaxed">
            <div>
              <p className="font-medium">IT Support · NAP CARE</p>
              <p className="text-[#9bc2ca]">Hanoi, Vietnam</p>
              <p className="mt-2 text-[#C7E0E6]">Installed and troubleshot computers, software, and printers.</p>
              <p className="mt-2 font-medium text-[#73e9f3]">12/2023 - 08/2024</p>
            </div>
            <div>
              <p className="font-medium">Academic Problem-Solving Consultant · NAP CARE</p>
              <p className="mt-2 text-[#C7E0E6]">Advised students and supported them in solving academic exercises.</p>
              <p className="mt-2 font-medium text-[#73e9f3]">12/2023 - 08/2024</p>
            </div>
            <div>
              <p className="font-medium">AI Tester · RemoBPO</p>
              <p className="mt-2 text-[#C7E0E6]">Evaluating and annotating LLM outputs.</p>
              <p className="mt-2 font-medium text-[#73e9f3]">04/2026 - 08/2026</p>
            </div>
          </div>
          <div className="mt-8"><Button variant="tertiary" href="https://www.linkedin.com/in/khanhtran2412/">View LinkedIn</Button></div>
        </div>
      </div>
    </section>
  )
}

const skills = [
  ['Python', 'Programming language', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'],
  ['JavaScript', 'Programming language', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'],
  ['SQL', 'Data & databases', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg'],
  ['R', 'Statistical computing', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg'],
  ['React', 'Front-end framework', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'],
  ['Node.js', 'Backend runtime', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'],
  ['Express', 'Web framework', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg'],
  ['Git', 'Development tool', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg'],
  ['Docker', 'Development tool', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg'],
  ['Firebase', 'Development tool', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg'],
  ['Supabase', 'Development tool', 'https://cdn.simpleicons.org/supabase/3ECF8E'],
  ['REST APIs', 'Integration', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg'],
  ['Data Analysis', 'Core competency', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg'],
  ['AI Testing', 'Core competency', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800'],
  ['Cybersecurity', 'Core competency', 'https://cdn.simpleicons.org/owasp/000000'],
]

const SkillsMarquee = () => {
  const { ref, isVisible } = useInViewAnimation<HTMLElement>()

  return (
    <section id="skills" ref={ref} className="w-full px-6 py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 {...fade(isVisible, 0.05)} className={`${fade(isVisible, 0.05).className} text-[32px] leading-[1.1] tracking-tight text-white md:text-[44px]`}>Technical <span className="font-display">skills</span></h2>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {skills.map(([name, category, image], index) => {
            const animation = fade(isVisible, 0.1 + index * 0.06)
            return (
              <article
                key={name}
                {...animation}
                className={`${animation.className} skill-card relative aspect-square overflow-hidden rounded-2xl shadow-lg`}
              >
                <div className="absolute inset-0 bg-[#0b2b3a]" />
                <img src={image} alt={`${name} icon`} className="skill-card-icon absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 object-contain md:h-24 md:w-24" />
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#051A24] to-transparent" />
                <div className="relative flex h-full flex-col justify-end p-4 text-white">
                  <p className="text-[10px] uppercase tracking-wider text-[#E0EBF0]">{category}</p>
                  <h3 className="mt-1 text-lg font-medium md:text-xl">{name}</h3>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const ProjectsSection = () => {
  const { ref, isVisible } = useInViewAnimation<HTMLElement>()
  const academicProjects = [
    {
      name: 'DeepMedSP AI',
      description: 'An AI-agent tool supporting antibiotic prescription and monitoring for patients treated for bacterial infections, developed with Xanh Pon General Hospital and Hanoi University of Pharmacy.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200',
      link: 'https://vnexpress.net/khoa-hoc-cong-nghe/cuoc-thi-sang-kien-khoa-hoc/san-pham/cong-cu-ho-tro-ke-don-va-giam-sat-su-dung-khang-sinh-tren-benh-nhan-dieu-tri-nhiem-khuan-bang-ai-agent-deepmedsp-ai-2118',
    },
    {
      name: 'Middle Income Trap Research',
      description: 'Cox Proportional Hazards survival analysis of the factors that help countries move through middle-income transitions from 2000 to 2026.',
      image: '/middle-income-trap-research.png',
      link: 'https://github.com/keieszero-2412/middle-income-trap-research',
    },
    {
      name: 'Pharma Sales Data Analysis',
      description: 'Python analysis of pharmaceutical sales by category, top-selling drugs, and seasonal trends for respiratory medication.',
      image: '',
      link: 'https://github.com/keieszero-2412/pharma-sales-data-analysis',
    },
  ]
  const personalProjects = [
    {
      name: 'ZeroCoder Learning Platform',
      description: 'A programming platform for FTU students with an in-browser Python IDE, autograding, AI hints, and Firebase account management.',
      image: '/zerocoder-login.png',
      link: 'https://github.com/keieszero-2412/zero_coder',
    },
    {
      name: 'SportSpace',
      description: 'A sports venue booking, facility management, and team matching application built with React, Firebase, and Supabase.',
      image: '/sportspace.png',
      link: 'https://github.com/keieszero-2412/sportspace',
    },
    {
      name: 'Real-time Leaderboard Service',
      description: 'A FastAPI and Redis backend with JWT authentication, score submission, real-time rankings, and player reports.',
      image: '',
      link: 'https://github.com/keieszero-2412/Real-time-Leaderboard-Service-Backend',
    },
    {
      name: 'Cybersecurity Assessment & Monitoring',
      description: 'Cybersecurity Project Lead responsible for security assessment, vulnerability reviews, access-control planning, monitoring workflows, stakeholder coordination, and remediation documentation.',
      image: '',
      link: 'mailto:keieszero2412@gmail.com?subject=Cybersecurity%20Project',
    },
  ]
  const renderProject = (project: (typeof academicProjects)[number]) => {
    const { ref, isVisible } = useInViewAnimation<HTMLDivElement>()
    return (
      <article ref={ref} key={project.name} {...fade(isVisible)} className={`neon-card px-3 py-4 ${project.name === 'DeepMedSP AI' || project.name === 'Middle Income Trap Research' || project.name === 'Pharma Sales Data Analysis' ? 'neon-card-accent' : 'neon-card-contrast'}`}>
        {project.image && <img className={`h-44 w-full rounded-2xl shadow-lg ${project.name === 'ZeroCoder Learning Platform' || project.name === 'Middle Income Trap Research' ? 'bg-[#151820] object-contain p-3' : 'object-cover'}`} alt={project.name} src={project.image} />}
        <h3 className="mt-5 font-display text-xl font-semibold text-white">{project.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#C7E0E6]">{project.description}</p>
        <a className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#73e9f3]" href={project.link} target="_blank" rel="noreferrer">View project <ArrowUpRight className="h-4 w-4" /></a>
      </article>
    )
  }
  return (
    <section id="projects" ref={ref} className="mx-auto max-w-[1200px] px-6 py-12">
      <h2 {...fade(isVisible, 0.05)} className="text-[32px] leading-[1.1] tracking-tight text-white md:text-[44px]"><span className="font-display">Projects</span></h2>
      <div className="mt-10 grid gap-10 md:grid-cols-[repeat(2,minmax(0,1fr))]">
        <div className="min-w-0">
          <h3 {...fade(isVisible, 0.12)} className="project-column-title project-column-title-academic mb-5 text-xl font-medium">Academic Projects</h3>
          <div className="space-y-6">{academicProjects.map(renderProject)}</div>
        </div>
        <div className="min-w-0">
          <h3 {...fade(isVisible, 0.18)} className="project-column-title project-column-title-personal mb-5 text-xl font-medium">Personal Projects</h3>
          <div className="space-y-6">{personalProjects.map(renderProject)}</div>
        </div>
      </div>
    </section>
  )
}

const CertificationsSection = () => {
  const { ref, isVisible } = useInViewAnimation<HTMLElement>()
  const certifications = [
    ['IELTS 7.5', 'British Council', '10/2023'],
    ['Foundations: Data, Data, Everywhere', 'Google', '08/2026'],
    ['Foundations of Cybersecurity', 'Google', '08/2026'],
    ['Top 6 · SEA Quantathon', 'Competition achievement', '2026'],
    ['Top 25 · Naver AI Hackathon', 'Competition achievement', '2025'],
  ]
  const awards = [
    ['A Scholarship · Foreign Trade University', 'Academic achievement', ''],
    ['First Prize · Provincial English Competition', 'Grade 9', ''],
    ['Second Prize · Provincial English Competition', 'Grade 11', ''],
    ['Second Prize · Provincial Informatics Competition', 'Grade 11', ''],
    ['Third Prize · Provincial Chemistry Competition', 'Grade 12', ''],
    ['Third Prize · Provincial Mathematics Competition', 'Grade 10', ''],
  ]
  const renderItem = ([name, issuer, date]: string[], index: number) => (
    <article {...fade(isVisible, 0.12 + index * 0.06)} key={`${name}-${issuer}-${date}`} className={`neon-card px-4 py-5 ${issuer === 'Academic achievement' || issuer.startsWith('Grade') ? 'neon-card-accent' : 'neon-card-contrast'}`}>
      <p className="font-display text-xl text-white">{name}</p>
      <p className="mt-3 text-sm text-[#C7E0E6]">{issuer}</p>
      {date && <p className="mt-2 text-sm font-medium text-[#73e9f3]">{date}</p>}
    </article>
  )
  return (
    <section id="certifications" ref={ref} className="mx-auto max-w-[1200px] px-6 py-12">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h2 {...fade(isVisible, 0.05)} className="text-[32px] leading-[1.1] tracking-tight text-white md:text-[44px]"><span className="font-display">Certifications</span></h2>
          <div className="mt-10 space-y-4">{certifications.map(renderItem)}</div>
        </div>
        <div>
          <h2 {...fade(isVisible, 0.08)} className="text-[32px] leading-[1.1] tracking-tight text-white md:text-[44px]"><span className="font-display">Awards</span></h2>
          <div className="mt-10 space-y-4">{awards.map(renderItem)}</div>
        </div>
      </div>
    </section>
  )
}

const Footer = () => <><footer className="animate-fade-in-up mx-auto flex max-w-[1200px] justify-end gap-10 px-6 py-12" style={{ animationDelay: '.2s' }}><div className="flex gap-10"><ArrowUpRight /><div className="flex flex-col gap-3 text-base text-[#051A24]"><a href="#skills">Skills</a><a href="#projects">Projects</a><a href="#about">About</a></div><div className="flex flex-col gap-3 text-base text-[#051A24]"><a href="mailto:keieszero2412@gmail.com">Email</a><a href="https://www.linkedin.com/in/khanhtran2412/" target="_blank" rel="noreferrer">LinkedIn</a></div></div></footer><div className="animate-fade-in-up mx-auto flex max-w-[1200px] justify-between px-6 py-4 text-sm text-[#051A24]" style={{ animationDelay: '.35s' }}><span>Khánh Trần</span><span>Hanoi, Vietnam</span></div></>

export default function App() {
  return <main><PeriodicTableBackground /><div className="periodic-content relative z-10"><Hero /><PricingSection /><ProjectsSection /><SkillsMarquee /><CertificationsSection /><Footer /></div></main>
}
