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

                        const result = new Date()
                        fs.appendFile('./result.log', [result, i, '\n'].join(' '), 'utf8', err => err && console.log('append', err))

                        setTimeout(() => {
                            eventEmitter.emit('print', i)
                            resolve(i)
                        }, i * 2000)
                    }))
        )
        .finally(data => {
            eventEmitter.emit('stop')
            return data
        })
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