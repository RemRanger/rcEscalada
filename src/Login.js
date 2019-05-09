import React, { Component } from 'react';
import { getApiUrl } from "./Utils";
import { Redirect, Link } from "react-router-dom";

class Login extends Component
{
    constructor(props)
    {
        super(props);

        this.state =
            {
                userName: '',
                password: '',
                touched: false,
                urlApiLoginRead: getApiUrl('user-login', 'read'),
                user: null
            }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    isValid()
    {
        return this.state.userName.length > 0 && this.state.password.length > 0;
    }

    isTouched()
    {
        return this.state.touched;
    }

    handleChange(event)
    {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value, touched: true });
    }

    handleSubmit(event)
    {
        event.preventDefault();

        this.getUserAsync();
    }

    getUserAsync = async () =>
    {
        let formData = new FormData();
        formData.append('userName', this.state.userName);
        formData.append('password', this.state.password);

        let response = await fetch(this.state.urlApiLoginRead,
            {
                method: 'post',
                body: formData
            });
        let data = null;
        try
        {
            data = await response.json();
            console.log("Getting user data:", data);
        }
        finally
        {
            this.setState({ user: data });
            console.log("Login user:", this.state.user);
            this.props.onLoggedIn(data);
        }
        return data;
    }

    render()
    {
        if (this.state.user == null || this.state.user.id < 0)
        {
            return (
                <div style={{ textAlign: 'center' }}>
                    <h1>Login</h1>
                    <form onSubmit={this.handleSubmit} noValidate>
                        <table align="center">
                            <tbody>
                                <tr>
                                    <td>
                                        <input type="text" placeholder="Your user name" name="userName" value={this.state.userName} required
                                            onChange={this.handleChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input type="password" placeholder="Your Password" name="password" value={this.state.password} required
                                            onChange={this.handleChange} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {!this.isValid() && this.isTouched() ? <div style={{ color: 'red' }}>Please provide a user name and password..</div> : ''}
                        {this.state.user != null && this.state.user.id < 0 ? <div style={{ color: 'red' }}>User name or password are incorrect.</div> : ""}
                        <br />
                        <button disabled={!this.isValid()} type="submit" value="Submit">Login</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Link to="/register">Register</Link>
                    </form >
                </div >
            );
        }
        else
            return (
                <Redirect to={`/sessions/${this.state.user.id}`} />
            );
    }
}

export default Login;