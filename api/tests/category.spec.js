import sinon from "sinon"
import chai from "chai"
import mocks from "../mocks"
import server from '../index'
import {assert} from 'chai'
import {expect} from 'chai'
import {should} from 'chai'
import request from 'supertest'
import express from 'express'


describe('API CATEGORY', ()=>{
    let instance  = undefined

   /* beforeEach(() =>{       
        instance = server.start()
        console.log('hola')
 
    })
*/
    /*afterEach(()=>{
       server.close()
       instance = undefined
        
    })*/

    describe('API GET ALL CATEGORIES', ()=>{
        it('debe obtener todas las categorias y devolver status 200', ()=>{ 
           request('localhost:9000').get('/category').expect(200).end((err,res)=>{ 
            if (err) throw err 
           })

        })
    })

   describe('API CREATE CATEGORY', ()=>{
        it('debo crear una nueva categoria y retornar status 201',()=>{
            request('localhost:9000').post('/category').end((err,res)=>{
                assert(res.status, 201);
                if(err) throw err
            })    
            

        })
    }) 

})






