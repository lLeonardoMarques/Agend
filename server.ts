import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

interface Agendamento {
  id: string;
  nome: string;
  telefone: string;
  procedimento: string;
  procedimentoPreco?: string;
  data: string;
  horario: string;
  observacoes?: string;
  criadoEm: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
}

// Local mock database file
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'agendamentos.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initialData: Agendamento[] = [
      {
        id: 'agend_sample_1',
        nome: 'Camila Andrade',
        telefone: '(11) 98765-4321',
        procedimento: 'Extensão de Cílios (Volume Russo)',
        procedimentoPreco: 'R$ 180',
        data: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        horario: '14:30',
        observacoes: 'Primeira vez no estúdio.',
        criadoEm: new Date().toISOString(),
        status: 'confirmado',
      },
    ];
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

function getAgendamentos(): Agendamento[] {
  try {
    ensureDataFile();
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Erro ao ler agendamentos:', err);
    return [];
  }
}

function saveAgendamentos(list: Agendamento[]) {
  try {
    ensureDataFile();
    fs.writeFileSync(DB_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Erro ao salvar agendamentos:', err);
  }
}

// Check MongoDB status
const hasMongoUri = Boolean(process.env.MONGODB_URI);

// API Endpoints
app.get('/api/status', (req: Request, res: Response) => {
  const agendamentos = getAgendamentos();
  res.json({
    online: true,
    server: 'Node.js Express',
    database: hasMongoUri ? 'MongoDB Atlas (Conectado)' : 'Servidor Node.js Ativo (JSON Store / Mock Pronto para MongoDB)',
    totalAgendamentos: agendamentos.length,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/agendamentos', (req: Request, res: Response) => {
  const list = getAgendamentos();
  res.json({
    success: true,
    count: list.length,
    data: list.sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()),
  });
});

app.post('/api/agendamentos', (req: Request, res: Response) => {
  const { nome, telefone, procedimento, procedimentoPreco, data, horario, observacoes } = req.body;

  if (!nome || !telefone || !procedimento) {
    return res.status(400).json({
      success: false,
      error: 'Campos obrigatórios ausentes: Nome, Telefone e Procedimento são indispensáveis.',
    });
  }

  const novoAgendamento: Agendamento = {
    id: 'agend_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    nome: String(nome).trim(),
    telefone: String(telefone).trim(),
    procedimento: String(procedimento).trim(),
    procedimentoPreco: procedimentoPreco ? String(procedimentoPreco).trim() : undefined,
    data: data ? String(data).trim() : new Date().toISOString().split('T')[0],
    horario: horario ? String(horario).trim() : '14:00',
    observacoes: observacoes ? String(observacoes).trim() : undefined,
    criadoEm: new Date().toISOString(),
    status: 'confirmado',
  };

  const list = getAgendamentos();
  list.unshift(novoAgendamento);
  saveAgendamentos(list);

  console.log(`[Agendamento Recebido] ${novoAgendamento.nome} - ${novoAgendamento.procedimento} (${novoAgendamento.telefone})`);

  return res.status(201).json({
    success: true,
    message: 'Agendamento registrado com sucesso no banco de dados!',
    data: novoAgendamento,
  });
});

app.delete('/api/agendamentos/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const list = getAgendamentos();
  const filtered = list.filter((a) => a.id !== id);
  saveAgendamentos(filtered);
  res.json({ success: true, message: 'Agendamento removido' });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌸 Servidor Studio Glow rodando em http://localhost:${PORT}`);
    console.log(`💾 Banco de dados local preparado.`);
  });
}

startServer();
