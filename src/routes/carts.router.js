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
router.get('/:cid', CartsController.getCart);

//* CREATE a new empty cart *************************************/
router.post('/', CartsController.createCart);

//* ADD A PRODUCT IN AN EXISTING CART ***************************/
router.post('/:cid/product/:pid', CartsController.addProductToCart);

//* REMOVE A PRODUCT FROM A CART ********************************/
router.delete('/:cid/product/:pid', CartsController.removeProductFromCart);

//* DELETE THE ENTIRE PRODUCT FROM AN EXISTING CART *************/
router.delete('/:cid/product/:pid/delete', CartsController.deleteProductFromCart);

//* DELETE A COMPLETE CART **************************************/
router.delete('/:cid', CartsController.deleteCart);

//* EMPTY A CART ************************************************/
router.delete('/empty/:cid', CartsController.emptyCart);

//* MERGE TWO CARTS *********************************************/
// This endpoint merges two carts by combining their products and quantities
// and then deletes the source cart.
// It assumes that the source cart's products will be merged into the target cart.
router.post(
	'/merge',
	passportCall('current'),
	authorisation(['public']),
	CartsController.mergeCarts
);
