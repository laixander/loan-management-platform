// ============================================================================
// Core: Storage Service
// ============================================================================
// A generic wrapper around localStorage with JSON parsing and SSR safety.

export const useStorage = () => {
    /**
     * Get a parsed item from localStorage
     */
    const getItem = <T>(key: string): T | null => {
        if (import.meta.server) return null

        try {
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) as T : null
        } catch (e) {
            console.error(`[Storage] Failed to parse item for key: ${key}`, e)
            return null
        }
    }

    /**
     * Set a stringified item to localStorage
     */
    const setItem = <T>(key: string, value: T): void => {
        if (import.meta.server) return

        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch (e) {
            console.error(`[Storage] Failed to stringify item for key: ${key}`, e)
        }
    }

    /**
     * Remove an item from localStorage
     */
    const removeItem = (key: string): void => {
        if (import.meta.server) return
        localStorage.removeItem(key)
    }

    /**
     * Clear all demo items (useful for hard reset)
     */
    const clearDemoData = (): void => {
        if (import.meta.server) return

        const keys = Object.keys(localStorage)
        for (const key of keys) {
            if (key.startsWith('demo-')) {
                localStorage.removeItem(key)
            }
        }
    }

    return {
        getItem,
        setItem,
        removeItem,
        clearDemoData
    }
}
