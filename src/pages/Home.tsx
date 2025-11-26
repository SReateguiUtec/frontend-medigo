import LampDemo from '@/components/lamp-demo';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { WorldMapDemo } from '@/components/WorldMapDemo';
import { EncryptedTextDemoSecond } from '@/components/EncryptedTextDemoSecond';
import Grid from '@/components/Grid';
import InfiniteMovingCardsDemo from '@/components/infinite-moving-cards-demo';
import { AnimatedSection } from '@/components/animated-section';
import { Card, CardContent } from '@/components/Card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Zap, PictureInPicture2, DollarSign, ShieldCheck } from 'lucide-react';
import Timer from '@/components/ui/timer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <br></br>
      <br></br>
      <br></br>

      <div className="container mx-auto px-4 py-16">
        <AnimatedSection>
          <div className="text-center mb-16">
            <Badge
              variant="secondary"
              className="mb-8 px-6 py-3 text-base bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-md border-2 border-blue-600/30 shadow-lg shadow-blue-500/20 text-blue-900"
            >
              <span className="font-semibold flex items-center gap-2 justify-center">
                <PictureInPicture2 className="h-4 w-4 animate-pulse" />
                Plataforma de Videoconsultas
              </span>
            </Badge>

            <EncryptedTextDemoSecond />
            <br></br>
            {!isAuthenticated && (
              <div className="flex justify-center space-x-4">
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
                >
                  Comenzar Ahora
                </Link>
                <Link
                  to="/login"
                  className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition"
                >
                  Iniciar Sesión
                </Link>
              </div>
            )}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <WorldMapDemo />
        </AnimatedSection>

        <br></br>
        <br></br>
        <br></br>

        <AnimatedSection delay={200}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-7xl mx-auto">
            <Card className="border-2 border-blue-200/20 dark:border-blue-800/20 backdrop-blur-md bg-white/5 dark:bg-slate-900/5 hover:shadow-2xl hover:shadow-blue-500/10 transform hover:-translate-y-2 transition-all duration-300">
              <CardContent className="pt-5 pb-5 text-center">
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 mb-2">
                  24/7
                </div>
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Disponibilidad Total
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-purple-200/20 dark:border-purple-800/20 backdrop-blur-md bg-white/5 dark:bg-slate-900/5 hover:shadow-2xl hover:shadow-purple-500/10 transform hover:-translate-y-2 transition-all duration-300">
              <CardContent className="pt-5 pb-5 text-center">
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 mb-2">
                  &lt;20m
                </div>
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Tiempo de Respuesta
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-indigo-200/20 dark:border-indigo-800/20 backdrop-blur-md bg-white/5 dark:bg-slate-900/5 hover:shadow-2xl hover:shadow-indigo-500/10 transform hover:-translate-y-2 transition-all duration-300">
              <CardContent className="pt-5 pb-5 text-center">
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-800 dark:from-indigo-400 dark:to-indigo-600 mb-2">
                  99.9%
                </div>
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Seguridad Garantizada
                </div>
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>

        <br></br>
        <br></br>

        <AnimatedSection delay={400}>
          <Grid />
        </AnimatedSection>

        <br></br>
        <br></br>
        <br></br>

        <AnimatedSection delay={400}>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-12 rounded-3xl text-center shadow-2xl hover:shadow-blue-500/20 transition-shadow duration-300 max-w-7xl mx-auto">
            <div className="flex justify-center mb-4">
              <MessageSquare className="h-16 w-16 animate-bounce" />
            </div>
            <h2 className="text-3xl font-bold mb-4">¿Eres médico?</h2>
            <p className="text-xl mb-6">
              Únete a nuestra plataforma y expande tu alcance profesional
            </p>
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition inline-block"
            >
              Registrarse como Médico
            </Link>
          </div>
        </AnimatedSection>

        <br></br>
        <br></br>
        <br></br>

        <AnimatedSection delay={600}>
          <InfiniteMovingCardsDemo />
        </AnimatedSection>

        <br></br>
        <br></br>
        <br></br>

        {/* Pricing Section */}
        <section id="pricing">
          <AnimatedSection delay={400}>
            <div className="container mx-auto px-4 py-20">
              <div className="text-center mb-16">
                <Badge variant="outline" className="mb-4 border-black-500 text-black-600">
                  Pricing
                </Badge>
                <h3 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
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
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>

                  <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-12 border border-blue-100 shadow-2xl">
                    <div className="text-center mb-8">
                      <div className="inline-block mb-6 relative">
                        {/* Glow effect behind percentage */}
                        <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-30"></div>
                        <Timer
                          target={5}
                          duration={4}
                          suffix="%"
                          className="relative text-8xl md:text-9xl font-black bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent"
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
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-shadow">
                        <div className="text-center">
                          <p className="text-sm text-blue-600 font-semibold mb-2">Consulta Básica</p>
                          <p className="text-3xl font-bold text-gray-900 mb-1">S/100</p>
                          <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent my-3"></div>
                          <p className="text-sm text-gray-500">Comisión</p>
                          <p className="text-2xl font-bold text-blue-600">S/5</p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200 hover:shadow-lg transition-shadow transform md:scale-105">
                        <div className="text-center">
                          <p className="text-sm text-indigo-600 font-semibold mb-2">Consulta Estándar</p>
                          <p className="text-3xl font-bold text-gray-900 mb-1">S/150</p>
                          <div className="h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent my-3"></div>
                          <p className="text-sm text-gray-500">Comisión</p>
                          <p className="text-2xl font-bold text-indigo-600">S/7.50</p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-shadow">
                        <div className="text-center">
                          <p className="text-sm text-purple-600 font-semibold mb-2">Consulta Premium</p>
                          <p className="text-3xl font-bold text-gray-900 mb-1">S/200</p>
                          <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent my-3"></div>
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

        {/* FAQ Section */}
        <section id="faq" className="container mx-auto px-4 py-20">
          <AnimatedSection delay={500}>
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                FAQ
              </Badge>
              <h3 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-black mb-4">
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
        </section>
      </div>

      <br></br>
      <br></br>
      <br></br>

      <AnimatedSection delay={200}>
        <LampDemo />
      </AnimatedSection>
    </div>
  );
};
