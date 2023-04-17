import Link from "next/link";
import { Component } from "react";
import { FormEvent } from "react";
import Image from "next/image";
import Style from '@/styles/index.module.css'

type LoginProps = {};
// Define uma interface com as propriedades de estado do componente

type LoginState = {
    nome: string;
    email: string;
    password: string;
};

export default class LoginPage extends Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props);
        // Define o estado inicial do componente
        this.state = {
            nome: "",
            email: "",
            password: "",
        };
    }
     // Função chamada quando os valores dos inputs mudam
    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        this.setState({ [name]: value } as Pick<LoginState, keyof LoginState>);
    };
    // Função chamada quando o formulário é submetido
    handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { email, password } = this.state;
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, senha: password, nome: this.state.nome }),
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("token", data.token);
            alert("Usuário cadastrado com sucesso!");
            window.location.replace('/');
        } else {
            alert(data.message);
        }
    };

    render() {
                // Renderiza o componente
        return (
            <div className={Style.container}>
                <Link href="/"><Image src="/logo.png" width={783} height={319} alt='logo' /> </Link>
                <form className={Style.form} onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nome"
                        name="nome"
                        className="input w-full max-w-xs"
                        value={this.state.nome}
                        onChange={this.handleInputChange}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        className="input w-full max-w-xs"
                        value={this.state.email}
                        onChange={this.handleInputChange}
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        name="password"
                        className="input w-full max-w-xs"
                        value={this.state.password}
                        onChange={this.handleInputChange}
                    />
                    <button className="btn btn-accent" type="submit">Registrar</button>
                </form></div>
        );
    }
}
