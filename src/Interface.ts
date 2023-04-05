export interface ProcessedBookInterface {
  name: string,
  id: string,
  author: string,
  rating: number,
  pdfFile?: string[],
  dateAdded: string,
  categories: string[],
  imgFile: string[],
  link?: string,
  numberOfPages: string,
  ISBN?: string,
  description: string,
  isFavourite: boolean
}