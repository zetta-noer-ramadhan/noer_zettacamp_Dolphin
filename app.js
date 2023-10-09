const moment = require('moment');

const ErrorBuilder = (name, message) => ({
    error_name: name,
    error_message: message,
});

const DisplayAndQuery = (firstDate, secondDate) => {
    const isFirstDateExistAndAString = firstDate && typeof firstDate === 'string';
    const isSecondDateExistAndAString = secondDate && typeof secondDate === 'string';

    if (!isFirstDateExistAndAString || !isSecondDateExistAndAString) {
        return ErrorBuilder('parameter', 'bad strings of date parameter');
    }

    const isFirstDateValid = moment(firstDate, 'DD/MM/YYYY', true).isValid();
    const isSecondDateValid = moment(secondDate, 'DD/MM/YYYY', true).isValid();

    if (!isFirstDateValid || !isSecondDateValid) {
        return ErrorBuilder('invalid parameter', 'invalid strings of date parameter');
    }

    const isSameOrAfterMoment = moment(firstDate, 'DD/MM/YYYY', true).isSameOrAfter(moment(secondDate, 'DD/MM/YYYY', true));
    let isSameOrAfterMessage = '';

    if (isSameOrAfterMoment) {
        isSameOrAfterMessage = 'parameter 1\'s date is the same with or after parameter 2\'s';
    } else {
        isSameOrAfterMessage = 'parameter 1\'s date isn\'t the same with and not after parameter 2\'s';
    }

    const isBetweenMoment = moment().isBetween(moment(firstDate, 'DD/MM/YYYY', true), moment(secondDate, 'DD/MM/YYYY', true));
    let isBetweenMessage = '';

    if (isBetweenMoment) {
        isBetweenMessage = 'the current date is between parameter 1\'s date and parameter 2\'s date';
    } else {
        isBetweenMessage = 'the current date isn\'t between parameter 1\'s date and parameter 2\'s date';
    }

    return {
        first_date_indonesian: moment(firstDate, 'DD/MM/YYYY', true).locale('id').format('dddd, LL LTS Z'),
        differences_in_week: moment(firstDate, 'DD/MM/YYYY', true).diff(moment(secondDate, 'DD/MM/YYYY', true), 'week'),
        is_same_or_after: isSameOrAfterMessage,
        is_between: isBetweenMessage,
    };
};

const firstDate = '29/10/2023';
const secondDate = '09/10/2023';

const result = DisplayAndQuery(firstDate, secondDate);

console.log(result);

/*



# .format()


# .diff()


# .isSameOrAfter()


# .isSameOrBefore()


# .isBetween()




*/
