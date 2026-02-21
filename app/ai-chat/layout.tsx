export default function ChatLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-screen w-full overflow-hidden bg-gray-50">
            {children}
        </div>
    )
}
