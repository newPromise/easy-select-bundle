function debounce(fn, waitTime) {
    let timer = null
    return () => {
       if (timer) {
           clearTimeout(timer)
           timer = null
       }
        timer = setTimeout(() => {
            fn && fn()
        }, waitTime)
    }
}

export { debounce }