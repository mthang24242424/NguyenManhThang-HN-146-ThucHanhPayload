1. Prompt sau khi tối ưu

Hãy giải thích ngắn gọn đoạn code Java dưới đây. Mô tả chức năng của hàm checkLevel(), giải thích từng điều kiện rẽ nhánh (if) và cho biết giá trị đầu ra tương ứng với từng trường hợp của biến points.

2. Phản hồi mẫu từ AI sau khi chạy prompt

Hàm checkLevel(int points) dùng để xác định hạng thành viên dựa trên số điểm tích lũy của khách hàng.

Nếu points >= 1000, điều kiện trong câu lệnh if đúng, hàm trả về chuỗi "VIP".
Nếu points < 1000, điều kiện if sai, chương trình bỏ qua khối lệnh bên trong if và trả về chuỗi "Standard".

Ví dụ:

checkLevel(1200) → "VIP"
checkLevel(1000) → "VIP"
checkLevel(800) → "Standard"