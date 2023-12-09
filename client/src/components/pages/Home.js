import React, { useEffect/*, useState*/ } from 'react'
import { useNavigate } from 'react-router-dom'
// import axios from 'axios'
import '../css/home.css'
import '../css/loader.css'
import axios from 'axios';

function Home() {

    const history = useNavigate();
    // const [div, setDiv] = useState(2);
    
    useEffect(() => {
        axios.get('/auth').then((res) => {
            if(res.data.auth === 'admin') {
                return history('/admin');
            }
            else if(res.data.auth === 'user') {
                return history(`/user/${res.data.id}/${res.data.name}`)
            }
            else {
                setTimeout(()=>{history('/login')}, 200)
            }
        })
        // connectDatabase();
    }, [history]);

    // const connectDatabase = async () => {
    //     setDiv(1);
    //     try {
    //         const response = await axios.get('/connect');
    //         if(response.data) {
    //             history('/login');
    //         }
    //         else {
    //             setTimeout(()=>setDiv(2), 1000);
    //         }
    //     }
    //     catch (error) {
    //         setTimeout(()=>setDiv(2), 1000);
    //         console.error('Error fetching data:', error);
    //     }
    // };

    return (
        <div className='home-main'>
            {/* {
                (div === 1) ? (
                    <div className="loader">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                ) :  (div === 2) ? (
                    <div className="connect-error">
                        <div className="connect-error-msg">
                            Connection Failed
                        </div>
                        <button className="retry-button" onClick={connectDatabase}>Retry</button>
                    </div>
                ) : null
            } */}
            <div className="loader">
                <div className='white'></div>
                <div className='white'></div>
                <div className='white'></div>
                <div className='white'></div>
            </div>
        </div>
    )
}

export default Home