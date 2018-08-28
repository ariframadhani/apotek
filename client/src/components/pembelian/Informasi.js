import React from 'react'

const Informasi = () => {
    return (
        <div className="controller" style={{border: 'none'}}>
            <div style={{padding:'10px 10px 5px 10px', border: '.5px dotted rgba(99, 99, 99, 0.384)'}}>
                <h5> Informasi Sistem Pembelian </h5>
                <ul style={{fontSize: '13px', padding: '0 20px'}}>
                    <li style={{marginBottom:'10px'}}>Data pembelian yang sudah di inputkan tidak dapat diubah lagi.</li>
                    <li style={{marginBottom:'10px'}}>Data pembelian obat yang di inputkan akan otomatis di masukan atau di update ke dalam data obat.</li>
                    <li style={{marginBottom:'10px'}}>Apabila <b> kode obat </b> yang di inputkan ke data pembelian sudah ada pada data obat, <b> maka data obat dengan kode obat yang sama dengan pembelian</b> akan langsung diupdate secara otomatis pada data obat.</li>
                    <li style={{marginBottom:'10px'}}>Data obat yang akan di update adalah nama, kategori, harga jual, stok, dan tanggal expired. Kode obat akan tetap.</li>
                </ul>
            </div>
        </div>
    )
}


export default Informasi