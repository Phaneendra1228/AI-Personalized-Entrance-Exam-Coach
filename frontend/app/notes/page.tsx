'use client';

import { useState, useEffect, useCallback } from 'react';

interface Note { id: string; title: string; body: string; subject: string; color: string; updatedAt: string; }

const SUBJECTS = ['General', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];
const COLORS = ['#6366f1', '#22d3ee', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [active, setActive] = useState<Note | null>(null);
    const [search, setSearch] = useState('');
    const [filterSubject, setFilterSubject] = useState('All');

    useEffect(() => {
        const saved = localStorage.getItem('lf-notes');
        if (saved) { const parsed = JSON.parse(saved); setNotes(parsed); if (parsed.length > 0) setActive(parsed[0]); }
    }, []);

    const save = useCallback((n: Note[]) => {
        setNotes(n);
        localStorage.setItem('lf-notes', JSON.stringify(n));
    }, []);

    const addNote = () => {
        const note: Note = {
            id: Date.now().toString(), title: 'Untitled Note', body: '',
            subject: 'General', color: COLORS[notes.length % COLORS.length],
            updatedAt: new Date().toISOString(),
        };
        const updated = [note, ...notes];
        save(updated);
        setActive(note);
    };

    const updateActive = (field: keyof Note, value: string) => {
        if (!active) return;
        const updated = { ...active, [field]: value, updatedAt: new Date().toISOString() };
        setActive(updated);
        save(notes.map(n => n.id === active.id ? updated : n));
    };

    const deleteNote = (id: string) => {
        const updated = notes.filter(n => n.id !== id);
        save(updated);
        if (active?.id === id) setActive(updated[0] || null);
    };

    const filtered = notes.filter(n => {
        if (filterSubject !== 'All' && n.subject !== filterSubject) return false;
        if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.body.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="flex h-[calc(100vh-120px)] gap-4 slide-in">
            {/* Notes list */}
            <div className="w-72 shrink-0 glass rounded-xl flex flex-col overflow-hidden">
                <div className="p-4 border-b space-y-2" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-sm">📝 Notes</h2>
                        <button onClick={addNote} className="w-7 h-7 rounded-lg flex items-center justify-center text-xs hover:scale-110 transition-all"
                            style={{ background: 'rgba(99,102,241,0.2)', color: '#6366f1' }}>+</button>
                    </div>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes..."
                        className="w-full px-3 py-1.5 rounded-lg text-xs bg-transparent outline-none" style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    <div className="flex flex-wrap gap-1">
                        {['All', ...SUBJECTS].map(s => (
                            <button key={s} onClick={() => setFilterSubject(s)}
                                className="px-2 py-0.5 rounded-full text-xs transition-all"
                                style={{ background: filterSubject === s ? 'rgba(99,102,241,0.2)' : 'transparent', color: filterSubject === s ? '#6366f1' : 'var(--text-muted)', fontSize: '10px' }}>{s}</button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {filtered.length === 0 && <p className="text-xs text-center p-4" style={{ color: 'var(--text-muted)' }}>No notes yet. Click + to create one!</p>}
                    {filtered.map(note => (
                        <button key={note.id} onClick={() => setActive(note)}
                            className="w-full text-left p-3 rounded-xl mb-1 transition-all hover:bg-white/5"
                            style={{
                                background: active?.id === note.id ? 'rgba(99,102,241,0.1)' : 'transparent',
                                borderLeft: `3px solid ${note.color}`,
                            }}>
                            <div className="text-xs font-semibold truncate">{note.title || 'Untitled'}</div>
                            <div className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                                {note.body.slice(0, 50) || 'Empty note...'}
                            </div>
                            <div className="text-xs mt-1 flex items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '9px' }}>
                                <span>{note.subject}</span>
                                <span>·</span>
                                <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 glass rounded-xl flex flex-col overflow-hidden">
                {active ? (
                    <>
                        <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
                            <div className="w-3 h-3 rounded-full" style={{ background: active.color }} />
                            <input value={active.title} onChange={e => updateActive('title', e.target.value)}
                                className="flex-1 bg-transparent font-semibold text-sm outline-none" style={{ color: 'var(--text-primary)' }} placeholder="Note title..." />
                            <select value={active.subject} onChange={e => updateActive('subject', e.target.value)}
                                className="px-2 py-1 rounded-lg text-xs bg-transparent outline-none" style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <button onClick={() => deleteNote(active.id)} className="text-xs px-2 py-1 rounded-lg hover:scale-105 transition-all"
                                style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}>🗑</button>
                        </div>
                        <textarea value={active.body} onChange={e => updateActive('body', e.target.value)}
                            placeholder="Start writing your notes here..."
                            className="flex-1 p-4 bg-transparent text-sm resize-none outline-none leading-relaxed"
                            style={{ color: 'var(--text-primary)' }} />
                        <div className="px-4 py-2 border-t text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                            Last edited: {new Date(active.updatedAt).toLocaleString()} · {active.body.split(/\s+/).filter(Boolean).length} words
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-5xl mb-3">📝</div>
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Select a note or create a new one</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
