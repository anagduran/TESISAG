var mongoose = require('mongoose');

const suggestedQuestionSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	question: {type: String, required: true },
	correctAnswer: {type: String, required: true },
    optionB: {type: String, required: true },
	optionC: {type: String, required: true },
	category: [{type: mongoose.Schema.Types.ObjectId, ref: 'category'}]
},
{ 
    versionKey: false
});


const suggestedQuestion = mongoose.model('suggestedQ', suggestedQuestionSchema, 'suggestedQ');

module.exports = suggestedQuestion;