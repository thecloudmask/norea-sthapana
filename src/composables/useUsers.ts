import { ref } from 'vue'
import { db } from '@/services/firebase'
import { collection, onSnapshot, query, doc, updateDoc, getCountFromServer, type Unsubscribe } from 'firebase/firestore'
import type { LaravelUser as UserProfile } from '~/stores/auth'

export const useUsers = () => {
  const users = ref<UserProfile[]>([])
  const loading = ref(false)

  const mapUser = (id: string, data: any): UserProfile & { uid: string; displayName?: string; photoURL?: string; phoneNumber?: string; lastLoginAt?: any } => ({
    id,
    uid: id,
    ...data,
    name: data.name || data.displayName || '',
    profile_picture: data.profile_picture || data.photoURL || '',
    phone: data.phone || data.phoneNumber || '',
    last_login_at: data.last_login_at || data.lastLoginAt || '',
    // For users.vue compatibility
    displayName: data.displayName || data.name || '',
    photoURL: data.photoURL || data.profile_picture || '',
    phoneNumber: data.phoneNumber || data.phone || '',
    lastLoginAt: data.lastLoginAt || data.last_login_at || ''
  })

  const fetchUsers = (): Unsubscribe => {
    loading.value = true
    const q = query(collection(db, 'users'))
    
    return onSnapshot(q, (snapshot) => {
      users.value = snapshot.docs.map(doc => mapUser(doc.id, doc.data()) as UserProfile)
      loading.value = false
    }, (error) => {
      console.error('Error fetching users:', error)
      loading.value = false
    })
  }

  const fetchTotalUsersCount = async () => {
    try {
      const coll = collection(db, 'users')
      const snapshot = await getCountFromServer(coll)
      return snapshot.data().count
    } catch (error) {
      if (users.value.length > 0) return users.value.length
      return 0
    }
  }

  const updateUserStatus = async (id: string, status: string) => {
    try {
      const docRef = doc(db, 'users', id)
      await updateDoc(docRef, { status })
    } catch (error) {
      console.error('Error updating user status:', error)
      throw error
    }
  }

  const updateUserRole = async (id: string, role: string) => {
    try {
      const docRef = doc(db, 'users', id)
      await updateDoc(docRef, { role })
    } catch (error) {
      console.error('Error updating user role:', error)
      throw error
    }
  }

  const updateUserProfile = async (id: string, data: Partial<UserProfile>) => {
    try {
      const docRef = doc(db, 'users', id)
      await updateDoc(docRef, data)
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
