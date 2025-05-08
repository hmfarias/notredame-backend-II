import { Router } from 'express';
import { passportCall } from '../utils.js';
import { authorisation } from '../middlewares/authorisation.js';
import { CartsController } from '../controllers/carts.controller.js';

export const router = Router();

//* GET ALL CARTS **********************************************/
router.get(
	'/',
	passportCall('current'),
	authorisation(['admin']),
	CartsController.getCarts
);

//* GET A CART BY ID ********************************************/
router.get('/:cid', passportCall('current'), CartsController.getCart);

//* CREATE a new empty cart *************************************/
router.post('/', passportCall('current'), CartsController.createCart);

//* ADD A PRODUCT IN AN EXISTING CART ***************************/
router.post(
	'/:cid/product/:pid',
	passportCall('current'),
	CartsController.addProductToCart
);

//* REMOVE A PRODUCT FROM A CART ********************************/
router.delete(
	'/:cid/product/:pid',
	passportCall('current'),
	CartsController.removeProductFromCart
);

//* DELETE THE ENTIRE PRODUCT FROM AN EXISTING CART *************/
router.delete(
	'/:cid/product/:pid/delete',
	passportCall('current'),
	CartsController.deleteProductFromCart
);

//* DELETE A COMPLETE CART **************************************/
router.delete('/:cid', passportCall('current'), CartsController.deleteCart);

//* EMPTY A CART ************************************************/
router.delete('/empty/:cid', passportCall('current'), CartsController.emptyCart);

//* MERGE TWO CARTS *********************************************/
// This endpoint merges two carts by combining their products and quantities
// and then deletes the source cart.
// It assumes that the source cart's products will be merged into the target cart.
router.post('/merge', passportCall('current'), CartsController.mergeCarts);

//* ADD MULTIPLE PRODUCTS TO CART - SENDIND [{product, quantity}] BY BODY **********/
router.put('/:cid', passportCall('current'), CartsController.addProductsToCart);

//* PURCHASE A CART *********************************************/
router.post('/:cid/purchase', passportCall('current'), CartsController.purchaseCart);
