import React from 'react'
import axios from 'axios'
import '../../assets/css/FormProduct.css'
import Error from '../general/Error'
import PhotoDrop from './PhotoDrop'
import ListCategories from './ListCategories';
import { 
    API_PRODUCT_NEW, 
    API_PRODUCT_IMAGE_NEW, 
    API_CATEGORIES,
    API_PRODUCT_ID,
    API_CATEGORIES_PRODUCT } from '../../providers/api'
class FormProduct extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            categories: [],
            progress: 0,
            loading: true,
            error: '',
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
                    value: '',
                    placeholder: 'Quantity'
                },
                product_price:{
                    type: 'number',
                    value: '',
                    placeholder: 'Price'
                },
                category_id: [],
                photos: []
            }
        }
        this.source = axios.CancelToken.source();

        this.handleInput = this.handleInput.bind(this)
        this.addCategory = this.addCategory.bind(this)
        this.addPhoto = this.addPhoto.bind(this)
        this.removePhoto = this.removePhoto.bind(this)
        this.save = this.save.bind(this)
    }

    async componentDidMount(){
        try{
            const response = await axios.get(API_CATEGORIES,  {
                cancelToken: this.source.token
            })
            this.setState({categories: response.data, loading: false})

            if(this.props.product_id){
                const product = await axios.get(API_PRODUCT_ID(this.props.product_id),
                {
                    cancelToken: this.source.token
                })
                
                const data_product = product.data
                const form_keys = Object.keys(this.state.form)
                const form_data = {...this.state.form}
                form_keys.map(i => form_data[i].value = data_product[i])
                form_data.photos = data_product.images

                const product_has_category = await axios.get(API_CATEGORIES_PRODUCT(this.props.product_id),
                {
                    cancelToken: this.source.token
                })
                //Without category
                const data_category = product_has_category.data.categories || []
                data_category.map(category_id => {
                    console.log(category_id)
                    const index_category = this.state.categories.findIndex(c => c.category_id === category_id)
                    this.addCategory(this.state.categories[index_category])
                })

                this.setState({form: {
                    ...form_data, 
                }})
            }
        }catch(error){
            if(!axios.isCancel(error) && error.code !== 'ECONNABORTED'){
                this.setState({error: error.response?.data.error || error.message, loading: false})
            }
        }
    }

    componentWillUnmount(){
        if (this.source) {
            this.source.cancel();
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
        console.log(category)
        //Buscar si la categoria esta agregada
        let index_category = category_id.findIndex(c => c.category_id === category.category_id)
        index_category > -1
        ? category_id.splice(index_category, 1)
        : category_id.push(category)
        
        this.setState({ form: {
            ...form, 
            category_id: category_id.sort((a, b) => a.category_name > b.category_name? 1 : -1)
        }})
        console.log(this.state.form.category_id)
    }

    addPhoto(photo){
        this.setState({form: {
            ...this.state.form,
            photos: [...this.state.form.photos, photo]
        }})
    }

    removePhoto(key){
        const arrayPhotos = this.state.form.photos
        arrayPhotos.splice(key, 1)
        console.log(arrayPhotos)
        this.setState({form: {
            ...this.state.form,
            photos: arrayPhotos
        }})
        console.log(arrayPhotos)
    }

    
    async save(){
        const { form } = {...this.state}
        const form_keys = Object.keys(form)
        const form_normalize = {}
        const files = new FormData()
        
        this.setState({error: ''})
        
        form_keys.map(i => (
            form[i].value !== undefined
            ? form_normalize[i] = form[i].value
            : form_normalize[i] = form[i]
        ))

        files.append('photos', form.photos)
        //this.validate()
        
        const onUploadProgress = (event) => {
            this.setState({
                progress: Math.round((100 * event.loaded) / event.total),
            })
        }
        try {
            const response_form = await axios.post(
                API_PRODUCT_NEW, 
                form_normalize,
            )
            if (response_form.status === 200 && form.photos.length > 0){
                form.photos.map(async p => {
                    this.setState({progress : 0})
                    let file = new FormData()
                    file.append('photo', p)
                    const response_photos = await axios.post(
                        API_PRODUCT_IMAGE_NEW(form_normalize.product_id), 
                        file,
                        {
                            onUploadProgress,
                            headers: {
                                "Content-Type": "multipart/form-data",
                            }
                        })
                    console.log(response_photos)
                })
            }
        } catch(error){
            
            if(!axios.isCancel(error) && error.code !== 'ECONNABORTED'){
                this.setState({error: error.response?.data.error || error.message, loading: false})
            }
        }
    }
    
    render(){
        const { form } = {...this.state}
        const form_keys = Object.keys(form)
        const toast = () => {
            let toast = document.getElementById("toast")
            toast.classList.remove('form__toast-in')
            console.log(toast.classList)
            toast.classList.add('form__toast-out')
        }   

        return(
            <React.Fragment>
            {
                this.state.error && 
                <div id="toast" className="form__toast form__toast-in">
                    <div className="remove-toast"  onClick={toast}>X</div>
                    <Error message={this.state.error}/>
                </div>
            }
            <form className='form__product'>
                <div className="form__product-fields">
                    {
                        form_keys.map(i => {
                            const input = () => (
                                <input
                                key={i} 
                                id={i} 
                                type="text"
                                value={form[i].value}
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
                <PhotoDrop product_id={this.props.product_id} progress={this.state.progress} photos={form.photos} addPhoto={this.addPhoto} removePhoto={this.removePhoto} />
                {
                    this.state.loading 
                    ? <div className="loader"></div> 
                    : <ListCategories addCategory={this.addCategory} categories={form.category_id} categoriesSelected={this.state.categories}/>
                }
                <div className="form__options">
                    {
                        this.props.product_id 
                        ? <button className="btn-green" type="button" onClick={this.save}>Actualizar</button>
                        : <button className="btn-green" type="button" onClick={this.save}>Guardar</button>
                    }
                    <button className="btn-red" type="button">Cancelar</button>
                </div>
            </form>
        </React.Fragment>
        )
    }
}

export default FormProduct