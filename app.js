import express from "express"
import path from "path"
import { fileURLToPath } from "url";

const app = express()
const port = 3000
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/css", express.static("public/css"))
app.use("/img", express.static("public/img"));
app.use("/js", express.static("public/js"));
if (process.env.NODE_ENV === "development" || typeof process.env.NODE_ENV === "undefined") {
  app.use("/coverage", express.static("public/coverage/lcov-report"));
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"))
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
