import { useState, useEffect } from 'react'

/**
 * @typedef PaginationData
 * @type {object}
 * @property {object[]} list - list of items
 * @property {number} pageNumber - current page number
 * @property {boolean} isBeginning - to help with presentation logic
 * @property {boolean} isEnd - to help with presentation logic
 *
 */

/**
 * @typedef NetworkState
 * @type {object}
 * @property {boolean} loading - to show a loading screen
 * @property {string | boolean} error - will show error message or false if no error is thrown
 * @property {boolean} loaded - which communciates that we have successfuly fetched the data
 *
 */

/**
 * @typedef PaginationActions
 * @type {object}
 * @property {function} back - will reference the pageNumber state and cursors, and load data for previous page
 * @property {function} next - will reference the pageNumber state and cursors, and load data for next page
 *
 */

/**
 * @typedef HookResponse
 * @type {object}
 * @property {PaginationData} data
 * @property {NetworkState} network
 * @property {PaginationActions} actions
 *
 */

/**
 * Use Pagination
 * @param {function} apiCall
 * @returns {HookResponse}
 *
 */
const usePagination = (apiCall) => {
    const [loading, updateLoading] = useState(true)
    const [loaded, updateLoaded] = useState(false)
    const [errorMessage, updateErrorMessage] = useState(false)
    const [list, updateList] = useState([])
    const [next, updateNext] = useState(null)
    const [cache, updateCache] = useState({})
    const [pageNumber, updatePageNumber] = useState(1)

    /**
     * Make initial api call
     *
     */
    useEffect(() => {
        apiCall(null)
            .then((data) => {
                updateLoading(false)
                updateLoaded(true)
                updateList(data.items)
                updateNext(data.next)
                updateCache({
                    1: {
                        next: data.next,
                        items: data.items
                    }
                })
            })
            .catch((e) => updateErrorMessage(e.message))
    }, [apiCall])

    /**
     * Get List
     * This function either be called to go to the next page, or go back a page
     * @param {string} cursor
     * @param {number} page
     * @returns {void} void
     *
     */
    const getList = async (cursor, page) => {
        updateLoading(true)
        try {
            const data = await apiCall(cursor)
            updateLoaded(true)
            updateLoading(false)
            updateList(data.items)
            updateNext(data.next)
            updateCache({
                ...cache,
                [page]: {
                    next: data.next,
                    items: data.items
                }
            })
            updatePageNumber(page)
        } catch (e) {
            updateErrorMessage(e.message)
        }
    }

    /**
     * Next Page
     * This function will first check if we have a next cursor to use.
     * If we dont, then we cant make a call, so we return silently. This
     * covers the scenario where we are at the end of our list.
     *
     * If we do have a next cursor, we then check if we already have
     * the results in our cache, if so, then return those results
     *
     * Otherwise, make an api call.
     *
     * @returns {void} void
     *
     */
    const nextPage = async () => {
        if (!cache[pageNumber].next) {
            return
        }

        const nextIndex = pageNumber + 1
        if (cache[nextIndex]) {
            updateList(cache[nextIndex].items)
            updatePageNumber(nextIndex)
            return
        }

        getList(next, nextIndex)
    }

    /**
     * Prev Page
     * This function will first check if we are on page 1. If so,
     * return silently, because we are at the beginning of the list.
     *
     * If we are not at the beginning, we then check if we already have
     * the results in our cache, if so, then return those results
     *
     * Otherwise, make an api call.
     *
     * @returns {void} void
     *
     */
    const prevPage = async () => {
        if (pageNumber === 1) {
            return
        }

        const prevIndex = pageNumber - 1
        if (cache[prevIndex]) {
            updateList(cache[prevIndex].items)
            updatePageNumber(prevIndex)
            return
        }

        await getList(cache[pageNumber], prevIndex)
    }

    const data = {
        list,
        pageNumber: pageNumber,
        isBeginning: pageNumber === 1,
        isEnd: cache[pageNumber] && !cache[pageNumber].next
    }

    const network = {
        loading,
        error: errorMessage,
        loaded
    }

    const actions = {
        back: prevPage,
        next: nextPage
    }

    return {
        network,
        data,
        actions
    }
}

export default usePagination
