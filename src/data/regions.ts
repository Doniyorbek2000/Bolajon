/**
 * O'zbekiston Respublikasi: viloyatlar (va Toshkent shahri, Qoraqalpog'iston) hamda
 * ularning tumanlari va shaharlari. Nomlar amaldagi lotin yozuvida — ekranda tanlangan
 * yozuvga (yangi alifbo) avtomatik o'giriladi.
 * Ro'yxatni rasmiy ma'lumotlar bilan solishtirib, kerak bo'lsa yangilab turing.
 */
export type Region = { id: string; name: string; emoji: string; districts: string[] };

const R = (id: string, name: string, emoji: string, districts: string[]): Region => ({ id, name, emoji, districts });

export const REGIONS: Region[] = [
  R('toshkent-sh', 'Toshkent shahri', '🏙️', [
    'Bektemir', 'Chilonzor', 'Mirobod', "Mirzo Ulug'bek", 'Olmazor', 'Sergeli', 'Shayxontohur', 'Uchtepa', 'Yakkasaroy', 'Yangihayot', 'Yashnobod', 'Yunusobod',
  ]),
  R('toshkent-v', 'Toshkent viloyati', '⛰️', [
    'Angren shahri', 'Bekobod shahri', 'Chirchiq shahri', 'Nurafshon shahri', 'Olmaliq shahri', 'Ohangaron shahri', "Yangiyo'l shahri",
    'Bekobod', "Bo'ka", "Bo'stonliq", 'Chinoz', 'Ohangaron', "Oqqo'rg'on", "O'rtachirchiq", 'Parkent', 'Piskent', 'Qibray', 'Quyichirchiq', 'Toshkent tumani', "Yangiyo'l", 'Yuqorichirchiq', 'Zangiota',
  ]),
  R('andijon', 'Andijon viloyati', '🍇', [
    'Andijon shahri', 'Xonobod shahri',
    'Andijon', 'Asaka', 'Baliqchi', "Bo'ston", 'Buloqboshi', 'Izboskan', 'Jalaquduq', 'Marhamat', "Oltinko'l", 'Paxtaobod', "Qo'rg'ontepa", 'Shahrixon', "Ulug'nor", "Xo'jaobod",
  ]),
  R('buxoro', 'Buxoro viloyati', '🕌', [
    'Buxoro shahri', 'Kogon shahri',
    'Buxoro', "G'ijduvon", 'Jondor', 'Kogon', 'Olot', 'Peshku', "Qorako'l", 'Qorovulbozor', 'Romitan', 'Shofirkon', 'Vobkent',
  ]),
  R('fargona', "Farg'ona viloyati", '🌸', [
    "Farg'ona shahri", "Marg'ilon shahri", "Qo'qon shahri", 'Quvasoy shahri',
    "Bag'dod", 'Beshariq', 'Buvayda', "Dang'ara", "Farg'ona", 'Furqat', 'Oltiariq', "O'zbekiston", "Qo'shtepa", 'Quva', 'Rishton', "So'x", 'Toshloq', "Uchko'prik", 'Yozyovon',
  ]),
  R('jizzax', 'Jizzax viloyati', '🌾', [
    'Jizzax shahri',
    'Arnasoy', 'Baxmal', "Do'stlik", 'Forish', "G'allaorol", "Mirzacho'l", 'Paxtakor', 'Sharof Rashidov', 'Yangiobod', 'Zafarobod', 'Zarbdor', 'Zomin',
  ]),
  R('xorazm', 'Xorazm viloyati', '🏰', [
    'Urganch shahri', 'Xiva shahri',
    "Bog'ot", 'Gurlan', 'Hazorasp', "Qo'shko'pir", 'Shovot', "Tuproqqal'a", 'Urganch', 'Xiva', 'Xonqa', 'Yangiariq', 'Yangibozor',
  ]),
  R('namangan', 'Namangan viloyati', '🌺', [
    'Namangan shahri',
    'Chortoq', 'Chust', 'Davlatobod', 'Kosonsoy', 'Mingbuloq', 'Namangan', 'Norin', 'Pop', "To'raqo'rg'on", "Uchqo'rg'on", 'Uychi', "Yangiqo'rg'on",
  ]),
  R('navoiy', 'Navoiy viloyati', '💎', [
    'Navoiy shahri', 'Zarafshon shahri', "G'ozg'on shahri",
    'Karmana', 'Konimex', 'Navbahor', 'Nurota', 'Qiziltepa', 'Tomdi', 'Uchquduq', 'Xatirchi',
  ]),
  R('qashqadaryo', 'Qashqadaryo viloyati', '🐑', [
    'Qarshi shahri', 'Shahrisabz shahri',
    'Chiroqchi', 'Dehqonobod', "G'uzor", 'Kasbi', 'Kitob', "Ko'kdala", 'Koson', 'Mirishkor', 'Muborak', 'Nishon', 'Qamashi', 'Qarshi', 'Shahrisabz', "Yakkabog'",
  ]),
  R('samarqand', 'Samarqand viloyati', '🏛️', [
    'Samarqand shahri', "Kattaqo'rg'on shahri",
    "Bulung'ur", 'Ishtixon', 'Jomboy', "Kattaqo'rg'on", 'Narpay', 'Nurobod', 'Oqdaryo', "Pastdarg'om", 'Paxtachi', 'Payariq', "Qo'shrabot", 'Samarqand', 'Toyloq', 'Urgut',
  ]),
  R('sirdaryo', 'Sirdaryo viloyati', '🌊', [
    'Guliston shahri', 'Shirin shahri', 'Yangiyer shahri',
    'Boyovut', 'Guliston', 'Mirzaobod', 'Oqoltin', 'Sardoba', 'Sayxunobod', 'Sirdaryo', 'Xovos',
  ]),
  R('surxondaryo', 'Surxondaryo viloyati', '☀️', [
    'Termiz shahri',
    'Angor', 'Bandixon', 'Boysun', 'Denov', "Jarqo'rg'on", 'Muzrabot', 'Oltinsoy', 'Qiziriq', "Qumqo'rg'on", 'Sariosiyo', 'Sherobod', "Sho'rchi", 'Termiz', 'Uzun',
  ]),
  R('qoraqalpogiston', "Qoraqalpog'iston Respublikasi", '🐪', [
    'Nukus shahri',
    'Amudaryo', 'Beruniy', "Bo'zatov", 'Chimboy', "Ellikqal'a", 'Kegeyli', "Mo'ynoq", 'Nukus', "Qanliko'l", "Qo'ng'irot", "Qorao'zak", 'Shumanay', 'Taxiatosh', "Taxtako'pir", "To'rtko'l", "Xo'jayli",
  ]),
];

export const findRegion = (id?: string) => REGIONS.find((r) => r.id === id);
