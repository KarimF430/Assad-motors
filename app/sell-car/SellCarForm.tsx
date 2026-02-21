'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Check, ChevronDown, Loader2, Upload, X, ImageIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { CITY_COORDINATES } from '@/lib/city-coordinates'

interface Brand {
    id: string
    name: string
    logoUrl?: string
    status: string
}

interface Model {
    id: string
    name: string
    brandId: string
    status: string
}

export default function SellCarForm() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    // Data State
    const [brands, setBrands] = useState<Brand[]>([])
    const [models, setModels] = useState<Model[]>([])
    const [loadingBrands, setLoadingBrands] = useState(true)
    const [loadingModels, setLoadingModels] = useState(false)

    // Image State
    const [images, setImages] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Form State
    const [formData, setFormData] = useState({
        brandId: '',
        modelId: '',
        year: '',
        variant: '',
        kmDriven: '',
        city: '',
        name: '',
        mobile: ''
    })

    // Fetch Brands on Mount
    useEffect(() => {
        async function fetchBrands() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/brands`)
                const data = await res.json()
                if (Array.isArray(data)) {
                    setBrands(data.filter((b: any) => b.status === 'active'))
                }
            } catch (error) {
                console.error('Failed to fetch brands:', error)
            } finally {
                setLoadingBrands(false)
            }
        }
        fetchBrands()
    }, [])

    // Fetch Models when Brand Changes
    useEffect(() => {
        if (!formData.brandId) {
            setModels([])
            return
        }

        async function fetchModels() {
            setLoadingModels(true)
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/models?brandId=${formData.brandId}`)
                const data = await res.json()
                if (Array.isArray(data)) {
                    setModels(data.filter((m: any) => m.status === 'active'))
                }
            } catch (error) {
                console.error('Failed to fetch models:', error)
            } finally {
                setLoadingModels(false)
            }
        }
        fetchModels()
    }, [formData.brandId])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)
            if (images.length + newFiles.length > 5) {
                alert('You can upload a maximum of 5 images.')
                return
            }

            const newPreviews = newFiles.map(file => URL.createObjectURL(file))
            setImages(prev => [...prev, ...newFiles])
            setPreviews(prev => [...prev, ...newPreviews])
        }
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
        URL.revokeObjectURL(previews[index])
        setPreviews(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        console.log('Form Submitted:', { ...formData, images: images.map(f => f.name) })
        setLoading(false)
        setSuccess(true)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center max-w-lg mx-auto"
            >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing Submitted!</h2>
                <p className="text-gray-600 mb-8">
                    Your car has been successfully listed. Verification is typically completed within 2 hours.
                </p>
                <button
                    onClick={() => {
                        setSuccess(false)
                        setFormData({
                            brandId: '',
                            modelId: '',
                            year: '',
                            variant: '',
                            kmDriven: '',
                            city: '',
                            name: '',
                            mobile: ''
                        })
                        setImages([])
                        setPreviews([])
                    }}
                    className="text-[#FF6B35] font-semibold hover:text-[#ff5514] transition-colors"
                >
                    List another car
                </button>
            </motion.div>
        )
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-2xl mx-auto border border-gray-100/50 relative">
            <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C60] px-6 py-5 relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-xl font-bold text-white">List Your Car for Free</h2>
                    <p className="text-orange-50 text-sm mt-1">Connect with 10k+ genuine buyers instantly</p>
                </div>
                <div className="absolute right-0 top-0 h-full w-32 bg-white/10 skew-x-12 transform translate-x-16" />
            </div>

            <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-6 touch-manipulation">
                {/* Brand & Model Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Car Brand</label>
                        <div className="relative group">
                            <select
                                name="brandId"
                                value={formData.brandId}
                                onChange={handleChange}
                                required
                                className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] outline-none transition-all disabled:opacity-50 hover:border-gray-300"
                                disabled={loadingBrands}
                            >
                                <option value="">Select Brand</option>
                                {brands.map(brand => (
                                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3.5 top-3.5 w-5 h-5 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Car Model</label>
                        <div className="relative group">
                            <select
                                name="modelId"
                                value={formData.modelId}
                                onChange={handleChange}
                                required
                                className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] outline-none transition-all disabled:opacity-50 disabled:bg-gray-100 hover:border-gray-300"
                                disabled={!formData.brandId || loadingModels}
                            >
                                <option value="">Select Model</option>
                                {models.map(model => (
                                    <option key={model.id} value={model.id}>{model.name}</option>
                                ))}
                            </select>
                            {loadingModels ? (
                                <Loader2 className="absolute right-3.5 top-3.5 w-5 h-5 text-[#FF6B35] animate-spin" />
                            ) : (
                                <ChevronDown className="absolute right-3.5 top-3.5 w-5 h-5 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Year & Variant Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Registration Year</label>
                        <div className="relative group">
                            <select
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                required
                                className="appearance-none w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] outline-none transition-all hover:border-gray-300"
                            >
                                <option value="">Select Year</option>
                                {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3.5 top-3.5 w-5 h-5 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Variant (Optional)</label>
                        <input
                            type="text"
                            name="variant"
                            value={formData.variant}
                            onChange={handleChange}
                            placeholder="e.g. VXI, Titanium"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] outline-none transition-all hover:border-gray-300"
                        />
                    </div>
                </div>

                {/* KM Driven */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kilometers Driven</label>
                    <input
                        type="number"
                        name="kmDriven"
                        value={formData.kmDriven}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 45000"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] outline-none transition-all hover:border-gray-300"
                    />
                </div>

                {/* Image Upload Section */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Car Photos (Max 5)</label>

                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-2">
                        <AnimatePresence>
                            {previews.map((src, index) => (
                                <motion.div
                                    key={src}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
                                >
                                    <Image src={src} alt="Preview" fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white rounded-full p-1 transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {previews.length < 5 && (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-[#FF6B35] hover:bg-orange-50/50 flex flex-col items-center justify-center text-gray-400 hover:text-[#FF6B35] transition-all"
                            >
                                <Upload className="w-6 h-6 mb-1" />
                                <span className="text-xs font-medium">Add Photo</span>
                            </button>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        multiple
                        className="hidden"
                    />
                    <p className="text-xs text-gray-500">Adding photos increases authentic buyer interest by 40%</p>
                </div>


                <div className="border-t border-gray-100 my-4" />

                {/* Contact Info */}
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">City</label>
                        <div className="relative group">
                            <select
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] outline-none transition-all hover:border-gray-300"
                            >
                                <option value="">Select City</option>
                                {CITY_COORDINATES.map((city) => (
                                    <option key={city.slug} value={city.slug}>{city.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3.5 top-3.5 w-5 h-5 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your name"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] outline-none transition-all hover:border-gray-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile Number</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-3 text-gray-500 font-medium group-focus-within:text-[#FF6B35]">+91</span>
                            <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                                maxLength={10}
                                placeholder="Enter 10 digit number"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-base text-gray-900 focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] outline-none transition-all hover:border-gray-300"
                            />
                        </div>
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-green-600 bg-green-50 w-fit px-2 py-1 rounded">
                            <Check className="w-3 h-3" />
                            Verified buyers only
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#FF6B35] to-[#ff5514] hover:from-[#ff5514] hover:to-[#e0450b] text-white font-bold py-4 rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 shadow-lg shadow-orange-200 text-lg"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Listing your car...
                        </>
                    ) : (
                        'List My Car for Free'
                    )}
                </button>
            </form>
        </div>
    )
}
