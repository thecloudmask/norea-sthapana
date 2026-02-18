import { 
  collection, 
  query, 
  getDocs, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  orderBy,
  getCountFromServer 
} from 'firebase/firestore'
import { db } from '~/utils/firebase'
import { ref } from 'vue'
import type { UserProfile } from '~/stores/auth' // Assuming types are exported from store or types file

export const useUsers = () => {
  const users = ref<UserProfile[]>([])
  const loading = ref(false)

  const fetchUsers = async () => {
    loading.value = true
    try {
      const q = query(collection(db, 'users'), orderBy('updatedAt', 'desc'))
      const querySnapshot = await getDocs(q)
      users.value = querySnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as UserProfile[]
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchTotalUsersCount = async () => {
    try {
      const coll = collection(db, 'users')
      const snapshot = await getCountFromServer(coll)
      return snapshot.data().count
    } catch (error) {
      console.error('Error fetching user count:', error)
      return 0
    }
  }

  const updateUserStatus = async (uid: string, status: string) => {
    try {
      const userRef = doc(db, 'users', uid)
      await updateDoc(userRef, {
        status,
        updatedAt: serverTimestamp()
      })
      // Update local state
      const user = users.value.find(u => u.uid === uid)
      if (user) user.status = status as any
    } catch (error) {
      console.error('Error updating user status:', error)
      throw error
    }
  }

  const updateUserRole = async (uid: string, role: string) => {
    try {
      const userRef = doc(db, 'users', uid)
      await updateDoc(userRef, {
        role,
        updatedAt: serverTimestamp()
      })
      // Update local state
      const user = users.value.find(u => u.uid === uid)
      if (user) user.role = role as any
    } catch (error) {
      console.error('Error updating user role:', error)
      throw error
    }
  }

  const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
    try {
      const userRef = doc(db, 'users', uid)
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
      })
      // Update local state
      const user = users.value.find(u => u.uid === uid)
      if (user) Object.assign(user, data)
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  }

  return {
    users,
    loading,
    fetchUsers,
    updateUserStatus,
    updateUserRole,
    updateUserProfile,
    fetchTotalUsersCount
  }
}
