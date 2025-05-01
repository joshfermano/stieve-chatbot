import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Conversation from '../models/Conversation';
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message, conversationId } = req.body as {
      message: string;
      conversationId?: string;
    };

    // Generate AI response
    try {
      const result = await model.generateContent(message);
      const text = result.response.text();

      // If no conversation ID or user ID, just return the response
      if (!conversationId || !req.user?.id) {
        return res.json({
          response: text,
          success: true,
        });
      }

      // Otherwise, try to save to existing conversation
    } catch (aiError) {
      console.error('AI generation error:', aiError);
      return res.status(500).json({
        message: 'Failed to generate AI response',
        success: false,
      });
    }

    // Get or create conversation
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Try to find the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: req.user.id,
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Generate AI response
    const result = await model.generateContent(message);
    const text = result.response.text();

    // Save the user message and AI response to the conversation
    conversation.messages.push(
      {
        role: 'user',
        content: message,
        timestamp: new Date(),
      },
      {
        role: 'assistant',
        content: text,
        timestamp: new Date(),
      }
    );

    await conversation.save();

    // Return the AI response
    return res.json({
      response: text,
      success: true,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error('Chat controller error:', error);
    return res.status(500).json({
      message: 'Failed to process chat message',
      success: false,
    });
  }
};
