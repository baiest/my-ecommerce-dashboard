import React from 'react';
import { Switch, Route } from 'react-router-dom';
import FormProduct from './Forms/FormProduct';
import TableProducts from './TableProducts.jsx'
const Main = () => {
    return (
    <section className="main">
         <Switch>
             <Route exact path="/products" component={TableProducts}/>
         </Switch>
    </section>)
}

export default Main