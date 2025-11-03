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

export function timeAgo(dateString: any) {
    const date: any = new Date(dateString);
    const now: any = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const units = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
        { label: 'second', seconds: 1 },
    ];

    for (const unit of units) {
        const value = Math.floor(diffInSeconds / unit.seconds);
        if (value >= 1) {
            return `${value} ${unit.label}${value > 1 ? 's' : ''} ago`;
        }
    }

    return 'just now';
}



