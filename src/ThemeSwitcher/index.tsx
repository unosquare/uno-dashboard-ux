import { WeatherMoon24Regular, WeatherSunny24Regular } from '@fluentui/react-icons';
import { useTheme } from '../hooks';

export const ThemeSwitcher = () => {
    const [theme, setTheme] = useTheme();

    return theme === 'light' ? (
        <WeatherMoon24Regular
            title='Change Theme'
            onClick={setTheme}
            className='text-unodashboard-content dark:text-dark-unodashboard-content'
        />
    ) : (
        <WeatherSunny24Regular
            title='Change Theme'
            onClick={setTheme}
            className='text-unodashboard-content dark:text-dark-unodashboard-content'
        />
    );
};
