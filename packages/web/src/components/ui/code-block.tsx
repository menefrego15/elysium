import { Check, Copy } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';

interface CodeBlockProps {
  children: string;
  language?: string;
}

export function CodeBlock({ children, language = 'text' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-border border-b bg-muted/50 px-4 py-2">
        <span className="font-medium text-muted-foreground text-xs uppercase">{language}</span>
        <button
          onClick={handleCopy}
          type="button"
          className="inline-flex items-center gap-1.5 text-muted-foreground text-xs transition-colors hover:text-foreground"
          aria-label="Copy code"
        >
          <HugeiconsIcon icon={copied ? Check : Copy} className="size-3.5" />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm">
        <code className="font-mono text-foreground">{children.trim()}</code>
      </pre>
    </div>
  );
}
