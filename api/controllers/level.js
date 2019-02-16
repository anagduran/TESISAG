import question from '../models/question'

function getLevel(req,res) {

    question.aggregate([
		{"$group" : {_id:"$level", count:{$sum:1}}}
	    ]).exec().then(result =>{
            question.count().exec().then(contadorT =>{
                question.aggregate([
                    {
                        $match: {
                            created_at: {$gte: new Date("2018-02-01"), $lte: new Date("2019-02-28")}
                        }
                    },
                    {
                        $group: {
                            _id: '$level',
                            count: {$sum: 1}
                        }
                    }    
               ]).exec().then(resultado => {
                
                     res.status(200).render('level/levelIndex',{ total: result, totalQ: contadorT, barras: resultado})
                 })
            }).catch(err=>{
                res.render('index',{ error: "error al conectar con el servidor, intente nuevamente"})
            })

       
    })
   
}

module.exports ={getLevel};