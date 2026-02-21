import { Metadata } from 'next'
import ContactForm from './ContactForm'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/common/Breadcrumb'

export const metadata: Metadata = {
    title: 'Contact Us - gadizone',
    description: 'Get in touch with the gadizone team. We are here to help with your car buying journey, feedback, and support queries.',
    alternates: {
        canonical: '/contact-us',
    },
}

export default function ContactUsPage() {
    return (
        <>
            <ContactForm />
            <Breadcrumb items={[{ label: 'Contact Us' }]} />
            <Footer />
        </>
    )
}
