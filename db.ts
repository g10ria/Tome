import * as mongoose from "mongoose"

mongoose.connect("mongodb://localhost:27017/tome", { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", function (e) {
    // sentry
    console.log("Error with MongoDB: " + e);
    process.exit(1)
})

db.once("open", function () {
    console.log(`Successfully connected to MongoDB on port 27017`)
})

export default mongoose;