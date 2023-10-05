const moment = require('moment')

const ConvertMoment = (date, dateTime) => {

    const dateFormat = 'DD/MM/YYYY'
    const timeFormat = 'HH:mm:ss'
    const dateTimeFormat = dateFormat + ' ' + timeFormat
    const result = {}

    // #a current date & time
    result.current_date = moment().format(dateTimeFormat)

    // #d current date & time on utc
    result.current_date_utc = moment().utc().format(dateTimeFormat)

    // #e validation on string of date parameter
    if (date && typeof date === 'string') {
        result.is_valid_string = moment(date, dateFormat).isValid()

        if (result.is_valid_string) {
            // #b date & time from string of date
            result.datetime_from_string = moment(date, dateFormat).format(dateTimeFormat)
        }
    }else{
        result.is_valid_string = false
    }

    if (
        dateTime && typeof dateTime === 'object' &&
        dateTime.date && typeof dateTime.date === 'string' &&
        dateTime.time && typeof dateTime.time === 'string'
    ) {
        // #c date & time from object of date and time
        const dateSplit = dateTime.date.split('/').map(item => +item)
        const [day, month, year] = dateSplit
        const zeroBasedMonth = month > 0 ? month - 1 : month

        const timeSplit = dateTime.time.split(':').map(item => +item)
        const [hour, minute, second] = timeSplit

        if (dateSplit.length === 3 && timeSplit.length === 3) {
            const format = { day, month: zeroBasedMonth, year, hour, minute, second }
            result.datetime_from_object = moment(format).format(dateTimeFormat)
        }
    }

    console.log(result)
    return result
}


const Main = () => {

    const date = '1/1/2024'
    const dateTime = {
        date: '21/12/2909',
        time: '23:45:10'
    }

    ConvertMoment(date, dateTime)
}

Main()