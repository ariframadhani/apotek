import React, { Component } from 'react';
import Sidebar from '../section/Sidebar'
import Items from './Items'
import Auth from '../package/auth'
import Informasi from './Informasi'
import axios from 'axios'
import moment, { locale } from 'moment'
import Info from './Info';

class Pembelian extends Component {
    constructor(props){
        super(props)

        const auth = new Auth()

        this.state = {
            auth: new Auth(),
            data: [],
            info: {},
            categories: [],
            display: false,
            headers: {
              Authorization: 'Bearer ' + auth.getToken().token,
              'Content-Type': 'application/json'
            },
            limit: process.env.REACT_APP_LIMIT_PAGE,
            skip: 0,
            invoice: '',
            exist_obat: {},
            exist_code: false,
            loading: false,
            found: 0,
            status: 0,
            pagination: {}, 
            meta_link: {},
            alert: false,
            user_id: {},
            category_id: {},
            onSearch: false,
            page_paginate: {},
            code: 0,
            alert_text: ''
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

    formatMoment(value){
        return moment(value).locale('id').format('LL - LTS a')
    }

    createInvoice(){
        var text = "PEMB-";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        
        for (var i = 0; i < 8; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        
        this.setState({
            invoice: text
        })
    }

    fetchData(link){
        let limit = parseInt(this.state.limit, 10)
        let skip = this.state.skip        
        
        if(this.state.data.length <= 0){
            this.setState({
              loading: true
            })
        } 

        link = !link ? process.env.REACT_APP_API_URI + `/api/pembelian?limit=${limit}` : link

        axios.get(link, {headers:this.state.headers})
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
                data: res.data.data.docs,
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
    
    checkConnection(){        
        axios.get(process.env.REACT_APP_API_URI + '/api/check', {headers: this.state.headers})
        .then(res => {            
            
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

    fetchKategori(){
        axios.get(process.env.REACT_APP_API_URI + '/api/kategori', {headers: this.state.headers})
        .then(res => {
            this.setState({
                categories: res.data.data
            })
        })
        .catch(err => {
            console.log(err);
        })
    }

    infoItem(data){
        this.setState({
            info: data,
            user_id: data.user_id,
            category_id: data.category_id
        }, () => {
            this.enablePopUpMenu()            
        })
    }

    deleteItem(data){
        const id = data._id

        axios.delete(process.env.REACT_APP_API_URI + `/api/pembelian/${id}`, {headers: this.state.headers})
        .then(res =>{
            this.fetchData()      
        })
        .catch(err => {
            console.log(err);
        })
    }


    unauthorizedNotif() {
        setTimeout(() => {
          this.state.auth.logout()
          document.location.href = '/login'
          
        }, 6000);
    }  

    checkCode(value) {     
        if(value.length === 0){
            this.setState({exist_code: false})
        }else{
            axios.get(process.env.REACT_APP_API_URI + '/api/obat/valid/'+value, {headers: this.state.headers})
            .then(res => {     
                res.data.data.length === 1 ? 
                this.setState({
                    exist_code: true, 
                    exist_obat: res.data.data[0],
                    loading: false
                }) : 
                this.setState({exist_code: false})            
            })
            .catch(err => {
                this.errors(err)
            })
        }
    }

    searchItem(e) {
        e.preventDefault()

        let limit = this.state.limit
        let skip = this.state.skip
        let query = this.refs.query.value

        let search_link = process.env.REACT_APP_API_URI+`/api/pembelian/search?query=${query}&limit=${limit}`

        this.setState({
            onSearch: true,
            query: query
        }, () => {
            this.fetchData(search_link)
            
        })
    }

    serachBlank = (e) => {
        if(e.target.value.length === 0){
            this.setState({
                onSearch: false,
                query: e.target.value
            }, () => {
                this.fetchData()
            })  
        }
    }

    enablePopUpMenu(){
        document.getElementById('information-popup').style.display = 'block'
        document.getElementById('information-popup-content').style.display = 'block'
    }

    disablePopUpMenu(){
        document.getElementById('information-popup').style.display = 'none'
        document.getElementById('information-popup-content').style.display = 'none'
    }

    offAlert(){
        this.setState({
            exist_code: false,
            status: 200,
            alert_text: ''
        })
    }

    componentDidMount(){
        setInterval(this.checkConnection.bind(this), 5000)

        this.disablePopUpMenu()
        this.fetchData()
        this.fetchKategori()
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
                    <div className="section bottom-space">
                        <div className="header-section">
                            <div className="row" style={{marginBottom: '-10px'}}>
                                <h3 className="col-sm-3">Data Pembelian</h3>
                                
                                <div className="col-sm-6">
                                {this.state.onSearch ? <div className="alert alert-info"> Pencarian <b> '{this.state.query}' </b> ditemukan <b> {this.state.found} data. </b> </div>
                                : null }
                                </div>
                                
                                <form onSubmit={this.searchItem.bind(this)} className="col-lg-3 search-item">
                                <input onChange={this.serachBlank.bind(this)} type="text" placeholder="search" ref="query" required/>
                                <button type="submit" style={{backgroundColor: 'grey', color:'white'}} className="action-btn-info">Cari</button>
                                </form>
                            </div>
                        </div>

                        

                        <div className="row rule">
                            <Items {...this.state} 
                                infoItem={this.infoItem.bind(this)}
                                deleteItem={this.deleteItem.bind(this)}
                                fetchData={this.fetchData.bind(this)}
                                moment={this.formatMoment.bind(this)}
                                rupiah={this.formatCurrency.bind(this)}
                            />
                        </div>
                    </div>

                    <Info {...this.state}
                        disablePopUpMenu={this.disablePopUpMenu.bind(this)}
                        moment={this.formatMoment.bind(this)}
                        rupiah={this.formatCurrency.bind(this)}
                    />
                </div>
            </div>
        )
    }
}

export default Pembelian;
