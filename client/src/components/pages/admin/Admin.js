import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../css/admin.css'
import axios from 'axios';
import { toast } from 'react-toastify'

const Admin = () => {

	const history = useNavigate();

	const [tableData, setTableData] = useState([])

	const [loader, setLoader] = useState(true);

	const getDataFromApi = () => {
		setLoader(true);
		axios.get('/vehicles').then((res) => {
			setTableData(res.data);
			setTimeout(()=>{setLoader(false);}, 100)
		}).catch((err) => {
			console.log(err);
			setTableData([]);
			toast.error('Error fetching data');
			setLoader(false);
		});
	}

	useEffect(() => {
		axios.get('/auth').then((res) => {
			if(res.data.auth === 'admin') {
				getDataFromApi();
			}
			else {
				history('/login');
			}
		}).catch((err) => {
			console.log(err);
			history('/login');
		})
	},[])

	const deleteData = (id) => {
		setLoader(true)
		axios.post('/delete-vehicle', { id }).then((res) => {
			if(res.status === 200) {
				// getDataFromApi();
				toast.success('Deleted . . .')
				setTableData((vehcls) => vehcls.filter((v) => v._id !== res.data))
			}
			setLoader(false)
		}).catch((err) => {
			console.log(err);
			if(err.response.status === 400) {
				toast.error('Deletion failed')
			}
			else if(err.response.status === 500) {
				toast.error('Error occured ')
			}
			setLoader(false)
		});
	}

	const logoutButton = () => {
		axios.get('/logout').then((res) => {
			if(res.data) {
				history('/login')
			}
			else {
				alert('Something went wrong');
			}
		}).catch((err) => {
			console.log('Eror occured', err);
		})
	}

	const arrayBufferToBase64 = (buffer) => {
		var binary = '';
		var bytes = [].slice.call(new Uint8Array(buffer));
		bytes.forEach((b) => binary += String.fromCharCode(b));
		return window.btoa(binary);
	};

	return (
		<div className="admin-page-main">
			<div className="top-nav-bar">
				<button className="open-bookings" onClick={()=>{history('/booking')}}>Bookings</button>
				<button className="new-logout-button" onClick={logoutButton}>Logout</button>
			</div>
			{
				(loader) ? (
					<div className="loader admin-loader">
						<div className="white"></div>
						<div className="white"></div>
						<div className="white"></div>
						<div className="white"></div>
					</div>
				) : (
					<div className="admin-page-body"> 
					{
						(tableData.length !== 0) ? (
							tableData.map( (v) => {
								const base64String = arrayBufferToBase64(v.image.data.data);
								return <div className="vehicle-tile" key={v._id}>
									<img className='vehicle-img' src={`data:${v.image.contentType};base64,${base64String}`} alt='vehicle' />
									<div className="vehicle-name"> {v.name} </div>
									<div className="vehicle-price"> ₹{v.price} </div>
									<div className="vehicle-desc"> {v.desc} </div>
									<div className="vehicle-quantity"> {v.quantity} &nbsp; left</div>
									<img src="delete.png" alt="delete" className='delete-vehicle-icon' onClick={ ()=>{deleteData(v._id)}} />
									<img 
										src="edit.png" 
										alt="edit" 
										className='edit-vehicle-icon' 
										onClick={()=>{history(`/edit-vehicle/${v._id}/${v.name}/${v.desc}/${v.price}/${v.quantity}`)}} 
									/>
								</div>
							})
							) : (
								<div className="vehicle-tile no-data" key='not-found' style={{height: '223px'}}>
									No data found
								</div>
							)
						}
						<div className="vehicle-tile add-new-vehicle" onClick={() => {history('/add-vehicle')}} style={{minHeight: '223px'}} >
							<img src="plus.jpg" alt="plus"/>
						</div>
					</div>
				)
			}
					
		</div>
	)
}

export default Admin;