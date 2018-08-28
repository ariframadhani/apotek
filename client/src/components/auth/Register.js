import React from 'react'
import Form from './FormRegister';
import Auth from '../package/auth'
import axios from 'axios'

class Register extends React.Component{
    constructor(){
        super()

        this.state = {
            loading: false,
            message: null,
        }
    }

    register(data){    
        this.setState({
            loading: true,
            message: '',
        })
        axios.post(process.env.REACT_APP_API_URI + '/api/user/', data)
            .then(res => {
                this.setState({
                    loading: false,
                    message: null,
                    success: true
                })               
                
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            })
            .catch(err => {
                console.log(err);
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
                        message: "Username sudah terdaftar",
                        loading: false
                      })   
                    break
            
                    default:
                    break
                  }
                }
                
            })
        
    
    }
    

    render(){
        return (
        <div className="login">

            <div className="auth-login">
                <h3>Register</h3>

                <Form handleRegister={this.register.bind(this)}/>
                {!this.state.loading ? <div/> :  <div style={{marginLeft: '0%', marginTop: '10px'}} id="loading"></div>}
        
                <small className="info-auth" > {this.state.message} </small>
                { this.state.success && <small className="info-auth" style={{color: 'green'}}> Registrasi berhasil silahkan login </small> }
        
                <p> &copy; Powered by {process.env.REACT_APP_CREDIT}</p>
            </div>

        </div>
        )
    }
}

export default Register;