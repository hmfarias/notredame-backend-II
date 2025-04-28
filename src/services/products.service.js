import { ProductsDAOMongo as ProductsDAO } from '../dao/ProductsDAOMongo.js';

class ProductsService {
	constructor(dao) {
		this.productsDAO = dao;
	}

	//* GET all product with pagination *****************************/
	async getProducts(filter = {}, options = {}) {
		return await this.productsDAO.get(filter, options);
	}

	//* GET a product by filter ***************************************/
	async getProductByFilter(filter) {
		return await this.productsDAO.getBy(filter);
	}

	//* CREATE a new product *****************************************/
	async createProduct(product) {
		return await this.productsDAO.create(product);
	}

	//* UPDATE a product  *********************************************/
	async updateProduct(id, product) {
		return await this.productsDAO.update(id, product);
	}

	//* DELETE ***************************************************/
	async deleteProduct(id) {
		return await this.productsDAO.delete(id);
	}
}
export const productsService = new ProductsService(ProductsDAO);
