import { ReactSelectOption } from '../src/VirtualSelect';

export const defaultData = [
    ['Pepe', 'Mexico', new Date('2022-01-01'), 50, 1, 1000, 10.25, true, 'https://www.google.com', 'Small text'],
    ['Pepe', 'LA', new Date('2022-01-02'), 30, 25, null, 10 / 3, true, '', 'Small text'],
    [
        'Juan',
        'Chicago',
        new Date('2022-01-03'),
        30,
        30,
        200,
        55.25,
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
        false,
        ['https://www.google.com', 'Google'],
        'Small text',
    ],
    ['Maria', 'NY', new Date('2022-01-05'), 60, 40, 0, 0.55, false, '', 'Small text'],
    ['Laura', 'Guadalajara', new Date('2022-01-06'), 25, 45, 100, 25, true, 'https://www.google.com', 'Small text'],
    ['Laura', 'Mexico', new Date('2022-01-07'), 25, 50, 100, 0.125, true, 'https://www.google.com', 'Small text'],
    [
        'Juan',
        'Oaxaca',
        new Date('2022-01-08'),
        25,
        30,
        null,
        0.75,
        true,
        'https://www.google.com',
        'This is a very long text that is going to repeat itself until we get more than 500 characters just to test the new data type.\r\n\r\nThis is a very long text that is going to repeat itself until we get more than 500 characters just to test the new data type.\r\nThis is a very long text that is going to repeat itself until we get more than 500 characters just to test the new data type. This is a very long text that is going to repeat itself until we get more than 500 characters just to test the new data type. This is a very long text that is going to repeat itself until we get more than 500 characters just to test the new data type',
    ],
];

export const anotherDataSet = [
    [
        'Juan',
        'Oaxaca',
        new Date('2022-01-08'),
    ],
    [
        'Pepe',
        'Mexico',
        new Date('2022-01-01'),
    ]
];

export const getLargeSelectOptions = () => {
    const options: ReactSelectOption[] = [];
    for (let i = 0; i < 1000; i++) {
        options.push({ label: `Option ${i}`, value: i });
    }
    return options;
}
