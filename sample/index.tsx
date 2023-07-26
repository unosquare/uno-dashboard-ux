import React from 'react';
import { createRoot } from 'react-dom/client';
import { identity } from 'uno-js';
import { ArrowSync24Regular, Dismiss24Regular } from '@fluentui/react-icons';
import {
    Badge,
    Bold,
    Button,
    Card,
    Col,
    Flex,
    Grid,
    Legend,
    LineChart,
    Select,
    SelectItem,
    Text,
    Title,
} from '@tremor/react';

import {
    BasicToolbar,
    Blur,
    Burger,
    ChartBar,
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
    SearchBox,
    SortDirection,
    StyledMenuActions,
    StyledMenuSearchBox,
    Table,
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
    { label: 'Name', sortOrder: 1, sortDirection: SortDirection.ASC },
    { label: 'City', disableSearch: true, excludeFromSort: true },
    { label: 'Age', dataType: DataTypes.DAYS, sortOrder: 2, sortDirection: SortDirection.DESC },
    { label: 'Balance', dataType: DataTypes.MONEY },
    { label: 'Margin', dataType: DataTypes.DECIMAL_PERCENTAGE },
    { label: 'Like Ice cream', dataType: DataTypes.BOOLEAN },
    { label: 'Profile', dataType: DataTypes.LINK },
    { label: 'Long text', dataType: DataTypes.PARAGRAPH },
];

const defaultData = [
    ['Pepe', 'Mexico', 20, 1000, 10.25, true, 'https://www.google.com', 'Small text'],
    ['Pepe', 'LA', 25, null, 10 / 3, true, '', 'Small text'],
    ['Juan', 'Chicago', 30, 200, 55.25, true, ['https://www.google.com', 'Google', '(after)'], 'Small text'],
    [
        'Juan',
        'Oaxaca',
        35,
        null,
        0.05,
        false,
        ['https://www.google.com', '(Google)', 'before', 0.25, true],
        'Small text',
    ],
    ['Maria', 'NY', 40, 0, 0.55, false, '', 'Small text'],
    ['Laura', 'Guadalajara', 45, 100, 25, true, 'https://www.google.com', 'Small text'],
    ['Laura', 'Mexico', 50, 100, 0.125, true, 'https://www.google.com', 'Small text'],
    [
        'Juan',
        'Oaxaca',
        30,
        null,
        0.75,
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
    const [currentOption, setCurrentOption] = React.useState<string>(options.A);
    const [openMenu, setOpenMenu] = React.useState(false);

    const onToggleMenu = () => {
        const body = document.getElementById('body');
        if (body) body.style.overflow = openMenu ? 'auto' : 'hidden';
        setOpenMenu(!openMenu);
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
                                <ArrowSync24Regular />
                                <Dismiss24Regular onClick={() => setOpenMenu(false)} />
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
                <Button size='xs'>Click</Button>
            </BasicToolbar>
            <TremorContainer hasToolbar>
                <Grid numItems={3} numItemsSm={1} numItemsMd={2} className='gap-6'>
                    <Card>
                        <Text>Goal</Text>
                        <LineChart
                            className='mt-5'
                            data={chartData}
                            index='name'
                            categories={['value']}
                            colors={['emerald']}
                            valueFormatter={dataFormatter}
                            yAxisWidth={40}
                        />
                    </Card>
                    <Card>
                        <DataChart rawData={chartData} dataCallback={identity} legend className='mt-5' />
                        <Badge size='sm'>500 Goal</Badge>
                    </Card>
                    <Card>
                        <Bold>Bar Chart</Bold>
                        <ChartBar
                            className='mt-5'
                            rawData={chartData}
                            dataCallback={identity}
                            legendFormatType={LegendFormatTypes.MONEY}
                            legend
                        />
                    </Card>
                    <Card className='h-96'>
                        <Bold>Pie Chart</Bold>
                        <PieChart
                            rawData={chartData}
                            dataCallback={identity}
                            legendFormatType={LegendFormatTypes.NUMBER}
                        />
                        <Legend
                            categories={chartData.map((x) => x.name)}
                            className='mt-6'
                            colors={['emerald', 'yellow', 'rose']}
                        />
                    </Card>
                    <Col numColSpan={2}>
                        <Card>
                            <Table
                                className='h-72'
                                columns={columns}
                                rawData={defaultData}
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
                </Grid>
            </TremorContainer>
            <Footer />
        </>
    );
};

const container = document.getElementById('root');
const root = createRoot(container as any);

root.render(<Application />);
