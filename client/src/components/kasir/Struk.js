import React from 'react';

const Struk = props => {    
    const {invoice, pembayaran, kembalian, total, items, recipe} = props
    
    return (
        <div id="struk" style={{display: 'none'}}>
            <div className="section">
                <div className="header-section">
                    <h3>{invoice}</h3>
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
                                {items.map(item => {
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
                        <input style={{textAlign: 'center', marginBottom: '10px'}} disabled value={"Rp " + props.rupiah(recipe,'.',',')} className="form-control col-sm-8"/>
                        <label className="col-sm-4" > Total Harga: </label>
                        <input style={{textAlign: 'center', marginBottom: '10px'}} disabled value={"Rp " + props.rupiah(total,'.',',')} className="form-control col-sm-8"/>
                        <label className="col-sm-4" > Pembayaran: </label>
                        <input style={{textAlign: 'center', marginBottom: '10px'}} disabled value={"Rp " + props.rupiah(pembayaran,'.',',')} className="form-control col-sm-8"/>
                        <label className="col-sm-4" > Kembalian: </label>
                        <input style={{textAlign: 'center'}} disabled value={ isNaN(kembalian) ? "Rp " + 0 : "Rp " + props.rupiah(kembalian,'.',',') } className="form-control col-sm-8"/>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default Struk