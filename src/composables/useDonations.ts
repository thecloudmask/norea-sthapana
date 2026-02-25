import { ref } from 'vue'
import { db } from '@/services/firebase'
import { collection, query, onSnapshot, addDoc, getDocs, serverTimestamp, type Unsubscribe } from 'firebase/firestore'

export interface Donation {
  id?: string
  projectId?: string
  ceremonyId?: string
  donorName: string
  donorPhone?: string
  amount: number
  currency: 'USD' | 'KHR'
  paymentMethod: string
  receiptNumber?: string
  description?: string
  status?: 'active' | 'inactive'
  createdAt?: any
}

export const useDonations = () => {
  const donations = ref<Donation[]>([])
  const loading = ref(false)

  const mapDonation = (id: string, item: any): Donation => ({
    ...item,
    id,
    projectId: item.projectId || item.project_id,
    project_id: item.projectId || item.project_id,
    ceremonyId: item.ceremonyId || item.ceremony_id,
    ceremony_id: item.ceremonyId || item.ceremony_id,
    donorName: item.donorName || item.donor_name,
    donor_name: item.donorName || item.donor_name,
    donorPhone: item.donorPhone || item.donor_phone,
    donor_phone: item.donorPhone || item.donor_phone,
    paymentMethod: item.paymentMethod || item.payment_method,
    payment_method: item.paymentMethod || item.payment_method,
    receiptNumber: item.receiptNumber || item.receipt_number,
    receipt_number: item.receiptNumber || item.receipt_number,
    createdAt: item.createdAt || item.created_at,
    created_at: item.createdAt || item.created_at
  })

  // Fetch ALL donations (for dashboard overview) - from root collection AND all project subcollections
  const fetchAllDonations = (): Unsubscribe => {
    loading.value = true
    
    let docsA: any[] = []   // root 'donations' collection
    let docsB: any[] = []   // root 'ceremonyIncomes' collection
    let docsC: any[] = []   // project subcollections merged
    const subUnsubs: (() => void)[] = []

    const updateUnifiedResults = () => {
      const combined = [...docsA, ...docsB, ...docsC]
      // Deduplicate by id
      const unique = Array.from(new Map(combined.map(d => [d.id, d])).values())
      donations.value = unique.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt || 0))
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt || 0))
        const timeA = isNaN(dateA.getTime()) ? 0 : dateA.getTime()
        const timeB = isNaN(dateB.getTime()) ? 0 : dateB.getTime()
        return timeB - timeA
      })
      loading.value = false
    }

    const unsubA = onSnapshot(query(collection(db, 'donations')), (snap) => {
      // console.log(`[useDonations] Received ${snap.size} docs from 'donations'`)
      docsA = snap.docs.map(doc => mapDonation(doc.id, doc.data()))
      updateUnifiedResults()
    })

    const unsubB = onSnapshot(query(collection(db, 'ceremonyIncomes')), (snap) => {
      // console.log(`[useDonations] Received ${snap.size} docs from 'ceremonyIncomes'`)
      docsB = snap.docs.map(doc => mapDonation(doc.id, doc.data()))
      updateUnifiedResults()
    })

    // Also subscribe to project subcollections dynamically
    getDocs(collection(db, 'projects')).then(projectsSnap => {
      const subDocsByProject: Record<string, any[]> = {}
      projectsSnap.forEach(projectDoc => {
        const pId = projectDoc.id
        subDocsByProject[pId] = []
        const unsub = onSnapshot(collection(db, 'projects', pId, 'donations'), (snap) => {
          if (snap.size > 0) {
            // console.log(`[useDonations] Received ${snap.size} docs from projects/${pId}/donations`)
          }
          subDocsByProject[pId] = snap.docs.map(doc => mapDonation(doc.id, { ...doc.data(), projectId: pId }))
          docsC = Object.values(subDocsByProject).flat()
          updateUnifiedResults()
        })
        subUnsubs.push(unsub)
      })
    }).catch(err => console.error('[useDonations] Error fetching project subcollections:', err))

    return () => {
      unsubA()
      unsubB()
      subUnsubs.forEach(u => u())
    }
  }

  // DEBUG: Check many alternative collection names to find where the data actually is
  const checkAltCollections = () => {
    // Check roots from rules
    const rootNames = ['ceremonyIncomes', 'ceremonyExpenses', 'incomes', 'expenses', 'donations', 'articles']
    rootNames.forEach(name => {
      onSnapshot(query(collection(db, name)), (snap) => {
        if (snap.size > 0) {
          // console.log(`%c[FOUND ROOT] Collection '${name}' has ${snap.size} docs!`, 'background: #059669; color: white; padding: 4px; font-weight: bold;')
        }
      })
    })

    // Check subcollections for known projects
    getDocs(collection(db, 'projects')).then(snap => {
      snap.forEach(docSnap => {
        const pId = docSnap.id
        const subNames = ['donations', 'expenses', 'updates', 'incomes']
        subNames.forEach(sub => {
          onSnapshot(query(collection(db, 'projects', pId, sub)), (snap) => {
            if (snap.size > 0) {
              // console.log(`%c[FOUND SUB] projects/${pId}/${sub} has ${snap.size} docs!`, 'background: #2563eb; color: white; padding: 4px; font-weight: bold;')
              // console.log(`[DEBUG] Example doc from sub:`, snap.docs[0].data())
            }
          })
        })
      })
    })
  }

  const addDonation = async (
    projectId: string | null,
    donationData: Omit<Donation, 'id' | 'createdAt' | 'projectId'>,
    ceremonyId: string | null = null
  ) => {
    try {
      const data = {
        ...donationData,
        projectId,
        ceremonyId,
        receiptNumber: donationData.receiptNumber || `REC-${Date.now()}`,
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'donations'), data)
      return { id: docRef.id, ...data }
    } catch (error) {
      console.error('[useDonations] Error adding donation:', error)
      throw error
    }
  }

  return { donations, loading, fetchAllDonations, addDonation, checkAltCollections }
}
