import "./registrationWindow.css"
import React, { Component } from 'react'

export class RegistrationWindow extends Component {
    
    onChange = (e) => this.setState({[e.target.name]: e.target.value});
    
    render() {
        return (
            <div id="registrationWindow">
                Registration
                <input 
                 id = "dataField"
                 type="text" 
                 name="nickname" 
                 placeholder="Nickname..."
                 onChange={this.onChange} 
                 />
                <input 
                 id = "dataField"
                 type="text" 
                 name="firstName" 
                 placeholder="First name..."
                 onChange={this.onChange} 
                 />
                <input 
                 id = "dataField"
                 type="text" 
                 name="lastName" 
                 placeholder="Last name..."
                 onChange={this.onChange} 
                 />
                <input 
                 id = "passwordField"
                 type="password" 
                 name="password" 
                 placeholder="Password..."
                 onChange={this.onChange} 
                />
                <input 
                 id = "passwordField"
                 type="password" 
                 name="passwordConfirm" 
                 placeholder="Confirm password..."
                 onChange={this.onChange} 
                />
                <input 
                type="button"
                value="Register"
                id="registerButton"
                onClick={this.onRegistration}
                />
            </div>
        )
    }
}

export default RegistrationWindow