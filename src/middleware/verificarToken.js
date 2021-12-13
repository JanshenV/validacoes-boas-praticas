const jwt = require('jsonwebtoken');
const knex = require('../conexao');


async function verificarToken(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." });
    };

    try {
        const token = authorization.replace('Bearer', '').trim();
        const { id } = jwt.verify(token, process.env.SECRET_JWT);

        const usuario = await knex('usuarios').where({ id }).first();
        if (!usuario) {
            return res.status(400).json({ mensagem: 'Usuário não encontrado.' });
        };

        const { senha, ...dadosUsuario } = usuario;
        req.usuario = dadosUsuario;

        next();
    } catch ({ message }) {
        return res.status(401).json({ mensagem: message });
    };
};

module.exports = { verificarToken }