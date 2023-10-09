const moment = require('moment');

const ErrorBuilder = (name, message) => ({
    error_name: name,
    error_message: message,
});

const DisplayAndQuery = (firstDate, secondDate) => {
    if (!firstDate || typeof firstDate !== 'string' || !secondDate || typeof secondDate !== 'string') {
        return ErrorBuilder('parameter', 'bad strings of date parameter');
    }

    const isFirstDateValid = moment(firstDate, 'DD/MM/YYYY', true).isValid();
    const isSecondDateValid = moment(secondDate, 'DD/MM/YYYY', true).isValid();

    if (!isFirstDateValid || !isSecondDateValid) {
        return ErrorBuilder('invalid paramter', 'invalid strings of date parameter');
    }

    const result = {
        first_date_indonesian: moment(firstDate, 'DD/MM/YYYY', true).locale('id').format('LL LTS'),
        differences_in_week: moment(firstDate, 'DD/MM/YYYY', true).diff(moment(secondDate, 'DD/MM/YYYY', true), 'week'),
        is_same_or_after: moment(firstDate, 'DD/MM/YYYY', true).isSameOrAfter(moment(secondDate, 'DD/MM/YYYY', true)),
        is_between: moment().isBetween(moment(firstDate, 'DD/MM/YYYY', true), moment(secondDate, 'DD/MM/YYYY', true)),
    };

    return result;
};

const firstDate = '09/10/2023';
const secondDate = '29/10/2023';

const result = DisplayAndQuery(firstDate, secondDate);

console.log(result);


/*



# .format()


# .diff()


# .isSameOrAfter()


# .isSameOrBefore()


# .isBetween()




*/