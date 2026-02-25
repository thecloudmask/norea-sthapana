import { auth, db } from './firebase'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

interface Credentials {
  email: string
  password: string
}

export const authService = {
  async login(credentials: Credentials) {
    const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password)
    const user = userCredential.user
    
    // Fetch additional user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    const userData = userDoc.exists() ? userDoc.data() : {}

    const mappedData = this.mapUserData(user, userData)
    const token = await user.getIdToken()
    
    return {
      message: 'Login successful',
      data: mappedData,
      token
    }
  },
  
  async logout() {
    await signOut(auth)
  },

  mapUserData(firebaseAuthUser: any, firestoreData: any) {
    return {
      id: firebaseAuthUser.uid,
      uid: firebaseAuthUser.uid,
      email: firebaseAuthUser.email,
      name: firestoreData.name || firestoreData.displayName || firebaseAuthUser.displayName || 'User',
      displayName: firestoreData.displayName || firestoreData.name || firebaseAuthUser.displayName || 'User',
      role: firestoreData.role || 'user',
      status: firestoreData.status || 'active',
      profile_picture: firestoreData.profile_picture || firestoreData.photoURL || firebaseAuthUser.photoURL || '',
      photoURL: firestoreData.photoURL || firestoreData.profile_picture || firebaseAuthUser.photoURL || '',
      phone: firestoreData.phone || firestoreData.phoneNumber || firebaseAuthUser.phoneNumber || '',
      phoneNumber: firestoreData.phoneNumber || firestoreData.phone || firebaseAuthUser.phoneNumber || '',
      address: firestoreData.address || '',
      position: firestoreData.position || '',
      last_login_at: firestoreData.last_login_at || firestoreData.lastLoginAt || '',
      lastLoginAt: firestoreData.lastLoginAt || firestoreData.last_login_at || '',
      ...firestoreData
    }
  },

  onAuthStateChanged(callback: (user: any) => void) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        const userData = userDoc.exists() ? userDoc.data() : {}
        callback(this.mapUserData(user, userData))
      } else {
        callback(null)
      }
    })
  }
}