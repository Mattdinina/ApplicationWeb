import { create } from 'zustand'

interface MessageType {
    message: { id: number, author: string, content: string }[],
    newMessage: (newMessage: string) => void

}
export const useMessage = create<MessageType>((set) => ({
    message: [],
    newMessage: (newMessage) => set((state) => ({
        message: [...state.message, {
            id: 4, author: 'theo', content: newMessage
        }]
    })),
}))