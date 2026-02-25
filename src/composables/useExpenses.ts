import { ref } from 'vue'
import { db } from '@/services/firebase'
import { collection, query, onSnapshot, addDoc, getDocs, serverTimestamp, type Unsubscribe } from 'firebase/firestore'

export interface Expense {
  id?: string
  projectId?: string
  ceremonyId?: string
  title: string
  itemName?: string // For compatibility
  amount: number
  currency: 'USD' | 'KHR'
  category: string
  vendor?: string
  quantity?: number
  unitPrice?: number
  paidBy?: string
  paidDate?: string
  expenseNumber?: string
  receiptUrl?: string
  createdAt?: any
}

export const useExpenses = () => {
  const expenses = ref<Expense[]>([])
  const loading = ref(false)

  const mapExpense = (id: string, item: any): Expense => ({
    ...item,
    id,
    projectId: item.projectId || item.project_id,
    project_id: item.projectId || item.project_id,
    ceremonyId: item.ceremonyId || item.ceremony_id,
    ceremony_id: item.ceremonyId || item.ceremony_id,
    title: item.title || item.item_name || item.itemName,
    itemName: item.itemName || item.item_name || item.title,
    item_name: item.item_name || item.itemName || item.title,
    receiptUrl: item.receiptUrl || item.receipt_url,
    receipt_url: item.receipt_url || item.receiptUrl,
    paidBy: item.paidBy || item.paid_by,
    paid_by: item.paid_by || item.paidBy,
    paidDate: item.paidDate || item.paid_date,
    paid_date: item.paid_date || item.paidDate,
    expenseNumber: item.expenseNumber || item.expense_number,
    expense_number: item.expense_number || item.expenseNumber,
    createdAt: item.createdAt || item.created_at,
    created_at: item.createdAt || item.created_at
  })

  const fetchAllExpenses = (): Unsubscribe => {
    loading.value = true
    
    let docsA: any[] = []   // root 'expenses' collection
    let docsB: any[] = []   // root 'ceremonyExpenses' collection
    let docsC: any[] = []   // project subcollections merged
    const subUnsubs: (() => void)[] = []

    const updateUnifiedResults = () => {
      const combined = [...docsA, ...docsB, ...docsC]
      // Deduplicate by id
      const unique = Array.from(new Map(combined.map(e => [e.id, e])).values())
      expenses.value = unique.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt || 0))
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt || 0))
        const timeA = isNaN(dateA.getTime()) ? 0 : dateA.getTime()
        const timeB = isNaN(dateB.getTime()) ? 0 : dateB.getTime()
        return timeB - timeA
      })
      loading.value = false
    }

    const unsubA = onSnapshot(query(collection(db, 'expenses')), (snap) => {
      console.log(`[useExpenses] Received ${snap.size} docs from 'expenses'`)
      docsA = snap.docs.map(doc => mapExpense(doc.id, doc.data()))
      updateUnifiedResults()
    })

    const unsubB = onSnapshot(query(collection(db, 'ceremonyExpenses')), (snap) => {
      console.log(`[useExpenses] Received ${snap.size} docs from 'ceremonyExpenses'`)
      docsB = snap.docs.map(doc => mapExpense(doc.id, doc.data()))
      updateUnifiedResults()
    })

    // Also subscribe to project subcollections dynamically
    getDocs(collection(db, 'projects')).then(projectsSnap => {
      const subDocsByProject: Record<string, any[]> = {}
      projectsSnap.forEach(projectDoc => {
        const pId = projectDoc.id
        subDocsByProject[pId] = []
        const unsub = onSnapshot(collection(db, 'projects', pId, 'expenses'), (snap) => {
          if (snap.size > 0) {
            console.log(`[useExpenses] Received ${snap.size} docs from projects/${pId}/expenses`)
          }
          subDocsByProject[pId] = snap.docs.map(doc => mapExpense(doc.id, { ...doc.data(), projectId: pId }))
          docsC = Object.values(subDocsByProject).flat()
          updateUnifiedResults()
        })
        subUnsubs.push(unsub)
      })
    }).catch(err => console.error('[useExpenses] Error fetching project subcollections:', err))

    return () => {
      unsubA()
      unsubB()
      subUnsubs.forEach(u => u())
    }
  }

  const checkAltCollections = () => {
    onSnapshot(query(collection(db, 'payments')), (snap) => {
      console.log(`[DEBUG] Collection 'payments' has ${snap.size} docs`)
    })
  }

  const addExpense = async (
    projectId: string | null, 
    expenseData: Omit<Expense, 'id' | 'createdAt' | 'projectId'>,
    ceremonyId: string | null = null
  ) => {
    try {
      const data = {
        ...expenseData,
        projectId,
        ceremonyId,
        expenseNumber: expenseData.expenseNumber || `EXP-${Date.now()}`,
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'expenses'), data)
      return { id: docRef.id, ...data }
    } catch (e) {
      console.error('[useExpenses] Error adding expense:', e)
      throw e
    }
  }

  return { expenses, loading, fetchAllExpenses, addExpense, checkAltCollections }
}
