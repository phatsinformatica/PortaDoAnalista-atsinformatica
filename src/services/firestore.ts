import { 
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  getDocs,
  query,
  where,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Analyst, Support, Reason, Ticket } from '../types';

// Analysts
export const createAnalyst = (data: Analyst) => addDoc(collection(db, 'analysts'), data);
export const updateAnalyst = (id: string, data: Partial<Analyst>) => updateDoc(doc(db, 'analysts', id), data);
export const deleteAnalyst = (id: string) => deleteDoc(doc(db, 'analysts', id));
export const getAnalysts = () => getDocs(collection(db, 'analysts'));

// Supports
export const createSupport = (data: Support) => addDoc(collection(db, 'supports'), data);
export const updateSupport = (id: string, data: Partial<Support>) => updateDoc(doc(db, 'supports', id), data);
export const deleteSupport = (id: string) => deleteDoc(doc(db, 'supports', id));
export const getSupports = () => getDocs(collection(db, 'supports'));

// Reasons
export const createReason = (data: Reason) => addDoc(collection(db, 'reasons'), data);
export const updateReason = (id: string, data: Partial<Reason>) => updateDoc(doc(db, 'reasons', id), data);
export const deleteReason = (id: string) => deleteDoc(doc(db, 'reasons', id));
export const getReasons = () => getDocs(collection(db, 'reasons'));

// Tickets
export const createTicket = (data: Ticket) => addDoc(collection(db, 'tickets'), data);
export const updateTicket = (id: string, data: Partial<Ticket>) => updateDoc(doc(db, 'tickets', id), data);
export const deleteTicket = (id: string) => deleteDoc(doc(db, 'tickets', id));
export const getTickets = () => getDocs(collection(db, 'tickets'));

export const getTicketsByFilter = async (
  startDate?: string,
  endDate?: string,
  analystId?: string,
  supportId?: string
) => {
  let q = query(collection(db, 'tickets'));

  if (startDate && endDate) {
    q = query(q, where('date', '>=', startDate), where('date', '<=', endDate));
  }
  if (analystId) {
    q = query(q, where('analystId', '==', analystId));
  }
  if (supportId) {
    q = query(q, where('supportId', '==', supportId));
  }

  return getDocs(q);
};