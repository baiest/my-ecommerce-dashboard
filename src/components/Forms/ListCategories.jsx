import React from 'react' 
import '../../assets/css/ListCategories.css'
import Error from '../general/Error.jsx'

const ListCategories = (props) => {
    if(!props.categories){
        return <Error message="No hay categorias"/> 
    }
    return <div className="form__product-categories">
    <section>
        <label>Elige una categoria para este producto</label>
            <div className="form__categories">
                { props.categoriesSelected?.map(c => {
                    return(
                        <div key={c.category_id}>
                            <input className="form__category-input" id={c.category_id} type="checkbox" onChange={() => props.addCategory(c)}
                            checked={props.categories?.includes(c)}/>
                            <label className="form__category-name" htmlFor={c.category_id}>{c.category_name}</label>
                        </div>
                    )
                })}
            </div>
    </section>
    <ul className="form__categories-list">
        {
            props.categories?.map(c => <li key={c.category_id}>{c.category_name}</li>)
        }
    </ul>
</div>
}

export default ListCategories