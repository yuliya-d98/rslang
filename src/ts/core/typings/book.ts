export type Word = {
  id?: string;
  _id?: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
};

export type Words = Word[];

export type UserWord = {
  difficulty: string;
  id: string;
  wordId: string;
};

export type UserWords = UserWord[];

export type DifWord = {
  difficulty: string;
  optional: { [key: string]: string };
};

export type DifWords = DifWord[];

export type FilteredResponce = [
  {
    paginatedResults: Words;
    totalCount: string[];
  }
];

export const ChapterNames = [
  'Раздел 1',
  'Раздел 2',
  'Раздел 3',
  'Раздел 4',
  'Раздел 5',
  'Раздел 6',
  'Слова, отмеченные как сложные',
  'Слова, отмеченные как изученные',
];
