import * as Yup from 'yup';

export const ProductSchema = Yup.object().shape({
  image_text: Yup.string().required('Product Name is required'),
  event_name: Yup.string().required('Product Card Detail is required'),
  // most_popular: Yup.boolean().required("Product most popular is required"),
  category: Yup.string().required('Product Category is required'),
  image_url: Yup.mixed().required('Product Image is required'),
  banner_image_url: Yup.mixed().required('Banner Image is required'),
  // special_note: Yup.string().max(250, 'Special Note must be at most 250 characters').required("please add a special note"), 
  // description: Yup.string().max(500, 'Description must be at most 500 characters').required("please add a description"),
  price: Yup.number().required('Product Price is required').min(1, 'Price must be greater than 0'),
});
  