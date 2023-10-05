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
    } else {
        result.is_valid_string = false
    }

    if (
        dateTime && typeof dateTime === 'object' &&
        dateTime.date && typeof dateTime.date === 'string' &&
        dateTime.time && typeof dateTime.time === 'string'
    ) {
        // #c date & time from object of date and time
        const formattedInput = dateTime.date + ' ' + dateTime.time
        result.datetime_from_object = moment(formattedInput, dateTimeFormat).format(dateTimeFormat)
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