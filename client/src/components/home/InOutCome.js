import React, { Component } from 'react';
import {Doughnut} from 'react-chartjs-2'

class InOutComeChart extends Component {
    constructor(props){
        super(props)
        
        this.state = {
            filter_penjualan: [],
            filter_pembelian: [],
            data_chart: [],
            inoutcome: null,
            keterangan: '',
            classKeterangan: '',
        }   
    }

    componentWillReceiveProps(newProps){
        if(newProps.filter_penjualan.length !== 0){
            this.setState({ filter_penjualan: newProps.filter_penjualan })
        }else{
            this.setState({ filter_penjualan: [] })
        }
        
        if(newProps.filter_pembelian.length !== 0){
            this.setState({ filter_pembelian: newProps.filter_pembelian })
        }else{
            this.setState({ filter_pembelian: [] })
        }
        this.hitungPendapatan()
        
    }

    hitungPendapatan(){
        let keterangan, inoutcome, classKeterangan, pembelian, penjualan

        penjualan = this.state.filter_penjualan.reduce(
            (a,b) => { return a + b.total }, 0)       
        
        pembelian = this.state.filter_pembelian.reduce(
            (a,b) => {return a + b.outcome }, 0)
        
        if(penjualan >= pembelian){
            keterangan = ''
            inoutcome = penjualan-pembelian
            classKeterangan = "badge badge-success"
        }else{            
            keterangan = ''
            inoutcome = penjualan-pembelian
            classKeterangan = "badge badge-warning"
        }
        
        this.setState({data_chart: [ penjualan, pembelian], 
                        keterangan: keterangan, 
                        inoutcome: inoutcome, 
                        classKeterangan: classKeterangan
                    })

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

    render() {        
        return (
            <div>
            <div className="chart" style={{backgroundColor: '#f7f7f7', paddingBottom:'12px'}}>
            <Doughnut
                height={200}
                data= {{
                    labels: ['Penjualan obat (Rp)' ,'Pembelian obat (Rp)'],
                    datasets: [
                        {
                            label: 'Detail Penjualan',
                            data: this.state.data_chart,
                            backgroundColor: [
                                '#215c85',
                                '#999fb3',
                                
                            ],
                            fill: false,
                            borderWidth: 2,
                        }
                    ]
                }}
                options={{
                    title:{
                        display: true,
                        text: 'Detail Pemasukan - Pengeluaran',
                        fontSize: 11
                    },
                    legend: {
                        display: true,
                    },
                    maintainAspectRatio: false,
                }}
                />
            </div>

            <div className="detail-inoutcome" >
                <p style={{textAlign: 'center', fontSize: '12px', marginBottom: '-10px'}}> <u> Data {this.props.filter_info} </u> </p> <br/>
                <p style={{textAlign: 'center', fontSize: '12px', marginBottom: '-10px'}}><span style={{fontSize: '12px'}} className={this.state.classKeterangan}> {this.state.keterangan} Rp {this.formatCurrency(this.state.inoutcome, ',', '.', 0)} </span> </p>

            </div>
        </div>
        )
    }
}

export default InOutComeChart;
