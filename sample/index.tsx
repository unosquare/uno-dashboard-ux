import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
    ArrowSync24Regular,
    Dismiss24Regular,
    WeatherMoon24Regular,
    WeatherSunny24Regular,
} from '@fluentui/react-icons';
import { Button, Card, Col, Flex, Grid, Select, SelectItem, Text, Title } from '@tremor/react';
import {
    Alert,
    AwaitableMetric,
    BasicToolbar,
    Blur,
    Burger,
    ChartBar,
    ComposedLineChart,
    DataChart,
    ErrorBoundary,
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
    TableCell,
    TremorContainer,
    VirtualSelect,
    useTheme,
    useAlertStore,
    useToggle,
    ChartFunnel,
} from '../src';
import '../src/resources/global.css';
import { anotherDataSet, defaultData, getLargeSelectOptions } from './data';

export enum options {
    A = 'Apple',
    B = 'Bolt',
    C = 'Cactus',
    D = 'Dragon',
}

const columns: TableColumn[] = [
    { label: 'Name', sortOrder: 1, sortDirection: 'asc' },
    { label: 'City', disableSearch: true, excludeFromSort: true, textAlign: 'left' },
    { label: 'Date', dataType: 'date' },
    { label: 'Age', dataType: 'days', sortOrder: 2, sortDirection: 'desc' },
    { label: 'Units', dataType: 'number', textAlign: 'center' },
    { label: 'Balance', dataType: 'money' },
    { label: 'Margin', dataType: 'percentage', formatterOptions: { decimals: 1 } },
    { label: 'Like Ice cream', dataType: 'boolean' },
    { label: 'Profile', dataType: 'link' },
    { label: 'Long text', dataType: 'paragraph' },
];

const extraColumns: TableColumn[] = [
    { label: 'Name', sortOrder: 1, sortDirection: 'asc' },
    { label: 'City', disableSearch: true, excludeFromSort: true, textAlign: 'left' },
    { label: 'Date', dataType: 'date' },
];

const onlineColumns: TableColumn[] = [
    { label: 'User Id' },
    { label: 'Id', sortOrder: 1, sortDirection: 'asc', dataType: 'number' },
    {
        label: 'Title', render: (column, { columnIndex, rowIndex }, data, rawData) =>
        (<TableCell column={column} index={columnIndex} className='bg-gray-100'>
            {rawData && <a href={`https://jsonplaceholder.typicode.com/posts/${rawData[rowIndex].id}`}>{String(data)}</a>}
        </TableCell>
        )
    },
    { label: 'Body' },
];

const calculateFooter = (data: unknown[][]) => ['Total', '', String(data.length), '', '', '', '', '', '', ''];

const chartData = [
    { name: 'Group A', Value: 10.15 },
    { name: 'Group B', Value: 20.1 },
    { name: 'Group C', Value: 30.25 },
];

const chartBarData = [
    { name: 'Group A', Value: 10.15, Value2: 5, Value3: 7 },
    { name: 'Group B', Value: 20.1, Value2: 3, Value3: 15 },
    { name: 'Group C', Value: 30.25, Value2: 6, Value3: 25 },
];

type onlineDto = {
    userId: number;
    id: number;
    title: string;
    body: string;
};

const Application = () => {
    const setAlert = useAlertStore(st => st.setAlert);
    const [currentOption, setCurrentOption] = React.useState<string>(options.A);
    const [virtualSelectOption, setVirtualSelectOption] = React.useState<string>(0);
    const [openMenu, setOpenMenu] = useToggle();
    const [loading, isLoading] = React.useState(true);
    const [toggle, setToggle] = useToggle(true);
    const [theme, setTheme] = useTheme();
    const [counter, setCounter] = useState(0);
    const [onlineData, setOnlineData] = useState<onlineDto[]>();

    React.useEffect(() => {
        setTimeout(() => {
            isLoading(false);
            fetch('https://jsonplaceholder.typicode.com/posts').then(r => r.json()).then(setOnlineData);
        }, 2000);
    }, []);

    const onToggleMenu = () => {
        const body = document.getElementById('body');
        if (body) body.style.overflow = openMenu ? 'auto' : 'hidden';
        setOpenMenu();
    };

    const updateTheme = () => {
        setTheme();
        onToggleMenu();
    };

    const barClick = (ev: string) => {
        console.log(ev);
        setCounter((x) => x + 1);
    };

    return (
        <ErrorBoundary>
            <Alert />
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
                                    onClick={setOpenMenu}
                                    className='text-tremor-content dark:text-dark-tremor-content'
                                />
                            </StyledMenuActions>
                            <Flex justifyContent='between' alignItems='center' className='gap-4'>
                                <Text>Options</Text>
                                <Select enableClear={false} value={currentOption} onValueChange={setCurrentOption}>
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
                <Text>This is a toolbar: {counter}</Text>
                <Button size='xs' onClick={setToggle}>
                    Toggle Data
                </Button>
                <Button size='xs' onClick={() => setAlert(true)}>Success</Button>
                <Button size='xs' onClick={() => setAlert(false, 'Error', false)}>Error</Button>
                <VirtualSelect
                    value={virtualSelectOption}
                    onValueChange={setVirtualSelectOption}
                    options={getLargeSelectOptions()}
                    className='w-60'
                    enableClear
                />
            </BasicToolbar>
            <TremorContainer hasToolbar>
                <Grid numItems={3} numItemsSm={1} numItemsMd={2} className='gap-6'>
                    <Card>
                        <Text>Metric 1</Text>
                        <AwaitableMetric>{!loading ? '100%' : undefined}</AwaitableMetric>
                    </Card>
                    <Card>
                        <ChartFunnel
                            rawData={loading ? undefined : chartData}
                            dataCallback={(d) => Object.values(d).map((x: any) => ({ name: x.name, value: x.Value }))}
                            calculateSizes={{ sizes: ['w-[90%]', 'w-[80%]', 'w-[30%]'], orderedValues: [10.15, 20.1, 30.25] }}
                            formatType='number'
                        />
                    </Card>
                    <Card>
                        <PieChart
                            rawData={loading ? undefined : chartData}
                            dataCallback={(d) => Object.values(d).map((x: any) => ({ name: x.name, value: x.Value }))}
                            legendFormatType='money'
                        />
                    </Card>
                    <Card>
                        <Text className='font-medium'>Line Chart</Text>
                        <DataChart
                            rawData={loading ? undefined : (toggle ? chartData : [])}
                            legend
                            className='mt-5'
                            legendFormatType='percentage'
                            onClick={console.log}
                        />
                    </Card>
                    <Card>
                        <Text className='font-medium'>Bar Chart</Text>
                        <ChartBar
                            className='mt-5'
                            refLineY={{ value: 20, label: 'Ref Line', color: 'red' }}
                            rawData={loading ? undefined : (toggle ? chartData : chartBarData)}
                            legendFormatType='percentage'
                            legend
                            onClick={barClick}
                        />
                    </Card>
                    <Card>
                        <Text className='font-medium'>Composited Chart</Text>
                        <ComposedLineChart 
                            rawData={loading ? undefined : chartBarData}
                            legendFormatTypes={{ left: 'percentage', right: 'money' }}
                            bars={[{ dataKey: 'Value3', yAxisId: 'left' }]}
                            lines={[{ dataKey: 'Value', yAxisId: 'left' }, { dataKey: 'Value2', yAxisId: 'right' }]} 
                        />
                    </Card>
                    <Col numColSpan={3}>
                        <Card>
                            <Table
                                className='h-72'
                                columns={toggle ? columns : extraColumns}
                                rawData={toggle ? defaultData : anotherDataSet}
                                searchable
                                sortable
                                exportCsv
                                calculateFooter={calculateFooter}
                            >
                                <Title className='w-full'>Data Table</Title>
                            </Table>
                        </Card>
                    </Col>
                    <Col numColSpan={3}>
                        <Card>
                            <Table
                                columns={onlineColumns}
                                rawData={onlineData}
                            >
                                <Title className='w-full'>Online Data</Title>
                            </Table>
                        </Card>
                    </Col>
                </Grid>
            </TremorContainer>
            <Footer />
        </ErrorBoundary>
    );
};

const root = createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <Application />
    </React.StrictMode>,
);
