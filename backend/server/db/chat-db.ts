import mongoose from 'mongoose';

// Define the connection globally so it can be reused
let chatConnection: mongoose.Connection | null = null;

export const getChatConnection = async (): Promise<mongoose.Connection | null> => {
    if (chatConnection) return chatConnection;

    const uri = process.env.MONGODB_CHAT_URI;
    if (!uri) {
        console.warn('⚠️ MONGODB_CHAT_URI not set. Chat history will NOT be saved (Falling back to in-memory/no-op).');
        return null;
    }

    try {
        chatConnection = mongoose.createConnection(uri, {
            autoIndex: true,
            maxPoolSize: 10
        });

        chatConnection.on('connected', () => console.log('✅ Connected to Secondary Chat Database'));
        chatConnection.on('error', (err) => console.error('❌ Chat Database Connection Error:', err));

        return chatConnection;
    } catch (error) {
        console.error('Failed to create chat connection:', error);
        return null; // Graceful fallback
    }
};

// ==================== SCHEMAS ====================

const messageSchema = new mongoose.Schema({
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    // Optional: metadata for rich UI (e.g., specific car cards shown)
    metadata: { type: mongoose.Schema.Types.Mixed, default: null }
});

const conversationSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Custom UUID
    userId: { type: String, required: false, index: true }, // Link to main User (optional for guest)
    title: { type: String, required: true, default: 'New Conversation' },

    // The "Expert Memory" State
    state: {
        budget: { type: Number, default: null },
        usage: { type: String, default: null },
        familySize: { type: Number, default: null },
        city: { type: String, default: null }
    },

    messages: [messageSchema],

    lastUpdated: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false }
});

// Indexes
conversationSchema.index({ userId: 1, lastUpdated: -1 }); // Get user history sorted by date
conversationSchema.index({ id: 1 });

// ==================== MODELS ====================

// Helper to get models attached to the correct connection
export const getChatModels = async () => {
    const conn = await getChatConnection();

    if (!conn) {
        // Mock Schema/Model to prevent crashes
        class MockConversation {
            id: string;
            messages: any[] = [];
            state: any = {};
            lastUpdated: Date = new Date();

            constructor(data: any) {
                this.id = data?.id || 'mock-id';
                this.messages = data?.messages || [];
                this.state = data?.state || {};
            }

            async save() { return null; }

            static findOne() { return Promise.resolve(null); }
            static find() { return Promise.resolve([]); }
            static create() { return Promise.resolve(null); }
        }

        return {
            Conversation: MockConversation as any
        };
    }

    return {
        Conversation: conn.model('Conversation', conversationSchema)
    };
};
