import Link from "next/link";
import { Component } from "react";
import { FormEvent } from "react";
import Image from "next/image";
import Style from '@/styles/index.module.css'
type LoginProps = {};
// Define a interface LoginState contendo as propriedades email e password, ambas do tipo string
type LoginState = {
    email: string;
    password: string;
};

export default class LoginPage extends Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props);

        this.state = {
            email: "",
            password: "",
        };
    }

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        this.setState({ [name]: value } as Pick<LoginState, keyof LoginState>);
    };

    handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { email, password } = this.state;
        // Converte a resposta da API em um objeto JavaScript
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, senha: password }),
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("token", data.token);
            alert("Usuário logado com sucesso!");
            window.location.replace('/produtos');
        } else {
            alert(data.message);
        }
    };

    render() {
        // Define o método de renderização da classe LoginPage
        return (
            <div className={Style.container} >
                <Image src="/logo.png" width={783} height={319} alt='logo' />



                <form className={Style.form}  onSubmit={this.handleSubmit}>
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
                    /> <br />
                    <button className="btn btn-accent" type="submit">Login</button>
                </form>
            </div>
        );
    }
}
