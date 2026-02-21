import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
    Check,
    X,
    Trash2,
    Eye,
    Star,
    Search,
    MessageSquare,
    ThumbsUp,
    ThumbsDown
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Review {
    id: string;
    brandSlug: string;
    modelSlug: string;
    variantSlug?: string;
    userName: string;
    userEmail: string;
    drivingExperience: string;
    reviewTitle: string;
    reviewText: string;
    overallRating: number;
    starRatings?: Record<string, number>;
    likes: number;
    dislikes: number;
    isApproved: boolean;
    isVerified: boolean;
    images?: string[];
    createdAt: string;
}

interface ReviewStats {
    total: number;
    approved: number;
    pending: number;
    averageRating: number;
}

export default function Reviews() {
    const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch reviews
    const { data: reviewsData, isLoading: isLoadingReviews } = useQuery({
        queryKey: ["/api/admin/reviews", filter, searchQuery],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filter === 'approved') params.set('isApproved', 'true');
            else if (filter === 'pending') params.set('isApproved', 'false');
            if (searchQuery) params.set('search', searchQuery);

            const res = await apiRequest("GET", `/api/admin/reviews?${params.toString()}`);
            return res.json();
        },
    });

    // Fetch stats
    const { data: statsData } = useQuery({
        queryKey: ["/api/admin/reviews/stats/summary"],
        queryFn: async () => {
            const res = await apiRequest("GET", "/api/admin/reviews/stats/summary");
            return res.json();
        }
    });

    const reviews = reviewsData?.data?.reviews || [];
    const stats = statsData?.data || { total: 0, approved: 0, pending: 0, averageRating: 0 };

    // Mutations
    const approveMutation = useMutation({
        mutationFn: async ({ id, isApproved }: { id: string; isApproved: boolean }) => {
            await apiRequest("PATCH", `/api/admin/reviews/${id}/approve`, { isApproved });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
            queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews/stats/summary"] });
            toast({
                title: "Success",
                description: "Review status updated successfully"
            });
            setSelectedReview(null);
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update review status"
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiRequest("DELETE", `/api/admin/reviews/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
            queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews/stats/summary"] });
            toast({
                title: "Success",
                description: "Review deleted successfully"
            });
            setSelectedReview(null);
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete review"
            });
        }
    });

    const calculateOverallRating = (review: Review): number => {
        if (review.overallRating) return review.overallRating;
        if (review.starRatings) {
            const values = Object.values(review.starRatings);
            if (values.length > 0) {
                return values.reduce((a, b) => a + b, 0) / values.length;
            }
        }
        return 0;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Reviews Management</h2>
                    <p className="text-muted-foreground">Approve, reject and manage user reviews</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Total Reviews</h3>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Approved</h3>
                        <Check className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold">{stats.approved}</div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Pending</h3>
                        <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                    </div>
                    <div className="text-2xl font-bold">{stats.pending}</div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Avg Rating</h3>
                        <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search reviews..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select
                    value={filter}
                    onValueChange={(value: any) => setFilter(value)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Reviews</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Reviews Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Review</TableHead>
                            <TableHead className="hidden md:table-cell">Model</TableHead>
                            <TableHead className="hidden lg:table-cell">Rating</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden sm:table-cell">Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoadingReviews ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    Loading reviews...
                                </TableCell>
                            </TableRow>
                        ) : reviews.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No reviews found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            reviews.map((review: Review) => (
                                <TableRow key={review.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{review.userName}</span>
                                            <span className="text-xs text-muted-foreground">{review.userEmail}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[300px]">
                                        <div className="flex flex-col space-y-1">
                                            <span className="font-medium truncate">{review.reviewTitle}</span>
                                            <span className="text-xs text-muted-foreground truncate">{review.reviewText}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {review.brandSlug} / {review.modelSlug}
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        <div className="flex items-center gap-1">
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            <span>{calculateOverallRating(review).toFixed(1)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={review.isApproved ? "default" : "secondary"} className={review.isApproved ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"}>
                                            {review.isApproved ? "Approved" : "Pending"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        {format(new Date(review.createdAt), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={() => setSelectedReview(review)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                {selectedReview?.id === review.id && (
                                                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                                        <DialogHeader>
                                                            <DialogTitle>Review Details</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="grid gap-6 py-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold">
                                                                        {review.userName[0].toUpperCase()}
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-bold">{review.userName}</h3>
                                                                        <p className="text-sm text-muted-foreground">{review.userEmail}</p>
                                                                        <p className="text-xs text-muted-foreground">{review.drivingExperience}</p>
                                                                    </div>
                                                                </div>
                                                                <Badge variant={review.isApproved ? "default" : "secondary"}>
                                                                    {review.isApproved ? "Approved" : "Pending"}
                                                                </Badge>
                                                            </div>

                                                            <div className="rounded-lg bg-muted p-4">
                                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                                    <div>
                                                                        <span className="font-medium">Car:</span> {review.brandSlug} {review.modelSlug}
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-medium">Variant:</span> {review.variantSlug || 'N/A'}
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-medium">Date:</span> {format(new Date(review.createdAt), "PPP p")}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <div className="flex items-center gap-2 mb-4">
                                                                    <h3 className="text-xl font-bold">{review.reviewTitle}</h3>
                                                                    <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded text-yellow-800 text-sm font-bold">
                                                                        <Star className="h-3 w-3 fill-yellow-800" />
                                                                        {calculateOverallRating(review).toFixed(1)}
                                                                    </div>
                                                                </div>
                                                                <p className="text-gray-700 whitespace-pre-wrap">{review.reviewText}</p>
                                                            </div>

                                                            {review.starRatings && (
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    {Object.entries(review.starRatings).map(([key, value]) => (
                                                                        <div key={key} className="flex justify-between items-center text-sm border p-2 rounded">
                                                                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                                                            <div className="flex items-center gap-1">
                                                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                                                <span>{value}</span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {review.images && review.images.length > 0 && (
                                                                <div>
                                                                    <h4 className="font-medium mb-2">Images</h4>
                                                                    <div className="flex gap-2 flex-wrap">
                                                                        {review.images.map((img, i) => (
                                                                            <img key={i} src={img} alt={`Review ${i + 1}`} className="h-24 w-24 object-cover rounded-lg border" />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className="flex gap-4 text-sm text-muted-foreground">
                                                                <div className="flex items-center gap-1">
                                                                    <ThumbsUp className="h-4 w-4" /> {review.likes} Likes
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <ThumbsDown className="h-4 w-4" /> {review.dislikes} Dislikes
                                                                </div>
                                                            </div>

                                                            <div className="flex justify-end gap-2 pt-4 border-t">
                                                                {!review.isApproved ? (
                                                                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => approveMutation.mutate({ id: review.id, isApproved: true })}>
                                                                        <Check className="mr-2 h-4 w-4" /> Approve
                                                                    </Button>
                                                                ) : (
                                                                    <Button variant="outline" onClick={() => approveMutation.mutate({ id: review.id, isApproved: false })}>
                                                                        <X className="mr-2 h-4 w-4" /> Unapprove
                                                                    </Button>
                                                                )}
                                                                <Button variant="destructive" onClick={() => {
                                                                    if (confirm('Are you sure you want to delete this review?')) {
                                                                        deleteMutation.mutate(review.id);
                                                                    }
                                                                }}>
                                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                )}
                                            </Dialog>

                                            {!review.isApproved && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    onClick={() => approveMutation.mutate({ id: review.id, isApproved: true })}
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            )}

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this review?')) {
                                                        deleteMutation.mutate(review.id);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
