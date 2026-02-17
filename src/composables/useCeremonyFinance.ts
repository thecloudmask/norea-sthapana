import { ref, computed } from 'vue'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  getDocs,
  Timestamp,
  limit
} from 'firebase/firestore'
import { db } from '~/utils/firebase'
import type { 
  CeremonyIncome, 
  CeremonyExpense, 
  CeremonyFinanceSummary,
  IncomeFormData,
  ExpenseFormData,
  DuplicateCheckResult
} from '~/types/ceremonyFinance'

export function useCeremonyFinance() {
  const incomes = ref<CeremonyIncome[]>([])
  const expenses = ref<CeremonyExpense[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Collections
  const incomesCollection = collection(db, 'ceremonyIncomes')
  const expensesCollection = collection(db, 'ceremonyExpenses')

  // ==================== INCOME METHODS ====================

  /**
   * Generate next receipt number for income
   * Format: INC-0001, INC-0002, etc.
   */
  const generateIncomeReceiptNumber = async (): Promise<string> => {
    try {
      const q = query(incomesCollection, orderBy('receiptNumber', 'desc'), limit(1))
      const snapshot = await getDocs(q)
      
      if (snapshot.empty) {
        return 'INC-0001'
      }
      
      const lastReceipt = snapshot.docs[0].data().receiptNumber as string
      const lastNumber = parseInt(lastReceipt.split('-')[1])
      const nextNumber = lastNumber + 1
      
      return `INC-${String(nextNumber).padStart(4, '0')}`
    } catch (err) {
      console.error('Error generating receipt number:', err)
      return 'INC-0001'
    }
  }

  const normalize = (str: string) => str.toLowerCase().replace(/[\s\u200b\u200c\u200d\ufeff]+/g, '').trim()

  /**
   * Check for potential duplicate incomes (Client-side)
   * ពិនិត្យការបញ្ចូលស្ទួន (លើទិន្នន័យដែលមានស្រាប់)
   */
  const checkDuplicateIncomesLocal = (
    existingIncomes: CeremonyIncome[],
    donorName: string,
    amount: number,
    currency: string
  ): DuplicateCheckResult => {
    try {
      if (!donorName || !amount) {
        return { isDuplicate: false, similarRecords: [], confidence: 'low' }
      }

      const yesterday = new Date()
      yesterday.setHours(yesterday.getHours() - 24)

      const duplicates = existingIncomes.filter(income => {
        // Check date (within last 24h)
        let matchesDate = true
        if (income.createdAt) {
          const createdDate = (income.createdAt as any).toDate ? (income.createdAt as any).toDate() : new Date(income.createdAt)
          matchesDate = createdDate >= yesterday
        }
        
        const nameMatch = normalize(income.donorName) === normalize(donorName)
        const amountMatch = income.amount === amount
        const currencyMatch = income.currency === currency
          
        return matchesDate && nameMatch && amountMatch && currencyMatch
      })

      return {
        isDuplicate: duplicates.length > 0,
        similarRecords: duplicates,
        confidence: duplicates.length > 0 ? 'high' : 'low'
      }
    } catch (err) {
      console.error('Error checking duplicates local:', err)
      return { isDuplicate: false, similarRecords: [], confidence: 'low' }
    }
  }

  /**
   * Check for potential duplicate incomes (Server-side)
   * ពិនិត្យការបញ្ចូលស្ទួន
   */
  const checkDuplicateIncome = async (
    ceremonyId: string,
    donorName: string,
    amount: number,
    currency: string
  ): Promise<DuplicateCheckResult> => {
    try {
      // Check within last 24 hours
      const yesterday = new Date()
      yesterday.setHours(yesterday.getHours() - 24)
      
      const q = query(
        incomesCollection,
        where('ceremonyId', '==', ceremonyId)
      )
      
      const snapshot = await getDocs(q)
      
      const duplicates = snapshot.docs
        .map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : undefined
          } as CeremonyIncome
        })
        .filter(income => {
          // Check date (client-side filter)
          let matchesDate = true
          if (income.createdAt) {
            const createdDate = (income.createdAt as any).toDate ? (income.createdAt as any).toDate() : new Date(income.createdAt)
            matchesDate = createdDate >= yesterday
          }

          const nameMatch = normalize(income.donorName) === normalize(donorName)
          const amountMatch = income.amount === amount
          const currencyMatch = income.currency === currency
          
          return matchesDate && nameMatch && amountMatch && currencyMatch
        })
      
      return {
        isDuplicate: duplicates.length > 0,
        similarRecords: duplicates,
        confidence: duplicates.length > 0 ? 'high' : 'low'
      }
    } catch (err) {
      console.error('Error checking duplicates:', err)
      return { isDuplicate: false, similarRecords: [], confidence: 'low' }
    }
  }

  /**
   * Fetch incomes for a ceremony (real-time)
   * ទាញយកចំណូលតាម Ceremony
   */
  const fetchIncomes = (ceremonyId: string) => {
    loading.value = true
    error.value = null
    
    const q = query(
      collection(db, 'ceremonyIncomes'), 
      where('ceremonyId', '==', ceremonyId),
      // orderBy('createdAt', 'desc')
    )
    
    const toDate = (t: any) => t?.toDate ? t.toDate() : new Date(t || Date.now())

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        incomes.value = snapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            createdAt: toDate(data.createdAt),
            updatedAt: data.updatedAt ? toDate(data.updatedAt) : undefined,
            paidDate: data.paidDate ? toDate(data.paidDate) : undefined
          } as unknown as CeremonyIncome
        })
        
        loading.value = false
      },
      (err) => {
        console.error('Error fetching incomes:', err)
        error.value = err.message
        loading.value = false
      }
    )
    
    return unsubscribe
  }

  const fetchAllIncomes = async () => {
    loading.value = true
    try {
      const q = query(incomesCollection)
      const snapshot = await getDocs(q)
      incomes.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CeremonyIncome[]
    } catch (err: any) {
      console.error('Error fetching all incomes:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  /**
   * Add new income
   * បន្ថែមចំណូលថ្មី
   */
  const addIncome = async (ceremonyId: string, data: IncomeFormData, userId: string) => {
    try {
      loading.value = true
      error.value = null
      
      const receiptNumber = await generateIncomeReceiptNumber()
      
      const incomeData = {
        ...data,
        ceremonyId,
        receiptNumber,
        createdAt: Timestamp.now(),
        createdBy: userId
      }
      
      await addDoc(incomesCollection, incomeData)
      
      return { success: true, receiptNumber }
    } catch (err: any) {
      console.error('Error adding income:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Update income
   * កែប្រែចំណូល
   */
  const updateIncome = async (incomeId: string, data: Partial<IncomeFormData>, userId: string) => {
    try {
      loading.value = true
      error.value = null
      
      const incomeRef = doc(db, 'ceremonyIncomes', incomeId)
      await updateDoc(incomeRef, {
        ...data,
        updatedAt: Timestamp.now(),
        updatedBy: userId
      })
      
      return { success: true }
    } catch (err: any) {
      console.error('Error updating income:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete income
   * លុបចំណូល
   */
  const deleteIncome = async (incomeId: string) => {
    try {
      loading.value = true
      error.value = null
      
      const incomeRef = doc(db, 'ceremonyIncomes', incomeId)
      await deleteDoc(incomeRef)
      
      return { success: true }
    } catch (err: any) {
      console.error('Error deleting income:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Search incomes by donor name or phone
   * ស្វែងរកតាមឈ្មោះ ឬ លេខទូរស័ព្ទ
   */
  const searchIncomes = (ceremonyId: string, searchTerm: string) => {
    const normalized = searchTerm.toLowerCase().trim()
    
    return incomes.value.filter(income => {
      if (income.ceremonyId !== ceremonyId) return false
      
      const nameMatch = income.donorName.toLowerCase().includes(normalized)
      const phoneMatch = income.donorPhone?.includes(normalized) || false
      const receiptMatch = income.receiptNumber.toLowerCase().includes(normalized)
      
      return nameMatch || phoneMatch || receiptMatch
    })
  }

  // ==================== EXPENSE METHODS ====================

  /**
   * Generate next expense number
   * Format: EXP-0001, EXP-0002, etc.
   */
  const generateExpenseNumber = async (): Promise<string> => {
    try {
      const q = query(expensesCollection, orderBy('expenseNumber', 'desc'), limit(1))
      const snapshot = await getDocs(q)
      
      if (snapshot.empty) {
        return 'EXP-0001'
      }
      
      const lastExpense = snapshot.docs[0].data().expenseNumber as string
      const lastNumber = parseInt(lastExpense.split('-')[1])
      const nextNumber = lastNumber + 1
      
      return `EXP-${String(nextNumber).padStart(4, '0')}`
    } catch (err) {
      console.error('Error generating expense number:', err)
      return 'EXP-0001'
    }
  }

  /**
   * Fetch expenses for a ceremony (real-time)
   * ទាញយកចំណាយតាម Ceremony
   */
  const fetchExpenses = (ceremonyId: string) => {
    loading.value = true
    error.value = null
    
    const q = query(
      expensesCollection,
      where('ceremonyId', '==', ceremonyId),
      // orderBy('createdAt', 'desc')
    )
    
    const toDate = (t: any) => t?.toDate ? t.toDate() : new Date(t || Date.now())

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        expenses.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: toDate(doc.data().createdAt),
          updatedAt: doc.data().updatedAt ? toDate(doc.data().updatedAt) : undefined,
          paidDate: doc.data().paidDate ? toDate(doc.data().paidDate) : undefined
        })) as CeremonyExpense[]
        
        loading.value = false
      },

      (err) => {
        console.error('Error fetching expenses:', err)
        error.value = err.message
        loading.value = false
      }
    )
    
    return unsubscribe
  }

  const fetchAllExpenses = async () => {
    loading.value = true
    try {
      const q = query(expensesCollection)
      const snapshot = await getDocs(q)
      expenses.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CeremonyExpense[]
    } catch (err: any) {
      console.error('Error fetching all expenses:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  /**
   * Add new expense
   * បន្ថែមចំណាយថ្មី
   */
  const addExpense = async (ceremonyId: string, data: ExpenseFormData, userId: string) => {
    try {
      loading.value = true
      error.value = null
      
      const expenseNumber = await generateExpenseNumber()
      
      const expenseData = {
        ...data,
        ceremonyId,
        expenseNumber,
        createdAt: Timestamp.now(),
        createdBy: userId,
        paidDate: data.paidDate ? Timestamp.fromDate(data.paidDate) : null
      }
      
      await addDoc(expensesCollection, expenseData)
      
      return { success: true, expenseNumber }
    } catch (err: any) {
      console.error('Error adding expense:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Update expense
   * កែប្រែចំណាយ
   */
  const updateExpense = async (expenseId: string, data: Partial<ExpenseFormData>, userId: string) => {
    try {
      loading.value = true
      error.value = null
      
      const expenseRef = doc(db, 'ceremonyExpenses', expenseId)
      const updateData: any = {
        ...data,
        updatedAt: Timestamp.now(),
        updatedBy: userId
      }
      
      if (data.paidDate) {
        updateData.paidDate = Timestamp.fromDate(data.paidDate)
      }
      
      await updateDoc(expenseRef, updateData)
      
      return { success: true }
    } catch (err: any) {
      console.error('Error updating expense:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete expense
   * លុបចំណាយ
   */
  const deleteExpense = async (expenseId: string) => {
    try {
      loading.value = true
      error.value = null
      
      const expenseRef = doc(db, 'ceremonyExpenses', expenseId)
      await deleteDoc(expenseRef)
      
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

  /**
   * Calculate financial summary
   * គណនាសង្ខេបហិរញ្ញវត្ថុ
   */
  const summary = computed<CeremonyFinanceSummary>(() => {
    const totalIncome = incomes.value.reduce(
      (acc, income) => {
        if (income.currency === 'USD') {
          acc.usd += income.amount
        } else {
          acc.khr += income.amount
        }
        return acc
      },
      { usd: 0, khr: 0 }
    )
    
    const totalExpense = expenses.value.reduce(
      (acc, expense) => {
        if (expense.currency === 'USD') {
          acc.usd += expense.amount
        } else {
          acc.khr += expense.amount
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
      expenseCount: expenses.value.length
    }
  })

  return {
    // State
    incomes,
    expenses,
    loading,
    error,
    summary,
    
    // Income methods
    fetchIncomes,
    addIncome,
    updateIncome,
    deleteIncome,
    searchIncomes,
    checkDuplicateIncome,
    checkDuplicateIncomesLocal,
    
    // Expense methods
    fetchExpenses,
    fetchAllExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    
    // Global fetch
    fetchAllIncomes
  }
}
