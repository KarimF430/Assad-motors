import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import BlockEditor, { ContentBlock } from "@/components/BlockEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
  Calendar,
  Tag,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { uploadImage } from "@/lib/imageUpload";

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface CarModel {
  id: string;
  name: string;
  brand: string;
}

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  contentBlocks: ContentBlock[];
  categoryId: string;
  tags: string[];
  linkedCars: string[];
  featuredImage: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  status: string;
  publishDate: string;
  isFeatured: boolean;
  isBreaking: boolean;
}

export default function NewsForm() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/news/:id/edit");
  const isEditing = !!match;
  const articleId = params?.id;
  
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [carModels, setCarModels] = useState<CarModel[]>([]);

  // Form state with localStorage persistence
  const [formData, setFormData] = useState(() => {
    // Try to load saved draft from localStorage
    const savedDraft = localStorage.getItem('newsArticleDraft');
    if (savedDraft) {
      try {
        return JSON.parse(savedDraft);
      } catch (e) {
        console.error('Failed to parse saved draft:', e);
      }
    }
    // Default state if no saved draft
    return {
      title: "",
      slug: "",
      excerpt: "",
      contentBlocks: [] as ContentBlock[],
      categoryId: "",
      tags: [] as string[],
      linkedCars: [] as string[],
      featuredImage: "",
      seoTitle: "",
      seoDescription: "",
      seoKeywords: [] as string[],
      status: "draft",
      publishDate: new Date().toISOString().split("T")[0],
      isFeatured: false,
      isBreaking: false,
    };
  });

  const [newTag, setNewTag] = useState("");
  const [newKeyword, setNewKeyword] = useState("");

  // Load categories, tags, and car models
  useEffect(() => {
    loadData();
  }, []);

  // Load article data when editing (don't use localStorage for edit mode)
  useEffect(() => {
    if (isEditing && articleId) {
      loadArticle(articleId);
    }
  }, [isEditing, articleId]);

  const loadArticle = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/articles/${id}`);
      if (response.ok) {
        const article = await response.json();
        setFormData({
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          contentBlocks: article.contentBlocks || [],
          categoryId: article.categoryId || "",
          tags: article.tags || [],
          linkedCars: article.linkedCars || [],
          featuredImage: article.featuredImage || "",
          seoTitle: article.seoTitle || "",
          seoDescription: article.seoDescription || "",
          seoKeywords: article.seoKeywords || [],
          status: article.status,
          publishDate: article.publishDate.split('T')[0],
          isFeatured: article.isFeatured,
          isBreaking: article.isBreaking,
        });
      }
    } catch (error) {
      console.error('Error loading article:', error);
      toast({
        title: "Error",
        description: "Failed to load article",
        variant: "destructive",
      });
    }
  };

  // Auto-save to localStorage whenever formData changes (but not in edit mode)
  useEffect(() => {
    if (!isEditing) {
      localStorage.setItem('newsArticleDraft', JSON.stringify(formData));
    }
  }, [formData, isEditing]);

  const loadData = async () => {
    try {
      // Fetch categories (no auth required now)
      const categoriesRes = await fetch('/api/admin/categories');
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        console.log('Categories loaded:', categoriesData);
        setCategories(categoriesData.map((cat: any) => ({
          id: cat.id,
          name: cat.name
        })));
      } else {
        console.error('Failed to load categories:', categoriesRes.status);
        toast({
          title: "Warning",
          description: "Failed to load categories. Please refresh the page.",
          variant: "destructive",
        });
      }

      // Fetch tags (no auth required now)
      const tagsRes = await fetch('/api/admin/tags');
      if (tagsRes.ok) {
        const tagsData = await tagsRes.json();
        console.log('Tags loaded:', tagsData);
        setTags(tagsData.map((tag: any) => ({
          id: tag.id,
          name: tag.name
        })));
      }

      // Fetch car models
      const modelsRes = await fetch('/api/models');
      if (modelsRes.ok) {
        const modelsData = await modelsRes.json();
        console.log('Car models loaded:', modelsData);
        setCarModels(modelsData.map((model: any) => ({
          id: model.id,
          name: model.name,
          brand: model.brandId
        })));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load form data. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
        .replace(/(^-|-$)/g, ""); // Remove leading/trailing hyphens
      setFormData((prev: FormData) => ({ ...prev, slug }));
    }
  }, [formData.title]);

  // Auto-fill SEO fields if empty
  useEffect(() => {
    if (formData.title && !formData.seoTitle) {
      setFormData((prev: FormData) => ({ ...prev, seoTitle: formData.title }));
    }
    if (formData.excerpt && !formData.seoDescription) {
      setFormData((prev: FormData) => ({ ...prev, seoDescription: formData.excerpt }));
    }
  }, [formData.title, formData.excerpt]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: FormData) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev: FormData) => ({ ...prev, [name]: checked }));
  };

  const addTag = (tagId: string) => {
    if (!formData.tags.includes(tagId)) {
      setFormData((prev: FormData) => ({
        ...prev,
        tags: [...prev.tags, tagId],
      }));
    }
  };

  const removeTag = (tagId: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      tags: prev.tags.filter((id: string) => id !== tagId),
    }));
  };

  const addLinkedCar = (carId: string) => {
    if (!formData.linkedCars.includes(carId)) {
      setFormData((prev: FormData) => ({
        ...prev,
        linkedCars: [...prev.linkedCars, carId],
      }));
    }
  };

  const removeLinkedCar = (carId: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      linkedCars: prev.linkedCars.filter((id: string) => id !== carId),
    }));
  };

  const addKeyword = () => {
    if (newKeyword && !formData.seoKeywords.includes(newKeyword)) {
      setFormData((prev: FormData) => ({
        ...prev,
        seoKeywords: [...prev.seoKeywords, newKeyword],
      }));
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      seoKeywords: prev.seoKeywords.filter((k: string) => k !== keyword),
    }));
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadedUrl = await uploadImage(file);
      if (!uploadedUrl) throw new Error('Upload failed');
      setFormData((prev: FormData) => ({ ...prev, featuredImage: uploadedUrl }));
      toast({ title: "Image uploaded", description: "Featured image uploaded successfully" });
    } catch (err) {
      toast({ title: "Upload failed", description: "Could not upload featured image.", variant: "destructive" });
    }
  };

  const handleSubmit = async (status: string) => {
    setLoading(true);

    try {
      // Validation - only title is required
      if (!formData.title) {
        toast({
          title: "Validation Error",
          description: "Title is required",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Prepare article data for backend
      const articleData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        contentBlocks: formData.contentBlocks,
        categoryId: formData.categoryId,
        tags: formData.tags,
        linkedCars: formData.linkedCars,
        featuredImage: formData.featuredImage,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        seoKeywords: formData.seoKeywords,
        status,
        publishDate: formData.publishDate,
        isFeatured: formData.isFeatured,
        isBreaking: formData.isBreaking,
      };

      console.log("Submitting article:", articleData);
      
      // Call backend API (no auth required now)
      const url = isEditing ? `/api/admin/articles/${articleId}` : '/api/admin/articles';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save article');
      }

      const savedArticle = await response.json();

      // Clear the saved draft from localStorage
      localStorage.removeItem('newsArticleDraft');

      toast({
        title: "Success!",
        description: `Article ${status === "published" ? "published" : "saved as draft"} successfully`,
      });

      navigate("/news");
    } catch (error) {
      console.error('Save article error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save article",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/news")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{isEditing ? 'Edit Article' : 'Add New Article'}</h1>
            <p className="text-muted-foreground mt-1">
              {isEditing ? 'Update your article' : 'Create a new article for your readers'}
              <span className="ml-2 text-xs text-green-600">● Auto-saved</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleSubmit("draft")} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={() => handleSubmit("published")} disabled={loading}>
            <Eye className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter article title"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="article-url-slug"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Auto-generated from title. Edit if needed.
                </p>
              </div>

              <div>
                <Label htmlFor="excerpt">
                  Excerpt
                </Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Brief description of the article"
                  rows={3}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Block-Based Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle>
                Article Content
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Add unlimited text, images, headings, lists, and more. Drag to reorder blocks.
              </p>
            </CardHeader>
            <CardContent>
              <BlockEditor
                blocks={formData.contentBlocks}
                onChange={(blocks) =>
                  setFormData((prev: FormData) => ({ ...prev, contentBlocks: blocks }))
                }
              />
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Featured Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.featuredImage ? (
                <div className="relative">
                  <img
                    src={formData.featuredImage}
                    alt="Featured"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      setFormData((prev: FormData) => ({ ...prev, featuredImage: "" }))
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload featured image
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="max-w-xs mx-auto"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  name="seoTitle"
                  value={formData.seoTitle}
                  onChange={handleInputChange}
                  placeholder="SEO optimized title"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  name="seoDescription"
                  value={formData.seoDescription}
                  onChange={handleInputChange}
                  placeholder="SEO meta description"
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>SEO Keywords</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Add keyword"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                  />
                  <Button type="button" onClick={addKeyword}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.seoKeywords.map((keyword: string) => (
                    <Badge key={keyword} variant="secondary">
                      {keyword}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => removeKeyword(keyword)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Publish Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="publishDate">Publish Date</Label>
                <Input
                  id="publishDate"
                  name="publishDate"
                  type="date"
                  value={formData.publishDate}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isFeatured">Featured Article</Label>
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("isFeatured", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isBreaking">Breaking News</Label>
                <Switch
                  id="isBreaking"
                  checked={formData.isBreaking}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("isBreaking", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => handleSelectChange("categoryId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select onValueChange={addTag}>
                <SelectTrigger>
                  <SelectValue placeholder="Add tags" />
                </SelectTrigger>
                <SelectContent>
                  {tags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tagId: string) => {
                  const tag = tags.find((t: Tag) => t.id === tagId);
                  return tag ? (
                    <Badge key={tagId} variant="secondary">
                      {tag.name}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => removeTag(tagId)}
                      />
                    </Badge>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>

          {/* Linked Cars */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Linked Cars
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select onValueChange={addLinkedCar}>
                <SelectTrigger>
                  <SelectValue placeholder="Link car models" />
                </SelectTrigger>
                <SelectContent>
                  {carModels.map((car) => (
                    <SelectItem key={car.id} value={car.id}>
                      {car.brand} {car.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="space-y-2">
                {formData.linkedCars.map((carId: string) => {
                  const car = carModels.find((c) => c.id === carId);
                  return car ? (
                    <div
                      key={carId}
                      className="flex items-center justify-between p-2 bg-secondary rounded"
                    >
                      <span className="text-sm">
                        {car.brand} {car.name}
                      </span>
                      <X
                        className="h-4 w-4 cursor-pointer"
                        onClick={() => removeLinkedCar(carId)}
                      />
                    </div>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
