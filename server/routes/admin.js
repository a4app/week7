const fs = require('fs');
const express = require('express');
const Models = require('../mongo_db/models.js');
const router = express.Router();

// multer storage configuration
const multer = require('multer');
const storage = multer.diskStorage({
    destination: 'images',
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
// multer instance
const upload = multer({ storage: storage });

const VehicleModel = Models.vehicle
const BookingModel = Models.booking;

// get vehicles data
router.get('/vehicles', async (req, res) => {
    try {
        const vehicles = await VehicleModel.find();
        // return vehicles details ... OK
        return res.status(200).json(vehicles);
    }
    catch(err) {
        // server error
        return res.status(500)
    }
})

// add new vehicle to database
router.post('/add-vehicle', upload.single('image'), async (req, res) => {
    const { name, desc, price, quantity } = req.body;
    // validate input data
    if(!name || !desc || !price || !quantity || !req.file) {
        const out = {name: '', desc: '', price: '', quantity: '', image: ''}

        if(!name) out.name = 'required *';

        if(!desc) out.desc = 'required *';

        if(!price) out.price = 'required *';
        else if(isNaN(price)) out.price = 'invalid !';

        if(!quantity) out.quantity = 'required *';
        else if(isNaN(quantity)) out.quantity = 'invalid !';

        if(!req.file) out.image = 'required *';

        return res.status(400).json(out);
    }
    // succesfull validation
    else {
        try {
            const newVehicle = new VehicleModel({ 
                name: name, 
                desc: desc, 
                price: price, 
                quantity: quantity, 
                image: {
                    data: fs.readFileSync('./images/' + req.file.originalname),
                    contentType: req.file.mimetype,
                }
            })
            await newVehicle.save();
            // vehicle data added succesfully ... OK
            return res.status(200).send(true);
        }
        catch(err) {
            console.log(err);
            // server error
            return res.status(500).send(false);
        }
    }
})

// delete vehicle data
router.post('/delete-vehicle', async (req, res) => {
    const { id } = req.body;
    try {
        const deletedData = await VehicleModel.findOneAndDelete({ _id: id });

        (deletedData) ? 
        res.status(200).json(deletedData._id) : // succesful deletion...
        res.status(400).json(false) ; // deletion failed
    }
    catch(error) {
        console.error('Error deleting user:', error);
        // server error
        return res.status(500).json(false)
    }
})

// change existing vehicle details
router.post('/update-vehicle', upload.single('image'), async (req, res) => {
    const { id, name, desc, price, quantity } = req.body;
    // validate input data
    if(!name || !desc || !price || !quantity || !req.file) {
        const out = {name: '', desc: '', price: '', quantity: '', image: ''}

        if(!name) out.name = 'required *';

        if(!desc) out.desc = 'required *';

        if(!price) out.price = 'required *';
        else if(isNaN(price)) out.price = 'invalid !';

        if(!quantity) out.quantity = 'required *';
        else if(isNaN(quantity)) out.quantity = 'invalid !';

        if(!req.file) out.image = 'required *';

        return res.status(400).json(out);
    }
    // succesfull validation
    else {
        try {
            const updatedVehicle = await VehicleModel.findOneAndUpdate(
                { _id: id },
                { $set: { id: id, name: name, desc: desc, price: price, quantity: quantity, image: {
                    data: fs.readFileSync('./images/' + req.file.originalname),
                    contentType: req.file.mimetype,
                } } },
                { new: true }
            );
    
            // check if updated
            if(updatedVehicle) {
                // updation succesfull... OK
                return res.status(200).json(true);
            }
        }
        catch(error) {
            console.error('Error updating vehicle:', error);
            return res.status(500).send(false);
        }
    }
})

// get bookings list
router.get('/bookings', async (req, res) => {
    try {
        const data = await BookingModel.find();
        // return booking list
        return res.status(200).json(data);
    }
    catch(err) {
        console.log(err);
        // server error
        return res.status(500).json(false);
    }
})

module.exports = router;