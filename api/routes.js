import category from './routes/category'
import question from './routes/question'
import game from './routes/game'
import index from './routes/index'


export default app => {
    app.use('/',index)
    app.use('/category', category)
    app.use('/question', question)
    app.use('/game', game)
    
        
}