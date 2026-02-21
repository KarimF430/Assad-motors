export default function DebugEnv() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Environment Variables Debug</h1>
            <div className="bg-gray-100 p-4 rounded">
                <p><strong>NEXT_PUBLIC_BACKEND_URL:</strong> {process.env.NEXT_PUBLIC_BACKEND_URL || 'NOT SET'}</p>
                <p><strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'NOT SET'}</p>
            </div>
        </div>
    )
}
