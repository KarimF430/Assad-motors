import { useState, useEffect } from 'react';
import { Download, Headphones, Calendar, Phone, Mail, MapPin, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

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

export default function Leads() {
    const [leads, setLeads] = useState<ConsultationLead[]>([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${backendUrl}/api/admin/leads`, {
                credentials: 'include',
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
                credentials: 'include',
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

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'new': return 'default';
            case 'contacted': return 'secondary';
            case 'closed': return 'outline';
            case 'lost': return 'destructive';
            default: return 'secondary';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading leads...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Consultation Leads</h1>
                    <p className="text-muted-foreground">Manage and export car expert consultation inquiries</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchLeads}>Refresh</Button>
                    <Button onClick={downloadCSV} disabled={downloading || leads.length === 0} className="bg-green-600 hover:bg-green-700 text-white">
                        <Download className="h-4 w-4 mr-2" />
                        {downloading ? 'Exporting...' : 'Export CSV'}
                    </Button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search name, phone, city..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <select className="flex h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                    <option value="lost">Lost</option>
                </select>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                        <Headphones className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{leads.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Leads</CardTitle>
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{leads.filter(l => l.status === 'new').length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Inquiries</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Lead Name</TableHead>
                                <TableHead>Contact Info</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Interest</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Submitted</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLeads.map((lead) => (
                                <TableRow key={lead.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                {lead.name?.[0]?.toUpperCase() || 'L'}
                                            </div>
                                            {lead.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <span>{lead.phone}</span>
                                            {lead.email && <span className="text-xs text-muted-foreground">{lead.email}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">{lead.city || 'N/A'}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <span className="font-medium">{lead.carInterest || 'Unspecified'}</span>
                                            <span className="text-xs text-muted-foreground">Budget: {lead.budget || 'N/A'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(lead.status) as any}>{lead.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-xs text-muted-foreground">
                                        {new Date(lead.createdAt).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
