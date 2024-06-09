import { ReactSelectOption } from '../src/constants';

const USD = 'USD';

export const defaultData = [
    [
        'Pepe',
        'Mexico',
        new Date('2022-01-01'),
        50,
        1,
        1000,
        10.25,
        { Amount: 300.33, Currency: USD },
        true,
        'https://www.google.com',
        'Small text',
    ],
    [
        'Pepe',
        'LA',
        new Date('2022-01-02'),
        30,
        25,
        null,
        10 / 3,
        { Amount: 300.33, Currency: USD },
        true,
        '',
        'Small text',
    ],
    [
        'Juan',
        'Chicago',
        new Date('2022-01-03'),
        30,
        30,
        200,
        55.25,
        { Amount: 300.33, Currency: USD },
        true,
        ['https://www.google.com', 'Google'],
        'Small text',
    ],
    [
        'Juan',
        'Oaxaca',
        new Date('2022-01-04'),
        35,
        50,
        null,
        0.05,
        { Amount: 300.33, Currency: USD },
        false,
        ['https://www.unosquare.com', 'Unosquare'],
        'Small text',
    ],
    [
        'Maria',
        'NY',
        new Date('2022-01-05'),
        60,
        40,
        0,
        0.55,
        { Amount: 300.33, Currency: USD },
        false,
        '',
        'Small text',
    ],
    [
        'Laura',
        'Guadalajara',
        new Date('2022-01-06'),
        25,
        45,
        100,
        25,
        { Amount: 300.33, Currency: USD },
        true,
        'https://www.unosquare.com',
        'Small text',
    ],
    [
        'Laura',
        'Mexico',
        new Date('2022-01-07'),
        25,
        50,
        100,
        0.125,
        { Amount: 300.33, Currency: USD },
        true,
        'https://www.google.com',
        'Small text',
    ],
    [
        'Juan',
        'Oaxaca',
        new Date('2022-01-08'),
        25,
        30,
        null,
        0.75,
        { Amount: 300.33, Currency: USD },
        true,
        'https://www.google.com',
        'This is a very long text that is going to repeat itself until we get more than 500 characters just to test the new data type.\r\n\r\nThis is a very long text that is going to repeat itself until we get more than 500 characters just to test the new data type.\r\nThis is a very long text that is going to repeat itself until we get more than 500 characters just to test the new data type. This is a very long text that is going to repeat itself until we get more than 500 characters just to test the new data type. This is a very long text that is going to repeat itself until we get more than 500 characters just to test the new data type',
    ],
];

export const anotherDataSet = [
    [['https://www.google.com', 'Abasolo'], 'Oaxaca', new Date('2022-01-08')],
    [['https://www.google.com', 'Pepe'], 'Mexico', new Date('2023-01-08')],
    ['https://www.unosquare.com', 'Mexico', new Date('2022-01-01')],
];

export const getLargeSelectOptions = () => {
    const options: ReactSelectOption[] = [];
    for (let i = 0; i < 1000; i++) {
        options.push({ label: `Option ${i}`, value: i });
    }
    return options;
};
