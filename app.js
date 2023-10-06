const moment = require('moment');

const ErrorBuilder = (name, message) => ({
    error_name: name,
    error_message: message,
});

const DateManipulation = (date) => {
    if (!date || typeof date !== 'string') {
        return ErrorBuilder('parameter', 'bad string of date parameter');
    }

    const dateTimeFromString = moment(date, 'DD/MM/YYYY', true);

    if (!dateTimeFromString.isValid()) {
        return ErrorBuilder('parameter validation', 'string of date parameter is invalid');
    }

    dateTimeFromString.locale('id');
    const outputFormat = 'LL LTS';

    const resultData = {
        date_time: dateTimeFromString.format(outputFormat),
        date_time_plus_two_hours: dateTimeFromString.clone().add(2, 'hours').format(outputFormat),
        after1: dateTimeFromString.format(outputFormat),
        date_time_plus_five_days: dateTimeFromString.clone().add(5, 'days').format(outputFormat),
        after2: dateTimeFromString.format(outputFormat),
        date_time_plus_one_week: dateTimeFromString.clone().add(1, 'week').format(outputFormat),
        after3: dateTimeFromString.format(outputFormat),
        date_time_minus_five_days: dateTimeFromString.clone().subtract(5, 'days').format(outputFormat),
        after4: dateTimeFromString.format(outputFormat),
        date_time_start_of_week: dateTimeFromString.clone().startOf('week').format(outputFormat),
        after5: dateTimeFromString.format(outputFormat),
        date_time_end_of_month: dateTimeFromString.clone().endOf('month').format(outputFormat),
        after6: dateTimeFromString.format(outputFormat),
    };

    return resultData;
};

const date = '02/10/2023';

console.log(DateManipulation(date));

/*

# note:
- start of week is sunday not monday
- end of week is saturday not sunday

# TODO: .add():
- mutate original moment
- set the value of original moment by adding it with specified amount and unit time
- no upperlimit, it means we can use amount no matter how big it is
- duration can be used as input value
- can set multiple value with chaining and object literal
- can be chained wihth another add or substract
- unit: year, month, quarter, week, day, hour, minute, second, millisecond

# TODO: .substract():
- mutate original moment
- set the value of original moment by substracting it with specified amount and unit time
- duration can be used as input value
- can set multiple value with chaining and object literal
- can be chained with another substract or add
- unit: year, month, quarter, week, day, hour, minute, second, millisecond

# TODO: .startOf():
- mutate original moment
- set the value of original moment to the start of specified unit time
- unit: year, month, quarter, week, isoweek, day, date, hour, minute, second

# TODO: .endOf():
- mutate original moment
- set the value of original moment to the end of specified unit time
- unit: year, month, quarter, week, isoweek, day, date, hour, minute, second

*/
