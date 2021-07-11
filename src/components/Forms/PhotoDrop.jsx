import React, { useState } from 'react'
import '../../assets/css/PhotoDrop.css'
import {API_PRODUCT_IMAGE} from '../../providers/api.js'

const PhotoDrop = (props) => {
    const [background, setBackground] = useState('#fff');

    const fileAccept = ['jpg', 'jpeg', 'png'] 

    const dragOver = (e) => {
        e.preventDefault();
        setBackground('#000')
    }
    
    const fileDrop = (e) => {
        e.preventDefault();
        setBackground('#fff')
        const files = e.dataTransfer.files;
        //Validar tipo de archivo
        props.addPhoto(files[0])
    }

    const urlPhoto = (photo) => {
        try {
            return URL.createObjectURL(photo) 
        } catch (error) {
            return API_PRODUCT_IMAGE(props.product_id, photo)
        }
    } 

    return <div className="photo__dragdrop" style={{background: background}}
    onDragOver={dragOver}
    onDrop={fileDrop}>

        <input type="file" id="file" accept=".jpg,.jegp,.png,.web" style={{display: 'none'}}
        onChange={(e) => props.addPhoto(e.target.files[0])}/>
        <img onClick={()=> document.getElementById('file').click()} src="https://w7.pngwing.com/pngs/724/688/png-transparent-drawing-graphy-camera-camera-text-rectangle-photography.png" alt="camera" style={{width: '35px'}} />
        <ul className="list__preview-photo">
            {
                props.photos?.map((p, key) => {
                return <div key={key} className="preview-photo">
                    <div onClick={() => props.removePhoto(key)} className="remove-photo">X</div>
                    <img src={urlPhoto(p)} alt="product preview" />
                </div>
                })
            }
        </ul>
        <label htmlFor="progress">{props.progress}%</label>
        <progress id="progress"  max="100" value={props.progress}/>
    </div>
}

export default PhotoDrop