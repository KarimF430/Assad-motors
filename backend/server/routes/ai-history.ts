import { Router } from 'express';
import { getChatModels } from '../db/chat-db';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Middleware to ensure chat DB is ready
const ensureChatDB = async (req: any, res: any, next: any) => {
    try {
        const models = await getChatModels();
        req.chatModels = models;
        next();
    } catch (error) {
        console.error('Chat DB not available:', error);
        res.status(503).json({ error: 'Chat history service unavailable' });
    }
};

/**
 * GET /api/chat/history
 * Fetch all conversations for a user
 */
router.get('/history', ensureChatDB, async (req: any, res) => {
    try {
        const userId = req.query.userId as string;
        // In future, get userId from session: req.session.userId

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const { Conversation } = req.chatModels;
        const history = await Conversation.find({ userId, isDeleted: false })
            .select('id title lastUpdated state')
            .sort({ lastUpdated: -1 })
            .limit(50);

        res.json(history);
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

/**
 * GET /api/chat/:id
 * Fetch a specific conversation
 */
router.get('/:id', ensureChatDB, async (req: any, res) => {
    try {
        const { id } = req.params;
        const { Conversation } = req.chatModels;

        const chat = await Conversation.findOne({ id, isDeleted: false });

        if (!chat) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        res.json(chat);
    } catch (error) {
        console.error('Get chat error:', error);
        res.status(500).json({ error: 'Failed to fetch conversation' });
    }
});

/**
 * POST /api/chat/message
 * Save a message to a conversation (or create new)
 */
router.post('/message', ensureChatDB, async (req: any, res) => {
    try {
        const { conversationId, message, userId, role, metadata, state } = req.body;
        const { Conversation } = req.chatModels;

        if (!message || !role) {
            return res.status(400).json({ error: 'Message and role are required' });
        }

        let chat;
        let isNew = false;

        if (conversationId) {
            chat = await Conversation.findOne({ id: conversationId });
        }

        if (!chat) {
            // Create new conversation
            isNew = true;
            const newId = conversationId || uuidv4();
            const title = message.substring(0, 50) + (message.length > 50 ? '...' : '');

            chat = new Conversation({
                id: newId,
                userId,
                title,
                messages: [],
                state: state || {}
            });
        }

        // Add message
        chat.messages.push({
            role,
            content: message,
            timestamp: new Date(),
            metadata
        });

        // Update state if provided
        if (state) {
            chat.state = { ...chat.state, ...state };
        }

        chat.lastUpdated = new Date();
        await chat.save();

        res.json({ success: true, conversationId: chat.id, isNew });

    } catch (error) {
        console.error('Save message error:', error);
        res.status(500).json({ error: 'Failed to save message' });
    }
});

/**
 * DELETE /api/chat/:id
 * Soft delete a conversation
 */
router.delete('/:id', ensureChatDB, async (req: any, res) => {
    try {
        const { id } = req.params;
        const { Conversation } = req.chatModels;

        const result = await Conversation.findOneAndUpdate(
            { id },
            { isDeleted: true },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Delete chat error:', error);
        res.status(500).json({ error: 'Failed to delete conversation' });
    }
});

export default router;
