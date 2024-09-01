const express = require('express')
const app = express()

app.all('/', (req, res) => {
    res.status(200).send("Hello World")
})

app.listen(process.env.X_ZOHO_CATALYST_LISTEN_PORT|9000, () => {
    console.log("Server Started")
})