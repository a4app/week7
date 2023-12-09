import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../../css/add_vehicle.css'

function EditVehicle() {

	const navigate = useNavigate();

    const { id, argname, argdesc, argprice, argquantity } = useParams();

    const [errorMessages, setErrorMessages] = useState({name: '', desc: '', price: '', quantity: '', image: ''})

	const [name, setName] = useState(argname);
	const [desc, setDesc] = useState(argdesc);
	const [price, setPrice] = useState(argprice);
	const [quantity, setQuantity] = useState(argquantity);
	const [image, setImage] = useState();

    useEffect(()=>{
        axios.get('/auth').then((res) => {
			if(res.data.auth !== 'admin') {
                navigate('/login');
			}
		}).catch((err) => {
			console.log(err);
			navigate('/login');
		})
    },[])

    const updateVehicleButton = () => {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('name', name);
        formData.append('desc', desc);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('image', image);

        axios.post('/update-vehicle', formData ).then((res) => {
            toast.success('Updation succesfull');
            if(res.status === 200) {
                navigate('/admin')
            }
            else {
                toast.error('Updation failed')
            }
		}).catch((err) => {
			console.log(err);
			if(err.response.status === 400) {
                setErrorMessages(err.response.data)
            }
            else {
                toast.error('Error occured !')
            }
		});
    }

	return (
		<div className='add-vehicle-main'>
			<div className="add-vehicle-form">
                <div className="add-vehicle-head">Edit Vehicle</div>
                <div className="add-vehicle-field-div">
                    <div className='required-div'>
                        <label className='add-vehicle-labels'>Name</label>
                        <span className='required-star'> {errorMessages.name} </span>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Name . . ." 
                        value={name} 
                        // onChange={onNameChange}
                        onChange={(e)=>{ setName(e.target.value) }} 
                        autoFocus={true}
                    />
                </div>
                <div className="add-vehicle-field-div">
                    <div className='required-div'>
                        <label className='add-vehicle-labels'>Description</label>
                        <span className='required-star'> {errorMessages.desc} </span>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Description . . ." 
                        // onChange={onDescChange} 
                        onChange={(e)=>{ setDesc(e.target.value) }} 
                        value={desc} 
                    />
                </div>
                <div className="add-vehicle-field-div">
                    <div className='required-div'>
                        <label className='add-vehicle-labels'>Price</label>
                        <span className='required-star'> {errorMessages.price} </span>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Price . . ." 
                        // onChange={onPriceChange} 
                        onChange={(e)=>{ setPrice(e.target.value) }} 
                        value={price} 
                    />
                </div>
                <div className="add-vehicle-field-div">
                    <div className='required-div'>
                        <label className='add-vehicle-labels'>Quantity</label>
                        <span className='required-star'> {errorMessages.quantity} </span>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Quantity . . ." 
                        // onChange={onQuantityChange} 
                        onChange={(e)=>{ setQuantity(e.target.value) }} 
                        value={quantity} 
                    />
                </div>
                <div className="add-vehicle-field-div">
                    <div className='required-div'>
                        <label className='add-vehicle-labels'>Image</label>
                        <span className='required-star'> {errorMessages.image} </span>
                    </div>
                    <input 
                        type="file" 
                        accept='image/*'
                        // onChange={onImageChange} 
                        onChange={(e)=>{ setImage(e.target.files[0]) }}
                        name='image'
                    />
                </div>
                <div className="next-button-div">
                    <button className="add-vehicle-button" onClick={updateVehicleButton} >
                        Update
                    </button>
                </div>
            </div>
		</div>
	)
}

export default EditVehicle