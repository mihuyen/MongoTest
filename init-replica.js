rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017" },
    { _id: 1, host: "mongo2:27017" },
    { _id: 2, host: "mongo3:27017" }
  ]
});

// Wait a little and print status
print('Waiting for replica set to elect primary...');
sleep(5000);
printjson(rs.status());