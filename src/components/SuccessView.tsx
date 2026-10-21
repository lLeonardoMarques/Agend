import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MessageCircle, 
  Sparkles, 
  ArrowLeft, 
  Heart, 
  Gift, 
  ExternalLink 
} from 'lucide-react';
import { Agendamento } from '../types';
import { formatDatePTBR } from '../utils/formatters';

interface Props {
  agendamento: Agendamento;
  onReset: () => void;
}

export const SuccessView: React.FC<Props> = ({ agendamento, onReset }) => {
  useEffect(() => {
    // Trigger celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#fb7185', '#fda4af', '#fef08a', '#d4a373'],
    });
  }, []);

  const handleWhatsAppConfirmation = () => {
    const rawNumber = agendamento.telefone.replace(/\D/g, '');
    const cleanNumber = rawNumber.length === 11 ? `55${rawNumber}` : rawNumber;
    const msg = encodeURIComponent(
      `OlÃ¡! Meu nome Ã© ${agendamento.nome} e acabei de agendar pelo link:\n` +
      `âœ¨ ServiÃ§o: ${agendamento.procedimento}\n` +
      `ðŸ“… Data: ${formatDatePTBR(agendamento.data)}\n` +
      `â° HorÃ¡rio: ${agendamento.horario}\n` +
      `Gostaria de confirmar! ðŸ’•`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  return (
    <div className="w-full max-w-md mx-auto text-center animate-in zoom-in-95 duration-300">
      
      {/* Success Badge */}
      <div className="relative inline-block mb-3">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-400 via-rose-300 to-amber-200 flex items-center justify-center text-white shadow-xl shadow-rose-200 mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
        </div>
      </div>

      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold tracking-wide border border-rose-100 uppercase mb-2">
        <Sparkles className="w-3.5 h-3.5" /> Salvo no Banco de Dados
      </span>

      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-1">
        Agendamento Confirmado!
      </h2>
      <p className="text-xs sm:text-sm text-stone-600 mb-5">
        Obrigada, <strong className="text-stone-800">{agendamento.nome}</strong>! Seus dados foram salvos com sucesso.
      </p>

      {/* SPECIAL GIFT CARD: PDF ABOUT FRIZZ */}
      <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-rose-50 to-pink-50 border-2 border-rose-200/90 text-left relative overflow-hidden shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Gift className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-white px-2 py-0.5 rounded-full border border-rose-100">
              Lembrete de Presente
            </span>
            <h4 className="font-serif text-sm font-bold text-stone-900 mt-1">
              Baixe seu PDF Guia Anti-Frizz GrÃ¡tis
            </h4>
            <p className="text-xs text-stone-600 mt-0.5 leading-snug">
              Responda ao quiz rapido de 1 minuto para descobrir o que causa o frizz no seu cabelo e receber o e-book.
            </p>
            <div className="mt-2">
              <a
                href="https://lleonardomarques.github.io/paginalead"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:text-rose-900 underline"
              >
                <span>Acessar Quiz e Resgatar PDF</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket / Voucher Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl shadow-rose-100/50 border border-rose-100/80 text-left relative overflow-hidden mb-5">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-100/60 to-transparent pointer-events-none rounded-tr-3xl" />
        
        <div className="border-b border-rose-100/60 pb-3 mb-3">
          <span className="text-[11px] font-semibold text-rose-500 uppercase tracking-wider block">
            Tratamento Marcado
          </span>
          <h4 className="font-serif text-base sm:text-lg font-bold text-stone-800 mt-0.5">
            {agendamento.procedimento}
          </h4>
          {agendamento.procedimentoPreco && (
            <span className="text-xs font-semibold text-stone-500">
              Valores e Descontos: {agendamento.procedimentoPreco}
            </span>
          )}
        </div>

        <div className="space-y-2.5 text-xs sm:text-sm">
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2 text-stone-500">
              <Calendar className="w-4 h-4 text-rose-400" />
              <span>Data marcada</span>
            </div>
            <strong className="text-stone-800 font-medium">
              {formatDatePTBR(agendamento.data)}
            </strong>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2 text-stone-500">
              <Clock className="w-4 h-4 text-rose-400" />
              <span>Horario</span>
            </div>
            <strong className="text-stone-800 font-medium">
              {agendamento.horario}
            </strong>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2 text-stone-500">
              <MessageCircle className="w-4 h-4 text-rose-400" />
              <span>WhatsApp</span>
            </div>
            <strong className="text-stone-800 font-mono">
              {agendamento.telefone}
            </strong>
          </div>

          {agendamento.observacoes && (
            <div className="pt-2 border-t border-rose-50 text-stone-500 text-xs italic">
              Obs: {agendamento.observacoes}
            </div>
          )}
        </div>

        {/* Protocol */}
        
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5">
        <button
          onClick={handleWhatsAppConfirmation}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-sm shadow-lg shadow-emerald-200/50 flex items-center justify-center gap-2 transition-all transform active:scale-98"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Confirmar com a Cabeleireira no WhatsApp</span>
        </button>

        <button
          onClick={onReset}
          className="w-full py-3 px-6 rounded-2xl bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-900 text-xs sm:text-sm font-medium border border-stone-200 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Fazer Novo Agendamento</span>
        </button>
      </div>

    </div>
  );
};

