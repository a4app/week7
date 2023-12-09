import React, { useEffect, useState } from 'react'
import '../../css/booking.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function Booking() {

    const history = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loader, setLoader] = useState(true);

    useEffect( () => {
        axios.get('/auth').then((res) => {
			if(res.data.auth === 'admin') {
				axios.get('/bookings').then((res)=>{
                    setBookings(res.data);
                    setLoader(false)
                }).catch((err)=>{
                    console.log(err);
                    setLoader(false)
                })
			}
			else {
				history('/login');
			}
		}).catch((err) => {
			console.log(err);
			history('/login');
		})
        
    },[])

    return (
        <div className='booking-main'>
            <div className='logout-button back-button' onClick={()=>{history('/admin')}}>Back</div>
            {
                loader ? (
                    <div className="loader">
                        <div className="white"></div>
                        <div className="white"></div>
                        <div className="white"></div>
                        <div className="white"></div>
                    </div>
                ) : (
                    <div className="booking-body">
                        <div className="bookings-head">Booking List</div>
                        <div className="bookings-list"></div>
                        <div className="booking-tile" style={{ borderBottom: '4px solid #0ed3f6', borderTop: '4px solid #0ed3f6'}}>
                            <div className="div2" style={{fontWeight: '700'}}> User </div>
                            <div className="div3" style={{fontWeight: '700'}}> Phone </div>
                            <div className="div1" style={{fontWeight: '700'}}> Vehicle </div>
                            <div className="div3" style={{fontWeight: '700'}}> Price </div>
                        </div>
                        {
                            (bookings.length === 0) ? (
                                <div className="booking-tile">
                                    <div className="div3" style={{width: '100%'}}> No records found ! </div>
                                </div>
                            ) : (
                                bookings.map((value, index) => {
                                    return <div className="booking-tile" key={index}>
                                        <div className="div2"> {value.user_name} </div>
                                        <div className="div4"> {value.phone} </div>
                                        <div className="div1"> {value.vehicle_name} </div>
                                        <div className="div3"> {value.price} </div>
                                    </div>
                                })
                            )
                        }
                        
                    </div>
                )
            }
                
        </div>
    )
   
}

export default Booking