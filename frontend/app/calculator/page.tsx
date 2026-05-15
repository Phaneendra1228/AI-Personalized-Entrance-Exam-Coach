'use client';

import { useState } from 'react';

export default function CalculatorPage() {
    const [display, setDisplay] = useState('0');
    const [memory, setMemory] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>([]);
    const [mode, setMode] = useState<'basic' | 'scientific'>('basic');

    const input = (val: string) => {
        setDisplay(prev => prev === '0' || prev === 'Error' ? val : prev + val);
    };

    const clear = () => setDisplay('0');
    const backspace = () => setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');

    const calculate = () => {
        try {
            let expr = display
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/π/g, Math.PI.toString())
                .replace(/e(?!x)/g, Math.E.toString())
                .replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)')
                .replace(/sin\(/g, 'Math.sin(')
                .replace(/cos\(/g, 'Math.cos(')
                .replace(/tan\(/g, 'Math.tan(')
                .replace(/log\(/g, 'Math.log10(')
                .replace(/ln\(/g, 'Math.log(')
                .replace(/\^/g, '**');
            const result = new Function('return ' + expr)();
            const formatted = Number.isFinite(result) ? parseFloat(result.toFixed(10)).toString() : 'Error';
            setHistory(prev => [`${display} = ${formatted}`, ...prev].slice(0, 10));
            setDisplay(formatted);
        } catch {
            setDisplay('Error');
        }
    };

    const BASIC_BUTTONS = [
        ['C', '⌫', '(', ')'],
        ['7', '8', '9', '÷'],
        ['4', '5', '6', '×'],
        ['1', '2', '3', '-'],
        ['0', '.', '=', '+'],
    ];

    const SCI_BUTTONS = [
        ['sin(', 'cos(', 'tan(', 'π'],
        ['log(', 'ln(', '√(', 'e'],
        ['^', '!', '%', '1/x'],
    ];

    const handleBtn = (btn: string) => {
        switch (btn) {
            case 'C': clear(); break;
            case '⌫': backspace(); break;
            case '=': calculate(); break;
            case '1/x':
                try { setDisplay((1 / parseFloat(display)).toString()); } catch { setDisplay('Error'); }
                break;
            case '!': {
                const n = parseInt(display);
                if (n >= 0 && n <= 170) {
                    let f = 1; for (let i = 2; i <= n; i++) f *= i;
                    setDisplay(f.toString());
                } else setDisplay('Error');
                break;
            }
            case '%': setDisplay((parseFloat(display) / 100).toString()); break;
            default: input(btn);
        }
    };

    return (
        <div className="max-w-sm mx-auto space-y-4 slide-in">
            <div className="glass p-4 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 80% 50%, #6366f1, transparent 60%)' }} />
                <div className="relative">
                    <h1 className="text-xl font-bold">🔢 Calculator</h1>
                    <div className="flex gap-2 mt-2">
                        {(['basic', 'scientific'] as const).map(m => (
                            <button key={m} onClick={() => setMode(m)}
                                className="px-3 py-1 rounded-full text-xs capitalize transition-all"
                                style={{ background: mode === m ? 'rgba(99,102,241,0.2)' : 'transparent', color: mode === m ? '#6366f1' : 'var(--text-muted)' }}>{m}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Display */}
            <div className="glass p-4 rounded-xl">
                <div className="text-right text-xs mb-1 h-4 truncate" style={{ color: 'var(--text-muted)' }}>
                    {memory && <span>M: {memory}</span>}
                </div>
                <div className="text-right text-3xl font-mono font-bold truncate" style={{ color: 'var(--text-primary)' }}>{display}</div>
            </div>

            {/* Scientific buttons */}
            {mode === 'scientific' && (
                <div className="grid grid-cols-4 gap-1.5">
                    {SCI_BUTTONS.flat().map(btn => (
                        <button key={btn} onClick={() => handleBtn(btn)}
                            className="py-2.5 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                            style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)' }}>{btn}</button>
                    ))}
                </div>
            )}

            {/* Basic buttons */}
            <div className="grid grid-cols-4 gap-1.5">
                {BASIC_BUTTONS.flat().map(btn => {
                    const isOp = ['÷', '×', '-', '+', '='].includes(btn);
                    const isAction = ['C', '⌫'].includes(btn);
                    return (
                        <button key={btn} onClick={() => handleBtn(btn)}
                            className="py-3.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
                            style={{
                                background: btn === '=' ? 'linear-gradient(135deg, #6366f1, #22d3ee)' : isOp ? 'rgba(99,102,241,0.15)' : isAction ? 'rgba(239,68,68,0.1)' : 'var(--bg-primary)',
                                color: btn === '=' ? 'white' : isOp ? '#6366f1' : isAction ? '#ef4444' : 'var(--text-primary)',
                                border: '1px solid var(--border)',
                            }}>{btn}</button>
                    );
                })}
            </div>

            {/* Memory buttons */}
            <div className="flex gap-2">
                <button onClick={() => setMemory(display)} className="flex-1 py-2 rounded-lg text-xs font-semibold"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>M+</button>
                <button onClick={() => memory && setDisplay(memory)} className="flex-1 py-2 rounded-lg text-xs font-semibold"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>MR</button>
                <button onClick={() => setMemory(null)} className="flex-1 py-2 rounded-lg text-xs font-semibold"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>MC</button>
            </div>

            {/* History */}
            {history.length > 0 && (
                <div className="glass p-3 rounded-xl">
                    <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>History</div>
                    {history.slice(0, 5).map((h, i) => (
                        <div key={i} className="text-xs font-mono py-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{h}</div>
                    ))}
                </div>
            )}
        </div>
    );
}
