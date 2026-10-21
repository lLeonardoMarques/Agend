import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Server, 
  Database, 
  CalendarDays, 
  ShieldCheck, 
  Heart, 
  Clock, 
  MapPin, 
  Instagram, 
  MessageCircle,
  HelpCircle,
  ListFilter
} from 'lucide-react';
import { BookingForm } from './components/BookingForm';
import { SuccessView } from './components/SuccessView';
import { NodeMongoGuideModal } from './components/NodeMongoGuideModal';
import { AdminBookingsDrawer } from './components/AdminBookingsDrawer';
import { Agendamento } from './types';
import { API_URL } from './api';

export default function App() {
  const [completedBooking, setCompletedBooking] = useState<Agendamento | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState<{
    online: boolean;
    totalAgendamentos: number;
    database: string;
  }>({
    online: false,
    totalAgendamentos: 0,
    database: 'Conectando...',
  });

  // Check server status periodically
  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch(`${API_URL}/api/agendamentos`);
        if (res.ok) {
          const data = await res.json();
          setServerStatus({
            online: true,
            totalAgendamentos: data.count || 0,
            database: '',
          });
        }
      } catch (err) {
        console.warn('API local offline ou fallback:', err);
      }
    };
    checkServer();
  }, [completedBooking, isAdminOpen]);

  return (
    <div className="min-h-screen bg-[#fcf8f7] text-[#2d2426] flex flex-col selection:bg-rose-200 selection:text-rose-900 relative overflow-x-hidden">
      
      {/* Decorative delicate background aura */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-rose-200/30 via-pink-100/20 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed -bottom-20 -right-20 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Banner / Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-rose-100/70 transition-all">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-400 via-rose-300 to-pink-300 flex items-center justify-center text-white shadow-md shadow-rose-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-lg sm:text-xl text-stone-900 tracking-tight">
                  Toque da Beleza
                </span>
                <span className="font-script text-rose-500 text-lg hidden sm:inline">
                  Flavia
                </span>
              </div>
              <p className="text-[10px] text-stone-500 font-medium tracking-wide uppercase">
                Estética Feminina
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* User Request Required Button: Node & MongoDB Explanation */}
            

            {/* Admin Bookings Drawer Button */}
            
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 sm:py-10 flex flex-col justify-center">
        
        {/* Header Hero Text */}
        {!completedBooking && (
          <div className="text-center mb-8 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/70 text-rose-700 text-xs font-semibold tracking-wider uppercase mb-3 border border-rose-200/60 shadow-xs">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-400" />
              <span>Especialista em Cabelos & Autoestima</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 leading-tight">
              Transforme e Cuide do Seu Cabelo
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-md mx-auto">
              Progressiva, botox, corte, penteado, cronograma capilar, hidratação e tarnsas. Agende seu horÃ¡rio em 3 passos simples.
            </p>

            {/* Quick badges */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] text-stone-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                Confirmação Rapida
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Dados seguros no servidor
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Produtos de alta qualidade
              </span>
            </div>
          </div>
        )}

        {/* Form or Success View */}
        <div className="w-full">
          {completedBooking ? (
            <SuccessView
              agendamento={completedBooking}
              onReset={() => setCompletedBooking(null)}
            />
          ) : (
            <BookingForm
              onSuccess={(agendamento) => {
                setCompletedBooking(agendamento);
                setServerStatus((prev) => ({
                  ...prev,
                  totalAgendamentos: prev.totalAgendamentos + 1,
                }));
              }}
            />
          )}
        </div>

        {/* Server & DB Status Bar */}
        <div className="mt-8 pt-6 border-t border-rose-100/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>{serverStatus.database}</span>
            
           
          </div>

          
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-rose-100/60 bg-white/50 text-center text-xs text-stone-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-serif font-medium text-stone-700">
             Toqu da Beleza - Todos os direitos reservados
          </p>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Atendimento com amor e delicadeza</span>
            <span></span>
            <span>São Paulo, SP</span>
          </div>
        </div>
      </footer>

      {/* Interactive Modal: How to create Node Server and Online MongoDB */}
      <NodeMongoGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Admin Drawer: View All Real-Time Appointments In The Database */}
      <AdminBookingsDrawer
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

    </div>
  );
}

