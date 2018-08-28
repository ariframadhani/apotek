import React, { Component } from 'react';
import Auth from '../package/auth';
import axios from 'axios'
import moment from 'moment'
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap'

class Add extends Component {

    constructor(props){
        super(props)

        this.state = {
            data: {},
            code: '',
            exist_code: {}
        }
        
    }

    storePembelian = (e) => {
        e.preventDefault()

        let data = {
            invoice: this.props.invoice,
            supplyer: this.refs.supplyer.value.trim(),
            code: this.refs.kode_obat.value.trim(),
            category_id: this.refs.kategori_obat.value,
            name: this.refs.nama_obat.value.trim(),
            buy_price: parseInt(this.refs.harga_beli.value),
            sale_price: parseInt(this.refs.harga_jual.value),
            buy_stok: parseInt(this.refs.stok.value),
            tanggal_expired: this.refs.tanggal_expired.value,
            tanggal_pembelian: this.refs.tanggal_pembelian.value,
            outcome: parseInt(this.refs.harga_beli.value) *  parseInt(this.refs.stok.value)
        }
        
        this.setState({
            data:data
        }, () => {
            this.props.storePembelian(this.state.data)
            this.resetStoreValue()
        })
    }

    resetStoreValue(){
        this.refs.supplyer.value = '' 
        this.refs.kode_obat.value = '' 
        this.refs.nama_obat.value = '' 
        this.refs.kategori_obat.value = ''
        this.refs.harga_beli.value = ''
        this.refs.harga_jual.value = ''
        this.refs.stok.value = ''
        this.refs.tanggal_expired.value = ''
        this.refs.tanggal_pembelian.value = ''

        this.props.offAlert()
        this.props.clearExistObat()
    }

    resetStoreActionValue = (e) => {
        e.preventDefault()

        this.resetStoreValue()
    }

    checkExistCode = (e) => {
        const value = e.target.value
        this.setState({
            code: value
        }, () => {
            this.props.checkExistCode(this.state.code)
            setTimeout(() => {
                if(!this.props.exist_code){
                    this.refs.nama_obat.value = ''
                    this.refs.kategori_obat.value = ''
                    this.refs.harga_jual.value = ''
                    this.refs.tanggal_expired.value = ''
                    this.props.offAlert()
                }    
            }, 1000);
            
        })
    }

    closeAlert = (e) =>{
        const btn = document.getElementById('btn').style.display = 'none'
        
        this.props.offAlert()
    }


    render() {
        return (    
            <div style={{border: 'none'}} className="col-md-5 controller new-item">
                <div style={{border: '1px dotted rgba(99, 99, 99, 0.384)', padding: '20px', margin:'0', width: '100%'}}> 
            
                <h5 style={{textAlign:'center', marginBottom: '20px'}}> Input Pembelian Obat <small> (invoice: {this.props.invoice}) </small> </h5>
                
                    {this.props.code === 500 ?  
                        <div id="btn" class="alert alert-danger alert-dismissible">
                        <button onClick={this.closeAlert} style={{outline: 'none'}} class="close" data-dismiss="alert" aria-label="close">&times;</button>
                        <strong>Error!</strong> {this.props.alert_text}.
                        </div>
                    : null }

                    {this.props.code === 200 ? 
                        <div id="btn" class="alert alert-success alert-dismissible">
                            <button onClick={this.closeAlert} style={{outline: 'none'}} class="close" data-dismiss="alert" aria-label="close">&times;</button>
                            <strong>Berhasil!</strong> Data pembelian obat disimpan.
                        </div>

                    : null}

                    <form style={{fontSize: '12px'}} onSubmit={this.storePembelian}>
                        <div className="form-row">
                            <div className="form-group col-sm-12" style={{marginBottom: '5px'}}>
                                <input style={{fontSize: '13px', padding: '1px 10px'}} required ref="supplyer" type="text" className="form-control" placeholder="Supplyer"/>
                            </div>
                            
                            <div className="form-group col-sm-4" style={{marginBottom: '-5px'}}>
                                <input style={{fontSize: '13px', padding: '1px 10px'}} required ref="kode_obat" onBlur={(e) => this.checkExistCode(e)} type="text" className="form-control" placeholder="Kode obat"/>
                            </div>

                            <div className="form-group col-sm-4" style={{marginBottom: '-5px'}}>
                                <input style={{fontSize: '13px', padding: '1px 10px'}} required ref="nama_obat" type="text" value={this.props.exist_obat.name || ''} className="form-control" onChange={(e, target) => this.props.changeOnExist(e, 'name')} placeholder="Nama obat"/>
                            </div>
                            
                            <div className="form-group col-sm-4" style={{marginBottom: '-5px'}}>
                                <select onChange={(e, target) => this.props.changeOnExist(e, 'category_id')} value={this.props.exist_obat.category_id || ''} style={{fontSize: '13px', padding: '1px 10px'}} required ref="kategori_obat" className="form-control">
                                    <option value="">Kategori</option>
                                    {this.props.categories.map((kategori, index) => {
                                        return <option value={kategori._id} key={index}> {kategori.name} </option>
                                    })}
                                </select>
                            </div>

                            <div className="form-group col-sm-4" style={{marginBottom: '5px'}}>
                                <label className="small-label"> Harga Beli (Rp) </label>
                                <input style={{fontSize: '13px', padding: '1px 10px'}} required ref="harga_beli" type="number" className="form-control" min={1} placeholder="0"/>
                            </div>
                            <div className="form-group col-sm-4" style={{marginBottom: '5px'}}>
                                <label className="small-label"> Harga Jual (Rp) </label>
                                <input onChange={(e, target) => this.props.changeOnExist(e, 'price')} value={this.props.exist_obat.price || ''} style={{fontSize: '13px', padding: '1px 10px'}} required ref="harga_jual" type="number" className="form-control" min={1} placeholder="0"/>
                            </div>
                            <div className="form-group col-sm-4" style={{marginBottom: '5px'}}>
                                <label className="small-label"> Stok </label>
                                <input style={{fontSize: '13px', padding: '1px 10px'}} required ref="stok" type="number" className="form-control" min={1} placeholder="Stok Beli"/>

                            </div>
                            <div className="form-group col-sm-12" style={{marginBottom: '5px'}}>
                                <label className="small-label"> Tanggal Expired Obat</label>
                                                                
                                <input onChange={(e, target) => this.props.changeOnExist(e, 'exp_date')}  value={this.props.exist_obat.exp_date || ''} style={{fontSize: '13px', padding: '1px 10px'}} required ref="tanggal_expired" type="date" step="1" className="form-control"/>
                                
                            </div>

                            <div className="form-group col-sm-12" style={{marginBottom: '5px'}}>
                                <label className="small-label"> Tanggal Pembelian Obat</label>
                                <input style={{fontSize: '13px', padding: '1px 10px'}} required ref="tanggal_pembelian" type="datetime-local" className="form-control"/>
                            </div>

                            <div className="form-group col-sm-8">
                                <button type="submit" style={{fontWeight: 'bold'}} className="action-btn-add add-to-cart">Input pembelian obat</button>
                            </div>
                            
                            <div className="form-group col-sm-4">
                                <button onClick={this.resetStoreActionValue} type="submit" className="action-btn-delete add-to-cart">Reset</button>
                            </div>

                            {this.props.exist_code ? <div className="alert alert-success col-sm-12"> <b> Kode obat ditemukan. </b> Data pembelian akan di update ke data obat </div>  
                            : null } 

                        </div>
                    </form>    
                </div> 
            </div>
        )
    }
}

export default Add;
