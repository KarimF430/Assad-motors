'use client';

import { useState, useEffect } from 'react';
import { Download, ArrowLeft, Search, Filter, Phone, Mail, MapPin, Calendar, Car } from 'lucide-react';
import Link from 'next/link';

interface ConsultationLead {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    city: string | null;
    budget: string | null;
    carInterest: string | null;
    plannedPurchaseDate: string | null;
    message: string | null;
    status: string;
    source: string;
    createdAt: string;
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<ConsultationLead[]>([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Use environment variable for backend URL, fallback to relative path /api
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${backendUrl}/api/admin/leads`, {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setLeads(data);
            } else {
                console.error('Failed to fetch leads');
            }
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadCSV = async () => {
        try {
            setDownloading(true);
            const response = await fetch(`${backendUrl}/api/admin/leads/export`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Download failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading CSV:', error);
            alert('Failed to download CSV. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
            lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.phone.includes(searchTerm) ||
            (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (lead.city && lead.city.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-800';
            case 'contacted': return 'bg-yellow-100 text-yellow-800';
            case 'closed': return 'bg-green-100 text-green-800';
            case 'lost': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Dealership Leads</h1>
                                <p className="text-sm text-gray-500">{leads.length} total leads found</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={fetchLeads}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Refresh
                            </button>
                            <button
                                onClick={downloadCSV}
                                disabled={downloading || leads.length === 0}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                <Download className="w-4 h-4" />
                                {downloading ? 'Exporting...' : 'Export CSV'}
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, phone, email, or city..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-500" />
                            <select
                                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="closed">Closed</option>
                                <option value="lost">Lost</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                        <p className="text-gray-500">Loading leads...</p>
                    </div>
                ) : filteredLeads.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No leads found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredLeads.map((lead) => (
                            <div key={lead.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-lg font-bold text-gray-900">{lead.name}</h3>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${getStatusColor(lead.status)}`}>
                                                    {lead.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(lead.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            {/* Action buttons could go here (e.g. edit status) */}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                <a href={`tel:${lead.phone}`} className="hover:text-green-600">{lead.phone}</a>
                                            </div>
                                            {lead.email && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                    <a href={`mailto:${lead.email}`} className="hover:text-green-600 truncate">{lead.email}</a>
                                                </div>
                                            )}
                                            {lead.city && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <MapPin className="w-4 h-4 text-gray-400" />
                                                    <span>{lead.city}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold text-gray-500 uppercase">Budget</p>
                                            <p className="font-medium text-gray-900">{lead.budget || 'Not specified'}</p>
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Car className="w-4 h-4 text-gray-400" />
                                                <p className="text-xs font-semibold text-gray-500 uppercase">Interested In</p>
                                            </div>
                                            <p className="font-medium text-gray-900">{lead.carInterest || 'Not specified'}</p>

                                            {lead.message && (
                                                <div className="mt-4 bg-gray-50 rounded-lg p-3 text-gray-600 text-sm whitespace-pre-wrap border border-gray-100">
                                                    {lead.message}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
