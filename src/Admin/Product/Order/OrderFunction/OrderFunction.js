// src/services/orderService.js

import { db } from '../../../Firebase/firebaseConfig'; 
import { collection, getDocs } from 'firebase/firestore';

export const fetchOrders = async () => {
    try {
        const ordersCollection = collection(db, 'bookings');
        const orderSnapshot = await getDocs(ordersCollection);
        const ordersList = orderSnapshot.docs.map(doc => ({
            orderId: doc.id,
            ...doc.data(),
        }));
        return ordersList; 
    } catch (error) {
        console.error('Error fetching orders: ', error);
        throw error; 
    }
};
