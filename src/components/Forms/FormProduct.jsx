import React from 'react'
import '../../assets/css/FormProduct.css'
class FormProduct extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            update: this.props.update || false,
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
                created: this.state?.update ? '' : new Date(),
                updated: new Date()
            }
        }
        this.handleInput = this.handleInput.bind(this)
        this.save = this.save.bind(this)
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

    save(){
        console.log(this.state.form)
    }

    render(){
        const { form } = {...this.state}
        const form_keys = Object.keys(form)
        
        return(
            <form className='form__product'>
                {
                    form_keys.map(i => {
                        const input = () => (
                        <input
                        key={i} 
                        id={i} 
                        type="text"
                        placeholder={form[i].placeholder}
                        onChange={this.handleInput}/>)

                        return (
                        form[i].type &&
                        <React.Fragment key={i}> 
                            {form[i].type === 'number' 
                            ? <div className="form__input">
                                {input()}
                                <button type="button">+</button>
                                <button type="button">-</button>
                            </div>
                            : input()
                            }
                        </React.Fragment> 
                    )})
                }
                <div className="form__options">
                    <button type="button" onClick={this.save}>Guardar</button>
                    <button type="button">Cancelar</button>
                </div>
            </form>
        )
    }
}

export default FormProduct