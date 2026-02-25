import { ref } from "vue";
import { db } from "@/services/firebase";
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
} from "firebase/firestore";

export type ArticleCategory =
  | "proverb"
  | "history"
  | "ceremony"
  | "general"
  | "buddhist_history"
  | "news"
  | "event";

export interface Article {
  id?: string;
  title: string;
  category: ArticleCategory;
  content: string;
  imageUrl?: string;
  gallery?: string[];
  eventDate?: any;
  endDate?: any;
  location?: string;
  schedule?: string;
  committee?: string;
  isFeatured?: boolean;
  status: "draft" | "published" | "archived";
  createdAt?: any;

  // Backwards compatibility for Laravel naming
  image_url?: string;
  event_date?: string | null;
  end_date?: string | null;
  is_featured?: boolean;
  created_at?: string;
}

export const useArticles = () => {
  const articles = ref<Article[]>([]);
  const loading = ref(false);

  const stripHtml = (html: string) => {
    if (!html) return ''
    return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')
  }

  const mapArticle = (id: string, item: any): Article & { strippedContent: string } => ({
    ...item,
    id,
    imageUrl: item.imageUrl || item.image_url,
    image_url: item.image_url || item.imageUrl,
    eventDate: item.eventDate || item.event_date,
    event_date: item.event_date || item.eventDate,
    endDate: item.endDate || item.end_date,
    end_date: item.end_date || item.endDate,
    isFeatured: item.isFeatured !== undefined ? item.isFeatured : item.is_featured,
    is_featured: item.is_featured !== undefined ? item.is_featured : item.isFeatured,
    createdAt: item.createdAt || item.created_at,
    created_at: item.created_at || item.createdAt,
    strippedContent: stripHtml(item.content || '')
  });

  // Real-time listener
  const fetchArticles = (category?: string): Unsubscribe => {
    loading.value = true;
    let q = query(collection(db, "articles"));
    
    if (category) {
      q = query(q, where("category", "==", category));
    }

    return onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map(doc => mapArticle(doc.id, doc.data()));
      // Sort in-memory to avoid index requirement
      articles.value = results.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0)
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0)
        return dateB.getTime() - dateA.getTime()
      });
      loading.value = false;
    }, (error) => {
      console.error("❌ [useArticles] Error fetching articles:", error);
      loading.value = false;
    });
  };

  const addArticle = async (article: Omit<Article, "id" | "createdAt">) => {
    try {
      const data = {
        ...article,
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, "articles"), data);
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error("Error adding article:", error);
      throw error;
    }
  };

  const updateArticle = async (id: string, article: Partial<Article>) => {
    try {
      const docRef = doc(db, "articles", id);
      await updateDoc(docRef, { ...article });
    } catch (error) {
      console.error("Error updating article:", error);
      throw error;
    }
  };

  const deleteArticle = async (id: string) => {
    try {
      await deleteDoc(doc(db, "articles", id));
    } catch (error) {
      console.error("Error deleting article:", error);
      throw error;
    }
  };

  const getArticle = async (id: string) => {
    try {
      const docRef = doc(db, "articles", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return mapArticle(docSnap.id, docSnap.data());
      }
      return null;
    } catch (error) {
      console.error("Error getting article:", error);
      return null;
    }
  };

  const fetchArticle = (id: string, callback: (article: Article) => void): Unsubscribe => {
    const docRef = doc(db, "articles", id);
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(mapArticle(snapshot.id, snapshot.data()));
      }
    });
  };

  return {
    articles,
    loading,
    fetchArticles,
    fetchArticle,
    getArticle,
    addArticle,
    updateArticle,
    deleteArticle,
  };
};
