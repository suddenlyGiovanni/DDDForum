import { type ClassValue, clsx } from '@nick/clsx'
import { twMerge } from 'tailwind-merge'

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export { type ClassValue, clsx, cn, twMerge }
