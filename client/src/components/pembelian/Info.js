import React from 'react'
import moment from 'moment';

const Info = props => {
    const {info, user_id, category_id} = props

    return(
        <div>
            <div id="information-popup"
                onClick={(e) => props.disablePopUpMenu(e)}
                className="pop-up-background" />
            
            <div id="information-popup-content" className="section info-popup">
                <div className="header-popup">
                    <h5 style={{fontSize: '13px', textTransform: 'uppercase'}}>Detail Pembelian -- <small> (Invoice: {info.invoice}) </small> </h5>
                    <i onClick={(e) => props.disablePopUpMenu(e)} className="btn-close fas fa-times-circle"></i>
                </div>

                <div className="content-popup">
                    <div className="form-group row">
                        <label style={{fontSize: '11px'}} className="col-sm-2 col-form-label">Kode Obat: </label>
                        <div className="col-sm-10">
                            <input disabled value={info.code || ''} className="form-control"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label style={{fontSize: '11px'}} className="col-sm-2 col-form-label">Nama Obat: </label>
                        <div className="col-sm-10">
                            <input disabled value={info.name || ''} className="form-control"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label style={{fontSize: '11px'}} className="col-sm-2 col-form-label">Kategori Obat: </label>
                        <div className="col-sm-10">
                            <input disabled value={category_id.name || ''} className="form-control"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label style={{fontSize: '11px'}} className="col-sm-2 col-form-label">Harga Beli: </label>
                        <div className="col-sm-4">
                            <input disabled value={'Rp '+props.rupiah(info.buy_price, ',', '.', 0) || ''} className="form-control"/>
                        </div>
                        
                        <label style={{fontSize: '11px'}} className="col-sm-2 col-form-label">Harga Jual: </label>
                        <div className="col-sm-4">
                            <input disabled value={'Rp '+props.rupiah(info.sale_price, ',', '.', 0) || ''} className="form-control"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label style={{fontSize: '11px'}} className="col-sm-2 col-form-label">Stok Beli: </label>
                        <div className="col-sm-4">
                            <input disabled value={info.buy_stok || ''} className="form-control"/>
                        </div>
                        <label style={{fontSize: '11px'}} className="col-sm-2 col-form-label">Total Pengeluaran: </label>
                        <div className="col-sm-4">
                            <input disabled value={'Rp '+props.rupiah(info.outcome, ',', '.', 0) || ''} className="form-control"/>
                        </div>
                    </div>                    
                    <div className="form-group row">
                        <label style={{fontSize: '11px'}} className="col-sm-2 col-form-label">User: </label>
                        <div className="col-sm-10">
                            <input disabled value={user_id.name || ''} className="form-control"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label style={{fontSize: '11px'}} className="col-sm-2 col-form-label">Tanggal Pembelian: </label>
                        <div className="col-sm-10">
                            <input disabled value={props.moment(info.tanggal_pembelian) || ''} className="form-control"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Info