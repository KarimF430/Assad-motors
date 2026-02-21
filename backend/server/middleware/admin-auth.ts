export const requireAdmin = (req: any, res: any, next: any) => {
    // Get admin emails from environment variable
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];

    // Get current user's email from session
    const userEmail = req.session?.userEmail;

    // Check if user is logged in
    if (!userEmail) {
        return res.status(401).json({
            message: 'Authentication required. Please log in.'
        });
    }

    // Check if user is an admin
    if (!adminEmails.includes(userEmail)) {
        return res.status(403).json({
            message: 'Admin access required. You do not have permission to access this resource.'
        });
    }

    // User is authenticated and is an admin
    next();
};

export default requireAdmin;
