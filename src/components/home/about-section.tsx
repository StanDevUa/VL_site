import Image from "next/image";
import { Link } from "@/i18n/navigation";

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative scroll-mt-24 bg-transparent px-[18px] py-14 sm:px-6 sm:py-24 lg:px-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-[210px] right-[7%] h-8 w-5 rounded-tl-[60%] rounded-br-[60%] rounded-tr-[10%] rounded-bl-[10%] opacity-[.38]"
        style={{
          background: "linear-gradient(140deg, #7A3AA0, #2B6BB8)",
          animation: "vlFloat 10s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[260px] -left-[110px] h-[440px] w-[440px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 60% 40%, rgba(122,58,160,.16), rgba(43,107,184,.08) 58%, rgba(255,255,255,0) 76%)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-6 sm:grid-cols-[.9fr_1.1fr] sm:gap-16">
        <div className="relative">
          <div className="relative h-[320px] w-full overflow-hidden rounded-card shadow-[0_26px_54px_-30px_rgba(30,42,90,.4)] sm:h-[480px]">
            <Image
              src="/home/about.jpg"
              alt="Консультація"
              fill
              sizes="(min-width: 640px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute -right-[18px] -bottom-[18px] h-[120px] w-[120px] rounded-card opacity-[.14]"
            style={{
              background:
                "linear-gradient(120deg, #F2662F 0%, #C9307C 42%, #7A3AA0 70%, #2B6BB8 100%)",
            }}
          />
        </div>

        <div>
          <div className="mb-4 text-sm font-bold tracking-[1.6px] text-magenta uppercase">
            Про мене
          </div>
          <h2 className="mb-6 font-heading text-[28px] leading-[1.14] font-extrabold tracking-[-.4px] text-navy sm:text-[42px] sm:tracking-[-.8px]">
            Дитині потрібні час, терпіння і правда
          </h2>
          <p className="mb-[18px] text-[17px] leading-[1.72] text-navy-soft">
            За роки практики я переконалася: дитина розкривається там, де відчуває безпеку,
            прийняття, щирість і довіру. Це формує цінність. Тому моя робота починається з
            уважного спостереження та глибокого розуміння дитини – її емоцій, потреб,
            особливостей і внутрішнього світу.
          </p>
          <p className="mb-[18px] text-[17px] leading-[1.72] text-navy-soft">
            Працюю з емоціями, поведінковими проявами, тривожністю, страхами та кризовими
            станами. І обовʼязково поруч із батьками допомагаю зрозуміти дитину,
            вибудовувати близький та ефективний контакт і знаходити власну внутрішню опору у
            батьківстві.
          </p>
          <p className="mb-8 text-[17px] leading-[1.72] font-bold text-navy">
            Мій підхід – індивідуальний. Моя мета – допомогти дитині відновити внутрішню
            рівновагу, краще зрозуміти себе та розкрити свій потенціал, а родині – знайти
            власний шлях до взаєморозуміння.
          </p>
          <div className="flex flex-wrap items-center gap-3.5">
            <Link
              href="#diplomas"
              className="w-full rounded-field border-[1.5px] border-navy/18 bg-white/90 px-7 py-[15px] text-center font-heading text-base font-bold text-navy transition-[border-color,transform] duration-[250ms] ease-in-out hover:-translate-y-[3px] hover:border-magenta hover:text-magenta sm:w-auto"
            >
              Моя кваліфікація
            </Link>
            <Link
              href="#cta"
              className="w-full rounded-field bg-indigo px-7 py-[15px] text-center font-heading text-base font-bold text-white shadow-[0_12px_26px_-12px_rgba(82,82,172,.34)] transition-[transform,box-shadow,background-color] duration-[250ms] ease-in-out hover:-translate-y-[3px] hover:bg-indigo-hover hover:shadow-[0_18px_34px_-14px_rgba(82,82,172,.34)] sm:w-auto"
            >
              Записатися на консультацію
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
