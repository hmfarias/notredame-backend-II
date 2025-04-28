import { ProductsDAOMongo as ProductsDAO } from '../dao/ProductsDAOMongo.js';

class ProductsService {
	constructor(dao) {
		this.productsDAO = dao;
	}

	//* GET all product with pagination *****************************/
	async getProducts(filter = {}, options = {}) {
		return await ProductsDAO.get(filter, options);
	}

	//* GET a product by filter ***************************************/
	async getProductByFilter(filter) {
		return await ProductsDAO.getBy(filter);
	}

	//* CREATE a new product *****************************************/
	async createProduct(product) {
		return await ProductsDAO.create(product);
	}

	//* UPDATE a product  *********************************************/
	async updateProduct(id, product) {
		return await ProductsDAO.update(id, product);
	}

	//* DELETE ***************************************************/
	async deleteProduct(id) {
		return await ProductsDAO.delete(id);
	}
}
export const productsService = new ProductsService(ProductsDAO);
