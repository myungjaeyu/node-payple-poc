const express = require('express')
const bodyParser = require('body-parser')

require('json-dotenv')()


const app = express()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.post('/auth', (req, res) => {

    let url = 'https://testcpay.payple.kr/php/auth.php',
        params = {
            cst_id  : process.env.CST_ID || '',
            custKey : process.env.CUST_KEY || ''
        }


    res.json({ url, params })
    /**
     * return json
    {
        "url": "https://testcpay.payple.kr/php/auth.php",
        "params": {
            "cst_id": "test",
            "custKey": "abcd1234567890"
        }
    }
    */


})

module.exports = app