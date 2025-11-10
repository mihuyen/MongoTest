# MongoTest
Dự án này minh họa hai mô hình hoạt động quan trọng trong MongoDB, được triển khai bằng Docker Compose:
- Replication: Mô phỏng hệ thống nhiều node sao lưu dữ liệu để đảm bảo luôn sẵn sàng.
- Sharding: Mô phỏng hệ thống chia nhỏ dữ liệu trên nhiều máy chủ để tăng khả năng mở rộng.

## Hướng dẫn khởi chạy MongoDB Replica Set 3 nodes

### Bước 1: Khởi động Cluster
Project đã có sẵn `docker-compose.yml` và `init-replica.js` để tự động setup 3-node replica set.

Mở Terminal tại thư mục dự án và chạy:
```bash
docker compose up -d
```
<img width="716" height="81" alt="image" src="https://github.com/user-attachments/assets/cf1d2025-3336-4125-ae16-1071834465b1" /> </p>

### Bước 2: Xác minh Replica Set
Cluster sẽ **tự động khởi tạo replica set** với 3 nodes. Đợi 15-30 giây để các container khởi động hoàn toàn.

Kiểm tra trạng thái:
```bash
docker exec mongo1 mongosh --eval "rs.status()"
```

**Hoặc kết nối interactive:**
```bash
docker exec -it mongo1 mongosh
```

Trong mongosh, chạy:
```javascript
rs.status()
```

### Bước 3: Xác nhận cấu hình 3 nodes
Bạn sẽ thấy trong kết quả `rs.status()`:

```javascript
members: [
  { _id: 0, name: 'mongo1:27017', stateStr: 'PRIMARY' },
  { _id: 1, name: 'mongo2:27017', stateStr: 'SECONDARY' },  
  { _id: 2, name: 'mongo3:27017', stateStr: 'SECONDARY' }
]
```


### ✅ Thành công khi thấy:
- `stateStr: "PRIMARY"` (mongo1)  
- `stateStr: "SECONDARY"` (mongo2, mongo3)
- `ok: 1` trong response

→ **Replica Set 3 nodes đã hoạt động! 🎉**

## 🔧 Cách thức hoạt động

### Tự động khởi tạo
Khi chạy `docker compose up -d`, hệ thống sẽ:

1. **Khởi động 3 MongoDB containers:**
   - `mongo1` (port 27017) 
   - `mongo2` (port 27018)
   - `mongo3` (port 27019)

2. **Tự động chạy init script:**
   - Container `mongo-init` sẽ đợi mongo1 sẵn sàng
   - Thực thi `init-replica.js` để khởi tạo replica set với 3 members
   - Script tương đương với lệnh thủ công:
   ```javascript
   rs.initiate({
     _id: "rs0",
     members: [
       { _id: 0, host: "mongo1:27017" },
       { _id: 1, host: "mongo2:27017" },  
       { _id: 2, host: "mongo3:27017" }
     ]
   })
   ```

3. **Election tự động:**
   - Các node sẽ tự bầu chọn PRIMARY (thường là mongo1)
   - mongo2 và mongo3 trở thành SECONDARY

### 📁 Cấu trúc Replica Set
- **mongo1** (PRIMARY) - Port: 27017
- **mongo2** (SECONDARY) - Port: 27018  
- **mongo3** (SECONDARY) - Port: 27019

### Kết nối từ ứng dụng
```javascript
// Connection string cho replica set
mongodb://localhost:27017,localhost:27018,localhost:27019/?replicaSet=rs0
```


## 🔀 MongoDB Sharding Setup


### 🚀 Khởi chạy MongoDB Sharding Cluster

Bước 1: Khởi động Sharding Cluster
```bash
# Dừng replica set cluster trước (nếu đang chạy)
docker compose down
```
<img width="726" height="298" alt="image" src="https://github.com/user-attachments/assets/3688605b-f7f2-4a9b-91a1-2d8a6b5155c0" />

Khởi động sharding cluster
```bash
docker compose -f docker-compose-sharding.yml up -d
```
<img width="737" height="789" alt="image" src="https://github.com/user-attachments/assets/c1e8d9c1-259e-49af-be0d-27853fd4fc0e" />

Bước 2: Xác minh Cluster Status
Đợi 30-60 giây để tất cả services khởi động, sau đó kiểm tra:

```bash
# Kết nối vào mongos router
docker exec -it mongos1 mongosh
```
<img width="725" height="196" alt="image" src="https://github.com/user-attachments/assets/5cf65563-f8f1-4991-a3f4-9e214b152fcf" />

```bash
# Trong mongosh - kiểm tra shards
sh.status()
```

**Kết quả mong đợi:**
```javascript
shards:
  { _id: 'shard1', host: 'shard1/shard1a:27017,shard1b:27017,shard1c:27017' }
  { _id: 'shard2', host: 'shard2/shard2a:27017,shard2b:27017,shard2c:27017' }

active mongoses:
  "mongos1:27017": { ... }
  "mongos2:27017": { ... }
```

Bước 3: Tạo Sharded Database và Collection

```bash
# Trong mongos shell
use ecommerce

# Enable sharding cho database
sh.enableSharding("ecommerce")

# Tạo sharded collection với shard key
sh.shardCollection("ecommerce.products", { "category": 1, "_id": 1 })
sh.shardCollection("ecommerce.orders", { "user_id": 1 })
```
#### Xác minh Data Distribution
```javascript
// Kiểm tra phân bổ dữ liệu trên các shards
sh.status()

// Xem chunk distribution
db.adminCommand("getShardDistribution")

// Thống kê từng shard
db.products.getShardDistribution()
db.orders.getShardDistribution()
```




