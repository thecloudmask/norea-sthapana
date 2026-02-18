import { ref } from 'vue'
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  getDocs,
  orderBy
} from 'firebase/firestore'

import { db } from '~/utils/firebase'
import { useKhrRate } from '~/composables/useKhrRate'

export interface Project {
  id?: string
  title: string
  description: string
  goalAmount: number
  currentAmount: number // This is totalIncomeUsd
  totalExpensesUsd?: number
  startDate: Date | any
  deadline?: Date | any
  status: 'draft' | 'planning' | 'active' | 'paused' | 'completed' | 'cancelled'
  qrCodeUrl: string
  bannerUrl: string
  gallery?: string[]
  location?: string
  updates?: ProjectUpdate[]
  createdAt?: any
}

export interface ProjectUpdate {
  id?: string
  date: Date | any
  title: string
  description: string
  imageUrl?: string
  createdAt?: any
}

export const useProjects = () => {
  const { khrRate } = useKhrRate()
  const projects = ref<Project[]>([])
  const donations = ref<any[]>([])
  const expenses = ref<any[]>([])
  const updates = ref<any[]>([])
  const loading = ref(false)

  const fetchProjects = () => {
    loading.value = true
    const q = query(collection(db, 'projects'))

    return onSnapshot(q, (snapshot) => {
      projects.value = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as Project[]
      loading.value = false
    }, (error) => {
      console.error('[useProjects] Error fetching projects:', error)
      loading.value = false
    })
  }

  const createProject = async (project: Omit<Project, 'id'>) => {
    return await addDoc(collection(db, 'projects'), {
      ...project,
      currentAmount: 0,
      totalExpensesUsd: 0,
      createdAt: Timestamp.now()
    })
  }

  const getProject = async (id: string) => {
    const docRef = doc(db, 'projects', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Project
    }
    return null
  }

  const fetchDonations = (projectId: string) => {
    const q = query(collection(db, 'projects', projectId, 'donations'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snapshot) => {
      donations.value = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }))
    })
  }

  const fetchUpdates = (projectId: string) => {
    const q = query(collection(db, 'projects', projectId, 'updates'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snapshot) => {
      updates.value = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }))
    })
  }

  const addUpdate = async (projectId: string, update: any) => {
    return await addDoc(collection(db, 'projects', projectId, 'updates'), {
      ...update,
      createdAt: Timestamp.now()
    })
  }

  const updateUpdate = async (projectId: string, updateId: string, data: any) => {
    return await updateDoc(
      doc(db, 'projects', projectId, 'updates', updateId),
      data
    )
  }

  const deleteUpdate = async (projectId: string, updateId: string) => {
    return await deleteDoc(doc(db, 'projects', projectId, 'updates', updateId))
  }

  const recalculateProjectProgress = async (projectId: string) => {
    // 1. Sum Donations
    const donSnap = await getDocs(query(collection(db, 'projects', projectId, 'donations')))
    let totalIncomeUsd = 0
    donSnap.forEach((d) => {
      const data = d.data()
      const amount = Number(data.amount) || 0
      totalIncomeUsd += data.currency === 'KHR' ? amount / khrRate.value : amount
    })

    // 2. Sum Expenses
    const expSnap = await getDocs(query(collection(db, 'projects', projectId, 'expenses')))
    let totalExpUsd = 0
    expSnap.forEach((d) => {
      const data = d.data()
      const amount = Number(data.amount) || 0
      totalExpUsd += data.currency === 'KHR' ? amount / khrRate.value : amount
    })

    const projectRef = doc(db, 'projects', projectId)
    const projectSnap = await getDoc(projectRef)

    if (projectSnap.exists()) {
      const currentIncome = projectSnap.data().currentAmount || 0
      const currentExp = projectSnap.data().totalExpensesUsd || 0

      const updateData: any = {}
      if (Math.abs(currentIncome - totalIncomeUsd) > 0.01) {
        updateData.currentAmount = totalIncomeUsd
      }
      if (Math.abs(currentExp - totalExpUsd) > 0.01) {
        updateData.totalExpensesUsd = totalExpUsd
      }

      if (Object.keys(updateData).length > 0) {
        await updateDoc(projectRef, updateData)
      }
    }
  }

  const addDonation = async (projectId: string, donation: any) => {
    const donationRef = await addDoc(collection(db, 'projects', projectId, 'donations'), {
      ...donation,
      createdAt: Timestamp.now()
    })
    await recalculateProjectProgress(projectId)
    return donationRef
  }

  const fetchExpenses = (projectId: string) => {
    const q = query(collection(db, 'projects', projectId, 'expenses'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snapshot) => {
      expenses.value = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }))
    })
  }

  const addExpense = async (projectId: string, expense: any) => {
    const expenseRef = await addDoc(collection(db, 'projects', projectId, 'expenses'), {
      ...expense,
      createdAt: Timestamp.now()
    })
    await recalculateProjectProgress(projectId)
    return expenseRef
  }

  const updateDonation = async (projectId: string, donationId: string, data: any) => {
    await updateDoc(
      doc(db, 'projects', projectId, 'donations', donationId),
      data
    )
    await recalculateProjectProgress(projectId)
  }

  const deleteDonation = async (projectId: string, donationId: string) => {
    await deleteDoc(
      doc(db, 'projects', projectId, 'donations', donationId)
    )
    await recalculateProjectProgress(projectId)
  }

  const updateExpense = async (projectId: string, expenseId: string, data: any) => {
    await updateDoc(
      doc(db, 'projects', projectId, 'expenses', expenseId),
      data
    )
    await recalculateProjectProgress(projectId)
  }

  const deleteExpense = async (projectId: string, expenseId: string) => {
    await deleteDoc(
      doc(db, 'projects', projectId, 'expenses', expenseId)
    )
    await recalculateProjectProgress(projectId)
  }

  const updateProject = async (id: string, data: Partial<Project>) => {
    const docRef = doc(db, 'projects', id)
    return await updateDoc(docRef, data)
  }

  const deleteProject = async (id: string) => {
    const docRef = doc(db, 'projects', id)
    return await deleteDoc(docRef)
  }

  return {
    projects,
    donations,
    expenses,
    updates,
    loading,
    fetchProjects,
    createProject,
    getProject,
    updateProject,
    deleteProject,
    fetchDonations,
    addDonation,
    updateDonation,
    deleteDonation,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    fetchUpdates,
    addUpdate,
    updateUpdate,
    deleteUpdate,
    recalculateProjectProgress
  }
}
