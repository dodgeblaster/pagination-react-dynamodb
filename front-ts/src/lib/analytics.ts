let ANALYTICS_USER_ID: string

function sendToAnalytics(metric: any) {
    if (!ANALYTICS_USER_ID) {
        ANALYTICS_USER_ID = metric.id
    }

    if (!metric.id) {
        metric.id = ANALYTICS_USER_ID
    }

    //console.log('mm== ', metric)
    const url: string = process.env.REACT_APP_ANALYTICS_ENDPOINT || ''
    const data = { name: metric.name, value: metric.value, id: metric.id }
    if (navigator.sendBeacon) {
        navigator.sendBeacon(url, JSON.stringify(data))
    } else {
        fetch(url, {
            body: JSON.stringify(data),
            method: 'POST',
            keepalive: true
        })
    }
}

export default sendToAnalytics
