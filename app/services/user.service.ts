import { useUserStore } from '~/stores/user.store'
import { useAppLogger } from '~/composables/useAppLogger'
import type { User } from '~/types'

export const UserService = {
    async simulateLoading(ms = 500) {
        await new Promise(resolve => setTimeout(resolve, ms))
    },

    async addUser(user: Omit<User, 'id'>) {
        await this.simulateLoading()
        const store = useUserStore()
        const { logUserAdded } = useAppLogger()
        
        const newId = Math.max(0, ...store.users.map(u => u.id)) + 1
        const newUser: User = { id: newId, ...user }
        
        store.setUsers([...store.users, newUser])
        logUserAdded(newUser.name)
        return newUser
    },

    async updateUser(id: number, updates: Partial<User>) {
        await this.simulateLoading()
        const store = useUserStore()
        const { logUserUpdated, logUserToggleStatus } = useAppLogger()
        
        const index = store.users.findIndex(u => u.id === id)
        if (index === -1) return null

        const current = store.users[index]!
        const updated = { ...current, ...updates }
        
        const newList = [...store.users]
        newList[index] = updated
        store.setUsers(newList)

        if (updates.status && updates.status !== current.status) {
            logUserToggleStatus(updated.name, updates.status === 'Active')
        } else {
            logUserUpdated(updated.name)
        }

        return updated
    },

    async deleteUser(id: number) {
        await this.simulateLoading()
        const store = useUserStore()
        const { logUserDeleted } = useAppLogger()
        
        const user = store.users.find(u => u.id === id)
        if (!user) return

        store.setUsers(store.users.filter(u => u.id !== id))
        logUserDeleted(user.name)
    }
}
