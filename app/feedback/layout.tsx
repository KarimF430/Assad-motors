import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Share Your Feedback | assadmotors',
    description: 'Help us improve assadmotors! Share your feedback, report bugs, request features, or tell us about your experience. Your input shapes the future of our platform.',
    openGraph: {
        title: 'Share Your Feedback | assadmotors',
        description: 'Help us improve assadmotors! Share your feedback, report bugs, or request features.',
    },
}

export default function FeedbackLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
