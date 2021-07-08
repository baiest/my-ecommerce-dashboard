import React from 'react'
import axios from 'axios'
import '../../assets/css/FormProduct.css'
import { API_PRODUCT_NEW, API_PRODUCT_IMAGE_NEW, API_CATEGORIES }from '../../providers/api'
class FormProduct extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            update: this.props.update || false,
            categories: [],
            progress: 0,
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
        index_category > -1
        ? category_id.splice(index_category, 1)
        : category_id.push(category)

        this.setState({ form: {
            ...form, 
            category_id: category_id.sort((a, b) => a.category_name > b.category_name? 1 : -1)
        }})
        console.log(this.state.form.photos)
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
        
        form_keys.map(i => (
            form[i].value !== undefined
            ? form_normalize[i] = form[i].value
            : form_normalize[i] = form[i]
        ))

        console.log(form_normalize)
        files.append('photos', form.photos)
        //this.validate()
        
        const onUploadProgress = (event) => {
            console.log("cargando", event)
            this.setState({
                progress: Math.round((100 * event.loaded) / event.total),
            })
        }
        try {
            const response_form = await axios.post(
                API_PRODUCT_NEW, 
                form_normalize,
            )
            console.log(response_form)
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
        } catch (error) {
            console.log(error.message)
        }
    }
    
    render(){
        const { form } = {...this.state}
        const form_keys = Object.keys(form)
        
        const dragOver = (e) => {
            e.preventDefault();
        }
        
        const dragEnter = (e) => {
            e.preventDefault();
        }
        
        const dragLeave = (e) => {
            e.preventDefault();
        }
        
        const fileDrop = (e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            this.addPhoto(files[0])
        }

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
                <div className="photo__dragdrop"
                    onDragOver={dragOver}
                    onDragEnter={dragEnter}
                    onDragLeave={dragLeave}
                    onDrop={fileDrop}>

                    <input type="file" onChange={this.onFileChange} onChange={(e) => this.addPhoto(e.target.files[0])}/>
                    <ul className="list__preview-photo">
                        {
                            form.photos.map((p, key) => <img key={key} className="preview-photo" onClick={() => this.removePhoto(key)} src={URL.createObjectURL(p) || ''} alt="photo" />)
                        }
                    </ul>
                    <label htmlFor="progress">{this.state.progress}%</label>
                    <progress id="progress"  max="100" value={this.state.progress}/>
                </div>
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