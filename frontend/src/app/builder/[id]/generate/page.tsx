'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function GeneratePage() {
  const params = useParams();
  const router = useRouter();
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await api.generate(params.id as string);
      setMarkdown(res.markdown);
    } catch (e) {
      setMarkdown('Error generating SKILL.md');
    }
    setLoading(false);
  };

  useEffect(() => { generate(); }, [params.id]);

  const copy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'SKILL.md'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <header className="border-b border-[#2a2a2e] px-8 py-4 flex items-center gap-4">
        <button onClick={() => router.push(`/builder/${params.id}`)} className="text-[#555] hover:text-white">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-sm font-semibold flex-1">Generated SKILL.md</h1>
        <button onClick={generate} disabled={loading} className="px-3 py-1.5 text-xs bg-[#6366f1] text-white rounded-lg hover:bg-[#5558e6] disabled:opacity-50">
          {loading ? 'Generating...' : 'Regenerate'}
        </button>
        <button onClick={copy} className="px-3 py-1.5 text-xs bg-[#1a1a1e] border border-[#2a2a2e] rounded-lg hover:border-[#3a3a3e]">
          {copied ? '✓ Copied' : 'Copy'}
        </button>
        <button onClick={download} className="px-3 py-1.5 text-xs bg-[#1a1a1e] border border-[#2a2a2e] rounded-lg hover:border-[#3a3a3e]">
          Download
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-8">
        <pre className="p-6 bg-[#111113] border border-[#2a2a2e] rounded-xl text-sm font-mono text-[#ececed] overflow-x-auto whitespace-pre-wrap leading-relaxed">
          {markdown || (loading ? 'Generating SKILL.md...' : 'Click Generate to create your SKILL.md')}
        </pre>
      </main>
    </div>
  );
}
