import React, { Component } from 'react';

const Invoice = props => {
    const {print, cashier} = props
    return (
        
        <div id="print" style={{display: 'none'}}>
            <div className="section">
                <div className="header-section">
                    <h3>{print.invoice}</h3>
                </div>
                
                <div className="item">
                    <small> Daftar Pembelian </small>
                    <div style={{marginTop: '20px'}} className="table-responsive">
                        <table className="table table-custom">
                            <thead className="thead-light">
                                <tr>
                                <th scope="col">Nama Obat</th>
                                <th scope="col">Jumlah Beli</th>
                                <th scope="col">Harga Beli</th>
                                <th scope="col">Sub Harga</th>      
                                </tr>
                            </thead>
                            <tbody>
                                {cashier.map(item => {
                                return <tr key={item._id}>
                                <td>{item.name}</td>
                                <td>{item.jumlah_beli}</td>
                                <td>Rp {props.rupiah(item.price, ',', '.', 2)}</td>
                                <td>Rp {props.rupiah(item.sub_harga, ',', '.', 2)}</td>
                                </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="form-group row col-md-12">
                        <label className="col-sm-4" > Harga Resep: </label>
                        <input style={{textAlign: 'center',  marginBottom: '10px'}} disabled value={"Rp " + props.rupiah(print.recipe,'.',',')} className="form-control col-sm-8"/>
                        <label className="col-sm-4" > Total Harga: </label>
                        <input style={{textAlign: 'center',  marginBottom: '10px'}} disabled value={"Rp " + props.rupiah(print.total,'.',',')} className="form-control col-sm-8"/>
                        <label className="col-sm-4" > Pembayaran: </label>
                        <input style={{textAlign: 'center',  marginBottom: '10px'}} disabled value={"Rp " + props.rupiah(print.cash,'.',',')} className="form-control col-sm-8"/>
                        <label className="col-sm-4" > Kembalian: </label>
                        <input style={{textAlign: 'center'}} disabled value={ isNaN(print.change) ? "Rp " + 0 : "Rp " + props.rupiah(print.change,'.',',') } className="form-control col-sm-8"/>
                    </div>
                </div>
                
            </div>
        </div>
    )
}


export default Invoice;
