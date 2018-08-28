import React, { Component } from 'react';
import moment from 'moment'
import Invoice from './Invoice'
import axios from 'axios'

class Items extends Component {
    constructor(props){
      super(props)

      this.state = {
        data: {},
        query: '',
        print: {},
        cashier: [],
        show_print: false,
      }
    }

    deleteItem(e, data){
      e.preventDefault()
      
      if(window.confirm('Hapus data dengan invoice "'+data.invoice+'" ?'))
      this.setState({
        data: data
      }, () => {
        this.props.deleteItem(this.state.data)
      })
    }

    infoItem(e, data){
      e.preventDefault()
      
      this.setState({
        data: data
      }, () => {
        this.props.infoItem(this.state.data)
      })
    }
  
    getPagination(link, e){
      console.log(link);
      
      this.props.fetchData(link)
    }

    searchInvoice(e){
      e.preventDefault()

      this.setState({
        query: this.refs.query.value
      }, () => {
        
        this.props.searchInvoice(this.state.query.trim())
      })
    }

    searchValue(e){
      if(e.target.value.length === 0){
        
        this.setState({
          query: ''
        }, () => {
          this.props.searchValue(this.state.query)
          this.props.offSearch()
        })
      }
    }

    print(){
      const full = document.body.innerHTML
      const invoice = document.getElementById('print').innerHTML

      document.body.innerHTML = invoice

      window.print();
      window.location.reload()

    }
    
    printInvoice(e, item) {
      this.setState({
        show_print: true,
        print: item,
        cashier: JSON.parse(item.cashier)
      }, () => {
        this.print()
      })

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

    render() {  
        return (
            <div className="section">
              <Invoice {...this.state} 
                  rupiah = {this.formatCurrency}
              
              />
                <div className="header-section">
                  <div className="row" style={{marginBottom: '-10px'}}>
                    <h3 className="col-sm-3">Data Penjualan</h3>
                    <div className="col-sm-6">
                      {this.props.onSearch ? <div className="alert alert-info"> Pencarian <b> '{this.props.query}' </b> ditemukan <b> {this.props.found} data. </b> </div>
                      : null }
                    </div>
                    <form onSubmit={(e) => this.searchInvoice(e)} className="col-lg-3 search-item">
                      <input onChange={(e) => this.searchValue(e)} type="text" placeholder="search invoice" ref="query" required/>
                      <button type="submit" style={{backgroundColor: 'grey', color:'white'}} className="action-btn-info">Cari</button>
                    </form>
                  </div>
                </div>

                <div className="table-responsive">
                <table className="table table-custom">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Invoice</th>
                      <th scope="col">Total Harga</th>
                      <th scope="col">Biaya Resep</th>   
                      <th scope="col">Pembayaran</th>               
                      <th style={{textAlign: 'center'}} scope="col">User</th>
                      <th style={{textAlign: 'center'}} scope="col">Tanggal Penjualan</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.items.map(item => {
                    return <tr key={item._id}>
                      <td>{item.invoice}</td>
                      <td>Rp {this.props.toRupiah(item.total,'.',',')}</td>
                      <td>Rp {this.props.toRupiah(item.recipe ,'.',',')}</td>
                      <td>Rp {this.props.toRupiah(item.cash,'.',',')}</td>
                      <td style={{textAlign: 'center'}}>{item.user_id.name}</td>
                      <td style={{textAlign: 'center'}}>{moment(item.created_at).locale('id').format('LL - LTS')}</td>
                      <td>
                        <button onClick={(e) => this.infoItem(e, item)} title="Detail" className="action-btn-info"><i className="fas fa-info"></i></button>
                        <button target="_blank" onClick={(e) => this.printInvoice(e, item)} title="Print Invoice" className="action-btn-edit"><i className="fas fa-print"></i></button>
                        <button onClick={(e) => this.deleteItem(e, item)} title="Delete Item" className="action-btn-delete"><i className="far fa-trash-alt"></i></button>
                      </td>
                    </tr>
                    })}
                  </tbody>
                </table>
                
              {this.props.loading ? <div style={this.props.status === 200 ? { display:'none' } : {display: 'inline-block'}} id="loading"> </div> : <div></div>}
      
            <div style={{borderTop: '1px solid rgba(187, 187, 187, 0.267)', paddingTop: '10px'}}>
              <button className="btn-pagination btn btn-secondary" style={!this.props.pagination.prev ? {cursor: 'not-allowed'} : {cursor: 'pointer'} } disabled={!this.props.pagination.prev} onClick={(e) => this.getPagination(this.props.pagination.prev_page, e)}> Prev </button>
              <small> {this.props.page_paginate.current} dari {this.props.page_paginate.total} </small>
              <button className="btn-pagination btn btn-secondary" style={!this.props.pagination.next ? {cursor: 'not-allowed',  marginLeft: '10px'} : {cursor: 'pointer',  marginLeft: '10px'} } disabled={!this.props.pagination.next} onClick={(e) => this.getPagination(this.props.pagination.next_page, e)}> Next </button>
              <span style={{fontSize:'12px'}}> ( Informasi data penjualan per tahun dan per bulan ada pada dashboard ) </span>
            </div>
               
          </div>
        </div>
        )
    }
}

export default Items;
