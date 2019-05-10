import React, { Component } from 'react';
import { getApiUrl } from "./Utils";
import { Redirect } from "react-router-dom";

class Register extends Component
{
    constructor(props)
    {
        super(props);

        this.state =
            {
                firstName: "",
                lastName: "",
                gender: "",
                email: "",
                userName: "",
                password: "",
                passwordMatch: "",
                touched: false,
                submitted: false,
                urlApiCreate: getApiUrl("user", "create"),
            }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    isValid()
    {
        return this.state.firstName.length > 0 && this.state.lastName.length > 0 && this.state.gender.length > 0 && this.state.email.length > 0 && this.state.userName.length > 0 &&
            this.state.password.length > 0 && this.state.password === this.state.passwordMatch;
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

        console.log("change: ", name, value);
    }

    handleSubmit(event)
    {
        event.preventDefault();

        this.submitAsync();
    }

    submitAsync = async () =>
    {
        let formData = new FormData();
        formData.append('firstName', this.state.firstName);
        formData.append('lastName', this.state.lastName);
        formData.append('gender', this.state.gender);
        formData.append('email', this.state.email);
        formData.append('userName', this.state.userName);
        formData.append('password', this.state.password);

        let response = null;
        response = await fetch(this.state.urlApiCreate,
            {
                method: 'post',
                body: formData
            });

        let data = null;
        try
        {
            console.log("Submit");
            data = await response.json();
            console.log("Getting response:", data);
            this.setState({ submitted: true });
        }
        finally
        {
        }
        return data;
    }

    render()
    {
        if (!this.state.submitted)
        {
            return (
                <div style={{ textAlign: 'center' }}>
                    <form method="post" noValidate onSubmit={this.handleSubmit}>
                        <table align="center">
                            <tr class="noalt"><td class="noborder"><label><h1>Register</h1></label></td></tr>
                            <tr class="noalt">
                                <td class="noborder">
                                    <input type="text" id="firstNameId" size="30" name="firstName" placeholder="First Name" required value={this.state.firstName} onChange={this.handleChange} />
                                </td>
                            </tr>
                            {/*!this.isValid() && this.isTouched() ? <tr><td style={{ color: 'red', fontSizeAdjust: 0.4 }}>Please enter your first name.</td></tr> : ""*/}
                            <tr class="noalt">
                                <td class="noborder">
                                    <input type="text" id="lastNameId" size="30" name="lastName" placeholder="Last Name" required value={this.state.lastName} onChange={this.handleChange} />
                                </td>
                            </tr>
                            {/*<tr ngIf="(lastName.touched || lastName.dirty) && !lastName.valid" ><td style={{ color: 'red', fontSizeAdjust: 0.4 }}>Please enter your last name.</td></tr >*/}
                            < tr class="noalt" >
                                <td class="noborder">
                                    <input type="radio" id="genderId" name="gender" value="M" required checked={this.state.gender === "M"} onChange={this.handleChange} />Male&nbsp;&nbsp;
                                <input type="radio" id="genderId" name="gender" value="F" required checked={this.state.gender === "F"} onChange={this.handleChange} />Female
                            </td>
                            </tr >
                            {/*<tr ngIf= "(gender.touched || gender.dirty) && !gender.valid " > <td style="color:red;font-size-adjust:0.4">Please select your gender.</td></tr >*/}
                            <tr class="noalt">
                                <td class="noborder">
                                    <input type="email" id="emailId" size="30" name="email" placeholder="Your Email" required value={this.state.email} onChange={this.handleChange} />
                                </td>
                            </tr>
                            {/*<tr ngIf="(email.touched || email.dirty) && !email.valid " > <td style="color:red;font-size-adjust:0.4">Please enter your email address.</td></tr >*/}
                            <tr class="noalt">
                                <td class="noborder">
                                    <input type="text" size="20" id="userNameId" name="userName" placeholder="User Name" required value={this.state.userName} onChange={this.handleChange} />
                                </td>
                            </tr>
                            {/*<tr ngIf= "(userName.touched || userName.dirty) && !userName.valid " > <td style="color:red;font-size-adjust:0.4">Please enter your user name.</td></tr >*/}
                            {/*<tr ngIf= "isDuplicate" > <td style="color:red;font-size-adjust:0.4">User with user name '{{ duplicateUserName }}' already exists.</td></tr >*/}
                            <tr class="noalt">
                                <td class="noborder">
                                    <input type="password" id="passwordId" size="30" name="password" placeholder="Your Password" required value={this.state.password} onChange={this.handleChange} />
                                </td>
                            </tr>
                            {/*<tr ngIf="(password.touched || password.dirty) && !password.valid " > <td style="color:red;font-size-adjust:0.4">Please choose a password.</td></tr >*/}
                            <tr class="noalt">
                                <td class="noborder">
                                    <input type="password" id="passwordMatchId" size="30" name="passwordMatch" placeholder="Your Password (again)" required value={this.state.passwordMatch} onChange={this.handleChange} />
                                </td>
                            </tr>
                            {this.state.password !== this.state.passwordMatch ? <tr><td style={{ color: 'red', fontSizeAdjust: 0.4 }}>Passwords do not match.</td></tr > : ""}
                        </table >
                        <br />
                        <button type="submit" disabled={!this.isValid()} value="Submit"> Register</button >
                    </form >
                </div >
            );
        }
        else
            return (
                <Redirect to="/login" />
            );
    }
}

export default Register;