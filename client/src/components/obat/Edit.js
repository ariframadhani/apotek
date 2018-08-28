import React, { Component } from 'react';
import axios from 'axios'
import Auth from '../package/auth'
import moment from 'moment'

class Edit extends Component {
  constructor(){
    super()

    this.state = {
      auth: new Auth(),
      optionChecked: false,
      required_new_category: false,
      class_alert: '',
      text_alert: '',
      alert: false,
      axist_code: false
    }
  }

  cancelButton(e){
    
    e.preventDefault()
    this.props.resetOldInfo()

    this.setState({
      exist_code: false
    })    
    
    document.getElementById("select-option-checkbox").style.display = 'none'
    document.getElementById('checkbox-option').checked = false
  }

  editOptionCheck(e){
    let style = document.getElementById("select-option-checkbox").style
    
    if(e.target.checked === true){
      style.display = 'block'
      style.marginBottom = '-5px'
      this.setState({
        required_new_category: true
      })
    }else{      
      this.setState({
        required_new_category: false
      })      
      style.display = 'none'
    }   
    
  }

  updateData(e){
    e.preventDefault()

    const id = this.refs._id.value
    const valid_category = this.refs.category.value === '' ? this.refs._kategori.value : this.refs.category.value

    const data = {
      code: this.refs.code.value.replace(/\s/g, "").trim(),
      name: this.refs.name.value,
      category_id: valid_category,
      user_id: this.props.user_id,
      price: this.refs.harga.value,
      stock: this.refs.stok.value,
      note: this.refs.note.value,
      exp_date: this.refs.exp_date.value,
      updated_at: Date.now(),
      updated_by: this.state.auth.getToken().user.name
    }
    axios.patch(process.env.REACT_APP_API_URI + `/api/obat/${id}`, data, {headers:this.props.headers})
    .then(res => {

      this.setState({
          alert: true,
          class_alert: 'alert alert-success',
          text_alert: [<strong> {'Data dengan kode "' + this.props.detail.code} </strong>,'" berhasil diupdate']
      })
      this.props.fetchData(this.props.meta_link)
      this.resetRefs()
      this.timeuotAlert()
      
    })
    .catch(err => {
      console.log(err.response);
      
      if(!err.response){
        this.setState({
          alert: true,
          class_alert: 'alert alert-danger',
          text_alert: [<strong> {'Network error.'} </strong>, 'Please check your db connection' ]
      })

      }else{
        switch(err.response.status){
          case 401:                    
              this.setState({
                  alert: true,
                  class_alert: 'alert alert-danger',
                  text_alert: [<strong> {'Error'} </strong>, 'Autentikasi expired. Silahkan re-login' ]
              })
  
              this.timeuotAlert()
          break;
  
          case 500:
  
              this.setState({
                  alert: true,
                  class_alert: 'alert alert-danger',
                  text_alert: [<strong> {'Error'} </strong>, 'Internal Server Error' ]
              })
              
              this.timeuotAlert()
          break;

          default:
          break;
        }
      }
      
    })
    
  }
  
  timeuotAlert(){
    setTimeout(function(){ 
      this.setState({
          alert: false
      })
  }.bind(this), 8000); // in second
  }
  
  resetRefs(){    
    this.refs._id.value = ''
    this.refs.name.value = ''
    this.refs.kategori.value = ''
    this.refs.category.value = ''
    this.refs.harga.value = ''
    this.refs.stok.value = ''
    this.refs.note.value = ''
    this.refs.exp_date.value = ''
    this.props.resetOldInfo()
    document.getElementById("select-option-checkbox").style.display = 'none'
    document.getElementById('checkbox-option').checked = false
  }

  // on blur
  checkValidCode(e){           
    if(e.target.value.length === 0){
        this.setState({exist_code: false})
    }
    else if(e.target.value === this.props.detail.code){
      this.setState({exist_code: false})
    }
    else{
        axios.get(process.env.REACT_APP_API_URI + '/api/obat/valid/'+e.target.value, {headers: this.props.headers})
        .then(res => {
            res.data.data.length === 1 ? this.setState({exist_code: true}) : this.setState({exist_code: false})            
        })
        .catch(err => {
            console.log(err);
        })
    }
  }


    render() {  
      let check_option = Object.keys(this.props.old_category).length === 0      
        return (
            <div className="col-md-6 controller">
              <h5> Edit {this.props.item} <small> ( pilih data terlebih dahulu )</small>  </h5>
              
              {!this.state.alert ? <div></div> : 
                <div className={this.state.class_alert}>
                    {this.state.text_alert}
                </div>
              }

                <form onSubmit={this.updateData.bind(this)}>
                <input ref="_id" type="hidden" value={this.props.old_info._id || ''}/>
                <div className="form-group row">
                <label style={{fontSize: '12px'}} className="col-sm-2 col-form-label col-form-label-sm">Kode:</label>
                <div className="control-edit col-sm-4"  >
                  <input maxLength="12" ref="code" value={this.props.old_info.code || ''} onChange={(e, target) => {this.props.edit(e, 'code'); this.checkValidCode(e)}} placeholder='Kode Obat' required type="text"/>
                </div>

                  {this.state.exist_code ? 
                  <div className="col-sm-6">
                    <label style={{fontSize: '12px'}} className="form-check-label alert alert-danger">
                      Kode obat sudah ada
                    </label>
                  </div> :  <div></div> 
                  }
                </div>
                
                

                <div className="form-group row">
                <label style={{fontSize: '12px'}} className="col-sm-2 col-form-label col-form-label-sm">Nama:</label>
                <div className="control-edit col-sm-10">                
                  <input ref="name" value={this.props.old_info.name || ''} onChange={(e, target) => this.props.edit(e, 'name')} placeholder='Info Nama' required type="text"/>
                </div>
              </div>
              
              <div className="form-group row">
                <label style={{fontSize: '12px'}} className="col-sm-2 col-form-label col-form-label-sm">Kategori:</label>
                <div className="control-edit col-sm-5">
                  <input ref="_kategori" value={this.props.old_category._id || ''} type="hidden" />
                  <input ref="kategori" value={this.props.old_category.name || ''} disabled type="text"/>
                </div>
                <div className="control-edit col-sm-3">
                <div className="form-check">
                  <input id="checkbox-option" className="form-check-input" type="checkbox" disabled={check_option} onChange={(e) => this.editOptionCheck(e)} />
                  <label style={{fontSize: '12px'}} className="form-check-label">
                    Edit Kategori?
                  </label>
                  </div>
                </div>
              </div>
              
              <div id="select-option-checkbox" className="form-group row"  style={{display: 'none'}}>
                <div className="control-edit col-sm-12">
                    <select ref="category" disabled={check_option} style={{fontSize: '12px'}} required={this.state.required_new_category === true}>
                        <option value="">Pilih Kategori</option>
                        {this.props.categories.map(category => 
                         <option key={category._id}
                            value={category._id}> {category.name} </option>
                        )}
                    </select>
                </div>
              </div>

              <div className="form-row control-edit">
                <div className="form-group col-md-3">
                    
                <label style={{fontSize: '12px'}}>Harga ( Rp )</label>
                  <input ref="harga" onChange={(e, target) => this.props.edit(e, 'price')} type="number" value={this.props.old_info.price || ''} placeholder="Harga" required/>
                </div>
                
                <div className="form-group col-md-3">
                    
                <label style={{fontSize: '12px'}}>Stok</label>
                  <input  ref="stok" name="name_info" type="number" value={this.props.old_info.stock || ''} onChange={(e, d) => this.props.edit(e, 'stock')} placeholder="Stok" required/>
                </div>

                <div className="form-group col-md-6" >
                <label style={{fontSize: '12px'}}>Tanggal Expired:</label>
                <input className="form-control" ref="exp_date" required type="date" onChange={(e, target) => this.props.edit(e, 'exp_date')} value={this.props.old_info.exp_date || ''} />                
              </div>
              </div>
              
              <div className="control-edit">
                <label style={{fontSize: '12px'}}>Catatan:</label>
              
                <textarea ref="note" onChange={(e, target) => this.props.edit(e, 'note')} placeholder="Catatan" cols="30" rows="6" value={this.props.old_info.note || ''}></textarea>
              </div>

              <button disabled={check_option || this.state.exist_code} style={ this.state.exist_code || check_option ? {width: '50%', cursor: 'not-allowed'} : {width: '50%', cursor: 'pointer'}} type="submit" className="btn-edit-menu">Edit <i className="fas fa-check-circle"></i></button>
              <button onClick={this.cancelButton.bind(this)} style={{float:'right', display:'inline'}} className="btn-cancel-menu">Cancel </button>
             </form>
             </div>
        )
    }
}

export default Edit;
