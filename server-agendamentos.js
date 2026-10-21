// server-agendamentos.js - Servidor separado para agendamentos
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT_AGENDAMENTOS || 5000;

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGO_URI_AGENDAMENTOS;

if (!MONGODB_URI) {
  console.error('MONGO_URI_AGENDAMENTOS nao definida no .env');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB Atlas (banco: agend)'))
  .catch((err) => console.error('Erro na conexao MongoDB:', err));

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

app.post('/api/agendamentos', async (req, res) => {
  try {
    const { nome, telefone, procedimento, procedimentoPreco, data, horario, observacoes } = req.body;

    if (!nome || !telefone || !procedimento) {
      return res.status(400).json({
        success: false,
        error: 'Nome, Telefone e Procedimento sao obrigatorios.'
      });
    }

    const novoAgendamento = new Agendamento({
      nome, telefone, procedimento, procedimentoPreco, data, horario, observacoes
    });

    await novoAgendamento.save();
    console.log('Novo agendamento salvo:', novoAgendamento);

    return res.status(201).json({
      success: true,
      message: 'Agendamento salvo com sucesso!',
      data: novoAgendamento
    });
  } catch (error) {
    console.error('Erro ao salvar:', error);
    return res.status(500).json({ success: false, error: 'Erro interno ao salvar agendamento' });
  }
});

app.get('/api/agendamentos', async (req, res) => {
  try {
    const agendamentos = await Agendamento.find().sort({ criadoEm: -1 });
    res.json({ success: true, count: agendamentos.length, data: agendamentos });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erro ao buscar agendamentos' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de agendamentos rodando na porta ${PORT}`);
});
