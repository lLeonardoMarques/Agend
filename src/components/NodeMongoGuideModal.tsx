import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Server, 
  Copy, 
  Check, 
  Sparkles, 
  Terminal, 
  ExternalLink,
  ShieldCheck,
  Cpu,
  Layers
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NodeMongoGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'mongodb' | 'server' | 'deploy'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const serverJsCode = `// server.js - Servidor Node.js com Express e MongoDB Atlas
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// 1. Conexão com MongoDB Atlas Online
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://<usuario>:<senha>@cluster0.xxxxx.mongodb.net/studio_glow?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Conectado com sucesso ao MongoDB Atlas!'))
  .catch((err) => console.error('❌ Erro na conexão MongoDB:', err));

// 2. Modelo do Banco de Dados (Schema)
const AgendamentoSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  telefone: { type: String, required: true, trim: true },
  procedimento: { type: String, required: true, trim: true },
  procedimentoPreco: { type: String },
  data: { type: String, required: true },
  horario: { type: String, required: true },
  observacoes: { type: String, trim: true },
  status: { type: String, enum: ['confirmado', 'pendente', 'cancelado'], default: 'confirmado' },
  criadoEm: { type: Date, default: Date.now }
});

const Agendamento = mongoose.model('Agendamento', AgendamentoSchema);

// 3. Rota para receber o formulário da cliente
app.post('/api/agendamentos', async (req, res) => {
  try {
    const { nome, telefone, procedimento, procedimentoPreco, data, horario, observacoes } = req.body;

    if (!nome || !telefone || !procedimento) {
      return res.status(400).json({ 
        success: false, 
        error: 'Nome, Telefone e Procedimento são obrigatórios.' 
      });
    }

    const novoAgendamento = new Agendamento({
      nome,
      telefone,
      procedimento,
      procedimentoPreco,
      data,
      horario,
      observacoes
    });

    await novoAgendamento.save();

    console.log('🌸 Novo agendamento salvo no MongoDB:', novoAgendamento);

    return res.status(201).json({
      success: true,
      message: 'Agendamento salvo com sucesso no MongoDB!',
      data: novoAgendamento
    });
  } catch (error) {
    console.error('Erro ao salvar no banco:', error);
    return res.status(500).json({ success: false, error: 'Erro interno ao salvar agendamento' });
  }
});

// 4. Rota para listar os agendamentos no painel da dona
app.get('/api/agendamentos', async (req, res) => {
  try {
    const agendamentos = await Agendamento.find().sort({ criadoEm: -1 });
    res.json({ success: true, count: agendamentos.length, data: agendamentos });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erro ao buscar agendamentos' });
  }
});

app.listen(PORT, () => {
  console.log(\`🚀 Servidor rodando na porta \${PORT}\`);
});`;

  const packageJsonCode = `{
  "name": "studio-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "mongoose": "^8.3.0"
  }
}`;

  const envFileCode = `# Arquivo .env
PORT=5000
MONGODB_URI="mongodb+srv://seu_usuario:sua_senha@cluster0.xxxxx.mongodb.net/studio_glow?retryWrites=true&w=majority"`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-rose-100 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-rose-50 via-white to-amber-50/50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-400 to-rose-300 flex items-center justify-center text-white shadow-md shadow-rose-200">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-800">
                Como Criar o Servidor Node & MongoDB Online
              </h3>
              <p className="text-xs sm:text-sm text-stone-500">
                Guia prático passo a passo com código pronto para copiar e rodar
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-stone-200 bg-stone-50 px-4 py-2 gap-2 text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              activeTab === 'overview'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            💡 Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('mongodb')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              activeTab === 'mongodb'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            🍃 1. MongoDB Atlas Online
          </button>
          <button
            onClick={() => setActiveTab('server')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              activeTab === 'server'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            ⚡ 2. Servidor Node.js
          </button>
          <button
            onClick={() => setActiveTab('deploy')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              activeTab === 'deploy'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            🚀 3. Onde Hospedar Grátis
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-stone-700 text-sm leading-relaxed">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-100 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-stone-700">
                  <strong className="text-stone-900 block mb-1">Como essa página de agendamento funciona:</strong>
                  Quando a cliente clica no link, escolhe o procedimento e digita seu número de WhatsApp, os dados são enviados diretamente via requisição <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-rose-200 text-rose-700">POST /api/agendamentos</span> para o seu servidor Node.js, que grava instantaneamente no banco de dados MongoDB online na nuvem.
                </div>
              </div>

              {/* Fluxo Visual */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm text-center">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 mx-auto mb-2 flex items-center justify-center font-bold">1</div>
                  <h4 className="font-semibold text-stone-900 text-sm">Cliente Preenche</h4>
                  <p className="text-xs text-stone-500 mt-1">Nome, Telefone, Procedimento e Horário no celular ou computador.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm text-center">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 mx-auto mb-2 flex items-center justify-center font-bold">2</div>
                  <h4 className="font-semibold text-stone-900 text-sm">Servidor Node.js</h4>
                  <p className="text-xs text-stone-500 mt-1">Recebe o JSON, valida os campos e chama o Mongoose para salvar.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm text-center">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 mx-auto mb-2 flex items-center justify-center font-bold">3</div>
                  <h4 className="font-semibold text-stone-900 text-sm">MongoDB Atlas</h4>
                  <p className="text-xs text-stone-500 mt-1">Banco na nuvem 24/7 seguro onde você consulta todos os clientes.</p>
                </div>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs sm:text-sm">
                <span className="font-semibold text-stone-900">✨ Dica:</span> Este próprio app já conta com uma API interna pronta rodando em Express no arquivo <code className="bg-stone-200 px-1 py-0.5 rounded">server.ts</code>. Para conectar no seu próprio MongoDB Atlas definitivo, basta configurar a variável <code className="bg-stone-200 px-1 py-0.5 rounded">MONGODB_URI</code>!
              </div>
            </div>
          )}

          {/* TAB: MONGODB */}
          {activeTab === 'mongodb' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h4 className="font-semibold text-stone-900 text-base flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                Criando o Banco Gratuito no MongoDB Atlas Online
              </h4>

              <ol className="space-y-3 list-decimal list-inside text-stone-700 text-xs sm:text-sm">
                <li className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <strong>Acesse o site oficial:</strong> Entre em <a href="https://www.mongodb.com/cloud/atlas" target="_blank" rel="noreferrer" className="text-rose-600 underline font-semibold inline-flex items-center gap-1">mongodb.com/cloud/atlas <ExternalLink className="w-3 h-3" /></a> e crie uma conta gratuita.
                </li>
                <li className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <strong>Crie um Cluster Gratuito (M0):</strong> Escolha o plano <em>Free / Shared (M0)</em> com provedor AWS (qualquer região próxima, como São Paulo <code className="bg-stone-200 px-1 rounded">sa-east-1</code> ou US). Não é necessário cartão de crédito.
                </li>
                <li className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <strong>Crie o Usuário do Banco:</strong> Defina um nome de usuário (ex: <code className="bg-stone-200 px-1 rounded">admin_studio</code>) e uma senha segura. Guarde essa senha!
                </li>
                <li className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <strong>Network Access (Liberar IP):</strong> Em "Network Access", clique em <em>Add IP Address</em> e escolha <strong>Allow Access From Anywhere (0.0.0.0/0)</strong> para que seu servidor consiga conectar de qualquer lugar.
                </li>
                <li className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <strong>Copie a Connection String:</strong> Clique em <em>Connect</em> &gt; <em>Drivers (Node.js)</em> e copie o link.
                </li>
              </ol>

              <div className="p-3 bg-stone-900 rounded-xl text-stone-200 font-mono text-xs overflow-x-auto relative">
                <div className="flex justify-between items-center mb-1 text-stone-400 text-[11px]">
                  <span>Exemplo de Connection String:</span>
                  <button
                    onClick={() => copyToClipboard('mongodb+srv://admin:suasenha@cluster0.abcde.mongodb.net/studio_glow?retryWrites=true&w=majority', 'mongo_str')}
                    className="flex items-center gap-1 text-rose-300 hover:text-white"
                  >
                    {copiedKey === 'mongo_str' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedKey === 'mongo_str' ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
                <code>mongodb+srv://&lt;usuario&gt;:&lt;senha&gt;@cluster0.abcde.mongodb.net/studio_glow?retryWrites=true&w=majority</code>
              </div>
            </div>
          )}

          {/* TAB: SERVER */}
          {activeTab === 'server' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-stone-900 text-sm sm:text-base flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-rose-500" />
                  Código Completo do Servidor Node.js (<code className="text-xs bg-stone-100 px-1.5 py-0.5 rounded">server.js</code>)
                </h4>
                <button
                  onClick={() => copyToClipboard(serverJsCode, 'server_code')}
                  className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  {copiedKey === 'server_code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'server_code' ? 'Copiado!' : 'Copiar Código'}
                </button>
              </div>

              <div className="bg-stone-900 text-stone-100 p-3 sm:p-4 rounded-2xl font-mono text-xs overflow-x-auto max-h-72 border border-stone-800">
                <pre>{serverJsCode}</pre>
              </div>

              {/* Pacotes necessários */}
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-stone-800 text-xs">Comando de Instalação no Terminal:</span>
                  <button
                    onClick={() => copyToClipboard('npm install express mongoose cors dotenv', 'npm_cmd')}
                    className="text-xs text-rose-600 font-medium flex items-center gap-1"
                  >
                    {copiedKey === 'npm_cmd' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedKey === 'npm_cmd' ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
                <div className="bg-stone-900 text-emerald-400 p-2.5 rounded-xl font-mono text-xs">
                  npm install express mongoose cors dotenv
                </div>
              </div>

              {/* package.json */}
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-stone-800 text-xs">package.json:</span>
                  <button
                    onClick={() => copyToClipboard(packageJsonCode, 'pkg_json')}
                    className="text-xs text-rose-600 font-medium flex items-center gap-1"
                  >
                    {copiedKey === 'pkg_json' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedKey === 'pkg_json' ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
                <div className="bg-stone-900 text-stone-300 p-2.5 rounded-xl font-mono text-xs max-h-36 overflow-y-auto">
                  <pre>{packageJsonCode}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DEPLOY */}
          {activeTab === 'deploy' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h4 className="font-semibold text-stone-900 text-base">
                Onde Colocar o Servidor Node e o Banco Online de Graça
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">Recomendado</span>
                  <h5 className="font-bold text-stone-900 mt-2">Render.com</h5>
                  <p className="text-xs text-stone-600 mt-1">
                    Crie um <em>Web Service</em> gratuito conectado ao seu repositório GitHub. Configure a variável de ambiente <code className="bg-stone-200 px-1 rounded">MONGODB_URI</code>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider">Super Rápido</span>
                  <h5 className="font-bold text-stone-900 mt-2">Railway.app</h5>
                  <p className="text-xs text-stone-600 mt-1">
                    Deploy em 1 clique direto do GitHub com suporte nativo a Node.js e MongoDB integrado.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900">
                <strong>🔒 Dica de Segurança:</strong> Nunca coloque sua senha do MongoDB diretamente no código fonte público do GitHub. Utilize sempre o arquivo <code className="bg-white/80 px-1.5 py-0.5 rounded font-mono">.env</code> com a variável <code className="bg-white/80 px-1.5 py-0.5 rounded font-mono">MONGODB_URI</code>.
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Código pronto para produção com Mongoose e Express</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs sm:text-sm font-medium transition-colors"
          >
            Entendi, Voltar ao Agendamento
          </button>
        </div>

      </div>
    </div>
  );
};
