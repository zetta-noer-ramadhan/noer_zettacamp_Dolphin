const router = require('express').Router()
const service = require('../service/async.service')


router.get('/pef-one', async (req, res) => {

    console.log('\nawait start\n')

    const sample = await service.asyncFunction()
        .then(data => {
            // console.log(data, 'from route', typeof data)
            // data = data.filter(data => typeof data === 'number')
            return data
        })
        .catch(err => {
            console.log('err from route', err)
            // return err
        })

    console.log('\n= after text')
    console.log('=> await result:', sample, '\n')

    return res.json({
        mesage: 'await',
        data: sample
    })
})

router.get('/pef-two', (req, res) => {

    console.log('\nno await start\n')

    const sample = service.asyncFunction()
        .then(res => {
            // console.log('res', res)
            return res
        })
        .catch(err => {
            console.log('err', err)
        })

    console.log('\n= after text')
    console.log('=> no await result:', sample, '\n')

    return res.json({
        mesage: 'no await',
        data: sample
    })
})

module.exports = router