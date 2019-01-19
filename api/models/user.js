var mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	nickname: {
		type: String,
		required: true,
		unique: true
		// match: / [a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])? /
	},
	avatar: { type: String },
	country_code: { type: String, required: true},
	phone: { type: String, required: true},
	share_code: { type: String},
	referral_code: { type: String},
	extra_life: { type: Number},
	balance: { type: Number }
},
{
    versionKey: false
}
);

const user = mongoose.model('user', userSchema, 'user');

module.exports = user;