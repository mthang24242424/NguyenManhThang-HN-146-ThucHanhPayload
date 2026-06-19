# Task 1: Xây dựng cấu trúc Database và JPA Entities

## Vấn đề

Cần tạo các Entity `User`, `Role`, `UserRole` với quan hệ Many-to-Many, ràng buộc unique cho `username/email`, tránh lỗi recursion khi dùng Lazy Loading.

## Prompt đã sử dụng

```text
Hãy sinh code Spring Boot 3 (Java 17) cho các Entity User, Role, UserRole.
- Dùng JPA/Hibernate.
- Quan hệ User <-> Role là Many-to-Many thông qua bảng trung gian UserRole.
- Đặt unique constraint cho username và email.
- Không dùng @Data của Lombok trên Entity có quan hệ Lazy.
- Tối ưu tránh N+1 query bằng FetchType.LAZY và @EntityGraph khi cần.
```

## Đánh giá code AI sinh ra

- Code tạo đúng 3 entity, có annotation `@ManyToMany` và `@JoinTable`.
- Tuy nhiên AI ban đầu dùng `@Data` → gây nguy cơ recursion.
- Chưa thêm `@EntityGraph` cho repository.

## Prompt tinh chỉnh (Refinement)

```text
Không sử dụng @Data. Thay bằng @Getter/@Setter/@NoArgsConstructor/@AllArgsConstructor.
Thêm ví dụ repository với @EntityGraph để load roles của User.
```

---

# Task 2: Thiết kế JWT Filter và Spring Security Configuration

## Vấn đề

Cần xây dựng:

- JwtAuthenticationFilter
- JwtService
- CustomUserDetailsService
- SecurityFilterChain

## Prompt đã sử dụng

```text
Viết code JwtService trong Spring Boot 3 để tạo và verify JWT.
- Sử dụng io.jsonwebtoken.
- Token chứa username và role.
- Thêm hàm extractUsername, extractRole, isTokenValid.
```

## Đánh giá code AI sinh ra

- JwtService hoạt động, nhưng chưa xử lý expired token rõ ràng.
- Chưa có CustomUserDetailsService.

## Prompt tinh chỉnh (Refinement)

```text
Thêm CustomUserDetailsService để load User từ database.
Viết JwtAuthenticationFilter extends OncePerRequestFilter,
trả về JSON error 401/403 thay vì mặc định Spring.

Cấu hình SecurityFilterChain:
- /api/v1/auth/** permitAll
- /api/v1/admin/** hasRole('ADMIN')
- /api/v1/seller/** hasRole('SELLER')
- /api/v1/customer/** hasRole('CUSTOMER')
```

---

# Task 3: Xử lý Logic Nghiệp vụ & Database Tối ưu

## Vấn đề

API thống kê doanh thu cho SELLER, logic gọi MySQL Stored Procedure.

## Prompt đã sử dụng

```text
Viết stored procedure MySQL:

CREATE PROCEDURE get_total_revenue(
    IN sellerId BIGINT,
    OUT totalRevenue DECIMAL(15,2)
)
BEGIN
    SELECT SUM(order_amount)
    INTO totalRevenue
    FROM orders
    WHERE seller_id = sellerId;
END;

Viết repository Spring Data JPA gọi procedure này bằng @Procedure hoặc CallableStatement.
Đảm bảo chống SQL Injection.
```

## Đánh giá code AI sinh ra

- Procedure đúng cú pháp.
- Repository dùng `@Procedure` nhưng chưa mapping OUT parameter.

## Prompt tinh chỉnh (Refinement)

```text
Sử dụng CallableStatement trong Service layer để nhận OUT parameter.

Thêm GlobalExceptionHandler để bắt SQLException.

Viết API:
/api/v1/seller/revenue/{id}

Trả về JSON:

{
  "sellerId": ...,
  "totalRevenue": ...
}
```

---

# Tiêu chí Đánh giá

## Độ rõ ràng ngữ cảnh (30%)

Prompt đã nêu rõ:

- Spring Boot 3
- Java 17
- Kiến trúc Controller / Service / Repository

## Thiết lập ràng buộc (30%)

Có yêu cầu:

- ExceptionHandler
- Logging
- SOLID Principles

## Kỹ năng Refine/Debug (20%)

Đã phát hiện và xử lý:

- Lỗi Lombok `@Data` gây recursion
- Thiếu xử lý OUT parameter
- Tinh chỉnh prompt để hoàn thiện chức năng

## Kết quả Source Code (20%)

- Code cuối cùng chạy ổn định
- RBAC hoạt động đúng
- JWT xác thực đúng chuẩn
- Kiến trúc rõ ràng, dễ bảo trì