export function formatUnixDate(timestamp: number): string {
    const date = new Date(timestamp * 1000); // convert seconds → milliseconds
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
}

export function getYearFromUnix(unixTimestamp: number): number {
    const date = new Date(unixTimestamp * 1000);
    return date.getFullYear();
}

