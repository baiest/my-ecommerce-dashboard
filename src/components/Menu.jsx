import React from 'react'
import { Link } from 'react-router-dom'
import '../assets/css/Menu.css'
const Menu = () => {
    return (
    <nav>
        <h1>Nombre Ecommerce</h1>
        <ul className="menu">
            <li><Link>Perfil</Link></li>
            <li><Link to="/products">Productos</Link></li>
            <li><Link>Ventas</Link></li>
            <li><Link>Envios</Link></li>
            <li><Link>Clientes</Link></li>
        </ul>
    </nav>
    )
}

export default Menu