import category from './routes/category'
import question from './routes/question'
import game from './routes/game'
import variable from './routes/variable'
import user from './routes/user'
import suggestedQuestion from './routes/suggestedQuestion'
import notification from './routes/notification'
import index from './routes/index'


export default app => {
    app.use('/',index)
    app.use('/category', category)
    app.use('/question', question)
    app.use('/game', game)
    app.use('/variable', variable)
    app.use('/user', user)
    app.use('/suggestedQuestion', suggestedQuestion)
    app.use('/notification', notification)
    
        
}