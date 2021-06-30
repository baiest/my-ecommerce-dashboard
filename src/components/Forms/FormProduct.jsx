import React from 'react'
import axios from 'axios'
import '../../assets/css/FormProduct.css'
import { API_PRODUCT_NEW, API_CATEGORIES }from '../../providers/api'
class FormProduct extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            update: this.props.update || false,
            categories: [],
            form: {
                product_id: {
                    type: 'text',
                    value: '',
                    placeholder: 'Serial'
                },
                product_name: {
                    type: 'text',
                    value: '',
                    placeholder: 'Product name'
                },
                product_quantity:{
                    type: 'number',
                    value: 0,
                    placeholder: 'Quantity'
                },
                product_price:{
                    type: 'number',
                    value: 0,
                    placeholder: 'Price'
                },
                category_id: []
            }
        }
        this.source = axios.CancelToken.source();

        this.handleInput = this.handleInput.bind(this)
        this.addCategory = this.addCategory.bind(this)
        this.save = this.save.bind(this)
    }

    async componentDidMount(){
        try{
            const response = await axios.get(API_CATEGORIES,  {
                cancelToken: this.source.token
            })
            console.log(response.data)
            this.setState({categories: response.data, loading: false})

        }catch(error){
            if(!axios.isCancel(error) && error.code !== 'ECONNABORTED'){
                this.setState({error: error.message, loading: false})
            }
        }
    }
    
    handleInput(e){
        const form_state = this.state.form
        const input = {
            form: {...form_state}
        }

        input.form[e.target.id] = {
            ...form_state[e.target.id],
            value: e.target.value
        }    
        this.setState(input)
    }

    addCategory(category){
        const { form } = this.state
        const { category_id } = form
        let index_category = category_id.findIndex(c => c.category_id === category.category_id)
        console.log(index_category, )
        index_category > -1
        ? category_id.splice(index_category, 1)
        : category_id.push(category)

        this.setState({ form: {
            ...form, 
            category_id: category_id.sort((a, b) => a.category_name > b.category_name? 1 : -1)
        }})
    }

    async save(){
        const { form } = {...this.state}
        const form_keys = Object.keys(form)
        const form_normalize = {}
        form_keys.map(i => (
            form_normalize[i] = form[i].value
        ))

        //this.validate()
        try {
            const response = await axios.post(
                API_PRODUCT_NEW, 
                form_normalize,
                )
            console.log(response)
        } catch (error) {
            console.log(error.message)
        }
    }

    render(){
        const { form } = {...this.state}
        const form_keys = Object.keys(form)
        
        return(
            <form className='form__product'>
                <div className="form__product-fields">
                    {
                        form_keys.map(i => {
                            const input = () => (
                            <input
                            key={i} 
                            id={i} 
                            type="text"
                            placeholder={form[i].placeholder}
                            onChange={this.handleInput}/>)
                            
                            if(form[i].type){
                                if(form[i].type === "number"){
                                    return <div  key={i} className="form__input">
                                        {input()}
                                        <button type="button">+</button>
                                        <button type="button">-</button>
                                    </div>
                                }
                                else{
                                    return input()
                                }
                            }
                            return null
                        })
                    }
                </div>
                <input type="file" onChange={this.onFileChange} />
                <div className="form__product-categories">
                    <div className="form__categories">
                        { this.state.categories.map(c => {
                            return(
                                <div key={c.category_id}>
                                    <input className="form__category-input" id={c.category_id} type="checkbox" onChange={() => this.addCategory(c)} />
                                    <label className="form__category-name" htmlFor={c.category_id}>{c.category_name}</label>
                                </div>
                            )
                        })}
                    </div>
                    <ul className="form__categories-list">
                        {
                            form.category_id.map(c => <li key={c.category_id}>{c.category_name}</li>)
                        }
                    </ul>
                </div>
                <div className="form__options">
                    <button type="button" onClick={this.save}>Guardar</button>
                    <button type="button">Cancelar</button>
                </div>
            </form>
        )
    }
}

export default FormProduct