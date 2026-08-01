export interface Blog {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  author: string;
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  tags: string[];
}
