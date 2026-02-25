import { format } from 'date-fns'
import { km } from 'date-fns/locale'

export const toKhmerNumerals = (num: string | number) => {
  const khmerNumerals = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩']
  return num.toString().replace(/\d/g, (d) => khmerNumerals[parseInt(d)])
}

export const formatKhmerDate = (date: any, formatStr: string = 'dd MMMM yyyy') => {
  if (!date) return '-'
  try {
    const d = date.toDate ? date.toDate() : (date instanceof Date ? date : new Date(date))
    if (isNaN(d.getTime())) return '-'
    const formatted = format(d, formatStr, { locale: km })
    return toKhmerNumerals(formatted)
  } catch (error) {
    console.error('[formatKhmerDate] Error:', error, date)
    return '-'
  }
}

export const formatKhmerDateTime = (date: any) => {
  return formatKhmerDate(date, 'dd MMMM yyyy HH:mm')
}
