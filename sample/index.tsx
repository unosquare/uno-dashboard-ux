import React from 'react';
import { createRoot } from 'react-dom/client';
import { identity } from 'uno-js';
import {
    ArrowSync24Regular,
    Dismiss24Regular,
    WeatherMoon24Regular,
    WeatherSunny24Regular,
} from '@fluentui/react-icons';
import { Button, Card, Col, Flex, Grid, Select, SelectItem, Text, Title } from '@tremor/react';
import {
    BasicToolbar,
    Blur,
    Burger,
    ChartBar,
    DataChart,
    Footer,
    MenuContainer,
    MenuSection,
    MenuSubSection,
    NavBar,
    NavBarTitle,
    PieChart,
    SearchBox,
    StyledMenuActions,
    StyledMenuSearchBox,
    Table,
    TableColumn,
    TremorContainer,
} from '../src';
import '../src/resources/global.css';

export enum options {
    A = 'Apple',
    B = 'Bolt',
    C = 'Cactus',
    D = 'Dragon',
}

const columns = [
    { label: 'Name', sortOrder: 1, sortDirection: 'asc' },
    { label: 'City', disableSearch: true, excludeFromSort: true },
    { label: 'Date', dataType: 'date' },
    { label: 'Age', dataType: 'days', sortOrder: 2, sortDirection: 'desc' },
    { label: 'Balance', dataType: 'money' },
    { label: 'Margin', dataType: 'percentage', formatterOptions: { decimals: 1 } },
    { label: 'Like Ice cream', dataType: 'boolean' },
    { label: 'Profile', dataType: 'link' },
    { label: 'Long text', dataType: 'paragraph' },
] as TableColumn[];

const defaultData = [
    ['Pepe', 'Mexico', new Date('2022-01-01'), 1, 1000, 10.25, true, 'https://www.google.com', 'Small text'],
    ['Pepe', 'LA', new Date('2022-01-02'), 25, null, 10 / 3, true, '', 'Small text'],
    [
        'Juan',
        'Chicago',
        new Date('2022-01-03'),
        30,
        200,
        55.25,
        true,
        ['https://www.google.com', 'Google', '(after)'],
        'Small text',
    ],
    [
        'Juan',
        'Oaxaca',
        new Date('2022-01-04'),
        35,
        null,
        0.05,
        false,
        ['https://www.google.com', '(Google)', 'before', 0.25, true],
        'Small text',
    ],
    ['Maria', 'NY', new Date('2022-01-05'), 40, 0, 0.55, false, '', 'Small text'],
    ['Laura', 'Guadalajara', new Date('2022-01-06'), 45, 100, 25, true, 'https://www.google.com', 'Small text'],
    ['Laura', 'Mexico', new Date('2022-01-07'), 50, 100, 0.125, true, 'https://www.google.com', 'Small text'],
    [
        'Juan',
        'Oaxaca',
        new Date('2022-01-08'),
        30,
        null,
        0.75,
        true,
        'https://www.google.com',
        'This is a very long text that is going to repeat itself until we get more than 500 characters just to test the new data type. This is a very long text that is going to repeat itself until we get more than 500 characters just to test the new data type. This is a very long text that is going to repeat itself until we get more than 500 characters just to test the new data type. This is a very long text that is going to repeat itself until we get more than 500 characters just to test the new data type. This is a very long text that is going to repeat itself until we get more than 500 characters just to test the new data type',
    ],
];

const anotherDataSet = [
    [
        'Juan',
        'Oaxaca',
        new Date('2022-01-08'),
        30,
        null,
        0.75,
        true,
        'https://www.google.com',
        'This is a very long text that is going to repeat itself until we get more than 500 characters just to test the new data type. This is a very long text that is going to repeat itself until we get more than 500 characters just to test the new data type. This is a very long text that is going to repeat itself until we get more than 500 characters just to test the new data type. This is a very long text that is going to repeat itself until we get more than 500 characters just to test the new data type. This is a very long text that is going to repeat itself until we get more than 500 characters just to test the new data type',
    ],
];

const calculateFooter = (data: unknown[][]) => ['Total', '', data.length, '', '', '', '', '', ''];

const chartData = [
    { name: 'Group A', value: 10.15 },
    { name: 'Group B', value: 20.1 },
    { name: 'Group C', value: 30.25 },
];

const Application = () => {
    const [currentOption, setCurrentOption] = React.useState<string>(options.A);
    const [openMenu, setOpenMenu] = React.useState(false);
    const [loading, isLoading] = React.useState(true);
    const [toggle, setToggle] = React.useState(true);
    const [theme, setTheme] = React.useState(localStorage.getItem('theme') ?? 'light');

    React.useEffect(() => {
        const body = document.getElementById('body');
        if (body && theme === 'dark') body.classList.add('dark');

        setTimeout(() => isLoading(false), 2000);
    }, []);

    const onToggleMenu = () => {
        const body = document.getElementById('body');
        if (body) body.style.overflow = openMenu ? 'auto' : 'hidden';
        setOpenMenu(!openMenu);
    };

    const updateTheme = () => {
        const body = document.getElementById('body');
        if (body) {
            const themeToggle = body.classList.toggle('dark');
            const value = themeToggle ? 'dark' : 'light';
            setTheme(value);
            localStorage.setItem('theme', value);
        }
    };

    return (
        <>
            <NavBar>
                <NavBarTitle>
                    <h2>Sample App</h2>
                    <Burger onClick={onToggleMenu} aria-hidden='true' />
                </NavBarTitle>
                {openMenu && (
                    <>
                        <MenuContainer>
                            <StyledMenuActions>
                                <ArrowSync24Regular className='text-tremor-content dark:text-dark-tremor-content' />
                                {theme === 'light' ? (
                                    <WeatherMoon24Regular
                                        onClick={updateTheme}
                                        className='text-tremor-content dark:text-dark-tremor-content'
                                    />
                                ) : (
                                    <WeatherSunny24Regular
                                        onClick={updateTheme}
                                        className='text-tremor-content dark:text-dark-tremor-content'
                                    />
                                )}
                                <Dismiss24Regular
                                    onClick={() => setOpenMenu(false)}
                                    className='text-tremor-content dark:text-dark-tremor-content'
                                />
                            </StyledMenuActions>
                            <Flex justifyContent='between' alignItems='center' className='gap-4'>
                                <Text>Options</Text>
                                <Select value={currentOption} onValueChange={setCurrentOption}>
                                    <SelectItem value={options.A}>Apple</SelectItem>
                                    <SelectItem value={options.B}>Bolt</SelectItem>
                                    <SelectItem value={options.C}>Cactus</SelectItem>
                                </Select>
                            </Flex>
                            <StyledMenuSearchBox>
                                <SearchBox focus search={console.log} />
                            </StyledMenuSearchBox>
                            <MenuSection>
                                <h6>This is a Section</h6>
                            </MenuSection>
                            <MenuSubSection>
                                <span>This is a Subsection</span>
                            </MenuSubSection>
                        </MenuContainer>
                        <Blur onClick={onToggleMenu} />
                    </>
                )}
            </NavBar>
            <BasicToolbar>
                <Text>This is a toolbar</Text>
                <Button size='xs' onClick={() => setToggle(!toggle)}>
                    Click
                </Button>
            </BasicToolbar>
            <TremorContainer hasToolbar>
                <Grid numItems={3} numItemsSm={1} numItemsMd={2} className='gap-6'>
                    <Card>
                        <DataChart
                            rawData={chartData}
                            dataCallback={identity}
                            legend
                            className='mt-5'
                            legendFormatType='percentage'
                        />
                    </Card>
                    <Card>
                        <Text className='font-medium'>Bar Chart</Text>
                        <ChartBar
                            className='mt-5'
                            rawData={chartData}
                            dataCallback={identity}
                            isLoading={loading}
                            legendFormatType='percentage'
                            legend
                        />
                    </Card>
                    <Card className='h-96'>
                        <Text className='font-medium'>Pie Chart</Text>
                        <PieChart rawData={chartData} dataCallback={identity} legendFormatType='money' />
                    </Card>
                    <Col numColSpan={3}>
                        <Card>
                            <Table
                                className='h-72'
                                columns={columns}
                                rawData={toggle ? defaultData : anotherDataSet}
                                dataCallback={identity}
                                isLoading={loading}
                                searchable
                                sortable
                                exportCsv
                                calculateFooter={calculateFooter}
                            >
                                <Title className='w-full'>Data Table</Title>
                            </Table>
                        </Card>
                    </Col>
                </Grid>
            </TremorContainer>
            <Footer />
        </>
    );
};

const container = document.getElementById('root');
const root = createRoot(container as any);

root.render(
    <React.StrictMode>
        <Application />
    </React.StrictMode>,
);
