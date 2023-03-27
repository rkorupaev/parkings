const checkIsInArray = (array, item) => {
    const set = new Set(array);
    return set.has(item);
}

const checkForm = (initialObject, changedObject) => {
    return JSON.stringify(initialObject) === JSON.stringify(changedObject);
}

const getClientGrzArrayAvaliable = (clients, formData) => {
    let client = clients.find(item => item.clientNumber === formData.clientNumber);
    if (client) {
        client = structuredClone(client);
        if (client.lpr?.length > 0) {
            client.cards.forEach(card => {
                client.lpr.forEach((lpr, index) => {
                    card.lpr.forEach(cardLpr => {
                        if (cardLpr === lpr) client.lpr[index] = null;
                    })
                })
            });
            client.lpr = [...client.lpr.filter(Boolean)];
        }
        return client.lpr;
    }
    return [];
}

const dateToISOLikeButLocal = (date) => {
    if (date) {
        date = new Date(date);
        const offsetMs = date.getTimezoneOffset() * 60 * 1000;
        const msLocal = date.getTime() - offsetMs;
        const dateLocal = new Date(msLocal);
        const iso = dateLocal.toISOString();
        const isoLocal = iso.replace('Z', '')
        return isoLocal;
    }
    return date;
}

const prettifyDate = (data) => {
    if (data) {
        return data.slice(0, 19).replace('T', ' ');
    } else return '';
}

const checkDateIsValid = (field, value, data) => {
    if (field === 'validUntil') {
        return data.validFrom <= dateToISOLikeButLocal(value);
    } else if (field === 'validFrom') {
        return dateToISOLikeButLocal(value) <= data.validUntil;
    }
    return true;
}

const getLastDayOfMonth = (year, month) => {
    let date = new Date(year, month, 0);
    return date;
}

const getLastDayOfYear = (year) => {
    let date = new Date(year, 0, 0);
    return date;
}

const prettifyComment = (comment) => {
    let text = '';
    if (comment) {
        text = comment.split('[');
        text.pop();
        text = text.join('[');
    }
    return text;
}

const substractDays = (dayDelta) => {
    const date = new Date();
    date.setDate(date.getDate() - dayDelta);
    return date;
}

const roundTwoDecimals = (number) => {
    return Math.round((number + Number.EPSILON) * 100) / 100;
}

const checkDateIsDate = (date) => {
    return date instanceof Date && !isNaN(date);
}

const isAnyError = (input) => {
    for (const key in input ) {
        if (input[key]) return true;
    }
    return false;
}

export {
    checkIsInArray,
    checkForm,
    getClientGrzArrayAvaliable,
    dateToISOLikeButLocal,
    prettifyDate,
    checkDateIsValid,
    getLastDayOfMonth,
    getLastDayOfYear,
    prettifyComment,
    substractDays,
    roundTwoDecimals,
    checkDateIsDate,
    isAnyError,
};
