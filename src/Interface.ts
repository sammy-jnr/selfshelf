export interface BookInterface {
  name: string,
  id: string,
  author: string,
  rating: number,
  pdfFile?: File|null,
  dateAdded: string,
  categories: string[],
  imgFile: File,
  link?: string,
  numberOfPages: string,
  ISBN?: string,
  description: string,
  isFavourite: boolean
}
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