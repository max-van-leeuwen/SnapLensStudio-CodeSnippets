// simple callback class

export class Callback<T extends any[] = []> {
    private listeners: ((...args: T) => void)[] = []

    /**
     * Subscribe to this callback
     */
    add(callback: (...args: T) => void): void {
        if (!this.listeners.includes(callback)) {
            this.listeners.push(callback)
        }
    }

    /**
     * Unsubscribe from this callback
     */
    remove(callback: (...args: T) => void): void {
        const index = this.listeners.indexOf(callback)
        if (index > -1) {
            this.listeners.splice(index, 1)
        }
    }

    /**
     * Invoke all subscribed callbacks
     */
    invoke(...args: T): void {
        // Create a copy to avoid issues if listeners modify the array during iteration
        const listenersCopy = [...this.listeners]
        for (const listener of listenersCopy) {
            listener(...args)
        }
    }

    /**
     * Remove all subscribers
     */
    clear(): void {
        this.listeners = []
    }

    /**
     * Get the number of subscribers
     */
    get count(): number {
        return this.listeners.length
    }
}
