import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../css/add_vehicle.css';
import axios from 'axios';

function AddVehicle() {

	const navigate = useNavigate();

	const [name, setName] = useState('');
	const [desc, setDesc] = useState('');
	const [price, setPrice] = useState('');
	const [quantity, setQuantity] = useState('');
	const [image, setImage] = useState('');

    const [errorMessages, setErrorMessages] = useState({name: '', desc: '', price: '', quantity: '', image: ''})

    useEffect(() => {
        axios.get('/auth').then((res) => {
			console.log(res.data);
			if(res.data.auth !== 'admin') {
                navigate('/login');
			}
		}).catch((err) => {
			console.log(err);
			navigate('/login');
		})
    },[])

    const addVehicleButton = () => {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('name', name.trim());
        formData.append('desc', desc.trim());
        formData.append('price', price.trim());
        formData.append('quantity', quantity.trim());

        axios.post('/add-vehicle', formData ).then((res) => {
            if(res.status === 200) {
                navigate('/admin');
            }
		}).catch((err) => {
            if(err.response.status === 400) {
                setErrorMessages(err.response.data)
            }
            else if(err.response.status === 500) {
                toast.error('Error adding data !')
            }
			console.log(err);
		});
    }

	return (
		<div className='add-vehicle-main'>
			<div className="add-vehicle-form">
                <div className="add-vehicle-head">Add Vehicle</div>
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
                    <button className="add-vehicle-button" onClick={addVehicleButton} >Add</button>
                </div>
            </div>
		</div>
	)
}

export default AddVehicle