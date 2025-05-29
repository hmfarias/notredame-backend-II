import { CategoriesDAOMongo as CategoriesDAO } from '../dao/CategoriesDAOMongo.js';

class CategoriesService {
	constructor(dao) {
		this.categoriesDAO = dao;
	}
	//* GET ALL CATEGORIES **********************************************/
	async getCategories() {
		return await this.categoriesDAO.get();
	}

	//* GET A CATEGORY BY FILTER ****************************************/
	async getCategoryByFilter(filter) {
		return await this.categoriesDAO.getBy(filter);
	}

	//* CREATE a new empty category ************************************/
	async createCategory(category) {
		return await this.categoriesDAO.create(category);
	}

	//* UPDATE A CATEGORY **********************************************/
	async updateCategory(category) {
		return await this.categoriesDAO.update(category);
	}

	//* DELETE A CATEGORY **********************************************/
	async deleteCategory(CategoryId) {
		return await this.categoriesDAO.delete(CategoryId);
	}
}
export const categoriesService = new CategoriesService(CategoriesDAO);
