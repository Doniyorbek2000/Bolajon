import type { Lang } from '@/i18n/langs';
import type { DictKey } from '@/i18n';
import type { TintName } from '@/theme';

/** Bitta so'z: rasm (emoji) va 6 tildagi tarjimasi. O'zbekcha amaldagi yozuvda yoziladi. */
export type Word = { id: string; e: string } & Record<Lang, string>;
export type Topic = { id: string; title: DictKey; emoji: string; tint: TintName; words: Word[] };

const w = (id: string, e: string, uz: string, ru: string, en: string, tr: string, de: string, ar: string): Word => ({
  id,
  e,
  uz,
  ru,
  en,
  tr,
  de,
  ar,
});

export const TOPICS: Topic[] = [
  {
    id: 'animals',
    title: 't_animals',
    emoji: '🐾',
    tint: 'orange',
    words: [
      w('cat', '🐱', 'mushuk', 'кошка', 'cat', 'kedi', 'die Katze', 'قطة'),
      w('dog', '🐶', 'it', 'собака', 'dog', 'köpek', 'der Hund', 'كلب'),
      w('rabbit', '🐰', 'quyon', 'кролик', 'rabbit', 'tavşan', 'der Hase', 'أرنب'),
      w('cow', '🐮', 'sigir', 'корова', 'cow', 'inek', 'die Kuh', 'بقرة'),
      w('horse', '🐴', 'ot', 'лошадь', 'horse', 'at', 'das Pferd', 'حصان'),
      w('sheep', '🐑', "qo'y", 'овца', 'sheep', 'koyun', 'das Schaf', 'خروف'),
      w('lion', '🦁', 'sher', 'лев', 'lion', 'aslan', 'der Löwe', 'أسد'),
      w('elephant', '🐘', 'fil', 'слон', 'elephant', 'fil', 'der Elefant', 'فيل'),
      w('fish', '🐟', 'baliq', 'рыба', 'fish', 'balık', 'der Fisch', 'سمكة'),
      w('bird', '🐦', 'qush', 'птица', 'bird', 'kuş', 'der Vogel', 'طائر'),
    ],
  },
  {
    id: 'fruits',
    title: 't_fruits',
    emoji: '🍎',
    tint: 'red',
    words: [
      w('apple', '🍎', 'olma', 'яблоко', 'apple', 'elma', 'der Apfel', 'تفاحة'),
      w('banana', '🍌', 'banan', 'банан', 'banana', 'muz', 'die Banane', 'موزة'),
      w('grapes', '🍇', 'uzum', 'виноград', 'grapes', 'üzüm', 'die Trauben', 'عنب'),
      w('pear', '🍐', 'nok', 'груша', 'pear', 'armut', 'die Birne', 'كمثرى'),
      w('strawberry', '🍓', 'qulupnay', 'клубника', 'strawberry', 'çilek', 'die Erdbeere', 'فراولة'),
      w('watermelon', '🍉', 'tarvuz', 'арбуз', 'watermelon', 'karpuz', 'die Wassermelone', 'بطيخ'),
      w('cherry', '🍒', 'gilos', 'черешня', 'cherry', 'kiraz', 'die Kirsche', 'كرز'),
      w('lemon', '🍋', 'limon', 'лимон', 'lemon', 'limon', 'die Zitrone', 'ليمون'),
      w('peach', '🍑', 'shaftoli', 'персик', 'peach', 'şeftali', 'der Pfirsich', 'خوخ'),
    ],
  },
  {
    id: 'colors',
    title: 't_colors',
    emoji: '🎨',
    tint: 'purple',
    words: [
      w('red', '🔴', 'qizil', 'красный', 'red', 'kırmızı', 'rot', 'أحمر'),
      w('blue', '🔵', "ko'k", 'синий', 'blue', 'mavi', 'blau', 'أزرق'),
      w('green', '🟢', 'yashil', 'зелёный', 'green', 'yeşil', 'grün', 'أخضر'),
      w('yellow', '🟡', 'sariq', 'жёлтый', 'yellow', 'sarı', 'gelb', 'أصفر'),
      w('orange', '🟠', "to'q sariq", 'оранжевый', 'orange', 'turuncu', 'orange', 'برتقالي'),
      w('purple', '🟣', 'binafsha', 'фиолетовый', 'purple', 'mor', 'lila', 'بنفسجي'),
      w('black', '⚫', 'qora', 'чёрный', 'black', 'siyah', 'schwarz', 'أسود'),
      w('white', '⚪', 'oq', 'белый', 'white', 'beyaz', 'weiß', 'أبيض'),
      w('brown', '🟤', 'jigarrang', 'коричневый', 'brown', 'kahverengi', 'braun', 'بني'),
    ],
  },
  {
    id: 'numbers',
    title: 't_numbers',
    emoji: '🔢',
    tint: 'blue',
    words: [
      w('1', '1️⃣', 'bir', 'один', 'one', 'bir', 'eins', 'واحد'),
      w('2', '2️⃣', 'ikki', 'два', 'two', 'iki', 'zwei', 'اثنان'),
      w('3', '3️⃣', 'uch', 'три', 'three', 'üç', 'drei', 'ثلاثة'),
      w('4', '4️⃣', "to'rt", 'четыре', 'four', 'dört', 'vier', 'أربعة'),
      w('5', '5️⃣', 'besh', 'пять', 'five', 'beş', 'fünf', 'خمسة'),
      w('6', '6️⃣', 'olti', 'шесть', 'six', 'altı', 'sechs', 'ستة'),
      w('7', '7️⃣', 'yetti', 'семь', 'seven', 'yedi', 'sieben', 'سبعة'),
      w('8', '8️⃣', 'sakkiz', 'восемь', 'eight', 'sekiz', 'acht', 'ثمانية'),
      w('9', '9️⃣', "to'qqiz", 'девять', 'nine', 'dokuz', 'neun', 'تسعة'),
      w('10', '🔟', "o'n", 'десять', 'ten', 'on', 'zehn', 'عشرة'),
    ],
  },
  {
    id: 'body',
    title: 't_body',
    emoji: '👀',
    tint: 'pink',
    words: [
      w('eye', '👁️', "ko'z", 'глаз', 'eye', 'göz', 'das Auge', 'عين'),
      w('ear', '👂', 'quloq', 'ухо', 'ear', 'kulak', 'das Ohr', 'أذن'),
      w('nose', '👃', 'burun', 'нос', 'nose', 'burun', 'die Nase', 'أنف'),
      w('mouth', '👄', "og'iz", 'рот', 'mouth', 'ağız', 'der Mund', 'فم'),
      w('hand', '✋', "qo'l", 'рука', 'hand', 'el', 'die Hand', 'يد'),
      w('foot', '🦶', 'oyoq', 'нога', 'foot', 'ayak', 'der Fuß', 'قدم'),
      w('tooth', '🦷', 'tish', 'зуб', 'tooth', 'diş', 'der Zahn', 'سن'),
    ],
  },
  {
    id: 'family',
    title: 't_family',
    emoji: '👨‍👩‍👧',
    tint: 'yellow',
    words: [
      w('mom', '👩', 'ona', 'мама', 'mom', 'anne', 'die Mama', 'أم'),
      w('dad', '👨', 'ota', 'папа', 'dad', 'baba', 'der Papa', 'أب'),
      w('grandma', '👵', 'buvi', 'бабушка', 'grandma', 'büyükanne', 'die Oma', 'جدة'),
      w('grandpa', '👴', 'bobo', 'дедушка', 'grandpa', 'dede', 'der Opa', 'جد'),
      w('baby', '👶', 'chaqaloq', 'малыш', 'baby', 'bebek', 'das Baby', 'رضيع'),
      w('boy', '👦', "o'g'il bola", 'мальчик', 'boy', 'erkek çocuk', 'der Junge', 'ولد'),
      w('girl', '👧', 'qiz bola', 'девочка', 'girl', 'kız', 'das Mädchen', 'بنت'),
    ],
  },
  {
    id: 'transport',
    title: 't_transport',
    emoji: '🚗',
    tint: 'teal',
    words: [
      w('car', '🚗', 'mashina', 'машина', 'car', 'araba', 'das Auto', 'سيارة'),
      w('bus', '🚌', 'avtobus', 'автобус', 'bus', 'otobüs', 'der Bus', 'حافلة'),
      w('train', '🚂', 'poyezd', 'поезд', 'train', 'tren', 'der Zug', 'قطار'),
      w('plane', '✈️', 'samolyot', 'самолёт', 'plane', 'uçak', 'das Flugzeug', 'طائرة'),
      w('bike', '🚲', 'velosiped', 'велосипед', 'bike', 'bisiklet', 'das Fahrrad', 'دراجة'),
      w('ship', '🚢', 'kema', 'корабль', 'ship', 'gemi', 'das Schiff', 'سفينة'),
      w('rocket', '🚀', 'raketa', 'ракета', 'rocket', 'roket', 'die Rakete', 'صاروخ'),
      w('helicopter', '🚁', 'vertolyot', 'вертолёт', 'helicopter', 'helikopter', 'der Hubschrauber', 'مروحية'),
    ],
  },
  {
    id: 'greetings',
    title: 't_greetings',
    emoji: '👋',
    tint: 'green',
    words: [
      w('hello', '👋', 'Salom', 'Привет', 'Hello', 'Merhaba', 'Hallo', 'مرحبا'),
      w('thanks', '🙏', 'Rahmat', 'Спасибо', 'Thank you', 'Teşekkürler', 'Danke', 'شكرا'),
      w('bye', '🤚', 'Xayr', 'Пока', 'Goodbye', 'Hoşça kal', 'Tschüss', 'مع السلامة'),
      w('morning', '☀️', 'Xayrli tong', 'Доброе утро', 'Good morning', 'Günaydın', 'Guten Morgen', 'صباح الخير'),
      w('night', '🌙', 'Xayrli tun', 'Спокойной ночи', 'Good night', 'İyi geceler', 'Gute Nacht', 'تصبح على خير'),
      w('yes', '✅', 'Ha', 'Да', 'Yes', 'Evet', 'Ja', 'نعم'),
      w('no', '❌', "Yo'q", 'Нет', 'No', 'Hayır', 'Nein', 'لا'),
      w('please', '🤲', 'Iltimos', 'Пожалуйста', 'Please', 'Lütfen', 'Bitte', 'من فضلك'),
    ],
  },
];

export const ALL_WORDS = TOPICS.flatMap((t) => t.words.map((x) => ({ ...x, topic: t.id })));

/** Bepul mavzular soni */
export const FREE_TOPICS = 2;
