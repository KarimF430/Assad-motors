'use client'

export default function FloatingWhatsApp() {
    const phoneNumber = '919945210466'
    const message = encodeURIComponent('Hi Assad Motors! I would like to know more about your cars.')
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="fixed bottom-[85px] right-4 z-[45] w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="w-7 h-7 fill-white"
            >
                <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.906 15.906 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.606c-.39 1.1-1.932 2.014-3.168 2.28-.846.18-1.95.324-5.67-1.218-4.762-1.972-7.824-6.81-8.062-7.126-.228-.316-1.918-2.556-1.918-4.876s1.214-3.458 1.644-3.932c.43-.474.94-.592 1.252-.592.312 0 .624.002.898.016.288.014.674-.11 1.054.804.39.94 1.328 3.244 1.444 3.478.118.234.196.508.04.818-.156.312-.234.508-.468.782-.234.274-.492.612-.702.82-.234.234-.478.488-.206.958.274.468 1.216 2.006 2.612 3.25 1.794 1.598 3.306 2.094 3.774 2.328.468.234.742.196 1.016-.118.274-.312 1.174-1.37 1.488-1.838.312-.468.626-.39 1.056-.234.43.156 2.734 1.29 3.202 1.526.468.234.78.352.898.546.118.196.118 1.126-.274 2.228z" />
            </svg>
        </a>
    )
}
