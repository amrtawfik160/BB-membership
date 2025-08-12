import { useState } from 'react'

interface UseBenefitsReturn {
    isExpanded: boolean
    toggleExpanded: () => void
}

export function useBenefits(): UseBenefitsReturn {
    const [isExpanded, setIsExpanded] = useState(false)

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded)
    }

    return {
        isExpanded,
        toggleExpanded,
    }
}
