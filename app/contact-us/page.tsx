import { Metadata } from 'next'
import ContactForm from './ContactForm'

import Breadcrumb from '@/components/common/Breadcrumb'

export const metadata: Metadata = {
    title: 'Contact Us - assadmotors',
    description: 'Get in touch with the assadmotors team. We are here to help with your car buying journey, feedback, and support queries.',
    alternates: {
        canonical: '/contact-us',
    },
}

export default function ContactUsPage() {
    return (
        <>
            <ContactForm />
            <Breadcrumb items={[{ label: 'Contact Us' }]} />
            
        </>
    )
}
