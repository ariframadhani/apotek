import React, { Component } from 'react';
import axios from 'axios'
import Auth from '../package/auth'
import Sidebar from '../section/Sidebar'
import Chart from './Chart';
import moment, { months } from 'moment'

class Dashboard extends Component {

  constructor(props){
    super(props)   

    const auth = new Auth()

    this.state = {
      auth: new Auth(),
      show: false,
      headers: {
        Authorization: 'Bearer ' + auth.getToken().token,
        'Content-Type': 'application/json'
      },
      obat: [],
      exp_obat: 0,
      safe_obat: 0,
      kategori: [],
      penjualan: 0,
      penjualan_per_filter: 0,
      alert_text: '',
      alert_class: '',
      alert: false,
      data_penjualan: {
        data: [],
        labels: moment.monthsShort(),
        total: 100,
        years: []
      },
      filter_info: '',
      monthNames: [ "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ],
      filter_penjualan: [],
      filter_pembelian: [],
      loading: true,
    }
  }

  unauthorizedNotif(){
    setTimeout(() => {
      this.state.auth.logout()
      document.location.href = '/login'
      
    }, 6000);
  }
  checkExpiredObat(){
    let expired = 0
    let safe = 0
    this.state.obat.map(d => {      
      if(Date.now() > Date.parse(d.exp_date)){
        expired++
        return d.status = 'Expired'
      }else{
        safe++
        return d.status = 'Belum Expired'
      }
    })

    this.setState({
      exp_obat: expired,
      safe_obat: safe
    })
  }


  fetchDataObat(){
    axios.get(process.env.REACT_APP_API_URI + '/api/obat', {headers: this.state.headers})
    .then(res => {
      this.setState({
        obat: res.data.data.docs
      })

      this.checkExpiredObat()
    })
    .catch(err => {
      if(!err.status){
        this.setState({
          alert: true
        })

        this.unauthorizedNotif()
      }else{
        if(err.response.status === 401){
          this.setState({
            alert: true
          })
  
          this.unauthorizedNotif()
        }

      }
    })
  }

  fetchKategori(){
    axios.get(process.env.REACT_APP_API_URI + '/api/kategori', {headers: this.state.headers})
    .then(res => {
      this.setState({
        kategori: res.data.data
      })     
    })
    .catch(err => {
      console.log(err);
    }) 
  }

  
  fetchPenjualan(year, month){
    const date = new Date()
    
    year = year ? parseInt(year, 10) : date.getFullYear()
    
    this.fetchPembelian(year, month)
    axios.get(process.env.REACT_APP_API_URI + '/api/penjualan', {headers: this.state.headers})
    .then(res => {
        let data =  [] 
        let labels = this.state.data_penjualan.labels
        let label_keys = [...labels.keys()]
        let final = []
        let total = 0
        let data_penjualan = {}

        data = res.data.data.docs

        if(year){
          data.map(d => {
            if(new Date(d.created_at).getFullYear() === year){
              total++    
            }
          })
          
          this.setState({penjualan_per_filter: total})
        }

        if(month){          
          this.listFilter(data, this.state.list_pembelian, year, month)
          total = 0;
          data.map(d => {            
            if(new Date(d.created_at).getFullYear() === year){
              if(new Date(d.created_at).getMonth() === parseInt(month, 10)){
                total++                   
              }
            }
          })

          let dayInMonth = this.getDayInMonthYear(year,month)
          
          let data_penjualan = {...this.state.data_penjualan};       
          data_penjualan.labels = dayInMonth
        
          this.setState({data_penjualan})

          labels = dayInMonth
          label_keys = [...labels.keys()]
          
            label_keys.forEach(element => {
              data.map(d => {
                if(new Date(d.created_at).getFullYear() === year){
                  if(new Date(d.created_at).getMonth() === parseInt(month, 10)){
                    if(new Date(d.created_at).getDate() === element + 1){
                      final[element] = (final[element] || 0)+1
                    }else{
                      final[element] = (final[element] || 0)
                    }
                  }else{
                    final[element] = (final[element] || 0)
                  }
                }
              })
            });        
            
            data_penjualan = {...this.state.data_penjualan};       
            data_penjualan.data = final
            
            this.setState({data_penjualan, 
              penjualan: data.length, 
              penjualan_per_filter: total,
              filter_info: 'Bulan ' + this.state.monthNames[month] + ' ' + year
            })
        }else{
        
          this.listFilter(data, this.state.list_pembelian, year)
          label_keys.forEach(element => {
            data.map(d => {
              if(new Date(d.created_at).getFullYear() === year){
                if(new Date(d.created_at).getMonth() === element){
                  final[element] = (final[element] || 0)+1
                }else{
                  final[element] = (final[element] || 0)
                }
              }else{
                  final[element] = (final[element] || 0)
              }
            })
        });        
        
        data_penjualan = {...this.state.data_penjualan};       
        data_penjualan.data = final
        data_penjualan.labels = moment.monthsShort()
        this.setState({data_penjualan, penjualan: data.length, filter_info: 'Tahun ' + year, loading: false})
      }
    })
    .catch(err => {
        console.log(err);
        
    })
  }

  fetchPembelian(year, month){
    axios.get(process.env.REACT_APP_API_URI + '/api/pembelian', {headers: this.state.headers})
    .then(res => {
      this.setState({
        list_pembelian: res.data.data.docs
      })
    })
    .catch(err => {
      console.log(err);
      
    })
  }

  listFilter(penjualan, pembelian, year, month){
    const list_penjualan = []
    const list_pembelian = []
    
    if(this.state.list_pembelian){
      if(!month){
        penjualan.map(d => {
          if(new Date(d.created_at).getFullYear() === year){
            list_penjualan.push(d)
          }
        })

        pembelian.map(beli => {
          if(new Date(beli.created_at).getFullYear() === year){
            list_pembelian.push(beli)
          }
        })
      }else{
        penjualan.map(d => {
          if(new Date(d.created_at).getFullYear() === year){
            if(new Date(d.created_at).getMonth() === parseInt(month, 10))
              list_penjualan.push(d)
          }
        })

        pembelian.map(d => {
          if(new Date(d.created_at).getFullYear() === year){
            if(new Date(d.created_at).getMonth() === parseInt(month, 10))
              list_pembelian.push(d)
          }
        })
      }
     
    }else{
      this.fetchPenjualan(year, month)
      
    }
    // PENGATURAN GRAPH CHART DAN DONAT CHART
    this.setState({
      filter_penjualan: list_penjualan,
      filter_pembelian: list_pembelian
    })       
  }

  getDayInMonthYear(year, month){
    const names = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    const date = new Date(year, month, 1)
    const result = []

    while(date.getMonth() == month){
      // result.push(names[date.getDay()])
      result.push(date.getDate())
      date.setDate(date.getDate() + 1)

    }       
    return result
  }

  realTimeStatusObat(){
    this.fetchDataObat()
  }

  selectTenYearsfromNow(){
    let currYear = new Date().getFullYear()
    let future = currYear + 4
    let future_years = []

    for (let i = 2018; i < future; i++) {
      future_years.push(i)
    }
    
    this.state.data_penjualan.years = future_years
    
  }
  
  componentDidMount(){
    setInterval(this.realTimeStatusObat.bind(this), 5000)

    this.selectTenYearsfromNow()
    this.fetchDataObat()
    this.fetchPenjualan()
    this.fetchKategori()
    this.getDayInMonthYear(2018, 7)
  }
  
  addCategory(e){
    e.preventDefault()
    let name = this.refs.kategori_name.value

    let data = {
      name: name,
    }

    axios.get(process.env.REACT_APP_API_URI + `/api/kategori/valid/${name}`, {headers:this.state.headers})
    .then(res => {
      if(res.data.length === 1){
        
        this.setState({
          show: true,
          alert_text: [<strong> Kategori sudah ada </strong>, 'gunakan nama yang lain'],
          alert_class: "alert alert-danger",
          exist: true
        })
      }else{
        axios.post(process.env.REACT_APP_API_URI + '/api/kategori', data, {headers: this.state.headers})
        .then(res => {

          this.setState({
            show: true,
            alert_text: <strong> Kategori berhasil ditambahkan </strong>,
            alert_class: "alert alert-success",
          })
          
          this.fetchKategori()

          this.resetValue()
        })
        .catch(err => {
          console.log(err.response);
          
        })
      }
    })
    .catch(err => {
      console.log(err.response);
      
    })
  }

  getSelectedItem(e){
    e.preventDefault()
    
    var index = e.nativeEvent.target.selectedIndex
    
    if(index !== 0){
      var selected = e.nativeEvent.target[index].text
      this.refs.kategori_name.value = selected

      this.setState({
        selected_category: this.refs.kategori_name.value
      })

    }else{  
      this.setState({
        show: false,
        exist: false
      })
      
      this.refs.kategori_name.value = ''
    }
    
  }

  editCategory(e){
    e.preventDefault()
    const id = this.refs.kategori.value
    const name = this.refs.kategori_name.value

    const data = {
      name: name
    }

    if(id !== ''){
      axios.get(process.env.REACT_APP_API_URI + `/api/kategori/valid/${name}`, {headers:this.state.headers})
      .then(res => {
        if(res.data.length === 1){
          
          this.setState({
            show: true,
            alert_text: <strong> Kategori berhasil diupdate </strong>,
            alert_class: "alert alert-warning",
            exist: true
          })
          this.fetchKategori()
          this.resetValue()

        }else{
          axios.patch(process.env.REACT_APP_API_URI + `/api/kategori/${id}`, data, {headers: this.state.headers})
          .then(res => {
            this.setState({
              show: true,
              alert_text: <strong> Kategori berhasil diupdate </strong>,
              alert_class: "alert alert-warning",
            })
            this.fetchKategori()
            this.resetValue()
          })
          .catch(err => {
            console.log(err.response);
            
          })
        }
      })
      .catch(err => {
        console.log(err.response);
        
      })
    }
    
  }

  deleteCategory(e){
    e.preventDefault()

    let id = this.refs.kategori.value
    
    if(id !== ''){

      axios.delete(process.env.REACT_APP_API_URI + `/api/kategori/${id}`, {headers: this.state.headers})
      .then(res => {
        this.refs.kategori_name.value = ''
        
        this.setState({
          show: true,
          alert_text: <strong> Kategori berhasil dihapus </strong>,
          alert_class: "alert alert-info",
        })

        this.fetchKategori()
        this.resetValue()
      })
      .catch(err => {
        if(err.response.status === 422){
          this.setState({
            show: true,
            alert_text: [<strong> Kategori sedang digunakan </strong>, 'tidak bisa dihapus' ],
            alert_class: "alert alert-danger",
          })
  
          setTimeout(() => {
            this.setState({
              show: false
            })
          }, 6000);
        }
      })
    }
  }

  checkValidKategoriName(){
    let value = this.refs.kategori_name.value
    
    if(value.length === 0){
      this.setState({
        show: false,
        exist: false
      })
    }else{
      axios.get(process.env.REACT_APP_API_URI + `/api/kategori/valid/${value}`, {headers: this.state.headers})
      .then(res => {
        if(res.data.length === 1){
          this.setState({
            show: true,
            alert_text: [<strong> Kategori sudah ada </strong>, 'gunakan nama yang lain'],
            alert_class: "alert alert-danger",
            exist: true
          })
        }else{
          this.setState({
            show: false,
            exist: false
          })
        }
      })
      .catch(err => {
        console.log(err);                
      })
    }
  }

  resetValue(){
    setTimeout(() => {
      this.setState({
        show: false,
        exist: false
      })
      
    }, 6500);

    this.refs.kategori_name.value = ''
    this.refs.kategori.value = ''
  }


  render() {    
    return (
      <div>
        <Sidebar/>
      <div id="content">

        {!this.state.alert ? <div></div> :  
        <div className="alert alert-danger">
            <strong> Pengambilan data gagal. </strong> Redirect ke halaman login dalam 5 detik
        </div>
        }

        <Chart {...this.state} 
          fetchOnYear={this.fetchPenjualan.bind(this)}
          fetchOnMonth={this.fetchPenjualan.bind(this)}
        />

         <div className="section">
          <div className="header-section">
            <h3 >Informasi Obat</h3>
          </div>
          
          <div className="informasi">
            <i style={{fontSize: '14px'}}> Total Data: <span style={{marginRight: '20px'}} className="badge badge-dark">{this.state.obat.length}</span></i>
            <i style={{fontSize: '14px'}}> Expired: <span style={{marginRight: '20px'}} className="badge badge-danger">{this.state.exp_obat}</span></i>
            <i style={{fontSize: '14px'}}> Belum Expired: <span style={{marginRight: '20px'}} className="badge badge-success">{this.state.safe_obat}</span> </i>
          </div>
        </div>

        <div className="section bottom-space">
          <div className="header-section">
            <h3>Informasi Kategori</h3>
          </div>
          
          <div className="informasi">
            <i style={{fontSize: '14px'}}> Total Kategori: <span style={{marginRight: '20px'}} className="badge badge-dark">{this.state.kategori.length}</span></i>

            <form onSubmit={this.addCategory.bind(this)}>
            <div className="form-row">
              <div className="form-group col-md-2">
                <label style={{fontSize: '12px'}}>Kategori: </label>
                <input onChange={(e) => this.checkValidKategoriName(e) } required style={{fontSize: '13px'}} type="text" className="form-control" ref="kategori_name" placeholder="Nama Kategori" />
              </div>
              <div className="form-group col-md-4">
                <label style={{fontSize: '12px'}}>Daftar Kategori: </label>
                <select onChange={(e) => this.getSelectedItem(e)} ref="kategori" style={{fontSize: '13px'}}  className="form-control">
                  <option value="">-</option>
                  {this.state.kategori.map(cat =>
                  <option value={cat._id} key={cat._id}>{cat.name} </option>
                  )}
                </select>
              </div>

                <div style={{marginTop: '32px'}} className="col-md-2">
                  <button disabled={this.state.exist} style={!this.state.exist ? {cursor: 'pointer'} : {cursor: 'not-allowed'}} type="submit" style={{fontSize: '13px', width: '100%', fontWeight: 'normal'}} className="action-btn-info mb-2">Tambah Kategori</button>
                </div>
                <div style={{marginTop: '32px'}} className="col-md-2">
                  <button onClick={this.editCategory.bind(this)} style={{fontSize: '13px', width: '100%', fontWeight: 'normal'}} className="action-btn-edit mb-2">Edit</button>
                </div>
                <div style={{marginTop: '32px'}} className="col-md-2">
                  <button onClick={this.deleteCategory.bind(this)} style={{fontSize: '13px', width: '100%', fontWeight: 'normal'}} className="action-btn-delete mb-2">Hapus</button>
                </div>
                
                <p style={{fontSize: '11px'}}>( Pilih kategori terlebih dahulu sebelum melakukan aksi edit dan delete ) </p>
                
            </div>
          </form>

          {!this.state.show ? <div></div> :        
            <div className={this.state.alert_class}>{this.state.alert_text} </div>
          }
          
          </div>
        </div>
        
      </div>
      </div>
    )
  }
}

export default Dashboard;
