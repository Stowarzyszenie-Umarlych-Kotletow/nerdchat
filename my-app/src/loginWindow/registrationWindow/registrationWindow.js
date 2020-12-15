import "./registrationWindow.css"
import React, { Component } from 'react'

export class RegistrationWindow extends Component {
    
    onRegistration = () => {
        // TODO: 'U know what to do ;) (registration handling)'
        document.getElementById("registrationWindow").style.visibility = 'hidden';
        document.getElementById("loginWindow").style.visibility = 'visible';
    }

    onChange = (e) => this.setState({[e.target.name]: e.target.value});
    
    onBack = () => {
        document.getElementById("registrationWindow").style.visibility = 'hidden';
    }

    render() {
        return (
            <div id="registrationWindow">
                Welcome, join us now
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
                <input 
                type="button"
                value="Back"
                id="backButton"
                onClick={this.onBack}
                />
                
            </div>
        )
    }
}

export default RegistrationWindow