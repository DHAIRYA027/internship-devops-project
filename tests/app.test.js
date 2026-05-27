const request = require('supertest')
const express = require('express')

const app = express()

app.get('/', (req, res) => {
    res.status(200).send('DevSecOps Pipeline Running')
})

describe('GET /', () => {
    it('should return 200', async () => {
        const response = await request(app).get('/')
        expect(response.statusCode).toBe(200)
    })
})
describe('Basic Test', () => {
    test('Sample test should pass', () => {
        expect(1 + 1).toBe(2)
    })
})