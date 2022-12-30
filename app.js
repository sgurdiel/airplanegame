import express from "express"
import { fstat, readFile } from "fs"
import path from "path"
import { fileURLToPath } from "url";

const app = express()
const port = 3000
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let html = ""

readFile(path.join(__dirname, "/public/index.html"), "utf-8", (err, data) => {
  if (err) throw err
  html = data.replace(/APP_RELEASE/, process.env.APP_RELEASE)
})

app.use("/css", express.static("public/css"))
app.use("/img", express.static("public/img"));
app.use("/js", express.static("public/js"));
if (process.env.NODE_ENV === "development" || typeof process.env.NODE_ENV === "undefined") {
  app.use("/coverage", express.static("public/coverage/lcov-report"));
}

app.get("/", (req, res) => {
  res.send(html)
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
