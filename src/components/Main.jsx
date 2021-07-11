import React from 'react';
import { Switch, Route } from 'react-router-dom';
import FormProduct from './Forms/FormProduct';
import TableProducts from './TableProducts.jsx'
const Main = () => {
    return (
    <section className="main">
         <Switch>
             <Route exact path="/products" component={TableProducts}/>
             <Route exact path="/products/new" component={FormProduct}/>
             <Route exact path="/products/update/:id" render={(props) => <FormProduct product_id={props.match.params.id}/>}/>
         </Switch>
    </section>)
}

export default Main