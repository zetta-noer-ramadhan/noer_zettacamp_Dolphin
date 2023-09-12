const events = require('events')
const eventEmitter = new events.EventEmitter()

const fs = require('fs')

const asyncFunction = async (req) => {

    eventEmitter.emit('start')
    fs.writeFileSync('./result.log', '', err => err && console.log('write', err))

    return Promise
        .all(
            new Array(5)
                .fill(0)
                .map(async (_, i) =>
                    new Promise(async (resolve, reject) => {

                        if (i === 2) return reject(['rejected', i])

                        const result = new Date()
                        fs.appendFile('./result.log', [result, i, '\n'].join(' '), 'utf8', err => err && console.log('append', err))

                        setTimeout(() => {
                            eventEmitter.emit('print', i)
                            resolve(i)
                        }, i * 2000)
                    }))
                // .map(item => item.catch(err => {
                //     eventEmitter.emit('error', {
                //         from: 'each promise',
                //         data: err
                //     })
                //     return err
                // }))
                // .map(item => item.catch(() => null))
        )
        .finally(data => {
            eventEmitter.emit('stop')
            return data
        })
        // .catch(err => {
        //     eventEmitter.emit('error', {
        //         from: 'all promise',
        //         data: err
        //     })
        //     return err
        // })
}

eventEmitter.on('print', async (params) => {
    console.log('## params:', params)
})

eventEmitter.on('start', () => {
    console.log('# start printing')
})

eventEmitter.on('stop', () => {
    console.log('# stop printing')
})

eventEmitter.on('error', (params) => {
    console.log('rejected', params)
})

module.exports = {
    asyncFunction
}