import React, { Component } from 'react';
import moment from 'moment'
import {Fade, Popover, PopoverHeader, PopoverBody} from 'reactstrap'
require('moment/locale/id.js')

class Item extends Component {

  constructor(props){
    super(props)

    this.state = {
      obat: {},
      alert: false,
      deleted_name: ''
    }

  }

  editItem(obat, e){    
    
    obat.exp_date = moment(obat.exp_date).format('YYYY-MM-DD')
    
    this.setState({
      obat: obat
    }, function (){
      this.props.editObat(this.state.obat)
    })


  }
  
  infoItem(data, e){
    
    this.setState({
      obat: data
    }, function(){
      this.props.infoObat(this.state.obat)
    })
  }

  deleteItem(id, code, e){
    if(window.confirm('Hapus data dengan kode "'+ code +'" ?'))
      this.setState({
        obat: id,
        alert: false
      }, function(){
        this.props.deleteObat(this.state.obat)
        this.setState({
          alert: true,
          deleted_name: code
        })
        setTimeout(function(){   
          this.setState({alert: false}) 
        }.bind(this), 4000);
      })
  }

  refreshData(){
    this.props.fetchData(this.props.meta_link)
  }

  getPagination(link, e){
    this.props.fetchData(link)
  }

  searchItem(e){
    e.preventDefault()
    
    let query = this.refs.query.value
    this.props.searchItem(query.trim())
  }

  serachBlank(e){
    if(e.target.value.length === 0){
      this.props.fetchData()
      this.props.offSearch()
    }   
  }

  render() {
    
    return (            
      <div className="section">
          <div className="header-section">
            <div className="row" >
            <div className="col-sm-3">
            <h3>Data Obat
            
      <button title='Data obat expired' className="btn btn-secondary" style={{fontSize: '13px', outline:'none', marginLeft: '10px', width: this.props.expired_item.length >= 20 ? '40px' : '35px', height: this.props.expired_item.length >= 20 ? '40px' : '35px', padding: '5px', boxShadow:'none', borderRadius:'100%'}} id="Popover1" onClick={this.props.toggle}>
        <i className="fas fa-bell"></i> <span style={{fontSize: '9px'}}>{this.props.expired_item.length}</span>
      </button>
      <Popover placement="bottom" isOpen={this.props.popOver} target="Popover1" toggle={this.props.toggle}>
      
      <Fade in={this.props.popOver} tag="h5" className="mt-3">
        <PopoverHeader style={{fontSize: '13px'}}> 
          <span style={{background: '#dc3545', color: '#dc3545', marginRight: '10px'}}> ------ </span> 
          Obat Expired 
          <small> (Jumlah {this.props.expired_item.length}) </small>
        </PopoverHeader>
        <PopoverBody style={{height: '200px', overflowY: this.props.expired_item.length >= 4 ? 'scroll' : 'none'}}>
          <div> 
          
          <table style={{fontSize: '12px'}} className="table table-custom">
            <thead>
              <tr>
                <th> No </th>
                <th> Kode </th>
                <th> Tanggal Expired </th>
              </tr>
            </thead>

            <tbody style={{fontWeight: 'normal'}}>
            {this.props.expired_item.map((item, index) => {
              return <tr key={item._id}>
                <td>{index+1}</td>
                <td>{item.code}</td>
                <td>{ moment(item.exp_date).locale('id').format('LL') }</td>
              </tr>
            })}
            </tbody>
            </table>
            </div>

        </PopoverBody> 
      </Fade> 
    </Popover> </h3>
            

            </div>
            <div className="col-sm-6">
              {this.props.onSearch ? <div className="alert alert-info"> Pencarian <b> '{this.props.query}' </b> ditemukan <b> {this.props.found} data. </b> </div>
              : null }
            </div>
            
            <form onSubmit={this.searchItem.bind(this)} className="col-lg-3 search-item">
              <input id="#BarcodeResultOnObat" onChange={this.serachBlank.bind(this)} type="text" placeholder="search" ref="query" required/>
              <button type="submit" style={{backgroundColor: 'grey', color:'white'}} className="action-btn-info">Cari</button>
            </form>
            </div>
          </div>
                    
          {!this.state.alert ? <div></div> : <div className="alert alert-info">
            <strong> Data dengan kode {this.state.deleted_name}</strong> berhasil dihapus!
          </div>}

          <div className="table-responsive">
          <table className="table table-custom">
            <thead className="thead-light">
              <tr>
                <th scope="col">Kode</th>
                <th scope="col">Nama</th>
                <th scope="col">Tanggal Expired</th>
                <th style={{textAlign: 'center'}} scope="col">Status</th>
                <th scope="col">Kategori</th>
                <th scope="col">Harga</th>                  
                <th scope="col">Stok</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {this.props.data.map(obat => 
              <tr key={obat._id}>
                <td>{obat.code}</td>
                <td>{obat.name}</td>
                <td>{moment(obat.exp_date).format('LL')}</td>
                <td><span style={{textAlign:'center', width:'100%', padding:'5px 13px', color:'#ffffffe6'}} className={obat.status === 'EXPIRED' ? 'badge badge-danger' : 'badge badge-success'}> {obat.status} </span> </td>
                <td>{obat.category_id.name}</td>
                <td>Rp {this.props.rupiah(obat.price, ',', '.', 0)}</td>
                <td>{obat.stock}</td>
                <td>
                  <button onClick={(e) => this.infoItem(obat, e)} title="Detail" className="action-btn-info"><i className="fas fa-info"></i></button>
                  <button onClick={(e) => this.editItem(obat, e)} title="Edit" className="action-btn-edit"><i className="fas fa-edit"></i></button>
                  <button onClick={(e) => this.deleteItem(obat._id, obat.code, e)} title="Delete Item" className="action-btn-delete"><i className="far fa-trash-alt"></i></button>
                </td>
              </tr>
              )}
            </tbody>
          </table>
              {this.props.loading ? <div style={this.props.status === 200 ? { display:'none' } : {display: 'inline-block'}} id="loading"> </div> : <div></div>}
              
            <div style={{borderTop: '1px solid rgba(187, 187, 187, 0.267)', paddingTop: '10px'}}>
              <button className="btn-pagination btn btn-secondary" style={!this.props.pagination.prev ? {cursor: 'not-allowed'} : {cursor: 'pointer'} } disabled={!this.props.pagination.prev} onClick={(e) => this.getPagination(this.props.pagination.prev_page, e)}> Prev </button>
              <small> {this.props.page_paginate.current} dari {this.props.page_paginate.total} </small>
              <button className="btn-pagination btn btn-secondary" style={!this.props.pagination.next ? {cursor: 'not-allowed', marginLeft: '10px'} : {cursor: 'pointer', marginLeft: '10px'} } disabled={!this.props.pagination.next} onClick={(e) => this.getPagination(this.props.pagination.next_page, e)}> Next </button>
            </div>
        </div>
        </div>
    )
  }

}

export default Item;
