import {ACTION_TYPES, Brand, CategoryType} from "store/types";


import {ProductActionTypes} from "store/types/productActionTypes";
import {createSlice} from "@reduxjs/toolkit";
import {fetchHomePageSectionProducts, filterProductsAction} from "actions/productAction";
import {build} from "vite";


export enum PaginationWhereEnum {
    home_section,
    one_type_products,
    filter_products_page,
}

export type PaginationType = {
    where: PaginationWhereEnum;
    perPage: number;
    currentPage: number;
};

export interface ProductType {
    _id: string
    slug: string
    title: string;
    coverPhoto: string;
    attributes: {},
    brand: { name: string };
    discount: number;
    price: number;
    qty: number,
    sold?: number,
    views?: number,
    brandId?: string
    categoryId?: string
    sellerId?: string
    createdAt?: Date,
    updatedAt?: Date,
    isApproved: boolean
    isActive: boolean
    sku: number
    isMall: boolean
    productType: "Digital" | "Physical"
}

export interface ProductStateType {
    totalProduct: number;
    totalFilterAbleProductCount: 0,
    filterProducts: ProductType[];
    productDetails: { [key: string]: ProductType }
    homePageSectionsData: {
        name: string
        langKey: string
        type: string
        filterBy: string
        params: string
    }[]
    homePageSectionProducts: {}
    relevantProducts: { [cacheName: string]: ProductType[] }
    filters: {
        pagination: {
            totalItems: number;
            currentPage: number;
            viewPerPage: number;
        };
        price: any;
        brands: Brand[];
        sortBy: { field: string; id: string; order: number }[];
        ideals: string[],
        attributes: {
            [attributeName: string]: (string | number)[]
        },
        searchBy: {
            fieldName: string,
            order: number
            value?: string
        }
    };
    filteredAttributes: {
        attribute_name: string;
        values: { name: string; value: string }[];
    }[];
    oneTypeFetchProducts: { name?: ""; values?: [{}] };
    expandFilterItems_sectionIds: string[];

    filterItem_sections_data: {
        category_id?: string;
        filterItem_sections?: { attribute_name: string; name: string; values: { name: string; value: string | object } }[];
    };
    flatCategories: CategoryType[] | null;
    nestedCategoriesCache: {
        [key: string]: any;
    };
}

const initialState: ProductStateType = {
    totalProduct: 0,
    totalFilterAbleProductCount: 0,
    filterProducts: [],
    productDetails: {},
    oneTypeFetchProducts: {name: "", values: [{}]},
    homePageSectionsData: [
        {
            name: "Top Popular products",
            langKey: "top_popular_products",
            type: "products",
            filterBy: "views=-1",
            params: "views=-1",
        },
        {
            name: "Top Selling products",
            langKey: "top_selling_products",
            type: "products",
            filterBy: "sold=-1",
            params: "sold=-1",
        },
        {
            name: "Top Offers",
            langKey: "top_offer_products",
            type: "products",
            filterBy: "top-discount",
            params: "discount=-1",
        },
        // {name: "Today's Fashion Deals", type: "products", filterBy: "top-discount", params: "discount=-1&cat=60df5e546419f56b97610608"},
        // {name: "Featured Brands", type: "products", filterBy: "top-discount", params: "discount=-1&cat=60df5e546419f56b97610608"},
        // {name: "Best of Electronics", type: "products", filterBy: "top-views", params: "cat=60df5e546419f56b97610608"},
        // {name: "Fashion Best Sellers", type: "products", filterBy: "top-views", params: "cat=60df5e546419f56b97610608"},
        // {name: "Bestselling Furniture", type: "products", filterBy: "top-views", params: "cat=60df5e546419f56b97610608"},
        // {name: "TVs & Appliances", type: "products", filterBy: "top-views", params: "cat=60df5e546419f56b97610608"},
        // {name: "Top Deals on Electronics", type: "products", filterBy: "top-views", params: "/api/products/filter/v2?cat=60df5e546419f56b97610608"},
        // {name: "Men's Footwear", type: "products", filterBy: "men-footwear"},
        // {name: "Shop By Categories", type: "categories", filterBy: "fetch-categories", ids: ["60df5e546419f56b97610608", "60df5e546419f56b9761060a", "60df5e546419f56b97610609"]},
        // {name: "Shop By Brands", type: "brands", filterBy: "fetch-brands", ids: ["60e03b7bc4db28a6a4fdcb82", "60e03b83c4db28a6a4fdcb83"]},
        // {name: "motherboard",  type: "products",  filterBy: "category", id: "60df5e546419f56b97610608"},
        // {name: "mobile",  type: "products", filterBy: "category", id: "60df5e546419f56b97610602"},
        // {name: "ram", type: "products", filterBy: "category", id: "60df5e546419f56b9761060a"},
        // {name: "processor", type: "products", filterBy: "category", id: "60df5e546419f56b97610609"},
        // {name: "Cpu", type: "products", filterBy: "category", id: "60df5e546419f56b97610608"},
        // {name: "Graphics Card", type: "products", filterBy: "category", id: "60df5e546419f56b97610608"},
        // {name: "Power Supply", type: "products", filterBy: "category", id: "60df5e546419f56b9761060b"}
    ],
    homePageSectionProducts: {},
    relevantProducts: {},


    filters: {
        pagination: {
            totalItems: 0,
            currentPage: 1,
            viewPerPage: 15,
        },
        price: [10, 100],
        brands: [],
        sortBy: [{field: "views", order: -1, id: "1"}],
        ideals: [],
        attributes: {},
        searchBy: {
            fieldName: "title",
            value: undefined,
            order: 1
        }
    },

    filteredAttributes: [],
    expandFilterItems_sectionIds: ["generation"],
    filterItem_sections_data: {},
    flatCategories: null,

    nestedCategoriesCache: {
        categoryName: [],
    },
};


const productSlice = createSlice({
    name: "productSlice",
    initialState: initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder.addCase(fetchHomePageSectionProducts.fulfilled, (state, action) => {
            if (action.payload) {
                state.homePageSectionProducts = action.payload
            }
        })


        builder.addCase(filterProductsAction.fulfilled, (state, action) => {
            if (action.payload) {
                const {products, totalItems} = action.payload;

                state.filterProducts = products;

                if (typeof totalItems === "number") {
                    state.filters = {
                        ...state.filters,
                        pagination: {
                            ...state.filters.pagination,
                            totalItems: totalItems,
                        },
                    };
                }
            }
        })
    }
})


// let updatedState: ProductStateType = {...state};
// switch (action.type) {
//
//     case ACTION_TYPES.FETCH_FILTER_PRODUCTS:
//         const {products, totalItems} = action.payload;
//
//         updatedState.filterProducts = products;
//
//         if (typeof totalItems === "number") {
//             updatedState.filters = {
//                 ...updatedState.filters,
//                 pagination: {
//                     ...updatedState.filters.pagination,
//                     totalItems: totalItems,
//                 },
//             };
//         }
//         return updatedState;
//
//     case ACTION_TYPES.SET_FILTER_PAGINATION:
//         updatedState.filters = {
//             ...updatedState.filters,
//             pagination: {
//                 ...updatedState.filters.pagination,
//                 ...action.payload,
//             },
//         };
//         return updatedState;
//
//     case ACTION_TYPES.SELECT_FILTER_BRAND:
//         let updateBrands = [...updatedState.filters.brands]
//         let index  = updateBrands.findIndex(brand=>brand._id === action.payload._id)
//         if(index !== -1){
//             updateBrands.splice(index, 1)
//         } else {
//             updateBrands = [...updateBrands, action.payload]
//         }
//         return {
//             ...updatedState,
//             filters: {
//                 ...updatedState.filters,
//                 brands: updateBrands
//             }
//
//         };
//
//     case ACTION_TYPES.CLEAR_FILTER_BRAND:
//         return {
//             ...updatedState,
//             filters: {
//                 ...updatedState.filters,
//                 brands: []
//             }
//
//         };
//
//     case ACTION_TYPES.CHANGE_FILTER_SEARCH:
//         let {fieldName, value, order} = action.payload
//         let updateSearchBy = {...state.filters.searchBy}
//         if(fieldName) {
//             updateSearchBy.fieldName = fieldName
//         }
//
//         if(value !== undefined) {
//             updateSearchBy.value = value
//         }
//
//         if(order !== undefined) {
//             updateSearchBy.order = order
//         }
//
//         return {
//             ...state,
//             filters: {
//                 ...state.filters,
//                 searchBy: updateSearchBy
//             }
//         }
//
//     case ACTION_TYPES.FETCH_HOMEPAGE_SECTION_PRODUCTS:
//         // mark it if already fetched without dependencies change
//         updatedState.homePageSectionProducts = {
//             ...updatedState.homePageSectionProducts,
//             ...action.payload,
//         };
//
//         // log2(updatedState.loadingStates)
//
//         return updatedState;
//
//     case ACTION_TYPES.FETCH_RELEVANT_PRODUCTS:
//         let updateRelevantProducts = {...state.relevantProducts}
//         updateRelevantProducts[action.payload.cacheName as string] = action.payload.products
//
//         return {
//             ...state,
//             relevantProducts: updateRelevantProducts
//         };
//
//     case ACTION_TYPES.CHANGE_ATTRIBUTE_VALUES:
//         const { attributeName, attributeValue } = action.payload
//
//         let updateAttributes = {...updatedState.filters.attributes}
//         if (updateAttributes[attributeName]) {
//             let attributeItem = updateAttributes[attributeName];
//
//
//
//             // insert a new attribute value
//             if (!updateAttributes[attributeName].includes(attributeValue)) {
//                 updateAttributes[attributeName] =  [
//                     ...updateAttributes[attributeName],
//                     attributeValue
//                 ]
//             } else {
//                 // or delete exist one
//                 updateAttributes[attributeName] = updateAttributes[attributeName].filter(v=>v !== attributeValue)
//
//             }
//
//             // updateAttributes[attributeName] = attributeItem
//
//         } else {
//             updateAttributes = {
//                 ...updateAttributes,
//                 [attributeName]: [attributeValue]
//             }
//         }
//
//
//         updatedState.filters =  {
//             ...updatedState.filters,
//             attributes: updateAttributes
//         }
//         return updatedState
//
//     default:
//         return updatedState;
// }


export const {} = productSlice.actions

export default productSlice.reducer
