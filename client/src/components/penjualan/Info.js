import React, { Component } from 'react';

class Info extends Component {
    constructor(props){
        super(props)

        this.state = {
            data: {}
        }
    }

    popInfoMenu(e){
        e.preventDefault()

        this.props.popInfoMenu()
    }

    render() {
        return (
            <div>
                <div id="information-popup"
                    onClick={(e) => this.popInfoMenu(e)}
                    className="pop-up-background" />
                
                <div id="information-popup-content" className="section info-popup" >
                    <div className="header-popup">
                        <h5 style={{fontSize: '13px', textTransform: 'uppercase'}}>Detail Penjualan -- <small> (Invoice: {this.props.item.invoice}) </small> </h5>
                        <i onClick={(e) => this.popInfoMenu(e)} className="btn-close fas fa-times-circle"></i>
                    </div>

                    <div className="content-popup">

                        <div className="table-responsive">
                        <table className="table table-custom">
                            <thead className="thead-light">
                                <tr>
                                <th scope="col">Nama Obat</th>
                                <th scope="col">Jumlah Beli</th>
                                <th scope="col">Harga Obat</th>
                                <th scope="col">Sub Harga</th>      
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.cashier.map(item => {
                                return <tr key={item._id}>
                                <td>{item.name}</td>
                                <td>{item.jumlah_beli}</td>
                                <td>Rp {this.props.toRupiah(item.price,'.',',')}</td>
                                <td>Rp {this.props.toRupiah(item.sub_harga,'.',',')}</td>
                                </tr>
                                })}
                            </tbody>
                        </table>
                        </div>
                    
                        <div className="form-group row col-md-12">
                            <label className="col-sm-4" > Harga Resep: </label>
                            <input style={{textAlign: 'center', marginBottom: '10px'}} disabled value={"Rp " + this.props.toRupiah(this.props.item.recipe,'.',',')} className="form-control col-sm-8"/>
                            <label className="col-sm-4" > Total Harga Penjualan: </label>
                            <input style={{textAlign: 'center'}} disabled value={"Rp " + this.props.toRupiah(this.props.item.total,'.',',')} className="form-control col-sm-8"/>
                        </div>
                    </div>
                </div>

                
            </div>
        )
    }
}

export default Info;
