import category from './routes/category'
import question from './routes/question'
import game from './routes/game'
import variable from './routes/variable'
import user from './routes/user'
import suggestedQuestion from './routes/suggestedQuestion'
import level from './routes/level'
import index from './routes/index'
import execute from './routes/executeGame'
import login from './routes/login'



export default app => {
    app.use('/',index)
    app.use('/category', category)
    app.use('/question', question)
    app.use('/game', game)
    app.use('/variable', variable)
    app.use('/user', user)
    app.use('/suggestedQuestion', suggestedQuestion)
    app.use('/level', level)
    app.use('/executeGame', execute)
    app.use('/login', login)
   
        
}