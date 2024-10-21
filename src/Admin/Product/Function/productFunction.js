import { collection, getDocs, doc, deleteDoc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../Firebase/firebaseConfig';
import { v4 as uuidv4 } from 'uuid'; // Ensure you import uuidv4

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

// Add product to Firestore with image URLs and UUID
export const Add = async (product) => {
  try {
    const imageUrl = product.image_url ? await uploadImage(product.image_url) : null;
    const bannerImageUrl = product.banner_image_url ? await uploadImage(product.banner_image_url) : null;

    const productData = {
      ...product,
      image_url: imageUrl,
      banner_image_url: bannerImageUrl,
      category: product.category || null,
    };

    // Remove undefined fields
    Object.keys(productData).forEach(key => {
      if (productData[key] === undefined) {
        delete productData[key];
      }
    });

    // const product = uuidv4(); 
    const productDocRef = doc(productCollectionRef, product._id);

    await setDoc(productDocRef, productData);


    console.log('Product added successfully with UUID:', product._id);
  } catch (error) {
    console.error('Error adding product:', error);
  }
};

export const fetchProducts = async () => {
  try {
    const data = await getDocs(productCollectionRef);
    const productsList = data.docs.map((doc) => ({ ...doc.data(), _id: doc.id }));
    return productsList;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Delete product by UUID
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

export const update = async (productId, updatedProduct) => {
  try {
    const productDocRef = doc(db, 'products', productId);
    console.log(productDocRef, "Product Document Reference");

    const productSnapshot = await getDoc(productDocRef);
    if (!productSnapshot.exists()) {
      console.error(`No product found with ID: ${productId}. Snapshot exists: ${productSnapshot.exists()}`);
      return;
    }

    const imageUrl = updatedProduct.image_url || null;
    const bannerImageUrl = updatedProduct.banner_image_url || null;

    let newImageUrl = imageUrl ? await uploadImage(imageUrl) : null;
    let newBannerImageUrl = bannerImageUrl ? await uploadImage(bannerImageUrl) : null;

    const productData = {
      ...updatedProduct,
      ...(newImageUrl ? { image_url: newImageUrl } : {}),
      ...(newBannerImageUrl ? { banner_image_url: newBannerImageUrl } : {}),
    };

    // Only add category if it is defined
    if (updatedProduct.category) {
      productData.category = updatedProduct.category;
    }

    // Remove undefined fields
    Object.keys(productData).forEach(key => {
      if (productData[key] === undefined) {
        delete productData[key];
      }
    });

    console.log(productData, "productData");

    await updateDoc(productDocRef, productData);
    console.log('Product updated successfully');
  } catch (error) {
    console.error('Error updating product:', error);
  }
};
  