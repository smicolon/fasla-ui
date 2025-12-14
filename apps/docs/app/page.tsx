"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

// Animated counter for stats
function AnimatedNumber({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * value))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [value, duration])

  return <span>{count}+</span>
}

// Floating particle effect
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary/20 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  )
}

// Component card with hover effects
function FeatureCard({
  title,
  description,
  icon,
  delay,
}: {
  title: string
  description: string
  icon: React.ReactNode
  delay: number
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
        <h3 className="mb-2 font-semibold text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

// Showcase card with hover effects
function ShowcaseCard({
  title,
  description,
  gradient,
  size = "default",
  delay,
  children,
}: {
  title: string
  description?: string
  gradient: string
  size?: "default" | "tall" | "wide" | "large"
  delay: number
  children?: React.ReactNode
}) {
  const sizeClasses = {
    default: "col-span-1 row-span-1 aspect-square md:aspect-auto md:h-64",
    tall: "col-span-1 row-span-2 h-64 md:h-auto",
    wide: "col-span-1 md:col-span-2 row-span-1 aspect-video md:aspect-auto md:h-64",
    large: "col-span-1 md:col-span-2 row-span-1 md:row-span-2 aspect-square md:aspect-auto md:h-auto",
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl ${sizeClasses[size]} animate-fade-in-up cursor-pointer`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 ${gradient} transition-transform duration-500 group-hover:scale-105`} />

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />

      {/* Content */}
      <div className="relative h-full p-6 flex flex-col justify-between z-10">
        <div className="flex items-start justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white">
            {title}
          </div>
          <div className="opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </div>

        {children}

        {description && (
          <div className="opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <p className="text-sm text-white/80">{description}</p>
          </div>
        )}
      </div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </div>
  )
}

// Category card
function CategoryCard({
  title,
  description,
  href,
  count,
  delay,
}: {
  title: string
  description: string
  href: string
  count: number
  delay: number
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-xl border border-border/50 p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
        {count}
      </div>
      <div className="relative z-10">
        <h3 className="mb-2 font-semibold text-xl group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 inline-flex items-center text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
          Explore
          <svg
            className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

export default function HomePage() {
  return (
    <div className="relative">
      {/* Background effects */}
      <div className="gradient-t-to-b" />
      <div className="bg-blurry-dots" />

      {/* Hero Section */}
      <section className="relative container mx-auto px-4">
        <div className="mx-auto flex max-w-[1000px] flex-col items-center gap-6 py-16 md:py-24 lg:py-32">
          <FloatingParticles />

          {/* Badge */}
          <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            Now with 22+ components
          </div>

          {/* Main heading */}
          <h1 className="text-center text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl animate-fade-in-up">
            Build{" "}
            <span className="relative inline-block">
              <span className="text-gradient">beautiful</span>
              <svg
                className="absolute -bottom-2 left-0 w-full animate-fade-in"
                style={{ animationDelay: "500ms" }}
                viewBox="0 0 200 12"
                fill="none"
              >
                <path
                  d="M2 10C50 2 150 2 198 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="text-primary"
                />
              </svg>
            </span>{" "}
            interfaces
            <br className="hidden sm:inline" />
            with SMI-UI
          </h1>

          {/* Subtitle */}
          <p className="max-w-[700px] text-center text-lg text-muted-foreground md:text-xl animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            A collection of beautifully designed, accessible, and animated components.
            Built with React, Tailwind CSS, and Framer Motion.{" "}
            <span className="text-foreground font-medium">By Smicolon.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 py-4 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            <Link
              href="/docs"
              className="group relative inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
            >
              Get Started
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/docs/components/button"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium shadow-sm transition-all duration-300 hover:bg-accent hover:border-primary/30"
            >
              Browse Components
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-3 gap-8 md:gap-16 animate-fade-in-up" style={{ animationDelay: "600ms" }}>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary md:text-4xl">
                <AnimatedNumber value={22} />
              </div>
              <div className="text-sm text-muted-foreground">Components</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary md:text-4xl">
                <AnimatedNumber value={74} />
              </div>
              <div className="text-sm text-muted-foreground">Tests</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary md:text-4xl">
                <AnimatedNumber value={100} />
              </div>
              <div className="text-sm text-muted-foreground">% TypeScript</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-[1000px]">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl animate-fade-in-up">
              Why SMI-UI?
            </h2>
            <p className="text-muted-foreground md:text-lg animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              Built for developers who care about quality, performance, and user experience.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Accessible"
              description="Built with accessibility in mind. Full keyboard navigation and screen reader support out of the box."
              delay={200}
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <FeatureCard
              title="Animated"
              description="Smooth, performant animations powered by Framer Motion with automatic reduced motion support."
              delay={300}
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <FeatureCard
              title="Copy & Paste"
              description="Use our CLI to add components or simply copy the source code directly into your project."
              delay={400}
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              }
            />
            <FeatureCard
              title="TypeScript First"
              description="100% TypeScript with full type safety. IntelliSense and autocomplete everywhere."
              delay={500}
              icon={
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0H1.125zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
                </svg>
              }
            />
            <FeatureCard
              title="Dark Mode"
              description="Beautiful dark mode support with automatic system preference detection."
              delay={600}
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              }
            />
            <FeatureCard
              title="Customizable"
              description="Built with Tailwind CSS and CSS variables. Easy to customize and extend to match your brand."
              delay={700}
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* Component Categories Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-[1000px]">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl animate-fade-in-up">
              Component Categories
            </h2>
            <p className="text-muted-foreground md:text-lg animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              From primitives to full-featured blocks, we&apos;ve got you covered.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <CategoryCard
              title="UI Primitives"
              description="Button, Input, Card, Badge, Skeleton, Avatar, Checkbox, Switch, and more."
              href="/docs/components/button"
              count={12}
              delay={200}
            />
            <CategoryCard
              title="Blocks"
              description="AppShell, PageHeader, EmptyState, Sidebar, Navbar, StatsCard, DataTable."
              href="/docs/components/empty-state"
              count={7}
              delay={300}
            />
            <CategoryCard
              title="Effects"
              description="ShimmerButton, AnimatedGradient, TextReveal, BorderBeam, Spotlight, GlowCard."
              href="/docs/components/shimmer-button"
              count={7}
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl animate-fade-in-up">
              Showcase
            </h2>
            <p className="text-muted-foreground md:text-lg animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              Beautiful interfaces built with SMI-UI components.
            </p>
          </div>

          {/* Masonry Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            <ShowcaseCard
              title="Dashboard"
              description="Analytics dashboard with real-time charts"
              gradient="bg-gradient-to-br from-violet-600 to-indigo-900"
              size="tall"
              delay={100}
            >
              <div className="flex-1 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-2 w-full max-w-[120px]">
                  <div className="h-12 rounded-lg bg-white/20 animate-pulse" />
                  <div className="h-12 rounded-lg bg-white/10" />
                  <div className="h-12 rounded-lg bg-white/10" />
                  <div className="h-12 rounded-lg bg-white/20 animate-pulse" style={{ animationDelay: "150ms" }} />
                </div>
              </div>
            </ShowcaseCard>

            <ShowcaseCard
              title="E-commerce"
              description="Modern shopping experience"
              gradient="bg-gradient-to-br from-rose-500 to-orange-500"
              size="default"
              delay={150}
            >
              <div className="flex-1 flex items-center justify-center">
                <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
            </ShowcaseCard>

            <ShowcaseCard
              title="SaaS Platform"
              description="Team collaboration tools"
              gradient="bg-gradient-to-br from-cyan-500 to-blue-600"
              size="wide"
              delay={200}
            >
              <div className="flex-1 flex items-center justify-center gap-3">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-white/30 border-2 border-white/20" />
                  ))}
                </div>
                <div className="h-8 w-20 rounded-full bg-white/20" />
              </div>
            </ShowcaseCard>

            <ShowcaseCard
              title="Fintech"
              description="Banking & finance apps"
              gradient="bg-gradient-to-br from-emerald-500 to-teal-700"
              size="default"
              delay={250}
            >
              <div className="flex-1 flex items-center justify-center">
                <div className="text-3xl font-bold text-white/90">$</div>
              </div>
            </ShowcaseCard>

            <ShowcaseCard
              title="AI Tools"
              description="Next-gen AI interfaces"
              gradient="bg-gradient-to-br from-purple-600 via-pink-500 to-red-500"
              size="default"
              delay={300}
            >
              <div className="flex-1 flex items-center justify-center">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-white/20 animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white/40 animate-ping" />
                </div>
              </div>
            </ShowcaseCard>

            <ShowcaseCard
              title="Portfolio"
              description="Creative showcase sites"
              gradient="bg-gradient-to-br from-amber-400 to-orange-600"
              size="tall"
              delay={350}
            >
              <div className="flex-1 flex flex-col items-center justify-center gap-2">
                <div className="w-20 h-3 rounded-full bg-white/30" />
                <div className="w-16 h-3 rounded-full bg-white/20" />
                <div className="w-12 h-3 rounded-full bg-white/10" />
              </div>
            </ShowcaseCard>

            <ShowcaseCard
              title="Healthcare"
              description="Medical & wellness platforms"
              gradient="bg-gradient-to-br from-sky-400 to-indigo-600"
              size="default"
              delay={400}
            >
              <div className="flex-1 flex items-center justify-center">
                <svg className="h-10 w-10 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </ShowcaseCard>

            <ShowcaseCard
              title="Developer Tools"
              description="CLI & API interfaces"
              gradient="bg-gradient-to-br from-slate-800 to-slate-950"
              size="wide"
              delay={450}
            >
              <div className="flex-1 flex items-center justify-center">
                <div className="font-mono text-sm text-green-400/80 bg-black/30 rounded-lg px-4 py-2">
                  <span className="text-gray-500">$</span> npx smi-ui add
                </div>
              </div>
            </ShowcaseCard>
          </div>
        </div>
      </section>

      {/* CLI Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-[800px]">
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-8 md:p-12 backdrop-blur-sm">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="text-center mb-8">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl animate-fade-in-up">
                Get started in seconds
              </h2>
              <p className="text-muted-foreground md:text-lg animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                Use our CLI to add components to your project instantly.
              </p>
            </div>

            <div className="rounded-lg bg-smi-neutral-950 p-4 font-mono text-sm animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <pre className="text-green-400 overflow-x-auto">
                <code>
                  <span className="text-gray-500">$</span> npx @smicolon/smi-ui add button{"\n"}
                  <span className="text-gray-500"># or use shadcn CLI</span>{"\n"}
                  <span className="text-gray-500">$</span> npx shadcn add @smicolon/button
                </code>
              </pre>
            </div>

            <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: "300ms" }}>
              <Link
                href="/docs"
                className="inline-flex items-center justify-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                Read the documentation
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-[600px] text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl animate-fade-in-up">
            Ready to build?
          </h2>
          <p className="mb-8 text-muted-foreground md:text-lg animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Start building beautiful interfaces with SMI-UI today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <Link
              href="/docs"
              className="group relative inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
            >
              Get Started
              <svg
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="https://github.com/smicolon/smi-ui"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-8 py-4 text-base font-medium transition-all duration-300 hover:bg-accent"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Star on GitHub
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              Built with care by{" "}
              <Link href="https://smicolon.com" target="_blank" rel="noreferrer" className="font-medium text-foreground hover:text-primary">
                Smicolon
              </Link>
            </p>
            <div className="flex items-center gap-6">
              <Link href="https://github.com/smicolon/smi-ui" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-foreground">
                GitHub
              </Link>
              <Link href="https://smicolon.com" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-foreground">
                Website
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
