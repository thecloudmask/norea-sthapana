import { useI18n } from 'vue-i18n'

export const useLocalePath = () => {
  const { locale } = useI18n()
  
  return (path: string) => {
    const currentLocale = locale.value
    // In Nuxt config, default was 'km'. fallback was 'en'. 
    // We should probably rely on a config or just hardcode for now.
    const defaultLocale = 'km' 

    if (currentLocale === defaultLocale) {
      return path
    }

    // simplistic implementation
    if (path === '/') {
      return `/${currentLocale}`
    }
    
    return `/${currentLocale}${path}`.replace('//', '/')
  }
}
