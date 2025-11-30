export default function ImplementationSection() {
  return (
    <section className="relative py-12 px-4 sm:px-8">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8E1] via-[#FFECB3] to-[#FFE082] rounded-3xl"></div>

      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-[#FFD54F] rounded-full opacity-20 blur-2xl"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-[#FFA000] rounded-full opacity-20 blur-2xl"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-5xl sm:text-6xl font-black text-[#FF6F00] mb-4 uppercase tracking-tight relative inline-block">
            <span className="relative z-10 drop-shadow-[3px_3px_0_rgba(255,255,255,0.8)]">
              Реализация
            </span>
            <div className="absolute -bottom-2 left-0 right-0 h-3 bg-[#4CAF50] transform -skew-x-12 opacity-80"></div>
          </h2>
          <p className="text-[#E65100] font-bold text-lg mt-6">
            Современный технологический стек для инновационного продукта
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Technologies Card */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FFB300] to-[#FF6F00] rounded-3xl opacity-50 group-hover:opacity-75 blur transition duration-300"></div>

            <div className="relative bg-white rounded-3xl p-8 border-4 border-[#FFD54F] shadow-[8px_8px_0_#FF8F00] transform group-hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-3xl font-black text-[#E65100] mb-6 uppercase flex items-center gap-3">
                <span className="text-4xl">🛠</span>
                Технологии
              </h3>

              {/* Tech Stack Categories */}
              <div className="space-y-6">
                {/* Frontend Web */}
                <div className="bg-gradient-to-r from-[#FFF8E1] to-[#FFECB3] p-4 rounded-xl border-2 border-[#FFD54F]">
                  <h4 className="text-sm font-black text-[#FF6F00] mb-3 uppercase tracking-wide">
                    💻 Frontend (Web)
                  </h4>
                  <div className="space-y-2">
                    {[
                      'React + TypeScript',
                      'Tailwind CSS',
                      'TanStack Router/Query',
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-[#BF360C] font-semibold text-sm"
                      >
                        <div className="w-2 h-2 bg-[#FF6F00] rounded-full"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile */}
                <div className="bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB] p-4 rounded-xl border-2 border-[#42A5F5]">
                  <h4 className="text-sm font-black text-[#1565C0] mb-3 uppercase tracking-wide">
                    📱 Mobile App
                  </h4>
                  <div className="space-y-2">
                    {[
                      'Flutter + Dart',
                      'BLoC Pattern',
                      'Material Design 3',
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-[#0D47A1] font-semibold text-sm"
                      >
                        <div className="w-2 h-2 bg-[#1976D2] rounded-full"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Backend */}
                <div className="bg-gradient-to-r from-[#E8F5E9] to-[#C8E6C9] p-4 rounded-xl border-2 border-[#66BB6A]">
                  <h4 className="text-sm font-black text-[#2E7D32] mb-3 uppercase tracking-wide">
                    ⚙️ Backend
                  </h4>
                  <div className="space-y-2">
                    {[
                      'Node.js + Nitro',
                      'PostgreSQL + Drizzle ORM',
                      'Redis для кэширования',
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-[#1B5E20] font-semibold text-sm"
                      >
                        <div className="w-2 h-2 bg-[#388E3C] rounded-full"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Tech Card */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#9C27B0] via-[#E91E63] to-[#FF5722] rounded-3xl opacity-50 group-hover:opacity-75 blur transition duration-300"></div>

            <div className="relative bg-white rounded-3xl p-8 border-4 border-[#CE93D8] shadow-[8px_8px_0_#8E24AA] transform group-hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-3xl font-black text-[#6A1B9A] mb-6 uppercase flex items-center gap-3">
                <span className="text-4xl">🤖</span>
                AI Модели
              </h3>

              <div className="space-y-4">
                {/* AI Feature 1 */}
                <div className="bg-gradient-to-br from-[#F3E5F5] to-[#E1BEE7] p-4 rounded-xl border-2 border-[#BA68C8] group/item hover:scale-[1.02] transition-transform">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#9C27B0] to-[#7B1FA2] rounded-lg flex items-center justify-center text-xl shrink-0 shadow-md">
                      📊
                    </div>
                    <div>
                      <h4 className="font-black text-[#6A1B9A] mb-1">
                        Отслеживание метрик урожая
                      </h4>
                      <p className="text-sm text-[#4A148C] font-semibold leading-relaxed">
                        Computer Vision для анализа состояния культур,
                        предсказания урожайности и выявления болезней растений
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Feature 2 */}
                <div className="bg-gradient-to-br from-[#FCE4EC] to-[#F8BBD0] p-4 rounded-xl border-2 border-[#F06292] group/item hover:scale-[1.02] transition-transform">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#E91E63] to-[#C2185B] rounded-lg flex items-center justify-center text-xl shrink-0 shadow-md">
                      🌾
                    </div>
                    <div>
                      <h4 className="font-black text-[#AD1457] mb-1">
                        Прогноз посадок культур
                      </h4>
                      <p className="text-sm text-[#880E4F] font-semibold leading-relaxed">
                        ML модели анализируют данные продаж, сезонность и спрос
                        для оптимальной рекомендации культур фермерам
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Feature 3 */}
                <div className="bg-gradient-to-br from-[#FBE9E7] to-[#FFCCBC] p-4 rounded-xl border-2 border-[#FF8A65] group/item hover:scale-[1.02] transition-transform">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#FF5722] to-[#E64A19] rounded-lg flex items-center justify-center text-xl shrink-0 shadow-md">
                      🎮
                    </div>
                    <div>
                      <h4 className="font-black text-[#D84315] mb-1">
                        Персонализация опыта
                      </h4>
                      <p className="text-sm text-[#BF360C] font-semibold leading-relaxed">
                        Рекомендательные системы для игровых заданий, культур и
                        наград на основе поведения пользователя
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tech stack badge */}
              <div className="mt-6 pt-4 border-t-2 border-dashed border-[#CE93D8]">
                <p className="text-xs text-[#6A1B9A] font-bold uppercase tracking-wide mb-2">
                  Технологии AI:
                </p>
                <div className="flex flex-wrap gap-2">
                  {['TensorFlow', 'PyTorch', 'Scikit-learn'].map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white border-2 border-[#BA68C8] rounded-full text-xs font-bold text-[#6A1B9A]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Steps */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#4CAF50] to-[#8BC34A] rounded-3xl opacity-50 blur transition duration-300"></div>

          <div className="relative bg-white rounded-3xl p-8 border-4 border-[#81C784] shadow-[8px_8px_0_#4CAF50]">
            <h3 className="text-3xl font-black text-[#2E7D32] mb-8 uppercase flex items-center gap-3 justify-center">
              <span className="text-4xl">🚀</span>
              Ключевые шаги
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: '🎨',
                  title: 'UI/UX Разработка',
                  desc: 'Игровой движок и интерфейсы',
                },
                {
                  icon: '⚙️',
                  title: 'Backend & БД',
                  desc: 'API, база данных, интеграции',
                },
                {
                  icon: '🤖',
                  title: 'AI Integration',
                  desc: 'Модели прогнозирования и анализа',
                },
                {
                  icon: '📱',
                  title: 'Mobile App',
                  desc: 'Flutter приложение для iOS/Android',
                },
                {
                  icon: '🛒',
                  title: 'Система заказов',
                  desc: 'Логистика и доставка продуктов',
                },
                {
                  icon: '📊',
                  title: 'Аналитика',
                  desc: 'Метрики, дашборды, отчеты',
                },
                {
                  icon: '🎯',
                  title: 'Маркетинг',
                  desc: 'Запуск кампаний и привлечение',
                },
                {
                  icon: '🔄',
                  title: 'Итерации',
                  desc: 'Тестирование и улучшение',
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="group/step bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] p-4 rounded-xl border-2 border-[#81C784] hover:border-[#4CAF50] hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-12 h-12 bg-white rounded-xl border-2 border-[#66BB6A] flex items-center justify-center text-2xl group-hover/step:scale-110 transition-transform">
                      {step.icon}
                    </div>
                    <div className="w-8 h-8 bg-[#4CAF50] rounded-full flex items-center justify-center font-black text-white text-sm shadow-md">
                      {i + 1}
                    </div>
                    <h4 className="font-black text-[#2E7D32] text-sm leading-tight">
                      {step.title}
                    </h4>
                    <p className="text-xs text-[#1B5E20] font-semibold leading-snug">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div className="text-center mt-8">
          <div className="inline-block bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-[#FFD54F] shadow-lg">
            <p className="text-[#E65100] font-bold flex items-center gap-2">
              <span className="text-xl">⚡</span>
              MVP запуск через 3-4 месяца
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
