'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Check, X, Trash2, Eye, Star, Search, Filter, MessageSquare, Calendar, User } from 'lucide-react'
import Link from 'next/link'

interface Review {
    id: string
    _id?: string
    brandSlug: string
    modelSlug: string
    variantSlug?: string
    userName: string
    userEmail: string
    drivingExperience: string
    reviewTitle: string
    reviewText: string
    overallRating?: number
    starRatings?: Record<string, number>
    emojiRatings?: Record<string, string>
    likes: number
    dislikes: number
    isApproved: boolean
    isVerified: boolean
    images?: string[]
    createdAt: string
    updatedAt?: string
}

interface ReviewStats {
    total: number
    approved: number
    pending: number
    averageRating: number
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [stats, setStats] = useState<ReviewStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedReview, setSelectedReview] = useState<Review | null>(null)
    const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    // Pagination
    const [page, setPage] = useState(1)
    const [limit] = useState(10)
    const [totalPages, setTotalPages] = useState(1)

    // Race condition prevention
    const abortControllerRef = useRef<AbortController | null>(null)

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

    useEffect(() => {
        setPage(1) // Reset to page 1 on filter/search change
    }, [filter, searchQuery])

    useEffect(() => {
        fetchReviews()
        fetchStats()

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
    }, [page, filter]) // Re-fetch on page/filter change. Search is handled via Enter key or debounce, but useEffect dep simplifies for now.

    const fetchReviews = async () => {
        try {
            // Cancel previous request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
            abortControllerRef.current = new AbortController()
            const signal = abortControllerRef.current.signal

            setLoading(true)
            const params = new URLSearchParams()
            if (filter === 'approved') params.set('isApproved', 'true')
            else if (filter === 'pending') params.set('isApproved', 'false')
            if (searchQuery) params.set('search', searchQuery)

            // Pagination
            params.set('limit', limit.toString())
            params.set('offset', ((page - 1) * limit).toString())

            const response = await fetch(`${API_URL}/api/admin/reviews?${params.toString()}`, {
                credentials: 'include',
                signal
            })
            const data = await response.json()
            if (data.success) {
                setReviews(data.data.reviews || [])
                setTotalPages(Math.ceil((data.data.total || 0) / limit))
            }
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                console.error('Error fetching reviews:', error)
            }
        } finally {
            // Only turn off loading if this request wasn't aborted (or rather, we can't easily check 'this' request without closures, but AbortError handling above prevents setting state on aborted)
            // Actually 'finally' runs even on abort. We should only setLoading(false) if not aborted?
            // Safer: logic inside try/catch handles the sets.
            if (abortControllerRef.current?.signal.aborted) return
            setLoading(false)
        }
    }

    const fetchStats = async () => {
        try {
            const response = await fetch(`${API_URL}/api/admin/reviews/stats/summary`, {
                credentials: 'include'
            })
            const data = await response.json()
            if (data.success) {
                setStats(data.data)
            }
        } catch (error) {
            console.error('Error fetching stats:', error)
        }
    }

    const handleApprove = async (reviewId: string, approve: boolean) => {
        try {
            setActionLoading(reviewId)
            const response = await fetch(`${API_URL}/api/admin/reviews/${reviewId}/approve`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ isApproved: approve })
            })
            const data = await response.json()
            if (data.success) {
                setReviews(prev => prev.map(r =>
                    r.id === reviewId ? { ...r, isApproved: approve } : r
                ))
                fetchStats()
            }
        } catch (error) {
            console.error('Error updating review:', error)
        } finally {
            setActionLoading(null)
        }
    }

    const handleDelete = async (reviewId: string) => {
        if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
            return
        }
        try {
            setActionLoading(reviewId)
            const response = await fetch(`${API_URL}/api/admin/reviews/${reviewId}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            const data = await response.json()
            if (data.success) {
                setReviews(prev => prev.filter(r => r.id !== reviewId))
                setSelectedReview(null)
                fetchStats()
            }
        } catch (error) {
            console.error('Error deleting review:', error)
        } finally {
            setActionLoading(null)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const calculateOverallRating = (review: Review): number => {
        if (review.overallRating) return review.overallRating
        if (review.starRatings) {
            const values = Object.values(review.starRatings)
            if (values.length > 0) {
                return values.reduce((a, b) => a + b, 0) / values.length
            }
        }
        return 0
    }

    const filteredReviews = reviews.filter(review => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
            review.userName?.toLowerCase().includes(query) ||
            review.reviewTitle?.toLowerCase().includes(query) ||
            review.modelSlug?.toLowerCase().includes(query) ||
            review.brandSlug?.toLowerCase().includes(query)
        )
    })

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-[#291e6a] text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/admin" className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                                <ArrowLeft size={24} />
                            </Link>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold">Reviews Management</h1>
                                <p className="text-red-100 text-sm mt-1">Approve, reject, and manage user reviews</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <MessageSquare className="h-6 w-6 text-blue-600" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{stats?.total || 0}</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">Total Reviews</h3>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-3 bg-green-50 rounded-lg">
                                <Check className="h-6 w-6 text-green-600" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{stats?.approved || 0}</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">Approved</h3>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-3 bg-yellow-50 rounded-lg">
                                <Calendar className="h-6 w-6 text-yellow-600" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{stats?.pending || 0}</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">Pending</h3>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-3 bg-[#f0eef5] rounded-lg">
                                <Star className="h-6 w-6 text-[#1c144a]" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{stats?.averageRating?.toFixed(1) || '0.0'}</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">Avg Rating</h3>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by user, title, or model..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && fetchReviews()}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('pending')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => setFilter('approved')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                Approved
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reviews Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Reviews ({filteredReviews.length})</h2>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading reviews...</p>
                        </div>
                    ) : filteredReviews.length === 0 ? (
                        <div className="text-center py-12">
                            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">No reviews found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Model</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Rating</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredReviews.map((review) => {
                                        const rating = calculateOverallRating(review)
                                        return (
                                            <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-red-400 to-[#291e6a] flex items-center justify-center text-white font-semibold">
                                                            {review.userName?.[0]?.toUpperCase() || 'U'}
                                                        </div>
                                                        <div className="ml-3">
                                                            <div className="text-sm font-medium text-gray-900">{review.userName}</div>
                                                            <div className="text-xs text-gray-500">{review.userEmail}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="max-w-xs">
                                                        <div className="text-sm font-medium text-gray-900 truncate">{review.reviewTitle}</div>
                                                        <div className="text-xs text-gray-500 truncate">{review.reviewText?.substring(0, 60)}...</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                                    <div className="text-sm text-gray-900">{review.brandSlug} / {review.modelSlug}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                                    <div className="flex items-center">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star key={star} className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                                        ))}
                                                        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${review.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {review.isApproved ? 'Approved' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                                                    {formatDate(review.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <button
                                                            onClick={() => setSelectedReview(review)}
                                                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="View"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        {!review.isApproved && (
                                                            <button
                                                                onClick={() => handleApprove(review.id, true)}
                                                                disabled={actionLoading === review.id}
                                                                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                                                title="Approve"
                                                            >
                                                                <Check size={18} />
                                                            </button>
                                                        )}
                                                        {review.isApproved && (
                                                            <button
                                                                onClick={() => handleApprove(review.id, false)}
                                                                disabled={actionLoading === review.id}
                                                                className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50"
                                                                title="Unapprove"
                                                            >
                                                                <X size={18} />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(review.id)}
                                                            disabled={actionLoading === review.id}
                                                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {!loading && reviews.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                Page <span className="font-medium text-gray-900">{page}</span> of <span className="font-medium text-gray-900">{totalPages}</span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Review Detail Modal */}
            {selectedReview && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedReview(null)}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Review Details</h3>
                            <button onClick={() => setSelectedReview(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* User Info */}
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-400 to-[#291e6a] flex items-center justify-center text-white font-semibold text-lg">
                                    {selectedReview.userName?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="ml-4">
                                    <h4 className="font-semibold text-gray-900">{selectedReview.userName}</h4>
                                    <p className="text-sm text-gray-500">{selectedReview.userEmail}</p>
                                    <p className="text-xs text-gray-400">Experience: {selectedReview.drivingExperience}</p>
                                </div>
                                <div className="ml-auto">
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${selectedReview.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {selectedReview.isApproved ? 'Approved' : 'Pending'}
                                    </span>
                                </div>
                            </div>

                            {/* Model Info */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">Car:</span> {selectedReview.brandSlug} / {selectedReview.modelSlug}
                                    {selectedReview.variantSlug && ` / ${selectedReview.variantSlug}`}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    <span className="font-medium">Submitted:</span> {formatDate(selectedReview.createdAt)}
                                </div>
                            </div>

                            {/* Rating */}
                            <div>
                                <h5 className="font-medium text-gray-900 mb-2">Rating</h5>
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className={`h-6 w-6 ${star <= calculateOverallRating(selectedReview) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                    ))}
                                    <span className="ml-2 text-lg font-semibold">{calculateOverallRating(selectedReview).toFixed(1)}</span>
                                </div>
                                {selectedReview.starRatings && (
                                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                                        {Object.entries(selectedReview.starRatings).map(([key, value]) => (
                                            <div key={key} className="flex justify-between bg-gray-50 px-3 py-2 rounded">
                                                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                                <span className="font-medium">{value}/5</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Review Content */}
                            <div>
                                <h5 className="font-semibold text-gray-900 text-lg mb-2">{selectedReview.reviewTitle}</h5>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedReview.reviewText}</p>
                            </div>

                            {/* Images */}
                            {selectedReview.images && selectedReview.images.length > 0 && (
                                <div>
                                    <h5 className="font-medium text-gray-900 mb-2">Images ({selectedReview.images.length})</h5>
                                    <div className="flex gap-2 flex-wrap">
                                        {selectedReview.images.map((img, idx) => (
                                            <img key={idx} src={img} alt={`Review image ${idx + 1}`} className="w-24 h-24 object-cover rounded-lg border border-gray-200" />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Stats */}
                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                                <span>👍 {selectedReview.likes} likes</span>
                                <span>👎 {selectedReview.dislikes} dislikes</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
                            {!selectedReview.isApproved ? (
                                <button
                                    onClick={() => { handleApprove(selectedReview.id, true); setSelectedReview(null); }}
                                    disabled={actionLoading === selectedReview.id}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                                >
                                    <Check size={18} />
                                    <span>Approve</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => { handleApprove(selectedReview.id, false); setSelectedReview(null); }}
                                    disabled={actionLoading === selectedReview.id}
                                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
                                >
                                    <X size={18} />
                                    <span>Unapprove</span>
                                </button>
                            )}
                            <button
                                onClick={() => handleDelete(selectedReview.id)}
                                disabled={actionLoading === selectedReview.id}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                            >
                                <Trash2 size={18} />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
