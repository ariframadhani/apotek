import React, { Component } from 'react';

class Login extends Component {
    constructor(props){
        super(props)

        this.state = {
            data: {}
        }
    }

    handleLogin(e){
        this.setState({ 
            data: {
                username: this.refs.username.value,
                password: this.refs.password.value
            }
        }, function(){
            this.props.handleLogin(this.state.data)            
        })        
        
        e.preventDefault()
    }

    render() {
        return (
            <form onSubmit={this.handleLogin.bind(this)}>
                <input type="text" ref="username" placeholder="Username" required/>
                <input type="password" ref="password" placeholder="**********" required/>
                <input type="submit" value="L o g i n"/>
            </form>
        )
    }
}

export default Login;
