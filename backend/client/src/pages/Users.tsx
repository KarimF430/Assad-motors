import { useState, useEffect } from 'react';
import { Download, Users as UsersIcon, UserCheck, TrendingUp, Mail } from 'lucide-react';
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

interface UserStats {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    googleUsers: number;
    emailUsers: number;
    verifiedUsers: number;
    newThisMonth: number;
    activeLastWeek: number;
}

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: string;
    googleId?: string;
    isActive: boolean;
    isEmailVerified: boolean;
    createdAt: string;
    lastLogin?: string;
}

export default function Users() {
    const [stats, setStats] = useState<UserStats | null>(null);
    const [recentUsers, setRecentUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch statistics
            const statsRes = await fetch(`${backendUrl}/api/admin/users/stats`, {
                credentials: 'include',
            });
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            }

            // Fetch recent users
            const usersRes = await fetch(`${backendUrl}/api/admin/users/recent?limit=20`, {
                credentials: 'include',
            });
            if (usersRes.ok) {
                const usersData = await usersRes.json();
                setRecentUsers(usersData.users);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadCSV = async () => {
        try {
            setDownloading(true);
            const response = await fetch(`${backendUrl}/api/admin/users/export`, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Download failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading user data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">
                        Manage and export frontend user accounts
                    </p>
                </div>
                <Button
                    onClick={downloadCSV}
                    disabled={downloading}
                    className="gap-2"
                >
                    <Download className="h-4 w-4" />
                    {downloading ? 'Downloading...' : 'Export CSV'}
                </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            All registered users
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.activeUsers || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Currently active accounts
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New This Month</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.newThisMonth || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Registered this month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Google OAuth</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.googleUsers || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Signed in with Google
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Email/Password Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.emailUsers || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Verified Emails</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.verifiedUsers || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Active Last Week</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.activeLastWeek || 0}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Users</CardTitle>
                    <CardDescription>
                        Latest registered users on your platform
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Auth Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Last Login</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                                                {user.firstName?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            {user.firstName} {user.lastName}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.googleId ? "default" : "secondary"}>
                                            {user.googleId ? 'Google' : 'Email'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.isActive ? "default" : "destructive"}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground">
                                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {recentUsers.length === 0 && (
                        <div className="text-center py-12">
                            <UsersIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                            <p className="mt-2 text-sm text-muted-foreground">No users found</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
