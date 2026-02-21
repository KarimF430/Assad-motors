
import React from 'react'
import { Check, X } from 'lucide-react'

interface ProsConsProps {
    pros: string[]
    cons: string[]
    className?: string
}

export default function ProsCons({ pros, cons, className = '' }: ProsConsProps) {
    if ((!pros || pros.length === 0) && (!cons || cons.length === 0)) return null

    return (
        <div className={`grid md:grid-cols-2 gap-6 ${className}`}>
            {/* Pros Section */}
            {pros && pros.length > 0 && (
                <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="w-5 h-5 text-green-600" strokeWidth={3} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Pros - What We Like</h3>
                    </div>
                    <ul className="space-y-3">
                        {pros.map((pro, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700 font-medium">{pro}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Cons Section */}
            {cons && cons.length > 0 && (
                <div className="bg-red-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                            <X className="w-5 h-5 text-red-600" strokeWidth={3} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Cons - What We Don't</h3>
                    </div>
                    <ul className="space-y-3">
                        {cons.map((con, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700 font-medium">{con}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
