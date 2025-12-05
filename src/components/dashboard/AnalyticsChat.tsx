import { useMemo, useState } from 'react'
import {
  Loader2,
  MessageCircle,
  RefreshCw,
  SendHorizonal,
  Sparkles,
} from 'lucide-react'
import { askAnalyticsBot } from '@/src/server/analyticsChat'

type Author = 'farmer' | 'assistant'

interface ChatMessage {
  id: string
  author: Author
  content: string
  status?: 'pending' | 'error'
  timestamp: number
}

const defaultSuggestions = [
  'Сколько у меня готовых участков?',
  'Какие культуры дают больше всего монет?',
  'Что посадить, чтобы ускорить рост урожая?',
]

export function AnalyticsChat() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<Array<ChatMessage>>([
    {
      id: 'intro',
      author: 'assistant',
      content:
        'Привет! Я AgroAI. Спроси о состоянии полей, окупаемости культур или планах на следующую неделю.',
      timestamp: Date.now(),
    },
  ])
  const [isSending, setIsSending] = useState(false)

  const handleSuggestion = (suggestion: string) => {
    setQuestion(suggestion)
  }

  const handleSubmit = async (value?: string) => {
    const trimmed = (value ?? question).trim()
    if (!trimmed || isSending) return

    setQuestion('')
    setIsSending(true)

    const farmerMsg: ChatMessage = {
      id: `farmer-${Date.now()}`,
      author: 'farmer',
      content: trimmed,
      timestamp: Date.now(),
    }

    const placeholder: ChatMessage = {
      id: `assistant-${Date.now()}`,
      author: 'assistant',
      content: 'Думаю над ответом…',
      status: 'pending',
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, farmerMsg, placeholder])

    try {
      const result = await askAnalyticsBot({
        data: { question: trimmed },
      })

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === placeholder.id
            ? {
                ...msg,
                content: result.answer,
                status: undefined,
                timestamp: Date.now(),
              }
            : msg,
        ),
      )
    } catch (err) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === placeholder.id
            ? {
                ...msg,
                content:
                  err instanceof Error
                    ? err.message
                    : 'Не удалось получить ответ. Попробуйте позже.',
                status: 'error',
              }
            : msg,
        ),
      )
    } finally {
      setIsSending(false)
    }
  }

  const lastUpdated = useMemo(() => {
    const lastMessage = messages[messages.length - 1]
    return new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(lastMessage.timestamp))
  }, [messages])

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
            <Sparkles size={18} />
            AgroAI Analytics
          </div>
          <p className="text-xs text-gray-500">Обновлено: {lastUpdated}</p>
        </div>
        <button
          type="button"
          onClick={() => handleSubmit(question)}
          disabled={isSending || !question.trim()}
          className="text-xs font-medium text-gray-500 flex items-center gap-1 hover:text-gray-700 disabled:opacity-40"
        >
          <RefreshCw size={14} />
          Спросить снова
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.author === 'farmer' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${msg.author === 'farmer' ? 'bg-green-600 text-white rounded-br-sm' : 'bg-gray-50 text-gray-800 rounded-bl-sm'}`}
            >
              <div className="flex items-center gap-2 mb-1 text-[11px] uppercase tracking-wide">
                {msg.author === 'farmer' ? (
                  <span className="text-green-100">Фермер</span>
                ) : (
                  <span className="text-gray-400">AgroAI</span>
                )}
                {msg.status === 'pending' && (
                  <Loader2 size={12} className="animate-spin" />
                )}
                {msg.status === 'error' && (
                  <span className="text-red-500 font-semibold">Ошибка</span>
                )}
              </div>
              <p className="whitespace-pre-line">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

  <div className="mt-4">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {defaultSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSuggestion(suggestion)}
              className="px-3 py-1.5 text-xs rounded-full border border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <MessageCircle
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
            />
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void handleSubmit()
                }
              }}
              placeholder="Задай вопрос о полях или урожае..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-shadow"
            />
          </div>
          <button
            type="button"
            disabled={isSending || !question.trim()}
            onClick={() => void handleSubmit()}
            className="p-3 rounded-2xl bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <SendHorizonal size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
