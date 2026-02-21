import { useRef, useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileUpIcon, SendIcon, XIcon } from 'lucide-react';
import { MessageBubble, type Message as ChatMessage } from '@/components/MessageBuddle';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../ui/alert-dialog';
import type { IFile } from '@/hooks/useChatMessages';
import { FileDisplay } from '../FileDisplay';

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
    onSend: (quoteMessage?: ChatMessage) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    chatId: string;
    sendFile: (file: IFile) => void;
    handleRecall: (message: ChatMessage) => void;
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
    chatId,
    sendFile,
    handleRecall,
}: MessageAreaProps) {
    const [quoteMessage, setQuoteMessage] = useState<ChatMessage | undefined>(undefined);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [userScrolled, setUserScrolled] = useState(false);

    useEffect(() => {
        const viewport = scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]');
        if (!viewport) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = viewport;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
            if (!isNearBottom) setUserScrolled(true);
            else setUserScrolled(false);
        };

        viewport.addEventListener('scroll', handleScroll);
        return () => viewport.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (scrollAreaRef.current && !userScrolled) {
            const viewport = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]');
            if (viewport) {
                viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
            }
        }
    }, [messages, userScrolled]);

    const nameMessage = messages.find(message => message.type === 'name');
    let roomName = nameMessage?.msg || `房间${chatId}`;
    if (chatId === '185655560') {
        roomName = '项目大群';
    }

    return (
        <div className="flex-1 flex flex-col h-full">
            <div className="p-3 flex gap-2 border-b items-end shrink-0">
                <h1 className="text-lg font-bold">{roomName}</h1>
                <span className="text-gray-500 text-sm">ID: {chatId}</span>
            </div>

            <ScrollArea ref={scrollAreaRef} className="flex-1 min-h-0 p-4 relative">
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        消息正在加载中...
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <MessageBubble
                            key={`${message.time}-${index}`}
                            setQuoteMessage={setQuoteMessage}
                            quoteMessage={
                                message.quoteTimeStamp
                                    ? messages.find(msg => msg.time === message.quoteTimeStamp)
                                    : undefined
                            }
                            message={message}
                            currentUsername={currentUsername}
                            formatTime={formatTime}
                            handleRecall={handleRecall}
                        />
                    ))
                )}
            </ScrollArea>

            <div className="p-3 flex flex-col bg-white border-t shrink-0 max-h-45 overflow-y-auto">
                {quoteMessage && (
                    <div className="relative text-xs p-2 mb-2 rounded border-l-4 bg-slate-50 border-slate-400 text-slate-800">
                        <p className="font-bold mb-0.5">@{quoteMessage.username}</p>
                        <div className="prose prose-sm max-w-none max-h-24 overflow-y-auto prose-p:my-0 prose-headings:my-1 prose-ul:my-0 prose-ol:my-0 prose-li:my-0 prose-pre:my-1">
                            {quoteMessage.type !== 'share' ? (
                                quoteMessage.msg
                            ) : (
                                <FileDisplay
                                    fileData={JSON.parse(quoteMessage.msg)}
                                    isCurrentUser={false}
                                />
                            )}
                        </div>
                        <Button size="icon-xs" className="absolute top-1 right-1" onClick={() => setQuoteMessage(undefined)}>
                            <XIcon />
                        </Button>
                    </div>
                )}
                
                <div className="flex gap-2 items-center shrink-0">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="icon-sm" disabled={isSending || !isConnected}>
                                <FileUpIcon />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>分享文件</AlertDialogTitle>
                                <AlertDialogDescription className="w-full">
                                    <iframe 
                                        className="w-full" 
                                        src="https://new-xes-pan.netlify.app/upload" 
                                        title="文件上传"
                                    />
                                    <p className="mt-2">请将文件在这里上传，然后把数据填入下方表单</p>
                                    <Input 
                                        placeholder="请输入给你的数据" 
                                        ref={inputRef} 
                                        className="mt-2"
                                    />
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => {
                                        try {
                                            const fileData = JSON.parse(inputRef.current?.value || '');
                                            sendFile(fileData);
                                        } catch (error) {
                                            console.error('解析文件数据失败:', error);
                                        }
                                    }}
                                >
                                    分享
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    
                    <Input
                        disabled={isSending || !isConnected}
                        value={input}
                        onChange={e => onInputChange(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="请输入文本"
                        className="flex-1"
                    />
                    
                    <Button
                        onClick={() => {
                            if (input.trim()) {
                                onSend(quoteMessage);
                                setQuoteMessage(undefined);
                            }
                        }}
                        size="icon-sm"
                        disabled={isSending || !isConnected || input.trim() === ''}
                    >
                        <SendIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
