const express = require('express')
const bodyParser = require('body-parser')
const { get } = require('axios')

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


    get(url, { params })
        .then(r => res.json( {  ...r.data }))
        .catch(err => console.error(err))
    /**
     * return json
    {
        "result": "success",
        "result_msg": "사용자 인증 완료!!",
        "cst_id": "test",
        "custKey": "abcd1234567890",
        "AuthKey": "fc63fe1ed0016321a666b1a9c0b6f68d9d5e4ff5c57e448314ba3352da59f1a7",
        "return_url": "https://testcpay.payple.kr/index.php?ACT_=PAYM"
    }
    */

})

module.exports = app