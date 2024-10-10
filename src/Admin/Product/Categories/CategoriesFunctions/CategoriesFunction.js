import { collection, doc, getDocs, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../Firebase/firebaseConfig";

const PARENT_COLLECTION_NAME = "categories";

export const Add = async (values, CB) => {
  try {

    setDoc(doc(db, PARENT_COLLECTION_NAME, values?._id), { ...values});
    console.log('Category added successfully');
    CB && CB(values)
  } catch (error) {
    console.error('Error saving category:', error);
  }
};

export const fetchCategories = async () => {
  const categoriesCollectionRef = collection(db, PARENT_COLLECTION_NAME); 
  const categorySnapshot = await getDocs(categoriesCollectionRef);
  

  const categoryList = categorySnapshot.docs.map(doc => ({
    ...doc.data(),
    _id: doc.id 
  }));

  return categoryList;
};

export const deleteCategory = async (categoryId) => {
  try {
    if (!categoryId) {
      console.error('Error: categoryId is undefined or invalid.');
      return;
    }
    console.log(`Attempting to delete category with ID: ${categoryId}`);

    const categoryDocRef = doc(db, PARENT_COLLECTION_NAME, categoryId);
    await deleteDoc(categoryDocRef);
    console.log('Category deleted successfully');
  } catch (error) {
    console.error('Error deleting category:', error);
  }
};

 
export const Update = async (categoryId, updatedData) => {
  try {
    const categoryRef = doc(db, PARENT_COLLECTION_NAME, categoryId); 
    await updateDoc(categoryRef, updatedData); 
    console.log('Category updated successfully');
  } catch (error) {
    console.error('Error updating category:', error);
    throw error; 
  }
};