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
  type Unsubscribe 
} from 'firebase/firestore'

export interface Ceremony {
  id?: string
  title: string
  content: string
  schedule?: string
  committee?: string
  eventDate?: any
  endDate?: any
  imageUrl?: string
  isFeatured?: boolean
  status: 'draft' | 'published' | 'completed' | 'archived'
  location?: string
  createdAt?: any

  // Backwards compatibility for Laravel naming
  event_date?: string | null
  end_date?: string | null
  image_url?: string
  is_featured?: boolean
  created_at?: string
}

export const useCeremonies = () => {
  const ceremonies = ref<Ceremony[]>([])
  const loading = ref(false)

  const stripHtml = (html: string) => {
    if (!html) return ''
    return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')
  }

  const mapCeremony = (id: string, item: any): Ceremony & { strippedContent: string } => ({
    ...item,
    id,
    eventDate: item.eventDate || item.event_date,
    event_date: item.event_date || item.eventDate,
    endDate: item.endDate || item.end_date,
    end_date: item.end_date || item.endDate,
    imageUrl: item.imageUrl || item.image_url,
    image_url: item.image_url || item.imageUrl,
    isFeatured: item.isFeatured !== undefined ? item.isFeatured : item.is_featured,
    is_featured: item.is_featured !== undefined ? item.is_featured : item.isFeatured,
    createdAt: item.createdAt || item.created_at,
    created_at: item.created_at || item.createdAt,
    strippedContent: stripHtml(item.content || '')
  })

  // Real-time listener
  const fetchCeremonies = (): Unsubscribe => {
    loading.value = true
    const q = query(
      collection(db, 'articles'), 
      where('category', '==', 'ceremony')
    )
    
    return onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map(doc => mapCeremony(doc.id, doc.data()))
      // Sort in-memory to avoid index requirement
      ceremonies.value = results.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0)
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0)
        return dateB.getTime() - dateA.getTime()
      })
      loading.value = false
    }, (error) => {
      console.error('[useCeremonies] Error fetching ceremonies:', error)
      loading.value = false
    })
  }

  const getCeremony = async (id: string) => {
    try {
      const docRef = doc(db, 'articles', id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return mapCeremony(docSnap.id, docSnap.data())
      }
      return null
    } catch (error) {
      console.error('[useCeremonies] Error getting ceremony:', error)
      return null
    }
  }

  const fetchCeremony = (id: string, callback: (ceremony: Ceremony) => void): Unsubscribe => {
    const docRef = doc(db, 'articles', id)
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(mapCeremony(snapshot.id, snapshot.data()))
      }
    })
  }

  const addCeremony = async (ceremony: Omit<Ceremony, 'id' | 'createdAt'>) => {
    try {
      const data = {
        ...ceremony,
        category: 'ceremony',
        createdAt: serverTimestamp()
      }
      const docRef = await addDoc(collection(db, 'articles'), data)
      return { id: docRef.id, ...data }
    } catch (error) {
      console.error('[useCeremonies] Error adding ceremony:', error)
      throw error
    }
  }

  const updateCeremony = async (id: string, ceremony: Partial<Ceremony>) => {
    try {
      const docRef = doc(db, 'articles', id)
      await updateDoc(docRef, { ...ceremony })
    } catch (error) {
      console.error('[useCeremonies] Error updating ceremony:', error)
      throw error
    }
  }

  const deleteCeremony = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'articles', id))
    } catch (error) {
      console.error('[useCeremonies] Error deleting ceremony:', error)
      throw error
    }
  }

  const checkCeremonyExpirations = async () => {
    const now = new Date()
    const expiredCeremonies = ceremonies.value.filter(c => {
      if (c.status !== 'published' || (!c.endDate && !c.eventDate)) return false
      
      const expDate = c.endDate ? (c.endDate.toDate ? c.endDate.toDate() : new Date(c.endDate)) 
                                : (c.eventDate.toDate ? c.eventDate.toDate() : new Date(c.eventDate))
      
      return expDate < now
    })

    if (expiredCeremonies.length > 0) {
      console.log(`[Ceremony Sweep] Found ${expiredCeremonies.length} expired ceremonies. Updating to 'completed'...`)
      for (const cerim of expiredCeremonies) {
        if (cerim.id) {
          try {
            await updateCeremony(cerim.id, { status: 'completed' })
          } catch (err) {
            console.error(`Failed to auto-complete ceremony ${cerim.id}:`, err)
          }
        }
      }
    }
  }

  return {
    ceremonies,
    loading,
    fetchCeremonies,
    fetchCeremony,
    getCeremony,
    addCeremony,
    updateCeremony,
    deleteCeremony,
    checkCeremonyExpirations
  }
}
