export const appUrl = () => {
    const { APP_HOSTNAME = process.env.APP_HOSTNAME || 'http://localhost', APP_PORT = process.env.APP_PORT || '4002' } =
        process.env;
    return `${APP_HOSTNAME}:${APP_PORT}`;
};
