export interface Author {
  name: string;
  picture: string;
}

export interface OGImage {
  url: string;
}

export interface PostComment {
  _id: string;
  name: string;
  date: number;
  message: string;
  slug: string;
  messageHtml?: string;
}

export interface Post {
  slug: string;
  title: string;
  author: Author;
  date: string;
  content: string;
  excerpt: string;
  ogImage: OGImage;
  draft: boolean;
  comments: PostComment[];
}
