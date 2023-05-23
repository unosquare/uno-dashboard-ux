import React from 'react';
import { createRoot } from 'react-dom/client';
import { identity } from 'uno-js';
import { ArrowSync24Regular, Dismiss24Regular } from '@fluentui/react-icons';
import {
    Badge,
    BasicToolbar,
    Blur,
    Burger,
    ChartBar,
    Circle,
    DataChart,
    DataTypes,
    Footer,
    LegendFormatTypes,
    MenuContainer,
    MenuSection,
    MenuSubSection,
    NavBar,
    NavBarTitle,
    PieChart,
    SortDirection,
    Table,
    Title,
    DropdownMenu,
    StyledMenuSearchBox,
    SearchBox,
    MenuSection,
    MenuSubSection,
    StyledMenuActions,
    TremorContainer,
} from '../src';
import '../src/resources/global.css';
import {
    Text,
    Metric,
    Grid,
    Card as TremorCard,
    Col,
    Flex,
    BadgeDelta,
    AreaChart,
    CategoryBar,
    Legend,
    LineChart,
} from '@tremor/react';

export enum options {
    A = 'Apple',
    B = 'Bolt',
    C = 'Cactus',
    D = 'Dragon',
}

const columns = [
    { label: 'Name', sortOrder: 1, sortDirection: SortDirection.ASC },
    { label: 'City', disableSearch: true, excludeFromSort: true },
    { label: 'Age', dataType: DataTypes.DAYS, sortOrder: 2, sortDirection: SortDirection.DESC },
    { label: 'Like Ice cream', dataType: DataTypes.BOOLEAN },
    { label: 'Profile', dataType: DataTypes.LINK_ICON },
    { label: 'Long text', dataType: DataTypes.PARAGRAPH },
];

const defaultData = [
    ['Pepe', 'Mexico', 20, true, 'https://www.google.com', 'Small text'],
    ['Pepe', 'LA', 25, true, '', 'Small text'],
    ['Juan', 'Chicago', 30, true, 'https://www.google.com', 'Small text'],
    ['Juan', 'Oaxaca', 35, false, 'https://www.google.com', 'Small text'],
    ['Maria', 'NY', 40, false, '', 'Small text'],
    ['Laura', 'Guadalajara', 45, true, 'https://www.google.com', 'Small text'],
    ['Laura', 'Mexico', 50, true, 'https://www.google.com', 'Small text'],
    [
        'Brian',
        'Guasave',
        30,
        true,
        'https://www.google.com',
        'This is a very long text that is going to repeat itself until we get more than 500 characters just to test the new data type. This is a very long text that is going to repeat itself until we get more than 500 characters just to test the new data type. This is a very long text that is going to repeat itself until we get more than 500 characters just to test the new data type. This is a very long text that is going to repeat itself until we get more than 500 characters just to test the new data type. This is a very long text that is going to repeat itself until we get more than 500 characters just to test the new data type',
    ],
];

const calculateFooter = (data: any[]) => ['Total', '', data.length, '', '', ''];

const chartData = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
];

const dataFormatter = (number: number) => Intl.NumberFormat('us').format(number).toString();

const Application = () => {
    const [currentOption, setCurrentOption] = React.useState(options.A);
    const [value, setValue] = React.useState(false);
    const [openMenu, setOpenMenu] = React.useState(false);
    const [data, setData] = React.useState(defaultData);
    const [circleValue, setCircleValue] = React.useState(1234);

    const toggle = () => {
        setValue(!value);
        setData(value ? defaultData : []);
    };

    const onToggleMenu = () => {
        const body = document.getElementById('body');
        if (body) body.style.overflow = openMenu ? 'auto' : 'hidden';
        setOpenMenu(!openMenu);
    };

    const CircleClicked = () => setCircleValue(circleValue + 1);

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
                                <ArrowSync24Regular />
                                <Dismiss24Regular onClick={() => setOpenMenu(false)} />
                            </StyledMenuActions>
                            <DropdownMenu
                                options={options}
                                value={currentOption}
                                label='Options'
                                onOptionClicked={setCurrentOption}
                            />
                            <StyledMenuSearchBox>
                                <SearchBox focus search={(v) => console.log(v)} />
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
                <span>This is a toolbar</span>
                <Button onClick={() => console.log('destroying all...')}>
                    Never click here (it will destroy everything)
                </Button>
            </BasicToolbar>
            <TremorContainer>
                <Grid numCols={3} className='mt-6 gap-6'>
                    <TremorCard>
                        <Flex alignItems='start'>
                            <Text>Total Rows</Text>
                            <BadgeDelta deltaType={'increase'}>{50}</BadgeDelta>
                        </Flex>
                        <Flex justifyContent='start' alignItems='baseline' className='truncate space-x-3'>
                            <Metric>1234</Metric>
                            <Text className='truncate'>from 2000</Text>
                        </Flex>
                    </TremorCard>
                    <TremorCard>
                        <Text>Goal</Text>
                        <LineChart
                            className='mt-6'
                            data={chartData}
                            index='name'
                            categories={['value']}
                            colors={['emerald']}
                            valueFormatter={dataFormatter}
                            yAxisWidth={40}
                        />
                    </TremorCard>
                    <TremorCard>
                        <Text>Value</Text>
                        <Metric>100%</Metric>
                        <CategoryBar
                            categoryPercentageValues={chartData.map((y) => y.value)}
                            colors={['emerald', 'yellow', 'rose']}
                            className='mt-4'
                        />
                        <Legend
                            categories={chartData.map((y) => y.name)}
                            colors={['emerald', 'yellow', 'rose']}
                            className='mt-3'
                        />
                    </TremorCard>
                    <TremorCard className='flex flex-row'>
                        <Circle value={circleValue} onClick={CircleClicked} />
                        <Title>
                            <h2>TOTAL</h2>
                            <h3>Rows</h3>
                        </Title>
                    </TremorCard>
                    <TremorCard className='flex flex-col h-28'>
                        <DataChart rawData={chartData} dataCallback={identity} legend />
                        <Badge value={500} content='Goal' right={30} />
                    </TremorCard>
                    <TremorCard>
                        <ChartBar
                            rawData={chartData}
                            dataCallback={identity}
                            legendFormatType={LegendFormatTypes.MONEY}
                            legend
                        />
                    </TremorCard>
                    <TremorCard>
                        <PieChart
                            rawData={chartData}
                            dataCallback={identity}
                            legendFormatType={LegendFormatTypes.NUMBER}
                        />
                    </TremorCard>
                    <Col numColSpan={2}>
                        <TremorCard>
                            <Table
                                columns={columns}
                                rawData={data}
                                dataCallback={identity}
                                dataTitle='Data Table'
                                searchable
                                sortable
                                exportCsv
                                switchTbl={toggle}
                                isExchange={value}
                                calculateFooter={calculateFooter}
                            />
                        </TremorCard>
                    </Col>
                </Grid>
            </TremorContainer>
            <Footer />
        </>
    );
};

const container = document.getElementById('root');
const root = createRoot(container as any);

root.render(<Application />);
