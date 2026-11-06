import type { DictKey } from '@/i18n';
import type { Lang } from '@/i18n/langs';

export const CATEGORIES: { name: DictKey; items: string[] }[] = [
  { name: 'cat_fruits', items: ['🍎', '🍌', '🍇', '🍐', '🍓', '🍒', '🍑', '🍉', '🍋', '🥝'] },
  { name: 'cat_animals', items: ['🐶', '🐱', '🐰', '🐻', '🐼', '🦁', '🐯', '🐮', '🐷', '🐸'] },
  { name: 'cat_transport', items: ['🚗', '🚌', '🚲', '🚂', '✈️', '🚀', '🚁', '🚜', '🚢', '🛴'] },
  { name: 'cat_vegetables', items: ['🥕', '🥒', '🍅', '🌽', '🥔', '🧅', '🥦', '🍆', '🫑', '🧄'] },
  { name: 'cat_clothes', items: ['👕', '👖', '👗', '🧦', '🧢', '👟', '🧤', '🧣', '👒', '🩳'] },
  { name: 'cat_toys', items: ['⚽', '🏀', '🧸', '🪀', '🎈', '🪁', '🎲', '🧩', '🥁', '🎺'] },
];

type Animal = { emoji: string; name: Record<Lang, string>; sound: Record<Lang, string> };

const a = (emoji: string, names: string[], sounds: string[]): Animal => {
  const langs: Lang[] = ['uz', 'ru', 'en', 'tr', 'de', 'ar'];
  return {
    emoji,
    name: Object.fromEntries(langs.map((l, i) => [l, names[i]])) as Record<Lang, string>,
    sound: Object.fromEntries(langs.map((l, i) => [l, sounds[i]])) as Record<Lang, string>,
  };
};

//                 uz            ru          en          tr          de          ar
export const ANIMALS: Animal[] = [
  a('🐶', ['Kuchukcha', 'Собака', 'Dog', 'Köpek', 'Hund', 'كلب'], ['Vov-vov!', 'Гав-гав!', 'Woof-woof!', 'Hav hav!', 'Wau wau!', 'هاو هاو!']),
  a('🐱', ['Mushuk', 'Кошка', 'Cat', 'Kedi', 'Katze', 'قطة'], ['Miyov!', 'Мяу!', 'Meow!', 'Miyav!', 'Miau!', 'مياو!']),
  a('🐮', ['Sigir', 'Корова', 'Cow', 'İnek', 'Kuh', 'بقرة'], ['Mu-u-u!', 'Му-у-у!', 'Moo!', 'Möö!', 'Muh!', 'موو!']),
  a('🐑', ["Qo'y", 'Овца', 'Sheep', 'Koyun', 'Schaf', 'خروف'], ['Ba-a-a!', 'Бе-е-е!', 'Baa!', 'Mee!', 'Mäh!', 'ماء!']),
  a('🐓', ["Xo'roz", 'Петух', 'Rooster', 'Horoz', 'Hahn', 'ديك'], ['Qu-qu-qu-quu!', 'Ку-ка-ре-ку!', 'Cock-a-doodle-doo!', 'Ü-ürü-üüü!', 'Kikeriki!', 'كوكوكو!']),
  a('🐴', ['Ot', 'Лошадь', 'Horse', 'At', 'Pferd', 'حصان'], ['I-go-go!', 'И-го-го!', 'Neigh!', 'İhihii!', 'Wieher!', 'هييييه!']),
  a('🐸', ['Qurbaqa', 'Лягушка', 'Frog', 'Kurbağa', 'Frosch', 'ضفدع'], ['Vaq-vaq!', 'Ква-ква!', 'Ribbit!', 'Vırak vırak!', 'Quak quak!', 'نق نق!']),
  a('🦁', ['Sher', 'Лев', 'Lion', 'Aslan', 'Löwe', 'أسد'], ['R-r-r-r!', 'Р-р-р-р!', 'Roar!', 'Grrr!', 'Roar!', 'غرررر!']),
  a('🐘', ['Fil', 'Слон', 'Elephant', 'Fil', 'Elefant', 'فيل'], ['Tu-tuu!', 'Ту-ту-у!', 'Toot!', 'Tuuu!', 'Törö!', 'توووو!']),
  a('🐐', ['Echki', 'Коза', 'Goat', 'Keçi', 'Ziege', 'ماعز'], ['Me-e-e!', 'Ме-е-е!', 'Maa!', 'Meee!', 'Meck meck!', 'ماااء!']),
  a('🦆', ["O'rdak", 'Утка', 'Duck', 'Ördek', 'Ente', 'بطة'], ['Ga-ga-ga!', 'Кря-кря!', 'Quack!', 'Vak vak!', 'Quak!', 'كواك!']),
  a('🐝', ['Ari', 'Пчела', 'Bee', 'Arı', 'Biene', 'نحلة'], ['Vizz-vizz!', 'Ж-ж-ж!', 'Buzz!', 'Vızzz!', 'Summ summ!', 'زززز!']),
  a('🐵', ['Maymun', 'Обезьяна', 'Monkey', 'Maymun', 'Affe', 'قرد'], ['U-u-a-a!', 'У-у-а-а!', 'Ooh-ooh-aah!', 'U-u-a-a!', 'U-u-a-a!', 'أو أو آه!']),
  a('🐻', ['Ayiq', 'Медведь', 'Bear', 'Ayı', 'Bär', 'دب'], ['Ar-r-r!', 'Р-р-р!', 'Grrr!', 'Grrr!', 'Brumm!', 'غررر!']),
  a('🐺', ["Bo'ri", 'Волк', 'Wolf', 'Kurt', 'Wolf', 'ذئب'], ['Uu-uu-uu!', 'У-у-у!', 'Awoo!', 'Auuu!', 'Auuu!', 'عووو!']),
  a('🐔', ['Tovuq', 'Курица', 'Hen', 'Tavuk', 'Huhn', 'دجاجة'], ['Ko-ko-ko!', 'Ко-ко-ко!', 'Cluck!', 'Gıt gıdak!', 'Gack gack!', 'كاك كاك!']),
];
