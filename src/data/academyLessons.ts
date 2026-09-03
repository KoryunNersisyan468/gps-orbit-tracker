import { Language } from '../types';

export interface AcademyLesson {
  id: number;
  icon: string;
  category: 'basics' | 'signals' | 'geometry' | 'errors' | 'spoofing';
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  content: Record<Language, string[]>;
  formula?: string;
  interactiveType?: 'pseudorange' | 'spheres' | 'clock_bias' | 'spoofing' | 'multipath' | 'dop';
}

export const ACADEMY_LESSONS: AcademyLesson[] = [
  {
    id: 1,
    icon: 'Satellite',
    category: 'basics',
    title: {
      en: '1. What is GPS?',
      ru: '1. Что такое GPS?',
      hy: '1. Ի՞նչ է GPS-ը:',
    },
    subtitle: {
      en: 'The origins and architecture of space-based satellite navigation',
      ru: 'История создания и архитектура спутниковой навигации',
      hy: 'Տիեզերական արբանյակային նավիգացիայի ստեղծումն ու ճարտարապետությունը',
    },
    content: {
      en: [
        'The Global Positioning System (GPS), originally NAVSTAR GPS, is a satellite-based radionavigation system developed by the United States Department of Defense and operated by the U.S. Space Force.',
        'It consists of three fundamental segments: the Space Segment (a constellation of 24–32 operational satellites in Medium Earth Orbit), the Control Segment (ground tracking stations, master control station, and ground antennas), and the User Segment (civilian and military GNSS receivers).',
        'Unlike radar, which transmits a pulse and listens for its reflection, GPS satellites continuously broadcast radio signals outward. The receiver is completely passive: it never transmits anything to the satellites.',
      ],
      ru: [
        'Система глобального позиционирования (GPS), первоначально NAVSTAR GPS — это спутниковая радионавигационная система, разработанная Министерством обороны США.',
        'Она состоит из трех сегментов: Космического (группировка из 24–32 спутников на средневысотных околоземных орбитах), Сегмента управления (наземные станции слежения и антенны) и Сегмента пользователей (любые приемники).',
        'В отличие от радара, спутники GPS непрерывно излучают сигналы в открытый эфир. Приемник работает пассивно: он ничего не передает спутникам.',
      ],
      hy: [
        'Գլոբալ Դիրքորոշման Համակարգը (GPS), ի սկզբանե NAVSTAR GPS, արբանյակային ռադիոնավիգացիոն համակարգ է:',
        'Այն բաղկացած է երեք հիմնական սեգմենտներից՝ Տիեզերական (24-32 գործող արբանյակներ միջին բարձրության ուղեծրերում), Կառավարման (վերգետնյա հետևման կայաններ) և Օգտագործողների (ընդունիչներ):',
        'Ի տարբերություն ռադարի, GPS արբանյակներն անընդհատ ճառագայթում են ազդանշաններ: Ընդունիչը պասիվ է և ոչինչ չի ուղարկում տիեզերք:',
      ],
    },
  },
  {
    id: 2,
    icon: 'Globe',
    category: 'basics',
    title: {
      en: '2. GPS vs GNSS',
      ru: '2. GPS против GNSS (ГНСС)',
      hy: '2. GPS ընդդեմ GNSS-ի',
    },
    subtitle: {
      en: 'Global Navigation Satellite Systems across the globe',
      ru: 'Глобальные навигационные спутниковые системы мира',
      hy: 'Համաշխարհային նավիգացիոն արբանյակային համակարգերը',
    },
    content: {
      en: [
        'GNSS (Global Navigation Satellite System) is the overarching umbrella term for all space-based navigation constellations. GPS is simply the American constellation.',
        'Other major global constellations include: Galileo (European Union, highest civilian precision), GLONASS (Russian Federation), and BeiDou (China). Regional systems include QZSS (Japan) and NavIC (India).',
        'Modern smartphone and aerospace receivers are multi-GNSS: they track satellites from GPS, Galileo, GLONASS, and BeiDou simultaneously, dramatically increasing accuracy and reliability.',
      ],
      ru: [
        'ГНСС (Глобальная навигационная спутниковая система) — это общее название для всех спутниковых группировок. GPS — лишь американская система.',
        'К другим глобальным системам относятся: Galileo (Евросоюз, высокая точность), ГЛОНАСС (Россия) и BeiDou (Китай). Региональные системы: QZSS (Япония) и NavIC (Индия).',
        'Современные смартфоны и навигаторы являются мультисистемными (Multi-GNSS): они одновременно используют сигналы GPS, Galileo, ГЛОНАСС и BeiDou.',
      ],
      hy: [
        'GNSS-ը (Global Navigation Satellite System) ընդհանուր տերմին է տիեզերական նավիգացիոն համակարգերի համար: GPS-ը դրանցից միայն ամերիկյանն է:',
        'Մյուս գլոբալ խմբավորումներն են՝ Galileo (Եվրամիություն), GLONASS (Ռուսաստան) և BeiDou (Չինաստան): Տարածաշրջանային են՝ QZSS (Ճապոնիա) և NavIC (Հնդկաստան):',
        'Ժամանակակից ընդունիչները բազմահամակարգային են (Multi-GNSS) և միաժամանակ հետևում են բոլոր համակարգերին:',
      ],
    },
  },
  {
    id: 3,
    icon: 'Orbit',
    category: 'basics',
    title: {
      en: '3. GPS Satellite Orbits',
      ru: '3. Орбиты спутников GPS',
      hy: '3. GPS արբանյակների ուղեծրերը',
    },
    subtitle: {
      en: 'Why MEO at 20,200 km is mathematically optimal',
      ru: 'Почему средневысотная орбита (20 200 км) математически оптимальна',
      hy: 'Ինչու՞ է 20,200 կմ միջին բարձրության ուղեծիրն օպտիմալ',
    },
    content: {
      en: [
        'GPS satellites do not orbit in geostationary orbit (35,786 km), nor low Earth orbit (like Starlink at 550 km). They orbit in Medium Earth Orbit (MEO) at approximately 20,180 km altitude.',
        'At this altitude, each satellite completes one orbit every 11 hours and 58 minutes (half a sidereal day). They repeat the same ground track once every sidereal day.',
        'The constellation is distributed across 6 orbital planes inclined at 55° relative to the equator, ensuring that at least 6 to 12 satellites are visible from virtually anywhere on Earth with clear line-of-sight.',
      ],
      ru: [
        'Спутники GPS находятся не на геостационарной и не на низкой орбите, а на средней околоземной орбите (MEO) на высоте около 20 180 км.',
        'На этой высоте период обращения составляет 11 часов 58 минут (половина звездных суток). Спутники совершают ровно два витка за одни звездные сутки.',
        'Спутники распределены по 6 орбитальным плоскостям с наклонением 55° к экватору, что гарантирует одновременную видимость от 6 до 12 спутников в любой точке планеты.',
      ],
      hy: [
        'GPS արբանյակները գտնվում են միջին բարձրության ուղեծրերում (MEO)՝ մոտ 20,180 կմ բարձրության վրա:',
        'Այս բարձրության վրա պտտման պարբերությունը 11 ժամ 58 րոպե է: Մեկ աստղային օրում նրանք կատարում են երկու ամբողջական պտույտ:',
        'Արբանյակները բաշխված են 6 ուղեծրային հարթություններում 55° թեքությամբ, ապահովելով առնվազն 6-12 արբանյակի տեսանելիություն Երկրագնդի ցանկացած կետից:',
      ],
    },
  },
  {
    id: 4,
    icon: 'Clock',
    category: 'signals',
    title: {
      en: '4. Atomic Clocks in Space',
      ru: '4. Атомные часы в космосе',
      hy: '4. Ատոմային ժամացույցները տիեզերքում',
    },
    subtitle: {
      en: 'Rubidium and Cesium standards & Relativistic time dilation',
      ru: 'Рубидиевые и цезиевые стандарты и релятивистские эффекты Эйнштейна',
      hy: 'Ռուբիդիումային և ցեզիումային չափանիշներն ու հարաբերականության տեսությունը',
    },
    content: {
      en: [
        'Every GPS satellite carries multiple ultra-precise atomic clocks (Rubidium and Cesium atomic frequency standards) accurate to within nanoseconds per day.',
        'Because radio waves travel at the speed of light (~300,000 km/s), an error of just 1 microsecond (0.000001 s) in timing would cause a massive 300-meter positioning error!',
        'Special Relativity (high orbital speed) makes satellite clocks tick slower by ~7 µs/day, while General Relativity (weaker gravity) makes them tick faster by ~45 µs/day. The net result is that satellite clocks tick +38 microseconds/day faster than Earth clocks! Engineers pre-tune the satellite clock frequency before launch to compensate.',
      ],
      ru: [
        'Каждый спутник оснащен несколькими сверхточными атомными часами (рубидиевыми и цезиевыми), обеспечивающими точность в наносекунды.',
        'Радиосигнал движется со скоростью света (~300 000 км/с). Ошибка всего в 1 микросекунду (0.000001 с) приводит к погрешности координат в 300 метров!',
        'Специальная теория относительности замедляет часы спутника на 7 мкс/день, а Общая теория относительности (слабая гравитация) ускоряет их на 45 мкс/день. В итоге часы спутника спешат на +38 мкс/день! Частоту их генераторов специально смещают перед запуском.',
      ],
      hy: [
        'Յուրաքանչյուր GPS արբանյակ ունի գերճշգրիտ ատոմային ժամացույցներ (ռուբիդիումային և ցեզիումային):',
        'Ռադիոալիքները տարածվում են լույսի արագությամբ (~300,000 կմ/վ): Ընդամենը 1 միկրովայրկյանի շեղումը առաջացնում է 300 մետրի սխալ:',
        'Հարաբերականության տեսության հետևանքով արբանյակի ժամացույցներն օրական 38 միկրովայրկյանով ավելի արագ են աշխատում Երկրի նկատմամբ: Սա փոխհատուցվում է արձակումից առաջ:',
      ],
    },
  },
  {
    id: 5,
    icon: 'Radio',
    category: 'signals',
    title: {
      en: '5. Navigation Messages',
      ru: '5. Навигационные сообщения (Эфемериды и Альманах)',
      hy: '5. Նավիգացիոն հաղորդագրությունները',
    },
    subtitle: {
      en: 'How the satellite broadcasts where it is and when it transmitted',
      ru: 'Как спутник передает свое положение и точное время передачи',
      hy: 'Ինչպե՞ս է արբանյակը հաղորդում իր դիրքը և ազդանշանի պահը',
    },
    content: {
      en: [
        'Satellites modulate their microwave carrier waves with a binary Navigation Message transmitted at 50 bits per second.',
        'The Navigation Message includes: precise Ephemeris data (exact Keplerian orbital parameters valid for a few hours), Almanac data (coarse orbital info for the entire constellation), satellite clock correction parameters, and ionospheric delay model coefficients.',
        'By decoding the ephemeris, the receiver calculates the satellite’s exact 3D Cartesian coordinates (X, Y, Z) in Earth-Centered, Earth-Fixed (ECEF) space at the exact moment of signal transmission.',
      ],
      ru: [
        'Спутники модулируют несущую частоту навигационным сообщением со скоростью 50 бит в секунду.',
        'Сообщение содержит: точные эфемериды (параметры орбиты текущего спутника), альманах (грубые орбиты всей группировки), поправки к часам и параметры модели ионосферы.',
        'С помощью эфемерид приемник вычисляет точные 3D координаты спутника (X, Y, Z) в геоцентрической системе ECEF на момент отправки сигнала.',
      ],
      hy: [
        'Արբանյակները հաղորդում են նավիգացիոն հաղորդագրություն 50 բիթ/վ արագությամբ:',
        'Հաղորդագրությունը պարունակում է էֆեմերիդներ (ճշգրիտ ուղեծրային պարամետրեր), ալմանախ (ամբողջ խմբավորման ուղեծրերը) և ժամացույցի ուղղումները:',
        'Այս տվյալների հիման վրա ընդունիչը հաշվարկում է արբանյակի ճշգրիտ 3D ECEF կոորդինատները (X, Y, Z) ազդանշանը ուղարկելու պահին:',
      ],
    },
  },
  {
    id: 6,
    icon: 'Zap',
    category: 'signals',
    title: {
      en: '6. Signal Propagation',
      ru: '6. Распространение сигнала со скоростью света',
      hy: '6. Ազդանշանի տարածումը լույսի արագությամբ',
    },
    subtitle: {
      en: 'Electromagnetic wave speed in vacuum vs atmosphere',
      ru: 'Скорость электромагнитных волн в вакууме и преломление в атмосфере',
      hy: 'Էլեկտրամագնիսական ալիքների արագությունը վակուումում և մթնոլորտում',
    },
    content: {
      en: [
        'GPS signals travel across approximately 20,000 km of open space. In a vacuum, electromagnetic waves travel at exactly c = 299,792,458 m/s.',
        'Signal travel time from a GPS satellite directly overhead (at zenith) is roughly 67 milliseconds (0.067 s). For satellites near the horizon, distance reaches ~25,000 km and travel time increases to ~85 ms.',
        'As the signal enters the Earth’s upper ionosphere and lower troposphere, charged particles and water vapor slightly slow and bend the signal, causing travel time delays that must be modeled and corrected.',
      ],
      ru: [
        'Сигнал проходит расстояние около 20 000 км. В вакууме электромагнитные волны распространяются со скоростью c = 299 792 458 м/с.',
        'Время пролета сигнала от спутника в зените составляет около 67 миллисекунд (0.067 с). Для спутников у горизонта путь увеличивается до ~25 000 км, а время — до ~85 мс.',
        'При прохождении ионосферы и тропосферы плотность среды замедляет сигнал, что вносит задержку, которую приемник обязан учитывать.',
      ],
      hy: [
        'GPS ազդանշաններն անցնում են մոտ 20,000 կմ տարածություն: Վակուումում լույսի արագությունը c = 299,792,458 մ/վ է:',
        'Զենիթում գտնվող արբանյակից ազդանշանը տեղ է հասնում շուրջ 67 միլիվայրկյանում: Հորիզոնին մոտ արբանյակների դեպքում այն հասնում է մինչև 85 մվ:',
        'Մթնոլորտի իոնոսֆերայի և տրոպոսֆերայի միջով անցնելիս ազդանշանը փոքր-ինչ դանդաղում է, ինչը պահանջում է մոդելավորված ուղղումներ:',
      ],
    },
  },
  {
    id: 7,
    icon: 'Activity',
    category: 'signals',
    title: {
      en: '7. Pseudorange (d ≈ c × Δt)',
      ru: '7. Псевдодальность (d ≈ c × Δt)',
      hy: '7. Կեղծհեռավորություն (d ≈ c × Δt)',
    },
    subtitle: {
      en: 'Why measured distance is called "pseudo" range',
      ru: 'Почему измеренное расстояние называется «псевдо»-дальностью',
      hy: 'Ինչու՞ է չափված հեռավորությունը կոչվում «կեղծ»',
    },
    formula: 'ρ = c · (t_receiver - t_satellite) = r + c · δt_receiver + ε',
    interactiveType: 'pseudorange',
    content: {
      en: [
        'The receiver generates an identical replica of the pseudorandom noise (PRN) code transmitted by each satellite and slides it along the time axis until the incoming signal correlates perfectly.',
        'This time shift gives the apparent travel time: Δt = t_received - t_transmitted. Multiplying by the speed of light gives the raw distance: ρ = c × Δt.',
        'Why is it called PSEUDOrange? Because while the satellite clock is atomic, the receiver clock is a cheap quartz oscillator. It has an unknown clock bias (δt). Therefore, every measured range is systematically offset by c × δt.',
      ],
      ru: [
        'Приемник генерирует точную копию псевдослучайного кода (PRN) спутника и сдвигает её во времени до идеального совпадения с принятым сигналом.',
        'Этот сдвиг дает видимое время пролета: Δt = t_приема - t_отправки. Умножив на скорость света, получаем дистанцию: ρ = c × Δt.',
        'Почему она «ПСЕВДО»? Потому что на спутнике стоят атомные часы, а в приемнике — обычный кварцевый резонатор с неизвестной погрешностью хода (δt). Вся измеренная дальность смещена на величину c × δt.',
      ],
      hy: [
        'Ընդունիչը գեներացնում է արբանյակի PRN կոդի կրկնօրինակը և սահեցնում այն ժամանակի մեջ մինչև լրիվ համընկնումը:',
        'Այդ ժամանակային տարբերությունը տալիս է տարածման ժամանակը՝ Δt: Բազմապատկելով լույսի արագությամբ՝ ստանում ենք հեռավորությունը՝ ρ = c × Δt:',
        'Ինչու՞ «ԿԵՂԾ»: Քանի որ ընդունիչի քվարցային ժամացույցն ունի անհայտ շեղում (δt): Այդ պատճառով չափված բոլոր հեռավորությունները շեղված են c × δt չափով:',
      ],
    },
  },
  {
    id: 8,
    icon: 'Layers',
    category: 'geometry',
    title: {
      en: '8. Trilateration / Multilateration',
      ru: '8. Трилатерация и мультилатерация',
      hy: '8. Տրիլատերացիա և մուլտիլատերացիա',
    },
    subtitle: {
      en: 'Intersecting 3D distance spheres to isolate a point in space',
      ru: 'Пересечение сфер дальности для точного нахождения точки в 3D',
      hy: 'Հեռավորության ոլորտների հատումը տարածության մեջ',
    },
    interactiveType: 'spheres',
    content: {
      en: [
        'Trilateration is the geometric method of determining position based on measured distances from known reference locations.',
        '1 Satellite: A single distance measurement places the receiver somewhere on the surface of a giant sphere of radius R1 centered at the satellite.',
        '2 Satellites: Two intersecting spheres form a circle of intersection.',
        '3 Satellites: A third sphere intersects this circle at exactly two points in space. One point is located far out in deep space or inside the Earth; the other point is on Earth’s surface!',
      ],
      ru: [
        'Трилатерация — геометрический метод определения координат на основе измерения расстояний до точек с известным положением.',
        '1 спутник: одно измерение дальности помещает нас на поверхность сферы радиуса R1 с центром в спутнике.',
        '2 спутника: пересечение двух сфер образует окружность.',
        '3 спутника: третья сфера пересекает эту окружность ровно в двух точках. Одна находится глубоко в космосе, а вторая — на поверхности Земли!',
      ],
      hy: [
        'Տրիլատերացիան երկրաչափական մեթոդ է, որը որոշում է դիրքը հայտնի կետերից չափված հեռավորությունների հիման վրա:',
        '1 արբանյակ. մեզ տեղադրում է R1 շառավղով գնդոլորտի մակերևույթին:',
        '2 արբանյակ. երկու գնդոլորտների հատումը կազմում է շրջանագիծ:',
        '3 արբանյակ. երրորդ ոլորտը հատում է շրջանագիծը ճիշտ երկու կետում, որոնցից մեկը Երկրի մակերևույթին է:',
      ],
    },
  },
  {
    id: 9,
    icon: 'Sliders',
    category: 'geometry',
    title: {
      en: '9. Receiver Clock Bias (The 4th Unknown)',
      ru: '9. Смещение часов приемника (4-е неизвестное)',
      hy: '9. Ընդունիչի ժամացույցի շեղումը (4-րդ անհայտը)',
    },
    subtitle: {
      en: 'Solving for time allows $5 smartphone chips to match $100,000 atomic clocks',
      ru: 'Как расчет времени позволяет чипу за 5$ работать с точностью атомных часов',
      hy: 'Ինչպե՞ս է 5 դոլարանոց չիպը աշխատում ատոմային ճշգրտությամբ',
    },
    interactiveType: 'clock_bias',
    content: {
      en: [
        'If receivers needed internal atomic clocks, your phone would weigh 20 kg and cost $100,000! Instead, GPS solves this with pure mathematics.',
        'The receiver treats its own internal clock error (δt) as an unknown variable to be solved simultaneously alongside its physical coordinates (X, Y, Z).',
        'Because the clock bias is identical for all satellite signals received at the same microsecond, a 4th measurement creates a system of 4 equations with 4 unknowns that can be solved simultaneously.',
      ],
      ru: [
        'Если бы в смартфонах требовались атомные часы, телефон стоил бы 100 000$ и весил 20 кг. GPS решает это с помощью чистой математики.',
        'Приемник считает погрешность своего кварцевого генератора (δt) 4-й неизвестной переменной, наряду с координатами X, Y и Z.',
        'Поскольку сдвиг часов абсолютно одинаков для всех принимаемых в данный момент спутников, четвертое измерение позволяет замкнуть систему уравнений.',
      ],
      hy: [
        'Եթե հեռախոսում անհրաժեշտ լիներ ատոմային ժամացույց, այն կարժենար $100,000: GPS-ը սա լուծում է մաթեմատիկորեն:',
        'Ընդունիչը իր սեփական ժամացույցի սխալը (δt) դիտարկում է որպես 4-րդ անհայտ՝ X, Y, Z կոորդինատների հետ միասին:',
        'Քանի որ շեղումը նույնն է բոլոր ազդանշանների համար, 4-րդ չափումը հնարավորություն է տալիս լուծել 4 անհայտով համակարգը:',
      ],
    },
  },
  {
    id: 10,
    icon: 'Maximize',
    category: 'geometry',
    title: {
      en: '10. Why Four Satellites Are Required',
      ru: '10. Почему обычно необходимо минимум 4 спутника',
      hy: '10. Ինչու՞ է պահանջվում առնվազն 4 արբանյակ',
    },
    subtitle: {
      en: 'Four mathematical equations for four unknowns: X, Y, Z, and δt',
      ru: 'Четыре математических уравнения для четырех неизвестных: X, Y, Z и δt',
      hy: 'Չորս հավասարում չորս անհայտների համար՝ X, Y, Z և δt',
    },
    formula: 'ρ_i = √[(X_i - X_u)² + (Y_i - Y_u)² + (Z_i - Z_u)²] + c · δt_u  (i = 1, 2, 3, 4)',
    content: {
      en: [
        'In 3-dimensional space, determining your location requires knowing three spatial coordinates: Latitude, Longitude, Altitude (or ECEF X, Y, Z).',
        'However, because measured pseudorange contains the unknown receiver clock offset δt, we actually have 4 unknown variables: [X, Y, Z, c·δt].',
        'Basic algebra dictates that solving for 4 unknowns requires at least 4 independent equations. Thus, 4 visible satellites are required for an unconstrained 3D navigation fix.',
      ],
      ru: [
        'В трехмерном пространстве для определения точки требуются 3 координаты: широта, долгота, высота (или X, Y, Z в системе ECEF).',
        'Однако из-за погрешности часов приемника δt число неизвестных возрастает до четырех: [X, Y, Z, c·δt].',
        'Из алгебры известно: чтобы однозначно найти 4 неизвестных, требуется минимум 4 независимых уравнения. Поэтому для 3D-фиксации нужно минимум 4 спутника.',
      ],
      hy: [
        'Եռաչափ տարածության մեջ դիրքը որոշելու համար անհրաժեշտ է 3 տարածական կոորդինատ՝ X, Y, Z:',
        'Սակայն ժամացույցի անհայտ շեղման պատճառով անհայտների թիվը դառնում է չորս՝ [X, Y, Z, c·δt]:',
        '4 անհայտ գտնելու համար անհրաժեշտ է առնվազն 4 հավասարում: Ուստի պահանջվում է առնվազն 4 տեսանելի արբանյակ:',
      ],
    },
  },
  {
    id: 11,
    icon: 'Eye',
    category: 'geometry',
    title: {
      en: '11. Satellite Visibility & Horizon Mask',
      ru: '11. Видимость спутников и маска угла возвышения',
      hy: '11. Արբանյակների տեսանելիությունը և հորիզոնի դիմակը',
    },
    subtitle: {
      en: 'Why receivers reject satellites lower than 5°–15° above the horizon',
      ru: 'Зачем приемники отсекают спутники ниже 5°–15° над горизонтом',
      hy: 'Ինչու՞ են ընդունիչներն անտեսում 5°-15°-ից ցածր արբանյակները',
    },
    content: {
      en: [
        'A satellite is mathematically visible only if its elevation angle above the local horizon is greater than zero degrees.',
        'However, signals from low-elevation satellites travel through significantly more atmosphere (tropospheric path length is up to 10× longer near the horizon) and suffer severe terrain attenuation and building multipath reflections.',
        'To prevent degraded accuracy, GNSS receivers configure an Elevation Mask (typically 5°, 10°, or 15°). Any satellite below this threshold is excluded from the positioning matrix.',
      ],
      ru: [
        'Спутник геометрически виден приемнику, если его угол возвышения над местным горизонтом больше 0 градусов.',
        'Однако сигналы низких спутников проходят значительно больший путь сквозь плотные слои атмосферы (в 10 раз длиннее) и сильно отражаются от зданий.',
        'Для сохранения высокой точности приемники настраивают маску угла возвышения (обычно 5°, 10° или 15°), отсекая низколетящие спутники.',
      ],
      hy: [
        'Արբանյակը տեսանելի է, եթե նրա բարձրության անկյունը հորիզոնից բարձր է 0°-ից:',
        'Սակայն ցածր արբանյակների ազդանշանները անցնում են մթնոլորտի շատ ավելի երկար ճանապարհով և ենթարկվում շենքերից արտացոլումների:',
        'Բարձր ճշգրտություն պահպանելու համար կիրառվում է բարձրության դիմակ (սովորաբար 5°, 10° կամ 15°):',
      ],
    },
  },
  {
    id: 12,
    icon: 'Compass',
    category: 'geometry',
    title: {
      en: '12. Dilution of Precision (DOP)',
      ru: '12. Фактор снижения точности (DOP)',
      hy: '12. Ճշգրտության նվազման գործակիցը (DOP)',
    },
    subtitle: {
      en: 'How spatial geometry amplifies pseudorange measurement errors',
      ru: 'Как геометрия расположения спутников усиливает погрешность измерений',
      hy: 'Ինչպե՞ս է տարածական երկրաչափությունը մեծացնում սխալը',
    },
    formula: 'Position Error = DOP × Pseudorange Error',
    interactiveType: 'dop',
    content: {
      en: [
        'Even with perfect measurements, the geometry of visible satellites fundamentally limits positioning accuracy. This multiplier is Dilution of Precision (DOP).',
        'Good Geometry (Low DOP < 2): Satellites are widely separated across the sky—one directly overhead at zenith, and others spread symmetrically across north, south, east, and west.',
        'Poor Geometry (High DOP > 8): Satellites are clustered tightly in one quadrant of the sky (e.g., in deep urban canyons or mountain valleys). Their range spheres intersect at steep, shallow angles, blowing up the uncertainty area.',
      ],
      ru: [
        'Даже при идеальных замерах взаимное расположение спутников на небе напрямую определяет точность. Этот коэффициент называют DOP.',
        'Хорошая геометрия (DOP < 2): спутники широко разнесены по небу — один в зените, остальные равномерно распределены по сторонам света.',
        'Плохая геометрия (DOP > 8): спутники сгруппированы в одной части неба (например, в узкой городской застройке). Сферы пересекаются под острыми углами, резко увеличивая зону неопределенности.',
      ],
      hy: [
        'Նույնիսկ իդեալական չափումների դեպքում արբանյակների դիրքը որոշում է սխալի չափը: Սա կոչվում է DOP:',
        'Լավ երկրաչափություն (DOP < 2). արբանյակները լայնորեն սփռված են երկնքում՝ մեկը զենիթում, մյուսները՝ հավասարաչափ:',
        'Վատ երկրաչափություն (DOP > 8). արբանյակները խմբավորված են երկնքի մի փոքր հատվածում (օրինակ՝ նեղ փողոցներում):',
      ],
    },
  },
  {
    id: 13,
    icon: 'AlertCircle',
    category: 'errors',
    title: {
      en: '13. GPS Error Budget',
      ru: '13. Бюджет естественных погрешностей GPS',
      hy: '13. GPS բնական սխալների բյուջեն',
    },
    subtitle: {
      en: 'Every physical factor contributing to total user equivalent range error (UERE)',
      ru: 'Все физические факторы, формирующие суммарную ошибку дальности',
      hy: 'Բոլոր ֆիզիկական գործոնները, որոնք ձևավորում են ընդհանուր սխալը',
    },
    content: {
      en: [
        'Total User Equivalent Range Error (UERE) is the root-sum-square of multiple physical contributors.',
        'Key error sources: Satellite clock drift (~1.5 m), Orbit ephemeris prediction error (~1.0 m), Ionospheric delay (~5.0 m uncorrected), Tropospheric delay (~2.0 m uncorrected), Multipath reflections (~1.5 m), and Receiver noise (~0.5 m).',
        'Dual-frequency receivers (tracking L1 and L5 signals simultaneously) can eliminate 99% of ionospheric delay by exploiting frequency dispersion.',
      ],
      ru: [
        'Суммарная эквивалентная погрешность дальности (UERE) складывается из квадратов нескольких физических факторов.',
        'Основные источники: уход часов спутника (~1.5 м), погрешность эфемерид орбиты (~1.0 м), задержка в ионосфере (~5.0 м), задержка в тропосфере (~2.0 м), многолучевость (~1.5 м) и шум приемника (~0.5 м).',
        'Двухчастотные приемники (L1 + L5) устраняют до 99% ионосферной задержки благодаря дисперсии радиоволн.',
      ],
      hy: [
        'Ընդհանուր սխալը կազմված է մի շարք ֆիզիկական աղբյուրներից:',
        'Հիմնական աղբյուրներն են՝ արբանյակի ժամացույց (~1.5 մ), ուղեծրային էֆեմերիդներ (~1.0 մ), իոնոսֆերային ուշացում (~5.0 մ), տրոպոսֆերա (~2.0 մ), բազմաճառագայթություն (~1.5 մ):',
        'Երկհաճախականային ընդունիչները (L1 + L5) վերացնում են իոնոսֆերային սխալի մինչև 99%-ը:',
      ],
    },
  },
  {
    id: 14,
    icon: 'CornerUpRight',
    category: 'errors',
    title: {
      en: '14. Multipath Interference',
      ru: '14. Многолучевость (Multipath)',
      hy: '14. Բազմաճառագայթ ինտերֆերենցիա (Multipath)',
    },
    subtitle: {
      en: 'Reflections from glass buildings, water, and metal surfaces',
      ru: 'Отражения сигналов от стеклянных фасадов, воды и асфальта',
      hy: 'Ազդանշանի արտացոլումը շենքերից, ջրից և մետաղական մակերևույթներից',
    },
    interactiveType: 'multipath',
    content: {
      en: [
        'Multipath occurs when a satellite signal bounces off obstacles (such as glass skyscrapers, metal containers, or bodies of water) before reaching the receiver antenna.',
        'Because the reflected indirect signal travels a longer geometric path than the direct line-of-sight signal, it arrives with an extra time delay, corrupting correlation tracking loops.',
        'Multipath can cause 10 to 50 meters of positioning error in dense downtown city cores, creating classic "urban canyon" wandering.',
      ],
      ru: [
        'Многолучевость возникает, когда сигнал перед попаданием в антенну отражается от небоскребов, водной глади или земли.',
        'Отраженный луч проходит более длинную траекторию, чем прямой, и приходит с дополнительной задержкой, сбивая систему слежения приемника.',
        'В плотной городской застройке многолучевость может приводить к скачкам координат на 10–50 метров.',
      ],
      hy: [
        'Բազմաճառագայթությունը տեղի է ունենում, երբ ազդանշանը նախքան ալեհավաք հասնելն արտացոլվում է շենքերից, ջրից կամ գետնից:',
        'Արտացոլված ճառագայթն անցնում է ավելի երկար ճանապարհ և գալիս է լրացուցիչ ուշացումով՝ շփոթեցնելով ընդունիչին:',
        'Խիտ քաղաքային պայմաններում սա կարող է հանգեցնել 10-ից մինչև 50 մետր դիրքային շեղման:',
      ],
    },
  },
  {
    id: 15,
    icon: 'CloudRain',
    category: 'errors',
    title: {
      en: '15. Atmospheric Effects (Ionosphere & Troposphere)',
      ru: '15. Атмосферные эффекты (Ионосфера и Тропосфера)',
      hy: '15. Մթնոլորտային ազդեցություններ (Իոնոսֆերա և Տրոպոսֆերա)',
    },
    subtitle: {
      en: 'Total Electron Content (TEC) and Zenith Hydrostatic Delay',
      ru: 'Полное электронное содержание (ПЭС/TEC) и тропосферная задержка',
      hy: 'Իոնոսֆերայի էլեկտրոնային խտությունը և տրոպոսֆերային բեկումը',
    },
    content: {
      en: [
        'The Ionosphere (60 to 1,000 km altitude) is a dispersive plasma of free electrons ionized by solar ultraviolet radiation. It speeds up carrier phase but slows down code modulation by an amount inversely proportional to frequency squared (1/f²).',
        'The Troposphere (0 to 16 km altitude) consists of non-ionized neutral atmosphere. Its hydrostatic dry component (oxygen, nitrogen) and wet component (water vapor) introduce non-dispersive delays.',
        'Standard GNSS receivers use mathematical models (Klobuchar or NeQuick for ionosphere, Saastamoinen for troposphere) to predict and subtract up to 70% of these delays.',
      ],
      ru: [
        'Ионосфера (60–1000 км) содержит свободные электроны, ионизированные солнечным излучением. Она замедляет код пропорционально 1/f².',
        'Тропосфера (0–16 км) — нейтральный слой воздуха. Сухая часть (азот, кислород) и влажная (водяной пар) вносят задержку преломления.',
        'Приемники используют математические модели (Клобучара для ионосферы, Саастамойнена для тропосферы), компенсируя до 70% этих эффектов.',
      ],
      hy: [
        'Իոնոսֆերան (60–1000 կմ) պարունակում է ազատ էլեկտրոններ, որոնք դանդաղեցնում են ազդանշանը 1/f² հակադարձ համեմատականությամբ:',
        'Տրոպոսֆերան (0–16 կմ) չեզոք օդային շերտ է, որի խոնավությունն ու ճնշումը առաջացնում են լրացուցիչ բեկումային ուշացումներ:',
        'Ընդունիչներն օգտագործում են մաթեմատիկական մոդելներ (Կլոբուչար, Սաաստամոյնեն)՝ վերացնելով այս սխալանքների մինչև 70%-ը:',
      ],
    },
  },
  {
    id: 16,
    icon: 'ShieldAlert',
    category: 'spoofing',
    title: {
      en: '16. GPS Spoofing Concept',
      ru: '16. Концепция спуфинга GPS',
      hy: '16. GPS Սպուֆինգի հայեցակարգը',
    },
    subtitle: {
      en: 'How counterfeit navigation signals deceive GNSS receivers',
      ru: 'Как поддельные навигационные сигналы обманывают приемник',
      hy: 'Ինչպե՞ս են կեղծված ազդանշանները մոլորեցնում ընդունիչին',
    },
    interactiveType: 'spoofing',
    content: {
      en: [
        'GPS signals arrive at Earth’s surface with extremely faint power levels (~ -160 dBW, equivalent to the light of a 25-watt lightbulb on the Moon seen from Earth).',
        'Standard civil GPS signals (L1 C/A) are unencrypted and publicly documented. A counterfeit transmitter can synthesize identical carrier frequencies and PRN codes.',
        'By deliberately broadcasting signals with slightly modified transit times, the spoofer alters the pseudoranges calculated by the receiver, forcing its mathematical trilateration solver to converge on a false geographic position.',
      ],
      ru: [
        'Сигналы GPS достигают поверхности Земли с ничтожно малой мощностью (~ -160 дБВт, что сравнимо со светом лампочки 25 Вт на Луне).',
        'Гражданские сигналы GPS (L1 C/A) не зашифрованы. Поддельный передатчик может синтезировать аналогичные несущие частоты и PRN-коды.',
        'Излучая сигналы со специально подобранными искусственными задержками, спуфер подменяет псевдодальности, заставляя математический алгоритм трилатерации выдать ложные координаты.',
      ],
      hy: [
        'GPS ազդանշանները Երկրի մակերևույթ են հասնում չափազանց թույլ հզորությամբ (~ -160 dBW):',
        'Քաղաքացիական L1 C/A ազդանշանները կոդավորված չեն և ունեն բաց տեխնիկական փաստաթղթավորում:',
        'Արհեստականորեն փոփոխված ուշացումներով կեղծ ազդանշաններ հաղորդելով՝ սպուֆերը ստիպում է ընդունիչին հաշվարկել կեղծ կոորդինատներ:',
      ],
    },
  },
  {
    id: 17,
    icon: 'RadioTower',
    category: 'spoofing',
    title: {
      en: '17. Jamming vs Spoofing',
      ru: '17. Глушение (Jamming) против Спуфинга (Spoofing)',
      hy: '17. Խլացում (Jamming) ընդդեմ Սպուֆինգի (Spoofing)',
    },
    subtitle: {
      en: 'Denial of Service vs Deceptive Manipulation',
      ru: 'Отказ в обслуживании против скрытой дезинформации',
      hy: 'Ծառայության մերժում ընդդեմ քողարկված ապատեղեկատվության',
    },
    content: {
      en: [
        'Jamming is crude and obvious: high-power broadband RF noise drowns out the faint GPS satellite signals, causing the receiver to lose lock and report "No Fix". The user immediately knows the system is broken.',
        'Spoofing is subtle and deceptive: the counterfeit signals mimic legitimate satellites with slightly higher power, capturing the receiver tracking loops without triggering a loss of lock.',
        'The receiver believes it has a valid 3D navigation fix, but reports false coordinates, potentially leading aircraft, ships, or autonomous drones off-course.',
      ],
      ru: [
        'Глушение (Джамминг) прямолинейно: мощный радиошум забивает слабый сигнал спутников, приемник теряет сигнал и сообщает об ошибке. Пользователь сразу видит сбой.',
        'Спуфинг гораздо коварнее: передатчик имитирует настоящие спутники с чуть большей мощностью, перехватывая следящие каналы приемника.',
        'Приемник уверен, что имеет отличную 3D-фиксацию, но выдает ложные координаты, уводя судно или дрон с заданного курса.',
      ],
      hy: [
        'Խլացումը (Jamming) ակնհայտ է՝ հզոր ռադիոաղմուկը ծածկում է спутник-ների ազդանշանը, և ընդունիչը ցույց է տալիս կապի կորուստ:',
        'Սպուֆինգը շատ ավելի վտանգավոր է՝ այն նմանակում է իսկական ազդանշանները և ընդունիչի մոտ տպավորություն ստեղծում, որ կապը նորմալ է:',
        'Ընդունիչը շարունակում է աշխատել, բայց տալիս է կեղծ կոորդինատներ՝ շեղելով ինքնաթիռները կամ դրոնները:',
      ],
    },
  },
  {
    id: 18,
    icon: 'Cpu',
    category: 'spoofing',
    title: {
      en: '18. Inconsistency Detection in Receivers',
      ru: '18. Обнаружение несоответствий в приемниках',
      hy: '18. Անհամապատասխանությունների հայտնաբերումը',
    },
    subtitle: {
      en: 'How modern software identifies anomalies before trusting a fix',
      ru: 'Как программные алгоритмы выявляют аномалии до выдачи решения',
      hy: 'Ինչպե՞ս են ալգորիթմները բացահայտում կեղծիքը նախքան կոորդինատ հաստատելը',
    },
    content: {
      en: [
        'A naive receiver simply calculates position from whatever signals it tracks. A secure receiver continuously performs multi-factor plausibility checks.',
        'Kinematic Checks: Does the calculated position jump instantaneously by 50 km? Does the implied acceleration exceed physical vehicle capabilities?',
        'RF & Geometry Checks: Are all signals arriving from the same direction (a single ground antenna)? Is the received signal power abnormally high (+20 dB)? Are the Doppler frequencies consistent with orbital velocities?',
      ],
      ru: [
        'Обычный приемник вычисляет координаты по любым принятым сигналам. Защищенный приемник непрерывно проверяет их на физическую правдоподобность.',
        'Кинематика: не произошло ли мгновенного скачка координат на 50 км? Не превышает ли ускорение физические пределы объекта?',
        'РЧ-анализ: не приходят ли все сигналы с одного направления (наземной вышки)? Не завышена ли мощность (+20 дБ)? Соответствуют ли доплеровские сдвиги орбитальным скоростям?',
      ],
      hy: [
        'Պաշտպանված ընդունիչը մշտապես ստուգում է ազդանշանների ֆիզիկական իրական լինելը:',
        'Կինեմատիկ ստուգումներ՝ արդյո՞ք դիրքը վայրկյանում չի ցատկել տասնյակ կիլոմետրերով:',
        'Ռադիոհաճախականային ստուգումներ՝ արդյո՞ք բոլոր ազդանշանները չեն գալիս մեկ ուղղությունից և արդյո՞ք հզորությունը անբնականորեն բարձր չէ:',
      ],
    },
  },
  {
    id: 19,
    icon: 'SearchCheck',
    category: 'spoofing',
    title: {
      en: '19. RAIM & Integrity Monitoring',
      ru: '19. RAIM и контроль целостности измерений',
      hy: '19. RAIM և չափումների ամբողջականության մոնիտորինգ',
    },
    subtitle: {
      en: 'Receiver Autonomous Integrity Monitoring and Chi-Square residual tests',
      ru: 'Автономный контроль целостности приемником и критерий Хи-квадрат',
      hy: 'Ընդունիչի ինքնավար ամբողջականության ստուգումը (RAIM)',
    },
    formula: 'SSE = rᵀ · W · r  >  T(α, n - 4)',
    content: {
      en: [
        'RAIM (Receiver Autonomous Integrity Monitoring) is an algorithmic technique that uses redundant satellite measurements to detect and isolate faulty or manipulated signals.',
        'While 4 satellites are needed for a 3D fix, tracking 5 satellites allows fault detection: if one satellite measurement disagrees with the other four, a statistical Chi-Square test triggers an integrity alarm.',
        'Tracking 6 or more satellites allows fault exclusion (FDE): the receiver identifies exactly which satellite signal is corrupted, drops it from the matrix, and calculates an authentic fix using the remaining satellites.',
      ],
      ru: [
        'RAIM — алгоритмический метод, использующий избыточные измерения спутников для обнаружения и изоляции искаженных сигналов.',
        'Для 3D-фиксации нужно 4 спутника, но отслеживание 5 спутников позволяет обнаружить ошибку: если один замер не сходится с четырьмя другими, тест Хи-квадрат бьет тревогу.',
        'При 6 и более спутниках алгоритм FDE может точно определить скомпрометированный канал, исключить его и продолжить точную навигацию по остальным.',
      ],
      hy: [
        'RAIM-ը ալգորիթմ է, որն օգտագործում է ավելցուկային արբանյակների չափումները՝ կեղծ կամ վնասված ազդանշանները բացահայտելու համար:',
        '5 արբանյակ տեսնելիս հնարավոր է դառնում հայտնաբերել սխալը (Խի-քառակուսի թեստով):',
        '6 և ավելի արբանյակների դեպքում FDE մեխանիզմը հեռացնում է վնասված ազդանշանը և շարունակում ճշգրիտ նավիգացիան մնացածներով:',
      ],
    },
  },
  {
    id: 20,
    icon: 'Lock',
    category: 'spoofing',
    title: {
      en: '20. Modern GNSS Countermeasures (OSNMA)',
      ru: '20. Защита в современных ГНСС: Аутентификация OSNMA',
      hy: '20. Ժամանակակից պաշտպանություն. OSNMA աուտենտիֆիկացիա',
    },
    subtitle: {
      en: 'Cryptographic digital signatures transmitted directly from space',
      ru: 'Криптографические цифровые подписи, передаваемые прямо из космоса',
      hy: 'Կրիպտոգրաֆիկ թվային ստորագրություններ ուղիղ տիեզերքից',
    },
    content: {
      en: [
        'The permanent solution to civil GNSS spoofing is cryptographic authentication. Europe’s Galileo system pioneered this with OSNMA (Open Service Navigation Message Authentication).',
        'Satellites broadcast cryptographic digital signatures using asymmetric elliptic-curve keys (TESLA protocol) embedded within reserved bits of the navigation message.',
        'A receiver equipped with the public key can verify with mathematical certainty that the navigation message originated from an authentic Galileo satellite in space and has not been altered or synthesized by a spoofer.',
      ],
      ru: [
        'Фундаментальное решение проблемы спуфинга — криптографическая аутентификация. Европейская система Galileo внедрила технологию OSNMA.',
        'Спутники передают цифровые подписи с использованием асимметричных ключей (протокол TESLA) прямо в структуре навигационного кадра.',
        'Приемник с открытым ключом может со 100% уверенностью подтвердить, что сигнал пришел от настоящего спутника, а не от наземного имитатора.',
      ],
      hy: [
        'Սպուֆինգի դեմ հուսալի լուծումը թվային կրիպտոգրաֆիկ աուտենտիֆիկացիան է, ինչպես Galileo համակարգի OSNMA տեխնոլոգիան:',
        'Արբանյակները հաղորդում են թվային ստորագրություններ TESLA արձանագրությամբ:',
        'Համապատասխան բանալի ունեցող ընդունիչը կարող է 100% երաշխավորել, որ ազդանշանը ստացվել է իրական տիեզերական արբանյակից:',
      ],
    },
  },
];

