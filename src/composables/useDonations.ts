import { ref } from 'vue'
import {
  collectionGroup,
  getDocs,
  query,
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '~/utils/firebase'
import { useKhrRate } from '~/composables/useKhrRate'

export interface Donation {
  id?: string
  projectId?: string
  donorName: string
  amount: number
  currency: 'USD' | 'KHR'
  paymentMethod: 'cash' | 'qr' | 'transfer'
  status?: 'active' | 'inactive'
  createdAt?: any
}

export const useDonations = () => {
  const { khrRate } = useKhrRate()
  const donations = ref<Donation[]>([])
  const loading = ref(false)

  // Fetch ALL donations from all projects (for dashboard overview)
  const fetchAllDonations = async () => {
    loading.value = true
    try {
      const q = query(collectionGroup(db, 'donations'))
      const snapshot = await getDocs(q)
      const raw = snapshot.docs.map((d) => ({
        id: d.id,
        projectId: d.ref.parent.parent?.id,
        ...d.data(),
      })) as Donation[]

      donations.value = raw.sort((a: any, b: any) => {
        const da = a.createdAt?.toDate
          ? a.createdAt.toDate()
          : new Date(a.createdAt || 0)
        const db = b.createdAt?.toDate
          ? b.createdAt.toDate()
          : new Date(b.createdAt || 0)
        return db - da
      })
    } catch (e) {
      console.error('[useDonations] Error fetching donations:', e)
    } finally {
      loading.value = false
    }
  }

  const addDonation = async (
    projectId: string,
    donationData: Omit<Donation, 'id' | 'createdAt' | 'projectId'>
  ) => {
    const projectRef = doc(db, 'projects', projectId)
    const donationsRef = collection(db, 'projects', projectId, 'donations')

    await runTransaction(db, async (transaction) => {
      const projectDoc = await transaction.get(projectRef)
      if (!projectDoc.exists()) throw new Error('Project does not exist')

      // Normalize to USD using shared constant
      const amount = Number(donationData.amount)
      const incrementVal = donationData.currency === 'KHR'
        ? amount / khrRate.value
        : amount

      const currentAmount = projectDoc.data().currentAmount || 0
      const newDonationRef = doc(donationsRef)

      transaction.set(newDonationRef, {
        ...donationData,
        createdAt: serverTimestamp(),
      })

      transaction.update(projectRef, {
        currentAmount: currentAmount + incrementVal,
      })
    })
  }

  return { donations, loading, fetchAllDonations, addDonation }
}
