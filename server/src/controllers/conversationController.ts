import { Request, Response } from 'express';
import Conversation from '../models/Conversation';

export const getConversations = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const conversations = await Conversation.find({ userId: req.user.id })
      .select('_id title createdAt updatedAt')
      .sort({ updatedAt: -1 });

    return res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return res.status(500).json({ message: 'Failed to fetch conversations' });
  }
};

/**
 * Create a new conversation
 */
export const createConversation = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { title } = req.body as { title: string };

    const conversation = await Conversation.create({
      title: title || 'New Conversation',
      userId: req.user.id,
      messages: [],
    });

    return res.status(201).json({
      _id: conversation._id,
      title: conversation.title,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return res.status(500).json({ message: 'Failed to create conversation' });
  }
};

/**
 * Get messages for a specific conversation
 */
export const getConversationMessages = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;

    const conversation = await Conversation.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    return res.json({ messages: conversation.messages });
  } catch (error) {
    console.error('Error fetching conversation messages:', error);
    return res
      .status(500)
      .json({ message: 'Failed to fetch conversation messages' });
  }
};

/**
 * Delete a conversation
 */
export const deleteConversation = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;

    const result = await Conversation.deleteOne({
      _id: id,
      userId: req.user.id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    return res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return res.status(500).json({ message: 'Failed to delete conversation' });
  }
};
