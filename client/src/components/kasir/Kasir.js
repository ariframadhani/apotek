import React, { Component } from 'react';
import List from './List';
import Struk from './Struk';
import Auth from '../package/auth'
import axios from 'axios'
import Sidebar from '../section/Sidebar'
import update from 'react-addons-update'

class Kasir extends Component {
    constructor(props){
        super(props)

        const auth = new Auth()

        this.state = {
            auth: new Auth(),
            items: [],
            available_stock: [],            
            headers: {
                Authorization: 'Bearer ' + auth.getToken().token,
                'Content-Type': 'application/json'
            },
            total: 0,
            recipe: 0,
            pembayaran: 0,
            kembalian: 0,
            exist_code: true,
            alert:false,
            invoice: '',
            saved: false,
            disabled: true,
            sisa_stok: null,
            alert_stok: false
        }
    }

    checkExpired(data){
        return Date.now() > Date.parse(data.exp_date) ? true : false        
    }

    addToCart(e){
        e.preventDefault()

        let kode = this.refs.kode_obat.value
        let jumlah_beli = parseInt(this.refs.jumlah.value,10)

        axios.get(process.env.REACT_APP_API_URI + '/api/obat/valid/'+kode, {headers: this.state.headers})
        .then(res => {
            let result = res.data.data[0]
            
            let data = {
                code: result.code,
                exp_date: result.exp_date,
                name: result.name,
                price: result.price,
                stock: result.stock,
                _id: result._id,
                jumlah_beli: jumlah_beli,
                sub_harga: result.price * jumlah_beli
            }

            let expired = this.checkExpired(result)

            if(expired){
                alert('Obat Expired')
            }else{
                const state = this.state
                let exists = state.items.some(o => o.code === data.code);
                
                if(exists){

                    let exist_stock = state.available_stock.some(o => o.code === data.code)
                    
                    if(exist_stock){
                        let findStok = state.available_stock.find(availstok => availstok.code === kode)
                        
                        if(jumlah_beli > findStok.available){
                            this.setState({
                                sisa_stok: findStok.available,
                                alert_stok: true
                            })
                            
                        }else{
                            let foundIndex = state.items.findIndex(x => x.code === kode);
                            let foundStokIndex = state.available_stock.findIndex(x => x.code === kode);
                            
                            let newQty = state.items[foundIndex].jumlah_beli + jumlah_beli
                            let newSubPrice = state.items[foundIndex].price * newQty
                            
                            let newAvailable = state.available_stock[foundStokIndex].available - jumlah_beli

                            this.setState({
                                items: update(state.items, {[foundIndex]: {
                                    sub_harga: {
                                        $set: newSubPrice
                                    },  
                                    jumlah_beli: {
                                        $set: newQty
                                    }
                                }}),

                                available_stock: update(state.available_stock, {[foundStokIndex]: {
                                    available: {
                                        $set: newAvailable
                                    }
                                }})
                            
                            })                
                            this.refs.kode_obat.value = ''
                            this.refs.jumlah.value = ''
                            this.setState((prevstate, props) => {
                                return {
                                    alert_stok: false
                                }
                            })
                        }
                    }

                }else{       
                    if(data.jumlah_beli > data.stock){
                        this.setState({
                            sisa_stok: data.stock,
                            alert_stok: true
                        })
                    } else{
                        this.refs.kode_obat.value = ''
                        this.refs.jumlah.value = ''

                        let available_stock = {
                            code: data.code,
                            available: data.stock - data.jumlah_beli,
                            from: data.stock
                        }

                        this.setState({
                            items: [...this.state.items, data],
                            available_stock: [...this.state.available_stock, available_stock]
                        })
                        this.setState((prevstate, props) => {
                            return {
                                alert_stok: false
                            }
                        })

                        this.setAvailableStock(this.state.available_stock)
                    }
                }
                
                this.getTotalBiaya()
                this.setAvailableStock(this.state.available_stock)
                this.setLocalKasir(this.state.items)
            }

        })
        .catch(err => {
            console.log(err);
        })
    }

    setAvailableStock(list){
        let convert = JSON.stringify(list)
        
        localStorage.setItem('available_stok', convert)
    }

    edit(e, target){    
        const state = this.state
        let jumlah_beli = parseInt(e.target.value, 10)

        e.target.defaultValue = jumlah_beli   

        if(isNaN(jumlah_beli)){
            jumlah_beli = 1
        }
        if(jumlah_beli <= 0){
            jumlah_beli = 1
        }
    
        let findStok = state.available_stock.find(availstok => availstok.code === target)

        if(jumlah_beli > findStok.from){
            jumlah_beli = findStok.from
        }else{
            let foundIndex = state.items.findIndex(x => x.code === target);
            let foundStokIndex = state.available_stock.findIndex(x => x.code === target);

            let newQty = parseInt(jumlah_beli,10)
            let newSubPrice = state.items[foundIndex].price * newQty
            
            let newAvailable
            let nav = state.available_stock[foundStokIndex]

            if(jumlah_beli <= nav.from){            
                newAvailable = nav.from - jumlah_beli
                
            }else{
                newAvailable = nav.from + jumlah_beli
            }

            this.setState({
                items: update(state.items, {[foundIndex]: {
                    sub_harga: {
                        $set: newSubPrice
                    },  
                    jumlah_beli: {
                        $set: newQty
                    }
                }}),
             })
             
             let av = {...this.state.available_stock}
             av[foundStokIndex].available = newAvailable
        }
        
        this.setAvailableStock(this.state.available_stock)
        this.setLocalKasir(this.state.items)
    }

    editOnBlur(){
        this.setLocalKasir(this.state.items)
        this.getTotalBiaya()
    }

    setLocalKasir(list){
        let convert = JSON.stringify(list)
        localStorage.setItem('kasir', convert)
    }
    
    checkLocalKasir(){
        let get = localStorage.getItem("kasir")
        let stok_available = localStorage.getItem("available_stok")

        if(get && stok_available){
            let storage = JSON.parse(get)
            let available = JSON.parse(stok_available)

            this.setState({
                items: storage,
                available_stock: available
            })
            
        }else{
            this.setState({
                items: [],
                available_stock: []
            })
        }
        
    }

    formatCurrency(amount, decimalSeparator, thousandsSeparator, nDecimalDigits){  
        var num = parseFloat( amount ); //convert to float  
        //default values  
        decimalSeparator = decimalSeparator || '.';  
        thousandsSeparator = thousandsSeparator || ',';  
        nDecimalDigits = nDecimalDigits === null? 2 : nDecimalDigits;  
      
        var fixed = num.toFixed(nDecimalDigits); //limit or add decimal digits  
        //separate begin [$1], middle [$2] and decimal digits [$4]  
        var parts = new RegExp('^(-?\\d{1,3})((?:\\d{3})+)(\\.(\\d{' + nDecimalDigits + '}))?$').exec(fixed);   
      
        if(parts){ //num >= 1000 || num < = -1000  
            return parts[1] + parts[2].replace(/\d{3}/g, thousandsSeparator + '$&') + (parts[4] ? decimalSeparator + parts[4] : '');  
        }else{  
            return fixed.replace('.', decimalSeparator);  
        }  
    }  

    checkCode(e){
        if(e.target.value.length === 0){
            this.setState({exist_code: true, alert_stok: false})
        }else{
            axios.get(process.env.REACT_APP_API_URI + '/api/obat/valid/'+e.target.value, {headers: this.state.headers})
            .then(res => {                
                res.data.data.length === 1 ? 
                this.setState({exist_code: true}) : 
                this.setState({exist_code: false, alert_stok: false})           
                
            })
            .catch(err => {
                if(!err.status){                    
                    this.setState({
                        alert: true
                    })
                      this.unauthorizedNotif()
                }
                else if(err.response.status === 500){
                    console.log('Internal Server Error');
                    
                }
                console.log(err.response);
            })
        }
    }    

    checkCodeChange(e){
        if(e.target.value.length === 0){
            this.setState({exist_code: true, alert_stok: false})
        }
    }

    unauthorizedNotif(){
        setTimeout(() => {
        this.state.auth.logout()
        document.location.href = '/login'
        
        }, 6000);
    }

    checkValidQty(e){
        if(e.target.value < 0){
            e.target.value = 1
        }
    }

    checkConnection(){        
        axios.get(process.env.REACT_APP_API_URI + '/api/check', {headers: this.state.headers})
        .then(res => {            
        })
        .catch(err => { 
            this.setState({
                alert: true
            })
            this.unauthorizedNotif()
            
        })
    }

    changeToRupiahRecipe(e){
        let number = e.target.value
        this.state.recipe = parseInt(number)

        if(number !== ''){
            if(!isNaN(number)){
                e.target.value = 'Rp ' + this.formatCurrency(number,  ",", ".", 2)      
            }  else{
                e.target.value = 0
            }
        }   
    }
    
    changeToRupiah(e){
        let number = e.target.value
        this.state.pembayaran = parseInt(number)

        if(number !== ''){
            if(!isNaN(number)){
                e.target.value = 'Rp ' + this.formatCurrency(number,  ",", ".", 2)      
            }  else{
                e.target.value = 0
            }
        }        
        
    }

    removeList(data){
        const newList = this.state.items.filter(item => {
            return item !== data
        })
        
        let findFirst = this.state.available_stock.find( availdata => availdata.code === data.code )
        const newStok = this.state.available_stock.filter( stok => {
            return stok !== findFirst
        })

        this.setState({
            items: newList,
            available_stock: newStok
        })
        
        this.setLocalKasir(newList)
        this.setAvailableStock(newStok)

        let total = newList.reduce(
            (a,b) => { return a + b.sub_harga }, 0)
        
        this.setState({
            total: total
        })

        if(newList.length <= 0){
            this.resetCost() 
            this.setState({ disabled: true })
        }
        
    }

    resetCost(){
        
        this.state.pembayaran = 0
        this.state.kembalian = 0
        this.refs.pembayaran.value = null
        this.refs.kembalian.value = null
        localStorage.removeItem('cost')
    }

    clearAll(){
        this.state.items.length = 0
        this.state.available_stock.length = 0
        this.resetCost()

        this.setState({
            items: [],
            available_stock: []
        })

        this.setState({ disabled: true })
        this.setLocalKasir(this.state.items)
        this.setAvailableStock(this.state.available_stock)
        this.getTotalBiaya()
    }

    getTotalBiaya(){  
        let recipe = this.state.recipe        
        let total = this.state.items.reduce(
            (a,b) => { return a + b.sub_harga }, 0)

        recipe = isNaN(recipe) ? 0 : recipe

        total += recipe
            
        this.setState({
            total: total
        })
    }

    componentWillMount(){
        this.checkLocalKasir()
        this.createInvoice()
    }

    componentDidMount(){
        setInterval(this.checkConnection.bind(this), 5000);
        
        this.checkCost()
        this.getTotalBiaya()
    }

    checkCost(){
        let storage = localStorage.getItem('cost')
        
        if(storage){
            let data = JSON.parse(storage)
            
            let pembayaran = data.pembayaran
            let kembalian = data.kembalian
            let recipe = data.recipe

            this.state.recipe = recipe === 0 ? 0 : recipe
            this.state.pembayaran = pembayaran === 0 ? 0 : pembayaran
            this.state.kembalian = kembalian === 0 || pembayaran === 0 ? 0 : kembalian

            this.refs.recipe.value = this.state.recipe === 0 ? '' : 'Rp ' + this.formatCurrency(this.state.recipe,  ",", ".", 2)
            this.refs.pembayaran.value = this.state.pembayaran === 0 ? '' : 'Rp ' + this.formatCurrency(this.state.pembayaran,  ",", ".", 2)   
            this.refs.kembalian.value = this.state.kembalian === 0 ? '' : 'Rp ' + this.formatCurrency(this.state.kembalian,  ",", ".", 2)   
        }else{
            this.state.pembayaran = 0,
            this.state.kembalian = 0
            this.state.recipe = 0

            this.refs.recipe.value = ''
            this.refs.pembayaran.value = '' 
            this.refs.kembalian.value = ''  
        }

        
        let pembayaran = this.state.pembayaran
        let kembalian = this.state.kembalian
        
        if(pembayaran === 0){
            this.setState({ disabled: true })
        }else{
            if(kembalian < 0){
                this.setState({ disabled: true })
            }else{
                this.setState({ disabled: false })
            }
        }
        
    }

    createInvoice(){
        let check = localStorage.getItem('invoice')

        if(check){
            this.setState({
                invoice: check
            })
        }else{
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            
            for (var i = 0; i < 15; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            
            this.setState({
                invoice: text
            })
        }
    }

    saveKasir(e){
        e.preventDefault()
        let pembayaran = parseInt(this.refs.pembayaran.value, 10)
        let total_harga = parseInt(this.state.total, 10)

        let data = {
            invoice: this.state.invoice,
            cashier: JSON.stringify(this.state.items),
            user_id: this.state.auth.getToken().user.id,
            total: this.state.total,
            cash: parseInt(this.state.pembayaran, 10),
            change: parseInt(this.state.kembalian, 10),       
            recipe: parseInt(this.state.recipe, 10)
        }             
        
        axios.post(process.env.REACT_APP_API_URI + '/api/penjualan', data, {headers:this.state.headers})
        .then(result => {
            console.log(result);
            
            this.state.items.length = 0
            this.setState({
                items: [],
                saved: true,
                total: 0
            })

            this.setLocalKasir(this.state.items)
            this.refs.kembalian.value = '' 
            this.refs.pembayaran.value = ''
            this.refs.recipe.value = ''

            localStorage.removeItem('invoice')
            localStorage.removeItem('cost')
            localStorage.removeItem('available_stok')

            setTimeout(() => {
                window.location.href = '/kasir'    
            }, 2000);
            
        })
        .catch(err => {
            console.log(err);
        })

    }

    print = (e) =>{
        const full = document.body.innerHTML
        const struk = document.getElementById('struk').innerHTML

        document.body.innerHTML = struk

        window.print();
        window.location.reload()
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

                <div className="section">
                    <div className="header-section">
                        <h3>Kasir</h3>
                    </div>

                    <div className="row rule">
                        <div style={{border: 'none'}} className="col-md-4 controller">
                            
                            <div style={{padding:'10px 10px 5px 10px', border: '.5px dotted rgba(99, 99, 99, 0.384)'}}>
                            
                            <form onSubmit={this.addToCart.bind(this)} className="form-row kasir">
                                <div className="form-group col-md-6">
                                    <label style={{fontSize: '12px'}}>Kode obat</label>
                                    <input onBlur={this.checkCode.bind(this)} onChange={this.checkCodeChange.bind(this)} ref="kode_obat" required type="text" className="form-control" placeholder="Ex: obat0001" />
                                </div>

                                <div className="form-group col-md-6">
                                    <label style={{fontSize: '12px'}}>Jumlah</label>
                                    <input onBlur={this.checkValidQty.bind(this)} min="0" ref="jumlah" required type="number" className="form-control" placeholder="0" />
                                </div>
                                <div className="form-group col-md-12">
                                    <button type="submit" style={!this.state.exist_code ? {cursor: 'not-allowed'} : {cursor: 'pointer'}} disabled={!this.state.exist_code} className="btn btn-secondary add-to-cart">Tambah ke kasir</button>
                                    
                                </div>

                                {!this.state.exist_code ? 
                                    <div className="col-md-12 alert alert-warning"><strong> Kode obat </strong> tidak ditemukan</div>
                                     : <div></div> }
                                {this.state.alert_stok ? <div className="col-md-12 alert alert-danger"><strong> Stok Habis! </strong> Stok tersedia sisa {this.state.sisa_stok}</div>
                                    : <div></div> }

                            </form>
                            </div>
                            <p style={{textAlign:'center', fontSize: '11px', marginTop: '20px'}}> &copy; Powered by {process.env.REACT_APP_CREDIT} </p>
                        </div>

                        <div className="col-md-2">
                        </div>
                        
                        <div style={{border: 'none'}} className="col-md-6 controller">

                            <div style={{padding:'20px', paddingTop:'0px', border: '.5px dotted rgba(99, 99, 99, 0.384)'}}>
                            <form onSubmit={(e) => this.saveKasir(e)} className="form-row kasir">
                                {this.state.saved ? 
                                    <div style={{width: '100%', textAlign:'center', marginTop: '20px'}} className="alert alert-success"> <strong> Sukses! </strong> data penjualan disimpan! </div>
                                 : <div></div>}

                                <div className="form-group col-md-6">
                                    <label style={{fontSize: '12px'}}>Kembalian (Rp)</label>
                                    <input style={{fontStyle: '18px', fontWeight: 'bold'}} ref="kembalian" disabled required type="text" className="form-control" placeholder="Rp 0" />

                                </div>
                                <div className="form-group col-md-6">
                                    <label style={{fontSize: '12px'}}>Total harga (Rp)</label>
                                    <input style={{fontStyle: '18px', fontWeight: 'bold'}} disabled value={"Rp " + this.formatCurrency(this.state.total, ",", ".", 2)} required type="text" className="form-control" placeholder="0" />
                                </div>
                                <div className="form-group col-md-6">
                                    <label style={{fontSize: '12px'}}>Harga Resep (Rp)</label>
                                    <input style={{fontStyle: '18px', fontWeight: 'bold'}} 
                                    ref="recipe" required 
                                    onBlur={(e) => {this.changeToRupiahRecipe(e), this.getTotalBiaya()}} type="text" className="form-control" placeholder="0" />
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="small-label">Pembayaran (Rp)</label>
                                    <input disabled={this.state.items.length === 0} 
                                    style={{fontStyle: '18px', fontWeight: 'bold'}} 
                                    onBlur={(e) => {this.changeToRupiah(e); this.hitungKembalian(e)}} 
                                    title={this.state.items.length === 0 ? 'Kasir masih kosong': ''}
                                    required min="0" type="text" ref="pembayaran" className="form-control" placeholder="0" />
                                </div>

                                <div className="col-md-8">
                                    <button
                                        title={this.state.items.length !== 0 ? '' : 'Kasir masih kosong'}
                                        title={!this.state.disabled ? '' : 'Pembayaran belum valid' }
                                        disabled={this.state.items.length === 0} disabled={this.state.disabled}
                                        style={this.state.items.length !== 0 ? { color:'white', fontWeight: 'bold', borderRadius: '7px', padding: '10px 0px', marginTop: '10px'} : {fontWeight: 'bold', borderRadius: '7px', padding: '10px 0px', cursor: 'not-allowed'} } 
                                        style={!this.state.disabled ? { color:'white', fontWeight: 'bold', borderRadius: '7px', padding: '10px 0px', marginTop: '10px'} :{fontWeight: 'bold', borderRadius: '7px', padding: '10px 0px', cursor: 'not-allowed'} }
                                        type="submit" className="action-btn-add"> Simpan tanpa print
                                    </button>    
                                    </div>    
                                    
                                <div className="col-md-4">
                                    <button
                                        disabled={this.state.items.length === 0} disabled={this.state.disabled} onClick={this.print} 
                                        style={this.state.items.length !== 0 ? {  width:'100%',color:'white', fontWeight: 'bold', borderRadius: '7px', padding: '10px 0px', marginTop: '10px'} : { width:'100%',fontWeight: 'bold', borderRadius: '7px', padding: '10px 0px', cursor: 'not-allowed'} } 
                                        style={!this.state.disabled ? {  width:'100%',color:'white', fontWeight: 'bold', borderRadius: '7px', padding: '10px 0px', marginTop: '10px'} :{ width:'100%',fontWeight: 'bold', borderRadius: '7px', padding: '10px 0px', cursor: 'not-allowed'} }
                                        type="button" className="action-btn-delete">Print Stuk</button>
                                </div> 
                                
                            </form>
                                
                            </div>
                        </div>                        
                    </div>
                </div>
                
                <Struk {...this.state}
                        rupiah={this.formatCurrency.bind(this)}
                />
            
                <List {...this.state} 
                        rupiah={this.formatCurrency.bind(this)}
                        removeList={this.removeList.bind(this)}
                        clearAll={this.clearAll.bind(this)}
                        edit={this.edit.bind(this)}
                        editOnBlur={this.editOnBlur.bind(this)}
                        />
            </div>
            </div>
        )
    }

    hitungKembalian(e){
        let recipe = parseInt(this.state.recipe, 10)
        let pembayaran = parseInt(this.state.pembayaran)
        let total_harga = parseInt(this.state.total, 10)        
        
        let kembalian = pembayaran - total_harga

        if(isNaN(pembayaran)){
            this.state.kembalian = 0
            this.refs.kembalian.value = ''
        }else{
            this.state.kembalian = kembalian
            this.refs.kembalian.value = 'Rp ' + this.formatCurrency(kembalian, ',', '.', 0)
        }
        
        if(pembayaran >= total_harga && !isNaN(pembayaran)){
            this.setState({ disabled: false })
        }else{
            this.setState({ disabled: true })
        }
        
        recipe = isNaN(recipe) ? 0 : recipe
        pembayaran = isNaN(pembayaran) ? 0 : pembayaran
        kembalian = isNaN(kembalian) ? 0 : kembalian
        
        let data = {
            recipe: recipe,
            pembayaran: pembayaran,
            kembalian: kembalian
        }

        localStorage.setItem('cost', JSON.stringify(data))
        localStorage.setItem('invoice', this.state.invoice)
    }
}

export default Kasir;
``