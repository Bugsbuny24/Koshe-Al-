import ReactMarkdown from 'react-markdown';

interface LessonViewerProps {
  content: string;
  title?: string;
}

export function LessonViewer({ content, title }: LessonViewerProps) {
  return (
    <div className="rounded-xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-6">
      {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
      <div className="prose prose-invert max-w-none text-[#8A8680] prose-headings:text-[#F0EDE6] prose-code:text-[#F0A500] prose-code:bg-[rgba(240,165,0,0.1)] prose-code:rounded prose-code:px-1">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
