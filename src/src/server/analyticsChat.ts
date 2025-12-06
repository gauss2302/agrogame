import { createServerFn } from '@tanstack/react-start'

import { getDashboardData } from './dashboard'

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

const systemPrompt = `You are AgroAI, a friendly analytics assistant for farmers. You receive up-to-date metrics about farm plots, crop inventories, and harvest history. Explain insights in conversational Russian, reference concrete numbers when possible, and suggest next practical steps. If the user asks about future data, provide projections based on available stats. Keep answers under 8 sentences.`

const buildContext = async () => {
  const data = await getDashboardData()

  const fieldSummary =
    data.fields.length === 0
      ? 'Поля еще не созданы.'
      : data.fields
          .map(
            (field) =>
              `${field.name}: готово ${field.stageCounts.ready}, растет ${field.stageCounts.growing}, посажено ${field.stageCounts.planted}, пусто ${field.stageCounts.empty}`,
          )
          .join('; ')

  const topCategories =
    data.harvestCategories.length === 0
      ? 'Нет собранных культур'
      : data.harvestCategories
          .slice(0, 5)
          .map(
            (cat) =>
              `${cat.name} — ${cat.harvests} сборов, ${cat.weight} кг, изменение ${cat.change}%`,
          )
          .join('; ')

  const seeds =
    data.seedsStock.length === 0
      ? 'Семена не посажены'
      : data.seedsStock
          .map((seed) => `${seed.name}: ${seed.planted}/${seed.capacity}`)
          .join('; ')

  const growth =
    data.harvestGrowth.length === 0
      ? 'Нет статистики по росту'
      : data.harvestGrowth.map((p) => `${p.label}: ${p.value}`).join('; ')

  const total =
    data.totalHarvest.totalWeight > 0
      ? `Общий вес ${data.totalHarvest.totalWeight} кг, изменение ${data.totalHarvest.comparisonPercent}%.`
      : 'Общий вес еще не накоплен.'

  return `Сводка полей: ${fieldSummary}. Топ культуры: ${topCategories}. Посадки семян: ${seeds}. Рост урожая: ${growth}. ${total}`
}

async function callDeepSeek(messages: Array<DeepSeekMessage>) {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    return {
      answer:
        'API ключ DeepSeek отсутствует. Добавьте переменную окружения DEEPSEEK_API_KEY и повторите запрос.',
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
      temperature: 1.2,
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

export const askAnalyticsBot = createServerFn({ method: 'POST' })
  .inputValidator((data: { question: string }) => data)
  .handler(async ({ data }) => {
    const trimmed = data.question.trim()
    if (!trimmed) {
      throw new Error('Введите вопрос для аналитики')
    }

    const context = await buildContext()

    try {
      const result = await callDeepSeek([
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Контекст:\n${context}\n\nВопрос фермера:\n${trimmed}`,
        },
      ])

      return {
        answer: result.answer,
        tokens: result.tokens,
      }
    } catch (err) {
      console.error('Analytics chat error', err)
      throw new Error(
        err instanceof Error ? err.message : 'Не удалось получить ответ ИИ',
      )
    }
  })
