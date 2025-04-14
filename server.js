import express from "express";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";

const PORT = 3333;

const app = express();
app.use(cors({
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());

const pessoas = [];
const tokens = [];


app.post("/login", (req, res) => {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
        return res.status(400).json({ message: "Email e senha são obrigatórios" });
    }
    
    const pessoa = pessoas.find(p => p.email === email && p.senha === senha);
    
    if (!pessoa) {
        return res.status(401).json({ message: "Email ou senha incorretos" });
    }
    
    const token = uuidv4();
    tokens.push({ token, userId: pessoa.id });
    
    res.status(200).json({ message: "Login realizado com sucesso", token });
});



app.get("/pessoas", (req, res) => {
    res.status(200).json(pessoas);
});

app.post("/pessoas", (req, res) => {
    const { nome, email, senha, link_img } = req.body;
    
    if (!nome) {
        return res.status(400).json({ message: "Nome é obrigatório" });
    }
    
    if (!email) {
        return res.status(400).json({ message: "Email é obrigatório" });
    }
    
    if (!senha) {
        return res.status(400).json({ message: "Senha é obrigatório" });
    }
    
    if (!link_img) {
        return res.status(400).json({ message: "Imagem é obrigatório" });
    }
    
    const emailExiste = pessoas.some(p => p.email === email);
    if (emailExiste) {
        return res.status(400).json({ message: "Este email já está cadastrado" });
    }
    
    const pessoa = {
        id: uuidv4(),
        nome,
        email,
        senha,
        link_img
    };
    
    pessoas.push(pessoa);
    res.status(201).json({ message: "Cadastro realizado", pessoa });
});

app.get("/pessoas/:id", (req, res) => {
    const { id } = req.params;
    
    const encontrarPessoa = pessoas.findIndex((pessoa) => pessoa.id === id);
    if (encontrarPessoa === -1) {
        return res.status(400).json({ message: "Pessoa não encontrada" });
    }
    
    const pessoaEncontrada = pessoas[encontrarPessoa];
    
    res.status(200).json(pessoaEncontrada);
});

app.put("/pessoas/:id", (req, res) => {
    const { id } = req.params;
    const { nome, email, senha, link_img } = req.body;
    
    const encontrarPessoa = pessoas.findIndex((pessoa) => pessoa.id === id);
    if (encontrarPessoa === -1) {
        return res.status(400).json({ message: "Pessoa não encontrada" });
    }
    
    if (!nome || !email || !senha || !link_img) {
        return res.status(400).json({ message: "Nome, Email, Senha e link de imagem são obrigatórios" });
    }
    
    const emailExiste = pessoas.some(p => p.email === email && p.id !== id);
    if (emailExiste) {
        return res.status(400).json({ message: "Este email já está sendo usado por outro usuário" });
    }
    
    const pessoaAtualizada = {
        id,
        nome,
        email,
        senha,
        link_img
    };
    
    pessoas[encontrarPessoa] = pessoaAtualizada;
    res.status(200).json({ message: "Pessoa Atualizada", pessoaAtualizada });
});

app.delete("/pessoas/:id", (req, res) => {
    const { id } = req.params;
    
    const encontrarPessoa = pessoas.findIndex((pessoa) => pessoa.id === id);
    if (encontrarPessoa === -1) {
        return res.status(400).json({ message: "Pessoa não encontrada" });
    }
    
    pessoas.splice(encontrarPessoa, 1);
    res.status(200).json({ message: "Pessoa excluída" });
});

app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});
console.log(pessoas);