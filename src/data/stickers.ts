/** Yulduzlar evaziga ochiladigan stikerlar */
export const STICKERS = [
  '🐣', '🦋', '🌈', '🍭', '🚀', '🦄', '🐬', '🌻', '🎈', '🐼', '🍩', '🦖',
  '🏰', '🐙', '🌟', '🎨', '🦁', '🍓', '🐢', '🎠', '🪐', '🐳', '🏆', '👑',
];
export const STARS_PER_STICKER = 10;
export const STARS_PER_LEVEL = 25;

export const levelOf = (stars: number) => Math.floor(stars / STARS_PER_LEVEL) + 1;
export const stickersOpen = (stars: number) => Math.min(STICKERS.length, Math.floor(stars / STARS_PER_STICKER));

/** Faqat Pro tarifida: oltin stikerlar (shu yulduzlar bo'yicha ochiladi) */
export const PRO_STICKERS = [
  '🏆', '👑', '💎', '🦚', '🐉', '🎆', '🛸', '🦩', '🏯', '🎻', '🦜', '🐋',
  '🌠', '🍀', '🦋', '🎪', '🚂', '🗽', '🧩', '🎯', '🪁', '🦕', '🌋', '🚀',
];
