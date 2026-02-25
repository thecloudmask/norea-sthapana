import { ref } from 'vue'
import { db } from '@/services/firebase'
import { 
  collection, 
  onSnapshot, 
  query, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  where,
  getDocs,
  type Unsubscribe 
} from 'firebase/firestore'

export interface Project {
  id?: string
  title: string
  description: string
  goalAmount: number
  currentAmount: number
  totalExpensesUsd?: number
  startDate: any
  deadline?: any
  status: 'draft' | 'planning' | 'active' | 'paused' | 'completed' | 'cancelled'
  qrCodeUrl: string
  bannerUrl: string
  gallery?: string[]
  location?: string
  createdAt?: any
  
  // Backwards compatibility for Laravel naming
  goal_amount?: number
  current_amount?: number
  banner_url?: string
  qr_code_url?: string
  start_date?: any
  created_at?: any
}

export const useProjects = () => {
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const updates = ref<any[]>([])
  const donations = ref<any[]>([])
  const expenses = ref<any[]>([])

  const stripHtml = (html: string) => {
    if (!html) return ''
    return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')
  }

  const mapProject = (id: string, item: any): Project & { strippedDescription: string } => ({
    ...item,
    id,
    goalAmount: item.goalAmount || item.goal_amount,
    goal_amount: item.goal_amount || item.goalAmount,
    currentAmount: item.currentAmount || item.current_amount,
    current_amount: item.current_amount || item.currentAmount,
    bannerUrl: item.bannerUrl || item.banner_url,
    banner_url: item.banner_url || item.bannerUrl,
    qrCodeUrl: item.qrCodeUrl || item.qr_code_url,
    qr_code_url: item.qr_code_url || item.qrCodeUrl,
    startDate: item.startDate || item.start_date,
    start_date: item.start_date || item.startDate,
    createdAt: item.createdAt || item.created_at,
    created_at: item.created_at || item.createdAt,
    strippedDescription: stripHtml(item.description || '')
  })

  const mapDonation = (id: string, item: any) => ({
    ...item,
    id,
    projectId: item.projectId || item.project_id,
    project_id: item.project_id || item.projectId,
    donorName: item.donorName || item.donor_name,
    donor_name: item.donor_name || item.donorName,
    amount: Number(item.amount) || 0,
    createdAt: item.createdAt || item.created_at,
    created_at: item.created_at || item.createdAt
  })

  const mapExpense = (id: string, item: any) => ({
    ...item,
    id,
    projectId: item.projectId || item.project_id,
    project_id: item.project_id || item.projectId,
    title: item.title || item.itemName || item.item_name,
    itemName: item.itemName || item.item_name || item.title,
    item_name: item.item_name || item.itemName || item.title,
    amount: Number(item.amount) || 0,
    createdAt: item.createdAt || item.created_at,
    created_at: item.created_at || item.createdAt
  })

  const mapUpdate = (id: string, item: any) => ({
    ...item,
    id,
    projectId: item.projectId || item.project_id,
    project_id: item.project_id || item.projectId,
    createdAt: item.createdAt || item.created_at,
    created_at: item.created_at || item.createdAt
  })

  // --- Project Methods ---

  const fetchProjects = (): Unsubscribe => {
    loading.value = true
    const q = query(collection(db, 'projects'))
    
    return onSnapshot(q, (snapshot) => {
      console.log(`[useProjects] Received ${snapshot.size} projects`)
      const results = snapshot.docs.map(doc => mapProject(doc.id, doc.data()))
      projects.value = results.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0)
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0)
        return dateB.getTime() - dateA.getTime()
      })
      loading.value = false
    }, (error) => {
      console.error('[useProjects] Error fetching projects:', error)
      loading.value = false
    })
  }

  const createProject = async (project: Omit<Project, 'id' | 'createdAt'>) => {
    try {
      const data = {
        ...project,
        createdAt: serverTimestamp()
      }
      const docRef = await addDoc(collection(db, 'projects'), data)
      return { id: docRef.id, ...data }
    } catch (error) {
      console.error('[useProjects] Error creating project:', error)
      throw error
    }
  }

  const getProject = async (id: string) => {
    try {
      const docRef = doc(db, 'projects', id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return mapProject(docSnap.id, docSnap.data())
      }
      return null
    } catch (error) {
      console.error('[useProjects] Error getting project:', error)
      return null
    }
  }

  const updateProject = async (id: string, project: Partial<Project>) => {
    try {
      const docRef = doc(db, 'projects', id)
      await updateDoc(docRef, { ...project })
    } catch (error) {
      console.error('[useProjects] Error updating project:', error)
      throw error
    }
  }

  const deleteProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id))
    } catch (error) {
      console.error('[useProjects] Error deleting project:', error)
      throw error
    }
  }

  // --- Sub-collection / Root-collection methods ---
  // Using root collections with projectId for consistency with useDonations/useExpenses

  const fetchDonations = (projectId: string): Unsubscribe => {
    loading.value = true
    let rootDocs: any[] = []
    let subDocs: any[] = []

    const updateUnified = () => {
      const combined = [...rootDocs, ...subDocs]
      const unique = Array.from(new Map(combined.map(d => [d.id, d])).values())
      
      donations.value = unique.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt || 0))
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt || 0))
        const timeA = isNaN(new Date(dateA).getTime()) ? 0 : new Date(dateA).getTime()
        const timeB = isNaN(new Date(dateB).getTime()) ? 0 : new Date(dateB).getTime()
        return timeB - timeA
      })
      loading.value = false
    }

    // Listen to root donations
    const unsubRoot = onSnapshot(query(collection(db, 'donations'), where('projectId', '==', projectId)), (snap) => {
      rootDocs = snap.docs.map(doc => mapDonation(doc.id, doc.data()))
      updateUnified()
    })

    // Listen to project subcollection
    const unsubSub = onSnapshot(collection(db, 'projects', projectId, 'donations'), (snap) => {
      subDocs = snap.docs.map(doc => mapDonation(doc.id, doc.data()))
      updateUnified()
    })

    return () => {
      unsubRoot()
      unsubSub()
    }
  }

  const addDonation = async (projectId: string, data: any) => {
    const docRef = await addDoc(collection(db, 'donations'), {
      ...data,
      projectId,
      createdAt: serverTimestamp()
    })
    await recalculateProjectProgress(projectId)
    return { id: docRef.id }
  }

  const updateDonation = async (projectId: string, donationId: string, data: any) => {
    await updateDoc(doc(db, 'donations', donationId), data)
    await recalculateProjectProgress(projectId)
  }

  const deleteDonation = async (projectId: string, donationId: string) => {
    await deleteDoc(doc(db, 'donations', donationId))
    await recalculateProjectProgress(projectId)
  }

  const fetchExpenses = (projectId: string): Unsubscribe => {
    loading.value = true
    let rootDocs: any[] = []
    let subDocs: any[] = []

    const updateUnified = () => {
      const combined = [...rootDocs, ...subDocs]
      const unique = Array.from(new Map(combined.map(d => [d.id, d])).values())
      
      expenses.value = unique.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt || 0))
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt || 0))
        const timeA = isNaN(new Date(dateA).getTime()) ? 0 : new Date(dateA).getTime()
        const timeB = isNaN(new Date(dateB).getTime()) ? 0 : new Date(dateB).getTime()
        return timeB - timeA
      })
      loading.value = false
    }

    const unsubRoot = onSnapshot(query(collection(db, 'expenses'), where('projectId', '==', projectId)), (snap) => {
      rootDocs = snap.docs.map(doc => mapExpense(doc.id, doc.data()))
      updateUnified()
    })

    const unsubSub = onSnapshot(collection(db, 'projects', projectId, 'expenses'), (snap) => {
      subDocs = snap.docs.map(doc => mapExpense(doc.id, doc.data()))
      updateUnified()
    })

    return () => {
      unsubRoot()
      unsubSub()
    }
  }

  const addExpense = async (projectId: string, data: any) => {
    const docRef = await addDoc(collection(db, 'expenses'), {
      ...data,
      projectId,
      createdAt: serverTimestamp()
    })
    await recalculateProjectProgress(projectId)
    return { id: docRef.id }
  }

  const updateExpense = async (projectId: string, expenseId: string, data: any) => {
    await updateDoc(doc(db, 'expenses', expenseId), data)
    await recalculateProjectProgress(projectId)
  }

  const deleteExpense = async (projectId: string, expenseId: string) => {
    await deleteDoc(doc(db, 'expenses', expenseId))
    await recalculateProjectProgress(projectId)
  }

  const fetchUpdates = (projectId: string): Unsubscribe => {
    loading.value = true
    let rootDocs: any[] = []
    let subDocs: any[] = []

    const updateUnified = () => {
      const combined = [...rootDocs, ...subDocs]
      const unique = Array.from(new Map(combined.map(d => [d.id, d])).values())
      
      updates.value = unique.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt || 0))
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt || 0))
        const timeA = isNaN(new Date(dateA).getTime()) ? 0 : new Date(dateA).getTime()
        const timeB = isNaN(new Date(dateB).getTime()) ? 0 : new Date(dateB).getTime()
        return timeB - timeA
      })
      loading.value = false
    }

    const unsubRoot = onSnapshot(query(collection(db, 'project_updates'), where('projectId', '==', projectId)), (snap) => {
      rootDocs = snap.docs.map(doc => mapUpdate(doc.id, doc.data()))
      updateUnified()
    })

    const unsubSub = onSnapshot(collection(db, 'projects', projectId, 'updates'), (snap) => {
      subDocs = snap.docs.map(doc => mapUpdate(doc.id, doc.data()))
      updateUnified()
    })

    return () => {
      unsubRoot()
      unsubSub()
    }
  }

  const addUpdate = async (projectId: string, data: any) => {
    const docRef = await addDoc(collection(db, 'project_updates'), {
      ...data,
      projectId,
      createdAt: serverTimestamp()
    })
    return { id: docRef.id }
  }

  const updateUpdate = async (_projectId: string, updateId: string, data: any) => {
    await updateDoc(doc(db, 'project_updates', updateId), data)
  }

  const deleteUpdate = async (_projectId: string, updateId: string) => {
    await deleteDoc(doc(db, 'project_updates', updateId))
  }

  // --- Analytics / Recalculation ---

  const recalculateProjectProgress = async (projectId: string) => {
    try {
      // 1. Sum Donations (Root + Subcollection)
      const rootDonSnap = await getDocs(query(collection(db, 'donations'), where('projectId', '==', projectId)))
      const subDonSnap = await getDocs(collection(db, 'projects', projectId, 'donations'))
      
      let totalDonations = 0
      const processDon = (doc: any) => {
        const data = doc.data()
        const amount = Number(data.amount) || 0
        totalDonations += data.currency === 'USD' ? amount : amount / 4100
      }
      rootDonSnap.forEach(processDon)
      subDonSnap.forEach(processDon)

      // 2. Sum Expenses (Root + Subcollection)
      const rootExpSnap = await getDocs(query(collection(db, 'expenses'), where('projectId', '==', projectId)))
      const subExpSnap = await getDocs(collection(db, 'projects', projectId, 'expenses'))
      
      let totalExpUsd = 0
      const processExp = (doc: any) => {
        const data = doc.data()
        const amount = Number(data.amount) || 0
        totalExpUsd += data.currency === 'USD' ? amount : amount / 4100
      }
      rootExpSnap.forEach(processExp)
      subExpSnap.forEach(processExp)

      // 3. Update project document
      const docRef = doc(db, 'projects', projectId)
      await updateDoc(docRef, {
        currentAmount: totalDonations,
        totalExpensesUsd: totalExpUsd
      })
      
      console.log(`[recalculate] Project ${projectId} updated: Don=$${totalDonations}, Exp=$${totalExpUsd}`)
    } catch (err) {
      console.error('[useProjects] Error recalculating progress:', err)
    }
  }

  return {
    projects,
    loading,
    donations,
    updates,
    expenses,
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
