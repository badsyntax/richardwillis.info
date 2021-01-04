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
  messageHtml: string;
  slug: string;
}

export interface Post {
  slug: string;
  title: string;
  author: Author;
  date: string;
  content: string;
  contentHtml: string;
  excerpt: string;
  ogImage: OGImage;
  draft: boolean;
  comments: PostComment[];
}
