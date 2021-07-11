import React from 'react'
import '../assets/css/TableProducts.css'
import axios from 'axios'
import { API_PRODUCTS } from '../providers/api'
import Error from './general/Error'
class TableProducts extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            titles: ['Serial', 'Name', 'Quantity', 'Price'],
            products: [],
            error: '',
            loading: true
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
        return <React.Fragment>
        <table className="table__products">
            <thead>
                {
                    this.state.titles.map(t => <th>{t}</th>)
                }
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
            </tbody>
        </table>
        {this.state.loading && <div className="loader"></div> }
        {this.state.error && <Error message={this.state.error}/>}
        </React.Fragment>
    }
}

export default TableProducts