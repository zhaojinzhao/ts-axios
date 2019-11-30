import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType, timeout, cancelToken } = config

    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }
    if (timeout) {
      request.timeout = timeout
    }

    // !：断言参数Url不为空
    request.open(method.toUpperCase(), url!, true)

    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        return
      }
      request.setRequestHeader(name, headers[name])
    })

    // 取消请求
    if (cancelToken) {
      cancelToken.promise
        .then(reason => {
          request.abort()
          reject(reason)
        })
        .catch()
    }
    request.send(data)

    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }

    request.onreadystatechange = () => {
      if (request.readyState !== 4) return
      if (request.status === 0) {
        return
      }

      const responseHeaders = request.getAllResponseHeaders()
      const responseData = responseType === 'text' ? request.responseText : request.response
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: parseHeaders(responseHeaders),
        config,
        request
      }

      // 处理非200状态码
      handleResponse(response)
    }

    // 网络异常错误
    request.onerror = () => {
      reject(createError('Network Error', config, null, request))
    }

    // 请求超时错误
    request.ontimeout = () => {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
    }
  })
}
