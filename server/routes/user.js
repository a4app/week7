const express = require('express');
const router = express.Router();
const Models = require('../mongo_db/models');

const app = express();
const stripe = require("stripe")('sk_test_51NyFwxSCdJB3l89XB6OWrEDfpGk0wrs73pWVXelbHwhsLJFk5CvLooS38bfXjatCrStNf7lhar8X3zaTZ5oAiAU200S18wcCnV');

const BookingModel = Models.booking;
const VehicleModel = Models.vehicle;
const UserModel = Models.user;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));app.use(express.json());

// create checkout session for payment
router.post("/create-checkout-session", async (req, res) => {
    const { price, v_name, user_name, user_id, quantity, user_phone } = req.body;
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: v_name,
                    },
                    unit_amount: 100 * 100,
                },
                quantity: 1
            }
        ],
        mode: "payment",
        success_url: `http://127.0.0.1:5500/success?id=${user_id}&price=${price}&v_name=${v_name}&u_name=${user_name}&quantity=${quantity}&phone=${user_phone}`,
        cancel_url: "http://127.0.0.1:5500/failed",
    });
    // return session url
    res.status(200).json({ url: session.url });

});

// on succesfull payment
router.get('/success', async (req, res) => {
    const id = req.query.id;
    const price = req.query.price;
    const v_name = req.query.v_name;
    const u_name = req.query.u_name;
    const quantity = req.query.quantity;
    const phone = req.query.phone;
    try {
        const book = new BookingModel({
            id: id,
            user_name: u_name,
            vehicle_name: v_name,
            price: price,
            phone: phone,
        })
        // add booking data to bookings list
        await book.save();
        await VehicleModel.findOneAndUpdate(
            { name: v_name },
            { $set: { quantity: (parseInt(quantity) - 1).toString() } },
            { new: true }
        );
        return res.redirect(`http://127.0.0.1:3000/user/${id}?status=success`);
    }
    catch(err) {
        console.log(err);
        return res.redirect(`http://127.0.0.1:3000/user/${id}?status=failed`);
    }
    
})

// failed payment
router.get('/failed', (req, res) => {
    return res.redirect('http://127.0.0.1:3000/user?status=failed');
})

// get data of a single user
router.get('/single-user', async (req, res) => {
    const { id } = req.body;
    const user = await UserModel.findOne({id:id});
    // return single user data
    return res.json(user);
})

module.exports = router;