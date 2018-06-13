
const FetchUsers = () => {

    const getUsers = async () => {
        const res = await fetch('http://app-9707.on-aptible.com/users/v1.0/view?format=json').then((resp) => {
            return resp.json();
        }).then((resp) => {
            return resp;
        });
    //console.log(something[0].id);
        console.log('res = ', res);
        return res;
    };

    console.log('fetching users');
    var resp = getUsers();
    console.log('Resp is:', resp);
    // var list = [
    //                 { id: '1', name: 'John' },
    //                 { id: '2', name: 'Doe' },
    //                 { id: '3', name: 'Reed' },
    //                 { id: '4', name: 'June' },
    //                 { id: '5', name: 'Ted' },
    //             ];
    // return list; 
    //return resp;
};


export {FetchUsers};
