const express = require('express');
const {
    cadastrarUsuario,
    login,
    perfil,
    editarUsuario
} = require('./controladores/Usuarios');

const { verificarToken } = require('./middleware/VerifiesToken');

const {
    cadastrarProduto,
    listarProdutos,
    exibirUmProduto,
    editarProduto,
    excluirProduto
} = require('./controladores/Produtos');


const rotas = express();

//Rotas de usuários;
rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', login);

//Middleware
rotas.use(verificarToken);

//Rotas de usuários;
rotas.get('/usuario', perfil);
rotas.put('/usuario', editarUsuario);

//Rotas de produtos;
rotas.post('/produtos', cadastrarProduto);
rotas.get('/produtos', listarProdutos);
rotas.get('/produtos/:id', exibirUmProduto);
rotas.put('/produtos/:id', editarProduto);
rotas.delete('/produtos/:id', excluirProduto);


module.exports = rotas;