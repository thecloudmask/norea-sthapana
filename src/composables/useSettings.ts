import { ref } from 'vue'
import { db } from '@/services/firebase'
import { doc, getDoc, setDoc, onSnapshot, type Unsubscribe } from 'firebase/firestore'
import { KHR_TO_USD_RATE } from '~/utils/constants'

export const useSettings = () => {
    const loading = ref(false)
    const settings = ref({
        templeName: 'វត្តនរាធិបតី (Wat Narea)',
        address: 'ភូមិ..., ឃុំ..., ស្រុក..., ខេត្ត...',
        contactPhone: '012 345 678',
        email: 'info@watnarea.org',
        bankName: '',
        bankAccountNumber: '',
        bankAccountName: '',
        qrCodeUrl: '',
        khrRate: KHR_TO_USD_RATE
    })

    const fetchSettings = (): Unsubscribe => {
        loading.value = true
        const docRef = doc(db, 'settings', 'general')
        
        return onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data()
                if (data.khrRate) data.khrRate = Number(data.khrRate)
                settings.value = { ...settings.value, ...data }
            }
            loading.value = false
        }, (error) => {
            console.error('Error fetching settings:', error)
            loading.value = false
        })
    }

    const saveSettings = async (newSettings: any) => {
        loading.value = true
        try {
            const docRef = doc(db, 'settings', 'general')
            await setDoc(docRef, newSettings, { merge: true })
            settings.value = { ...settings.value, ...newSettings }
        } catch (e) {
            console.error('Error saving settings:', e)
            throw e
        } finally {
            loading.value = false
        }
    }

    return { settings, loading, fetchSettings, saveSettings }
}
