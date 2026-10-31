export interface Article {
  id: number;
  title: string;
  category: string;
  image: string;
  imageClass?: string;
}

export const articles: Article[] = [
  {
    id: 1,
    title: 'Những yếu tố cần có của một website chuyên nghiệp',
    category: 'Thiết kế Website',
    image: '/images/blog/blog-01.jpg',
  },
  {
    id: 2,
    title: 'Nghiên cứu từ khóa và tối ưu SEO On-page',
    category: 'SEO Marketing',
    image: '/images/blog/blog-02.jpg',
  },
  {
    id: 3,
    title: 'Thiết kế website thân thiện với thiết bị di động',
    category: 'Thiết kế Website',
    image: '/images/blog/blog-03.jpg',
  },
  {
    id: 4,
    title: 'Tốc độ tải trang ảnh hưởng đến trải nghiệm ra sao?',
    category: 'Website & SEO',
    image: '/images/blog/blog-04.jpg',
  },
];
