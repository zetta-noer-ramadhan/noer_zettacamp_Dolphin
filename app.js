const moment = require('moment');

const ErrorBuilder = (name, message) => ({
    error_name: name,
    error_message: message,
});

const DisplayAndQuery = (firstDate, secondDate) => {
    const isFirstDateExistAndAString = firstDate && typeof firstDate === 'string';
    const isSecondDateExistAndAString = secondDate && typeof secondDate === 'string';

    if (!isFirstDateExistAndAString || !isSecondDateExistAndAString) {
        return ErrorBuilder('argument', 'bad strings of date argument');
    }

    const isFirstDateValid = moment(firstDate, 'DD/MM/YYYY', true).isValid();
    const isSecondDateValid = moment(secondDate, 'DD/MM/YYYY', true).isValid();

    if (!isFirstDateValid || !isSecondDateValid) {
        return ErrorBuilder('invalid argument', 'invalid strings of date argument');
    }

    return {
        first_date: moment(firstDate, 'DD/MM/YYYY', true).locale('id').format('LLLL'),
        second_date: moment(secondDate, 'DD/MM/YYYY', true).format('LLLL'),
        differences_in_week: moment(firstDate, 'DD/MM/YYYY', true).diff(moment(secondDate, 'DD/MM/YYYY', true), 'week'),
        is_same_or_after: moment(firstDate, 'DD/MM/YYYY', true).isSameOrAfter(moment(secondDate, 'DD/MM/YYYY', true)),
        is_between: moment().isBetween(moment(firstDate, 'DD/MM/YYYY', true), moment(secondDate, 'DD/MM/YYYY', true)),
    };
};

const firstDate = '09/10/2023';
const secondDate = '15/10/2023';

const result = DisplayAndQuery(firstDate, secondDate);

console.log(result);

// console.log(moment().tz('asia/jakarta').locale('id').format('dddd, LL LTS Z z'));

// const date1 = '08/10/2023 15:10:00';
// const date2 = '10/10/2023 15:10:00';
// const current = '09/10/2023 15:10:00'

// const date1Moment = moment(date1, 'DD/MM/YYYY HH:mm:ss');
// const date2Moment = moment(date2, 'DD/MM/YYYY HH:mm:ss');
// const currentMoment = moment(current, 'DD/MM/YYYY HH:mm:ss');

// const date1Format = date1Moment.format('LLLL');
// const date2Format = date2Moment.format('LLLL');
// const currentFormat = currentMoment.format('LLLL');

// console.log(date1Format);
// console.log(currentFormat);
// console.log(date2Format);

// const unit = 'month';
// const isBetweenUnit = currentMoment.isBetween(date1Moment, date2Moment, unit);
// console.log('unit:', unit, 'isBetween:', isBetweenUnit);

/*



# .format() |
- takes string of token and replace them with corresponding value
- return string
- token
- localized format, according to language
- escaping character, [] square bracket
- default format, only display format, not parsing


# .diff() | OK
- to get the difference between moment object in milliseconds
- second argument to get difference in another unit of time
- return number
- truncate to zero decimal
- to get decimal, pass true on third argument
- unit:
-- years, months, weeks, days, hours, minuts, seconds, and singluar form
- if the moment earlier than the moment that passed as argument
-- result value will be negative
- notes!
-- a.difF(b) => a < b
--- a - b < 0
--- b - a > 0


# .isSameOrAfter() | OK
- check if a moment is after or the same as the moment that passed as argument
- return a boolean
- first argument will be parsed as moment, if not already
- default granularity comparison from millisecond
- second argument to limit granularity to other unit
- granularity, detail, only compare equal or larger unit
- unit:
-- year, month, week, isoweek, day, hour, minute, second


# .isSameOrBefore() | OK
- check if a moment is before or the same as the moment that passed as argument
- return a boolean
- first argument will be parsed as moment, if not already
- default granularity comparison from millisecond
- second argument to limit granularity to other unit
- granularity, detail, only compare equal or larger unit
- unit:
-- year, month, week, isoweek, day, hour, minute, second


# .isBetween() | OK
- to check if a moment object is between two moment object that passed as first and second argument
- return boolean
- first and second argument will be parsed as moment, if not already
- argument order is matter, smaller should be first
- exclusive match, lower and upper bound not included
- default granularity comparison from millisecond
- second argument to limit granularity to other unit
- granularity, detail, only compare equal or larger unit
- unit:
-- year, month, week, isoweek, day, hour, minute, second
- inclusivity parameter
-- to include or exclude first and second argument from matching
-- default (), exclude both
-- [] square bracket, include
-- () parenthesis, exclude
-- if used, need to specify both for first and second argument



*/
