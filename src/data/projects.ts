export interface Project {
  id: number;
  category: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  url?: string;
  previewFallback?: string;
  imageClass?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    category: 'Thiết kế Website',
    title: 'Website giới thiệu dịch vụ',
    description:
      'Thiết kế website chuyên nghiệp, trình bày dịch vụ rõ ràng và giúp khách hàng dễ dàng liên hệ.',
    tags: ['Website', 'Responsive', 'UI/UX'],
    image: '/images/projects/project-01.jpg',
  },
  {
    id: 2,
    category: 'Thiết kế Website',
    title: 'Landing page giới thiệu sản phẩm',
    description:
      'Sắp xếp nội dung và lời kêu gọi hành động mạch lạc trên máy tính và thiết bị di động.',
    tags: ['Landing Page', 'Responsive', 'UI/UX'],
    image: '/images/projects/project-02.jpg',
  },
  {
    id: 3,
    category: 'SEO Marketing',
    title: 'Tối ưu SEO On-page',
    description:
      'Cải thiện cấu trúc trang, nội dung và các yếu tố SEO để công cụ tìm kiếm hiểu website tốt hơn.',
    tags: ['SEO', 'On-page', 'Từ khóa'],
    image: '/images/projects/project-03.jpg',
  },
  {
    id: 4,
    category: 'SEO Marketing',
    title: 'Cải thiện tốc độ website',
    description:
      'Rà soát trải nghiệm tải trang và khả năng sử dụng trên các kích thước màn hình khác nhau.',
    tags: ['Tốc độ', 'Trải nghiệm', 'Responsive'],
    image: '/images/projects/project-04.jpg',
  },
];
