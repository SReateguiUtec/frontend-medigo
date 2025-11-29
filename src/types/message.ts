// Message types
export interface Message {
    id: number;
    senderId: number;
    senderName: string;
    receiverId: number;
    receiverName: string;
    content: string;
    isRead: boolean;
    createdAt: string;
    senderProfilePicture?: string;
    receiverProfilePicture?: string;
}

export interface Conversation {
    userId: number;
    userName: string;
    userRole: string;
    lastMessage: string | null;
    lastMessageTime: string | null;
    unreadCount: number;
    profilePicture?: string;
}

export interface SendMessageRequest {
    receiverId: number;
    content: string;
}
