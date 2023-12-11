export const getObjectByValue = (array, value) => {
    const obj = array.find(item => item.value == value);
    return obj
}

export const isValidEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

export const formatPhoneNumber = (phoneNumber) => {
    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length >= 10) {
        const formattedNumber = `+${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)} ${digits.slice(10)}`;
        return formattedNumber;
    } else {
        return phoneNumber;
    }
}

export const formatDate = (dateString) => {
    if (dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedDate = `${day} Th${date.getMonth() + 1}, ${hours}:${minutes} ${ampm}`;

        return formattedDate;
    } else {
        return null
    }
}

export const formatPrice = (price) => {
    const numberString = String(price);
    const numberArray = numberString.split('');
    const dotPosition = numberArray.length % 3 || 3;
    for (let i = dotPosition; i < numberArray.length; i += 4) {
        numberArray.splice(i, 0, '.');
    }
    const formattedNumber = numberArray.join('');
    return formattedNumber;
}

export const getObjectByValueInObj = (obj, value) => {
    for (const key in obj) {
        if (obj[key].value === value) {
            return obj[key];
        }
    }
    return null;
};

export function truncateString(str, maxLength) {
    if (str.length <= maxLength) {
        return str;
    } else {
        return str.slice(0, maxLength - 3) + "...";
    }
}
