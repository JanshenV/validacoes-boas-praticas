const yup = require('yup');
const { setLocale } = require('yup');
const { pt } = require('yup-locales');
setLocale(pt);


const schemaCadastrarProduto = yup.object().shape({
    nome: yup.string().required(),
    quantidade: yup.number().required(),
    preco: yup.number().strict().required(),
    descricao: yup.string().required(),
    imagem: yup.string()
});

const schemaEditarProduto = yup.object().shape({
    nome: yup.string(),
    quantidade: yup.number(),
    preco: yup.number().strict(),
    descricao: yup.string(),
    imagem: yup.string()
});


module.exports = {
    schemaCadastrarProduto,
    schemaEditarProduto
}