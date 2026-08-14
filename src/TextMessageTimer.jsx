import { useEffect, useState } from 'react';

export function TextMessageTimer({ text_message }) {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        // Start interval when component mounts
        const interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
        }, 1000);

        // Clean up interval when component unmounts
        return () => clearInterval(interval);
    }, []);

    return(<>{text_message} ({seconds}s)</>);
};