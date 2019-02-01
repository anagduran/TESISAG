import question from '../models/question'

function getLevel(req,res) {

    question.aggregate([
		{"$group" : {_id:"$level", count:{$sum:1}}}
	]).exec().then(result =>{
        
        res.render('level/levelIndex',{ total: result})
    })
   
}

module.exports ={getLevel};