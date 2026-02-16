import {
  collection,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  doc,
  query,
  Timestamp
} from 'firebase/firestore'
import { ref } from 'vue'

import { db } from '~/utils/firebase'

export type ArticleCategory = 'proverb' | 'history' | 'ceremony' | 'general' | 'buddhist_history'

export interface Article {
  id?: string
  title: string
  category: ArticleCategory
  content: string
  imageUrl?: string
  gallery?: string[]
  eventDate?: Date | Timestamp | string | null
  location?: string
  startTime?: string
  endTime?: string
  isFeatured?: boolean
  status: 'draft' | 'published' | 'archived'
  createdAt: Date | Timestamp
}

export const useArticles = () => {
  const articles = ref<Article[]>([])
  const loading = ref(false)

  const fetchArticles = () => {
    console.log('🔍 [useArticles] fetchArticles called')
    console.log('🔍 [useArticles] db instance:', db)
    loading.value = true
    const q = query(collection(db, 'articles'))
    
    return onSnapshot(q, (snapshot) => {
      console.log('📦 [useArticles] Snapshot received, docs count:', snapshot.docs.length)
      articles.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Article[]
      console.log('✅ [useArticles] Articles loaded:', articles.value.length)
      loading.value = false
    }, (error) => {
      console.error('❌ [useArticles] Error fetching articles:', error)
      loading.value = false
    })
  }

  const addArticle = async (article: Omit<Article, 'id' | 'createdAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'articles'), {
        ...article,
        createdAt: Timestamp.now()
      })
      return docRef.id
    } catch (error) {
      console.error('Error adding article:', error)
      throw error
    }
  }

  const updateArticle = async (id: string, article: Partial<Article>) => {
    try {
      const articleRef = doc(db, 'articles', id)
      await updateDoc(articleRef, {
        ...article
      })
    } catch (error) {
      console.error('Error updating article:', error)
      throw error
    }
  }

  const deleteArticle = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'articles', id))
      articles.value = articles.value.filter(item => item.id !== id)
    } catch (error) {
      console.error('Error deleting article:', error)
      throw error
    }
  }

  const getArticle = async (id: string) => {
    try {
      const articleRef = doc(db, 'articles', id)
      const snap = await getDoc(articleRef)
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Article
      }
      return null
    } catch (error) {
      console.error('Error getting article:', error)
      return null
    }
  }

  return {
    articles,
    loading,
    fetchArticles,
    getArticle,
    addArticle,
    updateArticle,
    deleteArticle
  }
}
