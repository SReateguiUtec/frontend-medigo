import { VerticalTabs } from '@/components/ui/vertical-tabs';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { WhisperDemo } from '@/components/WhisperDemo';
import Grid from '@/components/Grid';
import Testimonials from '@/components/Testimonials';
import { AnimatedSection } from '@/components/animated-section';
import { Badge } from '@/components/ui/badge';
import { Zap, PictureInPicture2, Sparkles, MessageCircle } from 'lucide-react';
import { LogoCarouselDemo } from '@/components/LogoCarousel';
import DemoOne from '@/components/slider-demo';
import PricingSection from '@/components/pricing';
import { AuroraBackground } from '@/components/ui/aurora-background';
import FrequentlyAskedQuestionsStack from '@/components/faq';
import { DemoAiAssistantBasic } from '@/components/demo-ai';
import { EncryptedText } from "@/components/ui/encrypted-text";

export const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AuroraBackground className="min-h-screen w-full" showRadialGradient={false}>
        <br></br>
        <br></br>
        <br></br>

        <div className="container mx-auto px-4 py-15">
          <AnimatedSection>
            <div className="text-center mb-16">
              <Badge
                variant="secondary"
                className="mb-8 px-6 py-3 text-base bg-linear-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-md border-2 border-blue-600/30 shadow-lg shadow-blue-500/20 text-blue-900"
              >
                <span className="font-semibold flex items-center gap-2 justify-center">
                  <PictureInPicture2 className="h-4 w-4 animate-pulse" />
                  Plataforma de Telemedicina
                </span>
              </Badge>

              <WhisperDemo />
              <br></br>
              {!isAuthenticated && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto sm:max-w-none">
                  <Link
                    to="/register"
                    className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 sm:px-8 rounded-full text-base sm:text-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/25 text-center"
                  >
                    Comenzar Ahora
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto bg-white text-blue-600 px-6 py-3 sm:px-8 rounded-full text-base sm:text-lg font-semibold hover:bg-blue-50 transition shadow-lg hover:shadow-blue-500/10 text-center"
                  >
                    Iniciar Sesión
                  </Link>
                </div>
              )}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-light tracking-tight text-gray-800">
                La experiencia de muchos a <span className="font-semibold"> tu servicio.</span>
              </h2>
            </div>
          </AnimatedSection>

          <LogoCarouselDemo />

          <br></br>

        </div>
      </AuroraBackground>

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

        {/* ALMA Section */}
        <section className="container mx-auto px-4 py-20">
          <AnimatedSection delay={500}>
            {/* Section Title */}
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 border-black">
                Inteligencia Artificial
              </Badge>
              <h3 className="text-4xl md:text-5xl font-normal text-gray-900 mb-4 leading-tight">
                <EncryptedText
                  text="En MediGO te cuidamos con nuestra alma"
                  encryptedClassName="text-neutral-500"
                  revealedClassName="font-normal text-gray-900"
                  boldText="alma"
                  boldClassName="font-semibold text-indigo-600"
                  revealDelayMs={50}
                />
              </h3>
            </div>

            <div className="max-w-3xl mx-auto">
              {/* Feature Badges */}
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                <div className="px-6 py-3 bg-linear-to-r from-blue-500/10 to-indigo-500/10 rounded-full border border-blue-200 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">IA potenciada por Gemini</span>
                </div>
                <div className="px-6 py-3 bg-linear-to-r from-blue-500/10 to-indigo-500/10 rounded-full border border-blue-200 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">Asistencia 24/7</span>
                </div>
                <div className="px-6 py-3 bg-linear-to-r from-blue-500/10 to-indigo-500/10 rounded-full border border-blue-200 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">Respuestas Instantáneas</span>
                </div>
              </div>

              <AnimatedSection delay={1000}>
                <div className="mt-6 flex flex-col items-center justify-center">
                  <p className="text-xl md:text-2xl text-gray-600 mb-10 font-medium text-center">
                    Por cierto, te presentamos a <span className="font-bold text-blue-600">A.L.M.A</span>
                  </p>
                  <AnimatedSection delay={1500} className="w-full">
                    <DemoAiAssistantBasic />
                  </AnimatedSection>
                </div>
              </AnimatedSection>
            </div>
          </AnimatedSection>
        </section>

        <br></br>
        <br></br>
        <section id="beneficios">
          <AnimatedSection delay={400}>
            <Grid />
          </AnimatedSection>
        </section>

        <section id="testimonios">
          <AnimatedSection delay={600}>
            <Testimonials />
          </AnimatedSection>
        </section>

        <AnimatedSection delay={400}>
          <VerticalTabs />
        </AnimatedSection>

        {/* Pricing Section */}
        <section id="pricing">
          <AnimatedSection delay={400}>
            <PricingSection />
          </AnimatedSection>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="container mx-auto px-4 py-15">
          <AnimatedSection delay={500}>
            <div className="text-center mb-4">
              <Badge variant="outline" className="mb-4 border-black">
                FAQ
              </Badge>
              <h3 className="text-4xl md:text-5xl font-normal tracking-tight text-gray-900">
                Preguntas Frecuentes
              </h3>
            </div>
            <FrequentlyAskedQuestionsStack />
          </AnimatedSection>
        </section >
      </div>

      <br></br>
      <br></br>
      <br></br>

    </div >
  );
};
