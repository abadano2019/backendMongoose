//import CartsManager from '../dao/fileManager/cartsManager.js'

import CartsManager from '../dao/mongoManager/cartsManager.js'
import { Router } from "express";
import { productsManager } from './products.router.js';

const router = Router();

const path = './carts.json'
const cartsManager = new CartsManager(path)


// Busqueda de todos los productos y busqueda de productos filtrando por un limite pasado por query
router.get('/', async(req,res) => {

    const {limit} = req.query
    console.log(limit)
    try{
        console.log(req)
        const carts = await cartsManager.getCarts()
        console.log(carts)
        if(limit){
            const cartSlice = carts.slice(0,limit)
            res.json({message:"productos encontrado:", cartSlice}) 
        }
        else{
            res.json({message:"productos encontrado:", carts})
        }
    }
    catch(error){
        console.log(error)
    }
})

// Busqueda de productos por id de carrito
router.get('/:idCart', async(req,res) => {

    try{
        const {idCart} = req.params
        const cart = await cartsManager.getCartById(idCart)
                
        if(cart){
            const cartProducts = cart.cartProducts
            if (cartProducts && cartProducts.length>0){
                res.json({mesage:'Productos del carrito: ', cartProducts})
            }else{
                res.json({mesage:'Carrito sin productos'})
            }
        } else {
            res.json({mesage:'Carrito no encontrado'})
        }
    }
    catch(error){
        console.log(error)
    }
})

// Alta de carrito
router.post('/', async(req,res) => {
    
    try{
        
        const cart = cartsManager.createCart()
        cartsManager.addCart(cart)
        res.json({mesage:'Carrito agregado', cart})
    }
    catch(error){
        console.log(error)
    }
})

// Alta de producto a un carrito, debe existir el carrito y debe existir el producto en el archivo de productos
router.post('/:cid/products/:pid', async(req,res) => {
    
    try{
        
        const {cid,pid} = req.params
        console.log(pid)
        const product = await productsManager.getProductById(pid)
        if (!product){
            res.json({mesage:'Por aca. Producto inexistente'})
            return
        }
        const cart = await cartsManager.getCartById(cid)
        if(!cart){
            res.json({mesage:'Carrito no encontrado'})
            return
        }
        await cartsManager.addProductCart(cid,pid);
        res.json({mesage:'Producto agregado'})
    }
    catch(error){
        console.log(error)
    }
})

// Borrado de un carrito
router.delete('/:idCart', async(req,res) => {

    const {idCart} = req.params
        console.log(idCart)
    try{
        const {idCart} = req.params
        console.log(idCart)
        const cart = await cartsManager.getCartById(idCart)
        
        if(cart){
            res.json({mesage:'Carrito encontrado',cart})
            cartsManager.deleteProduct(idCart)
        } else {
            res.json({mesage:'Carrito no encontrado'})
        }
    }
    catch(error){
        console.log(error)
    }
    
})


export default router