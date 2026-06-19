Prompt mới do thiết kế

Hãy đóng vai trò là một lập trình viên Java có kinh nghiệm và kiểm tra đoạn code dưới đây dưới cả hai góc độ: lỗi kỹ thuật và lỗi logic nghiệp vụ. Đặc biệt, hãy phân tích trường hợp biến amount có giá trị bằng 0 hoặc là số âm, vì hóa đơn không được phép có giá trị âm hoặc bằng 0. Nếu phát hiện vấn đề, hãy giải thích ngắn gọn và chỉnh sửa lại code Java để ngăn chặn các đầu vào không hợp lệ trước khi tính thuế VAT 10%.

Đoạn code Java đã được AI sửa đổi

public class TaxCalculator {

    public static double calculateVAT(double amount) {

        if (amount <= 0) {
            throw new IllegalArgumentException(
                "Giá trị hóa đơn phải lớn hơn 0."
            );
        }

        return amount * 0.1;
    }
}

Giải thích ngắn gọn:

Nếu amount <= 0, chương trình sẽ ném ra ngoại lệ IllegalArgumentException.
Chỉ khi amount > 0 mới thực hiện tính thuế VAT 10%.
Điều này giúp tránh lỗi nghiệp vụ như tính ra thuế âm hoặc thuế bằng 0 cho các hóa đơn không hợp lệ