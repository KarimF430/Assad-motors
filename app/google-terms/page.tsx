import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
    title: 'Google Terms of Service | gadizone',
    description: 'Redirecting to Google Terms of Service',
}

export default function GoogleTermsPage() {
    // Redirect to Google's official Terms of Service
    redirect('https://policies.google.com/terms')
}
