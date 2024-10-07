import * as Yup from 'yup';

export const ProductSchema = Yup.object().shape({
  productName: Yup.string().required('Product Name is required'),
  productCardDetail: Yup.string().required('Product Card Detail is required'),
  productIsMostPopular: Yup.boolean().required("Product most popular is required"),
  productCategory: Yup.string().required('Product Category is required'),
  productImage: Yup.mixed().required('Product Image is required'),
  bannerImg: Yup.mixed().required('Banner Image is required'),
  specialNote: Yup.string().max(250, 'Special Note must be at most 250 characters').required("please add a special note"), 
  description: Yup.string().max(500, 'Description must be at most 500 characters').required("please add a description"),
  productPrice: Yup.number().required('Product Price is required').min(1, 'Price must be greater than 0'),
});
