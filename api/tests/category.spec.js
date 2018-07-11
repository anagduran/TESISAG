import sinon from "sinon"
import chai from "chai"
import server from '../index'
import {assert} from 'chai'
import {expect} from 'chai'
import {should} from 'chai'
import request from 'supertest'
import chaiHttp from 'chai-http'


chai.use(chaiHttp)
let instance  = undefined
describe('API CATEGORY', ()=>{
    

  /* beforeEach(() =>{       
        instance = server.start()
        console.log('hola')
 
    })*/

    /*afterEach(()=>{
       server.close()
       instance = undefined
        
    })*/

    describe('API GET ALL CATEGORIES', ()=>{
        it('debe obtener todas las categorias y devolver status 200', ()=>{ 
           request('http://localhost:9000').get('/category').expect(200).end((err,res)=>{ 
            if (err) throw err 
           })

        })
    })

   describe('API CREATE CATEGORY', ()=>{
        it('debe crear una nueva categoria y retornar status 201',()=>{
            let categoria = {
                name: "categoria de prueba tdd",
                description: "descripcion de la categoria de prueba tdd"
              
            }
            request('http://localhost:9000').post('/category').send(categoria).expect(201).end((err,res)=>{
                //assert(res.status, 201);
                console.log(categoria);
                if(err) throw err
            })    
            

        })
    }) 

  /* describe('API GET ONE CATEGORY', ()=>{
        it('debe traer una categoria dado un id retornar status 200',()=>{
            
            request('http://localhost:9000').get('/category').expect(200).end((err,res)=>{
                //assert(res.status, 200);
                if(err) throw err
            })    
            

        })
    }) */

})






