import React, { useState } from 'react'
import '../../assets/css/PhotoDrop.css'

const PhotoDrop = (props) => {
    const [background, setBackground] = useState('#fff');

    const fileAccept = ['jpg', 'jpeg', 'png'] 

    const dragOver = (e) => {
        e.preventDefault();
        setBackground('#000')
    }
    
    const dragEnter = (e) => {
        e.preventDefault();
    }
    
    const dragLeave = (e) => {
        e.preventDefault();
        setBackground('#fff')
    }
    
    const fileDrop = (e) => {
        e.preventDefault();
        setBackground('#fff')
        const files = e.dataTransfer.files;
        //Validar tipo de archivo
        props.addPhoto(files[0])
    }

    return <div className="photo__dragdrop" style={{background: background}}
    onDragOver={dragOver}
    onDragEnter={dragEnter}
    onDragLeave={dragLeave}
    onDrop={fileDrop}>

        <input type="file" accept=".jpg,.jegp,.png,.web"
        onChange={(e) => props.addPhoto(e.target.files[0])}/>
        <ul className="list__preview-photo">
            {
                props.photos?.map((p, key) => {
                return <div key={key} className="preview-photo">
                    <div onClick={() => props.removePhoto(key)} className="remove-photo">X</div>
                    <img src={URL.createObjectURL(p) || ''} alt="product preview" />
                </div>
                })
            }
        </ul>
        <label htmlFor="progress">5%</label>
        <progress id="progress"  max="100" value={5}/>
    </div>
}

export default PhotoDrop