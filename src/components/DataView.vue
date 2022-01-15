<template>
<div class="container">
    <div class="row" v-if="this.products !== undefined">
        <div id="side-menu" class="col-sm-2 p-4 card">
            <p class="text-center">Filter Results</p>

            <p><strong>Product Type</strong></p>

            <div id="product-types" class="pb-3 px-3">
                <div v-for="productType of productTypes" :key="productType.id">
                    <input type="checkbox" :id="productType.id" :value="productType.description" v-model="productsTypeSelecteds">
                    <label clasS="mx-1" for="checkbox">{{ firstCapital(productType.description) }}</label>
                </div>
            </div>

            <p><strong>Price Range</strong></p>
            
            <input type="range" list="price-range" v-on:change="filterByPrice" v-model="priceSelected" :min="minPrice" :max="maxPrice">
        </div>
    
        <div id="filter-results" class="col-sm-10 p-0">
            <div id="sort-filters" class="row border m-0 p-1">
                <div class="col-sm-7">
                    Available Deals: {{ filteredProducts !== undefined ? filteredProducts.length : '' }}
                </div>

                <div class="col-sm-1">
                    <img :src="gridIco" width="18" style="cursor: pointer" v-on:click="changeView('grid')" />
                    <img :src="listIco" width="15" style="cursor: pointer" v-on:click="changeView('list')" class="mx-2" />
                </div>

                <div class="col-sm-4">
                    <span>Sort results: </span>
                    <select name="sort-results" id="sort-results" v-model="filterSelected">
                        <option v-for="filter of filters" :key="filter.id" :value="filter.id">{{ filter.description }}</option>
                    </select>
                </div>
            </div>


            <!-- Grid View --> 
            <div id="data-results" class="container border">
                <div id="grid-view" v-if="viewToshow === 'grid'">
                    <div class="row p-2" v-if="filteredProducts !== undefined">
                        <div class="col-sm-3" v-for="product of filteredProducts" :key="product.id">
                            <div class="media-heading center-block text-center pb-3">
                                <img :src="product.image.src" style="width: 100px; height: 100px; padding: 10px;">
                            </div>

                            <div class="media-body mx-4">
                                <p class="text-center">{{ ellipsis(product.title) }}</p>
                                <p>{{ firstCapital(product.product_type) }}</p>
                                <p>Quantity sold: {{ product.quantitySold }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- List View --> 
                <div id="list-view" v-if="viewToshow === 'list'">
                    <div class="row p-2 border-bottom" v-for="product of filteredProducts" :key="product.id">
                        <div class="col-sm-2 p-3 text-center">
                            <img :src="product.image.src" style="width: 100px; height: 100px; padding: 10px;">
                        </div>

                        <div class="col-sm-10">
                            <p>{{ product.title }}</p>
                            <p>{{ firstCapital(product.product_type) }}</p>
                            <p>Quantity sold: {{ product.quantitySold }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
    export default {
      name: "DataView",
        data() {
            return {
                viewToshow: "grid",
                products: null,
                
                gridIco: "https://i.ibb.co/1RBWnwv/grid-ico.png",
                listIco: "https://i.ibb.co/MSpVXsP/list-ico.png",

                // Product types variables
                productTypes: [],
                productsTypeSelecteds: [],

                // Prices variables
                prices: [],
                priceSelected: 0,
                minPrice: 0,
                maxPrice: 100,

                filterSelected: 1,

                filters: [
                    {
                        id: 1,
                        description: "Please select a sort method",
                    },
                    {
                        id: 2,
                        description: "Alphabetical: A-Z",
                    },
                    {
                        id: 3,
                        description: "Alphabetical: Z-A",
                    },
                ],
            }
        },

        created() { 
            this.products = this.getProducts();
        },

        methods: {
            changeView: function(viewToShow) {
                if (viewToShow === "grid")
                {
                    this.viewToshow = "grid";
                } else if (viewToShow === "list") {
                    this.viewToshow = "list";
                }
            },

            getProducts() {
                let headers = new Headers();

                headers.append("secretKey", "1DIPIkKeq8");

                fetch("https://kabsa.yallababy.com/api/v1/products/best-selling-products-by-subcategory", {
                    method: "GET",
                    headers: headers
                })
                .then(res => res.json())
                .then(data => { 
                    this.products = data;
                    this.removeDuplicateProducts();
                    this.getPrices();
                });
            },

            firstCapital(text) {
                if (text !== null && text !== undefined) {
                    // First capital letter
                    text = text.charAt(0).toUpperCase() + text.substring(1, text.length);
                }
                return text;
            },

            ellipsis(text) {
                if (text !== null && text !== undefined) {
                    // First capital letter
                    this.firstCapital(text);

                    if (text.length >= 22)
                        return text.substring(0, 18) + '...';
                    else
                        return text;
                } else {
                    return text;
                }
            },

            getPrices() {
                let prices = [];

                for (let i = 0; i < this.products.length; i++) {    
                    for (let j = 0; j < this.products[i].variants.length; j++) {
                        this.prices.push({ id: this.products[i].id, variantsLength: this.products[i].variants.length, price: this.products[i].variants[j].price });
                        prices.push(this.products[i].variants[j].price); 
                    }
                }

                this.minPrice = Math.min(...prices);
                this.maxPrice = Math.max(...prices);
            },

            removeDuplicateProducts() {
                let obj = {};

                for (var i = 0, len = this.products.length; i < len; i++)
                    obj[this.products[i]['product_type']] = this.products[i];
                
                let productTypes = new Array();
                this.productTypes = [];

                for (var key in obj)
                    productTypes.push(obj[key]);

                for (let i = 0; i < productTypes.length; i++) {
                    this.productTypes.push({ id: i, description: productTypes[i].product_type });
                }
            },

            filterByPrice() {                
                // for (let i = 0; i < this.filteredProducts.length; i++) {
                //     for (let j = 0; j < this.filteredProducts[i].variants.length; j++) {
                //         this.filteredProducts[i].variants.filter(v => v.price >= this.priceSelected);
                //     }
                // }
            },
        },

        computed: {
            filteredProducts() {
                if (!this.productsTypeSelecteds.length)
                    return this.products

                return this.products.filter(p => this.productsTypeSelecteds.includes(p.product_type))
            },            
        },

        watch: {
            filterSelected: function (value) {
                if (value === 2) { // A-Z
                    this.products = this.products.sort((a, b) => {
                        if (a.title.toLowerCase() < b.title.toLowerCase()) {
                            return -1;
                        }

                        if (a.title.toLowerCase() > b.title.toLowerCase()) {
                            return 1;
                        }

                    return 0;
                    });
                } else if (value === 3) { // Z-A
                    this.products = this.products.sort((a, b) => {
                        if (a.title.toLowerCase() > b.title.toLowerCase()) {
                            return -1;
                        }

                        if (a.title.toLowerCase() < b.title.toLowerCase()) {
                            return 1;
                        }

                    return 0;
                    });
                }
            },
        }
    }
</script>