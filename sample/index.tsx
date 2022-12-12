import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import {
    GlobalStyle,
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
} from '../src';

const columns = [
    { label: 'Name', sortOrder: 1, sortDirection: SortDirection.ASC },
    { label: 'City' },
    { label: 'Age', dataType: DataTypes.DAYS, sortOrder: 2, sortDirection: SortDirection.DESC },
];

const defaultData = [
    ['Pepe', 'Mexico', 20],
    ['Pepe', 'LA', 25],
    ['Juan', 'Chicago', 30],
    ['Juan', 'Oaxaca', 35],
    ['Maria', 'NY', 40],
    ['Laura', 'Guadalajara', 45],
    ['Laura', 'Mexico', 50],
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
            <GlobalStyle />
            <NavBar>
                <NavBarTitle>
                    <h2>Sample App</h2>
                </NavBarTitle>
            </NavBar>
            <AppContainer rows={2} columns={3}>
                <Card column={1} row={1} direction={Directions.ROW} justify={FlexValues.START}>
                    <Circle value={100} color={Colors.BLUE} size={SizeValues.LARGE} />
                    <Title>
                        <h2>TOTAL</h2>
                    </Title>
                </Card>
                <Card column={1} row={1} direction={Directions.COLUMN}>
                    <Table
                        columns={columns}
                        rawData={data}
                        dataCallback={(d) => d}
                        dataTitle='Data Table'
                        searchable
                        sortable
                        exportCsv
                        switchTbl={toggle}
                        isExchange={value}
                    />
                    <Badge value={500} content='Goal' right={30} />
                </Card>
                <Card column={1} row={1} direction={Directions.COLUMN}>
                    <PieChart rawData={chartData} dataCallback={(d) => d} legendFormatType={LegendFormatTypes.NUMBER} />
                </Card>
                <Card column={2} row={2} direction={Directions.ROW}>
                    <Circle size={SizeValues.EXTRA_SMALL} value={50} color={Colors.GRAY} />
                    <Divider />
                    <CardContent direction={Directions.COLUMN} size={SizeValues.EXTRA_SMALL}>
                        <h3>Subtitle</h3>
                        <h4>
                            <Ellipse color='#4CDD28' small /> This is OK
                        </h4>
                    </CardContent>
                </Card>
                <Card column={1} row={2} direction={Directions.ROW} fit>
                    <Loading />
                    <Divider />
                    <Circle size={SizeValues.SMALL} value={100} color={Colors.GRAY} />
                </Card>
            </AppContainer>
            <Footer />
        </ThemeProvider>
    );
};

const container = document.getElementById('root');
const root = createRoot(container as any);

root.render(<Application />);
