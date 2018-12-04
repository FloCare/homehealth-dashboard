import moment from 'moment/moment';

const ParseGooglePlacesAPIResponse = (details) => {

    let formattedAddress = details[0].formatted_address;
    let streetAddress = details[0].address_components;
    const adrAddress = details.adr_address;
    for (var i = 0; i < streetAddress.length; i++) {
                var addr = streetAddress[i];
                var countryName;
                var stateName;
                var stateShortName;
                var cityName;
                var postalCode;

                if (addr.types[0] === 'locality') {
                    cityName = addr.long_name;
                    if (cityName && formattedAddress.lastIndexOf(`, ${cityName}`) > -1) {
                        formattedAddress = formattedAddress.replace(`, ${cityName}`, '');
                    } else if (cityName && formattedAddress.lastIndexOf(`, ${cityName}`) > -1) {
                        formattedAddress = formattedAddress.replace(`, ${cityName}`, '');
                    }
                }
                if (addr.types[0] === 'administrative_area_level_1') {
                    stateName = addr.long_name;
                    stateShortName = addr.short_name
                    if (stateName && formattedAddress.lastIndexOf(`, ${stateName}`) > -1) {
                        formattedAddress = formattedAddress.replace(`, ${stateName}`, '');
                    } else if (stateName && formattedAddress.lastIndexOf(`, ${stateName}`) > -1) {
                        formattedAddress = formattedAddress.replace(`, ${stateName}`, '');
                    }
                    else if (stateShortName && formattedAddress.lastIndexOf(`, ${stateShortName}`) > -1) {
                        formattedAddress = formattedAddress.replace(`, ${stateShortName}`, '');
                    }
                }
                if (addr.types[0] === 'postal_code') {
                    postalCode = addr.long_name;
                    if (postalCode && formattedAddress.lastIndexOf(` ${postalCode}`) > -1) {
                        formattedAddress = formattedAddress.replace(` ${postalCode},`, '');
                    } else if (postalCode && formattedAddress.lastIndexOf(`, ${postalCode}`) > -1) {
                        formattedAddress = formattedAddress.replace(` ${postalCode},`, '');
                    }
                }
                if (addr.types[0] === 'country') {
                    countryName = addr.long_name;
                    if (countryName && formattedAddress.lastIndexOf(`, ${countryName}`) > -1) {
                        formattedAddress = formattedAddress.replace(`, ${countryName}`, '');
                    } else if (countryName && formattedAddress.lastIndexOf(`, ${countryName}`) > -1) {
                        formattedAddress = formattedAddress.replace(`, ${countryName}`, '');
                    }
                    //TO BE REMOVED LATER
                    else if (formattedAddress.lastIndexOf(`USA`) > -1) {
                        formattedAddress = formattedAddress.replace(`USA`, '');
                    }
                }
                localStorage.setItem('cityName', cityName);
                localStorage.setItem('postalCode', postalCode);
                localStorage.setItem('countryName', countryName);
                localStorage.setItem('stateName', stateName);
                localStorage.setItem('streetAddress', formattedAddress);
            }

    if (details[0].geometry) {
        const location = details[0].geometry.location;
        if (location) {
            localStorage.setItem('latitude', location.lat);
            localStorage.setItem('longitude', location.long);
        }
    }

};

const parseMobileNumber = (rawMobileString) => {
    return rawMobileString.toString().replace(/-/g, "");
}

const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Return the date in yyyy-mm-dd format given the datetime. Use DateFormatter
const getDateFromDateTimeObject = () => {
    return currentDate = moment().format('YYYY-MM-DD');
}

// Return the date in yyyy-mm-dd format given the datetime. Use DateFormatter
const getTomorrowDateFromDateTimeObject = () => {
    return moment().add(1, 'days').format('YYYY-MM-DD');
}

const parseIsoDateToString = (iso, include_seconds=true) => {
    const date = new Date(iso);
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let dt = date.getDate();

    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    if (second < 10) {
        second = '0' + second;
    }
    if (hour < 10){
        hour = '0' + hour;
    }
    if (minute < 10){
        minute = '0' + minute;
    }
    if (!include_seconds){
        const formattedDate = `${year}-${month}-${dt}_${hour}:${minute}`;
        return formattedDate;
    }
    const formattedDate = `[${year}-${month}-${dt}] [${hour}:${minute}:${second}]`;
    return formattedDate;
};

const getReportName = (isoDate) => {
    console.log('isoDate received is:', isoDate);
    const reportDate = moment(moment(isoDate, moment.ISO_8601), 'x').format('MMMM Do YYYY');
    const reportName = `${reportDate}_Miles_Report`;
    return reportName;
};

export {ParseGooglePlacesAPIResponse, parseMobileNumber, capitalize, getDateFromDateTimeObject, getTomorrowDateFromDateTimeObject, parseIsoDateToString, getReportName};
