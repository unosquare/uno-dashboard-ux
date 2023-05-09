import React from 'react';
import { createRoot } from 'react-dom/client';
import { identity } from 'uno-js';
import {
    AppContainer,
    Badge,
    BasicToolbar,
    Blur,
    Burger,
    Card,
    CardContent,
    ChartBar,
    Circle,
    Colors,
    DataChart,
    DataTypes,
    Directions,
    Divider,
    Ellipse,
    FlexValues,
    Footer,
    LegendFormatTypes,
    CardLoading,
    MenuContainer,
    NavBar,
    NavBarTitle,
    PieChart,
    SizeValues,
    SortDirection,
    SubTitle,
    Table,
    Title,
    DropdownMenu,
    StyledMenuSearchBox,
    SearchBox,
    MenuSection,
    MenuSubSection,
    StyledMenuActions,
} from '../src';
import '../src/resources/global.css';
import { ArrowSync24Regular, Dismiss24Regular } from '@fluentui/react-icons';

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

    const handleOptionChange = (option: options) => {
        setCurrentOption(option);
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
                                onOptionClicked={handleOptionChange}
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
            </BasicToolbar>
            <AppContainer rows={4} columns={3} hasToolbar>
                <Card column={1} row={1} direction={Directions.ROW} justify={FlexValues.START} fit>
                    <Circle value={circleValue} onClick={CircleClicked} />
                    <Title>
                        <h2>TOTAL</h2>
                        <h3>Rows</h3>
                    </Title>
                </Card>
                <Card column={2} row={1} direction={Directions.COLUMN}>
                    <DataChart rawData={chartData} dataCallback={identity} legend />
                    <Badge value={500} content='Goal' right={30} />
                </Card>
                <Card column={1} row={2} direction={Directions.COLUMN}>
                    <PieChart rawData={chartData} dataCallback={identity} legendFormatType={LegendFormatTypes.NUMBER} />
                </Card>
                <Card column={2} row={2} direction={Directions.COLUMN} fit>
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
                </Card>
                <Card column={1} row={3} direction={Directions.ROW} fit>
                    <CardLoading />
                    <Divider />
                    <Circle size={SizeValues.SMALL} value={100} color={Colors.GRAY} />
                </Card>
                <Card column={2} row={3} direction={Directions.ROW}>
                    <Circle size={SizeValues.EXTRA_SMALL} value={50} color={Colors.GRAY} />
                    <Divider />
                    <CardContent direction={Directions.COLUMN} size={SizeValues.EXTRA_SMALL}>
                        <SubTitle>
                            <h4>Subtitle</h4>
                            <h5>
                                <Ellipse color='#4CDD28' small /> This is OK
                            </h5>
                        </SubTitle>
                    </CardContent>
                </Card>
                <Card column={3} row={4} direction={Directions.ROW}>
                    <ChartBar
                        rawData={chartData}
                        dataCallback={identity}
                        legendFormatType={LegendFormatTypes.MONEY}
                        legend
                    />
                </Card>
            </AppContainer>
            <Footer />
        </>
    );
};

const container = document.getElementById('root');
const root = createRoot(container as any);

root.render(<Application />);
