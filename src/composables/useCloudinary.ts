import { ref } from 'vue'
import { compressImage } from '~/lib/image-tools'

export const useCloudinary = () => {
  const uploading = ref(false)
  
  const cloudName = 'dfs1iwbh3'
  const folder = 'norea_sthapana'
  // Unsigned upload preset is required for client-side upload. 
  // User should ensure this preset exists in their Cloudinary settings.
  const uploadPreset = 'norea_sthapana' 

  const uploadImage = async (file: File) => {
    uploading.value = true
    
    let fileToUpload: File | Blob = file
    try {
      console.log('Compressing image...', file.size)
      fileToUpload = await compressImage(file, 1200, 0.7)
      console.log('Compressed size:', fileToUpload.size)
    } catch (e) {
      console.error('Compression failed, using original file', e)
    }

    const formData = new FormData()
    formData.append('file', fileToUpload)
    formData.append('upload_preset', uploadPreset)
    // Commented out folder support as it often causes 400 errors for basic Unsigned presets
    // formData.append('folder', folder)

    try {
      console.log('Starting Cloudinary upload...', { cloudName, uploadPreset, folder })
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Cloudinary API Error:', data)
        const errorMsg = data.error?.message || 'រូបភាពមិនអាចបង្ហោះបានទេ'
        throw new Error(errorMsg)
      }

      console.log('Upload successful:', data.secure_url)
      return data.secure_url
    } catch (error: any) {
      console.error('Upload Process Error:', error)
      // Provide user-friendly hint for common Cloudinary error
      if (error.message?.includes('preset')) {
        alert('សូមពិនិត្យមើល Cloudinary Upload Preset: ត្រូវប្រាកដថាអ្នកមាន "Unsigned" preset ឈ្មោះ "ml_default"')
      } else {
        alert('ការបង្ហោះរូបភាពមានបញ្ហា: ' + error.message)
      }
      throw error
    } finally {
      uploading.value = false
    }
  }

  return {
    uploadImage,
    uploading
  }
}
