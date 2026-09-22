# Архітектура проєкту — Ресурс 1 (сайт-візитка Вікторії Лемешко)

На основі `tech_specs.md` та макетів у `design/`. Затверджені рішення з обговорення позначені **[Погоджено]**; авторські пропозиції з обґрунтуванням позначені **[Пропозиція]** — їх варто підтвердити окремо. Нерозв'язані дрібні питання винесені в розділ «Відкриті питання» в кінці.

## 1. Стек

| Шар | Вибір | Коментар |
|---|---|---|
| Фреймворк | Next.js 14+ (App Router) + TypeScript | Як рекомендовано в ТЗ. Гібридний рендеринг підходить під поєднання статичного контенту й магазину/адмінки. |
| БД | PostgreSQL + Prisma ORM | Як рекомендовано в ТЗ. |
| Стилі | Tailwind CSS на токенах дизайн-системи | Кольори/радіуси/тіні з `VL Design System` виносяться в `tailwind.config.ts` як theme tokens (не хардкодяться в компонентах). |
| i18n (інтерфейс) | next-intl | Локалізовані маршрути через префікс (`/`, `/en/`, `/ru/`); словники — окремі JSON/TS файли на мову. |
| Автентифікація | Auth.js (NextAuth v5) + Prisma adapter | Див. розділ 6. |
| Платежі | WayForPay | Власна інтеграція (офіційного Node SDK немає) — HTTP-виклики + HMAC-підпис за їхньою документацією. |
| Доставка | Публічне API Нової пошти | Проксі через серверний route (щоб не світити ключ на клієнті) для пошуку міста й відділення. |
| Файли/зображення | Об'єктне сховище, сумісне з S3 (напр. Cloudflare R2) | Локальні файли непридатні для serverless-хостингу. Остаточний провайдер — при виборі хостингу (за ТЗ, це рішення відкладене); архітектура лише передбачає, що URL фото зберігаються в БД, а не бінарні дані. |
| Email-сповіщення | Resend / SMTP (Nodemailer) | Заявки на консультацію та питання з FAQ надсилаються Вікторії на пошту (див. розділ 5.6). |

### 1.1 Моно-репозиторій чи окремий проєкт? [Пропозиція]

ТЗ прямо каже, що архітектура Ресурсу 1 має закладати базу для Ресурсів 2–3 (спільна модель користувача, спільна дизайн-система). Дві крайності:

- **Повний монорепо зараз** (apps/vl-site, apps/emo-site, apps/pro-site, packages/db, packages/ui) — дає готову структуру під майбутнє, але Ресурси 2–3 ще не почались, і зайва інфраструктура (Turborepo/pnpm workspaces) додає складність, якою зараз ніхто не користується.
- **Ізольований проєкт без огляду на майбутнє** — найпростіше зараз, але ризикує болючим рефакторингом моделі User/ролей, коли підключаться Ресурси 2–3.

**Пропоную середній варіант**: один Next.js-проєкт зараз (без монорепо-тулінгу), але з рішеннями, які дешево екстрактити пізніше:
- Prisma-схема користувача одразу описує всі три ролі (`PURCHASER`, `PARENT`, `PSYCHOLOGIST`) через enum, а не лише `PURCHASER` — додавання нових ролей у майбутньому не потребує міграції структури.
- Cookie сесії одразу конфігурується на `.lemeshko.org` (кореневий домен), навіть якщо поки є лише один піддомен.
- Дизайн-токени Tailwind виносяться в окремий `design-tokens.ts`, який легко перенести в спільний пакет пізніше.
- Структура `src/` тримає домени (shop, content, auth) в окремих папках, а не «all in one bag», щоб виділення в пакети пізніше було механічним переносом папок.

Коли почнеться Ресурс 2, тоді і буде сенс перетворити repo на монорепо (`git mv` папок у `packages/`, підключення Turborepo) — на цьому етапі ціна такого рефакторингу низька.

## 2. Структура папок

```
vl-site/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                     # тестові категорії/товари для розробки
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx          # header, footer, lang switcher, cart icon
│   │   │   ├── page.tsx            # головна
│   │   │   ├── roboty/
│   │   │   │   ├── page.tsx        # список "Мої роботи"
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── novyny/
│   │   │   │   ├── page.tsx        # список "Новини та анонси"
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── shop/
│   │   │   │   ├── page.tsx        # каталог
│   │   │   │   └── [slug]/page.tsx # картка товару
│   │   │   ├── cart/page.tsx
│   │   │   ├── checkout/
│   │   │   │   ├── page.tsx
│   │   │   │   └── success/page.tsx
│   │   │   └── legal/[slug]/page.tsx  # один шаблон, контент — MDX/i18n-словник
│   │   ├── admin/                  # без [locale] — інтерфейс завжди укр.
│   │   │   ├── layout.tsx          # захищений layout (перевірка isAdmin)
│   │   │   ├── page.tsx            # дашборд / останні замовлення
│   │   │   ├── categories/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   ├── works/
│   │   │   ├── news/
│   │   │   ├── testimonials/
│   │   │   ├── diplomas/
│   │   │   └── login/
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── consultation-request/route.ts
│   │       ├── faq-question/route.ts
│   │       ├── cart/                       # server actions замість цього можливі
│   │       ├── checkout/create-order/route.ts
│   │       ├── payments/wayforpay/
│   │       │   ├── callback/route.ts       # серверний webhook від WayForPay
│   │       │   └── return/route.ts
│   │       └── nova-poshta/
│   │           ├── cities/route.ts         # проксі до API НП
│   │           └── warehouses/route.ts
│   ├── components/
│   │   ├── ui/                     # кнопки, картки, форми — з дизайн-системи
│   │   ├── layout/                 # Header, Footer, LangSwitcher, CartIcon
│   │   └── sections/               # секції головної (Hero, Services, Reviews, ...)
│   ├── content/
│   │   └── legal/                  # {slug}.uk.mdx, {slug}.en.mdx, {slug}.ru.mdx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts                 # Auth.js config
│   │   ├── i18n/                   # next-intl config, локалізовані словники
│   │   ├── wayforpay.ts
│   │   ├── novaposhta.ts
│   │   └── mail.ts
│   ├── server/
│   │   ├── actions/                # server actions: cart, orders, admin CRUD
│   │   └── queries/                # переюзані select-и (наприклад "showOnHome")
│   └── middleware.ts               # next-intl routing + захист /admin
├── public/
├── design-tokens.ts                # кольори/радіуси/тіні з дизайн-системи
├── tailwind.config.ts
└── package.json
```

## 3. Модель даних (Prisma)

### 3.1 Підхід до мультимовності контенту [Пропозиція]

Для полів, керованих з адмінки (назви товарів, описи тощо), пропоную **не** окрему таблицю перекладів, а **пласкі колонки на мову** (`nameUk`, `nameEn`, `nameRu`) прямо в моделі:

- Мов рівно три, назавжди (не розширюваний список) — реляційна i18n-таблиця виправдана, коли мов може стати більше або їх багато; тут це зайва складність.
- Простіші запити (без join-ів і угруповань) і простіша адмін-форма («вкладки UK/EN/RU в одній картці» з ТЗ мапляться прямо на три текстові поля).
- Хелпер `resolveLocale(entity, field, locale)` реалізує правило «якщо переклад не заповнений — показуємо українську версію» (розділ «Мультимовність» ТЗ) в одному місці.

### 3.2 Схема

```prisma
// ── Користувачі, ролі, авторизація ──────────────────────────────

enum UserRole {
  PURCHASER      // Ресурс 1 — покупець магазину
  PARENT         // Ресурс 2 — кабінет на сайті ТМ Єнот ЕМО
  PSYCHOLOGIST   // Ресурс 3 — платна підписка для фахівців
}

model User {
  id            String       @id @default(cuid())
  email         String       @unique
  passwordHash  String?      // null, доки покупець не встановив пароль
  isAdmin       Boolean      @default(false) // єдиний адмін — Вікторія
  roles         UserRoleAssignment[]
  orders        Order[]
  accounts      Account[]    // Auth.js
  sessions      Session[]    // Auth.js
  createdAt     DateTime     @default(now())
}

model UserRoleAssignment {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  role      UserRole
  createdAt DateTime @default(now())

  @@unique([userId, role])
}

// Auth.js стандартні моделі (database session strategy)
model Account {
  id                String  @id @default(cuid())
  userId            String
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expires      DateTime
}

// ── Магазин ──────────────────────────────────────────────────────

model Category {
  id        String    @id @default(cuid())
  nameUk    String
  nameEn    String?
  nameRu    String?
  slug      String    @unique
  products  Product[]
  createdAt DateTime  @default(now())
}

model Product {
  id              String     @id @default(cuid())
  slug            String     @unique
  nameUk          String
  nameEn          String?
  nameRu          String?
  categoryId      String
  category        Category   @relation(fields: [categoryId], references: [id])
  mainPhoto       String
  gallery         String[]   @default([])
  price           Decimal    @db.Decimal(10, 2)
  productTypeUk   String     // коротка підпис під характеристикою, напр. "пластикові картки"
  productTypeEn   String?
  productTypeRu   String?
  specsUk         String     // короткий опис складу/комплектації
  specsEn         String?
  specsRu         String?
  descriptionUk   String     @db.Text
  descriptionEn   String?    @db.Text
  descriptionRu   String?    @db.Text
  showOnHome      Boolean    @default(false)
  orderItems      OrderItem[]
  createdAt       DateTime   @default(now())
}

// ── Портфоліо ────────────────────────────────────────────────────

model PortfolioWork {
  id            String   @id @default(cuid())
  slug          String   @unique
  titleUk       String
  titleEn       String?
  titleRu       String?
  excerptUk     String   // короткий опис: картка списку + лід-абзац + сайдбар "Інші роботи"
  excerptEn     String?
  excerptRu     String?
  descriptionUk String   @db.Text
  descriptionEn String?  @db.Text
  descriptionRu String?  @db.Text
  mainPhoto     String
  gallery       String[] @default([])
  createdAt     DateTime @default(now()) // порядок показу = порядок додавання
}

// ── Новини ───────────────────────────────────────────────────────

enum NewsCategory {
  ANNOUNCEMENT      // "Анонс"
  NEWS              // "Новина"
  FOR_PSYCHOLOGISTS // "Для психологів"
}

model NewsPost {
  id          String       @id @default(cuid())
  slug        String       @unique
  titleUk     String
  titleEn     String?
  titleRu     String?
  excerptUk   String
  excerptEn   String?
  excerptRu   String?
  textUk      String       @db.Text
  textEn      String?      @db.Text
  textRu      String?      @db.Text
  photo       String       // за рішенням, прийнятим під час розробки, — обов'язкове, як і скрізь
  category    NewsCategory
  date        DateTime
  createdAt   DateTime     @default(now())
}

// ── Відгуки ──────────────────────────────────────────────────────

model Testimonial {
  id                 String   @id @default(cuid())
  author             String   // ім'я, не перекладається
  authorDescriptionUk String
  authorDescriptionEn String?
  authorDescriptionRu String?
  textUk             String   @db.Text
  textEn             String?  @db.Text
  textRu             String?  @db.Text
  showOnHome         Boolean  @default(false)
  createdAt          DateTime @default(now())
}

// ── Дипломи (галерея "Моя кваліфікація") ────────────────────────

model Diploma {
  id         String   @id @default(cuid())
  image      String
  captionUk  String?
  captionEn  String?
  captionRu  String?
  createdAt  DateTime @default(now()) // порядок показу = порядок додавання
}

// ── Заявки (без адмін-списку за ТЗ — див. розділ 5.6) ───────────

model ConsultationRequest {
  id        String   @id @default(cuid())
  name      String
  phone     String
  email     String
  comment   String?  @db.Text
  createdAt DateTime @default(now())
}

model FaqQuestion {
  id        String   @id @default(cuid())
  name      String
  email     String
  question  String   @db.Text
  createdAt DateTime @default(now())
}

// ── Замовлення ───────────────────────────────────────────────────

enum OrderStatus {
  PENDING_PAYMENT
  PAID
  SHIPPED     // Вікторія позначає вручну після створення ТТН у кабінеті НП
  CANCELLED
}

model Order {
  id                    String      @id @default(cuid())
  orderNumber           String      @unique // людський номер, показується клієнту
  userId                String
  user                  User        @relation(fields: [userId], references: [id])
  status                OrderStatus @default(PENDING_PAYMENT)
  items                 OrderItem[]
  subtotal              Decimal     @db.Decimal(10, 2) // тільки товари; доставка НЕ входить
  currency              String      @default("UAH")

  recipientName         String
  recipientPhone        String
  recipientEmail        String
  novaPoshtaCityRef     String
  novaPoshtaCityName    String
  novaPoshtaWarehouseRef  String
  novaPoshtaWarehouseName String
  comment               String?     @db.Text

  wayforpayOrderReference String?   @unique
  wayforpayStatus         String?
  paidAt                  DateTime?

  createdAt             DateTime    @default(now())
}

model OrderItem {
  id            String   @id @default(cuid())
  orderId       String
  order         Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId     String?
  product       Product? @relation(fields: [productId], references: [id], onDelete: SetNull)
  // знімок на момент покупки — щоб зміна товару в адмінці не спотворювала історію замовлень
  nameUkSnapshot String
  priceSnapshot  Decimal @db.Decimal(10, 2)
  quantity       Int
}
```

Модель `Order.subtotal` = сума товарів; доставка оплачується окремо на відділенні НП, у передоплату через WayForPay не входить **[Погоджено]**.

Юридичні сторінки (оферта/конфіденційність/повернення/оплата й доставка) **не в БД** — за рішенням, вони редагуються розробником, як «Мої послуги». Зберігаються як i18n MDX/контент-файли в `src/content/legal/`, рендеряться одним шаблоном `app/[locale]/legal/[slug]/page.tsx` **[Погоджено]**.

## 4. Маршрути (публічна частина)

| Маршрут (uk без префіксу, en/ru — `/en/…`, `/ru/…`) | Сторінка |
|---|---|
| `/` | Головна (усі блоки з розділу ТЗ) |
| `/roboty` | Список "Мої роботи" |
| `/roboty/[slug]` | Картка роботи |
| `/novyny` | Список "Новини та анонси" (фільтр за категорією) |
| `/novyny/[slug]` | Картка новини |
| `/shop` | Каталог (фільтр за категорією) |
| `/shop/[slug]` | Картка товару |
| `/cart` | Кошик |
| `/checkout` | Оформлення замовлення |
| `/checkout/success` | Підтвердження після оплати |
| `/legal/[slug]` | Юридичний шаблон (slug: `umovy-vykorystannia`, `pryvatnist`, `povernennia`, `dostavka`) |

URL-слаги — латиницею й однакові в усіх трьох мовних версіях (`/shop`, не перекладені шляхи типу `/en/store`) **[Пропозиція]**: next-intl вміє й перекладені шляхи (`pathnames`), але це додає складність конфігурації заради SEO-виграшу, який для сайту-візитки другорядний; уніфіковані шляхи простіші в підтримці й достатні.

Юридичних документів — чотири: «Умови використання» (єдиний документ, що покриває й публічну оферту — окремого документа з такою назвою не робимо, **[Погоджено]**), «Політика конфіденційності», «Умови повернення», «Оплата і доставка». Політика cookie в перший реліз не входить (**[Погоджено]** — повернемось до питання, якщо з'явиться аналітика/реклама, що цього вимагає).

Навігація (6 якорів): Про мене / Мої послуги / Авторська методика / Магазин / Новини / **FAQ** — веде скролом до секцій на `/`, окрім Магазин/Новини, які на внутрішніх сторінках ведуть на `/shop` і `/novyny` відповідно. FAQ додано 6-м пунктом за явним рішенням (**[Погоджено]**, розділ достатньо важливий для прямого доступу з шапки, а не лише через прокрутку) — коригує попередній варіант, де я пропонував триматися лише 5 пунктів з тексту ТЗ.

## 5. Функціональні модулі

### 5.1 Мультимовність інтерфейсу

next-intl словники (`src/lib/i18n/messages/{uk,en,ru}.json`) містять усі статичні тексти: лейбли кнопок, назви категорій новин (Анонс/Новина/Для психологів — фіксовані значення enum, НЕ поля в БД), розділ «Мої послуги» (статичний контент за рішенням ТЗ), FAQ-заголовки інтерфейсу. Контент FAQ (питання/відповіді) — **окрема БД-модель, керована через адмінку** (за погодженням) — додається до схеми:

```prisma
model FaqEntry {
  id          String   @id @default(cuid())
  questionUk  String
  questionEn  String?
  questionRu  String?
  answerUk    String   @db.Text
  answerEn    String?  @db.Text
  answerRu    String?  @db.Text
  createdAt   DateTime @default(now())
}
```
*(додати до розділу 3.2 і до адмінки, розділ 5.5)*

Для полів з БД — хелпер `t(entity, field, locale)`, що повертає `entity[field + capitalize(locale)] ?? entity[field + 'Uk']`.

### 5.2 Мова + кошик + хедер на кожній сторінці

Іконка кошика в хедері — на всіх сторінках без винятку (за ТЗ). Лічильник — з БД-кошика (не localStorage, як у макеті-заглушці), прив'язаного до сесії/користувача, щоб кошик не губився між пристроями після логіну. Гостьовий кошик (до першої покупки) — okay зберігати в cookie/localStorage до оформлення замовлення, коли створюється акаунт.

### 5.3 Автентифікація й наскрізний вхід між ресурсами

Auth.js, стратегія сесій — **JWT** (виправлено під час реалізації; спершу планувалися database sessions, але Auth.js жорстко забороняє поєднувати Credentials-провайдер із database-стратегією — обліковка/пароль без цього не працюють). Кука підписана спільним `AUTH_SECRET` і конфігурується з `domain: '.lemeshko.org'` у продакшені. Це навіть краще для трьох окремих застосунків (Ресурси 1–3 — окремі Next.js-проєкти з, можливо, окремими БД): JWT перевіряється локально по секрету, без потреби ділити таблицю сесій між застосунками — той самий наскрізний вхід, який описує ТЗ, але без міжбазової залежності. `Session`/`Account`/`VerificationToken` у схемі лишаються (Prisma-адаптер Auth.js їх використовує для користувачів/майбутніх OAuth-провайдерів), просто не для зберігання активної сесії.

Акаунт покупця створюється автоматично за email під час першого замовлення (без пароля); `passwordHash = null`, доступ — пізніше через "відновити/встановити пароль" (лист із токеном). Якщо email вже існує (наприклад, людина реєструється пізніше на Ресурсі 2) — до наявного `User` додається нова `UserRoleAssignment`, дублікат не створюється (пошук по `email` перед створенням).

Вхід у адмінку — окремий `isAdmin` прапорець на `User` (а не окрема роль з переліку бізнес-ролей, бо адмін лише один — Вікторія, і це не бізнес-роль клієнта). `/admin/*` захищено в `proxy.ts` (Next.js 16 перейменував конвенцію `middleware` → `proxy`) перевіркою `session.user.isAdmin`.

### 5.4 Магазин, оплата, доставка

Потік оформлення замовлення:

1. Кошик → `/checkout`: контактні дані (ім'я, телефон, email), вибір міста й відділення Нової пошти (два залежні селекти — місто через `/api/nova-poshta/cities?q=`, відділення через `/api/nova-poshta/warehouses?cityRef=`, обидва проксіюють публічне API НП), коментар до замовлення (необов'язково), чекбокс згоди з умовами оплати/доставки, поверненням і обробкою персональних даних (один чекбокс на всі три, як у макеті).
2. Сабміт → server action створює `Order` зі статусом `PENDING_PAYMENT` (створює/знаходить `User` за email), рахує `subtotal` **лише з товарів**.
3. Редирект на хостовану сторінку оплати WayForPay (сума = `subtotal`, підпис — HMAC_MD5 за їхнім алгоритмом).
4. WayForPay після оплати: (а) серверний **webhook** на `/api/payments/wayforpay/callback` — підтверджує оплату, ставить `status = PAID`, `paidAt`; (б) редирект клієнта назад на `/checkout/success` — читає статус з БД (не з query-параметрів, яким не можна довіряти) і показує номер замовлення.
5. Доставка — Вікторія бачить оплачені замовлення в адмінці, вручну створює ТТН у своєму кабінеті Нової пошти, після чого вручну позначає замовлення як `SHIPPED` в адмінці (проста кнопка-перемикач статусу).

Доставка оплачується окремо при отриманні у відділенні — сайт її не рахує й не показує сумою (лише текст-застереження "за тарифами Нової пошти"), за погодженням.

### 5.5 Адмін-панель

Інтерфейс — виключно українською, без перемикача (за ТЗ). Розділи:

1. **Категорії** — список, створення/редагування (назва uk/en/ru).
2. **Товари** — список, створення/редагування: категорія (select), фото (головне + галерея, завантаження у сховище), ціна, тип товару (i18n), характеристики (i18n), опис (i18n), прапорець "Показувати на головній". Вкладки UK/EN/RU в одній формі.
3. **Замовлення** — список (номер, дата, статус, сума, клієнт), картка замовлення (товари, контакти, дані доставки), кнопка зміни статусу (наприклад позначити "Відправлено").
4. **Роботи** — список (порядок = порядок додавання), створення/редагування: назва (i18n), короткий опис/excerpt (i18n), опис (i18n), головне фото, галерея.
5. **Новини** — список з фільтром за категорією, створення/редагування: заголовок (i18n), короткий опис/excerpt (i18n), текст (i18n), фото (обов'язкове), дата, категорія (select із фіксованих значень).
6. **Відгуки** — список, створення/редагування: автор (не перекладається), опис автора (i18n), текст (i18n), прапорець "Показувати на головній".
7. **Дипломи** — список (порядок додавання), створення/редагування: фото, підпис (i18n, необов'язково) — за погодженням, керується через адмінку.
8. **FAQ** — список, створення/редагування: питання (i18n), відповідь (i18n) — за погодженням, керується через адмінку.

Розділ "Мої послуги" — **не входить** в адмінку (статичний контент, редагується розробником), за ТЗ.
Юридичні сторінки — **не входять** в адмінку (за погодженням), редагуються розробником.

### 5.6 Заявки на консультацію та питання з FAQ [Пропозиція]

ТЗ не згадує ці сутності в переліку функціоналу адмінки — лише каже "обробка вручну Вікторією". Пропоную: обидві форми зберігають запис у БД (`ConsultationRequest`, `FaqQuestion` — для збереження історії/бекапу) **і** одразу надсилають email-сповіщення на пошту Вікторії з деталями заявки. Окремого адмін-розділу для перегляду цих заявок не робимо (поза явним обсягом ТЗ) — але оскільки таблиці вже є, додати простий read-only список пізніше буде дешево, якщо знадобиться.

## 6. Дизайн-система → Tailwind

Токени з `VL Design System`:

- Кольори: `navy #1E2A5A`, `navy-soft #4A5480`, `coral #F2662F`, `magenta #C9307C`, `violet #7A3AA0`, `blue #2B6BB8`, `indigo #5252AC` (колір усіх primary-кнопок), `indigo-hover #6262BE`, фони секцій `white #FFFDFC` / `powder-pink #FBEFEC` / `powder-beige #FAF4EA`.
- Шрифти: Nunito 600/700/800 (заголовки, кнопки), Mulish 400/600/700 (текст).
- Радіуси: 14px картки/фото, 18px великі блоки, 12px кнопки, 11px поля.
- Правило: градієнт лише на іконках/маркерах/лого/CTA-плашці, **ніколи на кнопках** (кнопки — суцільне indigo).
- Анімації появи при скролі: fade left/right/up/down/scale, stagger 120ms, `.85s cubic-bezier(.22,.7,.25,1)`.

Усе це виноситься в `design-tokens.ts` + `tailwind.config.ts` як theme-екстеншн, а не хардкодиться інлайн-стилями (на відміну від сирих макетів, які писані інлайн-styles для потреб прев'ю).

## 7. Питання з попереднього обговорення — усі закриті

- «Умови використання» / «Публічна оферта» — один документ, назва «Умови використання» (як у макеті). Окремої «Публічної оферти» немає.
- Політика cookie — не входить у перший реліз.
- Бейдж «Хіт» — помилка макета, ігнорується; на картці товару лише реальна категорія, без окремого поля.
- FAQ — 6-й пункт хедер-навігації (див. розділ 4).
- Кількість карток у прев'ю «Мої роботи» / «Новини» на головній — 3, фінально.

---
*Документ підготовлено на основі `tech_specs.md` (стан на 2026-09-22) та макетів `design/*.html`. Наступний крок після погодження — ініціалізація Next.js-проєкту та `prisma migrate` за цією схемою.*
