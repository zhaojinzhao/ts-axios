import axios from '../../src/axios'
import qs from 'qs'
import { AxiosTransformer } from '../../src/types'

axios.defaults.headers.common['test2'] = 123

axios({
    url: '/config/post',
    method: 'post',
    data: qs.stringify({
        a: 1
    }),
    headers: {
        test: 321
    }
}).then(res => {
    console.log(res.data)
}).catch()

// demo：请求和响应配置化
axios({
    transformRequest: [(data => {
        return qs.stringify(data)
    }), ...(axios.defaults.transformRequest as AxiosTransformer[])],
    transformResponse: [
        ...(axios.defaults.transformResponse as AxiosTransformer[]), data => {
            if (typeof data === 'object') {
                data.b = 2
            }
            return data
        }
    ],
    url: '/config/post',
    method: 'post',
    data: {
        a: 1
    }
}).then(res => {
    console.log(res.data)
}).catch()

// demo: axios.create创建实例化
const instance = axios.create({
    transformRequest: [(data => {
        return qs.stringify(data)
    }), ...(axios.defaults.transformRequest as AxiosTransformer[])],
    transformResponse: [
        ...(axios.defaults.transformResponse as AxiosTransformer[]), data => {
            if (typeof data === 'object') {
                data.b = 2
            }
            return data
        }
    ]
})

instance({
    url: '/config/post',
    method: 'post',
    data: {
        a: 1
    }
}).then(res => {
    console.log(res.data)
}).catch()
