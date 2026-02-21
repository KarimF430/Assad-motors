'use client'

import React, { useState, useEffect } from 'react'
import { MessageSquare, Plus, Trash2, Menu, X, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'

interface Conversation {
    id: string
    title: string
    lastUpdated: string
    state: any
}

interface ChatSidebarProps {
    currentSessionId: string
    onSelectChat: (id: string) => void
    onNewChat: () => void
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export default function ChatSidebar({
    currentSessionId,
    onSelectChat,
    onNewChat,
    isOpen,
    setIsOpen
}: ChatSidebarProps) {
    const { user, isAuthenticated } = useAuth()
    const [history, setHistory] = useState<Conversation[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isAuthenticated && user?.id) {
            fetchHistory()
        }
    }, [isAuthenticated, user?.id, currentSessionId]) // Refresh when session changes

    const fetchHistory = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/chat/history?userId=${user?.id}`)
            if (response.ok) {
                const data = await response.json()
                setHistory(data)
            }
        } catch (error) {
            console.error('Failed to fetch history', error)
        } finally {
            setLoading(false)
        }
    }

    const deleteChat = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        if (!confirm('Are you sure you want to delete this conversation?')) return

        try {
            await fetch(`/api/chat/${id}`, { method: 'DELETE' })
            setHistory(prev => prev.filter(c => c.id !== id))
            if (currentSessionId === id) {
                onNewChat()
            }
        } catch (error) {
            console.error('Failed to delete chat', error)
        }
    }

    // Group by Date
    const groupedHistory = history.reduce((acc, chat) => {
        const date = new Date(chat.lastUpdated)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        let key = 'Previous 7 Days'
        if (date.toDateString() === today.toDateString()) key = 'Today'
        else if (date.toDateString() === yesterday.toDateString()) key = 'Yesterday'
        else if (date < new Date(today.setDate(today.getDate() - 7))) key = 'Older'

        if (!acc[key]) acc[key] = []
        acc[key].push(chat)
        return acc
    }, {} as Record<string, Conversation[]>)

    const sidebarVariants = {
        open: { x: 0, opacity: 1, display: 'flex' },
        closed: { x: '-100%', opacity: 0, transitionEnd: { display: 'none' } }
    }

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            <motion.div
                className={`fixed md:relative z-50 h-full w-[280px] bg-[#f8f9fa] border-r border-transparent flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:flex'}`}
                initial={false}
            >
                <div className="p-4 flex items-center justify-between">
                    <button
                        onClick={() => {
                            onNewChat()
                            if (window.innerWidth < 768) setIsOpen(false)
                        }}
                        className="flex items-center gap-3 bg-[#eef1f4] text-[#1f1f1f] px-5 py-3 rounded-2xl hover:bg-[#e0e4e9] transition-all shadow-sm group"
                    >
                        <Plus size={20} className="text-blue-600 group-hover:scale-110 transition-transform" />
                        <span className="font-medium text-sm">New Chat</span>
                    </button>
                    <button onClick={() => setIsOpen(false)} className="md:hidden ml-2 p-2 hover:bg-gray-200 rounded-full">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-4">
                    {!isAuthenticated && (
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                            <p className="text-xs text-blue-600 mb-3 font-medium">Log in to save your history</p>
                            <Link href="/login?redirect=/ai-chat" className="text-xs bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 block w-full shadow-sm">
                                Login / Sign Up
                            </Link>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                        </div>
                    ) : history.length === 0 && isAuthenticated ? (
                        <div className="text-center text-gray-400 text-sm py-4">No history yet</div>
                    ) : (
                        Object.entries(groupedHistory).map(([group, chats]) => (
                            <div key={group}>
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">{group}</h3>
                                <div className="space-y-1">
                                    {chats.map(chat => (
                                        <div
                                            key={chat.id}
                                            onClick={() => {
                                                onSelectChat(chat.id)
                                                if (window.innerWidth < 768) setIsOpen(false)
                                            }}
                                            className={`group flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all ${currentSessionId === chat.id
                                                ? 'bg-white shadow-sm border border-gray-100'
                                                : 'hover:bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            <MessageSquare size={16} className={currentSessionId === chat.id ? 'text-blue-600' : 'text-gray-400'} />
                                            <span className="text-sm truncate flex-1 font-medium">{chat.title}</span>
                                            {currentSessionId === chat.id && (
                                                <button
                                                    onClick={(e) => deleteChat(e, chat.id)}
                                                    className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity p-1"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer User Info */}
                {isAuthenticated && user && (
                    <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 px-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                {user.firstName?.[0] || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{user.firstName}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </>
    )
}
