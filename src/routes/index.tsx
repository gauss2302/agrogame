import { createFileRoute, Link } from '@tanstack/react-router'
import Game from '../components/Game'
import {
  CheckCircle2,
  Sprout,
  TrendingUp,
  Users,
  ShoppingBasket,
  ArrowRight,
} from 'lucide-react'
import ProblemSolutionSection from '@/components/landing/problem'
import ImplementationSection from '@/components/landing/Implementation'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="h-screen bg-[#8D6E63] font-sans relative overflow-x-hidden overflow-y-auto overscroll-y-none">
      {/* Wood Texture Background Overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%233E2723' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Hero Section */}
      <div className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Hero Video */}
        <video
          className="absolute inset-0 h-full w-full object-cover z-0"
          src="/landing_video.webm"
          autoPlay
          muted
          playsInline
          loop
          onEnded={(event) => {
            event.currentTarget.currentTime = 0
            void event.currentTarget.play()
          }}
        />

        {/* Background Game Animation */}
        <div className="absolute inset-0 z-0 opacity-30 scale-110 blur-sm pointer-events-none">
          <Game />
        </div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#8D6E63]/80 via-transparent to-[#8D6E63] z-0"></div>

        <div className="relative z-10 w-full max-w-5xl px-6 animate-in fade-in zoom-in duration-1000">
          <div className="flex flex-col items-center gap-6">
            <div className="w-full flex items-center justify-between text-white">
              <p className="text-2xl sm:text-3xl font-black drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
                Сажай в телефоне
              </p>
              <p className="text-2xl sm:text-3xl font-black drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
                Забирай с грядки
              </p>
            </div>

            <div className="bg-[#FFF8E1]/90 p-6 sm:p-8 rounded-[2.5rem] border-8 border-[#5D4037] shadow-[0_15px_0_rgba(62,39,35,0.4),0_0_40px_rgba(0,0,0,0.25)] text-center">
              <h1 className="text-5xl sm:text-7xl font-black tracking-tighter drop-shadow-md">
                <span className="text-[#FFC107]">Agro</span>
                <span className="text-[#4CAF50]">Game</span>
              </h1>
            </div>

            <div className="space-x-6">
              <Link
                to="/game"
                className="inline-flex items-center gap-3 bg-gradient-to-b from-[#8BC34A] to-[#689F38] text-white text-2xl font-black py-4 px-10 rounded-full border-b-8 border-[#33691E] shadow-[0_12px_0_#2E7D32,0_0_25px_rgba(0,0,0,0.35)] hover:-translate-y-1 hover:border-b-[12px] hover:shadow-[0_16px_0_#2E7D32,0_0_35px_rgba(0,0,0,0.45)] active:translate-y-2 active:border-b-0 transition-all"
              >
                ИГРАТЬ <ArrowRight size={32} strokeWidth={3} />
              </Link>

              <Link
                to="/dashboard"
                className="inline-flex items-center gap-3 bg-gradient-to-b from-[#8BC34A] to-[#689F38] text-white text-2xl font-black py-4 px-10 rounded-full border-b-8 border-[#33691E] shadow-[0_12px_0_#2E7D32,0_0_25px_rgba(0,0,0,0.35)] hover:-translate-y-1 hover:border-b-[12px] hover:shadow-[0_16px_0_#2E7D32,0_0_35px_rgba(0,0,0,0.45)] active:translate-y-2 active:border-b-0 transition-all"
              >
                ФЕРМЕРАМ <ArrowRight size={32} strokeWidth={3} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-24 relative z-10">
        {/* Bullet Points Section */}
        <section className="bg-[#FFECB3] rounded-3xl p-8 sm:p-12 border-4 border-[#FFA000] shadow-[10px_10px_0_rgba(62,39,35,0.2)] relative">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#FF6F00] text-white font-black text-xl px-8 py-2 rounded-full border-4 border-[#FFD54F] shadow-md uppercase tracking-widest">
            Why Play?
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-6">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#4CAF50] p-3 rounded-xl text-white shadow-[0_4px_0_#1B5E20] shrink-0">
                  <Users size={28} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#3E2723] mb-1">
                    Fun & Engaging
                  </h3>
                  <p className="text-[#5D4037] font-medium">
                    Users love to play! Experience the joy of farming right from
                    your phone.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-[#2196F3] p-3 rounded-xl text-white shadow-[0_4px_0_#0D47A1] shrink-0">
                  <Sprout size={28} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#3E2723] mb-1">
                    Virtual Farming
                  </h3>
                  <p className="text-[#5D4037] font-medium">
                    Plant seeds, water crops, and watch them grow in a beautiful
                    virtual world.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#FF9800] p-3 rounded-xl text-white shadow-[0_4px_0_#E65100] shrink-0">
                  <ShoppingBasket size={28} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#3E2723] mb-1">
                    Real Rewards
                  </h3>
                  <p className="text-[#5D4037] font-medium">
                    Get real agricultural products delivered to you by playing
                    the game.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-[#9C27B0] p-3 rounded-xl text-white shadow-[0_4px_0_#4A148C] shrink-0">
                  <TrendingUp size={28} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#3E2723] mb-1">
                    Track Progress
                  </h3>
                  <p className="text-[#5D4037] font-medium">
                    Monitor your farm's growth and your contribution to the
                    ecosystem.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mechanics Section */}
        <section className="relative">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-4 border-[#BCAAA4] shadow-[10px_10px_0_rgba(62,39,35,0.2)]">
            <h2 className="text-4xl font-black text-center text-[#3E2723] mb-12 uppercase tracking-wide">
              How It Works
            </h2>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-2 bg-[#D7CCC8] -z-10 -translate-y-1/2 rounded-full"></div>

              {[
                { title: 'Plant', icon: '🌱', desc: 'Choose your crop' },
                { title: 'Grow', icon: '💧', desc: 'Water & Care' },
                { title: 'Harvest', icon: '🚜', desc: 'Collect crops' },
                { title: 'Receive', icon: '🎁', desc: 'Get real goods' },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center bg-white p-4 z-10"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-[#8D6E63] to-[#5D4037] rounded-full flex items-center justify-center text-5xl shadow-[0_8px_0_#3E2723] mb-4 border-4 border-[#D7CCC8] transform hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-black text-[#3E2723]">
                    {step.title}
                  </h3>
                  <p className="text-[#8D6E63] font-bold">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-[#C8E6C9] rounded-3xl p-8 sm:p-12 border-4 border-[#4CAF50] shadow-[10px_10px_0_rgba(27,94,32,0.2)]">
          <h2 className="text-4xl font-black text-center text-[#1B5E20] mb-10 uppercase tracking-wide">
            Impact & Benefits
          </h2>

          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/50 p-6 rounded-2xl border-2 border-[#81C784]">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-xl font-black text-[#2E7D32] mb-2">
                Farmer Sales
              </h3>
              <p className="text-[#1B5E20]">
                Directly increases sales and market reach for local farmers.
              </p>
            </div>
            <div className="bg-white/50 p-6 rounded-2xl border-2 border-[#81C784]">
              <div className="text-5xl mb-4">🎮</div>
              <h3 className="text-xl font-black text-[#2E7D32] mb-2">
                Engagement
              </h3>
              <p className="text-[#1B5E20]">
                Higher player retention and daily activity through gamification.
              </p>
            </div>
            <div className="bg-white/50 p-6 rounded-2xl border-2 border-[#81C784]">
              <div className="text-5xl mb-4">🇺🇿</div>
              <h3 className="text-xl font-black text-[#2E7D32] mb-2">
                Uzbekistan Growth
              </h3>
              <p className="text-[#1B5E20]">
                Contributes to the growth and modernization of agriculture in
                Uzbekistan.
              </p>
            </div>
          </div>
        </section>

        <ProblemSolutionSection />

        {/* Why Us Section */}
        <section className="bg-[#E1BEE7] rounded-3xl p-8 sm:p-12 border-4 border-[#8E24AA] shadow-[10px_10px_0_rgba(74,20,140,0.2)] relative">
          <div className="absolute -top-6 left-10 bg-[#9C27B0] text-white font-black text-lg px-6 py-2 rounded-xl border-4 border-[#BA68C8] shadow-[4px_4px_0_#4A148C] uppercase tracking-widest rotate-[-2deg]">
            Team Power
          </div>
          <h2 className="text-4xl font-black text-center text-[#4A148C] mb-10 uppercase tracking-wide drop-shadow-[2px_2px_0_rgba(255,255,255,0.5)]">
            Почему Мы?
          </h2>
          <div className="bg-white p-8 rounded-2xl border-4 border-[#AB47BC] shadow-[8px_8px_0_#7B1FA2] text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-4 bg-[#F3E5F5]"></div>
            <p className="text-[#6A1B9A] font-bold text-lg leading-relaxed max-w-3xl mx-auto relative z-10">
              Наша команда объединяет экспертизу в IT, геймдеве и агробизнесе.
              Мы понимаем, как создавать вовлекающие продукты и знаем боли
              фермеров изнутри. Наш опыт в создании масштабируемых платформ и
              страсть к инновациям позволяют нам эффективно решать задачу
              цифровизации сельского хозяйства.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 bg-[#E1BEE7] rounded-full border-4 border-[#8E24AA] flex items-center justify-center text-xl"
                >
                  👾
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section className="bg-[#B3E5FC] rounded-3xl p-8 sm:p-12 border-4 border-[#0288D1] shadow-[10px_10px_0_rgba(1,87,155,0.2)]">
          <h2 className="text-4xl font-black text-center text-[#01579B] mb-12 uppercase tracking-wide drop-shadow-[2px_2px_0_rgba(255,255,255,0.5)]">
            Дорожная Карта
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-1/2 left-10 right-10 h-4 bg-[#81D4FA] -z-10 rounded-full border-2 border-[#0277BD]"></div>

            <div className="bg-white p-6 rounded-2xl border-4 border-[#29B6F6] w-full md:w-1/3 shadow-[6px_6px_0_#0277BD] opacity-80 hover:opacity-100 transition-opacity">
              <h3 className="text-xl font-black text-[#0277BD] mb-2 uppercase">
                Level 1: Идея
              </h3>
              <p className="text-[#01579B] font-bold text-sm">
                Концепция и анализ рынка
              </p>
            </div>

            <div className="bg-[#FFF9C4] p-6 rounded-2xl border-4 border-[#FFC107] w-full md:w-1/3 shadow-[0_0_0_4px_#FFA000,8px_8px_0_#F57F17] transform scale-110 z-10 relative">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#FF6F00] text-white text-xs font-black px-4 py-1 rounded-full border-2 border-[#FFCA28] shadow-sm uppercase">
                Current Stage
              </div>
              <h3 className="text-2xl font-black text-[#E65100] mb-2 uppercase">
                Level 2: MVP
              </h3>
              <p className="text-[#BF360C] font-bold">
                Разработка основной механики игры и интеграция с базой данных.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border-4 border-[#29B6F6] w-full md:w-1/3 shadow-[6px_6px_0_#0277BD] opacity-60 grayscale hover:grayscale-0 transition-all">
              <h3 className="text-xl font-black text-[#0277BD] mb-2 uppercase">
                Level 3: Запуск
              </h3>
              <p className="text-[#01579B] font-bold text-sm">
                Масштабирование и партнерства
              </p>
            </div>
          </div>
          <div className="mt-10 text-center">
            <div className="inline-block bg-[#0277BD] text-white font-bold px-6 py-3 rounded-xl border-4 border-[#4FC3F7] shadow-[4px_4px_0_#01579B]">
              NEXT MISSION: Тестирование с реальными пользователями
            </div>
          </div>
        </section>

        {/* Business Model Section */}
        <section className="bg-[#C8E6C9] rounded-3xl p-8 sm:p-12 border-4 border-[#2E7D32] shadow-[10px_10px_0_rgba(27,94,32,0.2)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#A5D6A7] rounded-full -translate-y-20 translate-x-20 opacity-50"></div>
          <h2 className="text-4xl font-black text-center text-[#1B5E20] mb-10 uppercase tracking-wide drop-shadow-[2px_2px_0_rgba(255,255,255,0.5)]">
            Бизнес Модель (Loot System)
          </h2>
          <div className="grid md:grid-cols-3 gap-6 relative z-10">
            {[
              {
                title: 'Комиссия',
                icon: '💰',
                desc: '10% с каждой транзакции на платформе.',
              },
              {
                title: 'Подписка',
                icon: '💎',
                desc: 'Premium-аккаунты для фермеров с расширенной аналитикой.',
              },
              {
                title: 'In-Game Shop',
                icon: '🛒',
                desc: 'Продажа косметических предметов и бустеров для игроков.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border-4 border-[#43A047] shadow-[6px_6px_0_#2E7D32] text-center transform hover:scale-105 transition-transform"
              >
                <div className="text-5xl mb-4 drop-shadow-md">{item.icon}</div>
                <h3 className="text-xl font-black text-[#2E7D32] mb-2 uppercase">
                  {item.title}
                </h3>
                <p className="text-[#1B5E20] font-bold text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Competitors Section */}
        <section className="bg-[#FFCDD2] rounded-3xl p-8 sm:p-12 border-4 border-[#C62828] shadow-[10px_10px_0_rgba(183,28,28,0.2)]">
          <h2 className="text-4xl font-black text-center text-[#B71C1C] mb-10 uppercase tracking-wide drop-shadow-[2px_2px_0_rgba(255,255,255,0.5)]">
            Соперники (Rivals)
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border-4 border-[#EF5350] shadow-[6px_6px_0_#C62828] opacity-80">
              <h3 className="text-2xl font-black text-[#C62828] mb-4 uppercase flex items-center gap-2">
                <span className="text-3xl">🦖</span> Old School Markets
              </h3>
              <p className="text-[#B71C1C] font-bold">
                Традиционные рынки и ярмарки.
                <br />
                <span className="text-sm opacity-75">
                  Минусы: Неудобно, трата времени, нет доставки.
                </span>
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border-4 border-[#EF5350] shadow-[6px_6px_0_#C62828] opacity-80">
              <h3 className="text-2xl font-black text-[#C62828] mb-4 uppercase flex items-center gap-2">
                <span className="text-3xl">🤖</span> Generic Delivery Apps
              </h3>
              <p className="text-[#B71C1C] font-bold">
                Обычные приложения доставки еды.
                <br />
                <span className="text-sm opacity-75">
                  Минусы: Нет геймификации, нет связи с фермером, безлико.
                </span>
              </p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <div className="inline-block bg-[#C62828] text-white font-black px-6 py-3 rounded-xl border-4 border-[#E57373] shadow-[4px_4px_0_#B71C1C] uppercase rotate-1">
              AgroGame Wins!
            </div>
          </div>
        </section>

        {/* Implementation Plan Section */}
        <ImplementationSection />

        {/* Final CTA */}
        <div className="text-center pb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-3 bg-gradient-to-b from-[#FFCA28] to-[#FFB300] text-[#3E2723] text-3xl font-black py-6 px-16 rounded-full border-b-8 border-[#FF6F00] shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:border-b-[12px] hover:shadow-2xl active:translate-y-2 active:border-b-0 transition-all"
          >
            START FARMING NOW!
          </Link>
        </div>
      </div>
    </div>
  )
}
