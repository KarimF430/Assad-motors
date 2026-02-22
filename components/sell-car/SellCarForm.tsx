'use client'

import React, { useState, useRef } from 'react'
import { X, Upload, Check, Loader2, ArrowRight, Camera, User, Phone, MapPin, Calendar, Gauge, Info, Car, Sparkles, ShieldCheck, Zap, Fuel, Settings2, Heart, MessageCircle, Star } from 'lucide-react'
import styles from './SellCarForm.module.css'

export default function SellCarForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [otpSent, setOtpSent] = useState(false)

    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        fuel: 'Petrol',
        transmission: 'Manual',
        variant: '',
        regYear: '',
        ownership: '1st Owner',
        kilometers: '',
        city: '',
        name: '',
        phone: '',
        otp: ''
    })

    const [images, setImages] = useState({
        gallery: [] as { file: File, preview: string }[],
        highlights: [] as { file: File, preview: string }[],
        interior: [] as { file: File, preview: string }[],
        boot: [] as { file: File, preview: string }[]
    })

    const fileInputRefs = {
        gallery: useRef<HTMLInputElement>(null),
        highlights: useRef<HTMLInputElement>(null),
        interior: useRef<HTMLInputElement>(null),
        boot: useRef<HTMLInputElement>(null)
    }

    const handleFileChange = (category: keyof typeof images, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }))
            setImages(prev => ({
                ...prev,
                [category]: [...prev[category], ...newFiles]
            }))
        }
    }

    const handleSendOTP = () => {
        if (formData.phone.length === 10) {
            setOtpSent(true)
            alert('OTP sent to ' + formData.phone + ' (Simulated: 123456)')
        } else {
            alert('Please enter a valid 10-digit mobile number')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!otpSent) return handleSendOTP()

        setIsSubmitting(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsSubmitting(false)
        setIsSuccess(true)

        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const fuelTypes = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid']
    const transmissionTypes = ['Manual', 'Automatic', 'AMT', 'CVT', 'DCT']
    const ownershipTypes = ['1st Owner', '2nd Owner', '3rd Owner', '4th+ Owner']

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: currentYear - 1999 }, (_, i) => (currentYear - i).toString())

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-8 animate-in fade-in duration-700">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1c144a]">Request Received!</h2>
                <p className="text-gray-500 text-lg max-w-lg mx-auto leading-relaxed">
                    Thank you for your interest. Our team will review your car details and contact you within 24 hours to proceed with the valuation.
                </p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="bg-[#291e6a] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#1c144a] transition-all"
                >
                    Back to Home
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className={styles.formWrapper}>
            <div className={styles.formHeader}>
                <h2>Sell Your Car</h2>
                <p>Please provide the details below for a professional valuation.</p>
            </div>

            <div className={styles.formBody}>
                {/* 1. Basic Specifications */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h3>Basic Specifications</h3>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.inputGroup}>
                            <label>Brand</label>
                            <input
                                type="text"
                                placeholder="e.g. BMW, Maruti Suzuki"
                                required
                                value={formData.brand}
                                onChange={e => setFormData({ ...formData, brand: e.target.value })}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Model</label>
                            <input
                                type="text"
                                placeholder="e.g. X5, Swift"
                                required
                                value={formData.model}
                                onChange={e => setFormData({ ...formData, model: e.target.value })}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Variant</label>
                            <input
                                type="text"
                                placeholder="e.g. xDrive30d Luxury"
                                required
                                value={formData.variant}
                                onChange={e => setFormData({ ...formData, variant: e.target.value })}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Registration Year</label>
                            <select
                                required
                                value={formData.regYear}
                                onChange={e => setFormData({ ...formData, regYear: e.target.value })}
                            >
                                <option value="">Select Year</option>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="mt-8 space-y-6">
                        <div className={styles.inputGroup}>
                            <label>Fuel Type</label>
                            <div className={styles.tileGrid}>
                                {fuelTypes.map(f => (
                                    <div key={f} className={styles.tileItem}>
                                        <input
                                            type="radio"
                                            id={`fuel-${f}`}
                                            name="fuel"
                                            value={f}
                                            checked={formData.fuel === f}
                                            onChange={e => setFormData({ ...formData, fuel: e.target.value })}
                                        />
                                        <label htmlFor={`fuel-${f}`} className={styles.tileLabel}>
                                            {f}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Transmission</label>
                            <div className={styles.tileGrid}>
                                {transmissionTypes.map(t => (
                                    <div key={t} className={styles.tileItem}>
                                        <input
                                            type="radio"
                                            id={`trans-${t}`}
                                            name="transmission"
                                            value={t}
                                            checked={formData.transmission === t}
                                            onChange={e => setFormData({ ...formData, transmission: e.target.value })}
                                        />
                                        <label htmlFor={`trans-${t}`} className={styles.tileLabel}>
                                            {t}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Usage & History */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h3>Usage & History</h3>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.inputGroup}>
                            <label>Ownership</label>
                            <select
                                value={formData.ownership}
                                onChange={e => setFormData({ ...formData, ownership: e.target.value })}
                            >
                                {ownershipTypes.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Kilometers Driven</label>
                            <input
                                type="number"
                                placeholder="Total kilometers"
                                required
                                value={formData.kilometers}
                                onChange={e => setFormData({ ...formData, kilometers: e.target.value })}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>City</label>
                            <input
                                type="text"
                                placeholder="Current location"
                                required
                                value={formData.city}
                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Visual Inspection */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h3>Inspection Photos</h3>
                    </div>

                    <div className={styles.uploadGrid}>
                        <div className={styles.uploadCard} onClick={() => fileInputRefs.gallery.current?.click()}>
                            <Camera className="w-6 h-6 text-gray-400 mx-auto" />
                            <h4>Exterior</h4>
                            <p>{images.gallery.length} photos added</p>
                            <input type="file" multiple hidden ref={fileInputRefs.gallery} onChange={e => handleFileChange('gallery', e)} />
                            <div className={styles.previewScroll}>
                                {images.gallery.map((img, i) => (
                                    <img key={i} src={img.preview} alt="preview" className={styles.previewThumb} />
                                ))}
                            </div>
                        </div>

                        <div className={styles.uploadCard} onClick={() => fileInputRefs.highlights.current?.click()}>
                            <Sparkles className="w-6 h-6 text-gray-400 mx-auto" />
                            <h4>Highlights</h4>
                            <p>{images.highlights.length} photos added</p>
                            <input type="file" multiple hidden ref={fileInputRefs.highlights} onChange={e => handleFileChange('highlights', e)} />
                            <div className={styles.previewScroll}>
                                {images.highlights.map((img, i) => (
                                    <img key={i} src={img.preview} alt="preview" className={styles.previewThumb} />
                                ))}
                            </div>
                        </div>

                        <div className={styles.uploadCard} onClick={() => fileInputRefs.interior.current?.click()}>
                            <Settings2 className="w-6 h-6 text-gray-400 mx-auto" />
                            <h4>Interior</h4>
                            <p>{images.interior.length} photos added</p>
                            <input type="file" multiple hidden ref={fileInputRefs.interior} onChange={e => handleFileChange('interior', e)} />
                            <div className={styles.previewScroll}>
                                {images.interior.map((img, i) => (
                                    <img key={i} src={img.preview} alt="preview" className={styles.previewThumb} />
                                ))}
                            </div>
                        </div>

                        <div className={styles.uploadCard} onClick={() => fileInputRefs.boot.current?.click()}>
                            <Info className="w-6 h-6 text-gray-400 mx-auto" />
                            <h4>Storage & Boot</h4>
                            <p>{images.boot.length} photos added</p>
                            <input type="file" multiple hidden ref={fileInputRefs.boot} onChange={e => handleFileChange('boot', e)} />
                            <div className={styles.previewScroll}>
                                {images.boot.map((img, i) => (
                                    <img key={i} src={img.preview} alt="preview" className={styles.previewThumb} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Owner Information */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h3>Contact Information</h3>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.inputGroup}>
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="Your name"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Mobile Number</label>
                            <div className={styles.otpWrapper}>
                                <input
                                    type="tel"
                                    placeholder="10-digit number"
                                    required
                                    maxLength={10}
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={handleSendOTP}
                                    className={styles.sendOtpBtn}
                                >
                                    {otpSent ? 'Resend' : 'Send OTP'}
                                </button>
                            </div>
                        </div>
                        {otpSent && (
                            <div className={styles.inputGroup}>
                                <label>Verify OTP</label>
                                <input
                                    type="text"
                                    placeholder="Enter Code"
                                    required
                                    maxLength={6}
                                    value={formData.otp}
                                    onChange={e => setFormData({ ...formData, otp: e.target.value })}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Section */}
                <div className={styles.submitSection}>
                    <button
                        type="submit"
                        disabled={isSubmitting || (otpSent && !formData.otp)}
                        className={styles.submitBtn}
                    >
                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Submit Details <ArrowRight className="w-5 h-5" /></>}
                    </button>

                    <div className={styles.trustBadge}>
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                        <span>Trusted by 5,000+ Premium Sellers</span>
                    </div>
                </div>
            </div>
        </form>
    )
}
