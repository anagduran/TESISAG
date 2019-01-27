

function getLevel(req,res) {


    res.render('level/levelIndex',{
        title: 'API CONTROL PANEL',
        message: 'aqui en el index del control panel de trivia'
    })
}

module.exports ={getLevel};