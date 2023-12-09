const express = require('express');
const session = require('express-session');
const Models = require(__dirname + '/mongo_db/models.js');
const connectDB = require(__dirname + '/mongo_db/db_connect.js');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

const app = express();

const UserModel = Models.user;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(adminRoutes);
app.use(userRoutes);

app.use(
    session({
        secret: 'secret_key',
        resave: false,
        saveUninitialized: true,
    })
);

connectDB();

const adminData = {
    phone: '1',
    password: '1'
}

app.post('/login', async (req, res) => {
    const out = {status: false, phone: true, pass: true, auth: '', error: false, id: '', name: ''}
    const { phone, password } = req.body;
    if( phone === '' || password === '') {
        if(password === '') {
            out.pass = false;
        }
        if(phone === '') {
            out.phone = false;
        }
        return res.json(out);
    }
    else {
        if(phone === adminData.phone && password === adminData.password) {
            out.status = true;
            out.auth = 'admin';
            req.session.auth = 'admin';
            return res.json(out);
        }
        else {
            try {
                const data = await UserModel.findOne({phone: phone, password: password});
                if(data) {
                    out.status = true;
                    out.auth = 'user';
                    out.id = data.id;
                    out.name = data.name;

                    req.session.auth = 'user';
                    req.session.user_id = data.id;
                    req.session.name = data.name;

                    return res.json(out);
                }
                else {
                    return res.json(out);
                }
            }
            catch(err) {
                console.log(err);
                out.error = true;
                setTimeout(()=>{return res.json(out);},1000)
            }
        }
    }
})

// app.post('/register', async (req, res) => {
//     const { name, email, phone, city, district, state, pincode, password } = req.body;
//     try {
//         const newUser = new UserModel({ 
//             name: name, 
//             email: email, 
//             phone: phone, 
//             city: city, 
//             district: district, 
//             state: state, 
//             pincode: pincode, 
//             password: password 
//         })
//         await newUser.save()
//         res.json({status: true, duplicate: false});
//     }
//     catch(err) {
//         if(err.code === 11000) {
//             res.json({status: false, duplicate: true});
//         }
//         else {
//             res.json({status: false, duplicate: false});
//         }
//     }
// })

app.post('/register', async (req, res) => {

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    const out = { name: '*', email: '*', phone: '*', pincode: '*', password: '*', conPassword: '*' }
    const { name, email, phone, district, state, pincode, password, conPassword, phoneOtp } = req.body;

    if(phoneOtp) {
        try {
            // add new userdata
            const newUser = new UserModel({ 
                name: name, 
                email: email, 
                phone: phone, 
                district: district, 
                state: state, 
                pincode: pincode, 
                password: password 
            })
            await newUser.save()
            res.json({status: true, duplicate: false});
        }
        catch(err) {
            // check if duplicate field exixts
            if(err.code === 11000) {
                res.json({status: false, duplicate: true});
            }
            else {
                res.json({status: false, duplicate: false});
            }
        }
    }
    else {
        if(name.trim() === '') out.name = 'required *';

        if(email.trim() === '') out.email = 'required *';
        else if(!emailRegex.test(email)) out.email = 'invalid email !';

        if(phone.trim() === '') out.phone = 'required *';
        else if(phone.length !== 10 || isNaN(phone)) out.phone = 'invalid !';

        if(pincode.trim() === '') out.pincode = 'required *';
        else if(pincode.length !== 6) out.pincode = 'invalid !';

        if(password.trim() === '') out.password = 'required *';

        if(password !== '' && password !== conPassword) out.conPassword = 'not matching !'
        else if(conPassword.trim() === '') out.conPassword = 'required *';

        return res.send(out)
    }
})

app.get('/auth', (req, res) => {
    if(req.session.auth === 'admin') {
        return res.json({auth: 'admin'})
    }
    else if(req.session.auth === 'user') {
        return res.json({auth: 'user', id: req.session.user_id, name: req.session.name})
    }
    return res.json({auth: ''});
})

app.get('/logout', (req, res) => {
    try {
        req.session.destroy();
        res.send(true);
    }
    catch(err) {
        console.log(err);
        res.sendStatus(false);
    }
})





app.listen(5500, () => {
    console.log('server is started');
});