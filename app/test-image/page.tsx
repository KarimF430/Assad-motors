import Image from 'next/image'

export default function TestImagePage() {
    return (
        <div className="p-10 bg-white">
            <h1>Image Test</h1>

            <div className="mb-8">
                <h2>Standard &lt;img&gt; tag</h2>
                <img
                    src="/images/showcase/sierra-olive.png"
                    alt="Standard img tag"
                    width={500}
                />
            </div>

            <div className="mb-8">
                <h2>Next.js &lt;Image&gt; component</h2>
                <Image
                    src="/images/showcase/sierra-olive.png"
                    alt="Next.js Image component"
                    width={500}
                    height={300}
                />
            </div>
        </div>
    )
}
