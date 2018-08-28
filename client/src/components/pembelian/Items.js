import React, {Component} from 'react'

class Items extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            data: {}
        }
    }

    infoItem = (e, data) => {
        e.preventDefault()

        this.setState({
            data: data
        }, () => {
            this.props.infoItem(data)
        })
    }

    deleteItem = (e, data) => {
        e.preventDefault()
        
        if(window.confirm('Hapus data dengan invoice "'+data.invoice+'" ?'))
        this.setState({
            data: data
        }, () => {
            this.props.deleteItem(data)
        })
    }

    getPagination = (link) => {
        this.props.fetchData(link)
        
    }

    render(){
    const {data, pagination} = this.props
    
    return (
        <div className="table-responsive"> 
            <table className="table table-custom">
                <thead className="thead-light">
                    <tr>
                        <th scope="col"> Invoice </th>
                        <th scope="col"> Supplyer </th>
                        <th scope="col"> Kode Obat </th>
                        <th scope="col"> Harga Beli </th>
                        <th scope="col"> Stok Beli </th>
                        <th scope="col"> Pengeluaran </th>
                        <th scope="col"> Tanggal Pembelian </th>
                        <th scope="col"> Aksi </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => {
                        return <tr key={item._id}> 
                        <td>{item.invoice}</td>
                        <td>{item.supplyer}</td>
                        <td>{item.code}</td>
                        <td>Rp {this.props.rupiah(item.buy_price, ',','.',0)}</td>
                        <td>{item.buy_stok}</td>
                        <td>Rp {this.props.rupiah(item.outcome, ',', '.', 0)}</td>
                        <td>{this.props.moment(item.tanggal_pembelian)}</td>
                        <td>
                            <button onClick={(e) => this.infoItem(e, item)} className="action-btn-info"><i className="fas fa-info"></i> </button>
                            <button onClick={(e) => this.deleteItem(e, item)} className="action-btn-delete"><i className="far fa-trash-alt"></i> </button>
                        </td>
                    </tr>
                    })}
                </tbody>
            </table>
            {this.props.loading ? <div style={this.props.status === 200 ? { display:'none' } : {display: 'inline-block'}} id="loading"> </div> : <div></div>}
            
            <div style={{borderTop: '1px solid rgba(187, 187, 187, 0.267)', paddingTop: '10px'}}>
              <button className="btn-pagination btn btn-secondary" style={!pagination.prev ? {cursor: 'not-allowed'} : {cursor: 'pointer'} } disabled={!pagination.prev} onClick={(e) => this.getPagination(pagination.prev_page, e)}> Prev </button>
              <small> {this.props.page_paginate.current} dari {this.props.page_paginate.total} </small>
              <button className="btn-pagination btn btn-secondary" style={!pagination.next ? {cursor: 'not-allowed',  marginLeft: '10px'} : {cursor: 'pointer',  marginLeft: '10px'} } disabled={!pagination.next} onClick={(e) => this.getPagination(pagination.next_page, e)}> Next </button>
            </div>
        </div>
        )
    }
}

export default Items;