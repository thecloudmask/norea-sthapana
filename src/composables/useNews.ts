import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  Timestamp
} from 'firebase/firestore'

export interface NewsItem {
  id?: string
  title: string
  type: 'event' | 'news'
  content: string
  imageUrl?: string
  eventDate?: Date | Timestamp | string | null
  createdAt: Date | Timestamp
}

import { db } from '~/utils/firebase'
import { ref } from 'vue'

export const useNews = () => {
  const newsList = ref<NewsItem[]>([])
  const loading = ref(false)

  const fetchNews = async () => {
    loading.value = true
    try {
      const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      newsList.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NewsItem[]
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      loading.value = false
    }
  }

  const addNews = async (news: Omit<NewsItem, 'id' | 'createdAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'news'), {
        ...news,
        createdAt: Timestamp.now()
      })
      // Optimistic update or refetch
      await fetchNews()
      return docRef.id
    } catch (error) {
      console.error('Error adding news:', error)
      throw error
    }
  }

  const updateNews = async (id: string, news: Partial<NewsItem>) => {
    try {
      const newsRef = doc(db, 'news', id)
      await updateDoc(newsRef, {
        ...news
      })
      await fetchNews()
    } catch (error) {
      console.error('Error updating news:', error)
      throw error
    }
  }

  const deleteNews = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'news', id))
      newsList.value = newsList.value.filter(item => item.id !== id)
    } catch (error) {
      console.error('Error deleting news:', error)
      throw error
    }
  }



  return {
    newsList,
    loading,
    fetchNews,
    addNews,
    updateNews,
    deleteNews
  }
}
