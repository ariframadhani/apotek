import React, { Component } from 'react';
import Auth from '../package/auth'
import { Redirect } from 'react-router-dom'
import Sidebar from '../section/Sidebar';

class NotFound extends Component {

    componentDidMount(){
        setTimeout(() => {
             window.location.href = '/'
        }, 7500);
    }

    render() {
        const auth = new Auth()
        if(auth.isAuthenticated()){
            return (
                <div>
                <Sidebar />
                <div id="content">
                    <div style={{textAlign: 'center', border: 'none' ,margin: '0 auto', height: '100%'}} className="section">
                        <h4 style={{marginBottom: '30px'}}>NOT FOUND 404</h4>
                        <h5 style={{marginBottom: '30px', fontSize: '16px', background: '#2db578', color: 'white', padding: '15px', borderRadius: '50px'}}>Halaman '{this.props.location.pathname}' tidak ditemukan</h5>
                        <small>Anda akan diarahkan menuju halaman utama dalam waktu 5 detik</small>
                        <p style={{bottom: '0px', fontSize: '14px'}}> &copy; Powered by Developer </p>
                    </div>                
                </div>
                </div>
            )
        }else{
            return <Redirect to='/login'/>
        }
    }
}

export default NotFound;
