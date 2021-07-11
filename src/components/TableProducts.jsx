import React from 'react'
import '../assets/css/TableProducts.css'
import axios from 'axios'
import { API_PRODUCTS } from '../providers/api'
import { Link } from 'react-router-dom'
import Error from './general/Error'
class TableProducts extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            search: '',
            titles: ['Serial', 'Name', 'Quantity', 'Price', 'Options'],
            products: [],
            error: '',
            loading: true
        }

        this.source = axios.CancelToken.source();

        this.search = this.search.bind(this)
        this.getProducts = this.getProducts.bind(this)
    }

    componentDidMount(){
        this.getProducts(this.state.search)
    }
    
    componentWillUnmount(){
        if (this.source) {
            this.source.cancel();
        }
    }

    async getProducts(search){
        try{
            const response = await axios.post(API_PRODUCTS, { query: search }, {
                cancelToken: this.source.token,
            })
            this.setState({products: response.data, loading: false})
        }catch(error){
            console.log('Algo mal')
            if(!axios.isCancel(error) && error.code !== 'ECONNABORTED'){
                this.setState({error: error.response?.data.error || error.message, loading: false})
            }
        }
    }

    search(e){
        const value = e.target.value
        this.setState({search: value})
    }

    render(){
        return <React.Fragment>
        <div className="table__find">
                <input type="text" onChange={this.search} value={this.state.search}/>
                <button type="submit" onClick={() => this.getProducts(this.state.search)}>Buscar</button>
            <Link to='/products/new' className="product__new">Nuevo producto +</Link>
        </div>
        <table className="table__products">
            <thead>
                <tr>
                {
                    this.state.titles.map(t => <th key={t}>{t}</th>)
                }
                </tr>
            </thead>
            <tbody>
            {   
                this.state.products?.map(p => {
                    return <tr key={p.product_id}>
                            <td>{p.product_id}</td>
                            <td>{p.product_name}</td>
                            <td>{p.product_quantity}</td>
                            <td>{p.product_price}</td>
                            <td>
                                <Link to={`/products/update/${p.product_id}`} params={{ id: p.product_id}}>Editar</Link>
                                <Link to='/'>Borrar</Link>
                                <Link to='/'>Ver</Link>
                            </td>
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