export const formatPhone = (value: string): string => {
    const digits = extractDigit(value)
    if (!digits) return ''
    const normalized = digits.startsWith('8') ? '7' + digits.slice(1) : digits
    const parts: string[] = ['+7']
    if (normalized.length > 1) parts.push(' (' + normalized.slice(1, 4))
    if (normalized.length > 4) parts.push(') ' + normalized.slice(4, 7))
    if (normalized.length > 7) parts.push('-' + normalized.slice(7, 9))
    if (normalized.length > 9) parts.push('-' + normalized.slice(9, 11))
    return parts.join('')
}

export const parsePhone = (value: string): string => {

    const digits = extractDigit(value)
    if (digits.startsWith('8') && digits.length === 11) return digits
    if (digits.startsWith('7') && digits.length === 11) return '8' + digits.slice(1)
    return digits
}

export const extractDigit = (value: string): string => {
    return value.replace(/\D/g, '');
};
