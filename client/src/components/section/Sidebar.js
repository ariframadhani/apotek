import React, { Component } from 'react';
import Auth from '../package/auth';

class Menu extends Component {
  
  constructor(props){
    super(props)    

    this.state = {
      auth: new Auth(),
      show: true,
      element: null,
      kasir_length: 0
    }
  }

  slider(e){
    e.preventDefault()

    document.getElementById('slide-menu').classList.toggle('active')

    var icons = document.getElementsByClassName('icon-menus')
    
    for( var i=0; i<icons.length; i++){
        icons[i].classList.toggle('active')
    }
    var element = document.getElementById('slide-menu').className

    if(element === 'active'){
        document.getElementById('content').style.marginLeft = "80px";
        if(document.getElementById('clock')){
          document.getElementById('clock').style.left ='50%'
        }
    }else{
      localStorage.setItem('setting_nav', true)
        
        if(document.getElementById('clock')){
          document.getElementById('clock').style.left ='56%'
        }
        document.getElementById('content').style.marginLeft = "240px";
    }    
  }

  activeClassOnLinks(){
    for (let i = 0; i < document.links.length; i++) {
      if(document.links[i].href === document.URL){
        document.links[i].className = 'is-active'
      }
      
    }

  }

  componentDidMount(){    
    this.activeClassOnLinks()
  }

  componentWillMount(){
    setInterval(this.checkKasirLength.bind(this))

    this.checkKasirLength()
  }

  checkKasirLength(){
    let local_kasir = localStorage.getItem("kasir")

    if(local_kasir){
      let kasir = JSON.parse(local_kasir)

      this.setState({
        kasir_length: kasir.length
      })
      
    }
  }

  render() {    
    const auth = new Auth()
      
      return (
       <div id="slide-menu"> 
          <div className="employee">
              <p>{ auth.isAuthenticated() ? auth.getToken().user.name : ''}</p>
              <span>Karyawan</span>                
          </div>
          <ul>
            <div className="main">
            <li> <a href="/"  title="Home" ><i className="icon-menus fas fa-home"></i> Dashboard </a></li>
            <li> <a href="/logout" title="Logout"> <i className="icon-menus fas fa-power-off"></i> Logout </a></li>
            </div>
            <li> <a href="/obat" title="Obat"> <i className="icon-menus fas fa-pills"></i> Obat </a></li>
            <li> <a href="/kasir"title="Kasir"> <i className="icon-menus far fa-money-bill-alt"></i> Kasir {this.state.kasir_length >= 1 ? <span title={'Terdapat ' + this.state.kasir_length + ' data pada kasir'} style={{marginLeft: '50px', padding: '5px 7px', borderRadius: '20px', cursor: 'help'}} className="badge badge-secondary"> {this.state.kasir_length} </span> : <span></span> }  </a></li>
            <li> <a href="/penjualan" title="Penjualan"> <i className="icon-menus fas fa-chart-line"></i> Penjualan </a></li>
            <li> <a href="/pembelian" title="Pambelian"> <i className="icon-menus fas fa-truck"></i> Pembelian </a></li>
              
            <li className="collapse-menu" onClick={this.slider.bind(this)}><a href="#" title="Collapse Menu"> <i className="icon-menus fas fa-compass"></i> Collapse  </a> </li>
          </ul>
        </div>
      )
    
  }
}

export default Menu;
