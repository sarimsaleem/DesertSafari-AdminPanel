import { addDoc, collection, getDocs, doc, deleteDoc, updateDoc   } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../Firebase/firebaseConfig';

const productCollectionRef = collection(db, 'products');

// Function to upload image to Firebase Storage and return the URL
const uploadImage = async (file) => {
  if (!file) return null;
  
  const storageRef = ref(storage, `products/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  
  return url;
};
// Function to delete image from Firebase Storage
const deleteImage = async (imageUrl) => {
  if (!imageUrl) return;

  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    console.log('Image deleted successfully');
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

// Add product to Firestore with image URLs
export const Add = async (product) => {
  try {
    const productImageUrl = product.productImage ? await uploadImage(product.productImage) : null;
    const bannerImgUrl = product.bannerImg ? await uploadImage(product.bannerImg) : null;

    const productData = {
      ...product,
      productImage: productImageUrl,
      bannerImg: bannerImgUrl  // Store the banner image URL
    };

    // Add the product data to Firestore
    await addDoc(productCollectionRef, productData);
    console.log('Product added successfully');
  } catch (error) {
    console.error('Error adding product:', error);
  }
};

// fetchProducts 
export const fetchProducts = async () => {
    try {
      const data = await getDocs(productCollectionRef);
      const productsList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      return productsList;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };
  export const deleteProduct = async (productId, imageUrl) => {
    try {
      const productDocRef = doc(db, 'products', productId);
  
      if (imageUrl) {
        await deleteImage(imageUrl);
      }
        await deleteDoc(productDocRef);
  
      console.log('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  export const updateProduct = async (productId, updatedProductData) => {
    const productRef = doc(db, 'products', productId);
    try {
      if (updatedProductData.productImage) {
        const imageUrl = await uploadImage(updatedProductData.productImage);
        updatedProductData.productImage = imageUrl; // Update the URL with the new upload
    } else {
        const existingProduct = await fetchProductById(productId); // Fetch the current product
        updatedProductData.productImage = existingProduct.productImage; // Keep the existing image
    }
      await updateDoc(productRef, updatedProductData);
      console.log('Product updated successfully');
    } catch (error) {
      console.error('Error updating product: ', error);
    }
  }