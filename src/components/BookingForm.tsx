import React, { useState } from 'react';
import { API_URL } from '../api';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Phone, 
  Sparkles, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle,
  Gift,
  ExternalLink,
  Flame,
  Droplets,
  Scissors,
  Crown,
  HeartHandshake,
  Waves,
  Feather
} from 'lucide-react';
import { SERVICOS_CABELO } from '../data/procedures';
import { ProcedimentoItem, Agendamento } from '../types';
import { formatPhoneNumber, isValidPhone, formatDatePTBR } from '../utils/formatters';

interface Props {
  onSuccess: (agendamento: Agendamento) => void;
}

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  progressiva: <Flame className="w-5 h-5 text-rose-500" />,
  'botox-capilar': <Sparkles className="w-5 h-5 text-pink-500" />,
  corte: <Scissors className="w-5 h-5 text-amber-500" />,
  penteado: <Crown className="w-5 h-5 text-purple-500" />,
  'cronograma-capilar': <HeartHandshake className="w-5 h-5 text-rose-400" />,
  'hidratacao-profunda': <Droplets className="w-5 h-5 text-sky-500" />,
  tranca: <Waves className="w-5 h-5 text-amber-600" />,
};

export const BookingForm: React.FC<Props> = ({ onSuccess }) => {
  // Step state: 1 = Dados (Nome/Telefone), 2 = ServiÃ§os, 3 = Data/Hora + Presente Frizz
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Form Fields
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [selectedProcedimento, setSelectedProcedimento] = useState<ProcedimentoItem>(SERVICOS_CABELO[0]);
  const [customService, setCustomService] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  // Tomorrow as default date
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [data, setData] = useState(tomorrow);
  const [horario, setHorario] = useState('14:30');
  const [observacoes, setObservacoes] = useState('');

  // Status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const timeSlots = [
    '09:00', '10:00', '11:00', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30'
  ];

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setTelefone(formatted);
  };

  // Step 1 Validation & Next
  const handleNextFromStep1 = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (!nome.trim() || nome.trim().length < 3) {
      setErrorMessage('Por favor, informe seu nome completo.');
      return;
    }

    if (!isValidPhone(telefone)) {
      setErrorMessage('Por favor, informe um WhatsApp vÃ¡lido com DDD (ex: 11 98765-4321).');
      return;
    }

    setDirection(1);
    setStep(2);
  };

  // Step 2 Next
  const handleNextFromStep2 = () => {
    setErrorMessage(null);
    if (isCustom && !customService.trim()) {
      setErrorMessage('Por favor, digite qual procedimento de cabelo deseja.');
      return;
    }
    setDirection(1);
    setStep(3);
  };

  const handleBack = () => {
    setErrorMessage(null);
    setDirection(-1);
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  // Final Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!data) {
      setErrorMessage('Por favor, selecione a data do seu atendimento.');
      return;
    }

    setLoading(true);

    const procedureName = isCustom ? customService.trim() : selectedProcedimento.nome;
    const procedurePrice = isCustom ? undefined : selectedProcedimento.preco;

    const payload = {
      nome: nome.trim(),
      telefone: telefone.trim(),
      procedimento: procedureName,
      procedimentoPreco: procedurePrice,
      data,
      horario,
      observacoes: observacoes.trim() || undefined,
    };

    try {
      const response = await fetch(`${API_URL}/api/agendamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro ao enviar agendamento');
      }

      onSuccess({ ...result.data, id: result.data._id ?? result.data.id });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.message || 'Erro ao conectar ao servidor. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Animation variants for smooth slide transitions between pages
  const pageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full">
      
      {/* Steps Indicator Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between max-w-sm mx-auto mb-2">
          
          {/* Step 1 Pill */}
          <div 
            onClick={() => { if (step > 1) { setDirection(-1); setStep(1); } }}
            className={`flex items-center gap-1.5 cursor-pointer text-xs font-semibold transition-colors ${
              step === 1 ? 'text-rose-600' : step > 1 ? 'text-emerald-600' : 'text-stone-400'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step === 1 
                ? 'bg-rose-500 text-white shadow-sm shadow-rose-200' 
                : step > 1 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-stone-200 text-stone-500'
            }`}>
              {step > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
            </div>
            <span>Seus Dados</span>
          </div>

          <div className={`h-0.5 w-8 transition-colors ${step > 1 ? 'bg-emerald-400' : 'bg-stone-200'}`} />

          {/* Step 2 Pill */}
          <div 
            onClick={() => { 
              if (step === 3) { setDirection(-1); setStep(2); } 
              else if (step === 1 && nome && isValidPhone(telefone)) { setDirection(1); setStep(2); }
            }}
            className={`flex items-center gap-1.5 cursor-pointer text-xs font-semibold transition-colors ${
              step === 2 ? 'text-rose-600' : step > 2 ? 'text-emerald-600' : 'text-stone-400'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step === 2 
                ? 'bg-rose-500 text-white shadow-sm shadow-rose-200' 
                : step > 2 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-stone-200 text-stone-500'
            }`}>
              {step > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
            </div>
            <span>Cabelo</span>
          </div>

          <div className={`h-0.5 w-8 transition-colors ${step > 2 ? 'bg-emerald-400' : 'bg-stone-200'}`} />

          {/* Step 3 Pill */}
          <div className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
            step === 3 ? 'text-rose-600' : 'text-stone-400'
          }`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step === 3 ? 'bg-rose-500 text-white shadow-sm shadow-rose-200' : 'bg-stone-200 text-stone-500'
            }`}>
              3
            </div>
            <span>Data & Hora</span>
          </div>

        </div>

        {/* Thin progress track */}
        <div className="w-full bg-stone-200/70 h-1 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-rose-400 to-pink-500 h-full transition-all duration-300"
            style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
          />
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Steps with AnimatePresence */}
      <div className="relative overflow-hidden min-h-[460px]">
        <AnimatePresence mode="wait" custom={direction}>
          
          {/* ================= STEP 1: NOME & TELEFONE ================= */}
          {step === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl shadow-rose-100/60 border border-rose-100"
            >
              <div className="text-center mb-6">
                <span className="inline-block px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold uppercase tracking-wider mb-2 border border-rose-100">
                  Etapa 1 de 3
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  Como podemos te chamar?
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Digite seu nome e o WhatsApp para receber o comprovante de agendamento.
                </p>
              </div>

              <form onSubmit={handleNextFromStep1} className="space-y-5 max-w-md mx-auto">
                {/* Nome */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Seu Nome Completo *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-400">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      autoFocus
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex: Gabriela Medeiros"
                      className="w-full pl-11 pr-4 py-3.5 bg-stone-50/80 border border-stone-200 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100 rounded-2xl text-stone-800 text-sm sm:text-base transition-all placeholder:text-stone-400 outline-none font-medium"
                    />
                  </div>
                </div>

                {/* Telefone */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Numero do WhatsApp *
                    </label>
                    <span className="text-[11px] text-stone-400">Com DDD</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={telefone}
                      onChange={handlePhoneChange}
                      placeholder="(11) 98765-4321"
                      maxLength={15}
                      className="w-full pl-11 pr-4 py-3.5 bg-stone-50/80 border border-stone-200 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100 rounded-2xl text-stone-800 text-sm sm:text-base transition-all placeholder:text-stone-400 outline-none font-semibold font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1.5">
                    Seus dados são confidenciais e enviados em seguransa ao salão.                  </p>
                </div>

                {/* Next Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:via-pink-600 hover:to-rose-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-rose-200/80 flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-98 group"
                  >
                    <span>Escolher Tratamento</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* ================= STEP 2: PROCEDIMENTOS DE CABELO ================= */}
          {step === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-7 shadow-xl shadow-rose-100/60 border border-rose-100"
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-rose-100/60">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar aos dados</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCustom(!isCustom)}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline"
                >
                  {isCustom ? 'Ver lista de cabelos' : '+ Outro procedimento'}
                </button>
              </div>

              <div className="text-center mb-5">
                <span className="inline-block px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold uppercase tracking-wider mb-1.5 border border-rose-100">
                  Etapa 2 de 3
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  Qual tratamento voçe deseja fazer?
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Tratamentos e transformações com profissional especialista em cabelos.
                </p>
              </div>

              {isCustom ? (
                <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 max-w-md mx-auto space-y-3 animate-in fade-in">
                  <label className="block text-xs font-bold text-stone-800">
                    Digite o serviço desejado:
                  </label>
                  <input
                    type="text"
                    autoFocus
                    value={customService}
                    onChange={(e) => setCustomService(e.target.value)}
                    placeholder="Ex: Morena Iluminada, Selagem, Penteado Noiva..."
                    className="w-full px-4 py-3 bg-white border border-stone-300 focus:border-rose-400 rounded-xl text-stone-800 text-sm outline-none"
                  />
                  <p className="text-[11px] text-stone-500">
                    O valor exato serÃ¡ avaliado na hora de acordo com o comprimento e necessidade.
                  </p>
                </div>
              ) : (
                /* Beautiful Hair Services List */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {SERVICOS_CABELO.map((item) => {
                    const isSelected = selectedProcedimento.id === item.id;
                    const icon = SERVICE_ICONS[item.id] || <Sparkles className="w-5 h-5 text-rose-400" />;

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedProcedimento(item);
                        }}
                        className={`p-3.5 rounded-2xl cursor-pointer transition-all border text-left flex flex-col justify-between group relative overflow-hidden ${
                          isSelected
                            ? 'bg-gradient-to-br from-rose-50 via-pink-50/50 to-white border-rose-400 shadow-md ring-2 ring-rose-300'
                            : 'bg-white hover:bg-stone-50/80 border-stone-200/90 hover:border-rose-300'
                        }`}
                      >
                        {/* Selected accent ribbon */}
                        {isSelected && (
                          <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-rose-200/60 to-transparent pointer-events-none rounded-tr-2xl" />
                        )}

                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                isSelected ? 'bg-white shadow-xs' : 'bg-stone-100 group-hover:bg-rose-50'
                              }`}>
                                {icon}
                              </div>
                              <span className="font-semibold text-stone-900 text-xs sm:text-sm leading-tight">
                                {item.nome}
                              </span>
                            </div>

                            {isSelected ? (
                              <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                                <Check className="w-3.5 h-3.5 stroke-3" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-stone-300 shrink-0 group-hover:border-rose-300" />
                            )}
                          </div>
                        </div>

                        <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                          <span className="font-bold text-rose-600 font-mono">
                            {item.preco}
                          </span>
                          <span className="text-stone-400 text-[11px] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.duracao}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Next Button */}
              <div className="mt-6 pt-4 border-t border-rose-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold transition-colors"
                >
                  Voltar
                </button>

                <button
                  type="button"
                  onClick={handleNextFromStep2}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:via-pink-600 hover:to-rose-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-rose-200 flex items-center justify-center gap-2 transition-all transform active:scale-98 group"
                >
                  <span>Escolha o dia e a Hora</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 3: DATA, HORA & PRESENTE QUIZ FRIZZ ================= */}
          {step === 3 && (
            <motion.div
              key="step-3"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-7 shadow-xl shadow-rose-100/60 border border-rose-100"
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-rose-100/60">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Trocar</span>
                </button>

                <span className="text-xs text-rose-600 font-semibold">
                  {isCustom ? customService : selectedProcedimento.nome.split('(')[0]}
                </span>
              </div>

              {/* SPECIAL QUIZ ANTI-FRIZZ GIFT BANNER (Requested by user) */}
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-pink-500/10 border-2 border-rose-200 shadow-sm relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-200">
                    <Gift className="w-5 h-5 animate-bounce" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider">
                        Presente Especial
                      </span>
                      <span className="text-xs font-bold text-stone-800">
                        E-book em PDF Gratuito!
                      </span>
                    </div>

                    <p className="text-xs text-stone-700 mt-1 leading-snug">
                      Cansada de lidar com cabelos ressecados e <strong>frizz</strong>? Responda nosso quiz rapido de 1 minuto e ganhe um <strong>PDF exclusivo de presente</strong> com o guia definitivo para eliminar o frizz dos fios!
                    </p>

                    <div className="mt-2.5">
                      <a
                        href="https://lleonardomarques.github.io/paginalead"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all transform active:scale-98"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Fazer Quiz & Ganhar PDF sobre Frizz</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mb-5">
                <span className="inline-block px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold uppercase tracking-wider mb-1.5 border border-rose-100">
                  Etapa 3 de 3
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  Escolha o Dia e Horario
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                  Quando será o seu momento ?
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Date Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Data Desejada *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-400">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-rose-400 focus:bg-white rounded-2xl text-stone-800 text-sm outline-none font-medium"
                      />
                    </div>
                    {data && (
                      <span className="text-[11px] text-stone-500 mt-1 block">
                        {formatDatePTBR(data)}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Horario Escolhido *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-400">
                        <Clock className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={horario}
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 text-sm font-bold outline-none cursor-default"
                      />
                    </div>
                  </div>
                </div>

                {/* HorÃ¡rios disponÃ­veis */}
                <div>
                  <span className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2">
                    Toque no horario de sua preferencia:
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                    {timeSlots.map((slot) => {
                      const isSelected = horario === slot;
                      return (
                        <button
                          type="button"
                          key={slot}
                          onClick={() => setHorario(slot)}
                          className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-rose-500 text-white shadow-md shadow-rose-200 scale-102'
                              : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ObservaÃ§Ãµes */}
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1">
                    Observação ou detalhe especial (opcional):
                  </label>
                  <textarea
                    rows={2}
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Ex: Cabelo com quimica anterior, tamanho longo, prefiro atendimento pela manhã..."
                    className="w-full p-2.5 bg-stone-50/70 border border-stone-200 focus:border-rose-400 rounded-2xl text-stone-800 text-xs outline-none"
                  />
                </div>

                {/* Submit Final Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:via-pink-600 hover:to-rose-500 text-white font-bold text-base shadow-xl shadow-rose-200/80 flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-75 group"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Enviando para o Servidor...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Finalizar e Confirmar Agendamento</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
};




