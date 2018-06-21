import category from "../models/category"

//obtener informacion de las categorias

function getCategories(req,res){
    let categoryId = req.params.id;

    category.find({}, (err,categories)=>{
        res.status(200).send(categories)
    })
}
