import { addDoc, collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
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
    const imageUrl = product.image_url ? await uploadImage(product.image_url) : null;
    const bannerImageUrl = product.banner_image_url ? await uploadImage(product.banner_image_url) : null;

    const productData = {
      ...product,
      image_url: imageUrl,
      banner_image_url: bannerImageUrl
    };

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

// Function to update product in Firestore
export const update = async (productId, updatedProduct, ) => {
  try {
    const productDocRef = doc(db, 'products', productId);

    if (!updatedProduct) {
      throw new Error('Updated product data is undefined');
    }
    const imageUrl = updatedProduct.image_url || null;
    const bannerImageUrl = updatedProduct.banner_image_url || null;
    const newImageUrl = '';
    const newBannerImageUrl = '';
    if (imageUrl) {
      newImageUrl = imageUrl ? await uploadImage(imageUrl) : null;
    }
    if (bannerImageUrl) {
      newBannerImageUrl = bannerImageUrl ? await uploadImage(bannerImageUrl) : null;
    }
    const productData = {
      ...updatedProduct,
      ...((newImageUrl || imageUrl) && { image_url: newImageUrl || imageUrl }),
      ...((newBannerImageUrl || bannerImageUrl) && { banner_image_url: newBannerImageUrl || bannerImageUrl }),
    };

    await updateDoc(productDocRef, productData);
    console.log('Product updated successfully');
  } catch (error) {
    console.error('Error updating product:', error);
  }
};


