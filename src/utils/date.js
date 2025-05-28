export const convertUTCToLocal = (dateString) => {
    const date = new Date(dateString);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
};


export const parseJavaLocalDateTime = (arr) => {
    const [year, month, day, hour, minute, second, nano] = arr;
    const milliseconds = Math.floor(nano / 1_000_000); // Convert nano to ms
    return new Date(year, month - 1, day, hour, minute, second, milliseconds); // month - 1 vì JS bắt đầu từ 0
}

