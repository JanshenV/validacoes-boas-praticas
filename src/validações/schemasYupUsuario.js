const yup = require('yup');
const { setLocale } = require('yup');
const { pt } = require('yup-locales');
setLocale(pt);


const schemaCadastrarUsuario = yup.object().shape({
    nome: yup.string().required(),
    email: yup.string().email().required(),
    senha: yup.string().min(6).required(),
    nome_loja: yup.string().strict().required()
});

const schemaEditarUsuario = yup.object().shape({
    nome: yup.string(),
    email: yup.string().email(),
    senha: yup.string().min(6),
    nome_loja: yup.string().strict()
});

const schemaLogin = yup.object().shape({
    email: yup.string().email().required(),
    senha: yup.string(6).required()
});



module.exports = {
    schemaCadastrarUsuario,
    schemaEditarUsuario,
    schemaLogin
};