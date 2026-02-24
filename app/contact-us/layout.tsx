import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contact Us | assadmotors - Get in Touch',
    description: 'Have questions about cars or our services? Contact the assadmotors team. We\'re here to help with your car buying journey, technical support, and partnership inquiries.',
    openGraph: {
        title: 'Contact Us | assadmotors',
        description: 'Have questions about cars or our services? Contact the assadmotors team. We\'re here to help with your car buying journey.',
    },
}

export default function ContactUsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
