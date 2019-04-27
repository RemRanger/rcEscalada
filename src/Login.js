import React, { Component } from 'react';
import { getApiUrl } from "./Utils";

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
            console.log("User:", this.state.user);
        }
        return data;
    }

    render()
    {
        return (
            <div style={{ textAlign: 'center' }}>
                <h1>Login</h1>
                {this.state.user ? <p>Logged in as {this.state.user.firstName}</p>
                :
                (
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
                    <br />
                    <button disabled={!this.isValid()} type="submit" value="Submit">Login</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {/*<a>Register</a>*/}
                </form >
                )}
            </div >
        );
    }
}

export default Login;