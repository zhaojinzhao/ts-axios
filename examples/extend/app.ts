import axios from '../../src/index'

axios({
    url: '/extend/post',
    method: 'post',
    data: {
        msg: 'hi'
    }
})

axios.request({
    url: '/extend/post',
    method: 'post',
    data: {
        msg: 'hello'
    }
})

axios.get('/extend/get')
axios.options('/extend/options')
axios.head('/extend/head')
axios.delete('/extend/delete')

axios.post('/extend/post', { msg: 'post' })
axios.put('/extend/put', { msg: 'put' })
axios.patch('/extend/patch', { msg: 'patch' })


// 函数重载

axios({
    url: '/extend/post',
    method: 'post',
    data: {
        msg: 'hi'
    }
})

axios('/extend/post', {
    method: 'post',
    data: {
        msg: 'hello'
    }
})

// 响应数据支持泛型
interface ResposeData<T = any> {
    code: number
    result: T
    message: string
}
interface User {
    name: string
    age: number
}

function getUser<T>() {
    return axios<ResposeData<T>>('/extend/user')
        .then(res => res.data)
        .catch(err => console.error(err))
}
async function test() {
    const user = await getUser<User>()
    if (user) {
        console.log(user.result.name);
    }
}
test().catch()
