export const CardLoading = () => (
    <svg
        version='1.1'
        id='L3'
        xmlns='http://www.w3.org/2000/svg'
        x='0px'
        y='0px'
        viewBox='0 0 100 100'
        enableBackground='new 0 0 0 0'
        className='block w-full h-full p-4'
    >
        <title>Loading...</title>
        <circle fill='none' stroke='#304FF3' strokeWidth={4} cx={50} cy={50} r={44} style={{ opacity: 0.5 }} />
        <circle fill='#304FF3' stroke='none' strokeWidth='3' cx='8' cy='54' r='6'>
            <animateTransform
                attributeName='transform'
                dur='2s'
                type='rotate'
                from='0 50 48'
                to='360 50 52'
                repeatCount='indefinite'
            />
        </circle>
    </svg>
);
