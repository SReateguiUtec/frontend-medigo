import LampDemo from '@/components/lamp-demo';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { WhisperDemo } from '@/components/WhisperDemo';
import Grid from '@/components/Grid';
import Testimonials from '@/components/Testimonials';
import { AnimatedSection } from '@/components/animated-section';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Zap, PictureInPicture2, DollarSign, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react';
import Timer from '@/components/ui/timer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LogoCarouselDemo } from '@/components/LogoCarousel';
import DemoOne from '@/components/slider-demo';

export const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
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
                Plataforma de Videoconsultas
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

        <AnimatedSection delay={400}>
          <div className="relative max-w-7xl mx-auto">
            <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 blur-3xl rounded-3xl"></div>

            {/* Glassmorphism card with grid layout */}
            <div className="relative backdrop-blur-xl bg-white/10 border-2 border-blue-200/30 rounded-3xl shadow-xl hover:shadow-2xl hover:border-blue-300/50 transition-all duration-300 overflow-hidden">
              <div className="grid md:grid-cols-2 gap-4 items-center">
                {/* Right side - Content */}
                <div className="p-12 text-center">
                  <div className="flex flex-col items-center mb-6">
                    <MessageSquare className="h-12 w-12 text-blue-600 animate-[bounce_2s_ease-in-out_infinite] mb-4" />
                    <h2 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      ¿Eres médico?
                    </h2>
                  </div>
                  <p className="text-xl mb-8 text-gray-700">
                    Únete a nuestra plataforma y expande tu alcance profesional
                  </p>
                  <Link
                    to="/register?role=MEDICO"
                    className="inline-block bg-linear-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Registrarse como Médico
                  </Link>
                </div>

                {/* Left side - Image */}
                <div className="flex justify-center items-center p-8">
                  <img
                    src="/medico.png"
                    alt="Médico profesional"
                    className="w-full max-w-xs h-auto object-contain transform transition-all duration-300 hover:scale-105 hover:drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <br></br>
        <br></br>
        <br></br>
        <br></br>

        <section id="servicios">
          <AnimatedSection delay={200}>
            <div className="text-center mb-8 mt-6">
              <Badge variant="outline" className="mb-4">
                Servicios
              </Badge>
              <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
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

        {/* Pricing Section */}
        <section id="pricing">
          <AnimatedSection delay={400}>
            <div className="container mx-auto px-4 py-20">
              <div className="text-center mb-16">
                <Badge variant="outline" className="mb-4 border-black-500 text-black-600">
                  Pricing
                </Badge>
                <h3 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
                  Precios Transparentes
                </h3>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Solo cobramos una pequeña comisión por cada consulta
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                {/* Main Pricing Card */}
                <div className="relative">
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>

                  <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-12 border border-blue-100 shadow-2xl">
                    <div className="text-center mb-8">
                      <div className="inline-block mb-6 relative">
                        {/* Glow effect behind percentage */}
                        <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-30"></div>
                        <Timer
                          target={5}
                          duration={4}
                          suffix="%"
                          className="relative text-8xl md:text-9xl font-black bg-linear-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                        />
                      </div>
                      <h4 className="text-3xl font-bold text-gray-900 mb-3">
                        Comisión por Consulta
                      </h4>
                      <p className="text-gray-600 text-lg max-w-xl mx-auto">
                        Solo cobramos el 5% del monto total de cada consulta médica realizada en la plataforma
                      </p>
                    </div>

                    {/* Grid */}
                    <div className="grid md:grid-cols-3 gap-4 mt-8">
                      <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-shadow">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-gray-900 mb-1">S/100</p>
                          <div className="h-px bg-linear-to-r from-transparent via-blue-300 to-transparent my-3"></div>
                          <p className="text-sm text-gray-500">Comisión</p>
                          <p className="text-2xl font-bold text-blue-600">S/5</p>
                        </div>
                      </div>

                      <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200 hover:shadow-lg transition-shadow transform md:scale-105">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-gray-900 mb-1">S/150</p>
                          <div className="h-px bg-linear-to-r from-transparent via-indigo-300 to-transparent my-3"></div>
                          <p className="text-sm text-gray-500">Comisión</p>
                          <p className="text-2xl font-bold text-indigo-600">S/7.50</p>
                        </div>
                      </div>

                      <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-shadow">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-gray-900 mb-1">S/200</p>
                          <div className="h-px bg-linear-to-r from-transparent via-purple-300 to-transparent my-3"></div>
                          <p className="text-sm text-gray-500">Comisión</p>
                          <p className="text-2xl font-bold text-purple-600">S/10</p>
                        </div>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                      <div className="grid md:grid-cols-3 gap-6 text-center">
                        <div>
                          <div className="flex justify-center mb-2">
                            <DollarSign className="h-8 w-8 text-blue-500" />
                          </div>
                          <p className="text-sm font-semibold text-gray-900">Sin costos ocultos</p>
                        </div>
                        <div>
                          <div className="flex justify-center mb-2">
                            <ShieldCheck className="h-8 w-8 text-green-500" />
                          </div>
                          <p className="text-sm font-semibold text-gray-900">Pagos seguros</p>
                        </div>
                        <div>
                          <div className="flex justify-center mb-2">
                            <Zap className="h-8 w-8 text-purple-500" />
                          </div>
                          <p className="text-sm font-semibold text-gray-900">Procesamiento instantáneo</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* ALMA Section */}
        <section className="container mx-auto px-4 py-20">
          <AnimatedSection delay={500}>
            {/* Section Title */}
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                Inteligencia Artificial
              </Badge>
              <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                En MediGO te cuidamos con alma
              </h3>
            </div>

            <div className="max-w-3xl mx-auto">

              {/* Feature Badges */}
              <div className="flex flex-wrap gap-4 justify-center mb-12">
                <div className="px-6 py-3 bg-linear-to-r from-blue-500/10 to-indigo-500/10 rounded-full border border-blue-200 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">IA potenciada por Gemini</span>
                </div>
                <div className="px-6 py-3 bg-linear-to-r from-indigo-500/10 to-purple-500/10 rounded-full border border-indigo-200 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-semibold text-indigo-700">Asistencia 24/7</span>
                </div>
                <div className="px-6 py-3 bg-linear-to-r from-purple-500/10 to-pink-500/10 rounded-full border border-purple-200 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-700">Respuestas Instantáneas</span>
                </div>
              </div>

              <AnimatedSection delay={1000}>
                <div className="mt-16 flex flex-col items-center justify-center">
                  <p className="text-xl md:text-2xl text-gray-600 mb-12 font-medium text-center">
                    Por cierto, te presentamos a <span className="font-bold text-indigo-600">A.L.M.A</span>
                  </p>

                  <div className="flex flex-col items-start justify-center select-none pl-10 md:pl-0">
                    <div className="flex items-baseline gap-2 md:gap-2 group hover:translate-x-2 transition-transform duration-300">
                      <span className="text-7xl md:text-9xl font-black bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600 drop-shadow-sm">
                        A
                      </span>
                      <span className="text-3xl md:text-6xl font-light text-gray-700 tracking-tight self-center">
                        sistente en
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 md:gap-2 group hover:translate-x-2 transition-transform duration-300 -mt-2 md:-mt-6">
                      <span className="text-7xl md:text-9xl font-black bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-violet-600 drop-shadow-sm">
                        L
                      </span>
                      <span className="text-3xl md:text-6xl font-light text-gray-700 tracking-tight self-center">
                        ínea de
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 md:gap-2 group hover:translate-x-2 transition-transform duration-300 -mt-2 md:-mt-6">
                      <span className="text-7xl md:text-9xl font-black bg-clip-text text-transparent bg-linear-to-r from-violet-600 to-purple-600 drop-shadow-sm">
                        M
                      </span>
                      <span className="text-3xl md:text-6xl font-light text-gray-700 tracking-tight self-center">
                        édica
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 md:gap-2 group hover:translate-x-2 transition-transform duration-300 -mt-2 md:-mt-6">
                      <span className="text-7xl md:text-9xl font-black bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-fuchsia-600 drop-shadow-sm">
                        A
                      </span>
                      <span className="text-3xl md:text-6xl font-light text-gray-700 tracking-tight self-center">
                        vanzada
                      </span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </AnimatedSection>
        </section>

        <br></br>

        {/* FAQ Section */}
        <section id="faq" className="container mx-auto px-4 py-15">
          <AnimatedSection delay={500}>
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                FAQ
              </Badge>
              <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
                Preguntas Frecuentes
              </h3>
            </div>

            <Accordion type="single" collapsible className="max-w-3xl mx-auto">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  ¿Es gratuito?
                </AccordionTrigger>
                <AccordionContent>
                  Actualmente no contamos con un plan gratuito, pero el costo es de
                  una comision de 5% por cada consulta.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  ¿Hay limite de tiempo en la video llamada?
                </AccordionTrigger>
                <AccordionContent>
                  Si! Cada video llamada tiene un limite de 50 minutos. Estamos trabajando
                  para que no tenga limite de tiempo.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  ¿Cuánto tiempo tarda en atender un medico?
                </AccordionTrigger>
                <AccordionContent>
                  En promedio, un medico tarda en atender un paciente entre 15 y 20 minutos.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  ¿Es segura la plataforma?
                </AccordionTrigger>
                <AccordionContent>
                  Si, la plataforma esta segura y tiene un encriptado de datos. La verificacion de
                  los medicos actualmente se hace a mano, pero estamos trabajando en un sistema de verificacion
                  automatica que incluye tener los numeros de colegiados de los medicos para verificar que esten abalados por la institucion correspondiente.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">
                  ¿Mi medico puede hacerme un seguimiento?
                </AccordionTrigger>
                <AccordionContent>
                  Absolutamente. Todos tus medicos tendran un historial de tus citas y podran hacer seguimiento de tus citas. Asi como tu historial medico.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AnimatedSection>
        </section >
      </div >

      <br></br>
      <br></br>
      <br></br>

      <AnimatedSection delay={200}>
        <LampDemo />
      </AnimatedSection>
    </div >
  );
};
