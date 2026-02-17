import { db } from '~/utils/firebase'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { ref } from 'vue'

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
        qrCodeUrl: ''
    })

    const fetchSettings = async () => {
        loading.value = true
        try {
            const docRef = doc(db, 'settings', 'general')
            const snap = await getDoc(docRef)
            if (snap.exists()) {
                settings.value = { ...settings.value, ...snap.data() }
            } else {
                // Initialize default if not exists
                await setDoc(docRef, settings.value)
            }
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const saveSettings = async (newSettings: any) => {
        loading.value = true
        try {
             const docRef = doc(db, 'settings', 'general')
             await updateDoc(docRef, newSettings)
             settings.value = { ...settings.value, ...newSettings }
        } catch (e) {
             console.error(e)
             throw e
        } finally {
             loading.value = false
        }
    }

    return { settings, loading, fetchSettings, saveSettings }
}
