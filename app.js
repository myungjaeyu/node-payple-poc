const express = require('express')
const bodyParser = require('body-parser')
const { get } = require('axios')
const ejs = require('ejs')

require('json-dotenv')()


const app = express()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(`${__dirname}/dist`))


app.get('/', (req, res) => { // order api

    let data = {
            buyer_no : 2335,
            buyer_name : '홍길동',
            buyer_hp : '01012345678',
            buyer_email : 'test@payple.co.kr',
            buy_goods : '휴대폰',
            buy_total : '1000',
            order_num : '101'
        },
        opts = {}


    ejs.renderFile(__dirname + '/ejs/order.html', data, opts, (err, str) => !err && res.send(str))


})


app.post('/confirm', (req, res) => { // order confirm api

    let { 
            buyer_no, buyer_name, buyer_hp, buyer_email,
            buy_goods, buy_total,
            order_num,
            pay_year, pay_month,
            is_reguler, is_taxsave
        } = req.body,
        data = {
            buyer_no : buyer_no || '',
            buyer_name : buyer_name || '',
            buyer_hp : buyer_hp || '',
            buyer_email : buyer_email || '',
            buy_goods : buy_goods || '',
            buy_total : buy_total || '',
            order_num : order_num || '',
            pay_year : pay_year || '',
            pay_month : pay_month || '',
            is_reguler : is_reguler || false,
            is_taxsave : is_taxsave || false
        },
        opts = {}


    ejs.renderFile(__dirname + '/ejs/order_confirm.html', data, opts, (err, str) => !err && res.send(str))


})


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