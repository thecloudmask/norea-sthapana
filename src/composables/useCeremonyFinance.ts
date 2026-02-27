import { ref, computed } from 'vue'
import { db } from '@/services/firebase'
import { 
  collection, 
  onSnapshot, 
  query, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  where,
  type Unsubscribe 
} from 'firebase/firestore'
import type { 
  CeremonyIncome, 
  CeremonyExpense, 
  CeremonyFinanceSummary,
  IncomeFormData,
  ExpenseFormData
} from '~/types/ceremonyFinance'

export function useCeremonyFinance() {
  const incomes = ref<CeremonyIncome[]>([])
  const expenses = ref<CeremonyExpense[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const mapIncome = (id: string, item: any): CeremonyIncome => ({
    ...item,
    id,
    ceremonyId: item.ceremonyId || item.ceremony_id,
    ceremony_id: item.ceremonyId || item.ceremony_id,
    donorName: item.donorName || item.donor_name,
    donor_name: item.donorName || item.donor_name,
    donorPhone: item.donorPhone || item.donor_phone,
    donor_phone: item.donorPhone || item.donor_phone,
    receiptNumber: item.receiptNumber || item.receipt_number,
    receipt_number: item.receiptNumber || item.receipt_number,
    paymentMethod: item.paymentMethod || item.payment_method,
    payment_method: item.paymentMethod || item.payment_method,
    createdAt: item.createdAt || item.created_at,
    created_at: item.createdAt || item.created_at,
    updatedAt: item.updatedAt || item.updated_at,
    updated_at: item.updatedAt || item.updated_at
  })

  const mapExpense = (id: string, item: any): CeremonyExpense => ({
    ...item,
    id,
    ceremonyId: item.ceremonyId || item.ceremony_id,
    ceremony_id: item.ceremonyId || item.ceremony_id,
    title: item.title || item.itemName || item.item_name,
    itemName: item.itemName || item.item_name || item.title,
    item_name: item.item_name || item.itemName || item.title,
    expenseNumber: item.expenseNumber || item.expense_number,
    expense_number: item.expense_number || item.expenseNumber,
    receiptUrl: item.receiptUrl || item.receipt_url,
    receipt_url: item.receipt_url || item.receiptUrl,
    paidBy: item.paidBy || item.paid_by,
    paid_by: item.paid_by || item.paidBy,
    paidDate: item.paidDate || item.paid_date,
    paid_date: item.paid_date || item.paidDate,
    unitPrice: item.unitPrice || item.unit_price,
    unit_price: item.unitPrice || item.unit_price,
    createdAt: item.createdAt || item.created_at,
    created_at: item.createdAt || item.created_at,
    updatedAt: item.updatedAt || item.updated_at,
    updated_at: item.updatedAt || item.updated_at
  })

  // ==================== INCOME METHODS ====================

  const fetchIncomes = (ceremonyId: string): Unsubscribe => {
    loading.value = true
    const q = query(
      collection(db, 'ceremonyIncomes'), 
      where('ceremonyId', '==', ceremonyId)
    )
    
    return onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map(doc => mapIncome(doc.id, doc.data()))
      incomes.value = results.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0)
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0)
        return dateB.getTime() - dateA.getTime()
      })
      loading.value = false
    }, (err) => {
      console.error('Error fetching incomes:', err)
      error.value = err.message
      loading.value = false
    })
  }

  const fetchAllIncomes = (): Unsubscribe => {
    loading.value = true
    const q = query(collection(db, 'ceremonyIncomes'))
    
    return onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map(doc => mapIncome(doc.id, doc.data()))
      incomes.value = results.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0)
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0)
        return dateB.getTime() - dateA.getTime()
      })
      loading.value = false
    }, (err) => {
      console.error('Error fetching all incomes:', err)
      error.value = err.message
      loading.value = false
    })
  }

  const addIncome = async (ceremonyId: string, data: IncomeFormData) => {
    try {
      loading.value = true
      error.value = null
      
      const payload = {
        ...data,
        ceremonyId: ceremonyId,
        receiptNumber: `INC-${Date.now()}`,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      const docRef = await addDoc(collection(db, 'ceremonyIncomes'), payload)
      return { success: true, id: docRef.id }
    } catch (err: any) {
      console.error('Error adding income:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const updateIncome = async (incomeId: string, data: Partial<IncomeFormData>) => {
    try {
      loading.value = true
      error.value = null
      const docRef = doc(db, 'ceremonyIncomes', incomeId)
      await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() })
      return { success: true }
    } catch (err: any) {
      console.error('Error updating income:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const deleteIncome = async (incomeId: string) => {
    try {
      loading.value = true
      error.value = null
      await deleteDoc(doc(db, 'ceremonyIncomes', incomeId))
      return { success: true }
    } catch (err: any) {
      console.error('Error deleting income:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // ==================== EXPENSE METHODS ====================

  const fetchExpenses = (ceremonyId: string): Unsubscribe => {
    loading.value = true
    const q = query(
      collection(db, 'ceremonyExpenses'), 
      where('ceremonyId', '==', ceremonyId)
    )
    
    return onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map(doc => mapExpense(doc.id, doc.data()))
      expenses.value = results.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0)
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0)
        return dateB.getTime() - dateA.getTime()
      })
      loading.value = false
    }, (err) => {
      console.error('Error fetching expenses:', err)
      error.value = err.message
      loading.value = false
    })
  }

  const fetchAllExpenses = (): Unsubscribe => {
    loading.value = true
    const q = query(collection(db, 'ceremonyExpenses'))
    
    return onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map(doc => mapExpense(doc.id, doc.data()))
      expenses.value = results.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0)
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0)
        return dateB.getTime() - dateA.getTime()
      })
      loading.value = false
    }, (err) => {
      console.error('Error fetching all expenses:', err)
      error.value = err.message
      loading.value = false
    })
  }

  const addExpense = async (ceremonyId: string, data: ExpenseFormData) => {
    try {
      loading.value = true
      error.value = null
      
      const payload = {
        ...data,
        ceremonyId: ceremonyId,
        expenseNumber: `EXP-${Date.now()}`,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      const docRef = await addDoc(collection(db, 'ceremonyExpenses'), payload)
      return { success: true, id: docRef.id }
    } catch (err: any) {
      console.error('Error adding expense:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const updateExpense = async (expenseId: string, data: Partial<ExpenseFormData>) => {
    try {
      loading.value = true
      error.value = null
      const docRef = doc(db, 'ceremonyExpenses', expenseId)
      await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() })
      return { success: true }
    } catch (err: any) {
      console.error('Error updating expense:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const deleteExpense = async (expenseId: string) => {
    try {
      loading.value = true
      error.value = null
      await deleteDoc(doc(db, 'ceremonyExpenses', expenseId))
      return { success: true }
    } catch (err: any) {
      console.error('Error deleting expense:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // ==================== COMPUTED SUMMARY ====================

  const summary = computed<CeremonyFinanceSummary>(() => {
    const inventory: Record<string, { donatedQuantity: number, purchasedQuantity: number, totalQuantity: number }> = {}

    const totalIncome = incomes.value.reduce(
      (acc, income) => {
        if (income.currency === 'USD') {
          acc.usd += Number(income.amount || 0)
        } else {
          acc.khr += Number(income.amount || 0)
        }
        
        // Calculate donated inventory
        if (income.items && income.items.length > 0) {
          income.items.forEach(item => {
             const lowerName = item.name.trim()
             if (!inventory[lowerName]) {
                 inventory[lowerName] = { donatedQuantity: 0, purchasedQuantity: 0, totalQuantity: 0 }
             }
             inventory[lowerName].donatedQuantity += Number(item.quantity || 0)
             inventory[lowerName].totalQuantity += Number(item.quantity || 0)
          })
        }
        
        return acc
      },
      { usd: 0, khr: 0 }
    )
    
    const totalExpense = expenses.value.reduce(
      (acc, expense) => {
        if (expense.currency === 'USD') {
          acc.usd += Number(expense.amount || 0)
        } else {
          acc.khr += Number(expense.amount || 0)
        }
        
        // Calculate purchased inventory
        if (expense.isInventoryPurchase && expense.itemName && expense.quantity) {
             const lowerName = expense.itemName.trim()
             if (!inventory[lowerName]) {
                 inventory[lowerName] = { donatedQuantity: 0, purchasedQuantity: 0, totalQuantity: 0 }
             }
             inventory[lowerName].purchasedQuantity += Number(expense.quantity || 0)
             inventory[lowerName].totalQuantity += Number(expense.quantity || 0)
        }
        
        return acc
      },
      { usd: 0, khr: 0 }
    )
    
    return {
      totalIncome,
      totalExpense,
      balance: {
        usd: totalIncome.usd - totalExpense.usd,
        khr: totalIncome.khr - totalExpense.khr
      },
      incomeCount: incomes.value.length,
      expenseCount: expenses.value.length,
      inventory
    }
  })

  return {
    incomes,
    expenses,
    loading,
    error,
    summary,
    fetchIncomes,
    addIncome,
    updateIncome,
    deleteIncome,
    fetchExpenses,
    fetchAllExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    fetchAllIncomes,
    checkDuplicateIncomesLocal: (
      existingIncomes: CeremonyIncome[],
      name: string,
      amount: number,
      currency: string
    ) => {
      const similarRecords = existingIncomes.filter(income => {
        const nameMatch = income.donorName.toLowerCase().trim() === name.toLowerCase().trim()
        const amountMatch = Number(income.amount) === Number(amount)
        const currencyMatch = income.currency === currency
        return nameMatch && amountMatch && currencyMatch
      })

      return {
        isDuplicate: similarRecords.length > 0,
        similarRecords,
        confidence: similarRecords.length > 0 ? 'high' : 'low'
      } as any
    }
  }
}
