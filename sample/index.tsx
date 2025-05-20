import { ArrowSync24Regular, Dismiss24Regular } from '@fluentui/react-icons';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
    Alert,
    AwaitableMetric,
    BasicToolbar,
    Blur,
    Burger,
    Button,
    Card,
    Col,
    ChartBar,
    ChartBarV2,
    ChartFunnel,
    ComposedLineChart,
    DataChart,
    Dialog,
    DialogPanel,
    DialogHeader,
    ErrorBoundary,
    Flex,
    Footer,
    Grid,
    InfoDialog,
    InfoDialogTitle,
    MenuContainer,
    MenuSection,
    MenuSubSection,
    NavBar,
    NavBarTitle,
    PieChart,
    SearchBox,
    StyledMenuActions,
    StyledMenuSearchBox,
    ThemeSwitcher,
    UnoContainer,
    Select,
    SelectItem,
    VirtualSelect,
    useAlertStore,
    useToggle,
    Text,
    DateRangePicker,
    Badge,
    Legend,
    BadgeDelta,
    PieChartV2,
    DataChartV2,
} from '../src';
import '../src/resources/global.css';
import FormSample from './FormSample';
import OnlineTable from './OnlineTable';
import ReadOnlyFormSample from './ReadOnlyFormSample';
import RegularTable from './RegularTable';
import YearSelectorSample from './YearSelectorSample';
import { getLargeSelectOptions } from './data';

export enum options {
    A = 'Apple',
    B = 'Bolt',
    C = 'Cactus',
    D = 'Dragon',
}

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

const Application = () => {
    const setAlert = useAlertStore((st) => st.setAlert);
    const [currentOption, setCurrentOption] = React.useState<string>(options.A);
    const [virtualSelectOption, setVirtualSelectOption] = React.useState<string>('0');
    const [openMenu, setOpenMenu] = useToggle();
    const [loading, isLoading] = React.useState(true);
    const [modalOpen, setModalOpen] = useToggle(false);
    const [toggle, setToggle] = useToggle(true);
    const [counter, setCounter] = useState(0);

    React.useEffect(() => {
        setTimeout(() => {
            isLoading(false);
        }, 2000);
    }, []);

    const onToggleMenu = () => {
        const body = document.getElementById('body');
        if (body) body.style.overflow = openMenu ? 'auto' : 'hidden';
        setOpenMenu();
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
                                <ArrowSync24Regular className='text-unodashboard-content dark:text-dark-unodashboard-content' />
                                <ThemeSwitcher />
                                <Dismiss24Regular
                                    onClick={setOpenMenu}
                                    className='text-unodashboard-content dark:text-dark-unodashboard-content'
                                />
                            </StyledMenuActions>
                            <YearSelectorSample />
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
                <Button size='xs' onClick={setToggle} variant='light'>
                    Toggle Data
                </Button>
                <Button size='xs' onClick={() => setAlert(true)}>
                    Success
                </Button>
                <Button size='xs' onClick={() => setAlert(false, 'Error', false)}>
                    Error
                </Button>
                <Button size='xs' onClick={setModalOpen} variant='secondary'>
                    Modal
                </Button>
                <Dialog open={modalOpen} onClose={setModalOpen}>
                    <DialogPanel className='max-w-3xl h-[600px]'>
                        <DialogHeader closeModal={setModalOpen}>Notice me</DialogHeader>
                        Hello
                    </DialogPanel>
                </Dialog>
                <InfoDialog>
                    <InfoDialogTitle>What is this Report about</InfoDialogTitle>
                    <Text>About something</Text>
                </InfoDialog>
                <VirtualSelect
                    value={virtualSelectOption}
                    onValueChange={setVirtualSelectOption}
                    options={getLargeSelectOptions()}
                    className='w-60'
                    enableClear
                />
                <DateRangePicker />
            </BasicToolbar>
            <UnoContainer hasToolbar>
                <Grid numItems={3} numItemsSm={1} numItemsMd={2} className='gap-6'>
                    <Card decoration='top' decorationColor='blue'>
                        <Text>Metric 1</Text>
                        <AwaitableMetric>{!loading ? '100%' : undefined}</AwaitableMetric>
                        <Flex>
                            <Text>Previous: </Text>
                            <Badge color='blue' size='sm'>
                                10%
                            </Badge>
                            <BadgeDelta>
                                +10%
                            </BadgeDelta>
                        </Flex>
                    </Card>
                    <Card>
                        <ChartFunnel
                            rawData={loading ? undefined : chartData}
                            dataCallback={(d) => Object.values(d).map((x) => ({ name: x.name, value: x.Value }))}
                            calculateSizes={{
                                sizes: ['w-[90%]', 'w-[80%]', 'w-[30%]'],
                                orderedValues: [10.15, 20.1, 30.25],
                            }}
                            formatType='number'
                        />
                    </Card>
                    <Card>
                        <Legend className='mb-6' categories={Object.values(chartData).map(x => x.name)} />
                        <PieChart
                            rawData={loading ? undefined : chartData}
                            dataCallback={(d) => Object.values(d).map((x) => ({ name: x.name, value: x.Value }))}
                            legendFormatType='money'
                            serieName='Moneys'
                        />
                    </Card>
                    <Card>
                        <Legend className='mb-6' categories={Object.values(chartData).map(x => x.name)} />
                        <PieChartV2
                            rawData={loading ? undefined : chartData}
                            dataCallback={(d) => Object.values(d).map((x) => ({ name: x.name, value: x.Value }))}
                        />
                    </Card>
                    <Card>
                        <Text className='font-medium'>Line Chart</Text>
                        <DataChart
                            rawData={loading ? undefined : toggle ? chartData : []}
                            legend
                            className='mt-5'
                            legendFormatType='percentage'
                            onClick={console.log}
                        />
                    </Card>
                    <Card>
                        <Text className='font-medium'>Line Chart V2</Text>
                        <DataChartV2
                            rawData={loading ? undefined : toggle ? chartData : []}
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
                            rawData={loading ? undefined : toggle ? chartData : chartBarData}
                            legendFormatType='decimal'
                            legend
                            onClick={barClick}
                        />
                    </Card>
                    <Card>
                        <Text className='font-medium'>Bar Chart V2</Text>
                        <ChartBarV2
                            className='mt-5'
                            refLineY={{ value: 20, label: 'Ref Line', color: 'red' }}
                            rawData={loading ? undefined : toggle ? chartData : chartBarData}
                            onClick={barClick} 
                            layout={'horizontal'}                       
                        />
                    </Card>
                    <Card>
                        <Text className='font-medium'>Composited Chart</Text>
                        <ComposedLineChart
                            rawData={loading ? undefined : chartBarData}
                            legendFormatTypes={{ left: 'percentage', right: 'money' }}
                            bars={[{ dataKey: 'Value3', yAxisId: 'left' }]}
                            lines={[
                                { dataKey: 'Value', yAxisId: 'left' },
                                { dataKey: 'Value2', yAxisId: 'right' },
                            ]}
                        />
                    </Card>
                    <Col numColSpan={3}>
                        <Card>
                            <RegularTable toggle={toggle} />
                        </Card>
                    </Col>
                    <Col numColSpan={3}>
                        <Card>
                            <OnlineTable />
                        </Card>
                    </Col>
                    <Col numColSpan={3}>
                        <Card>
                            <FormSample />
                        </Card>
                    </Col>
                    <Col numColSpan={3}>
                        <Card>
                            <ReadOnlyFormSample />
                        </Card>
                    </Col>
                </Grid>
            </UnoContainer>
            <Footer />
        </ErrorBoundary>
    );
};

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Application />
    </React.StrictMode>,
);
