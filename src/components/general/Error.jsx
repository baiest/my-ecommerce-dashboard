import React from 'react'
import '../../assets/css/Error.css'
const Error = (props) => (
    <div className="error">
        <h2>Ah ocurrido un error</h2>
        <p>{props.message}</p>
    </div>
)

export default Error