const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		await mongoose.connect(`mongodb+srv://week7user:week7pass@week7cluster.9jxwy8v.mongodb.net/week7database`);
		console.log('Connected to MongoDB');
		return true;
	}
	catch(error) {
		console.error('Mongoose connection error:', error);
		return false;
	}
};

module.exports = connectDB