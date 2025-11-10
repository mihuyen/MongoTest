# MongoTest
Dự án này minh họa hai mô hình hoạt động quan trọng trong MongoDB, được triển khai bằng Docker Compose:
- Replication: Mô phỏng hệ thống nhiều node sao lưu dữ liệu để đảm bảo luôn sẵn sàng.
- Sharding: Mô phỏng hệ thống chia nhỏ dữ liệu trên nhiều máy chủ để tăng khả năng mở rộng.

## Hướng dẫn tạo và khởi chạy MongoDB Replica Set đơn giản bằng Docker Compose.
1. Tạo file docker-compose.yml
Tạo file docker-compose.yml trong thư mục dự án, sau đó mở Terminal tại thư mục đó và chạy:
```
docker compose up -d
```
 Kết quả khi khởi động container MongoDB thành công:
<img width="716" height="81" alt="image" src="https://github.com/user-attachments/assets/cf1d2025-3336-4125-ae16-1071834465b1" /> </p>
2. Truy cập vào container MongoDB
Mở terminal khác (hoặc tab mới trong VS Code) rồi chạy:
docker exec -it mongo1 mongosh
<img width="738" height="230" alt="image" src="https://github.com/user-attachments/assets/d69d0599-ee60-4e2c-80b5-a875b4c136cf" /> </p>
3. Khởi tạo Replica Set
Trong cửa sổ mongosh, chạy các lệnh sau:

rs.initiate()
rs.status()
 <img width="737" height="155" alt="image" src="https://github.com/user-attachments/assets/fa3ea5e9-ecc0-46a2-a8ec-0ae80e2a634e" /> </p>
<img width="698" height="206" alt="image" src="https://github.com/user-attachments/assets/18edb864-f152-4fb9-a913-92b58e60994d" /> </p>
4. Kiểm tra kết quả
Khi bạn thấy:
stateStr: "PRIMARY"
→ Nghĩa là Replica Set đã được khởi tạo thành công 🎉
