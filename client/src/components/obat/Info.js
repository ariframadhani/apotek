import React, { Component } from 'react';
import moment from 'moment';

class Item extends Component {

  popInfoMenu(e){
    this.props.popInfoMenu()    
  }

  render() {                
    return (      
      <div>
        <div id="information-popup" 
            onClick={this.popInfoMenu.bind(this)}
            className="pop-up-background"/>

        <div id="information-popup-content" className="section info-popup">
        <div className="header-popup">
            <h5 style={{fontSize: '13px', textTransform: 'uppercase'}}>Informasi</h5>
            <i onClick={this.popInfoMenu.bind(this)} className="btn-close fas fa-times-circle"></i>
        </div>

        <div className="content-popup">
            <div className="form-group row">
                <label style={{fontSize: '11px'}} className="col-sm-2 col-form-label">Nama: </label>
                <div className="col-sm-10">
                <input disabled value={this.props.info.name || ''} className="form-control" placeholder="Email"/>
                </div>
            </div>

            <div className="form-group row">
                <label style={{fontSize: '11px'}} className="col-sm-2 col-form-label">Kategori: </label>
                <div className="col-sm-10">
                <input disabled className="form-control" value={this.props.category.name || ''} placeholder="Kategori"/>
                </div>
            </div>

            <div className="form-group row">
                <label style={{fontSize: '11px'}} className="col-sm-2 col-form-label">Harga: </label>
                <div className="col-sm-4">
                <input disabled className="form-control" value={ 'Rp ' + this.props.rupiah(this.props.info.price, ',','.',0) || ''} type="text" placeholder="Rp 0"/>
                </div>

                <label style={{fontSize: '11px'}} className="col-sm-1 col-form-label">Stok: </label>
                <div className="col-sm-5">
                <input disabled className="form-control" value={this.props.info.stock || ''} placeholder="Rp 20000"/>
                </div>
            </div>

            <div className="form-group row">
                <label style={{fontSize: '11px'}} className="col-sm-2 col-form-label">Tanggal expired: </label>
                <div className="col-sm-10">
                <input disabled className="form-control" value={moment(this.props.info.exp_date).locale('id').format('LL') || ''} placeholder="02 02 1997"/>
                </div>
            </div>

            <div className="form-group row">
                <label style={{fontSize: '11px'}} className="col-sm-2 col-form-label">Dibuat oleh: </label>
                <div className="col-sm-10">
                <input disabled className="form-control" value={this.props.user.name + ' - ' + moment(this.props.info.created_at).locale('id').calendar() || ''} placeholder="User"/>
                </div>
            </div>


            <div className="form-group row">
                <label style={{fontSize: '11px'}} className="col-sm-2 col-form-label">Update terakhir oleh: </label>
                <div className="col-sm-4">
                <input placeholder="---" disabled className="form-control" value={this.props.info.updated_by || ''}/>
                </div>

                <label style={{fontSize: '11px'}} className="col-sm-1 col-form-label">Pada: </label>
                <div className="col-sm-5">
                <input disabled className="form-control" value={this.props.info.updated_at === null ? '---' : moment(this.props.info.updated_at).locale('id').calendar() || ''} />
                </div>
            </div>
            
            {/* <div className="form-group row">
                
            </div> */}

            <div className="form-group row">
                <label className="col-sm-2 col-form-label">Keterangan: </label>
                <div className="col-sm-10">
                <textarea placeholder="---" value={this.props.info.note || ''} disabled style={{resize: 'none'}} id="" cols="10" className="form-control" rows="5">
                
                </textarea>
                </div>
            </div>

        </div>

        </div>
      </div>
    )
  }
}

export default Item;
