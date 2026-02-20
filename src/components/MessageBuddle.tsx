import { AvatarGroupCount } from '@/components/ui/avatar';
import type { IFile } from '@/hooks/useChatMessages';
import { DownloadIcon, FileTextIcon } from 'lucide-react';

export type Message = {
    username: string;
    msg: string;
    time: number;
    type?: 'name' | 'share';
};

type MessageBubbleProps = {
    message: Message;
    currentUsername: string;
    formatTime: (timestamp: number) => string;
};

export const MessageBubble = ({ message, currentUsername, formatTime }: MessageBubbleProps) => {
    const isCurrentUser = message.username === currentUsername;
    let fileData: IFile | null = null;
    if (message.type === 'share') {
        fileData = JSON.parse(message.msg);
    }

    return (
        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[70%] flex items-start gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                <AvatarGroupCount>{message.username ? message.username[0] : '?'}</AvatarGroupCount>
                <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}>
                    <div
                        className={`flex flex-col max-w-xs sm:max-w-sm lg:max-w-md ${
                            isCurrentUser ? 'items-end' : 'items-start'
                        }`}
                    >
                        <div className={`flex gap-1 min-w-12 ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                            <span className="text-xs truncate">{message.username}</span>
                            <span className="text-xs">{formatTime(message.time)}</span>
                        </div>
                        <div className={`flex items-end gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div
                                className={`rounded-2xl px-4 py-2 shadow-sm ${
                                    isCurrentUser
                                        ? 'bg-primary text-(--color-background) rounded-br-none'
                                        : 'bg-surface border border-border text-text-primary rounded-bl-none'
                                }`}
                            >
                                {message.type !== 'share' ? (
                                    <p className="text-sm wrap-break-word whitespace-pre-wrap">{message.msg}</p>
                                ) : (
                                    <div className="flex flex-col gap-1 w-full max-w-md">
                                        <div
                                            className={`flex items-center gap-3 p-3 border rounded-lg transition-colors opacity-70`}
                                        >
                                            <div
                                                className={`w-10 h-10 border rounded flex items-center justify-center shrink-0 ${isCurrentUser ? 'bg-white/10 border-white/20 dark:bg-black/10 dark:border-black/20' : 'bg-background border-border'}`}
                                            >
                                                <FileTextIcon
                                                    size={20}
                                                    className={
                                                        isCurrentUser
                                                            ? 'text-white/80 dark:text-black/80'
                                                            : 'text-text-secondary'
                                                    }
                                                />
                                            </div>
                                            <div className="flex-1 min-w-25">
                                                <p className={`text-sm font-medium truncate`}>
                                                    {fileData?.name || '未知文件名'}
                                                </p>
                                                <p className={`text-xs text-secondary`}>
                                                    {fileData?.size || '未知大小'}
                                                </p>
                                            </div>
                                            <a
                                                href={`https://livefile.xesimg.com/programme/python_assets/844958913c304c040803a9d7f79f898e.html?name=${fileData?.name}&file=${fileData?.link.split('python_assets/')[1]}`}
                                                className={`p-2 rounded transition-colors shrink-0 ${isCurrentUser ? 'text-white dark:text-black' : ''}`}
                                                title="下载"
                                                target={'_blank'}
                                            >
                                                <DownloadIcon size={18} />
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
