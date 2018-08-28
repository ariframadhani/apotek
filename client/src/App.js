import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import Home from '../src/components/home/Dashboard'
import Login from '../src/components/auth/Login'
import Auth from './components/package/auth'
import Obat from './components/obat/Obat'
import NotFound from './components/request/NotFound'
import Kasir from '../src/components/kasir/Kasir'
import Penjualan from './components/penjualan/Penjualan'
import Register from '../src/components/auth/Register'

// css
import '../src/assets/js/required.js'
import Pembelian from './components/pembelian/Pembelian';

const auth = new Auth() 

const Logout = ( ) => {
  auth.logout()
  return <Redirect to ='/login' />
} 

const PrivateRoute = ({ component: Component, ...rest }) => {  
  return <Route {...rest} render = {(props) => (
    auth.isAuthenticated() === true ? <Component {...props}/> : <Redirect to ='/login' />
  )}
  />
}

const PublicRoute = ({ component: Component, ...rest }) => {  
  return <Route {...rest} render = {(props) => (
    auth.isAuthenticated() === false ? <Component {...props}/> : <Redirect to ='/' />
  )}
  />
}

class App extends Component {  
  constructor(props){
    super(props)

    this.state = {
      slider: false
    }
  }

  render() { 

    return (
      <Router>
        <div className="App">

          <Switch>

            <PrivateRoute path="/" exact component={Home}/>
            <PrivateRoute path="/obat" exact component={Obat}/>
            <PrivateRoute path="/kasir" exact component={Kasir}/>
            <PrivateRoute path="/penjualan" exact component={Penjualan}/>
            <PrivateRoute path="/pembelian" exact component={Pembelian}/>

            <PublicRoute path="/login" exact component={Login}/>
            <PublicRoute path="/register" exact component={Register}/>
            <Route path="/logout" exact component={Logout}/>
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App;
