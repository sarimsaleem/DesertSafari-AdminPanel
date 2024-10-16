import { collection, setDoc, updateDoc, deleteDoc, getDocs, doc } from 'firebase/firestore';
import { db } from "../../../Firebase/firebaseConfig";

const faqCollectionRef = collection(db, 'faqs');

// Function to add a new FAQ
export const addFAQ = async (faq) => {
    try {
        // Create a new document reference without specifying an ID
        const faqDocRef = doc(faqCollectionRef); // Firestore will generate a random ID

        await setDoc(faqDocRef, { ...faq, id: faqDocRef.id }); // Store the generated ID with the document

        return { id: faqDocRef.id, ...faq }; // Return the generated ID
    } catch (error) {
        console.error('Error adding FAQ:', error);
        throw error;
    }
};

// Function to update an FAQ
export const updateFAQs = async (faq) => {
    const { id, ...data } = faq; // Ensure `faq` contains an `id` for the document
    try {
        const faqDocRef = doc(db, 'faqs', id); // Get the document reference using the Firestore ID
        await updateDoc(faqDocRef, data); // Update the document with new data
        console.log("FAQ updated successfully");
    } catch (error) {
        console.error("Error updating FAQ:", error);
        throw error; // Propagate error for handling
    }
};

// Function to delete an FAQ
export const deleteFAQs = async (id) => {
    try {
        const docRef = doc(db, 'faqs', id); // Use the Firestore document ID

        await deleteDoc(docRef);
        console.log(`Document with ID ${id} deleted successfully`);
    } catch (error) {
        console.error("Error deleting document:", error);
        throw error;
    }
};

// Function to fetch all FAQs
export const fetchFAQs = async () => {
    try {
        const faqSnapshot = await getDocs(faqCollectionRef);
        const faqList = faqSnapshot.docs.map((doc) => ({
            id: doc.id,  // Use Firestore document ID
            ...doc.data(),
        }));
        return faqList; 
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        throw error;
    }
};
