import { CartsDAO } from '../dao/CartsDAO.js';

export class CartsService {
	static async getCarts() {
		return await CartsDAO.get();
	}

	static async createCart(cart) {
		return await CartsDAO.create(cart);
	}

	static async getCartById(cartId) {
		return await CartsDAO.getBy({ _id: cartId });
	}

	static async updateCart(cart) {
		return await CartsDAO.update(cart);
	}

	static async deleteCart(CartId) {
		return await CartsDAO.delete(CartId);
	}
}
