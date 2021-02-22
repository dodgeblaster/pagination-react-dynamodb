import { useState, useEffect } from 'react'
/**
 * @module
 * @name hook/usePagination
 * @description This module is takes a fetcher function and returns data, network, and actions
 * to facilitate the pagination workflow.
 *
 * @example
 * const notesFetcher = (cursor) => fetch(`https://myNotesUrl.com?cursor=${cursor}`)
 * const { network, data, actions } = usePagination(notesFetcher)
 */

/**
 * @typedef PaginationData
 * @type {object}
 * @property {object[]} list - list of items
 * @property {number} pageNumber - current page number
 * @property {boolean} isBeginning - to help with presentation logic
 * @property {boolean} isEnd - to help with presentation logic
 */

/**
 * @typedef NetworkState
 * @type {obje2ct}
 * @property {boolean} loading - to show a loading screen
 * @property {string | boolean} error - will show error message or false if no error is thrown
 * @property {boolean} loaded - which communciates that we have successfuly fetched the data
 */

/**
 * @typedef PaginationActions
 * @type {object}
 * @property {function} back - will reference the pageNumber state and cursors, and load data for previous page
 * @property {function} next - will reference the pageNumber state and cursors, and load data for next page
 */

/**
 * @typedef HookResponse
 * @type {object}
 * @property {PaginationData} data
 * @property {NetworkState} network
 * @property {PaginationActions} actions
 */

/**
 * @name usePagination
 * @param {function} apiCall
 * @returns {HookResponse}
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
     * This function will use the passed in fetcher function to make an api call.
     * Once it as received the data, it will
     * - update loading state
     * - update list with new data
     * - update the next cursor
     * - update cache
     * - update current page number
     * @name getDataWithFetcher
     * @param {string} cursor
     * @param {number} page
     * @returns {void}
     */
    const getDataWithFetcher = async (cursor, page) => {
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
     * This function will first check if we have a next cursor to use.
     * If we dont, then we cant make a call, so will short circuit by
     * returning early. This covers the scenario where we are at the
     * end of our list.
     *
     * If we do have a next cursor, we then check if we already have
     * the results in our cache, if so, then return those results
     *
     * Otherwise, make an api call.
     *
     * @name nextPage
     * @returns {void}
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

        getDataWithFetcher(next, nextIndex)
    }

    /**
     * This function will first check if we are on page 1. If so,
     * we will short circuit by returning early, because we are
     * at the beginning of the list.
     *
     * If we are not at the beginning, we then check if we already have
     * the results in our cache, if so, then return those results
     *
     * Otherwise, make an api call.
     *
     * @name prevPage
     * @returns {void}
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

        await getDataWithFetcher(cache[pageNumber], prevIndex)
    }

    return {
        network: {
            loading,
            error: errorMessage,
            loaded
        },
        data: {
            list,
            pageNumber: pageNumber,
            isBeginning: pageNumber === 1,
            isEnd: cache[pageNumber] && !cache[pageNumber].next
        },
        actions: {
            back: prevPage,
            next: nextPage
        }
    }
}

export default usePagination
