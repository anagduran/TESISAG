

function getIndex(req,res,next) {
    console.log("aqui en la funcion getIndex");

    res.render('index',{
        title: 'API CONTROL PANEL',
        message: 'aqui en el index del control panel de trivia'
    })
}

module.exports ={getIndex};