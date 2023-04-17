

import React from "react";
import axios from "axios";
import { FormEvent } from "react";
import Style from "@/styles/index.module.css"
// Define os tipos de dados para o objeto Produto e o estado da classe Produtos
type Produto = {
    id: number;
    nome: string;
    desc: string;
    linkImg: string;
    createdAt: string;
    updatedAt: string;
    quemCadastrouId: string;
    quemCadastrou: string;
    emprestado: boolean;
};

type State = {
    produto: Produto;
    produtos: Produto[];
};
// Define um tipo de estado para a submissão de um novo produto
type ProductSubmitState = {
    nome: string;
    desc: string;
    linkImg: string;
}
// Define a classe Produtos como um componente React
class Produtos extends React.Component<{}, State> {
    // Inicializa o estado da classe com um objeto Produto vazio e uma matriz de produtos vazia
    state: State = {
        produto: {} as Produto,
        produtos: [],
    };
    // Manipula as mudanças nos valores de entrada do formulário e atualiza
    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        this.setState({
            produto: {
                ...this.state.produto,
                [name]: value,
            },
        });
    };
    // Manipula a submissão do formulário para cadastrar um novo produto
    handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { nome, desc, linkImg } = this.state.produto;
        try {
            const response = await axios.post("/api/cadastrar", {
                nome: nome,
                desc: desc,
                linkImg: linkImg
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (response.status !== 200) {
                alert("Erro ao cadastrar produto");
                return;
            }
            this.setState({ produto: {} as Produto, produtos: [...this.state.produtos, response.data] });
        } catch (error) {
            console.error(error);
        }
        window.location.reload();
    };
    // Manipula o clique no botão "Deletar" para excluir um produto
    handleDelete = async (id: number) => {
        try {
            const response = await axios.post(`/api/deletar`, { id: id }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },

            });
            if (response.status === 200) {
                // Remove the deleted product from the state
                const updatedProdutos = this.state.produtos.filter(p => p.id !== id);
                this.setState({ produtos: updatedProdutos });
            } else {
                alert("Erro ao deletar produto");
            }
        } catch (error) {
            console.error(error);
        }
    }
    async componentDidMount() {
        try {
            const response = await axios.get<Produto[]>("/api/listar", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            this.setState({ produtos: response.data });
        } catch (error) {
            console.error(error);
        }
    }
    // Busca o usuário que cadastrou um determinado produto pelo ID
    getUser = async (id: number, idQuemCriou: string) => {
        try {
            const response = await axios.post(`/api/idparausuario`, {
                id: idQuemCriou,
            })
            if (response.status === 200) {
                alert(`O usuário ${response.data.nome} cadastrou esse produto`)
            } else {
                alert("Erro ao buscar usuário")
            }
        } catch (error) {
            console.error(error);
        }
    };
    // Manipula o clique no botão "Emprestar/Devolver" para emprestar ou devolver um produto
    emprestar = async (id: number) => {
        try {
            const response = await axios.post(`/api/emprestar`, {
                id: id,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            if (response.status === 200) {
                alert(`O produto foi emprestado/devolvido com sucesso`)
                window.location.reload();
            } else {
                alert("Erro ao emprestar produto")
            }
        } catch (error) {
            console.error(error);
        }
    };

    render() {
        const { produtos } = this.state;
        console.log(produtos)
        return (
            <div>
                <form className={Style.form} onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nome Produto"
                        name="nome"
                        value={this.state.produto.nome}
                        onChange={this.handleInputChange}
                        className="input w-full max-w-xs"
                    />
                    <input
                        type="text"
                        placeholder="Descrição"
                        name="desc"
                        className="input w-full max-w-xs"
                        value={this.state.produto.desc}
                        onChange={this.handleInputChange}
                    />
                    <input
                        type="text"
                        placeholder="Link Imagem"
                        name="linkImg"
                        className="input w-full max-w-xs"
                        value={this.state.produto.linkImg}
                        onChange={this.handleInputChange}
                    />
                    <button className="btn btn-accent" type="submit">Cadastrar</button>
                </form>
                <div className={Style.produtos}>
                    {produtos.map((produto) => (
                        <div className="card w-96 bg-base-100 shadow-xl" key={produto.id}>
                            <figure><img src={produto.linkImg} alt="Shoes" /></figure>
                            {/* <h2>Nome: {produto.nome}</h2>
                            <p>{produto.desc}</p>
                            <button onClick={() => this.getUser(produto.id, produto.quemCadastrouId)}>Quem Cadastrou?</button>
                            <p>{produto.createdAt}</p>
                            <p>Emprestado: {produto.emprestado ? "Sim" : "Não"}</p>
                            <button onClick={() => this.emprestar(produto.id)}>Emprestar/Devolver</button>
                            <img src={produto.linkImg} width={100} height={100} />
                            <button onClick={() => this.handleDelete(produto.id)}>Deletar</button> */}
                            <div className="card-body">
                                <h2 className="card-title">{produto.nome}</h2>
                                <p>{produto.desc} <br />
                                    Criado em: {produto.createdAt} <br />
                                    Emprestado: {produto.emprestado ? "Sim" : "Não"}
                                </p>
                                <div className="card-actions justify-center">
                                    <button className="btn btn-primary" onClick={() => this.getUser(produto.id, produto.quemCadastrouId)}>Quem Cadastrou?</button>
                                    <button className="btn btn-accent" onClick={() => this.emprestar(produto.id)}>{produto.emprestado ? "Devolver" : "Emprestar"}</button>
                                    <button onClick={() => this.handleDelete(produto.id)} className="btn btn-error">Deletar</button>
                                </div>
                            </div>
                        </div>
                    ))} </div>

            </div>
        );
    }
}

export default Produtos;
