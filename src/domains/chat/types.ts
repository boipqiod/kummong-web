export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    type?: "text" | "action";
    actionLabel?: string;
}

export interface ChatState {
    messages: Message[];
    isLoading: boolean;
    isReadyForResult: boolean;
}
