import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Code,
  Database,
  ExternalLink,
  MessageCircle,
  Play,
  Rocket,
  Smartphone,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import { askDemoBot } from '@/src/server/demoBot'

export const Route = createFileRoute('/demo')({
  component: DemoPage,
})

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

function DemoPage() {
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<Array<ChatMessage>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState(
    'https://www.youtube.com/embed/n27QvPQd1UA',
  )

  const handleChatSubmit = async (question?: string) => {
    const userQuestion = question || chatInput.trim()
    if (!userQuestion || isLoading) return

    setChatInput('')
    setIsLoading(true)

    const newUserMessage: ChatMessage = { role: 'user', content: userQuestion }
    setChatMessages((prev) => [...prev, newUserMessage])

    try {
      const result = await askDemoBot({
        data: {
          question: userQuestion,
          history: chatMessages,
        },
      })

      const botMessage: ChatMessage = {
        role: 'assistant',
        content: result.answer,
      }
      setChatMessages((prev) => [...prev, botMessage])
    } catch (err) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content:
          err instanceof Error
            ? err.message
            : 'Произошла ошибка. Попробуйте снова.',
      }
      setChatMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const suggestedQuestions = [
    'Что делает ваш проект?',
    'Для кого предназначен этот продукт?',
    'Как ваш проект использует AI?',
    'Какие технологии вы используете?',
    'Каков статус проекта?',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#87CEEB] via-[#A8D8F0] to-[#90EE90]">
      {/* Header */}
      <header className="bg-[#8D6E63] border-b-4 border-[#5D4037] shadow-xl p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-black text-white flex items-center gap-2 hover:scale-105 transition-transform"
          >
            🌾 AgroGame
          </Link>
          <div className="flex gap-3">
            <Link
              to="/game"
              className="px-4 py-2 bg-[#4CAF50] text-white font-bold rounded-lg hover:bg-[#45a049] transition-colors"
            >
              Играть
            </Link>
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-[#FF9800] text-white font-bold rounded-lg hover:bg-[#e68900] transition-colors"
            >
              Дашборд
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-12">
        {/* Hero Section */}
        <section className="text-center py-12">
          <h1 className="text-5xl sm:text-6xl font-black text-[#2E7D32] mb-4 drop-shadow-lg">
            Демо Презентация
          </h1>
          <p className="text-xl text-[#1B5E20] font-bold max-w-3xl mx-auto">
            Платформа для связи виртуального фермерства с реальным агросектором
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold text-sm">
              ✅ MVP Ready
            </span>
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-bold text-sm">
              🚀 Stage 2
            </span>
          </div>
        </section>

        {/* Video Demo Section */}
        <section className="bg-white rounded-3xl p-8 border-4 border-[#4CAF50] shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Play className="text-[#4CAF50]" size={32} />
            <h2 className="text-3xl font-black text-[#2E7D32]">Демо Видео</h2>
          </div>

          <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative">
            {/* YouTube Video Embed */}
            {youtubeUrl ? (
              <iframe
                className="w-full h-full"
                src={youtubeUrl}
                title="AgroGame Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] p-8">
                <div className="text-center text-white">
                  <Play size={64} className="mx-auto mb-4" />
                  <p className="text-2xl font-bold mb-4">
                    Демо видео (1-5 минут)
                  </p>
                  <p className="text-sm opacity-80 mb-6">
                    Добавьте ссылку на YouTube видео
                  </p>

                  <div className="max-w-md mx-auto">
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/embed/VIDEO_ID"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg text-gray-900 text-sm"
                    />
                    <p className="text-xs mt-2 opacity-70">
                      Используйте формат: https://www.youtube.com/embed/VIDEO_ID
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 bg-[#E8F5E9] p-6 rounded-xl">
            <h3 className="font-bold text-[#2E7D32] mb-3 flex items-center gap-2">
              <CheckCircle2 size={20} />
              Что показано в демо:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>✅ Игровая механика: посадка, выращивание и сбор урожая</li>
              <li>✅ Конвертация виртуальных культур в реальные продукты</li>
              <li>✅ Дашборд для фермеров с аналитикой и метриками</li>
              <li>✅ AI-чат для помощи в принятии решений</li>
              <li>✅ Система мониторинга влажности и вредителей</li>
              <li>✅ Интеграция с погодным API для прогнозов</li>
            </ul>
          </div>
        </section>

        {/* Working App Link */}
        <section className="bg-gradient-to-r from-[#FFEB3B] to-[#FFC107] rounded-3xl p-8 border-4 border-[#FF9800] shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-[#E65100] mb-2 flex items-center gap-3">
                <ExternalLink size={32} />
                Рабочая Версия Приложения
              </h2>
              <p className="text-[#F57C00] font-bold">
                Попробуйте приложение прямо сейчас — авторизация не требуется
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                to="/game"
                className="px-6 py-3 bg-[#4CAF50] text-white font-black rounded-xl hover:bg-[#45a049] transition-all flex items-center gap-2 shadow-lg"
              >
                Играть в Игру <ArrowRight size={20} />
              </Link>
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-[#2196F3] text-white font-black rounded-xl hover:bg-[#1976D2] transition-all flex items-center gap-2 shadow-lg"
              >
                Дашборд Фермера <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>

        {/* Problem & Solution */}
        <section className="bg-white rounded-3xl p-8 border-4 border-[#FF5722] shadow-2xl">
          <h2 className="text-3xl font-black text-[#D84315] mb-6">
            Проблема и Решение
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#FFCCBC] p-6 rounded-2xl border-2 border-[#FF7043]">
              <h3 className="text-xl font-black text-[#BF360C] mb-4 flex items-center gap-2">
                ⚠️ Проблема
              </h3>
              <ul className="space-y-2 text-[#5D4037]">
                <li>🚫 Фермерам сложно находить рынки сбыта</li>
                <li>👥 Молодёжь не интересуется сельским хозяйством</li>
                <li>🔗 Нет связи между потребителями и производителями</li>
                <li>📉 Низкая цифровизация агросектора</li>
              </ul>
            </div>

            <div className="bg-[#C8E6C9] p-6 rounded-2xl border-2 border-[#66BB6A]">
              <h3 className="text-xl font-black text-[#1B5E20] mb-4 flex items-center gap-2">
                💡 Решение
              </h3>
              <ul className="space-y-2 text-[#2E7D32]">
                <li>🎮 Геймификация привлекает молодёжь</li>
                <li>🌾 Реальные награды от местных фермеров</li>
                <li>🤖 AI оптимизирует спрос и предложение</li>
                <li>📱 Мобильная платформа доступна везде</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="bg-white rounded-3xl p-8 border-4 border-[#2196F3] shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Code className="text-[#2196F3]" size={32} />
            <h2 className="text-3xl font-black text-[#1565C0]">
              Технологический Стек
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] p-6 rounded-2xl border-2 border-[#42A5F5]">
              <Database className="text-[#1976D2] mb-3" size={32} />
              <h3 className="font-black text-[#0D47A1] mb-3">
                Backend & Database
              </h3>
              <ul className="space-y-2 text-sm text-[#1565C0]">
                <li>• TanStack Start (Full-stack)</li>
                <li>• PostgreSQL + Drizzle ORM</li>
                <li>• Redis для кэширования</li>
                <li>• RESTful API</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#F3E5F5] to-[#E1BEE7] p-6 rounded-2xl border-2 border-[#BA68C8]">
              <Smartphone className="text-[#8E24AA] mb-3" size={32} />
              <h3 className="font-black text-[#6A1B9A] mb-3">
                Frontend & Mobile
              </h3>
              <ul className="space-y-2 text-sm text-[#7B1FA2]">
                <li>• React + TypeScript</li>
                <li>• TanStack Router/Query</li>
                <li>• Flutter (Mobile App)</li>
                <li>• Tailwind CSS</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#FFF3E0] to-[#FFE0B2] p-6 rounded-2xl border-2 border-[#FFB74D]">
              <Brain className="text-[#F57C00] mb-3" size={32} />
              <h3 className="font-black text-[#E65100] mb-3">AI & ML</h3>
              <ul className="space-y-2 text-sm text-[#EF6C00]">
                <li>• DeepSeek API (Chatbot)</li>
                <li>• TensorFlow/PyTorch</li>
                <li>• Computer Vision</li>
                <li>• Predictive Analytics</li>
              </ul>
            </div>
          </div>
        </section>

        {/* AI Solutions */}
        <section className="bg-gradient-to-br from-[#E1BEE7] to-[#CE93D8] rounded-3xl p-8 border-4 border-[#9C27B0] shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="text-[#6A1B9A]" size={32} />
            <h2 className="text-3xl font-black text-[#4A148C]">AI Решения</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/90 p-6 rounded-2xl">
              <h3 className="font-black text-[#6A1B9A] mb-3 flex items-center gap-2">
                🤖 AgroAI Чат-Ассистент
              </h3>
              <p className="text-gray-700 mb-3">
                Интеллектуальный помощник для фермеров, использующий DeepSeek
                API для анализа метрик и предоставления рекомендаций.
              </p>
              <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-bold">
                Внедрено в дашборде
              </span>
            </div>

            <div className="bg-white/90 p-6 rounded-2xl">
              <h3 className="font-black text-[#6A1B9A] mb-3 flex items-center gap-2">
                📊 Прогнозирование Спроса
              </h3>
              <p className="text-gray-700 mb-3">
                ML модели анализируют игровую активность и прогнозируют спрос на
                культуры для оптимизации производства.
              </p>
              <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-bold">
                В разработке
              </span>
            </div>

            <div className="bg-white/90 p-6 rounded-2xl">
              <h3 className="font-black text-[#6A1B9A] mb-3 flex items-center gap-2">
                🌾 Computer Vision Контроль
              </h3>
              <p className="text-gray-700 mb-3">
                Анализ состояния культур, выявление болезней и вредителей через
                изображения с использованием CNN.
              </p>
              <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-bold">
                Планируется
              </span>
            </div>

            <div className="bg-white/90 p-6 rounded-2xl">
              <h3 className="font-black text-[#6A1B9A] mb-3 flex items-center gap-2">
                🎯 Персонализация
              </h3>
              <p className="text-gray-700 mb-3">
                Рекомендательные системы для игровых заданий и оптимальных
                культур на основе поведения пользователя.
              </p>
              <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-bold">
                В разработке
              </span>
            </div>
          </div>
        </section>

        {/* Current Status & Next Steps */}
        <section className="bg-white rounded-3xl p-8 border-4 border-[#4CAF50] shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Rocket className="text-[#4CAF50]" size={32} />
            <h2 className="text-3xl font-black text-[#2E7D32]">
              Статус Проекта
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="bg-gradient-to-r from-[#4CAF50] to-[#8BC34A] text-white p-6 rounded-2xl mb-6">
                <h3 className="text-2xl font-black mb-2">Текущий Статус</h3>
                <p className="text-4xl font-black">MVP</p>
                <p className="text-sm opacity-90 mt-2">
                  Минимально жизнеспособный продукт
                </p>
              </div>

              <h4 className="font-black text-[#2E7D32] mb-4 flex items-center gap-2">
                <CheckCircle2 size={20} />
                Что уже готово:
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li>✅ Игровая механика (посадка, рост, сбор)</li>
                <li>✅ База данных и backend API</li>
                <li>✅ Дашборд для фермеров</li>
                <li>✅ AI чат-ассистент (DeepSeek)</li>
                <li>✅ Система мониторинга (влажность, вредители)</li>
                <li>✅ Интеграция с OpenWeather API</li>
                <li>✅ Конвертация виртуальных культур в реальные</li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-[#FF9800] mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                Следующие шаги:
              </h4>
              <div className="space-y-4">
                <div className="bg-[#FFF3E0] p-4 rounded-xl border-l-4 border-[#FF9800]">
                  <h5 className="font-bold text-[#E65100]">
                    1. Мобильное приложение
                  </h5>
                  <p className="text-sm text-gray-700">
                    Запуск Flutter app для iOS и Android
                  </p>
                </div>
                <div className="bg-[#FFF3E0] p-4 rounded-xl border-l-4 border-[#FF9800]">
                  <h5 className="font-bold text-[#E65100]">
                    2. Платежная система
                  </h5>
                  <p className="text-sm text-gray-700">
                    Интеграция Click, Payme для покупок
                  </p>
                </div>
                <div className="bg-[#FFF3E0] p-4 rounded-xl border-l-4 border-[#FF9800]">
                  <h5 className="font-bold text-[#E65100]">3. Партнерства</h5>
                  <p className="text-sm text-gray-700">
                    Сотрудничество с фермерами в регионах
                  </p>
                </div>
                <div className="bg-[#FFF3E0] p-4 rounded-xl border-l-4 border-[#FF9800]">
                  <h5 className="font-bold text-[#E65100]">4. ML модели</h5>
                  <p className="text-sm text-gray-700">
                    Развертывание прогнозирования и CV
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bonus: Chatbot */}
        <section className="bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-3xl p-8 border-4 border-[#4CAF50] shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="text-[#2E7D32]" size={32} />
            <h2 className="text-3xl font-black text-[#1B5E20]">
              Бонус: AI Чатбот
            </h2>
            <span className="ml-auto text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-bold">
              Powered by DeepSeek API
            </span>
          </div>

          <div className="bg-white rounded-2xl p-6 max-w-3xl mx-auto">
            <div className="mb-4 h-96 overflow-y-auto border-2 border-gray-200 rounded-xl p-4 space-y-3">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <MessageCircle
                    size={48}
                    className="mx-auto mb-4 text-gray-300"
                  />
                  <p className="font-bold">Задайте вопрос о проекте AgroGame</p>
                  <p className="text-sm">
                    Попробуйте предложенные вопросы ниже
                  </p>
                </div>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-[#4CAF50] text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-3 rounded-bl-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => handleChatSubmit(question)}
                  disabled={isLoading}
                  className="px-3 py-2 bg-[#E8F5E9] text-[#2E7D32] rounded-full text-sm font-medium hover:bg-[#C8E6C9] transition-colors disabled:opacity-50"
                >
                  {question}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && !e.shiftKey && handleChatSubmit()
                }
                placeholder="Напишите ваш вопрос..."
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50] transition-colors"
              />
              <button
                onClick={() => handleChatSubmit()}
                disabled={!chatInput.trim() || isLoading}
                className="px-6 py-3 bg-[#4CAF50] text-white font-bold rounded-xl hover:bg-[#45a049] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Отправить
              </button>
            </div>
          </div>
        </section>

        {/* Impact & Metrics */}
        <section className="bg-gradient-to-br from-[#FFF3E0] to-[#FFE0B2] rounded-3xl p-8 border-4 border-[#FF9800] shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Users className="text-[#E65100]" size={32} />
            <h2 className="text-3xl font-black text-[#BF360C]">
              Влияние и Метрики
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl text-center">
              <div className="text-4xl font-black text-[#4CAF50] mb-2">
                1000+
              </div>
              <p className="text-gray-700 font-bold">Целевых пользователей</p>
              <p className="text-sm text-gray-500 mt-1">В первые 3 месяца</p>
            </div>

            <div className="bg-white p-6 rounded-2xl text-center">
              <div className="text-4xl font-black text-[#2196F3] mb-2">50+</div>
              <p className="text-gray-700 font-bold">Партнёров-фермеров</p>
              <p className="text-sm text-gray-500 mt-1">
                В Ташкенте и областях
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl text-center">
              <div className="text-4xl font-black text-[#FF9800] mb-2">30%</div>
              <p className="text-gray-700 font-bold">Рост продаж фермеров</p>
              <p className="text-sm text-gray-500 mt-1">Ожидаемое увеличение</p>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="text-center py-12">
          <h2 className="text-4xl font-black text-[#2E7D32] mb-4">
            Готовы попробовать?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Присоединяйтесь к революции в агросекторе
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/game"
              className="px-8 py-4 bg-gradient-to-r from-[#4CAF50] to-[#8BC34A] text-white text-xl font-black rounded-full hover:scale-105 transition-transform shadow-2xl"
            >
              🎮 Начать играть
            </Link>
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-[#2196F3] to-[#42A5F5] text-white text-xl font-black rounded-full hover:scale-105 transition-transform shadow-2xl"
            >
              📊 Для фермеров
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#8D6E63] border-t-4 border-[#5D4037] py-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white font-bold">
            © 2024 AgroGame. Революция в агросекторе Узбекистана.
          </p>
          <p className="text-white/80 text-sm mt-2">
            Stage 2 — IT Park Uzbekistan Hackathon
          </p>
        </div>
      </footer>
    </div>
  )
}
