import React, { Component } from 'react';
import Form from './Form';
import axios from 'axios';
import Auth from '../package/auth'

class Login extends Component {
  constructor(){
    super()

    this.state = {
      authorized: true,
      message: null,
      loading: false,
    }
  }  

  _login(data){    
    const auth = new Auth()

    this.setState({
        loading: true,
        message: ''
    })

    axios.post(process.env.REACT_APP_API_URI + '/api/user/login', data)
    .then(res => {      
      this.setState({authorized: true, message: null})
      
      auth.setToken(res.data)

      window.location.href = "/";
      
    })
    .catch(err => {
      console.log(err.response);
      
      if(!err.response){
        this.setState({ authorized: false,
          message: 'Network error. Please check your db connection',
          loading: false
        })   
      }else{
        switch(err.response.status){
          case 401:
              this.setState({ 
              authorized: false,
              message: 'Autentifikasi tidak cocok',
              loading: false
            })    
          break
  
          case 500: 
              this.setState({ authorized: false,
              message: "Internal Server Error",
              loading: false
            })   
          break
  
          default:
          break
        }
      }
      
    }) 

  }

  render() {

    return (
      <div className="login">

        <div className="auth-login">
            <h3>Login</h3>

            <Form handleLogin={this._login.bind(this)}/>
            
            {!this.state.loading ? <div/> :  <div style={{marginLeft: '0%', marginTop: '10px'}} id="loading"></div>}
            <small className="info-auth" > {this.state.message} </small>
            

            {/* <div className="note-login">
            <p> Keterangan Login </p>
              <span style={{marginRight: '20px', fontSize: '14px'}}>username: <b>dev</b></span>
              <span style={{marginRight: '20px', fontSize: '14px'}}>password: <b>dev</b></span>
            </div> */}

            <p> &copy; Powered by {process.env.REACT_APP_CREDIT}</p>
        </div>

    </div>
    )
  }
}

export default Login;
