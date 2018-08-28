import React, { Component } from 'react';
import {Line} from 'react-chartjs-2'
import InOutCome from './InOutCome';

class Chart extends Component {
    constructor(props){
        super(props)
        
        this.state = {
            filter_info: '',
            filter_penjualan: props.filter_penjualan,
            filter_pembelian: props.filter_pembelian,
            list_filter: [],
            show_detail_filter: false,
            total_penjualan: null,
            dataPenjualan: {
                labels: props.data_penjualan.labels,
                datasets: [
                    {
                        label: 'Data Penjualan',
                        data: [0,0,0,0,0,0,0,0,0,0,0,0],
                        fill: false,
                        borderWidth: 5,
                        borderColor: 'rgba(33,92,133,0.6)'
                    }
                ]
            },
            status: 200,
            loading: true,
            onYear: true,
            onMonth: true,
            
        }
    }    

    componentWillReceiveProps(nextProps){
        if(nextProps.data_penjualan.data.length !== 0){
            let dataPenjualan = {...this.state.dataPenjualan};    
            
            dataPenjualan.datasets.map(dataset => {
                return dataset.data = nextProps.data_penjualan.data
            })            
            this.setState({dataPenjualan})
        }                

        if(nextProps.data_penjualan.labels !== this.state.dataPenjualan.labels){
            
            let dataPenjualan = {...this.state.dataPenjualan};
        
            dataPenjualan.labels = nextProps.data_penjualan.labels
            this.setState({dataPenjualan})            
        }

        if(nextProps.filter_info !== this.state.filter_info){
            this.setState({filter_info: nextProps.filter_info})
        }

        if(nextProps.filter_penjualan.length !== 0){
            this.setState({filter_penjualan: nextProps.filter_penjualan})            
        }else{
            this.setState({filter_penjualan: []}) 
        }

        if(nextProps.filter_pembelian.length !== 0){
            this.setState({filter_pembelian: nextProps.filter_pembelian})            
        }else{
            this.setState({filter_pembelian: []}) 
        }
        
        
    }
    

    fetchOnYear(e){
        let year = e.target.value
        
        return this.props.fetchOnYear(year)
    }

    fetchOnMonth(e){
        let month = e.target.value
        let year = this.refs.future_year.value
        
        return this.props.fetchOnMonth(year, month)
        
    }

    render() {        
        return (            
        <div className="section">
            <div className="header-section">
                <h3> Visual Penjualan & Pembelian Obat </h3>
                {this.props.loading ? <span style={{height: '22px', width: '22px'}} id="loading"> </span> : null} 
            </div>

            <div className="row">
            <div className="col-md-6">
                <div className="chart">
                    <Line
                        data={this.state.dataPenjualan}
                        options={{
                            title:{
                                display: true,
                                text: 'Data Penjualan',
                                fontSize: 11
                            },
                            legend: {
                                display: false,
                            },
                            maintainAspectRatio: false,
                        }}
                    />
                </div>
                <small style={{marginRight: '20px'}}> <i> Total Penjualan: </i> <span style={{fontSize: '10px'}} className="badge badge-dark"> {this.props.penjualan} </span> </small>
               
                <small style={{marginRight: '20px'}}> <i> Penjualan {this.props.filter_info} : </i> <span style={{fontSize: '10px', fontWeight: 'bold'}} className="badge badge-info">{this.props.penjualan_per_filter} </span> </small>
                
                <div style={{marginTop:'20px'}} className="form-group row">
                    
                    <label style={{fontSize: '11px'}} className="col-sm-2 col-form-label col-form-label-sm">Filter Data:</label>
                    <div className="control-edit col-sm-4">                
                        {this.state.onYear || this.state.onMonth ? 
                        <select onChange={(e) => this.fetchOnYear(e)} ref="future_year" style={{ animation: 'select-option-chart .2s', height: '100%', fontSize:'12px' ,backgroundColor:'rgba(197, 197, 197, 0.3)'}} className="form-control"> 
                            <option value=""> Pilih Tahun </option>
                            {this.props.data_penjualan.years.map( year => {
                                return <option key={year} value={year}>{year}</option>
                            })}
                        </select> 
                        : <div/> } 
                    </div>
                    <div className="control-edit col-sm-4">                
                        {this.state.onMonth ? 
                        <select onChange={(e) => this.fetchOnMonth(e)} style={{ animation: 'select-option-chart .2s', height: '100%', fontSize:'12px' ,backgroundColor:'rgba(197, 197, 197, 0.3)'}} className="form-control"> 
                            {this.props.monthNames.map( (month, index) => {
                                return <option key={month} value={index}>{month}</option>
                            })}
                        </select> 
                        : <div/> } 
                    </div>
                </div>
            </div>

            <div className="col-md-6"><InOutCome {...this.state} /></div>

            <div style={{textAlign: 'center'}} className="col-md-12">
                <hr/>
                <small style={{fontSize:'10px'}}> <i> Chart Design by ChartJs </i> </small>
            </div>
            </div>
        </div>
        )
    }
}

export default Chart;
