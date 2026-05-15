'use client';

import { useState, useEffect } from 'react';

interface ForumPost { id: string; user: string; title: string; body: string; topic: string; likes: number; replies: ForumReply[]; date: string; }
interface ForumReply { id: string; user: string; body: string; date: string; }

const TOPICS = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'General', 'Tips & Tricks'];

const SEED_POSTS: ForumPost[] = [
    { id: '1', user: 'Arjun K.', title: 'How to solve integration by parts quickly?', body: 'I always get confused with the ILATE rule. Can someone share a trick?', topic: 'Mathematics', likes: 12, replies: [{ id: 'r1', user: 'Priya S.', body: 'Use the mnemonic: Inverse, Log, Algebraic, Trig, Exponential. Practice with 10 problems a day!', date: '2h ago' }], date: '3h ago' },
    { id: '2', user: 'Sneha D.', title: 'Best resources for Organic Chemistry?', body: 'I need good YouTube channels and books for organic chem reactions.', topic: 'Chemistry', likes: 8, replies: [], date: '5h ago' },
    { id: '3', user: 'Rahul M.', title: 'Newton\'s Laws explained simply', body: 'First law: things stay still or keep moving. Second: F=ma. Third: every action has equal opposite reaction.', topic: 'Physics', likes: 15, replies: [{ id: 'r2', user: 'Vikram R.', body: 'Great summary! I\'d add that the first law is also called the law of inertia.', date: '1h ago' }], date: '1d ago' },
    { id: '4', user: 'Meera L.', title: 'Study schedule for last 30 days before exam', body: 'Divide subjects equally. Spend mornings on weak topics, evenings on revision. Keep last 5 days for mock tests only.', topic: 'Tips & Tricks', likes: 22, replies: [], date: '2d ago' },
];

export default function ForumPage() {
    const [posts, setPosts] = useState<ForumPost[]>(SEED_POSTS);
    const [activeTopic, setActiveTopic] = useState('All');
    const [expandedPost, setExpandedPost] = useState<string | null>(null);
    const [showNewPost, setShowNewPost] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newBody, setNewBody] = useState('');
    const [newTopic, setNewTopic] = useState('General');
    const [replyText, setReplyText] = useState<Record<string, string>>({});

    useEffect(() => {
        const saved = localStorage.getItem('lf-forum');
        if (saved) setPosts(JSON.parse(saved));
    }, []);

    const save = (p: ForumPost[]) => { setPosts(p); localStorage.setItem('lf-forum', JSON.stringify(p)); };

    const addPost = () => {
        if (!newTitle.trim() || !newBody.trim()) return;
        const post: ForumPost = { id: Date.now().toString(), user: 'You', title: newTitle.trim(), body: newBody.trim(), topic: newTopic, likes: 0, replies: [], date: 'Just now' };
        save([post, ...posts]);
        setNewTitle(''); setNewBody(''); setShowNewPost(false);
    };

    const addReply = (postId: string) => {
        const text = replyText[postId]?.trim();
        if (!text) return;
        const updated = posts.map(p => p.id === postId ? { ...p, replies: [...p.replies, { id: Date.now().toString(), user: 'You', body: text, date: 'Just now' }] } : p);
        save(updated);
        setReplyText(prev => ({ ...prev, [postId]: '' }));
    };

    const likePost = (postId: string) => {
        save(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    };

    const filtered = activeTopic === 'All' ? posts : posts.filter(p => p.topic === activeTopic);

    return (
        <div className="max-w-3xl mx-auto space-y-6 slide-in">
            <div className="glass p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 80% 50%, #22c55e, transparent 60%)' }} />
                <div className="relative flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">🗣️ Discussion Forum</h1>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Ask questions, share tips, help each other!</p>
                    </div>
                    <button onClick={() => setShowNewPost(!showNewPost)} className="px-4 py-2 rounded-xl text-sm font-semibold hover:scale-105 transition-all"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)', color: 'white' }}>+ New Post</button>
                </div>
            </div>

            {/* Topic filter */}
            <div className="flex flex-wrap gap-2">
                {TOPICS.map(t => (
                    <button key={t} onClick={() => setActiveTopic(t)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                        style={{
                            background: activeTopic === t ? 'rgba(99,102,241,0.2)' : 'var(--bg-card)',
                            border: activeTopic === t ? '1px solid #6366f1' : '1px solid var(--border)',
                            color: activeTopic === t ? '#6366f1' : 'var(--text-muted)',
                        }}>{t}</button>
                ))}
            </div>

            {/* New post form */}
            {showNewPost && (
                <div className="glass p-5 rounded-xl space-y-3" style={{ borderLeft: '3px solid #6366f1' }}>
                    <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Post title..."
                        className="w-full px-3 py-2 rounded-lg text-sm bg-transparent outline-none" style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    <textarea value={newBody} onChange={e => setNewBody(e.target.value)} placeholder="Write your post..."
                        rows={3} className="w-full px-3 py-2 rounded-lg text-sm bg-transparent outline-none resize-none" style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    <div className="flex items-center gap-2">
                        <select value={newTopic} onChange={e => setNewTopic(e.target.value)}
                            className="px-3 py-2 rounded-lg text-xs bg-transparent outline-none" style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                            {TOPICS.filter(t => t !== 'All').map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <button onClick={addPost} className="px-4 py-2 rounded-lg text-xs font-semibold" style={{ background: '#6366f1', color: 'white' }}>Post</button>
                    </div>
                </div>
            )}

            {/* Posts */}
            <div className="space-y-3">
                {filtered.map(post => (
                    <div key={post.id} className="glass p-5 rounded-xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <span className="text-xs px-2 py-0.5 rounded-full mr-2" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>{post.topic}</span>
                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{post.user} · {post.date}</span>
                            </div>
                            <button onClick={() => likePost(post.id)} className="text-xs flex items-center gap-1 hover:scale-110 transition-all" style={{ color: '#ef4444' }}>
                                ❤️ {post.likes}
                            </button>
                        </div>
                        <h3 className="font-semibold text-sm mt-2">{post.title}</h3>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{post.body}</p>

                        <button onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                            className="text-xs mt-2" style={{ color: '#6366f1' }}>
                            💬 {post.replies.length} replies {expandedPost === post.id ? '▲' : '▼'}
                        </button>

                        {expandedPost === post.id && (
                            <div className="mt-3 space-y-2 pl-4" style={{ borderLeft: '2px solid var(--border)' }}>
                                {post.replies.map(r => (
                                    <div key={r.id} className="p-2 rounded-lg text-xs" style={{ background: 'var(--bg-primary)' }}>
                                        <span className="font-semibold" style={{ color: '#6366f1' }}>{r.user}</span>
                                        <span style={{ color: 'var(--text-muted)' }}> · {r.date}</span>
                                        <p className="mt-1">{r.body}</p>
                                    </div>
                                ))}
                                <div className="flex gap-2">
                                    <input value={replyText[post.id] || ''} onChange={e => setReplyText(prev => ({ ...prev, [post.id]: e.target.value }))}
                                        onKeyDown={e => e.key === 'Enter' && addReply(post.id)}
                                        placeholder="Write a reply..." className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-transparent outline-none"
                                        style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                                    <button onClick={() => addReply(post.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#6366f1', color: 'white' }}>Reply</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
