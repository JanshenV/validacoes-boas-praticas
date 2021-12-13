const knex = require('../conexao');
const {
    schemaCadastrarProduto,
    schemaEditarProduto
} = require('../validações/schemasYupProdutos');

async function cadastrarProduto(req, res) {
    const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;
    const { usuario } = req;

    try {
        await schemaCadastrarProduto.validate(req.body);

        await knex('produtos')
            .insert({
                usuario_id: usuario.id,
                nome,
                quantidade,
                categoria,
                preco,
                descricao,
                imagem
            });

        return res.status(201).json();
    } catch ({ message }) {
        return res.status(400).json({ mensagem: message });
    };
};

async function editarProduto(req, res) {
    const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;
    const { usuario } = req;
    const { id } = req.params;

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            mensagem: "Ao menos um campo é necessário para edição."
        });
    };

    try {
        await schemaEditarProduto.validate(req.body);

        const produtoDoUsuario = await knex('produtos')
            .where({
                id,
                usuario_id: usuario.id
            })
            .first();


        if (!produtoDoUsuario) {
            return res.status(403).json({
                mensagem: `Não existe produto cadastrado com ID ${id} ou usuário não tem permissão para visualizar este produto.`
            });
        };

        const atualizaProduto = await knex('produtos')
            .where({ id })
            .update({
                nome: nome ? nome : produtoDoUsuario.nome,
                quantidade: quantidade ? quantidade : produtoDoUsuario.quantidade,
                categoria: categoria ? categoria : produtoDoUsuario.categoria,
                preco: preco ? preco : produtoDoUsuario.preco,
                descricao: descricao ? descricao : produtoDoUsuario.descricao,
                imagem: imagem ? imagem : produtoDoUsuario.imagem
            });

        return res.status(200).json();
    } catch ({ message }) {
        return res.status(400).json({ mensagem: message });
    };
};

async function excluirProduto(req, res) {
    const { id } = req.params;
    const { usuario } = req;

    try {

        const produtoDoUsuario = await knex('produtos')
            .where({
                id,
                usuario_id: usuario.id
            })
            .first();

        if (!produtoDoUsuario) {
            return res.status(401).json({
                mensagem: `Produto com id ${id} não pôde ser encontrado ou usuário não tem permissão para acessa-lo.`
            });
        } else {
            await knex('produtos')
                .where({ id })
                .del();
        };

        return res.status(200).json();
    } catch ({ message }) {
        return res.status(400).json({ mensagem: message });
    }
};

async function listarProdutos(req, res) {
    const { categoria } = req.query;
    const { usuario } = req;

    try {
        if (!categoria) {
            const produtosDoUsuario = await knex('produtos')
                .where({
                    usuario_id: usuario.id
                });
            return res.status(200).json(produtosDoUsuario);
        } else {
            const produtosPorCategoria = await knex('produtos')
                .where({
                    categoria,
                    usuario_id: usuario.id
                });
            return res.status(200).json(produtosPorCategoria);
        };
    } catch ({ message }) {
        return res.status(404).json({ mensagem: message });
    };
};

async function exibirUmProduto(req, res) {
    const { id } = req.params;
    const { usuario } = req;

    try {
        const produtoDoUsuario = await knex('produtos')
            .where({
                id,
                usuario_id: usuario.id
            }).first();

        if (!produtoDoUsuario) {
            return res.status(403).json({
                mensagem: `Não existe produto cadastrado com ID ${id} ou usuário não tem permissão para visualiza-lo.`
            });
        };

        return res.status(200).json(produtoDoUsuario);
    } catch ({ message }) {
        return res.status(400).json({ mensagem: message });
    };
};



module.exports = {
    cadastrarProduto,
    editarProduto,
    excluirProduto,
    listarProdutos,
    exibirUmProduto
}