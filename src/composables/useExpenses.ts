import {
  collectionGroup,
  getDocs,
  query,
  addDoc,
  collection,
  serverTimestamp
} from 'firebase/firestore'

import { db } from '~/utils/firebase'
import { ref } from 'vue'

export interface Expense {
  id?: string
  projectId?: string
  title: string
  amount: number
  currency: 'USD' | 'KHR'
  category: 'material' | 'labor' | 'utility' | 'other'
  payeeName: string
  receiptUrl?: string
  createdAt?: any
}

export const useExpenses = () => {
  const expenses = ref<Expense[]>([])
  const loading = ref(false)

  const fetchAllExpenses = async () => {
    loading.value = true
    try {
      const q = query(collectionGroup(db, 'expenses'))
      const snapshot = await getDocs(q)
      const raw = snapshot.docs.map(d => ({
        id: d.id,
        projectId: d.ref.parent.parent?.id,
        ...d.data()
      })) as Expense[]
      
      expenses.value = raw.sort((a: any, b: any) => {
          const da = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0)
          const db = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0)
          return db - da
      })
    } catch (e) {
      console.error('Error fetching expenses:', e)
    } finally {
      loading.value = false
    }
  }

  const addExpense = async (projectId: string, expenseData: Omit<Expense, 'id' | 'createdAt' | 'projectId'>) => {
    try {
      // Just add the document
      await addDoc(collection(db, 'projects', projectId, 'expenses'), {
        ...expenseData,
        createdAt: serverTimestamp()
      })
      // Optionally update project totals if structure supports it
    } catch (e) {
      console.error('Error adding expense:', e)
      throw e
    }
  }

  return { expenses, loading, fetchAllExpenses, addExpense }
}
