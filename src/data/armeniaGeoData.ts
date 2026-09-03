/**
 * High-Precision GIS Dataset for Armenia (Հայաստան)
 * Includes accurate rivers, lakes, mountain peaks/topography, highways/corridors,
 * observatories, GNSS reference stations, and administrative centers.
 */

export interface GeoPoint {
  lat: number;
  lng: number;
  alt?: number;
  nameEn: string;
  nameHy: string;
  nameRu: string;
  type: 'peak' | 'station' | 'city' | 'observatory' | 'lake_point';
  descriptionEn?: string;
  descriptionHy?: string;
  descriptionRu?: string;
}

export interface GeoPolyline {
  id: string;
  nameEn: string;
  nameHy: string;
  nameRu: string;
  type: 'river' | 'highway' | 'boundary';
  color: string;
  weight: number;
  coordinates: [number, number][]; // [lat, lng]
}

export interface GeoPolygon {
  id: string;
  nameEn: string;
  nameHy: string;
  nameRu: string;
  type: 'lake' | 'reservoir' | 'region';
  color: string;
  fillColor: string;
  fillOpacity: number;
  coordinates: [number, number][]; // [lat, lng]
}

// 1. Precise Mountain Peaks & Topographic Highpoints
export const ARMENIA_PEAKS: GeoPoint[] = [
  {
    nameEn: 'Mt. Aragats (North Peak)',
    nameHy: 'Արագած լեռ (Հյուսիսային գագաթ)',
    nameRu: 'г. Арагац (Северная вершина)',
    lat: 40.5239,
    lng: 44.1953,
    alt: 4090,
    type: 'peak',
    descriptionEn: 'Highest peak in Armenia (4,090 m)',
    descriptionHy: 'Հայաստանի ամենաբարձր գագաթը (4090 մ)',
    descriptionRu: 'Высшая точка Армении (4090 м)',
  },
  {
    nameEn: 'Mt. Aragats (West Peak)',
    nameHy: 'Արագած լեռ (Արևմտյան գագաթ)',
    nameRu: 'г. Арагац (Западная вершина)',
    lat: 40.5181,
    lng: 44.1812,
    alt: 4001,
    type: 'peak',
    descriptionEn: 'Second highest peak of Aragats massif (4,001 m)',
    descriptionHy: 'Արագածի երկրորդ գագաթը (4001 մ)',
    descriptionRu: 'Вторая вершина массива Арагац (4001 м)',
  },
  {
    nameEn: 'Mt. Aragats (South Peak)',
    nameHy: 'Արագած լեռ (Հարավային գագաթ)',
    nameRu: 'г. Арагац (Южная вершина)',
    lat: 40.5097,
    lng: 44.1942,
    alt: 3879,
    type: 'peak',
    descriptionEn: 'Southern peak of Aragats (3,879 m)',
    descriptionHy: 'Արագածի հարավային գագաթը (3879 մ)',
    descriptionRu: 'Южная вершина Арагаца (3879 м)',
  },
  {
    nameEn: 'Mt. Azhdahak (Geghama Range)',
    nameHy: 'Աժդահակ լեռ (Գեղամա լեռներ)',
    nameRu: 'г. Аждаак (Гегамский хребет)',
    lat: 40.2289,
    lng: 44.9458,
    alt: 3597,
    type: 'peak',
    descriptionEn: 'Volcanic peak with crater lake (3,597 m)',
    descriptionHy: 'Հրաբխային գագաթ խառնարանային լճով (3597 մ)',
    descriptionRu: 'Вулканическая вершина с кратерным озером (3597 м)',
  },
  {
    nameEn: 'Mt. Spitakasar',
    nameHy: 'Սպիտակասար լեռ',
    nameRu: 'г. Спитакасар',
    lat: 40.1803,
    lng: 44.9781,
    alt: 3555,
    type: 'peak',
    descriptionEn: 'Geghama ridge high point (3,555 m)',
    descriptionHy: 'Գեղամա լեռնաշղթայի գագաթ (3555 մ)',
    descriptionRu: 'Вершина Гегамского хребта (3555 м)',
  },
  {
    nameEn: 'Mt. Kaputjugh (Zangezur Range)',
    nameHy: 'Կապուտջուղ լեռ (Զանգեզուր)',
    nameRu: 'г. Капутджух (Зангезур)',
    lat: 39.1611,
    lng: 45.9986,
    alt: 3905,
    type: 'peak',
    descriptionEn: 'Highest peak of Zangezur Mountains (3,905 m)',
    descriptionHy: 'Զանգեզուրի լեռնաշղթայի ամենաբարձր գագաթը (3905 մ)',
    descriptionRu: 'Высшая точка Зангезурского хребта (3905 м)',
  },
  {
    nameEn: 'Mt. Khustup (Kapan)',
    nameHy: 'Խուստուփ լեռ (Կապան)',
    nameRu: 'г. Хуступ (Капан)',
    lat: 39.1358,
    lng: 46.3317,
    alt: 3201,
    type: 'peak',
    descriptionEn: 'Iconic rocky pyramid in Syunik (3,201 m)',
    descriptionHy: 'Սյունիքի խորհրդանիշ ժայռոտ գագաթը (3201 մ)',
    descriptionRu: 'Знаковая скалистая вершина Сюника (3201 м)',
  },
  {
    nameEn: 'Mt. Ara',
    nameHy: 'Արա լեռ',
    nameRu: 'г. Аралер',
    lat: 40.4042,
    lng: 44.4533,
    alt: 2577,
    type: 'peak',
    descriptionEn: 'Extinct volcano in Kotayk / Aragatsotn (2,577 m)',
    descriptionHy: 'Հանգած հրաբուխ Կոտայքի և Արագածոտնի միջև (2577 մ)',
    descriptionRu: 'Потухший вулкан в Котайке (2577 м)',
  },
  {
    nameEn: 'Mt. Hatis',
    nameHy: 'Հատիս լեռ',
    nameRu: 'г. Атис',
    lat: 40.3056,
    lng: 44.7278,
    alt: 2528,
    type: 'peak',
    descriptionEn: 'Kotayk volcanic cone (2,528 m)',
    descriptionHy: 'Կոտայքի հրաբխային կոն (2528 մ)',
    descriptionRu: 'Конический вулкан в Котайке (2528 м)',
  },
  {
    nameEn: 'Mt. Teghenis',
    nameHy: 'Թեղենիս լեռ (Ծաղկաձոր)',
    nameRu: 'г. Тегенис (Цахкадзор)',
    lat: 40.5375,
    lng: 44.6989,
    alt: 2851,
    type: 'peak',
    descriptionEn: 'Tsaghkadzor ski resort summit (2,851 m)',
    descriptionHy: 'Ծաղկաձորի լեռնադահուկային գագաթ (2851 մ)',
    descriptionRu: 'Вершина горнолыжного курорта Цахкадзор (2851 м)',
  },
];

// 2. GNSS Stations, Observatories & Cities
export const ARMENIA_STATIONS_AND_CITIES: GeoPoint[] = [
  {
    nameEn: 'Yerevan (ARMN GNSS Base)',
    nameHy: 'Երևան (ARMN Գլխավոր Կայան)',
    nameRu: 'Ереван (Главная GNSS Станция)',
    lat: 40.1872,
    lng: 44.5152,
    alt: 989,
    type: 'station',
    descriptionEn: 'National Reference GNSS Station & Capital City',
    descriptionHy: 'Ազգային հենակետային GNSS կայան և մայրաքաղաք',
    descriptionRu: 'Национальная опорная GNSS станция и столица',
  },
  {
    nameEn: 'Byurakan Astrophysical Observatory',
    nameHy: 'Բյուրականի Աստղադիտարան',
    nameRu: 'Бюраканская Астрофизическая Обсерватория',
    lat: 40.3303,
    lng: 44.2736,
    alt: 1490,
    type: 'observatory',
    descriptionEn: 'Historic observatory founded by Viktor Ambartsumian',
    descriptionHy: 'Վիկտոր Համբարձումյանի հիմնադրած աստղադիտարան',
    descriptionRu: 'Историческая обсерватория им. В. Амбарцумяна',
  },
  {
    nameEn: 'Garni Satellite Geodesy Station',
    nameHy: 'Գառնիի Տիեզերական Գեոդեզիայի Կայան',
    nameRu: 'Гарнийская Станция Космической Геодезии',
    lat: 40.1189,
    lng: 44.7303,
    alt: 1400,
    type: 'observatory',
    descriptionEn: 'Satellite laser ranging and geodetic monitoring center',
    descriptionHy: 'Արբանյակային լազերային հեռաչափման և գեոդեզիական կենտրոն',
    descriptionRu: 'Центр лазерной дальнометрии и спутникового мониторинга',
  },
  {
    nameEn: 'Gyumri (Shirak Geodetic Station)',
    nameHy: 'Գյումրի (Շիրակի Գեոդեզիական Կայան)',
    nameRu: 'Гюмри (Ширакская Геодезическая Станция)',
    lat: 40.7929,
    lng: 43.8465,
    alt: 1500,
    type: 'station',
    descriptionEn: 'Second largest city, Shirak plateau reference receiver',
    descriptionHy: 'Երկրորդ քաղաք, Շիրակի սարահարթի հենակետային ընդունիչ',
    descriptionRu: 'Второй по величине город, Ширакский опорный приемник',
  },
  {
    nameEn: 'Vanadzor (Lori Station)',
    nameHy: 'Վանաձոր (Լոռու Կայան)',
    nameRu: 'Ванадзор (Лорийская Станция)',
    lat: 40.8099,
    lng: 44.4937,
    alt: 1350,
    type: 'station',
    descriptionEn: 'Lori region administrative & tracking hub',
    descriptionHy: 'Լոռու մարզային և հետազոտական կենտրոն',
    descriptionRu: 'Административный и мониторинговый центр Лори',
  },
  {
    nameEn: 'Kapan',
    nameHy: 'Կապան',
    nameRu: 'Капан',
    lat: 39.2075,
    lng: 46.4058,
    alt: 705,
    type: 'city',
    descriptionEn: 'Syunik regional capital near Mt. Khustup',
    descriptionHy: 'Սյունիքի մարզկենտրոն Խուստուփ լեռան մոտ',
    descriptionRu: 'Областной центр Сюника близ г. Хуступ',
  },
  {
    nameEn: 'Goris',
    nameHy: 'Գորիս',
    nameRu: 'Горис',
    lat: 39.5108,
    lng: 46.3408,
    alt: 1385,
    type: 'city',
    descriptionEn: 'Historic city in southern Armenia',
    descriptionHy: 'Պատմական քաղաք Հարավային Հայաստանում',
    descriptionRu: 'Исторический город на юге Армении',
  },
  {
    nameEn: 'Dilijan',
    nameHy: 'Դիլիջան',
    nameRu: 'Дилижан',
    lat: 40.7417,
    lng: 44.8639,
    alt: 1500,
    type: 'city',
    descriptionEn: 'Mountain resort city in Tavush National Park',
    descriptionHy: 'Լեռնային առողջարանային քաղաք Տավուշում',
    descriptionRu: 'Курортный город в Дилижанском нацпарке',
  },
  {
    nameEn: 'Jermuk',
    nameHy: 'Ջերմուկ',
    nameRu: 'Джермук',
    lat: 39.8428,
    lng: 45.6692,
    alt: 2080,
    type: 'city',
    descriptionEn: 'Spa resort and Arpa river canyon',
    descriptionHy: 'Առողջարանային քաղաք և Արփա գետի կիրճ',
    descriptionRu: 'Курортный город и каньон реки Арпа',
  },
  {
    nameEn: 'Sevan Town',
    nameHy: 'Սևան',
    nameRu: 'Севан',
    lat: 40.5547,
    lng: 44.9547,
    alt: 1905,
    type: 'city',
    descriptionEn: 'Northwestern shore of Lake Sevan',
    descriptionHy: 'Սևանա լճի հյուսիս-արևմտյան ափ',
    descriptionRu: 'Северо-западный берег озера Севан',
  },
  {
    nameEn: 'Vagharshapat (Ejmiatsin)',
    nameHy: 'Վաղարշապատ (Էջմիածին)',
    nameRu: 'Вагаршапат (Эчмиадзин)',
    lat: 40.1667,
    lng: 44.2981,
    alt: 860,
    type: 'city',
    descriptionEn: 'Spiritual capital of Armenia',
    descriptionHy: 'Հայաստանի հոգևոր կենտրոն',
    descriptionRu: 'Духовный центр Армении',
  },
  {
    nameEn: 'Meghri',
    nameHy: 'Մեղրի',
    nameRu: 'Мегри',
    lat: 38.9028,
    lng: 46.2444,
    alt: 610,
    type: 'city',
    descriptionEn: 'Southernmost border town on Araks river',
    descriptionHy: 'Հայաստանի ամենահարավային քաղաքը Արաքսի ափին',
    descriptionRu: 'Самый южный город Армении на берегу Аракса',
  },
];

// 3. Accurate Rivers of Armenia (Հայաստանի Գետերը)
export const ARMENIA_RIVERS: GeoPolyline[] = [
  {
    id: 'river-araks',
    nameEn: 'Araks River',
    nameHy: 'Արաքս գետ',
    nameRu: 'река Аракс',
    type: 'river',
    color: '#38bdf8',
    weight: 3.5,
    coordinates: [
      [40.1105, 43.6292],
      [40.0450, 43.7650],
      [39.9950, 44.0200],
      [39.9000, 44.3800],
      [39.7500, 44.6000],
      [39.6800, 44.8200],
      [39.4500, 45.1500],
      [39.1200, 45.6000],
      [38.9100, 46.0500],
      [38.8950, 46.2400],
      [38.8800, 46.5200],
      [39.0200, 46.8500],
    ],
  },
  {
    id: 'river-hrazdan',
    nameEn: 'Hrazdan River',
    nameHy: 'Հրազդան գետ',
    nameRu: 'река Раздан',
    type: 'river',
    color: '#0ea5e9',
    weight: 2.8,
    coordinates: [
      [40.5510, 44.9750], // Outflow from Lake Sevan
      [40.5100, 44.8200], // Hrazdan town
      [40.4000, 44.6400], // Charentsavan
      [40.3200, 44.5900], // Argel
      [40.2400, 44.5200], // Yerevan North
      [40.1850, 44.4950], // Hrazdan Gorge / Yerevan Canyon
      [40.1500, 44.4750], // Yerevan South
      [40.0500, 44.4100], // Masis
      [39.9800, 44.3800], // Confluence with Araks
    ],
  },
  {
    id: 'river-debed',
    nameEn: 'Debed River',
    nameHy: 'Դեբեդ գետ',
    nameRu: 'река Дебед',
    type: 'river',
    color: '#0284c7',
    weight: 2.5,
    coordinates: [
      [40.9500, 44.5200], // Dzoraget junction
      [40.9850, 44.5800], // Tumanyan
      [41.0950, 44.6500], // Alaverdi
      [41.1600, 44.7200], // Akhtala
      [41.2200, 44.7900], // Shnogh
      [41.2800, 44.8400], // Bagratashen border
    ],
  },
  {
    id: 'river-vorotan',
    nameEn: 'Vorotan River',
    nameHy: 'Որոտան գետ',
    nameRu: 'река Воротан',
    type: 'river',
    color: '#0ea5e9',
    weight: 2.5,
    coordinates: [
      [39.7500, 45.7800], // Spandaryan source
      [39.6200, 45.9200], // Gorayk
      [39.5200, 46.0100], // Sisian
      [39.4500, 46.1800], // Vorotnavank
      [39.4000, 46.2900], // Shamb
      [39.3800, 46.3900], // Tatev Canyon
      [39.3200, 46.5500], // Vorotan Gorge
    ],
  },
  {
    id: 'river-arpa',
    nameEn: 'Arpa River',
    nameHy: 'Արփա գետ',
    nameRu: 'река Арпа',
    type: 'river',
    color: '#0284c7',
    weight: 2.4,
    coordinates: [
      [39.8450, 45.6800], // Jermuk
      [39.7800, 45.5400], // Gndevaz
      [39.7600, 45.4200], // Malishka
      [39.7500, 45.3300], // Yeghegnadzor
      [39.7400, 45.1800], // Areni
      [39.6800, 45.0500], // Border to Nakhchivan
    ],
  },
  {
    id: 'river-kasagh',
    nameEn: 'Kasagh River',
    nameHy: 'Քասաղ գետ',
    nameRu: 'река Касах',
    type: 'river',
    color: '#38bdf8',
    weight: 2.2,
    coordinates: [
      [40.6100, 44.3300], // Aragats slope
      [40.5900, 44.3700], // Aparan
      [40.5000, 44.4300], // Aparan Reservoir
      [40.3800, 44.4000], // Karbi
      [40.3000, 44.3650], // Ashtarak Canyon
      [40.2600, 44.3200], // Oshakan
      [40.1600, 44.2800], // Confluence with Sevjur
    ],
  },
  {
    id: 'river-aghstev',
    nameEn: 'Aghstev River',
    nameHy: 'Աղստև գետ',
    nameRu: 'река Агстев',
    type: 'river',
    color: '#0ea5e9',
    weight: 2.2,
    coordinates: [
      [40.6600, 44.7500], // Pambak slopes
      [40.7400, 44.8600], // Dilijan
      [40.8100, 45.0200], // Teghut
      [40.8750, 45.1400], // Ijevan
      [40.9800, 45.2200], // Azatamut
      [41.0800, 45.3200], // Border
    ],
  },
];

// 4. Accurate Lakes & Reservoirs of Armenia (Սևանա լիճ, Արփի, Քարի լիճ)
export const ARMENIA_LAKES: GeoPolygon[] = [
  {
    id: 'lake-sevan',
    nameEn: 'Lake Sevan (Major & Minor Sevan)',
    nameHy: 'Սևանա լիճ (Մեծ և Փոքր Սևան)',
    nameRu: 'Озеро Севан (Большой и Малый Севан)',
    type: 'lake',
    color: '#0284c7',
    fillColor: '#0369a1',
    fillOpacity: 0.65,
    coordinates: [
      [40.5850, 44.9600], // NW peninsula
      [40.6000, 45.0800], // Norashen
      [40.5600, 45.2400], // Shorzha
      [40.4800, 45.4200], // Artanish
      [40.3800, 45.5600], // Vardenis NE
      [40.2400, 45.6800], // Karchaghbyur
      [40.1600, 45.7200], // Vardenis shore
      [40.1200, 45.5800], // Tsovinar
      [40.1400, 45.3800], // Martuni
      [40.2200, 45.2200], // Yeranos
      [40.3400, 45.1200], // Gavar
      [40.4400, 45.0200], // Hayravank
      [40.5400, 44.9700], // Sevan town shore
      [40.5850, 44.9600], // Close loop
    ],
  },
  {
    id: 'lake-arpi',
    nameEn: 'Lake Arpi',
    nameHy: 'Արփի լիճ',
    nameRu: 'Озеро Арпи',
    type: 'lake',
    color: '#0284c7',
    fillColor: '#0ea5e9',
    fillOpacity: 0.6,
    coordinates: [
      [41.0900, 43.6000],
      [41.1100, 43.6400],
      [41.0950, 43.6800],
      [41.0600, 43.6700],
      [41.0400, 43.6300],
      [41.0600, 43.5900],
      [41.0900, 43.6000],
    ],
  },
  {
    id: 'lake-kari',
    nameEn: 'Lake Kari (Mt. Aragats)',
    nameHy: 'Քարի լիճ (Արագած)',
    nameRu: 'Озеро Кари (Арагац)',
    type: 'lake',
    color: '#38bdf8',
    fillColor: '#38bdf8',
    fillOpacity: 0.8,
    coordinates: [
      [40.4725, 44.1830],
      [40.4745, 44.1865],
      [40.4720, 44.1890],
      [40.4700, 44.1850],
      [40.4725, 44.1830],
    ],
  },
  {
    id: 'reservoir-spandaryan',
    nameEn: 'Spandaryan Reservoir',
    nameHy: 'Սպանդարյանի ջրամբար',
    nameRu: 'Спандарянское водохранилище',
    type: 'reservoir',
    color: '#0284c7',
    fillColor: '#0284c7',
    fillOpacity: 0.6,
    coordinates: [
      [39.6900, 45.8300],
      [39.7100, 45.8700],
      [39.6900, 45.9200],
      [39.6600, 45.8900],
      [39.6700, 45.8400],
      [39.6900, 45.8300],
    ],
  },
  {
    id: 'reservoir-azat',
    nameEn: 'Azat Reservoir',
    nameHy: 'Ազատի ջրամբար',
    nameRu: 'Азатское водохранилище',
    type: 'reservoir',
    color: '#0284c7',
    fillColor: '#0284c7',
    fillOpacity: 0.6,
    coordinates: [
      [40.0700, 44.6000],
      [40.0850, 44.6200],
      [40.0750, 44.6400],
      [40.0550, 44.6200],
      [40.0700, 44.6000],
    ],
  },
];

// 5. Accurate Strategic Highways of Armenia (M1 to M6, M10, Yerevan Expressways)
export const ARMENIA_HIGHWAYS: GeoPolyline[] = [
  {
    id: 'highway-m1',
    nameEn: 'M1 Highway (Yerevan - Gyumri - Bavra / Georgia)',
    nameHy: 'Մ1 Մայրուղի (Երևան - Գյումրի - Բավրա / Վրաստան)',
    nameRu: 'Трасса М1 (Ереван - Гюмри - Бавра)',
    type: 'highway',
    color: '#f59e0b',
    weight: 3.2,
    coordinates: [
      [40.1872, 44.5152], // Yerevan
      [40.2200, 44.4200], // Proshyan
      [40.2980, 44.3620], // Ashtarak
      [40.4200, 44.1800], // Ujan
      [40.4850, 44.0200], // Talin
      [40.6200, 43.8900], // Maralik
      [40.7929, 43.8465], // Gyumri
      [40.9200, 43.8300], // Ashotsk
      [41.1300, 43.8000], // Bavra Border
    ],
  },
  {
    id: 'highway-m2',
    nameEn: 'M2 Highway / North-South Corridor (Yerevan - Goris - Kapan - Meghri / Iran)',
    nameHy: 'Մ2 Մայրուղի / Հյուսիս-Հարավ (Երևան - Գորիս - Կապան - Մեղրի / Իրան)',
    nameRu: 'Трасса М2 / Север-Юг (Ереван - Горис - Капан - Мегри)',
    type: 'highway',
    color: '#ef4444',
    weight: 3.5,
    coordinates: [
      [40.1872, 44.5152], // Yerevan
      [40.0500, 44.4500], // Masis
      [39.9550, 44.5450], // Artashat
      [39.8300, 44.7000], // Ararat
      [39.7800, 44.9500], // Tigranashen pass
      [39.7400, 45.1800], // Areni
      [39.7500, 45.3300], // Yeghegnadzor
      [39.6900, 45.4600], // Vayk
      [39.6200, 45.8500], // Vorotan Pass (2,344m)
      [39.5200, 46.0100], // Sisian
      [39.5108, 46.3408], // Goris
      [39.3800, 46.4000], // Shurnukh / Tatev turn
      [39.2075, 46.4058], // Kapan
      [39.1500, 46.3200], // Kajaran
      [39.0500, 46.2000], // Meghri Pass (2,535m)
      [38.9028, 46.2444], // Meghri / Nordooz Iran Border
    ],
  },
  {
    id: 'highway-m4',
    nameEn: 'M4 Highway (Yerevan - Sevan - Dilijan - Ijevan)',
    nameHy: 'Մ4 Մայրուղի (Երևան - Սևան - Դիլիջան - Իջևան)',
    nameRu: 'Трасса М4 (Ереван - Севан - Дилижан - Иджеван)',
    type: 'highway',
    color: '#3b82f6',
    weight: 3.2,
    coordinates: [
      [40.1872, 44.5152], // Yerevan
      [40.2750, 44.6250], // Abovyan
      [40.4000, 44.7500], // Charentsavan bypass
      [40.5100, 44.8200], // Hrazdan
      [40.5547, 44.9547], // Sevan
      [40.6400, 44.9100], // Sevan Pass Tunnel
      [40.7417, 44.8639], // Dilijan
      [40.8750, 45.1400], // Ijevan
    ],
  },
  {
    id: 'highway-m3',
    nameEn: 'M3 Highway (Margara - Ashtarak - Spitak - Vanadzor - Gogavan)',
    nameHy: 'Մ3 Մայրուղի (Մարգարա - Աշտարակ - Սպիտակ - Վանաձոր)',
    nameRu: 'Трасса М3 (Маргара - Аштарак - Спитак - Ванадзор)',
    type: 'highway',
    color: '#10b981',
    weight: 2.8,
    coordinates: [
      [40.0200, 44.1800], // Margara
      [40.1667, 44.2981], // Vagharshapat
      [40.2980, 44.3620], // Ashtarak
      [40.5900, 44.3700], // Aparan
      [40.8300, 44.2700], // Spitak Pass (2,378m)
      [40.8300, 44.2600], // Spitak
      [40.8099, 44.4937], // Vanadzor
      [41.1000, 44.2800], // Stepanavan
      [41.2500, 44.3200], // Gogavan Border
    ],
  },
  {
    id: 'highway-m5',
    nameEn: 'M5 Highway (Yerevan - Ejmiatsin - Armavir)',
    nameHy: 'Մ5 Մայրուղի (Երևան - Էջմիածին - Արմավիր)',
    nameRu: 'Трасса М5 (Ереван - Эчмиадзин - Армавир)',
    type: 'highway',
    color: '#8b5cf6',
    weight: 2.8,
    coordinates: [
      [40.1872, 44.5152], // Yerevan
      [40.1667, 44.2981], // Vagharshapat
      [40.1500, 44.0400], // Armavir
      [40.1200, 43.8500], // Bagaran / Border
    ],
  },
  {
    id: 'highway-m6',
    nameEn: 'M6 Highway (Vanadzor - Alaverdi - Bagratashen / Georgia)',
    nameHy: 'Մ6 Մայրուղի (Վանաձոր - Ալավերդի - Բագրատաշեն)',
    nameRu: 'Трасса М6 (Ванадзор - Алаверди - Баграташен)',
    type: 'highway',
    color: '#06b6d4',
    weight: 2.8,
    coordinates: [
      [40.8099, 44.4937], // Vanadzor
      [40.9500, 44.5200], // Dzoraget
      [41.0950, 44.6500], // Alaverdi
      [41.1600, 44.7200], // Akhtala
      [41.2800, 44.8400], // Bagratashen Border
    ],
  },
  {
    id: 'yerevan-ring',
    nameEn: 'Yerevan Express Ring Highway',
    nameHy: 'Երևանի Օղակաձև Մայրուղի / Սարալանջ',
    nameRu: 'Ереванская Кольцевая Автомагистраль',
    type: 'highway',
    color: '#38bdf8',
    weight: 3.0,
    coordinates: [
      [40.1980, 44.5100], // Saralanj
      [40.1872, 44.5152], // Center
      [40.1680, 44.5120], // Tigran Mets
      [40.1550, 44.4950], // Arshakunyats
      [40.1650, 44.4750], // Isakov Ave
      [40.1880, 44.4820], // Kievian / Hrazdan Canyon
      [40.2050, 44.4950], // Barekamutyun / Komitas
      [40.2080, 44.5250], // Monument / Azatutyan
      [40.1980, 44.5100], // Loop
    ],
  },
];
