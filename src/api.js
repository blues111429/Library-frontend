// 默认地址
const api = 'http://localhost:8080/api';


export const loginUrl = api + '/user/login';
export const registerUrl = api + '/user/register';

// 通用请求封装
export const myFetch = async (url, method = 'GET', data = null) => {
    const options = {
        method,
        headers: {
            'Content-Type' : 'application/json'
        }
    };

    if(data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        if(!response.ok) throw new Error('网络错误:' + response.status);

        const result = await response.json();
        return result;
    } catch( err ) {
        console.log('请求失败:' + err);
        throw err;
    }
};


// localstorage封装
export const myGetStorage = (key) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}