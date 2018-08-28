import React, { Component } from 'react';

class Login extends Component {
    constructor(props){
        super(props)

        this.state = {
            data: {}
        }
    }

    handleRegister(e){
        this.setState({ 
            data: {
                name: this.refs.nama.value,
                username: this.refs.username.value,
                password: this.refs.password.value
            }
        }, function(){
            this.props.handleRegister(this.state.data)            
        })        
        
        e.preventDefault()
    }

    render() {
        return (
            <form onSubmit={this.handleRegister.bind(this)}>
                <input type="text" ref="nama" placeholder="Nama" required />
                <input type="text" ref="username" placeholder="Username" required />
                <input type="password" ref="password" placeholder="**********" required/>
                <input type="submit" value="R E G I S T E R"/>
            </form>
        )
    }
}

export default Login;
