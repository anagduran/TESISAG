import category from './routes/category'
import index from './routes/index'


export default app => {
    app.use('/',index)
    app.use('/category', category)
    
        
}