/**
 * useKhrRate — Global reactive KHR/USD exchange rate
 *
 * Rate is loaded from Firestore `settings/general.khrRate` on first use.
 * Falls back to the hardcoded constant if not yet loaded.
 * All financial calculations should use `khrRate.value` instead of 4100.
 */
import { ref } from 'vue'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '~/utils/firebase'
import { KHR_TO_USD_RATE } from '~/utils/constants'

// Singleton state — shared across all composable instances
const khrRate = ref<number>(KHR_TO_USD_RATE)
const khrRateLoaded = ref(false)
const khrRateLoading = ref(false)

const loadKhrRate = async () => {
  if (khrRateLoaded.value || khrRateLoading.value) return
  khrRateLoading.value = true
  try {
    const snap = await getDoc(doc(db, 'settings', 'general'))
    if (snap.exists() && snap.data().khrRate) {
      khrRate.value = Number(snap.data().khrRate) || KHR_TO_USD_RATE
    }
    khrRateLoaded.value = true
  } catch (e) {
    console.error('[useKhrRate] Failed to load rate:', e)
  } finally {
    khrRateLoading.value = false
  }
}

const saveKhrRate = async (newRate: number) => {
  try {
    await updateDoc(doc(db, 'settings', 'general'), { khrRate: newRate })
    khrRate.value = newRate
  } catch (e) {
    console.error('[useKhrRate] Failed to save rate:', e)
    throw e
  }
}

export const useKhrRate = () => {
  // Auto-load on first use
  if (!khrRateLoaded.value) {
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
