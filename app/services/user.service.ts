import { useUserStore } from '~/stores/user.store'
import type { User } from '~/types'
import { useAppToast } from '~/composables/useAppToast'

export const UserService = {
    async simulateLoading(ms = 500) {
        await new Promise(resolve => setTimeout(resolve, ms))
    },

    async addUser(form: Omit<User, 'id'>) {
        await this.simulateLoading()

        const store = useUserStore()
        const toast = useAppToast()

        const newId = store.users.length > 0 ? Math.max(...store.users.map(u => u.id)) + 1 : 1
        const newUser: User = {
            id: newId,
            ...form
        }

        store.setUsers([newUser, ...store.users])

        if (import.meta.client) {
            toast.success('User added', `Successfully added ${newUser.name}.`)
        }
        return newUser
    },

    async updateUser(id: number, form: Partial<User>) {
        await this.simulateLoading()

        const store = useUserStore()
        const toast = useAppToast()

        const index = store.users.findIndex(u => u.id === id)
        if (index !== -1) {
            const updated = [...store.users]
            updated[index] = { ...updated[index]!, ...form }
            store.setUsers(updated)

            if (import.meta.client) {
                toast.success('User updated', `Successfully updated user.`)
            }
        }
    },

    async deleteUser(id: number) {
        await this.simulateLoading()

        const store = useUserStore()
        const toast = useAppToast()

        const target = store.users.find(u => u.id === id)
        if (target) {
            store.setUsers(store.users.filter(u => u.id !== id))
            if (import.meta.client) {
                toast.success('User deleted', `Successfully removed ${target.name}.`)
            }
        }
    }
}
