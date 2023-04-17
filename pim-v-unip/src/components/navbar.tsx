import React from "react";
type NavbarState = {
    login: boolean;
    registrar: boolean;
};
export default class Navbar extends React.Component<{}, NavbarState> {
    constructor(props: any) {
        super(props);
        this.state = {
            login: false,
            registrar: false
        };
    }

    handleLoginClick = () => {
        this.setState({ login: true, registrar: false });
    };

    handleRegistrarClick = () => {
        this.setState({ login: false, registrar: true });
    };

    render() {
        return (
            <div>
                <ul>
                    <li className={this.state.login ? "text-green-500" : "text-red-500"} onClick={this.handleLoginClick}>
                        Login
                    </li>
                    <li className={this.state.registrar ? "text-green-500" : "text-red-500"} onClick={this.handleRegistrarClick}>
                        Registrar
                    </li>
                </ul>
            </div>
        );
    }
}