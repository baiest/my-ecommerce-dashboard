import React from 'react'
import '../../assets/css/Button.css'
const Button = (props) => (
    <button className={`button ${props.className}`} type='button'>
        {props.text}
    </button>
)

export default Button