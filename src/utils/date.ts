import { format } from 'date-fns'
import { km } from 'date-fns/locale'

export const toKhmerNumerals = (num: string | number) => {
  const khmerNumerals = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩']
  return num.toString().replace(/\d/g, (d) => khmerNumerals[parseInt(d)])
}

export const formatKhmerDate = (date: any, formatStr: string = 'dd MMMM yyyy') => {
  if (!date) return '-'
  const d = date.toDate ? date.toDate() : new Date(date)
  const formatted = format(d, formatStr, { locale: km })
  return toKhmerNumerals(formatted)
}

export const formatKhmerDateTime = (date: any) => {
  return formatKhmerDate(date, 'dd MMMM yyyy HH:mm')
}
