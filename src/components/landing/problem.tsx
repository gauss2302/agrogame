export default function ProblemSolutionSection() {
  return (
    <section className="relative py-16 px-4 sm:px-8 overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFE0B2] via-[#FFCCBC] to-[#FFAB91]">
        {/* Animated floating shapes */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-[#FF7043] rounded-full opacity-20 animate-[float_6s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-[#FFEB3B] rounded-full opacity-20 animate-[float_8s_ease-in-out_infinite_2s]"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-[#4CAF50] rounded-full opacity-15 animate-[float_7s_ease-in-out_infinite_1s]"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Title with enhanced styling */}
        <div className="text-center mb-12">
          <h2 className="text-5xl sm:text-6xl font-black text-[#BF360C] mb-4 uppercase tracking-tight relative inline-block">
            <span className="relative z-10 drop-shadow-[3px_3px_0_rgba(255,255,255,0.8)]">
              Проблема & Решение
            </span>
            {/* Underline decoration */}
            <div className="absolute -bottom-2 left-0 right-0 h-3 bg-[#FFEB3B] transform -skew-x-12 opacity-80"></div>
          </h2>
          <p className="text-[#D84315] font-bold text-lg mt-6 max-w-2xl mx-auto">
            От проблемы к инновационному решению за один клик
          </p>
        </div>

        {/* Cards Container with VS separator */}
        <div className="relative grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* VS Circle - centered between cards on desktop */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:block">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FF5722] to-[#D84315] rounded-full flex items-center justify-center border-4 border-white shadow-[0_8px_16px_rgba(0,0,0,0.3)] animate-pulse">
              <span className="text-white font-black text-xl">VS</span>
            </div>
          </div>

          {/* Problem Card */}
          <div className="group relative">
            {/* Card glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FF5722] to-[#D84315] rounded-3xl opacity-50 group-hover:opacity-75 blur transition duration-300"></div>

            <div className="relative bg-white rounded-3xl p-8 border-4 border-[#FF7043] shadow-[8px_8px_0_#D84315] transform group-hover:-translate-y-2 group-hover:shadow-[12px_12px_0_#D84315] transition-all duration-300">
              {/* Icon badge */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-[#FF5722] to-[#D84315] rounded-2xl flex items-center justify-center border-4 border-white shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                <span className="text-3xl">⚠️</span>
              </div>

              <div className="space-y-4">
                <h3 className="text-3xl font-black text-[#D84315] uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-8 bg-[#FF5722] rounded-full"></span>
                  Проблема
                </h3>

                {/* Problems list with icons */}
                <div className="space-y-3 pt-2">
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 bg-[#FFCCBC] rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-[#FF7043]">
                      <span className="text-sm">📊</span>
                    </div>
                    <p className="text-[#BF360C] font-semibold leading-relaxed">
                      Сложный доступ к рынкам сбыта для фермеров
                    </p>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 bg-[#FFCCBC] rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-[#FF7043]">
                      <span className="text-sm">👥</span>
                    </div>
                    <p className="text-[#BF360C] font-semibold leading-relaxed">
                      Низкая вовлеченность молодого поколения
                    </p>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 bg-[#FFCCBC] rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-[#FF7043]">
                      <span className="text-sm">🔗</span>
                    </div>
                    <p className="text-[#BF360C] font-semibold leading-relaxed">
                      Потеря связи между потребителями и источниками еды
                    </p>
                  </div>
                </div>

                {/* Impact badge */}
                <div className="pt-4 border-t-2 border-dashed border-[#FF7043]">
                  <span className="inline-block bg-[#FFCCBC] px-4 py-2 rounded-full text-[#BF360C] font-bold text-sm border-2 border-[#FF7043]">
                    💔 Влияет на экономику и безопасность
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Solution Card */}
          <div className="group relative">
            {/* Card glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FFEB3B] via-[#FBC02D] to-[#4CAF50] rounded-3xl opacity-50 group-hover:opacity-75 blur transition duration-300"></div>

            <div className="relative bg-white rounded-3xl p-8 border-4 border-[#FFEB3B] shadow-[8px_8px_0_#F57F17] transform group-hover:-translate-y-2 group-hover:shadow-[12px_12px_0_#F57F17] transition-all duration-300">
              {/* Icon badge */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-[#FFEB3B] to-[#4CAF50] rounded-2xl flex items-center justify-center border-4 border-white shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                <span className="text-3xl">💡</span>
              </div>

              <div className="space-y-4">
                <h3 className="text-3xl font-black text-[#F57F17] uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-8 bg-gradient-to-b from-[#FFEB3B] to-[#4CAF50] rounded-full"></span>
                  Решение
                </h3>

                {/* Solution features with icons */}
                <div className="space-y-3 pt-2">
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 bg-[#FFF9C4] rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-[#FFEB3B]">
                      <span className="text-sm">🎮</span>
                    </div>
                    <p className="text-[#F57F17] font-semibold leading-relaxed">
                      Геймифицированная платформа с реальными наградами
                    </p>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 bg-[#FFF9C4] rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-[#FFEB3B]">
                      <span className="text-sm">🌉</span>
                    </div>
                    <p className="text-[#F57F17] font-semibold leading-relaxed">
                      Цифровой мост между игрой и агросектором
                    </p>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 bg-[#FFF9C4] rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-[#FFEB3B]">
                      <span className="text-sm">🚜</span>
                    </div>
                    <p className="text-[#F57F17] font-semibold leading-relaxed">
                      Поддержка местных фермеров через игровые достижения
                    </p>
                  </div>
                </div>

                {/* Impact badge */}
                <div className="pt-4 border-t-2 border-dashed border-[#FFEB3B]">
                  <span className="inline-block bg-gradient-to-r from-[#FFEB3B] to-[#4CAF50] px-4 py-2 rounded-full text-white font-bold text-sm border-2 border-[#F57F17] shadow-md">
                    ✨ Увлекательно и доступно для всех
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA hint */}
        <div className="text-center mt-12">
          <div className="inline-block bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-[#FF7043] shadow-lg">
            <p className="text-[#D84315] font-bold flex items-center gap-2">
              <span className="animate-bounce">👇</span>
              Превращаем проблему в возможность
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </section>
  )
}
