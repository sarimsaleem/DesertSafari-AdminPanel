import { collection, doc, getDocs, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../Firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const PARENT_COLLECTION_NAME = "categories";

// Function to upload an image to Firebase Storage
const uploadImage = async (file) => {
  if (!file) return null;

  const storageRef = ref(storage, `categories/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);

  return url;
};

// Function to delete an image from Firebase Storage
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

// Function to add a category with image handling
export const Add = async (values, CB) => {
  try {
    // Upload image to Firebase Storage and get the URL
    const imageUrl = values.image ? await uploadImage(values.image) : null;

    // Prepare category data to store in Firestore
    const categoryData = { ...values, image_url: imageUrl };
    delete categoryData.image; // Remove raw image file from data

    // Add category to Firestore
    await setDoc(doc(db, PARENT_COLLECTION_NAME, values._id), categoryData);
    console.log('Category added successfully');

    CB && CB(categoryData);
  } catch (error) {
    console.error('Error saving category:', error);
  }
};

// Function to fetch categories along with their images
export const fetchCategories = async () => {
  const categoriesCollectionRef = collection(db, PARENT_COLLECTION_NAME);
  const categorySnapshot = await getDocs(categoriesCollectionRef);

  const categoryList = categorySnapshot.docs.map(doc => ({
    ...doc.data(),
    _id: doc.id
  }));

  return categoryList;
};

// Function to delete a category and its image
export const deleteCategory = async (categoryId, imageUrl) => {
  try {
    if (!categoryId) {
      console.error('Error: categoryId is undefined or invalid.');
      return;
    }
    console.log(`Attempting to delete category with ID: ${categoryId}`);

    // Delete image from Firebase Storage
    await deleteImage(imageUrl);

    // Delete category from Firestore
    const categoryDocRef = doc(db, PARENT_COLLECTION_NAME, categoryId);
    await deleteDoc(categoryDocRef);

    console.log('Category deleted successfully');
  } catch (error) {
    console.error('Error deleting category:', error);
  }
};

export const Update = async (categoryId, updatedCategory) => {
  try {
    const categoryRef = doc(db, PARENT_COLLECTION_NAME, categoryId);

    if (!updatedCategory) {
      throw new Error('Updated category data is undefined');
    }

    // Set default values for image URLs
    let newImageUrl = updatedCategory.image_url || null;

    // Check if a new image is uploaded (ensure it's a File object)
    if (updatedCategory.newImage instanceof File) {
      newImageUrl = await uploadImage(updatedCategory.newImage);  

      // Delete the old image if it exists
      if (updatedCategory.oldImageUrl) {
        await deleteImage(updatedCategory.oldImageUrl); 
      }
    }

    // Construct the category data to update
    const categoryData = {
      ...updatedCategory,
      image_url: newImageUrl,  // Set the updated image URL
    };

    // Remove raw file and unnecessary properties
    delete categoryData.newImage;
    delete categoryData.oldImageUrl;

    // Remove any undefined or File object fields
    Object.keys(categoryData).forEach((key) => {
      if (categoryData[key] === undefined || categoryData[key] instanceof File) {
        delete categoryData[key];
      }
    });

    // Update the category document in Firestore with valid data
    await updateDoc(categoryRef, categoryData);
    console.log('Category updated successfully');
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};
