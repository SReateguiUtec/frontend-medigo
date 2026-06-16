import { VerticalTabs } from '@/components/ui/vertical-tabs';

import Grid from '@/components/Grid';
import Testimonials from '@/components/Testimonials';
import { AnimatedSection } from '@/components/animated-section';
import { Badge } from '@/components/ui/badge';
import { Zap, Sparkles, MessageCircle } from 'lucide-react';
import { LogoCarouselDemo } from '@/components/LogoCarousel';
import DemoOne from '@/components/slider-demo';
import PricingSection from '@/components/pricing';

import FrequentlyAskedQuestionsStack from '@/components/faq';


import { HeroSplit } from '@/components/home/HeroSplit';
import { AlmaOrb } from '@/components/home/AlmaOrb';

export const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Modern Grid Background */}
      <div className="absolute inset-0 z-0 h-full w-full bg-white bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      <div className="absolute inset-0 z-0 bg-linear-to-b from-blue-50/50 to-transparent pointer-events-none"></div>

      <div className="relative z-10 pt-10">
        <HeroSplit />

        <div className="container mx-auto px-4 pb-15">
          <LogoCarouselDemo />
        </div>
      </div>

      <div className="container mx-auto px-4">
        <section id="servicios">
          <AnimatedSection delay={200}>
            <div className="text-center mb-8 mt-6">
              <Badge variant="outline" className="mb-4 border-black">
                Servicios
              </Badge>
              <h3 className="text-3xl md:text-5xl font-normal tracking-tight text-gray-900">
                La especialidad que buscas
              </h3>
            </div>
          </AnimatedSection>
        </section>

        <br></br>
        <br></br>
        <div className="max-w-7xl mx-auto">
          <DemoOne />
        </div>

      </div>

      {/* ALMA Section */}
      <section className="w-full bg-slate-950 py-12 md:py-16 relative overflow-hidden">
        {/* Dark theme background glowing effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-5xl pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection delay={200}>
            {/* Section Title */}
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-4 border-indigo-500/30 text-indigo-300 bg-indigo-500/10">
                Inteligencia Artificial
              </Badge>
              <h3 className="text-3xl md:text-5xl font-normal text-white mb-2 md:mb-4 leading-tight px-2">
                En MediGO te cuidamos con nuestra <span className="font-semibold text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">alma</span>
              </h3>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Feature Badges */}
              <div className="flex flex-wrap gap-2 md:gap-3 justify-center mb-6 md:mb-10 px-2">
                <div className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-900/50 backdrop-blur-md rounded-full border border-slate-800 flex items-center gap-1.5 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all cursor-default">
                  <Sparkles className="h-3 w-3 md:h-3.5 md:w-3.5 text-cyan-400" />
                  <span className="text-[11px] md:text-xs font-medium text-slate-200">IA potenciada por Gemini</span>
                </div>
                <div className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-900/50 backdrop-blur-md rounded-full border border-slate-800 flex items-center gap-1.5 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all cursor-default">
                  <MessageCircle className="h-3 w-3 md:h-3.5 md:w-3.5 text-cyan-400" />
                  <span className="text-[11px] md:text-xs font-medium text-slate-200">Asistencia 24/7</span>
                </div>
                <div className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-900/50 backdrop-blur-md rounded-full border border-slate-800 flex items-center gap-1.5 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all cursor-default">
                  <Zap className="h-3 w-3 md:h-3.5 md:w-3.5 text-cyan-400" />
                  <span className="text-[11px] md:text-xs font-medium text-slate-200">Respuestas Instantáneas</span>
                </div>
              </div>

              <AnimatedSection delay={400}>
                <div className="flex flex-col items-center justify-center">
                  <p className="text-lg md:text-2xl text-slate-400 mb-1 font-medium text-center">
                    Por cierto, te presentamos a <span className="font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400 tracking-wide">A.L.M.A</span>
                  </p>
                  <p className="text-[10px] md:text-xs text-indigo-300/60 mb-2 md:mb-6 font-mono tracking-[0.2em] uppercase text-center">
                    Asistente en Línea de Médica Avanzada
                  </p>

                  {/* Alma Orb Component */}
                  <div className="scale-75 md:scale-100 origin-top -mt-4 md:mt-0">
                    <AlmaOrb />
                  </div>


                </div>
              </AnimatedSection>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Beneficios */}
      <section id="beneficios" className="container mx-auto px-4 py-16">
        <AnimatedSection delay={400}>
          <Grid />
        </AnimatedSection>
      </section>

      {/* Testimonios (White Background Break) */}
      <section id="testimonios" className="w-full bg-white py-24 shadow-sm border-y border-slate-200/60">
        <div className="container mx-auto px-4">
          <AnimatedSection delay={600}>
            <Testimonials />
          </AnimatedSection>
        </div>
      </section>

      {/* Vertical Tabs */}
      <section className="container mx-auto px-4 py-20">
        <AnimatedSection delay={400}>
          <VerticalTabs />
        </AnimatedSection>
      </section>

      {/* Pricing Section (Subtle Slate Background Break) */}
      <section id="pricing" className="w-full bg-slate-50 py-24 border-t border-slate-200/60">
        <div className="container mx-auto px-4">
          <AnimatedSection delay={400}>
            <PricingSection />
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto px-4 py-24">
        <AnimatedSection delay={500}>
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-slate-300">
              FAQ
            </Badge>
            <h3 className="text-4xl md:text-5xl font-normal tracking-tight text-gray-900">
              Preguntas Frecuentes
            </h3>
          </div>
          <FrequentlyAskedQuestionsStack />
        </AnimatedSection>
      </section>

    </div>
  );
};
