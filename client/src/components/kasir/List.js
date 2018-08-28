import React, { Component } from 'react';

class List extends Component {
    constructor(props){
        super(props)

        this.state = {
            data: {}
        }
    }

    removeListKasir(e, data){
        this.props.removeList(data)
    }

    hapusAllItem(){
        this.props.clearAll()
    }
    
    render() {
        return (
            <div className="section bottom-space">
                <div className="header-section">
                    <h3>Daftar Item</h3>
                    <span style={{marginLeft: '20px',  fontSize: '13px'}}> ( invoice: {this.props.invoice} ) </span>
                    <button onClick={this.hapusAllItem.bind(this)} type="button" style={{float:'right'}} className="action-btn-edit">Clear All</button>
                    
                </div>
                <div style={{overflowY: 'scroll', height: '250px'}} className="table-responsive">
                    <table className="table table-striped table-kasir">
                        <thead className="thead-light">
                        <tr>
                            <th scope="col">Kode</th>
                            <th scope="col">Nama</th>
                            <th scope="col">Harga Barang</th>
                            <th style={{textAlign: 'center'}} scope="col">Jumlah Beli</th>
                            <th scope="col">Sub Harga</th>
                            <th scope="col">Hapus</th>
                        </tr>
                        </thead>
                        <tbody style={{overflowY: 'scroll'}}>
                        {this.props.items.map(item => 
                        <tr key={item._id}>
                            <td>{item.code}</td>
                            <td>{item.name}</td>
                            <td>Rp {this.props.rupiah(item.price, ",", ".", 2)}</td>
                            <td className="input-qty"> <input ref="qty" min="1" onBlur={(e) => this.props.editOnBlur(e) } onChange={(e, target) => this.props.edit(e, item.code)} className="qty-item-kasir" type="number" value={item.jumlah_beli || '' }></input> </td>
                            <td>Rp {this.props.rupiah(item.sub_harga, ",", ".", 2)}</td>
                            <td> 
                                <button onClick={(e) => this.removeListKasir(e, item)} type="button" style={{fontSize: '10px'}} className="action-btn-delete">X</button>
                            </td>
                        </tr>
                        )}
                        </tbody>
                    </table>
                    <p style={ this.props.items.length === 0 ? {textAlign: 'center', fontStyle: 'italic', fontWeight: 'bold', color:'grey', fontSize: '13px'} : {display: 'none'}}> Kasir kosong </p>
                </div>
                <hr/>
            </div>
        )
    }
}

export default List;
