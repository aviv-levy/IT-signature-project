const Router = require("express").Router();
const puppeteer = require('puppeteer');
const fs = require('fs')
const sql = require('../database');
const Database = new sql();

// https://signature.native-data.co.il/hr
Router.get('/', (req, res) => {
    res.sendFile('/Project/IT-signature-project/HTML/HR/hrPanel.html')
})

// https://signature.native-data.co.il/hr/getWorkers
Router.get('/getWorkers', async (req, res) => {
    try {
        let statement = "SELECT * from HR_Secret_Vacation";
        res.status(200).json(await Database.selectQuery(statement).catch((err) => { console.error(err) }))
    } catch (err) {
        res.status(500).send();
        console.log(err.message);
    }
})

// https://signature.native-data.co.il/hr/secretForm
Router.get('/secretForm', (req, res) => {
    res.sendFile('/Project/IT-signature-project/HTML/HR/secretForm.html')
})

// https://signature.native-data.co.il/hr/getWorkers/secretForm/sign
Router.post('/secretForm/sign', async (req, res) => {
    try {
        let { id, workername, date, signature } = req.body;
        console.log(workername);
        let statement = "INSERT INTO HR_Secret_Vacation (id,name,date,secretSign) VALUES ('" + id + "','" + workername + "','" + date + "','" + signature + "')";
        await Database.insertUpdateQuery(statement);
        res.status(201).send();
    } catch (err) {
        if (err.errno === 1062)
            res.status(409).send()
        else {
            console.log(err.message);
            res.status(500).send();
        }
    }
})

// https://signature.native-data.co.il/hr/getWorkers/vacationForm
Router.get('/vacationForm', (req, res) => {
    res.sendFile('/Project/IT-signature-project/HTML/HR/vacationForm.html')
})

// https://signature.native-data.co.il/hr/getWorkers/vacationForm/sign
Router.put('/vacationForm/sign', async (req, res) => {
    try {
        let { id, signature } = req.body;
        let statement = "UPDATE HR_Secret_Vacation SET vacationSign = '" + signature + "' WHERE id = " + id + "";
        await Database.insertUpdateQuery(statement)
        res.status(202).send();
    } catch (err) {
        res.status(500).send();
        console.log(err.message);
    }
})

// https://signature.native-data.co.il/hr/createPDF/:id
Router.get('/createPDF/:id', async (req, res) => {
    try {
        const ID = req.params.id;
        let statement = `Select * from HR_Secret_Vacation WHERE id = ${ID}`
        const results = JSON.parse(await Database.selectQuery(statement))[0];

        const url = `file://C:/Project/IT-signature-project/HTML/HR/PDF-Templates/secretForm.html`

        const browser = await puppeteer.launch({
            headless: true
        });

        const page = await browser.newPage();
        page.goto(url);
        await page.waitForSelector('input[name=name]');
        await page.$eval('input[name=name]', (el, results) => el.value = results, results.name);
        await page.$eval('input[name=id]', (el, results) => el.value = results, results.id);
        await page.$eval('input[name=date]', (el, results) => el.value = results, results.date);
        await page.evaluate((arg) => {
            return document.getElementById("signature").src = arg;
        }, results.secretSign);
        await page.pdf({ path: `./PDF/${results.id}.pdf`, width: "1200px" })
        console.log('done');
        res.status(200).download(`./PDF/${results.id}.pdf`, function (err) {
            if (err)
                console.log(err);

            fs.unlinkSync(`./PDF/${results.id}.pdf`, function () {
                console.log('File was deleted');
            });

        })
    } catch (err) {
        console.log(err.message);
    }
})

// https://signature.native-data.co.il/hr/createPDF_Vacation/:id
Router.get('/createPDF_Vacation/:id', async (req, res) => {
    try {
        const ID = req.params.id;
        let statement = `Select * from HR_Secret_Vacation WHERE id = ${ID}`
        const results = JSON.parse(await Database.selectQuery(statement))[0];

        const url = `file://C:/Project/IT-signature-project/HTML/HR/PDF-Templates/vacationForm.html`

        const browser = await puppeteer.launch({
            headless: true
        });

        const page = await browser.newPage();
        page.goto(url);
        await page.waitForSelector('input[name=name]');
        await page.$eval('input[name=name]', (el, results) => el.value = results, results.name);
        await page.evaluate((arg) => {
            return document.getElementById("signature").src = arg;
        }, results.vacationSign);
        await page.pdf({ path: `./PDF/${results.id}.pdf`, width: "1200px" })
        console.log('done');
        res.status(200).download(`./PDF/${results.id}.pdf`, function (err) {
            if (err)
                console.log(err);

            fs.unlinkSync(`./PDF/${results.id}.pdf`, function () {
                console.log('File was deleted');
            });

        })
    } catch (err) {
        console.log(err.message);
    }
})

module.exports = Router;