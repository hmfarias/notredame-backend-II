import { CartsDAOMongo as CartsDAO } from '../dao/CartsDAOMongo.js';

class CartsService {
	constructor(dao) {
		this.cartsDAO = dao;
	}
	//* GET ALL CARTS **********************************************/
	async getCarts() {
		return await this.cartsDAO.get();
	}

	//* GET A CART BY FILTER ****************************************/
	async getCartByFilter(filter) {
		return await this.cartsDAO.getBy(filter);
	}

	//* CREATE a new empty cart ************************************/
	async createCart(cart) {
		return await this.cartsDAO.create(cart);
	}

	//* UPDATE A CART **********************************************/
	async updateCart(cart) {
		return await this.cartsDAO.update(cart);
	}

	//* DELETE A CART **********************************************/
	async deleteCart(CartId) {
		return await this.cartsDAO.delete(CartId);
	}
}
export const cartsService = new CartsService(CartsDAO);
