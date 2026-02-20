import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendIcon } from 'lucide-react';
import { MessageBubble, type Message as ChatMessage } from '@/components/MessageBuddle';

const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

interface MessageAreaProps {
    messages: ChatMessage[];
    currentUsername: string;
    input: string;
    isSending: boolean;
    isConnected: boolean;
    onInputChange: (value: string) => void;
    onSend: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function MessageArea({
    messages,
    currentUsername,
    input,
    isSending,
    isConnected,
    onInputChange,
    onSend,
    onKeyDown,
}: MessageAreaProps) {
    return (
        <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 h-[calc(100%-64px)] p-4 relative">
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400">暂无消息</div>
                ) : (
                    messages.map((message, index) => (
                        <MessageBubble
                            key={`${message.time}-${index}`}
                            message={message}
                            currentUsername={currentUsername}
                            formatTime={formatTime}
                        />
                    ))
                )}
            </ScrollArea>

            <div className="p-3 flex gap-2 items-center bg-white border-t">
                <Input
                    disabled={isSending || !isConnected}
                    value={input}
                    onChange={e => onInputChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="请输入文本"
                    className="flex-1"
                />
                <Button onClick={onSend} size="icon-sm" disabled={isSending || !isConnected}>
                    <SendIcon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
