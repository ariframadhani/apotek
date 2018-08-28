import React, { Component } from 'react';
import Sidebar from '../section/Sidebar';
import Items from './Items';
import axios from 'axios'
import Auth from '../package/auth'
import Info from './Info';

class Login extends Component {
    constructor(props){
        super(props)
        
        const auth = new Auth();

        this.state = {
            auth: new Auth(),
            headers: {
                Authorization: 'Bearer ' + auth.getToken().token,
                'Content-Type': 'application/json'
            },
            items: [],
            item:{},
            print: {},
            user_id: {},
            cashier: [],
            limit: process.env.REACT_APP_LIMIT_PAGE,
            skip: 0,
            loading: false,
            pagination: {},
            mata_link: null,
            onSearch: false,
            found: 0,
            status: 0,
            page_paginate: {}
        }
    }

    formatCurrency(amount, decimalSeparator, thousandsSeparator, nDecimalDigits){  
        var num = parseFloat( amount ); //convert to float  
        //default values  
        decimalSeparator = decimalSeparator || '.';  
        thousandsSeparator = thousandsSeparator || ',';  
        nDecimalDigits = nDecimalDigits === null? 2 : nDecimalDigits;  
      
        var fixed = num.toFixed(nDecimalDigits); //limit or add decimal digits  
        //separate begin [$1], middle [$2] and decimal digits [$4]  
        var parts = new RegExp('^(-?\\d{1,3})((?:\\d{3})+)(\\.(\\d{' + nDecimalDigits + '}))?$').exec(fixed);   
      
        if(parts){ //num >= 1000 || num < = -1000  
            return parts[1] + parts[2].replace(/\d{3}/g, thousandsSeparator + '$&') + (parts[4] ? decimalSeparator + parts[4] : '');  
        }else{  
            return fixed.replace('.', decimalSeparator);  
        }  
    }  

    fetchData(link){
        let limit = this.state.limit
        let skip = this.state.skip
        
        if(this.state.items.length <= 0){
            this.setState({
              loading: true
            })
        } 
  
        link = !link ? process.env.REACT_APP_API_URI + `/api/penjualan?limit=${limit}` : link

        axios.get(link, {headers: this.state.headers})
        .then(res => {
            if(this.state.onSearch){
                this.setState({
                    found: res.data.data.total
                })
            }

            
            let page = {
                total: res.data.data.pages,
                current: res.data.data.page 
              }
            
            this.setState({
                items: res.data.data.docs,
                pagination: res.data.meta,
                meta_link: link,
                status: 200,
                page_paginate: page
            })            
        })
        .catch(err => {
            if(!err.status){
              this.setState({
                alert: true
              })
      
              this.unauthorizedNotif()
            }else{
              if(err.response.status === 401){
                this.setState({
                  alert: true
                })
        
                this.unauthorizedNotif()
              }
      
            }
            
        })
    }
    
    unauthorizedNotif(){
        setTimeout(() => {
        this.state.auth.logout()
        document.location.href = '/login'
        
        }, 6000);
    }

    componentWillMount(){
        this.fetchData()
        
    }

    checkInTime(){
        this.fetchData(this.state.meta_link)
    }
    
    componentDidMount(){
        setInterval(this.checkInTime.bind(this), 5000)
        
        this.popInfoMenu()
    }

    deleteItem(data){
        const id = data._id

        // ALERT NYA BELUM DITAMBAHAIN
        axios.delete(process.env.REACT_APP_API_URI + `/api/penjualan/${id}`, {headers: this.state.headers})
        .then(res =>{
            this.fetchData(this.state.meta_link)      
        })
        .catch(err => {
            console.log(err.response);
        })
    }

    infoItem(data){   
        console.log(data);
        
        this.setState({
            item: data,
            cashier: JSON.parse(data.cashier)
        })
             
        document.getElementById('information-popup').style.display = 'block'
        document.getElementById('information-popup-content').style.display = 'block'
        
    }

    popInfoMenu(){
        // close pop up menu on information popup
        document.getElementById('information-popup').style.display = 'none'
        document.getElementById('information-popup-content').style.display = 'none'
    }

    searchInvoice(query){
        let limit = this.state.limit
        let skip = this.state.skip
    
        let search_link = process.env.REACT_APP_API_URI+`/api/penjualan/search?query=${query}&limit=${limit}`
        
        this.setState({
            onSearch: true,
            query: query
        }, () => {
            this.fetchData(search_link)
        })
        
    }
    

    printInvoice(data, cashier){
        this.state.print = data,
        this.state.cashier = cashier
    }

    offSearch(){
        this.setState({onSearch: false})
    }

    render() {
        return (
            <div> 
                <Sidebar/>  
                <div id="content">
                    {!this.state.alert ? <div></div> :  
                        <div className="alert alert-danger">
                            <strong> Pengambilan data gagal. </strong> Redirect ke halaman login dalam 5 detik
                        </div>
                    }
                    <Items {...this.state} 
                        toRupiah = {this.formatCurrency}
                        fetchData = {this.fetchData.bind(this)}
                        infoItem = {this.infoItem.bind(this)}
                        deleteItem = {this.deleteItem.bind(this)}
                        searchInvoice = {this.searchInvoice.bind(this)}
                        searchValue = {this.fetchData.bind(this)}
                        printInvoice = {this.printInvoice.bind(this)}
                        offSearch = {this.offSearch.bind(this)}
                    />

                    <Info {...this.state}
                        toRupiah = {this.formatCurrency}
                        popInfoMenu = {this.popInfoMenu.bind(this)} />
                </div>
            </div>
        )
    }
}

export default Login;
