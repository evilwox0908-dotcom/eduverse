import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, User, Copy, Check } from 'lucide-react';
import { AIChatMessage } from '../../types';

interface AIMessageItemProps {
  message: AIChatMessage;
  studentName?: string;
  studentPhoto?: string;
}

export const AIMessageItem: React.FC<AIMessageItemProps> = ({
  message,
  studentName = 'Student',
  studentPhoto,
}) => {
  const [copied, setCopied] = React.useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex gap-3 sm:gap-4 my-4 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20 border border-white">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      {/* Message Bubble Container */}
      <div
        className={`max-w-[88%] sm:max-w-[80%] rounded-3xl p-4 sm:p-5 relative ${
          isUser
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm shadow-md shadow-blue-600/20'
            : 'bg-white/90 glass-card text-slate-800 rounded-tl-sm border border-white/90 shadow-lg shadow-blue-900/5'
        }`}
      >
        {/* Author Label */}
        <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-white/10">
          <span
            className={`text-[11px] font-bold ${
              isUser ? 'text-blue-100' : 'text-blue-700'
            }`}
          >
            {isUser ? studentName : 'EduVerse AI Teacher'}
          </span>

          {!isUser && (
            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md"
              title="Copy message"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Message Content with Markdown Support */}
        <div
          className={`text-sm leading-relaxed overflow-x-auto ${
            isUser ? 'text-white' : 'text-slate-800'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-sm prose-blue max-w-none text-slate-800 space-y-3">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-lg font-bold text-slate-900 my-2">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-base font-bold text-slate-900 my-2">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-bold text-slate-900 my-1.5">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="my-1.5 text-slate-700 leading-relaxed">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-1 my-2 text-slate-700">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-1 my-2 text-slate-700">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-3 py-1 my-2 bg-blue-50/50 rounded-r-lg text-slate-700 italic">
                      {children}
                    </blockquote>
                  ),
                  code: ({ className, children }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="bg-slate-100 text-blue-700 px-1.5 py-0.5 rounded text-xs font-mono border border-slate-200">
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-slate-900 text-slate-100 p-3 rounded-2xl overflow-x-auto text-xs font-mono my-2 border border-slate-800">
                        <code>{children}</code>
                      </pre>
                    );
                  },
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-3">
                      <table className="min-w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="bg-slate-100 text-slate-700 font-bold p-2 text-left border-b border-slate-200">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="p-2 border-b border-slate-100 text-slate-600">{children}</td>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20 border border-white overflow-hidden">
          {studentPhoto ? (
            <img
              src={studentPhoto}
              alt={studentName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <User className="w-4 h-4" />
          )}
        </div>
      )}
    </div>
  );
};
