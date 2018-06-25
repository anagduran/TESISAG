import category from "../models/category"

//obtener informacion de las categorias

function getCategories(req,res){
    
    category.find({}).exec((err,categories)=>{
        if(err)
        return res.status(500).send({message: 'Error en el servidor'});

        if(categories){
            //console.log(req.body)
            res.json(categories)
        }else {
            return res.status(400).send({
                message: 'no hay categories'
            })
        }
    })

}

module.exports ={ getCategories};
