'use client';

import { useState, useEffect, useRef } from 'react';

const ROOMS = [
    { id: 'math', name: 'Mathematics Hub', icon: '📐', members: 24, active: true },
    { id: 'physics', name: 'Physics Lab', icon: '⚛️', members: 18, active: true },
    { id: 'chem', name: 'Chemistry Circle', icon: '🧪', members: 12, active: false },
    { id: 'bio', name: 'Biology Den', icon: '🧬', members: 15, active: true },
    { id: 'general', name: 'General Discussion', icon: '💬', members: 31, active: true },
];

interface Message { user: string; text: string; time: string; isMe: boolean; }

const BOT_REPLIES = [
    "That's a great point! 🎯",
    "I think the formula would be different here...",
    "Has anyone solved the practice questions for this chapter?",
    "Can someone explain the derivation again?",
    "Thanks for sharing! Really helpful 📚",
    "I found a good YouTube video on this topic!",
    "Let's discuss this after the mock test tomorrow",
    "Great explanation! Crystal clear 💡",
];

export default function StudyRoomsPage() {
    const [currentRoom, setCurrentRoom] = useState(ROOMS[0]);
    const [messages, setMessages] = useState<Record<string, Message[]>>({});
    const [input, setInput] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem('lf-chatrooms');
        if (saved) setMessages(JSON.parse(saved));
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, currentRoom]);

    const roomMessages = messages[currentRoom.id] || [];

    const send = () => {
        if (!input.trim()) return;
        const now = new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
        const msg: Message = { user: 'You', text: input.trim(), time: now, isMe: true };
        const updated = { ...messages, [currentRoom.id]: [...roomMessages, msg] };

        // Simulate a reply after a short delay
        setTimeout(() => {
            const reply: Message = {
                user: ['Arjun', 'Priya', 'Rahul', 'Sneha'][Math.floor(Math.random() * 4)],
                text: BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)],
                time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
                isMe: false,
            };
            setMessages(prev => {
                const u = { ...prev, [currentRoom.id]: [...(prev[currentRoom.id] || []), reply] };
                localStorage.setItem('lf-chatrooms', JSON.stringify(u));
                return u;
            });
        }, 1000 + Math.random() * 2000);

        setMessages(updated);
        localStorage.setItem('lf-chatrooms', JSON.stringify(updated));
        setInput('');
    };

    return (
        <div className="flex h-[calc(100vh-120px)] gap-4 slide-in">
            {/* Room list */}
            <div className="w-64 shrink-0 glass rounded-xl flex flex-col overflow-hidden">
                <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                    <h2 className="font-bold text-sm">💬 Study Rooms</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    {ROOMS.map(room => (
                        <button key={room.id} onClick={() => setCurrentRoom(room)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl mb-1 text-left transition-all"
                            style={{
                                background: currentRoom.id === room.id ? 'rgba(99,102,241,0.15)' : 'transparent',
                                border: currentRoom.id === room.id ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                            }}>
                            <span className="text-xl">{room.icon}</span>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold truncate">{room.name}</div>
                                <div className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: room.active ? '#22c55e' : '#64748b' }} />
                                    {room.members} members
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 glass rounded-xl flex flex-col overflow-hidden">
                <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
                    <span className="text-xl">{currentRoom.icon}</span>
                    <div>
                        <div className="font-semibold text-sm">{currentRoom.name}</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{currentRoom.members} members online</div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {roomMessages.length === 0 && (
                        <div className="text-center py-10" style={{ color: 'var(--text-muted)' }}>
                            <div className="text-4xl mb-2">💬</div>
                            <p className="text-sm">No messages yet. Start the conversation!</p>
                        </div>
                    )}
                    {roomMessages.map((msg, i) => (
                        <div key={i} className={`flex gap-2 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                            {!msg.isMe && (
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                    style={{ background: 'rgba(99,102,241,0.2)', color: '#6366f1' }}>{msg.user[0]}</div>
                            )}
                            <div className="max-w-[70%]">
                                {!msg.isMe && <div className="text-xs font-semibold mb-0.5" style={{ color: '#6366f1' }}>{msg.user}</div>}
                                <div className="px-3 py-2 rounded-xl text-sm"
                                    style={{
                                        background: msg.isMe ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'var(--bg-primary)',
                                        color: msg.isMe ? 'white' : 'var(--text-primary)',
                                        border: msg.isMe ? 'none' : '1px solid var(--border)',
                                    }}>
                                    {msg.text}
                                </div>
                                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)', fontSize: '10px', textAlign: msg.isMe ? 'right' : 'left' }}>{msg.time}</div>
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                <div className="p-3 border-t flex gap-2" style={{ borderColor: 'var(--border)' }}>
                    <input value={input} onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && send()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 rounded-xl text-sm bg-transparent outline-none"
                        style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    <button onClick={send} className="px-4 py-2 rounded-xl text-sm font-semibold hover:scale-105 transition-all"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)', color: 'white' }}>Send</button>
                </div>
            </div>
        </div>
    );
}
