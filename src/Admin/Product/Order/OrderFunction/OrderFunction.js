import { getDocs, collection } from "firebase/firestore";
import { db } from "../../../Firebase/firebaseConfig";


export const fetchOrders = async () => {
  try {
    const bookingsCollection = collection(db, 'bookings');
    const snapshot = await getDocs(bookingsCollection);
    const orders = snapshot.docs.map(doc => ({
      ...doc.data(), 
      orderId: doc.id,
    }));

    console.log('Fetched orders:', orders);
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};