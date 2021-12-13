const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('../conexao');
const {
    schemaCadastrarUsuario,
    schemaEditarUsuario,
    schemaLogin
} = require('../validações/schemasYupUsuario');

async function cadastrarUsuario(req, res) {
    const { nome, email, senha, nome_loja } = req.body;

    try {
        await schemaCadastrarUsuario.validate(req.body);

        const usuarioEmail = await knex('usuarios')
            .where({ email })
            .first();

        if (usuarioEmail) {
            return res.status(400).json({
                mensagem: 'Email inserido já está sendo utilizado por outro usuário.'
            });
        };

        const encriptandoSenha = await bcrypt.hash(senha, 10);
        await knex('usuarios').insert({
            nome,
            email,
            senha: encriptandoSenha,
            nome_loja
        });

        return res.status(201).json();
    } catch ({ message }) {
        return res.status(400).json({ mensagem: message });
    };
};

async function editarUsuario(req, res) {
    const { usuario } = req;
    const { nome, email, senha, nome_loja } = req.body;

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            mensagem: 'Ao menos um campo deve ser modificado'
        });
    };

    try {
        await schemaEditarUsuario.validate(req.body);

        const emailExistente = await knex('usuarios')
            .where({ email })
            .whereNot({ id: usuario.id })
            .first();

        if (emailExistente) {
            return res.status(401).json({
                mensagem: 'Um usuário com esse email já existe.'
            });
        };

        let senhaEncriptada;
        if (senha) {
            senhaEncriptada = await bcrypt.hash(senha, 10);
        };

        await knex('usuarios')
            .where({ id: usuario.id })
            .update({
                nome: nome ? nome : usuario.nome,
                email: email ? email : usuario.email,
                senha: senha ? senhaEncriptada : usuario.senha,
                nome_loja: nome_loja ? nome_loja : usuario.nome_loja
            });

        return res.status(200).json();
    } catch ({ message }) {
        return res.status(400).json({
            mensagem: message
        });
    };
};

async function perfil(req, res) {
    const { usuario } = req;

    return res.status(200).json(usuario);
};

async function login(req, res) {
    const { email, senha } = req.body;
    try {
        await schemaLogin.validate(req.body);

        const usuario = await knex('usuarios').where({ email }).first();
        if (!usuario) {
            return res.status(404).json({
                mensagem: 'Usuário não encontrado.'
            });
        };

        const comparacaoDeSenhas = await bcrypt.compare(senha, usuario.senha);
        if (!comparacaoDeSenhas) {
            return res.status(401).json({
                mensagem: 'Email e senha não conferem.'
            });
        };

        const token = jwt.sign({ id: usuario.id }, process.env.SECRET_JWT, { expiresIn: '6h' });

        return res.status(200).json({ token: token });
    } catch ({ message }) {
        return res.status(400).json({ mensagem: message });
    };
};

module.exports = {
    cadastrarUsuario,
    editarUsuario,
    perfil,
    login
}