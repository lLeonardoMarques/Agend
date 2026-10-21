import React, { useEffect, useState } from 'react';
import { API_URL } from '../api';
import { X, Calendar, Clock, Phone, Trash2, RefreshCw, CheckCircle, MessageCircle, AlertCircle } from 'lucide-react';
import { Agendamento } from '../types';
import { formatDatePTBR } from '../utils/formatters';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRefreshNeeded?: () => void;
}

export const AdminBookingsDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAgendamentos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/agendamentos`);
      if (!res.ok) throw new Error('Falha ao comunicar com o servidor');
      const data = await res.json();
      setAgendamentos(data.data || []);
    } catch (err: any) {
      console.error(err);
      setError('NÃ£o foi possÃ­vel carregar os agendamentos do servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAgendamentos();
    }
  }, [isOpen]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/agendamentos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAgendamentos((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Erro ao deletar:', err);
    }
  };

  const handleOpenWhatsApp = (tel: string, nome: string, proc: string, data: string, hora: string) => {
    const rawNumber = tel.replace(/\D/g, '');
    const cleanNumber = rawNumber.length === 11 ? `55${rawNumber}` : rawNumber;
    const msg = encodeURIComponent(`OlÃ¡ ${nome}! Aqui Ã© do Studio Glow. Confirmamos o seu agendamento de ${proc} para ${formatDatePTBR(data)} Ã s ${hora}. Qualquer dÃºvida estamos Ã  disposiÃ§Ã£o! ðŸŒ¸`);
    window.open(`https://wa.me/${cleanNumber}?text=${msg}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col border-l border-rose-100 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-rose-100 bg-gradient-to-r from-rose-50/70 to-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-serif text-lg font-bold text-stone-800">
                Agendamentos no Banco de Dados
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Recebidos em tempo real pelo servidor Node.js
            </p>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={fetchAgendamentos}
              disabled={loading}
              className="p-2 rounded-xl text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Atualizar lista"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/50">
          {loading && (
            <div className="text-center py-12 text-stone-400 text-sm">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-400" />
              Carregando agendamentos...
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              {error}
            </div>
          )}

          {!loading && agendamentos.length === 0 && !error && (
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 rounded-full bg-rose-100/70 text-rose-500 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-7 h-7" />
              </div>
              <h4 className="font-serif text-base font-semibold text-stone-700">Nenhum agendamento ainda</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Assim que uma cliente preencher o formulÃ¡rio na pÃ¡gina, o registro aparecerÃ¡ aqui instantaneamente!
              </p>
            </div>
          )}

          {!loading && agendamentos.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-rose-200 shadow-xs transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-semibold border border-rose-100 uppercase tracking-wider">
                    {item.status || 'Confirmado'}
                  </span>
                  <h4 className="font-serif font-bold text-stone-900 text-base mt-1">
                    {item.nome}
                  </h4>
                  <div className="text-xs text-rose-600 font-medium">
                    {item.procedimento} {item.procedimentoPreco && `â€¢ ${item.procedimentoPreco}`}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir agendamento"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs text-stone-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-rose-400" />
                  <span className="truncate">{item.data ? formatDatePTBR(item.data) : 'Data flexÃ­vel'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  <span>{item.horario}</span>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>{item.telefone}</span>
                </div>

                <button
                  onClick={() => handleOpenWhatsApp(item.telefone, item.nome, item.procedimento, item.data, item.horario)}
                  className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium flex items-center gap-1.5 transition-colors border border-emerald-200"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  WhatsApp
                </button>
              </div>

              {item.observacoes && (
                <div className="mt-2 p-2 rounded-xl bg-stone-50 text-[11px] text-stone-600 italic">
                  "{item.observacoes}"
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 text-center text-[11px] text-stone-500">
          Dados sincronizados com <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-700 font-mono">/api/agendamentos</code>
        </div>

      </div>
    </div>
  );
};



