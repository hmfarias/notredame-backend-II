import { CartsDAOMongo as CartsDAO } from '../dao/CartsDAOMongo.js';

class CartsService {
	constructor(dao) {
		this.cartsDAO = dao;
	}
	//* GET ALL CARTS **********************************************/
	async getCarts() {
		return await CartsDAO.get();
	}

	//* GET A CART BY FILTER ****************************************/
	async getCartByFilter(filter) {
		return await CartsDAO.getBy(filter);
	}

	//* CREATE a new empty cart ************************************/
	async createCart(cart) {
		return await CartsDAO.create(cart);
	}

	//* UPDATE A CART **********************************************/
	async updateCart(cart) {
		return await CartsDAO.update(cart);
	}

	//* DELETE A CART **********************************************/
	async deleteCart(CartId) {
		return await CartsDAO.delete(CartId);
	}
}
export const cartsService = new CartsService(CartsDAO);
