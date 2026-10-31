# Trang cá nhân — Huy Hoàng

## Đặc tả đã chốt

- **Tên hiển thị:** Huy Hoàng
- **Câu giới thiệu:** Không dùng
- **Mục đích:** Giới thiệu và dẫn người xem đến các nền tảng mạng xã hội
- **Avatar:** `assets/huy-hoang-avatar.png` (ảnh bạn đã cung cấp)
- **Phong cách:** Dark mode / kính mờ phối texture photocopy
- **Màu sắc:** Đen, trắng và các sắc độ xám; ảnh avatar giữ nguyên màu để tạo điểm nhấn

## Link mạng xã hội

- TikTok: https://www.tiktok.com/@huyhoang_2801
- Facebook: https://www.facebook.com/huyhoang2801/
- Instagram: https://www.instagram.com/huyhoang2801/
- Discord: https://discord.com/users/566281278987567121

## Hướng thiết kế đề xuất

- Nền đen than với các lớp sáng trắng/xám chuyển động rất chậm.
- Phủ texture hạt giấy photocopy đơn sắc ở mức nhẹ, tránh làm rối chữ và avatar.
- Đặt avatar ở trung tâm trong khung bo tròn hoặc khung ảnh giấy có viền trắng mảnh.
- Hiển thị “Huy Hoàng” rõ ngay dưới avatar; không thêm đoạn giới thiệu.
- Xếp bốn nền tảng thành các nút lớn, dễ chạm trên điện thoại; mỗi nút có icon, tên nền tảng và mũi tên mở liên kết.
- Dùng thẻ kính mờ màu than trong suốt, viền sáng mảnh và bóng đổ dịu.
- Hiệu ứng hover/focus đơn sắc: nút sáng hơn, dịch chuyển nhẹ; nền không chuyển động quá nhanh.
- Tôn trọng cài đặt `prefers-reduced-motion` và giữ độ tương phản cao.

## Các giai đoạn thực hiện

1. **Chuẩn bị nội dung:** Đã có tên, avatar và bốn đường dẫn mạng xã hội.
2. **Chốt giao diện:** Dùng hướng kính mờ tối + photocopy; chọn bố cục một màn hình, ưu tiên điện thoại.
3. **Dựng giao diện:** Tạo component React, CSS responsive và cấu hình tập trung cho các liên kết/icon.
4. **Thêm chuyển động:** Thêm nền chuyển động chậm, hiệu ứng nút và hỗ trợ giảm chuyển động.
5. **Kiểm tra:** Thử trên điện thoại/máy tính, kiểm tra mọi đường dẫn, khả năng đọc và tốc độ tải.
6. **Đưa lên mạng:** Chọn nơi triển khai và kiểm tra trang sau khi xuất bản.

## Cấu trúc gợi ý

```text
social-profile/
  README.md
  assets/
    huy-hoang-avatar.png
  SocialProfile.tsx
  social-profile.css
  links.ts
```

## Đã dựng

- Giao diện React nằm trong `src/social-profile/`.
- Mở trang tại đường dẫn `/social-profile` khi chạy hoặc triển khai website.
- Trang đã dùng avatar ở `social-profile/assets/huy-hoang-avatar.png` và các đường dẫn đã cung cấp.
- Nền có chuyển động chậm, lớp nhiễu photocopy, thẻ kính mờ và hỗ trợ cài đặt giảm chuyển động của thiết bị.
- Nền artwork xanh đen với tinh thể faceted và các tia sét xanh nước biển; nền chớp sáng nhẹ, có tia sét tương tác khi rê và nhấp chuột.
- Thẻ chính được tối giản còn avatar, tên và bốn icon liên kết mạng xã hội.

> Texture photocopy nên là lớp trang trí có độ tương phản thấp. Tránh tự phát nhạc; nếu sau này thêm âm thanh, để người xem chủ động bật.
