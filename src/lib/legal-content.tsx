import type { ReactNode } from "react";
import type { AppLocale } from "@/i18n/routing";

/** Контент правових документів (`/legal/[slug]`) — перекладено на всі 3 мови сайту. */

export const CONTACT_EMAIL = "vik_vik@ukr.net";
export const CONTACT_PHONE = "+380 67 656 74 70";

const ENTITY_NAME: Record<AppLocale, string> = {
  uk: "ФОП Лемешко Вікторія Віталіївна",
  en: "Viktoriia Lemeshko, Individual Entrepreneur (Ukraine)",
  ru: "ФОП Лемешко Виктория Витальевна",
};

const ENTITY_ID: Record<AppLocale, string> = {
  uk: "РНОКПП (ІПН) 2864116303",
  en: "Taxpayer Identification Number (RNOKPP) 2864116303",
  ru: "РНОКПП (ИНН) 2864116303",
};

export type LegalDocMeta = { slug: string; pill: string };

export const LEGAL_DOC_META: Record<AppLocale, LegalDocMeta[]> = {
  uk: [
    { slug: "pryvatnist", pill: "Політика конфіденційності" },
    { slug: "umovy-vykorystannia", pill: "Умови використання" },
    { slug: "dostavka", pill: "Оплата й доставка" },
    { slug: "povernennia", pill: "Умови повернення" },
  ],
  en: [
    { slug: "pryvatnist", pill: "Privacy policy" },
    { slug: "umovy-vykorystannia", pill: "Terms of use" },
    { slug: "dostavka", pill: "Payment & delivery" },
    { slug: "povernennia", pill: "Return policy" },
  ],
  ru: [
    { slug: "pryvatnist", pill: "Политика конфиденциальности" },
    { slug: "umovy-vykorystannia", pill: "Условия использования" },
    { slug: "dostavka", pill: "Оплата и доставка" },
    { slug: "povernennia", pill: "Условия возврата" },
  ],
};

type LegalSection = { id: string; title: string; body: ReactNode };
export type LegalDoc = {
  slug: string;
  title: string;
  updated: string;
  intro: ReactNode;
  sections: LegalSection[];
};

const linkClass = "border-b border-blue/40 font-bold text-blue hover:text-magenta";

function P({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`mb-4 text-[17px] leading-[1.8] text-navy-soft text-pretty ${className}`}>{children}</p>;
}

function UL({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mb-[22px] flex flex-col gap-[10px]">
      {items.map((item, i) => (
        <li key={i} className="flex gap-[11px] text-[17px] leading-[1.7] text-navy-soft">
          <span className="mt-[10px] h-[7px] w-[7px] shrink-0 rounded-full bg-navy" />
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6 rounded-[12px] border border-navy/12 border-l-[3px] border-l-coral bg-powder-beige/55 px-[22px] py-5">
      <p className="text-base leading-[1.7] text-navy text-pretty">{children}</p>
    </div>
  );
}

const thClass =
  "whitespace-nowrap border-b border-navy/12 bg-powder-pink/80 px-[14px] py-3 text-left font-heading font-bold text-navy";
const tdNavyClass = "border-b border-navy/12 px-[14px] py-3 text-navy";
const tdSoftClass = "border-b border-navy/12 px-[14px] py-3 text-navy-soft";

const DELIVERY_TABLE: Record<AppLocale, { head: [string, string, string]; rows: { a: string; b: string; c: string }[] }> = {
  uk: {
    head: ["Спосіб", "Термін", "Вартість"],
    rows: [
      { a: "Відділення Нової пошти", b: "1–3 робочі дні", c: "за тарифами перевізника" },
      { a: "Кур'єр Нової пошти", b: "1–3 робочі дні", c: "за тарифами перевізника" },
      { a: "Поштомат", b: "2–4 робочі дні", c: "за тарифами перевізника" },
    ],
  },
  en: {
    head: ["Method", "Timeframe", "Cost"],
    rows: [
      { a: "Nova Poshta branch", b: "1–3 business days", c: "at carrier's rates" },
      { a: "Nova Poshta courier", b: "1–3 business days", c: "at carrier's rates" },
      { a: "Parcel locker", b: "2–4 business days", c: "at carrier's rates" },
    ],
  },
  ru: {
    head: ["Способ", "Срок", "Стоимость"],
    rows: [
      { a: "Отделение Новой почты", b: "1–3 рабочих дня", c: "по тарифам перевозчика" },
      { a: "Курьер Новой почты", b: "1–3 рабочих дня", c: "по тарифам перевозчика" },
      { a: "Почтомат", b: "2–4 рабочих дня", c: "по тарифам перевозчика" },
    ],
  },
};

function DeliveryRatesTable({ locale }: { locale: AppLocale }) {
  const { head, rows } = DELIVERY_TABLE[locale];
  return (
    <div className="mb-6 overflow-x-auto">
      <table className="w-full border-collapse text-base">
        <thead>
          <tr>
            <th className={thClass}>{head[0]}</th>
            <th className={thClass}>{head[1]}</th>
            <th className={thClass}>{head[2]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.a}>
              <td className={tdNavyClass}>{r.a}</td>
              <td className={tdSoftClass}>{r.b}</td>
              <td className={tdSoftClass}>{r.c}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function buildDocsUk(): LegalDoc[] {
  const entityName = ENTITY_NAME.uk;
  const entityId = ENTITY_ID.uk;
  return [
    // ── Політика конфіденційності ────────────────────────────────────
    {
      slug: "pryvatnist",
      title: "Політика конфіденційності",
      updated: "26 вересня 2026",
      intro: (
        <P className="mb-[26px]">
          Ця Політика описує, які персональні дані збирає сайт, з якою метою вони обробляються та які
          права має користувач. Використовуючи сайт і залишаючи свої дані у формах, ви погоджуєтесь з
          умовами, викладеними нижче.
        </P>
      ),
      sections: [
        {
          id: "s1",
          title: "1. Загальні положення",
          body: (
            <>
              <P>
                Політику розроблено відповідно до Закону України «Про захист персональних даних» №2297-VI
                та іншого чинного законодавства України у сфері захисту персональних даних.
              </P>
              <P>
                Володільцем персональних даних, зібраних через сайт, є {entityName} ({entityId}), контакти
                якого наведено у розділі «Контакти» цього документа.
              </P>
            </>
          ),
        },
        {
          id: "s2",
          title: "2. Які дані ми збираємо",
          body: (
            <>
              <P>Залежно від того, якою формою на сайті ви користуєтесь, обробляються такі дані:</P>
              <UL
                items={[
                  "Оформлення замовлення в магазині: ім'я одержувача, номер телефону, email, місто й відділення Нової пошти для доставки, коментар до замовлення (за бажанням).",
                  "Запис на консультацію: ім'я, номер телефону, email, коментар щодо запиту.",
                  "Запитання у розділі FAQ: ім'я та email.",
                  "Технічні дані кошика покупок зберігаються лише локально в браузері (localStorage) і на сервер не передаються до моменту оформлення замовлення.",
                ]}
              />
              <Callout>
                Дані банківської картки сайт не збирає і не зберігає — оплата обробляється безпосередньо
                платіжною системою WayForPay на її захищеній сторінці.
              </Callout>
            </>
          ),
        },
        {
          id: "s3",
          title: "3. Мета та підстави обробки",
          body: (
            <>
              <P>Персональні дані обробляються з метою:</P>
              <UL
                items={[
                  "оформлення, обробки та доставки замовлень з магазину;",
                  "запису на консультацію та зворотного зв'язку щодо неї;",
                  "надання відповіді на запитання, залишене через форму FAQ;",
                  "виконання вимог податкового й бухгалтерського обліку, встановлених законодавством України для фізичних осіб-підприємців.",
                ]}
              />
              <P>
                Підставою обробки є згода суб'єкта персональних даних, надана шляхом заповнення відповідної
                форми, та необхідність виконання договору (замовлення), стороною якого є суб'єкт даних.
              </P>
            </>
          ),
        },
        {
          id: "s4",
          title: "4. Кому передаються дані",
          body: (
            <>
              <P>Для виконання замовлення чи запису на консультацію дані можуть передаватись:</P>
              <UL
                items={[
                  "платіжній системі WayForPay — для проведення й підтвердження оплати;",
                  "АТ «Нова пошта» — для доставки замовлення (ім'я, телефон, відділення);",
                  "постачальникам хостингу та поштових сервісів — виключно для технічного забезпечення роботи сайту.",
                ]}
              />
              <P>
                Персональні дані не продаються і не передаються третім особам у маркетингових цілях без
                окремої згоди суб'єкта даних.
              </P>
            </>
          ),
        },
        {
          id: "s5",
          title: "5. Строк зберігання даних",
          body: (
            <P>
              Дані замовлень зберігаються протягом строку, необхідного для виконання зобов'язань за
              замовленням, а також протягом строку зберігання первинних документів, встановленого
              податковим законодавством України. Дані, надіслані через форми запису на консультацію та
              запитання FAQ, зберігаються до досягнення мети звернення й видаляються або знеособлюються за
              запитом суб'єкта даних.
            </P>
          ),
        },
        {
          id: "s6",
          title: "6. Файли cookie та локальне сховище",
          body: (
            <P>
              Станом на дату публікації цієї Політики сайт не використовує рекламних чи аналітичних
              cookie-файлів. Локальне сховище браузера (localStorage) застосовується виключно технічно —
              для збереження вмісту кошика покупок між візитами. Якщо в майбутньому це зміниться, текст
              цього розділу буде оновлено.
            </P>
          ),
        },
        {
          id: "s7",
          title: "7. Ваші права",
          body: (
            <>
              <P>Відповідно до законодавства про захист персональних даних, ви маєте право:</P>
              <UL
                items={[
                  "отримати доступ до своїх персональних даних та інформацію про їх обробку;",
                  "вимагати виправлення неточних або застарілих даних;",
                  "відкликати згоду на обробку даних та вимагати їх видалення;",
                  "заперечити проти обробки даних у випадках, передбачених законом;",
                  "подати скаргу до Уповноваженого Верховної Ради України з прав людини.",
                ]}
              />
              <P>
                Для реалізації будь-якого з цих прав напишіть на{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                  {CONTACT_EMAIL}
                </a>
                .
              </P>
            </>
          ),
        },
        {
          id: "s8",
          title: "8. Захист даних",
          body: (
            <P>
              Для захисту персональних даних застосовуються розумні технічні та організаційні заходи:
              захищене з'єднання (HTTPS), обмежений доступ до даних, зберігання лише в обсязі, необхідному
              для заявлених цілей. Водночас передача даних через мережу Інтернет та обробка на стороні
              платіжної системи чи перевізника відбуваються згідно з їхніми власними політиками
              конфіденційності, за дії яких володілець сайту відповідальності не несе.
            </P>
          ),
        },
        {
          id: "s9",
          title: "9. Контакти",
          body: (
            <P className="mb-0">
              {entityName}, {entityId}.
              <br />
              Email:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                {CONTACT_EMAIL}
              </a>
              <br />
              Телефон:{" "}
              <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className={linkClass}>
                {CONTACT_PHONE}
              </a>
            </P>
          ),
        },
      ],
    },

    // ── Умови використання ───────────────────────────────────────────
    {
      slug: "umovy-vykorystannia",
      title: "Умови використання",
      updated: "26 вересня 2026",
      intro: (
        <P className="mb-[26px]">
          Ці Умови регулюють користування сайтом та його розділами — інформацією про послуги, магазином і
          формою запису на консультацію. Власником сайту є {entityName} ({entityId}). Використовуючи
          сайт, ви погоджуєтесь із цими Умовами.
        </P>
      ),
      sections: [
        {
          id: "s1",
          title: "1. Загальні положення",
          body: (
            <P>
              Ці Умови застосовуються до всіх відвідувачів і користувачів сайту. Якщо ви не погоджуєтесь з
              будь-яким із положень, будь ласка, утримайтесь від використання сайту.
            </P>
          ),
        },
        {
          id: "s2",
          title: "2. Використання сайту",
          body: (
            <>
              <P>
                Сайт має інформаційний характер: розповідає про послуги практичного психолога, авторську
                методику ТМ «Єнот ЕМО», дозволяє записатися на консультацію та придбати товари в магазині.
              </P>
              <P>Користуючись сайтом, ви погоджуєтесь не:</P>
              <UL
                items={[
                  "копіювати чи поширювати вміст сайту без письмової згоди власника;",
                  "вчиняти дії, спрямовані на порушення роботи сайту чи обхід його захисту;",
                  "вказувати під час оформлення замовлення чи запису на консультацію завідомо неправдиві дані.",
                ]}
              />
            </>
          ),
        },
        {
          id: "s3",
          title: "3. Інтелектуальна власність",
          body: (
            <P>
              Текстові й графічні матеріали сайту, назва та символіка ТМ «Єнот ЕМО», а також авторська
              методика належать {entityName} і охороняються законодавством України про авторське право.
              Використання цих матеріалів без попередньої письмової згоди заборонено.
            </P>
          ),
        },
        {
          id: "s4",
          title: "4. Магазин, консультації та оплата",
          body: (
            <P>
              Придбання товарів у розділі «Магазин» додатково регулюється документами{" "}
              <a href="/legal/dostavka" className={linkClass}>
                «Оплата й доставка»
              </a>{" "}
              та{" "}
              <a href="/legal/povernennia" className={linkClass}>
                «Умови повернення»
              </a>
              , які є невід'ємною частиною цих Умов. Форма запису на консультацію є попереднім зверненням,
              а не публічною офертою — дата, формат і вартість консультації узгоджуються індивідуально після
              звернення.
            </P>
          ),
        },
        {
          id: "s5",
          title: "5. Обмеження відповідальності",
          body: (
            <>
              <P>
                Матеріали сайту мають ознайомчий характер і не замінюють особистої консультації фахівця. У
                разі кризової ситуації, що потребує невідкладної допомоги, зверніться до відповідних служб
                екстреної допомоги.
              </P>
              <P>
                Власник сайту не несе відповідальності за тимчасову недоступність сайту з технічних причин,
                а також за дії третіх сторін — платіжної системи чи служби доставки, — що перебувають поза
                межами його контролю.
              </P>
            </>
          ),
        },
        {
          id: "s6",
          title: "6. Персональні дані",
          body: (
            <P>
              Обробка персональних даних, які ви залишаєте на сайті, регулюється{" "}
              <a href="/legal/pryvatnist" className={linkClass}>
                Політикою конфіденційності
              </a>
              , що є невід'ємною частиною цих Умов.
            </P>
          ),
        },
        {
          id: "s7",
          title: "7. Зміни до умов",
          body: (
            <P>
              Власник сайту має право оновлювати ці Умови в односторонньому порядку. Актуальна редакція
              завжди публікується на цій сторінці із зазначенням дати оновлення.
            </P>
          ),
        },
        {
          id: "s8",
          title: "8. Застосовне право",
          body: (
            <P className="mb-0">
              Ці Умови регулюються законодавством України. Спори, що виникають у зв'язку з використанням
              сайту, вирішуються шляхом переговорів, а в разі недосягнення згоди — в судовому порядку
              відповідно до законодавства України.
            </P>
          ),
        },
      ],
    },

    // ── Оплата й доставка ─────────────────────────────────────────────
    {
      slug: "dostavka",
      title: "Оплата й доставка",
      updated: "26 вересня 2026",
      intro: (
        <P className="mb-[26px]">
          Цей документ описує порядок оплати замовлень і доставки товарів магазину та продукції ТМ «Єнот
          ЕМО».
        </P>
      ),
      sections: [
        {
          id: "s1",
          title: "1. Способи оплати",
          body: (
            <>
              <P>
                Оплата замовлення здійснюється в момент оформлення — карткою Visa або Mastercard через
                захищений платіжний сервіс WayForPay. Дані картки обробляються на стороні платіжної системи
                і не зберігаються на сайті.
              </P>
              <UL
                items={[
                  "Оплата карткою онлайн у момент оформлення замовлення.",
                  "Післяплата не застосовується: замовлення передається в доставку лише після оплати.",
                  "Для оптових замовлень і навчальних закладів можлива оплата за рахунком — за попередньою домовленістю.",
                ]}
              />
            </>
          ),
        },
        {
          id: "s2",
          title: "2. Терміни відправлення",
          body: (
            <>
              <P>
                Замовлення передається в Нову пошту протягом двох робочих днів після зарахування оплати.
                Якщо товару немає в наявності, з вами звʼяжуться, щоб узгодити новий термін або оформити
                повернення коштів.
              </P>
              <Callout>
                Вартість доставки не входить у суму замовлення й оплачується отримувачем за тарифами Нової
                пошти.
              </Callout>
            </>
          ),
        },
        {
          id: "s3",
          title: "3. Тарифи та способи доставки",
          body: <DeliveryRatesTable locale="uk" />,
        },
        {
          id: "s4",
          title: "4. Отримання замовлення",
          body: (
            <P>
              Номер накладної надходить на вказаний email і в SMS. Відправлення зберігається у відділенні
              п'ять робочих днів, після чого повертається відправнику.
            </P>
          ),
        },
        {
          id: "s5",
          title: "5. Контакти",
          body: (
            <P className="mb-0">
              З питань оплати й доставки пишіть на{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                {CONTACT_EMAIL}
              </a>
              . Відповідаю протягом одного робочого дня.
            </P>
          ),
        },
      ],
    },

    // ── Умови повернення ──────────────────────────────────────────────
    {
      slug: "povernennia",
      title: "Умови повернення",
      updated: "26 вересня 2026",
      intro: (
        <P className="mb-[26px]">
          Ці Умови визначають порядок повернення товарів, придбаних у магазині на сайті, відповідно до
          Закону України «Про захист прав споживачів» щодо договорів, укладених на відстані.
        </P>
      ),
      sections: [
        {
          id: "s1",
          title: "1. Право на повернення",
          body: (
            <P>
              Покупець має право відмовитися від товару належної якості протягом 14 днів з моменту його
              отримання, без пояснення причин.
            </P>
          ),
        },
        {
          id: "s2",
          title: "2. Умови повернення товару",
          body: (
            <>
              <P>Товар приймається до повернення за умови, що він:</P>
              <UL
                items={[
                  "не був у використанні та зберіг товарний вигляд і споживчі властивості;",
                  "повернутий в оригінальній упаковці та в повній комплектації;",
                  "супроводжується номером замовлення або накладною Нової пошти, що підтверджує покупку.",
                ]}
              />
              <P>
                Не підлягають поверненню товари, виготовлені за індивідуальним замовленням, а також товари
                зі слідами використання, не пов'язаними з перевіркою їхньої якості.
              </P>
            </>
          ),
        },
        {
          id: "s3",
          title: "3. Порядок повернення",
          body: (
            <P>
              Щоб повернути товар, напишіть на{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                {CONTACT_EMAIL}
              </a>{" "}
              із зазначенням номера замовлення. Після узгодження відправте товар Новою поштою на вказану
              адресу. Вартість зворотної пересилки товару належної якості оплачує покупець; якщо причиною
              повернення є брак чи пересортиця — вартість пересилки відшкодовує продавець.
            </P>
          ),
        },
        {
          id: "s4",
          title: "4. Повернення коштів",
          body: (
            <P>
              Кошти повертаються тим самим способом, яким було здійснено оплату (на картку, з якої
              проведено платіж), не пізніше ніж протягом 7 календарних днів після отримання поверненого
              товару та перевірки його стану.
            </P>
          ),
        },
        {
          id: "s5",
          title: "5. Обмін товару",
          body: (
            <P>
              За домовленістю товар належної якості можна обміняти на інший за наявності. Різниця у
              вартості за потреби доплачується покупцем або повертається йому.
            </P>
          ),
        },
        {
          id: "s6",
          title: "6. Контакти",
          body: (
            <P className="mb-0">
              {entityName}, {entityId}.
              <br />
              Email:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                {CONTACT_EMAIL}
              </a>
              <br />
              Телефон:{" "}
              <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className={linkClass}>
                {CONTACT_PHONE}
              </a>
            </P>
          ),
        },
      ],
    },
  ];
}

function buildDocsEn(): LegalDoc[] {
  const entityName = ENTITY_NAME.en;
  const entityId = ENTITY_ID.en;
  return [
    // ── Privacy policy ────────────────────────────────────────────────
    {
      slug: "pryvatnist",
      title: "Privacy policy",
      updated: "September 26, 2026",
      intro: (
        <P className="mb-[26px]">
          This Policy describes what personal data the website collects, for what purpose it is
          processed, and what rights the user has. By using the website and submitting your data through
          its forms, you agree to the terms set out below.
        </P>
      ),
      sections: [
        {
          id: "s1",
          title: "1. General provisions",
          body: (
            <>
              <P>
                This Policy has been developed in accordance with the Law of Ukraine "On Personal Data
                Protection" No. 2297-VI and other applicable Ukrainian legislation on personal data
                protection.
              </P>
              <P>
                The controller of personal data collected through the website is {entityName} ({entityId}),
                whose contact details are provided in the "Contacts" section of this document.
              </P>
            </>
          ),
        },
        {
          id: "s2",
          title: "2. What data we collect",
          body: (
            <>
              <P>Depending on which form on the website you use, the following data is processed:</P>
              <UL
                items={[
                  "Placing an order in the shop: recipient's name, phone number, email, city and Nova Poshta branch for delivery, order comment (optional).",
                  "Booking a consultation: name, phone number, email, comment about the request.",
                  "A question in the FAQ section: name and email.",
                  "Technical shopping-cart data is stored only locally in the browser (localStorage) and is not sent to the server until the order is placed.",
                ]}
              />
              <Callout>
                The website does not collect or store bank card data — payment is processed directly by
                the WayForPay payment system on its secure page.
              </Callout>
            </>
          ),
        },
        {
          id: "s3",
          title: "3. Purpose and legal basis for processing",
          body: (
            <>
              <P>Personal data is processed for the purpose of:</P>
              <UL
                items={[
                  "placing, processing and delivering orders from the shop;",
                  "booking a consultation and following up on it;",
                  "responding to a question submitted through the FAQ form;",
                  "complying with tax and accounting requirements established by Ukrainian law for individual entrepreneurs.",
                ]}
              />
              <P>
                The legal basis for processing is the consent of the data subject, given by filling in the
                relevant form, and the necessity of performing the contract (order) to which the data
                subject is a party.
              </P>
            </>
          ),
        },
        {
          id: "s4",
          title: "4. Who receives the data",
          body: (
            <>
              <P>To fulfil an order or a consultation booking, data may be shared with:</P>
              <UL
                items={[
                  "the WayForPay payment system — to process and confirm payment;",
                  "Nova Poshta JSC — to deliver the order (name, phone number, branch);",
                  "hosting and email service providers — solely for the technical operation of the website.",
                ]}
              />
              <P>
                Personal data is not sold or shared with third parties for marketing purposes without the
                separate consent of the data subject.
              </P>
            </>
          ),
        },
        {
          id: "s5",
          title: "5. Data retention period",
          body: (
            <P>
              Order data is retained for as long as necessary to fulfil obligations under the order, as
              well as for the retention period for primary documents established by Ukrainian tax law.
              Data submitted through the consultation-booking and FAQ-question forms is retained until the
              purpose of the request has been achieved, after which it is deleted or anonymised at the data
              subject's request.
            </P>
          ),
        },
        {
          id: "s6",
          title: "6. Cookies and local storage",
          body: (
            <P>
              As of the date of publication of this Policy, the website does not use advertising or
              analytics cookies. The browser's local storage (localStorage) is used solely for a technical
              purpose — to keep the shopping cart contents between visits. Should this change in the
              future, this section will be updated.
            </P>
          ),
        },
        {
          id: "s7",
          title: "7. Your rights",
          body: (
            <>
              <P>Under personal data protection law, you have the right to:</P>
              <UL
                items={[
                  "access your personal data and information about its processing;",
                  "request correction of inaccurate or outdated data;",
                  "withdraw your consent to processing and request its deletion;",
                  "object to processing in the cases provided for by law;",
                  "file a complaint with the Ukrainian Parliament Commissioner for Human Rights.",
                ]}
              />
              <P>
                To exercise any of these rights, please write to{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                  {CONTACT_EMAIL}
                </a>
                .
              </P>
            </>
          ),
        },
        {
          id: "s8",
          title: "8. Data protection",
          body: (
            <P>
              Reasonable technical and organisational measures are applied to protect personal data: a
              secure connection (HTTPS), restricted access to data, and storage limited to what is
              necessary for the stated purposes. At the same time, data transmission over the internet and
              processing on the side of the payment system or the carrier are carried out under their own
              privacy policies, for which the website owner bears no responsibility.
            </P>
          ),
        },
        {
          id: "s9",
          title: "9. Contacts",
          body: (
            <P className="mb-0">
              {entityName}, {entityId}.
              <br />
              Email:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                {CONTACT_EMAIL}
              </a>
              <br />
              Phone:{" "}
              <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className={linkClass}>
                {CONTACT_PHONE}
              </a>
            </P>
          ),
        },
      ],
    },

    // ── Terms of use ──────────────────────────────────────────────────
    {
      slug: "umovy-vykorystannia",
      title: "Terms of use",
      updated: "September 26, 2026",
      intro: (
        <P className="mb-[26px]">
          These Terms govern the use of the website and its sections — information about services, the
          shop, and the consultation-booking form. The website owner is {entityName} ({entityId}). By
          using the website, you agree to these Terms.
        </P>
      ),
      sections: [
        {
          id: "s1",
          title: "1. General provisions",
          body: (
            <P>
              These Terms apply to all visitors and users of the website. If you do not agree with any of
              the provisions, please refrain from using the website.
            </P>
          ),
        },
        {
          id: "s2",
          title: "2. Using the website",
          body: (
            <>
              <P>
                The website is informational in nature: it describes the services of a practising
                psychologist and the proprietary TM «Enot EMO» method, and allows booking a consultation
                and purchasing items in the shop.
              </P>
              <P>By using the website, you agree not to:</P>
              <UL
                items={[
                  "copy or distribute the website's content without the owner's written consent;",
                  "take any action aimed at disrupting the website's operation or bypassing its protection;",
                  "provide knowingly false information when placing an order or booking a consultation.",
                ]}
              />
            </>
          ),
        },
        {
          id: "s3",
          title: "3. Intellectual property",
          body: (
            <P>
              The text and graphic materials of the website, the name and symbols of TM «Enot EMO», and
              the proprietary method belong to {entityName} and are protected by Ukrainian copyright law.
              Using these materials without prior written consent is prohibited.
            </P>
          ),
        },
        {
          id: "s4",
          title: "4. Shop, consultations and payment",
          body: (
            <P>
              Purchases made in the "Shop" section are additionally governed by the{" "}
              <a href="/legal/dostavka" className={linkClass}>
                "Payment & delivery"
              </a>{" "}
              and{" "}
              <a href="/legal/povernennia" className={linkClass}>
                "Return policy"
              </a>{" "}
              documents, which form an integral part of these Terms. The consultation-booking form is a
              preliminary inquiry, not a public offer — the date, format, and cost of a consultation are
              agreed individually after you get in touch.
            </P>
          ),
        },
        {
          id: "s5",
          title: "5. Limitation of liability",
          body: (
            <>
              <P>
                The website's materials are informational in nature and do not replace a personal
                consultation with a specialist. In a crisis situation requiring urgent help, please contact
                the relevant emergency services.
              </P>
              <P>
                The website owner is not liable for the website's temporary unavailability due to technical
                reasons, or for the actions of third parties — the payment system or the delivery service —
                that are beyond her control.
              </P>
            </>
          ),
        },
        {
          id: "s6",
          title: "6. Personal data",
          body: (
            <P>
              The processing of personal data you leave on the website is governed by the{" "}
              <a href="/legal/pryvatnist" className={linkClass}>
                Privacy policy
              </a>
              , which forms an integral part of these Terms.
            </P>
          ),
        },
        {
          id: "s7",
          title: "7. Changes to these Terms",
          body: (
            <P>
              The website owner may update these Terms unilaterally. The current version is always
              published on this page with the date of the last update.
            </P>
          ),
        },
        {
          id: "s8",
          title: "8. Governing law",
          body: (
            <P className="mb-0">
              These Terms are governed by the law of Ukraine. Disputes arising from the use of the website
              are resolved through negotiation, and if no agreement is reached — in court, in accordance
              with the law of Ukraine.
            </P>
          ),
        },
      ],
    },

    // ── Payment & delivery ────────────────────────────────────────────
    {
      slug: "dostavka",
      title: "Payment & delivery",
      updated: "September 26, 2026",
      intro: (
        <P className="mb-[26px]">
          This document describes the procedure for paying for orders and delivering shop items and TM
          «Enot EMO» products.
        </P>
      ),
      sections: [
        {
          id: "s1",
          title: "1. Payment methods",
          body: (
            <>
              <P>
                An order is paid for at the moment it is placed — by Visa or Mastercard through the secure
                WayForPay payment service. Card data is processed on the payment system's side and is not
                stored on the website.
              </P>
              <UL
                items={[
                  "Payment by card online at the moment the order is placed.",
                  "Cash on delivery is not available: the order is handed over for delivery only after payment.",
                  "For bulk orders and educational institutions, payment by invoice is possible by prior arrangement.",
                ]}
              />
            </>
          ),
        },
        {
          id: "s2",
          title: "2. Shipping timeframe",
          body: (
            <>
              <P>
                The order is handed over to Nova Poshta within two business days after payment is
                credited. If an item is out of stock, we will contact you to agree on a new timeframe or
                arrange a refund.
              </P>
              <Callout>
                The delivery cost is not included in the order total and is paid by the recipient at Nova
                Poshta's rates.
              </Callout>
            </>
          ),
        },
        {
          id: "s3",
          title: "3. Rates and delivery methods",
          body: <DeliveryRatesTable locale="en" />,
        },
        {
          id: "s4",
          title: "4. Receiving the order",
          body: (
            <P>
              The tracking number is sent to the email you provided and by SMS. The parcel is held at the
              branch for five business days, after which it is returned to the sender.
            </P>
          ),
        },
        {
          id: "s5",
          title: "5. Contacts",
          body: (
            <P className="mb-0">
              For questions about payment and delivery, write to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                {CONTACT_EMAIL}
              </a>
              . I reply within one business day.
            </P>
          ),
        },
      ],
    },

    // ── Return policy ─────────────────────────────────────────────────
    {
      slug: "povernennia",
      title: "Return policy",
      updated: "September 26, 2026",
      intro: (
        <P className="mb-[26px]">
          These Terms set out the procedure for returning items purchased in the website's shop, in
          accordance with the Law of Ukraine "On Consumer Rights Protection" regarding distance contracts.
        </P>
      ),
      sections: [
        {
          id: "s1",
          title: "1. Right of return",
          body: (
            <P>
              The buyer has the right to withdraw from an item of proper quality within 14 days of
              receiving it, without giving a reason.
            </P>
          ),
        },
        {
          id: "s2",
          title: "2. Conditions for returning an item",
          body: (
            <>
              <P>An item is accepted for return provided that it:</P>
              <UL
                items={[
                  "has not been used and has retained its merchantable appearance and consumer properties;",
                  "is returned in its original packaging and complete set;",
                  "is accompanied by the order number or a Nova Poshta waybill confirming the purchase.",
                ]}
              />
              <P>
                Items made to individual order are not eligible for return, nor are items showing signs of
                use unrelated to checking their quality.
              </P>
            </>
          ),
        },
        {
          id: "s3",
          title: "3. Return procedure",
          body: (
            <P>
              To return an item, write to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                {CONTACT_EMAIL}
              </a>{" "}
              stating your order number. Once agreed, send the item via Nova Poshta to the address
              provided. Return shipping for an item of proper quality is paid by the buyer; if the reason
              for the return is a defect or a mix-up, the seller reimburses the shipping cost.
            </P>
          ),
        },
        {
          id: "s4",
          title: "4. Refunds",
          body: (
            <P>
              The refund is issued using the same method the payment was made (to the card used for
              payment), no later than 7 calendar days after the returned item is received and its
              condition is checked.
            </P>
          ),
        },
        {
          id: "s5",
          title: "5. Exchanging an item",
          body: (
            <P>
              By agreement, an item of proper quality can be exchanged for another one, subject to
              availability. Any price difference is paid by, or refunded to, the buyer as applicable.
            </P>
          ),
        },
        {
          id: "s6",
          title: "6. Contacts",
          body: (
            <P className="mb-0">
              {entityName}, {entityId}.
              <br />
              Email:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                {CONTACT_EMAIL}
              </a>
              <br />
              Phone:{" "}
              <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className={linkClass}>
                {CONTACT_PHONE}
              </a>
            </P>
          ),
        },
      ],
    },
  ];
}

function buildDocsRu(): LegalDoc[] {
  const entityName = ENTITY_NAME.ru;
  const entityId = ENTITY_ID.ru;
  return [
    // ── Политика конфиденциальности ──────────────────────────────────
    {
      slug: "pryvatnist",
      title: "Политика конфиденциальности",
      updated: "26 сентября 2026",
      intro: (
        <P className="mb-[26px]">
          Эта Политика описывает, какие персональные данные собирает сайт, с какой целью они
          обрабатываются и какие права имеет пользователь. Используя сайт и оставляя свои данные в
          формах, вы соглашаетесь с условиями, изложенными ниже.
        </P>
      ),
      sections: [
        {
          id: "s1",
          title: "1. Общие положения",
          body: (
            <>
              <P>
                Политика разработана в соответствии с Законом Украины «О защите персональных данных»
                №2297-VI и иным действующим законодательством Украины в сфере защиты персональных данных.
              </P>
              <P>
                Владельцем персональных данных, собранных через сайт, является {entityName} ({entityId}),
                контакты которого указаны в разделе «Контакты» этого документа.
              </P>
            </>
          ),
        },
        {
          id: "s2",
          title: "2. Какие данные мы собираем",
          body: (
            <>
              <P>В зависимости от того, какой формой на сайте вы пользуетесь, обрабатываются следующие данные:</P>
              <UL
                items={[
                  "Оформление заказа в магазине: имя получателя, номер телефона, email, город и отделение Новой почты для доставки, комментарий к заказу (по желанию).",
                  "Запись на консультацию: имя, номер телефона, email, комментарий по запросу.",
                  "Вопрос в разделе FAQ: имя и email.",
                  "Технические данные корзины покупок хранятся только локально в браузере (localStorage) и на сервер не передаются до момента оформления заказа.",
                ]}
              />
              <Callout>
                Данные банковской карты сайт не собирает и не хранит — оплата обрабатывается
                непосредственно платёжной системой WayForPay на её защищённой странице.
              </Callout>
            </>
          ),
        },
        {
          id: "s3",
          title: "3. Цель и основания обработки",
          body: (
            <>
              <P>Персональные данные обрабатываются с целью:</P>
              <UL
                items={[
                  "оформления, обработки и доставки заказов из магазина;",
                  "записи на консультацию и обратной связи по ней;",
                  "предоставления ответа на вопрос, оставленный через форму FAQ;",
                  "выполнения требований налогового и бухгалтерского учёта, установленных законодательством Украины для физических лиц-предпринимателей.",
                ]}
              />
              <P>
                Основанием обработки является согласие субъекта персональных данных, предоставленное путём
                заполнения соответствующей формы, а также необходимость исполнения договора (заказа),
                стороной которого является субъект данных.
              </P>
            </>
          ),
        },
        {
          id: "s4",
          title: "4. Кому передаются данные",
          body: (
            <>
              <P>Для выполнения заказа или записи на консультацию данные могут передаваться:</P>
              <UL
                items={[
                  "платёжной системе WayForPay — для проведения и подтверждения оплаты;",
                  "АО «Новая почта» — для доставки заказа (имя, телефон, отделение);",
                  "поставщикам хостинга и почтовых сервисов — исключительно для технического обеспечения работы сайта.",
                ]}
              />
              <P>
                Персональные данные не продаются и не передаются третьим лицам в маркетинговых целях без
                отдельного согласия субъекта данных.
              </P>
            </>
          ),
        },
        {
          id: "s5",
          title: "5. Срок хранения данных",
          body: (
            <P>
              Данные заказов хранятся в течение срока, необходимого для выполнения обязательств по заказу,
              а также в течение срока хранения первичных документов, установленного налоговым
              законодательством Украины. Данные, отправленные через формы записи на консультацию и вопроса
              FAQ, хранятся до достижения цели обращения и удаляются или обезличиваются по запросу субъекта
              данных.
            </P>
          ),
        },
        {
          id: "s6",
          title: "6. Файлы cookie и локальное хранилище",
          body: (
            <P>
              На дату публикации этой Политики сайт не использует рекламных или аналитических
              cookie-файлов. Локальное хранилище браузера (localStorage) применяется исключительно
              технически — для сохранения содержимого корзины покупок между визитами. Если в будущем это
              изменится, текст этого раздела будет обновлён.
            </P>
          ),
        },
        {
          id: "s7",
          title: "7. Ваши права",
          body: (
            <>
              <P>В соответствии с законодательством о защите персональных данных вы имеете право:</P>
              <UL
                items={[
                  "получить доступ к своим персональным данным и информации об их обработке;",
                  "требовать исправления неточных или устаревших данных;",
                  "отозвать согласие на обработку данных и требовать их удаления;",
                  "возражать против обработки данных в случаях, предусмотренных законом;",
                  "подать жалобу Уполномоченному Верховной Рады Украины по правам человека.",
                ]}
              />
              <P>
                Для реализации любого из этих прав напишите на{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                  {CONTACT_EMAIL}
                </a>
                .
              </P>
            </>
          ),
        },
        {
          id: "s8",
          title: "8. Защита данных",
          body: (
            <P>
              Для защиты персональных данных применяются разумные технические и организационные меры:
              защищённое соединение (HTTPS), ограниченный доступ к данным, хранение только в объёме,
              необходимом для заявленных целей. При этом передача данных через сеть Интернет и обработка на
              стороне платёжной системы или перевозчика осуществляются согласно их собственным политикам
              конфиденциальности, за действия которых владелец сайта ответственности не несёт.
            </P>
          ),
        },
        {
          id: "s9",
          title: "9. Контакты",
          body: (
            <P className="mb-0">
              {entityName}, {entityId}.
              <br />
              Email:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                {CONTACT_EMAIL}
              </a>
              <br />
              Телефон:{" "}
              <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className={linkClass}>
                {CONTACT_PHONE}
              </a>
            </P>
          ),
        },
      ],
    },

    // ── Условия использования ─────────────────────────────────────────
    {
      slug: "umovy-vykorystannia",
      title: "Условия использования",
      updated: "26 сентября 2026",
      intro: (
        <P className="mb-[26px]">
          Эти Условия регулируют пользование сайтом и его разделами — информацией об услугах, магазином и
          формой записи на консультацию. Владельцем сайта является {entityName} ({entityId}). Используя
          сайт, вы соглашаетесь с этими Условиями.
        </P>
      ),
      sections: [
        {
          id: "s1",
          title: "1. Общие положения",
          body: (
            <P>
              Эти Условия применяются ко всем посетителям и пользователям сайта. Если вы не согласны с
              каким-либо из положений, пожалуйста, воздержитесь от использования сайта.
            </P>
          ),
        },
        {
          id: "s2",
          title: "2. Использование сайта",
          body: (
            <>
              <P>
                Сайт носит информационный характер: рассказывает об услугах практического психолога,
                авторской методике ТМ «Енот ЭМО», позволяет записаться на консультацию и приобрести товары
                в магазине.
              </P>
              <P>Пользуясь сайтом, вы соглашаетесь не:</P>
              <UL
                items={[
                  "копировать или распространять содержимое сайта без письменного согласия владельца;",
                  "совершать действия, направленные на нарушение работы сайта или обход его защиты;",
                  "указывать при оформлении заказа или записи на консультацию заведомо ложные данные.",
                ]}
              />
            </>
          ),
        },
        {
          id: "s3",
          title: "3. Интеллектуальная собственность",
          body: (
            <P>
              Текстовые и графические материалы сайта, название и символика ТМ «Енот ЭМО», а также
              авторская методика принадлежат {entityName} и охраняются законодательством Украины об
              авторском праве. Использование этих материалов без предварительного письменного согласия
              запрещено.
            </P>
          ),
        },
        {
          id: "s4",
          title: "4. Магазин, консультации и оплата",
          body: (
            <P>
              Приобретение товаров в разделе «Магазин» дополнительно регулируется документами{" "}
              <a href="/legal/dostavka" className={linkClass}>
                «Оплата и доставка»
              </a>{" "}
              и{" "}
              <a href="/legal/povernennia" className={linkClass}>
                «Условия возврата»
              </a>
              , которые являются неотъемлемой частью этих Условий. Форма записи на консультацию является
              предварительным обращением, а не публичной офертой — дата, формат и стоимость консультации
              согласовываются индивидуально после обращения.
            </P>
          ),
        },
        {
          id: "s5",
          title: "5. Ограничение ответственности",
          body: (
            <>
              <P>
                Материалы сайта носят ознакомительный характер и не заменяют личной консультации
                специалиста. В случае кризисной ситуации, требующей неотложной помощи, обратитесь в
                соответствующие службы экстренной помощи.
              </P>
              <P>
                Владелец сайта не несёт ответственности за временную недоступность сайта по техническим
                причинам, а также за действия третьих сторон — платёжной системы или службы доставки, —
                находящиеся вне её контроля.
              </P>
            </>
          ),
        },
        {
          id: "s6",
          title: "6. Персональные данные",
          body: (
            <P>
              Обработка персональных данных, которые вы оставляете на сайте, регулируется{" "}
              <a href="/legal/pryvatnist" className={linkClass}>
                Политикой конфиденциальности
              </a>
              , которая является неотъемлемой частью этих Условий.
            </P>
          ),
        },
        {
          id: "s7",
          title: "7. Изменения условий",
          body: (
            <P>
              Владелец сайта вправе обновлять эти Условия в одностороннем порядке. Актуальная редакция
              всегда публикуется на этой странице с указанием даты обновления.
            </P>
          ),
        },
        {
          id: "s8",
          title: "8. Применимое право",
          body: (
            <P className="mb-0">
              Эти Условия регулируются законодательством Украины. Споры, возникающие в связи с
              использованием сайта, решаются путём переговоров, а в случае недостижения согласия — в
              судебном порядке в соответствии с законодательством Украины.
            </P>
          ),
        },
      ],
    },

    // ── Оплата и доставка ─────────────────────────────────────────────
    {
      slug: "dostavka",
      title: "Оплата и доставка",
      updated: "26 сентября 2026",
      intro: (
        <P className="mb-[26px]">
          Этот документ описывает порядок оплаты заказов и доставки товаров магазина и продукции ТМ
          «Енот ЭМО».
        </P>
      ),
      sections: [
        {
          id: "s1",
          title: "1. Способы оплаты",
          body: (
            <>
              <P>
                Оплата заказа осуществляется в момент оформления — картой Visa или Mastercard через
                защищённый платёжный сервис WayForPay. Данные карты обрабатываются на стороне платёжной
                системы и не хранятся на сайте.
              </P>
              <UL
                items={[
                  "Оплата картой онлайн в момент оформления заказа.",
                  "Наложенный платёж не применяется: заказ передаётся в доставку только после оплаты.",
                  "Для оптовых заказов и учебных заведений возможна оплата по счёту — по предварительной договорённости.",
                ]}
              />
            </>
          ),
        },
        {
          id: "s2",
          title: "2. Сроки отправления",
          body: (
            <>
              <P>
                Заказ передаётся в Новую почту в течение двух рабочих дней после зачисления оплаты. Если
                товара нет в наличии, с вами свяжутся, чтобы согласовать новый срок или оформить возврат
                средств.
              </P>
              <Callout>
                Стоимость доставки не входит в сумму заказа и оплачивается получателем по тарифам Новой
                почты.
              </Callout>
            </>
          ),
        },
        {
          id: "s3",
          title: "3. Тарифы и способы доставки",
          body: <DeliveryRatesTable locale="ru" />,
        },
        {
          id: "s4",
          title: "4. Получение заказа",
          body: (
            <P>
              Номер накладной поступает на указанный email и в SMS. Отправление хранится в отделении пять
              рабочих дней, после чего возвращается отправителю.
            </P>
          ),
        },
        {
          id: "s5",
          title: "5. Контакты",
          body: (
            <P className="mb-0">
              По вопросам оплаты и доставки пишите на{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                {CONTACT_EMAIL}
              </a>
              . Отвечаю в течение одного рабочего дня.
            </P>
          ),
        },
      ],
    },

    // ── Условия возврата ──────────────────────────────────────────────
    {
      slug: "povernennia",
      title: "Условия возврата",
      updated: "26 сентября 2026",
      intro: (
        <P className="mb-[26px]">
          Эти Условия определяют порядок возврата товаров, приобретённых в магазине на сайте, в
          соответствии с Законом Украины «О защите прав потребителей» в части договоров, заключённых на
          расстоянии.
        </P>
      ),
      sections: [
        {
          id: "s1",
          title: "1. Право на возврат",
          body: (
            <P>
              Покупатель вправе отказаться от товара надлежащего качества в течение 14 дней с момента его
              получения, без объяснения причин.
            </P>
          ),
        },
        {
          id: "s2",
          title: "2. Условия возврата товара",
          body: (
            <>
              <P>Товар принимается к возврату при условии, что он:</P>
              <UL
                items={[
                  "не был в использовании и сохранил товарный вид и потребительские свойства;",
                  "возвращён в оригинальной упаковке и в полной комплектации;",
                  "сопровождается номером заказа или накладной Новой почты, подтверждающей покупку.",
                ]}
              />
              <P>
                Не подлежат возврату товары, изготовленные по индивидуальному заказу, а также товары со
                следами использования, не связанными с проверкой их качества.
              </P>
            </>
          ),
        },
        {
          id: "s3",
          title: "3. Порядок возврата",
          body: (
            <P>
              Чтобы вернуть товар, напишите на{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                {CONTACT_EMAIL}
              </a>{" "}
              с указанием номера заказа. После согласования отправьте товар Новой почтой по указанному
              адресу. Стоимость обратной пересылки товара надлежащего качества оплачивает покупатель; если
              причиной возврата является брак или пересортица — стоимость пересылки возмещает продавец.
            </P>
          ),
        },
        {
          id: "s4",
          title: "4. Возврат средств",
          body: (
            <P>
              Средства возвращаются тем же способом, которым была произведена оплата (на карту, с которой
              проведён платёж), не позднее чем в течение 7 календарных дней после получения возвращённого
              товара и проверки его состояния.
            </P>
          ),
        },
        {
          id: "s5",
          title: "5. Обмен товара",
          body: (
            <P>
              По договорённости товар надлежащего качества можно обменять на другой при наличии. Разница в
              стоимости при необходимости доплачивается покупателем или возвращается ему.
            </P>
          ),
        },
        {
          id: "s6",
          title: "6. Контакты",
          body: (
            <P className="mb-0">
              {entityName}, {entityId}.
              <br />
              Email:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                {CONTACT_EMAIL}
              </a>
              <br />
              Телефон:{" "}
              <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className={linkClass}>
                {CONTACT_PHONE}
              </a>
            </P>
          ),
        },
      ],
    },
  ];
}

export const LEGAL_DOCS: Record<AppLocale, LegalDoc[]> = {
  uk: buildDocsUk(),
  en: buildDocsEn(),
  ru: buildDocsRu(),
};
