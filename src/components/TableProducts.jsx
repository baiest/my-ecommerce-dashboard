import React from 'react'
import '../assets/css/TableProducts.css'
import axios from 'axios'
import { API_PRODUCTS } from '../providers/api'
class TableProducts extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            products: []
        }

        this.source = axios.CancelToken.source();
    }

    async componentDidMount(){
        try{
            const response = await axios.get(API_PRODUCTS,  {
                cancelToken: this.source.token
            })
            this.setState({products: response.data})
        }catch(error){
            if(!axios.isCancel(error) && error.code !== 'ECONNABORTED'){
                this.setState({error: error.response?.data.error || error.message, loading: false})
            }
        }
    }

    render(){
        return <table className="table__products">
            <thead>
                <th>Serial</th>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Precio</th>
            </thead>
            <tbody>
                {
                    this.state.products.map(p => {
                    return <tr key={p.product_id}>
                            <td>{p.product_id}</td>
                            <td>{p.product_name}</td>
                            <td>{p.product_quantity}</td>
                            <td>{p.product_price}</td>
                        </tr>
                    })
                }
                {
                    this.state.products.map(p => {
                    return <tr key={p.product_id}>
                            <td>{p.product_id}</td>
                            <td>{p.product_name}</td>
                            <td>{p.product_quantity}</td>
                            <td>{p.product_price}</td>
                        </tr>
                    })
                }
                {
                    this.state.products.map(p => {
                    return <tr key={p.product_id}>
                            <td>{p.product_id}</td>
                            <td>{p.product_name}</td>
                            <td>{p.product_quantity}</td>
                            <td>{p.product_price}</td>
                        </tr>
                    })
                }
            </tbody>
        </table>
    }
}

export default TableProducts