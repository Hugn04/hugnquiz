// redux/conversationSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Conversation {
    _id: string | null;
    name?: string;
    isGroup?: boolean;
}

interface ConversationState {
    storageConversation: Conversation[];
    conversations: Conversation[];
    selectedConversation: Conversation | null;
}

const initState: ConversationState = {
    storageConversation: [],
    conversations: [],
    selectedConversation: { _id: null },
};

const conversationSlice = createSlice({
    name: 'conversation',
    initialState: initState,
    reducers: {
        addConversation: (state, action: PayloadAction<Conversation[]>) => {
            state.conversations.push(...action.payload);
            state.storageConversation.push(...action.payload);
        },
        filterAllGroup: (state, action: PayloadAction<boolean | null>) => {
            if (action.payload === null) {
                state.conversations = state.storageConversation;
                return;
            }
            const groupObjs = state.storageConversation.filter((item) => item.isGroup === action.payload);
            state.conversations = groupObjs;
        },
        searchConversation: (state, action: PayloadAction<string>) => {
            const matchedConversations = state.storageConversation.filter((item) =>
                item.name?.toLowerCase().includes(action.payload.toLowerCase()),
            );
            state.conversations = matchedConversations;
        },
        setSelectConversation: (state, action: PayloadAction<string>) => {
            const conversation = state.conversations.find((c) => c._id === action.payload) || null;
            state.selectedConversation = conversation;
        },
    },
});

export const { addConversation, setSelectConversation, filterAllGroup, searchConversation } = conversationSlice.actions;
export default conversationSlice.reducer;
