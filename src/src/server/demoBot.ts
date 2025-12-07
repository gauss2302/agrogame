import { createServerFn } from '@tanstack/react-start'

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface DeepSeekResponse {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
  usage?: {
    total_tokens?: number
  }
}

const DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/v1/chat/completions'

const systemPrompt = `Ты — ИИ-ассистент проекта AgroGame, геймифицированной платформы, которая соединяет виртуальное фермерство с реальным агросектором Узбекистана.

О ПРОЕКТЕ:
AgroGame — это мобильная игра, где пользователи выращивают виртуальные культуры (морковь, картофель, арбузы) и конвертируют их в реальные сельскохозяйственные продукты от местных фермеров. Каждые 100 виртуальных урожаев = 1 реальный продукт с доставкой.

ПРОБЛЕМА:
- Фермерам сложно находить рынки сбыта
- Молодёжь не интересуется сельским хозяйством
- Отсутствует связь между потребителями и производителями
- Низкая цифровизация агросектора Узбекистана

РЕШЕНИЕ:
- Геймификация привлекает молодёжь (18-35 лет)
- Реальные награды от местных фермеров
- AI оптимизирует спрос и предложение
- Мобильная платформа доступна везде

ТЕХНОЛОГИИ:
Frontend: React + TypeScript, TanStack Start, Tailwind CSS
Backend: Node.js, PostgreSQL + Drizzle ORM, Redis
Mobile: Flutter + BLoC Pattern
AI: DeepSeek API (чатбот), TensorFlow/PyTorch (ML модели)

AI РЕШЕНИЯ:
1. AgroAI Чат-Ассистент (DeepSeek API) — помощник для фермеров с анализом метрик
2. Прогнозирование спроса — ML модели анализируют игровую активность
3. Computer Vision — контроль состояния культур, выявление болезней
4. Персонализация — рекомендательные системы для заданий и культур

ФУНКЦИОНАЛ:
- Игровая механика: посадка, выращивание (9-10 секунд), сбор урожая
- Конвертация: 100 виртуальных культур → 1 реальный продукт
- Дашборд фермеров: аналитика полей, урожая, прогноз погоды
- Мониторинг влажности почвы и вредителей (саранча, тля, колорадский жук и др.)
- Интеграция с OpenWeather API

СТАТУС: MVP (Минимально жизнеспособный продукт)
Готово: игра, база данных, дашборд, AI чат, мониторинг
Планы: мобильное приложение (Flutter), платежи (Click/Payme), партнерства с фермерами

ЦЕЛЕВАЯ АУДИТОРИЯ:
1. Игроки: молодёжь 18-35 лет, любители мобильных игр
2. Фермеры: местные производители, ищущие рынки сбыта

МЕТРИКИ:
- 1000+ пользователей в первые 3 месяца
- 50+ фермеров-партнёров в Ташкенте и областях
- 30% рост продаж фермеров

Отвечай на вопросы кратко, по существу, на русском языке. Используй конкретные факты и цифры из описания выше. Если вопрос не связан с AgroGame, вежливо направь разговор к проекту.`

async function callDeepSeek(messages: Array<DeepSeekMessage>) {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    return {
      answer:
        'API ключ DeepSeek отсутствует. Добавьте переменную окружения DEEPSEEK_API_KEY.',
    }
  }

  const response = await fetch(DEEPSEEK_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      temperature: 0.7,
      messages,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`DeepSeek API error: ${response.status} ${body}`)
  }

  const payload = (await response.json()) as DeepSeekResponse
  const answer = payload.choices?.[0]?.message?.content?.trim()

  if (!answer) {
    throw new Error('DeepSeek вернул пустой ответ')
  }

  return {
    answer,
    tokens: payload.usage?.total_tokens ?? null,
  }
}

export const askDemoBot = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { question: string; history?: Array<DeepSeekMessage> }) => data,
  )
  .handler(async ({ data }) => {
    const trimmed = data.question.trim()
    if (!trimmed) {
      throw new Error('Введите вопрос')
    }

    const messages: Array<DeepSeekMessage> = [
      { role: 'system', content: systemPrompt },
    ]

    // Add conversation history if provided
    if (data.history && data.history.length > 0) {
      messages.push(...data.history.slice(-6)) // Keep last 6 messages for context
    }

    messages.push({ role: 'user', content: trimmed })

    try {
      const result = await callDeepSeek(messages)
      return {
        answer: result.answer,
        tokens: result.tokens,
      }
    } catch (err) {
      console.error('Demo chatbot error:', err)
      throw new Error(
        err instanceof Error ? err.message : 'Не удалось получить ответ от ИИ',
      )
    }
  })
