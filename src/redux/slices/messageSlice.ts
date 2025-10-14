// redux/messageSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Định nghĩa kiểu cho một message
interface MessageItem {
    _id?: string;
    text?: string;
    senderId?: string;
    createdAt?: string;
    // thêm các trường khác nếu cần
}

// Kiểu cho selectedMessage hoặc storage message
interface ConversationMessage {
    conversationId: string | null;
    message: MessageItem[];
}

// Kiểu cho toàn bộ state
interface MessageState {
    arrayMessage: ConversationMessage[];
    selectedMessage: ConversationMessage;
}

const initState: MessageState = {
    arrayMessage: [],
    selectedMessage: {
        conversationId: null,
        message: [],
    },
};

const messageSlice = createSlice({
    name: 'message',
    initialState: initState,
    reducers: {
        addMessage: (state, action: PayloadAction<{ messages: MessageItem[] }>) => {
            state.selectedMessage.message = [...action.payload.messages, ...state.selectedMessage.message];
        },
        newMessage: (state, action: PayloadAction<MessageItem & { conversationId: string }>) => {
            const conversationId = action.payload.conversationId;
            if (state.selectedMessage.conversationId === conversationId) {
                state.selectedMessage.message = [...state.selectedMessage.message, action.payload];
            } else {
                const message = state.arrayMessage.find((c) => c.conversationId === conversationId);
                if (message) {
                    message.message = [...message.message, action.payload];
                }
            }
        },
        setSelectedMessage: (state, action: PayloadAction<string>) => {
            const message = state.arrayMessage.find((c) => c.conversationId === action.payload);
            const s = state.arrayMessage.find((c) => c.conversationId === state.selectedMessage.conversationId);

            if (s) {
                s.message = state.selectedMessage.message;
            }

            if (message) {
                state.selectedMessage = message;
            } else {
                const newConversation: ConversationMessage = {
                    conversationId: action.payload,
                    message: [],
                };
                state.arrayMessage.push(newConversation);
                state.selectedMessage = newConversation;
            }
        },
    },
});

export const { addMessage, setSelectedMessage, newMessage } = messageSlice.actions;
export default messageSlice.reducer;
