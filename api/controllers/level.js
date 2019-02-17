import question from '../models/question'

function getLevel(req,res) {

    question.aggregate([
		{"$group" : {_id:"$level", count:{$sum:1}}}
	    ]).exec().then(result =>{
            question.count().exec().then(contadorT =>{
                question.aggregate([
                    {
                        $match: {
                            created_at: {$gte: new Date("2019-02-01"), $lte: new Date("2019-02-28")}
                        }
                    },
                    {
                        $group: {
                            _id: '$level',
                            count: {$sum: 1}
                        }
                    }    
               ]).exec().then(resultadoF => {
                        question.aggregate([
                            {
                                $match: {
                                    created_at: {$gte: new Date("2019-03-01"), $lte: new Date("2019-03-31")}
                                }
                            },
                            {
                                $group: {
                                    _id: '$level',
                                    count: {$sum: 1}
                                }
                            }    
                        ]).exec().then(resultadoM => {
                            console.log(resultadoM);
                        res.status(200).render('level/levelIndex',{ total: result, totalQ: contadorT, barras: resultadoF, barrasM: resultadoM})
                    })
                        
                        
                
                    
                })
            }).catch(err=>{
                res.render('index',{ error: "error al conectar con el servidor, intente nuevamente"})
            })

       
    })
   
}

module.exports ={getLevel};