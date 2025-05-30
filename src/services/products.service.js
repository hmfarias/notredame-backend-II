import { ProductsDAOMongo as ProductsDAO } from '../dao/ProductsDAOMongo.js';
import { ProductsDTO } from '../dto/products.dto.js';

class ProductsService {
	constructor(dao) {
		this.productsDAO = dao;
	}

	//* GET all product with pagination *****************************/
	async getProducts(filter = {}, options = {}) {
		const products = await this.productsDAO.get(filter, options);
		return products ? ProductsDTO.formatProductOutput(products) : null;
	}

	//* GET a product by filter ***************************************/
	async getProductByFilter(filter) {
		const product = await this.productsDAO.getBy(filter);
		return product ? ProductsDTO.formatProductOutput(product) : null;
	}

	//* GET products by category *********************************/
	async getProductsByCategory(category, options = {}) {
		const filter = { category: category };
		const products = await this.productsDAO.get(filter, options);
		return products ? ProductsDTO.formatProductOutput(products) : null;
	}

	//* CREATE a new product *****************************************/
	async createProduct(product) {
		const newProduct = await this.productsDAO.create(product);
		return newProduct ? ProductsDTO.formatProductOutput(newProduct) : null;
	}

	//* UPDATE a product  *********************************************/
	async updateProduct(id, product) {
		const productUpdated = await this.productsDAO.update(id, product);
		return productUpdated ? ProductsDTO.formatProductOutput(productUpdated) : null;
	}

	//* DELETE ***************************************************/
	async deleteProduct(id) {
		const product = await this.productsDAO.delete(id);
		return product ? ProductsDTO.formatProductOutput(product) : null;
	}
}
export const productsService = new ProductsService(ProductsDAO);
