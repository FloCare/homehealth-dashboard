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

const API_URL = 'http://app-9707.on-aptible.com';
// const API_URL = 'http://localhost:8000';

/**
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The Data Provider request params, depending on the type
 * @returns {Object} { url, options } The HTTP request parameters
 */
const convertDataProviderRequestToHTTP = (type, resource, params) => {
    console.log('');
    console.log('Converting Data Provider Call to HTTP Request on:');
    console.log('This called:', type, resource, params);
    console.log('');

    switch (type) {
        case GET_LIST: {
            // console.log('Running GET LIST for:', resource);
            // const {page, perPage} = params.pagination;
            // const {field, order} = params.sort;
            const query = {
                format: 'json',
                // sort: JSON.stringify([field, order]),
                // range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
                // filter: JSON.stringify(params.filter),
            };
            const options = {};
            options.headers = new Headers({Authorization: 'Token '+ localStorage.getItem('access_token')});
            switch(resource) {
                case 'users':
                    return { url: `${API_URL}/${resource}/v1.0/org-access/?${stringify(query)}`, options};
                case 'phi':
                    return { url: `${API_URL}/${resource}/v1.0/patients/?${stringify(query)}`, options};
                default:
                    throw new Error(`Unsupported fetch action type ${type}`);
            }
        }

        case GET_ONE:
            // console.log('Running GET ONE for:', resource);
            const options = {};
            options.headers = new Headers({Authorization: 'Token '+ localStorage.getItem('access_token')});
            switch(resource) {
                case 'phi':
                    return { url: `${API_URL}/${resource}/v1.0/patients/${params.id}/`, options };
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
            options.headers = new Headers({Authorization: 'Token '+ localStorage.getItem('access_token')});

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
                    // console.log('params:', params);
                    var body = {};
                    body.id=params.data.id;
                    body.users=params.data.userIds;
                    // console.log('Sending request with body:', body);
                    return {
                        url: `${API_URL}/${resource}/v1.0/patients/${params.id}/`,
                        options: { method: 'PUT', body: JSON.stringify(body), headers: new Headers({Authorization: 'Token '+ localStorage.getItem('access_token')})},
                    };
                default:
                    console.log('ERROR! Edit called on invalid resources.');
                    return {};
            }

        case CREATE:
            // console.log('Running CREATE for:', resource);
            switch(resource) {
                case 'phi':
                    var request = {};
                    params.data.address={"apartment_no": params.data.apartment_no,
                        "streetAddress": localStorage.getItem('streetAddress'),
                        "zipCode": localStorage.getItem('postalCode'),
                        "city": localStorage.getItem('cityName'),
                        "state": localStorage.getItem('stateName'),
                        "country": localStorage.getItem('countryName'),
                        "latitude": localStorage.getItem('latitude'),
                        "longitude": localStorage.getItem('longitude') };

                    request.patient = {};
                    request.patient.address = params.data.address;
                    request.patient.firstName = params.data.firstName;
                    request.patient.lastName = params.data.lastName;
                    request.patient.primaryContact = params.data.primaryContact;
                    request.patient.emergencyContact = params.data.secondaryContact;
                    request.users = params.data.users;
                    localStorage.removeItem('postalCode');
                    localStorage.removeItem('cityName');
                    localStorage.removeItem('stateName');
                    localStorage.removeItem('countryName');
                    localStorage.removeItem('latitude');
                    localStorage.removeItem('longitude');

                    return {
                        url: `${API_URL}/${resource}/v1.0/patients/?format=json`,
                        options: { method: 'POST', headers: new Headers({Authorization: 'Token '+ localStorage.getItem('access_token')}), body: JSON.stringify(request) },
                    };
                default:
                    console.log('ERROR! Edit called on invalid resources.')
                    return {};
            }

        case DELETE:
            // console.log('Running DELETE for:', resource);
            return {
                url: `${API_URL}/${resource}/v1.0/patients/${params.id}`,
                options: { method: 'DELETE', headers: new Headers({Authorization: 'Token '+ localStorage.getItem('access_token')}) },
            };

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
    // console.log('Converting API Response to Data Provider:', params);
    const {json} = response;
    switch (type) {

        case GET_LIST:
            // console.log('EXECUTED GET_LIST for:', resource);
            switch(resource) {
                case 'users':
                    // console.log('Users are:', json.users);
                    return {
                        data: json.users.map(x => x),
                        total: 20
                    };
                case 'phi':
                    const data = json.map(item => {
                        return ({
                            id: item.patient.id,
                            firstName: item.patient.firstName,
                            lastName: item.patient.lastName,
                            primaryContact: item.patient.primaryContact,
                            userIds: item.userIds
                        });
                    });
                    return {
                        //data: json.map(x => x),
                        data: data,
                        total: 20
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
                    // console.log('Users are:', json.users);
                    return {
                        data: json.users.map(x => x),
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
                    // console.log('Data from GET_ONE:', json);

                    return {
                        data: {
                            "id": json.id,
                            "firstName": json.patient.firstName,
                            "lastName": json.patient.lastName,
                            "primaryContact": json.patient.primaryContact,
                            "userIds": json.userIds
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
        .then(response => convertHTTPResponseToDataProvider(response, type, resource, params));
};