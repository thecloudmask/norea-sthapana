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

export interface NewsItem {
  id?: string
  title: string
  type: 'event' | 'news'
  content: string
  imageUrl?: string
  eventDate?: any
  createdAt?: any
  strippedContent: string

  // Backwards compatibility for Laravel naming
  image_url?: string
  event_date?: string | null
  created_at?: string
  category?: string
}

export const useNews = () => {
  const newsList = ref<NewsItem[]>([])
  const loading = ref(false)

  const stripHtml = (html: string) => {
    if (!html) return '';
    // Basic regex strip for performance, compatible with Firestore approach
    return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')
  };

  const mapNews = (id: string, item: any): NewsItem => ({
    ...item,
    id,
    type: item.type || (item.category === 'event' ? 'event' : 'news'),
    imageUrl: item.imageUrl || item.image_url,
    image_url: item.image_url || item.imageUrl,
    eventDate: item.eventDate || item.event_date,
    event_date: item.event_date || item.eventDate,
    createdAt: item.createdAt || item.created_at,
    created_at: item.created_at || item.createdAt,
    strippedContent: stripHtml(item.content || '')
  })

  // Real-time listener
  const fetchNews = (): Unsubscribe => {
    loading.value = true
    // In Firebase, news and events are also in the 'articles' collection but with specific categories
    const q = query(
      collection(db, 'articles'), 
      where('category', 'in', ['news', 'event'])
    )
    
    return onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map(doc => mapNews(doc.id, doc.data()))
      // Sort in-memory to avoid index requirement
      newsList.value = results.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0)
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0)
        return dateB.getTime() - dateA.getTime()
      })
      loading.value = false
    }, (error) => {
      console.error('Error fetching news:', error)
      loading.value = false
    })
  }

  const addNews = async (news: Omit<NewsItem, 'id' | 'createdAt' | 'strippedContent'>) => {
    try {
      const data = {
        ...news,
        category: news.type,
        createdAt: serverTimestamp()
      }
      const docRef = await addDoc(collection(db, 'articles'), data)
      return { id: docRef.id, ...data }
    } catch (error) {
      console.error('Error adding news:', error)
      throw error
    }
  }

  const updateNews = async (id: string, news: Partial<NewsItem>) => {
    try {
      const docRef = doc(db, 'articles', id)
      await updateDoc(docRef, { ...news, category: news.type || undefined })
    } catch (error) {
      console.error('Error updating news:', error)
      throw error
    }
  }

  const deleteNews = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'articles', id))
    } catch (error) {
      console.error('Error deleting news:', error)
      throw error
    }
  }

  const getNews = async (id: string) => {
    try {
      const docRef = doc(db, 'articles', id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return mapNews(docSnap.id, docSnap.data())
      }
      return null
    } catch (error) {
      console.error('Error getting news:', error)
      return null
    }
  }

  const fetchNewsItem = (id: string, callback: (news: NewsItem) => void): Unsubscribe => {
    const docRef = doc(db, 'articles', id)
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(mapNews(snapshot.id, snapshot.data()))
      }
    })
  }

  return {
    newsList,
    loading,
    fetchNews,
    addNews,
    updateNews,
    deleteNews,
    getNews,
    fetchNewsItem
  }
}
