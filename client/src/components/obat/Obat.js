import React, { Component } from 'react';
import axios from 'axios'
import Items from './Items';
import Auth from '../package/auth'
import Info from './Info';
import Add from './Add';
import Edit from './Edit';
import moment from 'moment'
import Sidebar from '../section/Sidebar';

class Obat extends Component {

  constructor(props){
    super(props)   

    const auth = new Auth()

    this.state = {
      auth: new Auth(),
      show: true,
      data: [],
      collection: [],
      pagination: {},
      categories: [],
      item: 'Obat',
      headers: {
        Authorization: 'Bearer ' + auth.getToken().token,
        'Content-Type': 'application/json'
      },
      detail: {},
      category: {},
      user: {},
      old_category: {},
      old_info: {},
      alert: false,
      user_id: auth.getToken().user.id,
      meta_link: null,
      limit: process.env.REACT_APP_LIMIT_PAGE,
      skip: 0, // will always 0 (zero=o)
      loading: true,
      found: 0,
      onSearch: false,
      page_paginate: {},
      invoice: '',
      offFetch: false,
      exist_obat: {},
      popOver: false,
      expired_item: []
    }
  }

  checkCode(value) {     
    
    if(value.length === 0){
        this.setState({exist_code: false})
    }else{
        axios.get(process.env.REACT_APP_API_URI + '/api/obat/valid/'+value, {headers: this.state.headers})
        .then(res => {                
            if(res.data.data.length === 1){
              res.data.data[0].exp_date = moment(res.data.data[0].exp_date).format('YYYY-MM-DD')
              this.setState({
                  exist_code: true, 
                  exist_obat: res.data.data[0],
                  loading: false
              })
            }else{
              this.setState({exist_code: false})            
            }
        })
        .catch(err => {
            this.errors(err)
        })
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

  setCustom(){
    this.state.data.map(d => {      
      if(Date.now() > Date.parse(d.exp_date)){
        return d.status = 'EXPIRED'
      }else{
        return d.status = 'BELUM EXPIRED'
      }
    })
  }
  

  checkExpiredObat(){
    let data = []
    this.state.collection.map(d => {      
      if(Date.now() > Date.parse(d.exp_date)){
        data.push(d)
        return this.setState({
          expired_item: data
        })
      }
    })
  }
    

  fetchCollection(){
    axios.get(process.env.REACT_APP_API_URI + '/api/obat', {headers: this.state.headers})
    .then(res => {
      this.setState({
        collection: res.data.data.docs
      })

      this.checkExpiredObat()
    })
    .catch(err => {
      console.log(err);
    })
  }

  fetchData(link){    
    let limit = this.state.limit
    let skip = this.state.skip
    
    if(this.state.data.length <= 0){
      this.setState({
        loading: true
      })
    }    
    
    link = !link ? process.env.REACT_APP_API_URI + `/api/obat?limit=${limit}` : link
    
    axios.get(link, {headers: this.state.headers})
    .then(res => { 

        // console.log(res.data.data.docs[0]);

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
          total: res.data.data.total,
          status: 200,
          page_paginate: page
      })         
        
        this.setCustom()
                
        this.setState({
          data: res.data.data.docs,
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

  fetchCategory(){
    axios.get(process.env.REACT_APP_API_URI + '/api/kategori', {headers: this.state.headers})
    .then(res => {
      this.setState({
        categories: res.data.data
      })
      
    })
    .catch(err => {
      if(err.response.status === 401){
        this.setState({
          alert: true
        })
        this.unauthorizedNotif()
      }
    })
  }

  unauthorizedNotif(){
    setTimeout(() => {
      this.state.auth.logout()
      document.location.href = '/login'
      
    }, 6000);
  }

  editObat(data){   
    this.setState({
      detail: data,
      old_info:data,
      old_category: data.category_id
    })
  }  

  infoObat(data){    
    document.getElementById('information-popup').style.display = 'block'
    document.getElementById('information-popup-content').style.display = 'block'
    
    this.setState({
      detail: data,
      category: data.category_id,
      user: data.user_id
    })
    
  }

  deleteObat(id){
    axios.delete(process.env.REACT_APP_API_URI + `/api/obat/${id}`, {headers: this.state.headers})
    .then(res =>{
      this.fetchData(this.state.meta_link)      
    })
    .catch(err => {
      console.log(err.response);
      
    })
  }

  componentDidMount(){
    this.createInvoice()
    this.fetchData()
    this.fetchCategory()
    this.fetchCollection()
    setInterval(this.showClock)

    // setInterval(this.realtimeStatus.bind(this), 5000) // 5 detik
    setInterval(this.fetchCollection.bind(this), 5000)    
    
    document.getElementById('information-popup').style.display = 'none'
    document.getElementById('information-popup-content').style.display = 'none'
  }

  editExistCode(e, target) {    
    let exist_obat = {...this.state.exist_obat};       
    exist_obat[target] = e.target.value
    
    if(target === 'category_id'){
      let index = e.target.options.selectedIndex - 1
      if(index === -1){
        exist_obat[target] = ""  
      }else{
        let value = this.state.categories[index]
        exist_obat[target] = value._id
      }
    }
    this.setState({exist_obat})
    console.log(exist_obat);
    
  }


  edit(e, target){
    let old_info = {...this.state.old_info};       
    old_info[target] = e.target.value
    
    this.setState({old_info})
  }
  
  resetOldInfo(){
    this.setState({
      old_info: {},
      old_category: {}
    })
  }

  showClock(){
    document.getElementById('clock').innerHTML = moment().locale('id').format('LL LTS');
  }

  realtimeStatus(){
      this.fetchData(this.state.meta_link)
  }

  // close pop up menu on information popup
  popInfoMenu(){
    document.getElementById('information-popup').style.display = 'none'
    document.getElementById('information-popup-content').style.display = 'none'
    
  }

  searchItem(query){
    
    let limit = this.state.limit
    let skip = this.state.skip

    let search_link = process.env.REACT_APP_API_URI+`/api/obat/search?query=${query}&skip=${skip}&limit=${limit}`
    
    this.setState({
      onSearch: true,
      query: query
    }, () => {
      this.fetchData(search_link)
    })
    
  }

  offSearch(){
    this.setState({
      onSearch: false
    })
  }
    
  offAlert(){
      this.setState({
          exist_code: false,
          status: 200,
          alert_text: ''
      })
  }

  storePembelian(data){
    if(this.state.exist_code){
        this.updateObat(data, this.state.exist_obat)
        this.storeToPembelian(data)
    }else{
        this.storeToPembelian(data)
        this.storeToObat(data)
    }

    this.clearExistObat()
  }

  storeToPembelian(data){
    data.user_id = this.state.auth.getToken().user.id
    axios.post(process.env.REACT_APP_API_URI + '/api/pembelian', data, {headers: this.state.headers})
    .then(res => {
        this.fetchData(this.state.meta_link)
        this.createInvoice()
    })
    .catch(err => {
        console.log(err);    
    })
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
  
  storeToObat(item){
    let data = {
        code: item.code.replace(/\s/g, "").trim(),
        name: item.name,
        category_id: item.category_id,
        price: item.sale_price,
        stock: item.buy_stok,
        exp_date: item.tanggal_expired,
        note: null,
        user_id: this.state.auth.getToken().user.id
    }

    axios.post(process.env.REACT_APP_API_URI + '/api/obat', data, {headers: this.state.headers})
        .then(res => {
            this.fetchData(this.state.meta_link)
            this.createInvoice()
            this.setState({
                code: 200
            })
        })
        .catch(err => {
            this.errors(err)
        })
  }
  updateObat(newData, resource){
    const id = resource._id
    
    const data = {
        name: newData.name,
        category_id: newData.category_id,
        user_id: this.state.auth.getToken().user.id,
        price: newData.sale_price,
        stock: resource.stock + newData.buy_stok,
        exp_date: newData.tanggal_expired,
        updated_at: Date.now(),
        updated_by: this.state.auth.getToken().user.name
    }

    axios.patch(process.env.REACT_APP_API_URI + `/api/obat/${id}`, data, {headers:this.state.headers})
        .then(res => {
          console.log(res);
          
            this.setState({
                exist_code: false,
                code: 200
            })
        })
        .catch(err => {
            this.errors(err)        
        })
  }
  
  errors(err){
    if(!err.status){
        this.setState({
            code: 500,
            alert_text: 'Network Error'                        
        })
    }else{
        console.log(err.response);
        
        if(err.response.status === 401){
            this.setState({
                code: 500,
                alert_text: 'Anda harus login sebelum melakukan aksi'                        
            })

        }else if(err.response.status === 500){
            this.setState({
                code: 500,
                alert_text: 'Internal Server Erro'                        
            })
        }
    }
  }

  existCodeFalse = () => {
    this.setState({
      exist_code: false
    })
  }

  clearExistObat = () => {
    this.setState({
      exist_obat: {}
    })
  }

  toggle = () => {
    this.setState({
      popOver: !this.state.popOver
    })
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

      <div id="clock"> </div>
              
        <Items {...this.state}
              infoObat={this.infoObat.bind(this)}
              editObat={this.editObat.bind(this)}
              deleteObat={this.deleteObat.bind(this)}
              fetchData={this.fetchData.bind(this)}
              searchItem={this.searchItem.bind(this)}
              offSearch={this.offSearch.bind(this)}
              rupiah={this.formatCurrency.bind(this)}
              toggle={this.toggle}
        />

        <div className="section bottom-space">
          <div id="controller" className="header-section">
            <h3>Controller</h3>     
            </div>
            
            <div className="row rule">
            
            {/* col-md-5 */}
            <Add {...this.state}
                storePembelian={this.storePembelian.bind(this)}
                checkExistCode={this.checkCode.bind(this)}
                offAlert={this.offAlert.bind(this)}
                categories={this.state.categories} 
                fetchData={this.fetchData.bind(this)}
                changeExistCodeToFalse={this.existCodeFalse}
                changeOnExist={this.editExistCode.bind(this)}
                clearExistObat={this.clearExistObat}

            />

            <div className="col-md-1"></div>

            {/* col-md-6 */}
            <Edit {...this.state} 
                  edit={this.edit.bind(this)}
                  resetOldInfo={this.resetOldInfo.bind(this)}
                  fetchData={this.fetchData.bind(this)}
                  
            />
            
            <Info  {...this.props}
            
                  popInfoMenu={this.popInfoMenu}
                  info={this.state.detail}
                  category={this.state.category}
                  user={this.state.user}
                  rupiah={this.formatCurrency.bind(this)}
            /> 

            </div> {/* end row */}
        </div>
      </div>
    </div>
    )
  }
}

export default Obat;
