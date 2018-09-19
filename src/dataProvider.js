// in src/dataProvider
import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    DELETE,
    fetchUtils,
} from 'react-admin';
import {stringify} from 'query-string';
import {parseMobileNumber, capitalize} from './utils/parsingUtils';
import ReactGA from 'react-ga';
import {parseIsoDateToString} from './utils/parsingUtils';

//export const API_URL = 'https://app-11293.on-aptible.com';
//export const API_URL = 'https://app-9781.on-aptible.com';
export const API_URL = 'http://localhost:8000';
const REFRESH_API_URL = 'http://localhost:8000/api-token-refresh/';
ReactGA.initialize('UA-123730827-1');
var nJwt = require('njwt');
var EXPIRY_TIME_CHECK = 600000; // 10 minutes
var SECRET_KEY = '3mtih1f4nf@$56$14sdwp48czyonlf25)9hk11=chgyi0#v(gg';// secret key to match with the jwt secret key set in the backend

/**
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The Data Provider request params, depending on the type
 * @returns {Object} { url, options } The HTTP request parameters
 */

// Todo: Remove this hack
function getQueryStringValue (key) {
    return decodeURIComponent(window.location.href.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

const convertDataProviderRequestToHTTP = (type, resource, params) => {
    console.log('Converting Data Provider Call to HTTP Request on:');
    console.log('This called:', type);
    var accessToken = localStorage.getItem('access_token');
    // nJwt.verify(accessToken, SECRET_KEY, function(err,verifiedJwt){
    //     if(err){
    //         localStorage.removeItem('access_token');
    //         window.location.reload();
    //     }else{
    //         // Each time the user loads the page, we check if there is an existing non-expired token and if it's close to being expired, refresh it to extend the expiry.
    //         // Currently being set to 10 minutes
    //         if((verifiedJwt.body.exp * 1000) - Date.now() < EXPIRY_TIME_CHECK) {
    //             console.log('refresh');
    //             const request = new Request(REFRESH_API_URL, {
    //                 method: 'POST',
    //                 body: JSON.stringify({ token: accessToken, orig_iat: verifiedJwt.body.iat }),
    //                 headers: new Headers({ 'Content-Type': 'application/json'
    //                 }),
    //             })
    //             return fetch(request)
    //                 .then(response => {
    //                     if (response.status < 200 || response.status >= 300) {
    //                         return Promise.reject();
    //                     }
    //                     return response.json();
    //                 })
    //                 .then(({ token }) => {
    //                     localStorage.setItem('access_token', token);
    //                 });
    //         }
    //     }
    // });

    switch (type) {
        case GET_LIST: {
            // console.log('Running GET LIST for:', resource);
            const {page, perPage} = params.pagination;
            const {field, order} = params.sort;
            const {q} = params.filter;
            //TODO change the default from 100 when we do pagination
            const query = {
                format: 'json',
                query: q,
                size: (q === undefined) ? 100: perPage,
                sort: field,
                order: order
                // range: JSON.stringify([(page - 1) * perPage, page * perPage - 1])
            };
            const options = {};
            options.headers = new Headers({Authorization: 'Token '+ accessToken});
            switch(resource) {
                case 'users':
                    ReactGA.pageview('/staff/list');
                    return { url: `${API_URL}/${resource}/v1.0/org-access/?${stringify(query)}`, options};
                case 'phi':
                    ReactGA.pageview('/phi/list');
                    return { url: `${API_URL}/${resource}/v1.0/patients/?${stringify(query)}`, options};
                    //Karthik
                case 'stops':
                    ReactGA.pageview('/stops/list');
                    return { url: `${API_URL}/phi/v1.0/places/?${stringify(query)}`, options};
                case 'physicians':
                    ReactGA.pageview('/physicians/list');
                    return { url: `${API_URL}/phi/v1.0/physicians/?${stringify(query)}`, options};
                case 'reports':
                    ReactGA.pageview('/reports/list');
                    // console.log('======================');
                    // console.log('Extracting userID out of URL ...');
                    // console.log('======================');
                    const userID = getQueryStringValue('userID');
                    // console.log('======================');
                    // console.log('userID:', userID);
                    // console.log('======================');
                    query.userID = userID;
                    return {url: `${API_URL}/phi/v1.0/reports/?${stringify(query)}`, options};
                default:
                    throw new Error(`Unsupported fetch action type ${type}`);
            }
        }

        case GET_ONE:
            const options = {};
            options.headers = new Headers({Authorization: 'Token '+ accessToken});
            switch(resource) {
                case 'phi':
                    ReactGA.event({
                      category: 'PatientEdit',
                      action: 'patient_edit'
                    });
                    return { url: `${API_URL}/${resource}/v1.0/patients/${params.id}/`, options };
                case 'physicians':
                    return { url: `${API_URL}/phi/v1.0/physicians/${params.id}/`, options };
                    //Karthik
                case 'stops':
                    return { url: `${API_URL}/phi/v1.0/places/${params.id}/`, options };
                case 'users':
                    return { url: `${API_URL}/users/v1.0/staff/${params.id}/`, options };
                case 'reports':
                    return {url: `${API_URL}/phi/v1.0/reports/${params.id}/`, options};
                default:
                    throw new Error(`Unsupported fetch action type ${type}`);
            }

        case GET_MANY: {
            // console.log('Running GET MANY for:', resource);
            // const users = params.ids;
            // const ids = [];
            // for(let i in users){
            //     ids.push(users[i].id);
            // }
            // console.log('ids:',ids);
            const query = {
                format: 'json',
                // sort: JSON.stringify([field, order]),
                // range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
                // ids: ids.toString(),
            };
            // console.log('Query params:', stringify(query));
            const options = {};
            options.headers = new Headers({Authorization: 'Token '+ accessToken});

            switch(resource) {
                case 'users':
                    return { url: `${API_URL}/${resource}/v1.0/org-access/?${stringify(query)}`, options};
                default:
                    // const query = {
                    //     filter: JSON.stringify({ id: params.ids }),
                    // };
                    // return { url: `${API_URL}/${resource}/?${stringify(query)}` };
                    throw new Error(`Unsupported fetch action type ${type}`);
            }
        }

        // Todo: Check if this is being used
        // case GET_MANY_REFERENCE: {
        //     const { page, perPage } = params.pagination;
        //     const { field, order } = params.sort;
        //     const query = {
        //         sort: JSON.stringify([field, order]),
        //         range: JSON.stringify([(page - 1) * perPage, (page * perPage) - 1]),
        //         filter: JSON.stringify({ ...params.filter, [params.target]: params.id }),
        //     };
        //     return { url: `${API_URL}/${resource}?${stringify(query)}` };
        // }

        case UPDATE:
            // console.log('Running UPDATE for:', resource);
            switch(resource) {
                case 'phi':
                    var body = {};
                    body.patient = {};
                    const updatedFields = params.data.updatedFields;
                    for (let i=0; i<updatedFields.length; i++){
                        const field = updatedFields[i];
                        if(field === 'dob') {
                            var date = params.data[field];
                            var month = date.getUTCMonth() + 1; //months from 1-12
                            var day = date.getUTCDate() + 1;
                            var year = date.getUTCFullYear();
                            if(day<10)  { day='0'+day } 
                            if(month<10)  { month='0'+month }
                            body.patient[field] = year+'-'+month+'-'+day;
                        }
                        else if(field != 'apartmentNo')
                            body.patient[field] = params.data[field];
                    }
                    if (updatedFields.indexOf('address') > -1 && updatedFields.indexOf('apartmentNo') > -1) {
                        params.data.address = {
                            "apartmentNo": params.data.apartmentNo,
                            "streetAddress": localStorage.getItem('streetAddress'),
                            "zipCode": localStorage.getItem('postalCode'),
                            "city": localStorage.getItem('cityName'),
                            "state": localStorage.getItem('stateName'),
                            "country": localStorage.getItem('countryName'),
                            "latitude": localStorage.getItem('latitude'),
                            "longitude": localStorage.getItem('longitude')
                        };
                        body.patient['address'] = params.data.address;
                    } else if (updatedFields.indexOf('address') > -1 ) {
                        params.data.address = {
                            "streetAddress": localStorage.getItem('streetAddress'),
                            "zipCode": localStorage.getItem('postalCode'),
                            "city": localStorage.getItem('cityName'),
                            "state": localStorage.getItem('stateName'),
                            "country": localStorage.getItem('countryName'),
                            "latitude": localStorage.getItem('latitude'),
                            "longitude": localStorage.getItem('longitude')
                        };
                        body.patient['address'] = params.data.address;
                    } 
                    else if(updatedFields.indexOf('apartmentNo') > -1){
                        params.data.address = {
                            "apartmentNo": params.data.apartmentNo
                        };
                        body.patient['address'] = params.data.address;
                    }
                    if(params.data.userIds.length != params.previousData.userIds.length) {
                        ReactGA.event({
                            category: 'PatientEdited',
                            action: 'staff_tagging_edit',
                            value: params.data.userIds.length
                        });
                    }
                    body.id=params.data.id;
                    body.users=params.data.userIds;
                    body.physicianId = params.data.physician_id;
                    ReactGA.event({
                      category: 'PatientEdited',
                      action: 'patient_edited'
                    });
                    return {
                        url: `${API_URL}/${resource}/v1.0/patients/${params.id}/`,
                        options: { method: 'PUT', body: JSON.stringify(body), headers: new Headers({Authorization: 'Token '+ accessToken})},
                    };
                case 'physicians':
                    const updateBody = {
                            npi : params.data.npiID,
                            firstName : params.data.firstName,
                            lastName : params.data.lastName,
                            phone1 : params.data.phone1,
                            phone2 : params.data.phone2 === '' ? null : params.data.phone2,
                            fax : params.data.fax,
                        };
                    return{
                        url: `${API_URL}/phi/v1.0/physicians/${params.id}/`,
                        options: { method: 'PUT', body: JSON.stringify(updateBody), headers: new Headers({Authorization: 'Token '+ accessToken})},
                    }
                    // Karthik
                case 'stops':
                    var body = {};
                    const updFields = params.data.updatedFields;
                    if (updFields.indexOf('address') > -1) {
                        params.data.address = {
                            "streetAddress": localStorage.getItem('streetAddress'),
                            "zipCode": localStorage.getItem('postalCode'),
                            "city": localStorage.getItem('cityName'),
                            "state": localStorage.getItem('stateName'),
                            "country": localStorage.getItem('countryName'),
                            "latitude": localStorage.getItem('latitude'),
                            "longitude": localStorage.getItem('longitude')
                        };
                    }
                    else {
                        params.data.address = {};
                    }
                    body.address = params.data.address;
                    body.name = params.data.name;
                    body.contactNumber = params.data.contactNumber === '' ? null : params.data.contactNumber;
                    const stopsUpdateBody = {
                        name: params.data.name,
                        contactNumber: params.data.contactNumber,
                        address: params.data.address
                    }
                    localStorage.removeItem('postalCode');
                    localStorage.removeItem('cityName');
                    localStorage.removeItem('stateName');
                    localStorage.removeItem('countryName');
                    localStorage.removeItem('latitude');
                    localStorage.removeItem('longitude');
                    localStorage.removeItem('streetAddress');
                    return{
                        url: `${API_URL}/phi/v1.0/places/${params.data.id}/`,
                        options: { method: 'PUT', body: JSON.stringify(body), headers: new Headers({Authorization: 'Token '+ accessToken})},
                    }
                case 'users':
                    var userData = undefined;
                    if(params.data.password === '') {
                        userData = {
                            user: {
                                firstName : params.data.first_name,
                                lastName : params.data.last_name,
                                phone : params.data.contact_no,
                                role : params.data.user_role,
                                email : params.data.email,
                                is_active: params.data.is_active,
                            }
                        };
                    }
                    else {
                        userData = {
                            user: {
                                firstName : params.data.first_name,
                                lastName : params.data.last_name,
                                password : params.data.password,
                                phone : params.data.contact_no,
                                role : params.data.user_role,
                                email : params.data.email,
                                is_active: params.data.is_active
                            }
                        };
                    }
                    return{
                        url: `${API_URL}/users/v1.0/staff/${params.id}/`,
                        options: { method: 'PUT', body: JSON.stringify(userData), headers: new Headers({Authorization: 'Token '+ accessToken})},
                    // options: { method: 'PUT', body: JSON.stringify(body), headers: new Headers({Authorization: 'Token '+ accessToken})},
                }
                default:
                    console.log('ERROR! Edit called on invalid resources.');
                    return {};
            }

        case CREATE:
            // console.log('Running CREATE for:', resource);
            switch(resource) {
                case 'phi':
                    var request = {};
                    params.data.address = {
                        "apartmentNo": params.data.apartmentNo,
                        "streetAddress": localStorage.getItem('streetAddress'),
                        "zipCode": localStorage.getItem('postalCode'),
                        "city": localStorage.getItem('cityName'),
                        "state": localStorage.getItem('stateName'),
                        "country": localStorage.getItem('countryName'),
                        "latitude": localStorage.getItem('latitude'),
                        "longitude": localStorage.getItem('longitude')
                    };

                    request.patient = {};
                    request.patient.address = params.data.address;
                    request.patient.firstName = params.data.firstName;
                    request.patient.lastName = params.data.lastName;
                    request.patient.primaryContact = params.data.primaryContact;
                    request.patient.emergencyContactName = params.data.emergencyContactName;
                    request.patient.emergencyContactNumber = params.data.emergencyContactNumber;
                    request.patient.emergencyContactRelationship = params.data.emergencyContactRelationship;
                    if(params.data.dateOfBirth != null) {
                        var date = params.data.dateOfBirth;
                        var month = date.getUTCMonth() + 1; //months from 1-12
                        var day = date.getUTCDate() + 1;
                        var year = date.getUTCFullYear();
                        if(day<10)  { day='0'+day } 
                        if(month<10)  { month='0'+month }
                        request.patient.dob = year+'-'+month+'-'+day;
                    }
                    request.users = params.data.users;
                    request.physicianId = params.data.physician_id;
                    localStorage.removeItem('postalCode');
                    localStorage.removeItem('cityName');
                    localStorage.removeItem('stateName');
                    localStorage.removeItem('countryName');
                    localStorage.removeItem('latitude');
                    localStorage.removeItem('longitude');
                    localStorage.removeItem('streetAddress');

                    if(params.data.users != undefined) {
                        ReactGA.event({
                            category: 'PatientCreated',
                            action: 'staff_tagging',
                            value: params.data.users.length
                        });
                    }
                    if(params.data.emergencyContactName != undefined || params.data.emergencyContactNumber != undefined) {
                        ReactGA.event({
                            category: 'PatientCreated',
                            action: 'added_emergency_details'
                        });
                    }

                    ReactGA.event({
                      category: 'PatientCreated',
                      action: 'patient_created'
                    });

                    return {
                        url: `${API_URL}/${resource}/v1.0/patients/?format=json`,
                        options: { method: 'POST', headers: new Headers({Authorization: 'Token '+ accessToken}), body: JSON.stringify(request) },
                    };

                case 'users':
                    const userRequest = {
                        user: {
                            firstName : params.data.first_name,
                            lastName : params.data.last_name,
                            password : params.data.password,
                            phone : params.data.contact_no,
                            role : params.data.user_role,
                            email : params.data.email,
                        }
                    };
                    ReactGA.event({
                        category: 'StaffCreated',
                        action: 'staff_created'
                    });
                    return {
                        url: `${API_URL}/users/v1.0/staff/?format=json`,
                        options: { method: 'POST', headers: new Headers({Authorization: 'Token '+ accessToken}), body: JSON.stringify(userRequest) },
                    };
                    // Karthik
                case 'stops':

                    if(localStorage.getItem('streetAddress') === null || localStorage.getItem('latitude') === null ||
                        localStorage.getItem('longitude') === null) {
                        throw new Error(`Select street address from the dropdown`);
                        return;
                    }
                    params.data.address = {
                        "streetAddress": localStorage.getItem('streetAddress'),
                        "zipCode": localStorage.getItem('postalCode'),
                        "city": localStorage.getItem('cityName'),
                        "state": localStorage.getItem('stateName'),
                        "country": localStorage.getItem('countryName'),
                        "latitude": localStorage.getItem('latitude'),
                        "longitude": localStorage.getItem('longitude')
                    };
                    console.log(params.data.address);
                    const placeRequest = {
                        name : params.data.name,
                        contactNumber : params.data.contactNumber,
                        address: params.data.address
                    };
                    ReactGA.event({
                        category: 'PlaceCreated',
                        action: 'place_created'
                    });
                    localStorage.removeItem('postalCode');
                    localStorage.removeItem('cityName');
                    localStorage.removeItem('stateName');
                    localStorage.removeItem('countryName');
                    localStorage.removeItem('latitude');
                    localStorage.removeItem('longitude');
                    localStorage.removeItem('streetAddress');
                    return {
                        url: `${API_URL}/phi/v1.0/places/?format=json`,
                        options: { method: 'POST', headers: new Headers({Authorization: 'Token '+ accessToken}), body: JSON.stringify(placeRequest) },
                    };

                case 'physicians':
                    const request = {
                        physician: {
                            npi : params.data.npiID,
                            firstName : capitalize(params.data.firstName),
                            lastName : capitalize(params.data.lastName),
                            phone1 : params.data.phone1,
                            phone2 : params.data.phone2,
                            fax : params.data.fax,
                        }};
                     ReactGA.event({
                      category: 'PhysicianCreated',
                      action: 'physician_created'
                    });
                    return {
                        url: `${API_URL}/phi/v1.0/physicians/?format=json`,
                        options: { method: 'POST', headers: new Headers({Authorization: 'Token '+ accessToken}), body: JSON.stringify(request) },
                    };
                default:
                    console.log('ERROR! CREATE called on invalid resources.');
                    return {};
            }

        case DELETE:
            // console.log('Running DELETE for:', resource);
            switch(resource) {
                case 'users':
                    return {
                        url: `${API_URL}/${resource}/v1.0/staff/${params.id}/`,
                        options: { method: 'DELETE', headers: new Headers({Authorization: 'Token '+ accessToken}) },
                    };
                case 'physicians':
                    return {
                        url: `${API_URL}/phi/v1.0/physicians/${params.id}/`,
                        options: { method: 'DELETE', headers: new Headers({Authorization: 'Token '+ accessToken}) },
                    };

                case 'stops':
                    return {
                        url: `${API_URL}/phi/v1.0/places/${params.id}/`,
                        options: { method: 'DELETE', headers: new Headers({Authorization: 'Token '+ accessToken}) },
                    };
                case 'phi':
                    ReactGA.event({
                      category: 'PatientDeleted',
                      action: 'patient_deleted'
                    });
                    return {
                        url: `${API_URL}/${resource}/v1.0/patients/${params.id}/`,
                        options: { method: 'DELETE', headers: new Headers({Authorization: 'Token '+ accessToken}) },
                    };

            }

        default:
            throw new Error(`Unsupported fetch action type ${type}`);
    }
};

/**
 * @param {Object} response HTTP response from fetch()
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The Data Provider request params, depending on the type
 * @returns {Object} Data Provider response
 */
const convertHTTPResponseToDataProvider = (response, type, resource, params) => {
    console.log('Converting API Response to Data Provider:', type, params);
    const {json, headers} = response;
    switch (type) {

        case GET_LIST:
            // console.log('EXECUTED GET_LIST for:', resource);
            switch(resource) {
                // Karthik
                case 'stops':
                    const stopsData = json.map(stop => {
                        return ({
                            id: stop.placeID,
                            name: stop.name,
                            contactNumber: stop.contactNumber,
                            displayAddress: `${stop.address.streetAddress},  ${stop.address.city}, ${stop.address.state}`,
                            streetAddress: stop.address.streetAddress,
                            zipCode: stop.address.zipCode,
                            city: stop.address.city,
                            state: stop.address.state,
                            country: stop.address.country,
                            latitude: stop.address.latitude,
                            longitude: stop.address.longitude,
                        });
                    });
                    return {
                        data: stopsData,
                        total: 20,
                    };
                case 'users':
                    const usersData = json.users.map(user => {
                        return ({
                            id: user.id,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                            contact_no: user.contact_no,
                            user_role: user.user_role,
                            username: user.username,
                            displayname: `${user.first_name}  ${user.last_name}, ${user.user_role}`,
                            is_active: user.is_active
                        });
                    });
                    return {
                        data: usersData,
                        total: 20,
                    };
                case 'phi':
                    const data = json.map(item => {
                        return ({
                            id: item.patient.id,
                            firstName: item.patient.firstName,
                            lastName: item.patient.lastName,
                            primaryContact: item.patient.primaryContact,
                            streetAddress: item.patient.address.streetAddress,
                            apartmentNo: item.patient.address.apartmentNo,
                            zipCode: item.patient.address.zipCode,
                            city: item.patient.address.city,
                            state: item.patient.address.state,
                            country: item.patient.address.country,
                            latitude: item.patient.address.latitude,
                            longitude: item.patient.address.longitude,
                            userIds: item.userIds
                        });
                    });
                    return {
                        //data: json.map(x => x),
                        data: data,
                        total: 20
                    };
                case 'physicians':
                    const physicianData = json.map(item => {
                        return ({
                            id: item.physicianID,
                            npi: item.npi,
                            firstName: item.firstName,
                            lastName: item.lastName,
                            phone1: item.phone1,
                            phone2: item.phone2,
                            fax: item.fax,
                            displayname: `${item.lastName} ${item.firstName}`
                        });
                    });
                    return {
                        //data: json.map(x => x),
                        data: physicianData,
                        total: 20
                    };
                case 'reports':
                    const reportsMetaData = json.map(item => {
                        // Todo: Name generation hardcoded
                        const name = item.user.lastName? item.user.lastName + (item.user.firstName ? ` ${item.user.firstName}` : '') : item.user.username;
                        const createdAt = parseIsoDateToString(item.created_at, false);
                        const reportName = `${createdAt}_Miles_Report`;
                        return ({
                            id: item.id,
                            name: name,
                            reportName: reportName,
                            itemCount: item.itemCount,
                            updatedAt: parseIsoDateToString(item.updated_at),
                        });
                    });
                    return {
                        data: reportsMetaData,
                        total: reportsMetaData.length
                    };
                default:
                    return {
                        data: json.map(x => x),
                        total: 20,
                    };
            }
        case GET_MANY:
            // console.log('EXECUTED GET_MANY for:', resource);
            switch(resource) {
                case 'users':
                    var orgName = localStorage.getItem('organizationName');
                    if(orgName != json.organization.name) {
                        localStorage.setItem('organizationName', json.organization.name);
                        // Hacky, react-router does advice to use window.location.reload()
                        // Invoke a refresh action provided by react-admin
                        window.location.reload();
                    }
                    const usersData = json.users.map(user => {
                        return ({
                            id: user.id,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                            contact_no: user.contact_no,
                            username: user.username,
                            displayname: `${user.first_name}  ${user.last_name}, ${user.user_role}`,
                        });
                    });
                    return {
                        data: usersData,
                        total: 20
                    };
                default:
                    return {
                        data: json.map(x => x),
                        total: 20,
                    };
            }


        // case CREATE:
        //     // console.log('Type:', type);
        //     // console.log('resource:', resource);
        //     // console.log('params.data:', params.data);
        //     console.log('Params:', params);
        //     console.log('id:', json.id);
        //     return { data: { ...params.data} };

        case GET_ONE:
            switch (resource) {
                case 'phi':
                    return {
                        data: {
                            "id": json.patient.id,
                            "firstName": json.patient.firstName,
                            "lastName": json.patient.lastName,
                            "primaryContact": json.patient.primaryContact,
                            "dob": json.patient.dob,
                            "emergencyContactName": json.patient.emergencyContactName,
                            "emergencyContactNumber": json.patient.emergencyContactNumber,
                            "emergencyContactRelationship": json.patient.emergencyContactRelationship,
                            "streetAddress": json.patient.address.streetAddress,
                            "apartmentNo": json.patient.address.apartmentNo,
                            "latitude": json.patient.address.latitude,
                            "longitude": json.patient.address.longitude,
                            "city": json.patient.address.city,
                            "state": json.patient.address.state,
                            "country": json.patient.address.country,
                            "zipCode": json.patient.address.zipCode,
                            "userIds": json.userIds,
                            "physician_id": json.physicianId,
                        }
                    };
                    // Karthik
                case 'stops':
                    return {
                        data: {
                            "id": json.placeID,
                            "name": json.name,
                            "contactNumber": json.contactNumber,
                            "streetAddress": json.address.streetAddress,
                            "latitude": json.address.latitude,
                            "longitude": json.address.longitude,
                            "city": json.address.city,
                            "state": json.address.state,
                            "country": json.address.country,
                            "zipCode": json.address.zipCode,
                        }
                    };
                case 'physicians':
                    return {
                        data: {
                            "id": json.physicianID,
                            "npi": json.npi,
                            "firstName": json.firstName,
                            "lastName": json.lastName,
                            "phone1": json.phone1,
                            "phone2": json.phone2,
                            "fax": json.fax,
                            "displayname": `${json.lastName} ${json.firstName}`
                        }
                    };
                case 'users':
                    return {
                        data: {
                            "id": json.user.id,
                            "first_name": json.user.first_name,
                            "last_name": json.user.last_name,
                            "password": '',
                            "contact_no": json.user.contact_no,
                            "user_role": json.user.user_role,
                            "email": json.user.email,
                            "is_active": json.user.is_active
                        }
                    };
                case 'reports':
                    if(json && json.length > 0) {
                        const innerData = json.map(item => {
                            let totalMiles = '-';
                            let odometerStart = '-';
                            let odometerEnd = '-';
                            let milesComments = '-';
                            if (item.visit.visitMiles) {
                                odometerStart = (typeof(item.visit.visitMiles.odometerStart) === 'number') ? parseFloat(item.visit.visitMiles.odometerStart).toFixed(2) : '-';
                                odometerEnd = (typeof(item.visit.visitMiles.odometerEnd) === 'number') ? parseFloat(item.visit.visitMiles.odometerEnd).toFixed(2) : '-';
                                milesComments = item.visit.visitMiles.milesComments ? item.visit.visitMiles.milesComments : '-';

                                if (typeof(item.visit.visitMiles.odometerStart) === 'number' &&
                                    typeof(item.visit.visitMiles.odometerEnd) === 'number') {
                                    totalMiles = parseFloat(parseFloat(item.visit.visitMiles.odometerEnd).toFixed(2) - parseFloat(item.visit.visitMiles.odometerStart).toFixed(2)).toFixed(2);
                                } else {
                                    totalMiles = '-';
                                }
                            }
                            return ({
                                'reportID': item.reportID ? item.reportID : '',
                                'reportCreatedAt': item.reportCreatedAt ? item.reportCreatedAt : '',
                                'userName': item.visit.user ? item.visit.user : '',
                                'visitID': item.visit.visitID ? item.visit.visitID : '',
                                'name': item.visit.name ? item.visit.name : '',
                                'address': item.visit.address ? item.visit.address : '',
                                'odometerStart': odometerStart,
                                'odometerEnd': odometerEnd,
                                'milesComments': milesComments,
                                'totalMiles': totalMiles
                            });
                        });
                        // console.log('extracted innerData:', innerData);
                        if(innerData && innerData.length > 0){
                            const userName = innerData[0].userName;
                            const reportName = parseIsoDateToString(innerData[0].reportCreatedAt, false);
                            const title = `${userName} ${reportName}_Miles_Report`;
                            const data = {
                                id: innerData[0].reportID,
                                userName: userName,
                                reportName: reportName,
                                title: title,
                                visits: innerData
                            };
                            return {
                                data: data
                            };
                        }
                    }
                    console.log('Sending empty response from data provider ...');
                    // Todo: Handle empty responses here ???
                    return {
                        data: {
                            id: '',
                            userName: '',
                            visits: [{
                                'reportID': '',
                                'userName': '',
                                'visitID': '',
                                'name': '',
                                'address': '',
                                'odometerStart': '',
                                'odometerEnd': '',
                                'milesComments': '',
                                'totalMiles': ''
                            }]
                        }
                    };
                default:
                    return {data: json};
            }

        default:
            return {data: json};
    }
};

/**
 * @param {string} type Request type, e.g GET_LIST
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the request type
 * @returns {Promise} the Promise for response
 */
export default (type, resource, params) => {
    const { fetchJson } = fetchUtils;
    const {url, options} = convertDataProviderRequestToHTTP(type, resource, params);
    return fetchJson(url, options)
        .then(response => {
            return convertHTTPResponseToDataProvider(response, type, resource, params)
        })
        .catch((error) => {
            // if(error.toString().includes('HttpError: Unauthorized')) {
            //     throw new Error('Timed out, please Login')
            // }
            // Todo: Remove this hack
            // localStorage.removeItem('access_token');
            // window.location.reload();
            if(resource === 'users' && (type === 'CREATE' || type === 'UPDATE')) {
                throw new Error(`User with this Email already registered`);
            }
        });
};