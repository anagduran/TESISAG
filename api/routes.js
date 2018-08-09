import category from './routes/category'
import question from './routes/question'
import index from './routes/index'


export default app => {
    app.use('/',index)
    app.use('/category', category)
    app.use('/question', question)
    
        
}