document.addEventListener('DOMContentLoaded', () => {
	// Capitalize each word in a string
	const capitalizeEachWord = (text) =>
		text
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');

	// Category list for the select dropdown
	const categoryList = [
		'beauty',
		'fragrances',
		'furniture',
		'groceries',
		'herramientas',
		'home-decoration',
		'kitchen-accessories',
		'laptops',
		'mens-shirts',
		'mens-shoes',
		'mens-watches',
		'mobile-accessories',
		'motorcycle',
		'skin-care',
		'smartphones',
		'sports-accessories',
		'sunglasses',
		'tablets',
		'tops',
		'vehicle',
		'womens-bags',
		'womens-dresses',
		'womens-jewellery',
		'womens-shoes',
		'womens-watches',
	];

	// DOM elements
	const categorySelect = document.getElementById('category-select');
	const statusSelect = document.querySelector("[name='status']");
	const priceSelect = document.querySelector("[name='price']");
	const limitInput = document.getElementById('limit-input');
	const resetButton = document.getElementById('reset-filters');
	const filtersForm = document.getElementById('filters-form');
	const productsList = document.getElementById('products-list');
	const paginationContainer = document.querySelector('.pagination');

	// Populate category select with category options
	if (categorySelect) {
		categoryList.forEach((category) => {
			const option = document.createElement('option');
			option.value = category;
			option.textContent = capitalizeEachWord(category.replace('-', ' '));
			categorySelect.appendChild(option);
		});
	}

	// Apply URL parameters to filters if present
	const urlParams = new URLSearchParams(window.location.search);
	const selectedCategory = urlParams.get('category');
	const selectedStatus = urlParams.get('status');
	const selectedPrice = urlParams.get('priceOrder');
	const selectedLimit = urlParams.get('limit');

	if (selectedCategory && categorySelect) categorySelect.value = selectedCategory;
	if (selectedStatus && statusSelect) statusSelect.value = selectedStatus;
	if (selectedPrice && priceSelect) priceSelect.value = selectedPrice;
	if (selectedLimit && limitInput) limitInput.value = selectedLimit;

	// Save filters to localStorage
	const saveFilters = () => {
		const params = new URLSearchParams();
		if (categorySelect?.value && categorySelect.value !== 'all')
			params.append('category', categorySelect.value);
		if (statusSelect?.value && statusSelect.value !== 'all')
			params.append('status', statusSelect.value);
		if (priceSelect?.value) params.append('priceOrder', priceSelect.value);
		if (limitInput?.value) params.append('limit', limitInput.value);

		localStorage.setItem('productsFilters', `?${params.toString()}`);
	};

	// Handle filter form submit
	if (filtersForm) {
		filtersForm.addEventListener('submit', (event) => {
			event.preventDefault();

			saveFilters(); // Save the filters when submitting

			const filters = localStorage.getItem('productsFilters') || '';
			window.location.href = `/products${filters}`;
		});
	}

	// Reset filters and reload page
	if (resetButton) {
		resetButton.addEventListener('click', () => {
			if (categorySelect) categorySelect.value = 'all';
			if (statusSelect) statusSelect.value = 'all';
			if (priceSelect) priceSelect.value = 'asc';
			if (limitInput) limitInput.value = '10';

			localStorage.removeItem('productsFilters'); // Clean stored filters
			window.location.href = '/products';
		});
	}

	// Render product cards
	const renderProducts = (products) => {
		productsList.innerHTML = ''; // Clear list first

		products.forEach((product) => {
			const li = document.createElement('li');
			li.classList.add('product-card');
			li.innerHTML = `
				<img src="${product.thumbnail}" alt="${product.title}" class="product-thumbnail" />
				<h3>${product.title}</h3>
				<p>Price: $${product.price}</p>
				<a href='/product?id=${product._id}'>View Details</a>
			`;
			productsList.appendChild(li);
		});

		handleDeleteButtons();
	};

	// Render pagination controls
	const renderPagination = (data) => {
		paginationContainer.innerHTML = '';

		if (data.hasPrevPage) {
			paginationContainer.innerHTML += `
				<a class="pagination-link" data-url="${data.firstLink}" style='margin: 10px;'><i class='fa-solid fa-backward'></i></a>
				<a class="pagination-link" data-url="${data.prevLink}"><i class='fa-solid fa-backward-step'></i></a>
			`;
		}

		paginationContainer.innerHTML += `<span style='margin: 10px;'>Page ${data.page} of ${data.totalPages}</span>`;

		if (data.hasNextPage) {
			paginationContainer.innerHTML += `
				<a class="pagination-link" data-url="${data.nextLink}"><i class='fa-solid fa-forward-step'></i></a>
				<a class="pagination-link" data-url="${data.lastLink}" style='margin: 10px;'><i class='fa-solid fa-forward'></i></a>
			`;
		}

		handlePaginationLinks(); // attach event listeners
	};

	// Intercept pagination links and fetch updated product list
	const handlePaginationLinks = () => {
		const links = document.querySelectorAll('.pagination-link');

		links.forEach((link) => {
			link.addEventListener('click', async (e) => {
				e.preventDefault();
				const url = link.getAttribute('data-url');

				try {
					const response = await fetch(`/api${url}`);
					const data = await response.json();
					renderProducts(data.payload.products);
					renderPagination(data.payload);

					window.history.pushState({}, '', url);

					// Save the filters again
					const filtersFromUrl = new URLSearchParams(url.split('?')[1]);
					localStorage.setItem('productsFilters', `?${filtersFromUrl.toString()}`);
				} catch (error) {
					console.error('❌ Error fetching paginated data:', error);
				}
			});
		});
	};

	// Confirm and handle delete button clicks
	const handleDeleteButtons = () => {
		const deleteForms = document.querySelectorAll('.delete-form');

		deleteForms.forEach((form) => {
			const button = form.querySelector('.button-delete');

			button.addEventListener('click', (event) => {
				event.preventDefault();

				Swal.fire({
					title: 'Are you sure?',
					text: 'This action cannot be undone!',
					icon: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#d33',
					cancelButtonColor: '#3085d6',
					confirmButtonText: 'Yes, delete it!',
				}).then((result) => {
					if (result.isConfirmed) {
						form.submit();
					}
				});
			});
		});
	};

	// Initial load: fetch filtered products via API
	const init = async () => {
		const apiUrl = `/api/products${window.location.search}`;
		try {
			const response = await fetch(apiUrl);
			const data = await response.json();
			renderProducts(data.payload.products);
			renderPagination(data.payload);
		} catch (error) {
			console.error('❌ Error loading products:', error);
		}
	};

	init();
});
