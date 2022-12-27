import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { identity } from 'uno-js';
import {
    baseTheme,
    NavBar,
    NavBarTitle,
    Footer,
    AppContainer,
    Directions,
    Card,
    Circle,
    SizeValues,
    Colors,
    Title,
    FlexValues,
    CardContent,
    Divider,
    Ellipse,
    Badge,
    Loading,
    Table,
    DataTypes,
    LegendFormatTypes,
    PieChart,
    SortDirection,
    DataChart,
    DefaultImg,
} from '../src';
import '../src/resources/global.css';

const columns = [
    { label: 'Name', sortOrder: 1, sortDirection: SortDirection.ASC },
    { label: 'City' },
    { label: 'Age', dataType: DataTypes.DAYS, sortOrder: 2, sortDirection: SortDirection.DESC },
    { label: 'Like Ice cream', dataType: DataTypes.BOOLEAN },
    { label: 'Profile', dataType: DataTypes.LINK_ICON },
];

const defaultData = [
    ['Pepe', 'Mexico', 20, true, 'https://www.google.com'],
    ['Pepe', 'LA', 25, true, ''],
    ['Juan', 'Chicago', 30, true, 'https://www.google.com'],
    ['Juan', 'Oaxaca', 35, false, 'https://www.google.com'],
    ['Maria', 'NY', 40, false, ''],
    ['Laura', 'Guadalajara', 45, true, 'https://www.google.com'],
    ['Laura', 'Mexico', 50, true, 'https://www.google.com'],
];

const chartData = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
];

const Application = () => {
    const [value, setValue] = React.useState(false);
    const [data, setData] = React.useState(defaultData);

    const toggle = () => {
        setValue(!value);
        setData(value ? defaultData : []);
    };

    return (
        <ThemeProvider theme={baseTheme}>
            <NavBar>
                <NavBarTitle>
                    <h2>Sample App</h2>
                </NavBarTitle>
            </NavBar>
            <AppContainer rows={3} columns={3}>
                <Card column={1} row={1} direction={Directions.ROW} justify={FlexValues.START} fit>
                    <Circle value={100} />
                    <Title>
                        <h2>TOTAL</h2>
                        <h6>Rows</h6>
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
                    />
                </Card>
                <Card column={1} row={3} direction={Directions.ROW} fit>
                    <Loading />
                    <Divider />
                    <Circle size={SizeValues.SMALL} value={100} color={Colors.GRAY} />
                </Card>
                <Card column={2} row={3} direction={Directions.ROW}>
                    <Circle size={SizeValues.EXTRA_SMALL} value={50} color={Colors.GRAY} />
                    <Divider />
                    <CardContent direction={Directions.COLUMN} size={SizeValues.EXTRA_SMALL}>
                        <h3>Subtitle</h3>
                        <h4>
                            <Ellipse color='#4CDD28' small /> This is OK
                        </h4>
                    </CardContent>
                </Card>
            </AppContainer>
            <Footer />
        </ThemeProvider>
    );
};

const container = document.getElementById('root');
const root = createRoot(container as any);

root.render(<Application />);
