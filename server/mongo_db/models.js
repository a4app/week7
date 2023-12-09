const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    city: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const AdminSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const VehicleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    quantity: {
        type: String,
        required: true,
    },
    image: {
        data: Buffer,
        contentType: String,
    },
});

const BookingSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    user_name: {
        type: String,
        required: true,
    },
    vehicle_name: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
});

const User = mongoose.model("User", UserSchema, 'users');
const Admin = mongoose.model("Admin", AdminSchema, 'admins');
const Vehicle = mongoose.model("Vehicle", VehicleSchema, 'vehicles');
const Booking = mongoose.model("Booking", BookingSchema, 'booking');

module.exports = {admin: Admin , user: User, vehicle: Vehicle, booking: Booking};