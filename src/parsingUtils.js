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
    var formattedDate = new Date();
    var dd = formattedDate.getDate();
    var mm = formattedDate.getMonth()+1; //January is 0!
    var yyyy = formattedDate.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    }

    if(mm<10) {
        mm = '0'+mm
    }
    formattedDate = yyyy+'-'+mm+'-'+dd;
    return formattedDate;
}

// Return the date in yyyy-mm-dd format given the datetime. Use DateFormatter
const getTomorrowDateFromDateTimeObject = () => {
    var currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    var dd = currentDate.getDate()
    var mm = currentDate.getMonth() + 1
    var yyyy = currentDate.getFullYear()

    if(dd<10) {
        dd = '0'+dd
    }

    if(mm<10) {
        mm = '0'+mm
    }
    currentDate = yyyy+'-'+mm+'-'+dd;
    return currentDate;
}

export {ParseGooglePlacesAPIResponse, parseMobileNumber, capitalize, getDateFromDateTimeObject, getTomorrowDateFromDateTimeObject};
