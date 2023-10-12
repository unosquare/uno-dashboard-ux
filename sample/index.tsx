import React, { useState } from 'react';
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
    AwaitableMetric,
    BasicToolbar,
    Blur,
    Burger,
    ChartBar,
    DataChart,
    ErrorBoundary,
    Footer,
    MenuContainer,
    MenuSection,
    MenuSubSection,
    Modal,
    NavBar,
    NavBarTitle,
    PieChart,
    SearchBox,
    StyledMenuActions,
    StyledMenuSearchBox,
    Table,
    TableColumn,
    TremorContainer,
    useTheme,
    useToggle,
} from '../src';
import '../src/resources/global.css';
import { anotherDataSet, defaultData } from './data';

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

const onlineColumns: TableColumn[] = [
    { label: 'Id', sortOrder: 1, sortDirection: 'asc', dataType: 'number' },
    { label: 'Title' },
    { label: 'Body' },
];

const calculateFooter = (data: unknown[][]) => ['Total', '', data.length, '', '', '', '', '', ''];

const chartData = [
    { name: 'Group A', Value: 10.15 },
    { name: 'Group B', Value: 20.1 },
    { name: 'Group C', Value: 30.25 },
];

type onlineDto = {
    userId: number;
    id: number;
    title: string;
    body: string;
};

const processOnlineData = (data: onlineDto[]) => data ? data.map((x) => [x.id, x.title, x.body]) : [];

const Application = () => {
    const [currentOption, setCurrentOption] = React.useState<string>(options.A);
    const [openMenu, setOpenMenu] = useToggle();
    const [loading, isLoading] = React.useState(true);
    const [toggle, setToggle] = useToggle(true);
    const [theme, setTheme] = useTheme();
    const [counter, setCounter] = useState(0);
    const [showModal, setShowModal] = useToggle(false);
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
                <Button size='xs' onClick={setShowModal}>
                    Show Modal
                </Button>
            </BasicToolbar>
            <TremorContainer hasToolbar>
                <Grid numItems={3} numItemsSm={1} numItemsMd={2} className='gap-6'>
                    <Card>
                        <Text>Metric 1</Text>
                        <AwaitableMetric>{!loading && '100%'}</AwaitableMetric>
                    </Card>
                    <Card>
                        <Text>Metric 2</Text>
                        <AwaitableMetric>{!loading && '100%'}</AwaitableMetric>
                    </Card>
                    <Card>
                        <Text>Metric 3</Text>
                        <AwaitableMetric>{!loading && '100%'}</AwaitableMetric>
                    </Card>
                    <Card>
                        <DataChart
                            rawData={loading ? undefined : chartData}
                            dataCallback={identity}
                            legend
                            className='mt-5'
                            legendFormatType='percentage'
                            tooltip='tremor'
                            onClick={console.log}
                        />
                    </Card>
                    <Card>
                        <Text className='font-medium'>Bar Chart</Text>
                        <ChartBar
                            className='mt-5'
                            rawData={loading ? undefined : chartData}
                            dataCallback={identity}
                            legendFormatType='percentage'
                            legend
                            tooltip='tremor'
                            onClick={barClick}
                        />
                    </Card>
                    <Card className='h-96'>
                        <Text className='font-medium'>Pie Chart</Text>
                        <PieChart
                            rawData={loading ? undefined : chartData}
                            dataCallback={(d) => Object.values(d).map((x: any) => ({ name: x.name, value: x.Value }))}
                            legendFormatType='money'
                        />
                    </Card>
                    <Col numColSpan={3}>
                        <Card>
                            <Table
                                className='h-72'
                                columns={columns}
                                rawData={toggle ? defaultData : anotherDataSet}
                                dataCallback={identity}
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
                                dataCallback={processOnlineData}
                            >
                                <Title className='w-full'>Online Data</Title>
                            </Table>
                        </Card>
                    </Col>
                </Grid>
            </TremorContainer>
            {showModal && (
                <Modal onClose={setShowModal}>
                    <Table
                        className='h-72'
                        columns={columns}
                        rawData={defaultData}
                        dataCallback={identity}
                        searchable
                    >
                        <Title className='w-full'>Modal Table</Title>
                    </Table>
                </Modal>
            )}
            <Footer />
        </ErrorBoundary>
    );
};

const container = document.getElementById('root');
const root = createRoot(container as any);

root.render(
    <React.StrictMode>
        <Application />
    </React.StrictMode>,
);
