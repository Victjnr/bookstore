export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  cover: string;
  rating: number;
  reviews: number;
  genre: string;
  description: string;
  pages: number;
  published: string;
  isbn: string;
  inStock: boolean;
}

export const genres = [
  "All",
  "Fiction",
  "Classic",
  "Dystopian",
  "Romance",
  "Mystery",
  "Science Fiction",
  "Fantasy",
  "Non-Fiction",
];

export const books: Book[] = [
  {
    id: "1",
    title: "A Rail of Hope",
    author: "Yvonne Tsumbirani",
    price: 10.00,
    originalPrice: 12.99,
    cover: "/books/a promise of a better future.jpeg",
    rating: 4.8,
    reviews: 2341,
    genre: "Non-fiction",
    description: "A powerful story of hope and resilience. Rail of Hope takes you on a journey through life's challenges and the moments that define us.",
    pages: 180,
    published: "2024",
    isbn: "978-0743273565",
    inStock: true,
  },
  {
    id: "2",
    title: "Walk of Life",
    author: "Yvonne Tsumbirani",
    price: 10.00,
    cover: "/books/book 2 walk of life.jpeg",
    rating: 4.9,
    reviews: 3892,
    genre: "Motivational",
    description: "An inspiring narrative about life's journey and personal growth. Walk of Life explores the paths we choose and the destinations we reach.",
    pages: 328,
    published: "2024",
    isbn: "978-0451524935",
    inStock: true,
  },
 
  {
    id: "3",
    title: "The Voices in Me",
    author: "Yvonne Tsumbirani",
    price: 9.99,
    cover: "/books/the voices in me.jpeg",
    rating: 5.0,
    reviews: 3120,
    genre: "Self-Help",
    description: "An introspective exploration of the internal dialogue we all experience. The Voices in Me helps you understand and embrace your inner world.",
    pages: 432,
    published: "2024",
    isbn: "978-0141439518",
    inStock: true,
  },
 
];
