import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import {
    GlobalStyle,
    theme,
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
    SearchBox,
    Loading,
    ToolBar,
} from '../src';

const noOp = () => {};

const Application = () => (
    <ThemeProvider theme={theme}>
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
            <Card column={2} row={1} direction={Directions.ROW} extraBottom>
                <Badge value={500} content='Goal' right={30} />
                <Circle size={SizeValues.EXTRA_SMALL} value={50} color={Colors.GRAY} />
                <Divider />
                <CardContent direction={Directions.COLUMN} size={SizeValues.EXTRA_SMALL}>
                    <h3>Subtitle</h3>
                    <h4>
                        <Ellipse color='#4CDD28' small /> This is OK
                    </h4>
                </CardContent>
                <Divider />
                <Circle size={SizeValues.SMALL} value={100} color={Colors.GRAY} />
            </Card>
            <Card column={1} row={2} direction={Directions.COLUMN} fit>
                <SearchBox search={console.log} />
                <Loading />
            </Card>
            <Card column={2} row={2} direction={Directions.COLUMN} fit>
                <ToolBar dataTitle='This is a header' onSearch={noOp} onCsvClick={noOp} switchTbl={noOp} />
            </Card>
        </AppContainer>
        <Footer />
    </ThemeProvider>
);

const container = document.getElementById('root');
const root = createRoot(container as any);

root.render(<Application />);
