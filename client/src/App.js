import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import Home from "./components/pages/Home";
import Admin from "./components/pages/admin/Admin";
import AddVehicle from "./components/pages/admin/AddVehicle";
import Booking from "./components/pages/admin/Booking";
import EditVehicle from "./components/pages/admin/EditVehicle";
import User from "./components/pages/user/User";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/admin" element={<Admin />} />
				<Route path="/add-vehicle" element={<AddVehicle />} />
				<Route path="/edit-vehicle/:id/:argname/:argdesc/:argprice/:argquantity" element={<EditVehicle />} />
				<Route path="/user/:id" element={<User />} />
				<Route path="/booking" element={<Booking />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
