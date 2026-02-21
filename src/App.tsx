import { useState } from 'react';
import { useChatMessages } from './hooks/useChatMessages';
import { useRoomManager } from './hooks/useRoomManager';
import { useUsername } from './hooks/useUsername';
import { ChatRoomSidebar } from '@/components/ChatRoom/ChatRoomSidebar';
import { MessageArea } from './components/ChatRoom/MessageArea';
import InitProfilePage from '@/pages/InitProfile.tsx';
import type { KeyboardEvent } from 'react';
import type { Message as ChatMessage } from '@/components/MessageBuddle';

function App() {
    const {
        username,
        isEditing: isEditingName,
        editInput: editNameInput,
        setEditInput: setEditNameInput,
        startEditing: startNameEdit,
        cancelEditing: cancelNameEdit,
        saveUsername,
    } = useUsername();

    const { chatId, setChatId, roomList, isCreatingRoom, createRoom, joinRoom, deleteRoom } = useRoomManager(26329675);

    const { messages, isSending, sendMessage, sendFile, recallMessage } = useChatMessages(
        chatId,
        typeof username === 'string' ? username : '',
    );

    const [input, setInput] = useState('');

    const handleSend = async (quoteMessage?: ChatMessage) => {
        const success = await sendMessage(input, quoteMessage);
        if (success) setInput('');
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const isConnected = Boolean(chatId);

    if (!username) return <InitProfilePage />;

    return (
        <div className="h-screen flex">
            <>
                <ChatRoomSidebar
                    roomList={roomList}
                    currentRoomId={chatId}
                    username={username}
                    isEditingName={isEditingName}
                    editNameInput={editNameInput}
                    isCreatingRoom={isCreatingRoom}
                    isConnected={isConnected}
                    onRoomSelect={setChatId}
                    onRoomDelete={deleteRoom}
                    onUsernameEditStart={startNameEdit}
                    onUsernameEditCancel={cancelNameEdit}
                    onUsernameEditInputChange={setEditNameInput}
                    onUsernameSave={saveUsername}
                    onCreateRoom={() => createRoom(username)}
                    onJoinRoom={joinRoom}
                />

                <MessageArea
                    messages={messages}
                    currentUsername={username}
                    input={input}
                    isSending={isSending}
                    isConnected={isConnected}
                    onInputChange={setInput}
                    onSend={handleSend}
                    onKeyDown={handleKeyDown}
                    chatId={chatId.toString()}
                    sendFile={sendFile}
                    handleRecall={(message: ChatMessage) => recallMessage(message.time)}
                />
            </>
        </div>
    );
}

export default App;
