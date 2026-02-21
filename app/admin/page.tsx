'use client'

import { useState, useEffect } from 'react'
import { Download, Users, UserCheck, UserX, Mail, Calendar, TrendingUp, ArrowLeft, MessageSquare } from 'lucide-react'
import Link from 'next/link'

interface UserStats {
    totalUsers: number
    activeUsers: number
    inactiveUsers: number
    googleUsers: number
    emailUsers: number
    verifiedUsers: number
    newThisMonth: number
    activeLastWeek: number
}

interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    phone?: string
    dateOfBirth?: string
    googleId?: string
    isActive: boolean
    isEmailVerified: boolean
    createdAt: string
    lastLogin?: string
}

export default function AdminPanel() {
    const [stats, setStats] = useState<UserStats | null>(null)
    const [recentUsers, setRecentUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [downloading, setDownloading] = useState(false)

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)

            // Fetch statistics
            const statsRes = await fetch(`${backendUrl}/api/admin/users/stats`, {
                credentials: 'include'
            })
            if (statsRes.ok) {
                const statsData = await statsRes.json()
                setStats(statsData)
            }

            // Fetch recent users
            const usersRes = await fetch(`${backendUrl}/api/admin/users/recent?limit=10`, {
                credentials: 'include'
            })
            if (usersRes.ok) {
                const usersData = await usersRes.json()
                setRecentUsers(usersData.users)
            }
        } catch (error) {
            console.error('Error fetching admin data:', error)
        } finally {
            setLoading(false)
        }
    }

    const downloadCSV = async () => {
        try {
            setDownloading(true)
            const response = await fetch(`${backendUrl}/api/admin/users/export`, {
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error('Download failed')
            }

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `users-${new Date().toISOString().split('T')[0]}.csv`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error) {
            console.error('Error downloading CSV:', error)
            alert('Failed to download CSV. Please try again.')
        } finally {
            setDownloading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading admin panel...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-[#291e6a] text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/" className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                                <ArrowLeft size={24} />
                            </Link>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold">Admin Panel</h1>
                                <p className="text-red-100 text-sm mt-1">User Management Dashboard</p>
                            </div>
                        </div>
                        <button
                            onClick={downloadCSV}
                            disabled={downloading}
                            className="bg-white text-red-600 hover:bg-red-50 font-semibold py-2.5 px-4 sm:px-6 rounded-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                        >
                            <Download size={20} />
                            <span className="hidden sm:inline">{downloading ? 'Downloading...' : 'Export CSV'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Admin Navigation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <Link href="/admin/leads" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all group">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                                <Users className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">Dealership Leads</h3>
                                <p className="text-sm text-gray-500">View and export dealership inquiries</p>
                            </div>
                        </div>
                    </Link>

                    <Link href="/admin/reviews" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all group">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-[#f0eef5] rounded-lg group-hover:bg-[#e8e6f0] transition-colors">
                                <MessageSquare className="h-6 w-6 text-[#1c144a]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#1c144a] transition-colors">Reviews Management</h3>
                                <p className="text-sm text-gray-500">Approve, reject & delete reviews</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                    {/* Total Users */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <span className="text-2xl sm:text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
                    </div>

                    {/* Active Users */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-50 rounded-lg">
                                <UserCheck className="h-6 w-6 text-green-600" />
                            </div>
                            <span className="text-2xl sm:text-3xl font-bold text-gray-900">{stats?.activeUsers || 0}</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">Active Users</h3>
                    </div>

                    {/* New This Month */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-purple-600" />
                            </div>
                            <span className="text-2xl sm:text-3xl font-bold text-gray-900">{stats?.newThisMonth || 0}</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">New This Month</h3>
                    </div>

                    {/* Google Users */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-red-50 rounded-lg">
                                <Mail className="h-6 w-6 text-red-600" />
                            </div>
                            <span className="text-2xl sm:text-3xl font-bold text-gray-900">{stats?.googleUsers || 0}</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">Google OAuth</h3>
                    </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Email/Password Users</span>
                            <span className="text-lg font-semibold text-gray-900">{stats?.emailUsers || 0}</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Verified Emails</span>
                            <span className="text-lg font-semibold text-gray-900">{stats?.verifiedUsers || 0}</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Active Last Week</span>
                            <span className="text-lg font-semibold text-gray-900">{stats?.activeLastWeek || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Recent Users Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
                        <p className="text-sm text-gray-600 mt-1">Latest 10 registered users</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Auth Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-red-400 to-[#291e6a] flex items-center justify-center text-white font-semibold">
                                                    {user.firstName?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.firstName} {user.lastName}
                                                    </div>
                                                    <div className="text-sm text-gray-500 sm:hidden">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                            <div className="text-sm text-gray-900">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.googleId ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {user.googleId ? 'Google' : 'Email'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {recentUsers.length === 0 && (
                        <div className="text-center py-12">
                            <UserX className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">No users found</p>
                        </div>
                    )}
                </div>

                {/* Footer Note */}
                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                        <strong>⚠️ Security Note:</strong> This admin panel is currently accessible without authentication.
                        Please add admin authentication middleware before deploying to production.
                    </p>
                </div>
            </div>
        </div>
    )
}
