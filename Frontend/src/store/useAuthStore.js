import { create } from 'zustand'


export const useAuthStore = create((set) => ({
    authUser: { name: 'dodger', _id: 123, age: 27 },
}))