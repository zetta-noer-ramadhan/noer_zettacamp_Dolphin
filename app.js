const moment = require('moment')

const ConvertMoment = (date, dateTime) => {

    const dateFormat = 'DD/MM/YYYY'
    const timeFormat = 'HH:mm:ss'
    const dateTimeFormat = dateFormat + ' ' + timeFormat
    const result = {}


    const currentDateTime = moment()

    // #a current date & time
    result.current_date_time = currentDateTime.format(dateTimeFormat)


    // #d current date & time on utc
    result.current_date_time_utc = currentDateTime.utc().format(dateTimeFormat)


    // #e validation on string of date parameter
    result.is_valid_string = false
    if (date && typeof date === 'string') {
        const dateTimeFromString = moment(date, dateFormat)
        result.is_valid_string = dateTimeFromString.isValid()

        if (result.is_valid_string) {
            // #b date & time from string of date
            result.date_time_from_string = dateTimeFromString.format(dateTimeFormat)
        }
    }


    result.is_valid_object = false
    if (
        dateTime && typeof dateTime === 'object' &&
        dateTime.date && typeof dateTime.date === 'string' &&
        dateTime.time && typeof dateTime.time === 'string'
    ) {
        const dateSplit = dateTime.date.split('/').map(item => +item)
        const [day, month, year] = dateSplit
        const zeroBasedMonth = month > 0 ? month - 1 : month

        const timeSplit = dateTime.time.split(':').map(item => +item)
        const [hour, minute, second] = timeSplit

        if (dateSplit.length === 3 && timeSplit.length === 3) {
            // const formattedInput = dateTime.date + ' ' + dateTime.time
            const formattedInput = { day, month: zeroBasedMonth, year, hour, minute, second }

            // const dateTimeFromObject = moment(formattedInput, dateTimeFormat)
            const dateTimeFromObject = moment(formattedInput)

            result.is_valid_object = dateTimeFromObject.isValid()

            if (result.is_valid_object) {
                // #c date & time from object of date and time
                result.date_time_from_object = dateTimeFromObject.format(dateTimeFormat)
            }
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