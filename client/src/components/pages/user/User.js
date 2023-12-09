import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import '../../css/user.css'

function User() {

    const { user_id } = useParams();

    const history = useNavigate();
    const location = useLocation();

    const [toast, setToast] = useState(false);
    const [toastDetails, setToastDetails] = useState({color: '#00FF00', msg: "hii"});

    const [sort, setSort] = useState(true);

    const [loader, setLoader] = useState(false);

    const [userData, setUserData] = useState({})

    const [tableData, setTableData] = useState([]);
    const [filterData, setFilterData] = useState([]);

    const getDataFromApi = () => {
        setLoader(true);
        axios.get('/vehicles')
		.then((res) => {
			setTableData(res.data);
            const itemsAscending = res.data.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
			setFilterData(itemsAscending);
            setLoader(false);
		}).catch((err) => {
			console.log(err);
			setTableData([]);
            setLoader(false);
		});
    }

    useEffect(() => {
        getDataFromApi();
        axios.get('/single-user', { user_id }).then((res) => {
            setUserData(res.data);
        })
        const queryParams = new URLSearchParams(location.search);
        const status = queryParams.get('status');
        if(status === 'success') {
            handleToast('#00FF00', 'Booking Succesfull')
        }
        else if(status === 'failed') {
            handleToast('#FF0000', 'Booking Failed')
        }
    },[])

    const onSearchChange = (e) => {
        const searchText = e.target.value;
    
        const filteredResults = tableData.filter((vehicle) =>
            vehicle.name.toLowerCase().includes(searchText.toLowerCase())
        );

        // const filteredResults = tableData.filter((item) => {
        //     for (const key in item) {
        //         if (typeof item[key] === 'string' && item[key].toLowerCase().includes(searchText.toLowerCase())) {
        //             return true;
        //         }
        //     }
        //     return false;
        // });;
    
        setFilterData(filteredResults);
    }

    const HandleBooking = (price, v_name, u_name, quantity) => {
        const user_name = userData.name;
        const user_id = userData.id;
        const user_phone = userData.phone;
        //Making an HTTP POST request to create a checkout session
        axios.post('/create-checkout-session', { price, v_name, user_name, user_id, quantity, user_phone })
        .then(res => {
            // If a 'url' property exists in the response data, redirect the user to that URL
            if (res.data.url) {
                window.location.href = res.data.url;
            }
        })
        .catch(err => {
            // If there's an error during the request, display an error toast notification
            console.log(err);
        })
    }

    const arrayBufferToBase64 = (buffer) => {
		var binary = '';
		var bytes = [].slice.call(new Uint8Array(buffer));
		bytes.forEach((b) => binary += String.fromCharCode(b));
		return window.btoa(binary);
	};

    const handleToast = (color, msg) => {
        setToastDetails({color: color, msg: msg});
        setToast(true);
        setTimeout(()=>{setToast(false)}, 3000)
    }

    const sortMethod = () => {
        if(!sort) {
            const itemsAscending = filterData.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            setFilterData(itemsAscending);
            setSort(true);
        }
        else {
            const itemsDescending = filterData.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            setFilterData(itemsDescending);
            setSort(false);
        }
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

    return (
        <div className='user-page-main'>

            <div className="user-top-nav-bar">
                <input type="text" className='search-bar' placeholder='Search . . .' onChange={onSearchChange}/>
                <button className='new-logout-button' onClick={logoutButton}>Logout</button>
            </div>
            {
                (loader) ? (
                    <div className="user-loader loader">
                        <div className="white"></div>
                        <div className="white"></div>
                        <div className="white"></div>
                        <div className="white"></div>
                    </div>
                ) : (
                    <div className="user-body">
                        <div className="sort-div">
                            {
                                (!sort) ? (
                                    <div className="sort-button" onClick={sortMethod}>Price high to low &nbsp;<img src="/sort.png" alt="sort" /> </div>
                                ) : (
                                    <div className="sort-button" onClick={sortMethod}>Price low to high &nbsp;<img src="/sort.png" alt="sort" /> </div>
                                )
                            }
                        </div>
                        <div className="user-page-vehicles">
                        {
                            (filterData.length !== 0) ? (
                                filterData.map( (v) => {
                                    const base64String = arrayBufferToBase64(v.image.data.data);
                                    return <div className="vehicle-tile" key={v._id}>
                                        <img className='vehicle-img' src={`data:${v.image.contentType};base64,${base64String}`} alt='vehicle' />
                                        <div className="vehicle-name"> {v.name} </div>
                                        <div className="vehicle-price"> ₹{v.price} </div>
                                        <div className="vehicle-quantity"> {v.quantity} &nbsp; left</div>
                                        <div className="vehicle-desc"> {v.desc} </div>
                                        <button className='order-now' onClick={()=>{HandleBooking(v.price, v.name, 'name', v.quantity)}} disabled={v.quantity === '0'}>
                                            Order Now
                                        </button>
                                    </div>
                                })
							) : (
								<div className="vehicle-tile no-data" key='not-found' style={{height: '223px'}}>
									No data found
								</div>
							)
						}
					    </div>
                    </div>
                )
            }
            {
                (toast) ? (
                    <div className="toast" style={{color: toastDetails.color}}> {toastDetails.msg} </div>
                ) : <></>
            }
        </div>
    )
}

export default User