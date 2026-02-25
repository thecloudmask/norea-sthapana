/**
 * useKhrRate — Global reactive KHR/USD exchange rate via Firebase Firestore
 */
import { ref } from 'vue'
import { db } from '@/services/firebase'
import { doc, onSnapshot, setDoc, type Unsubscribe } from 'firebase/firestore'
import { KHR_TO_USD_RATE } from '~/utils/constants'

// Singleton state — shared across all composable instances
const khrRate = ref<number>(KHR_TO_USD_RATE)
const khrRateLoaded = ref(false)
const khrRateLoading = ref(false)
let unsubscribe: Unsubscribe | null = null

const loadKhrRate = () => {
  if (unsubscribe) return unsubscribe
  
  khrRateLoading.value = true
  const docRef = doc(db, 'settings', 'general')
  
  unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data()
      if (data.khrRate) {
        khrRate.value = Number(data.khrRate) || KHR_TO_USD_RATE
      }
    }
    khrRateLoaded.value = true
    khrRateLoading.value = false
  }, (e) => {
    console.error('[useKhrRate] Listener failed:', e)
    khrRateLoading.value = false
  })

  return unsubscribe
}

const saveKhrRate = async (newRate: number) => {
  try {
    const docRef = doc(db, 'settings', 'general')
    await setDoc(docRef, { khrRate: newRate }, { merge: true })
    khrRate.value = newRate
  } catch (e) {
    console.error('[useKhrRate] Failed to save rate:', e)
    throw e
  }
}

export const useKhrRate = () => {
  // Auto-init on first use if not already started
  if (!unsubscribe) {
    loadKhrRate()
  }

  return {
    khrRate,
    khrRateLoaded,
    khrRateLoading,
    loadKhrRate,
    saveKhrRate
  }
}
