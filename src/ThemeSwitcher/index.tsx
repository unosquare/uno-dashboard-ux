import { WeatherMoon24Regular, WeatherSunny24Regular } from '@fluentui/react-icons';
import React from 'react';
import { useTheme } from '../hooks';

export const ThemeSwitcher = () => {
    const [theme, setTheme] = useTheme();

    return theme === 'light' ? (
        <WeatherMoon24Regular
            title='Change Theme'
            onClick={setTheme}
            className='text-tremor-content dark:text-dark-tremor-content'
        />
    ) : (
        <WeatherSunny24Regular
            title='Change Theme'
            onClick={setTheme}
            className='text-tremor-content dark:text-dark-tremor-content'
        />
    );
};
