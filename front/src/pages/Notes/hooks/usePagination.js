import { useState, useEffect } from 'react'
/**
 * @module
 * @name hook/usePagination
 * @description This module is takes a fetcher function and returns data, network, and actions
 * to facilitate the pagination workflow.
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
 * @type {object}
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
 * @typedef InternalState
 * @type {object}
 * @property {boolean} loading
 * @property {boolean} loaded
 * @property {string | false} errorMessage
 * @property {Note[]} list
 * @property {string | null} next
 * @property {Record<number, {items: Note[], next: string}>} cache
 * @property {number} pageNumber
 */
const initialState = {
    loading: true,
    loaded: false,
    errorMessage: false,
    list: [],
    next: null,
    cache: {},
    pageNumber: 1
}

/**
 * @name usePagination
 * @param {function} apiCall
 * @returns {HookResponse}
 */
const usePagination = (apiCall) => {
    const [state, updateState] = useState(initialState)

    /**
     * Make initial api call
     */
    useEffect(() => {
        apiCall(null)
            .then((data) => {
                updateState({
                    ...initialState,
                    loading: false,
                    loaded: true,
                    list: data.items,
                    errorMessage: false,
                    next: data.next,
                    pageNumber: 1,
                    cache: {
                        1: {
                            next: data.next,
                            items: data.items
                        }
                    }
                })
            })
            .catch((e) => {
                updateState({
                    ...initialState,
                    errorMessage: e.message
                })
            })
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
        updateState({
            ...state,
            loading: true
        })
        try {
            const data = await apiCall(cursor)
            updateState({
                ...state,
                loading: false,
                loaded: true,
                list: data.items,
                next: data.next,
                cache: {
                    ...state.cache,
                    [page]: {
                        next: data.next,
                        items: data.items
                    }
                },
                pageNumber: page
            })
        } catch (e) {
            updateState({
                ...state,
                errorMessage: e.message
            })
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
        if (!state.cache[state.pageNumber].next) {
            return
        }

        const nextIndex = state.pageNumber + 1
        if (state.cache[nextIndex]) {
            updateState({
                ...state,
                list: state.cache[nextIndex].items,
                pageNumber: nextIndex
            })
            return
        }

        getDataWithFetcher(state.next, nextIndex)
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
        if (state.pageNumber === 1) {
            return
        }

        const prevIndex = state.pageNumber - 1
        if (state.cache[prevIndex]) {
            updateState({
                ...state,
                list: state.cache[prevIndex].items,
                pageNumber: prevIndex
            })

            return
        }

        await getDataWithFetcher(state.cache[state.pageNumber].next, prevIndex)
    }

    return {
        network: {
            loading: state.loading,
            error: state.errorMessage,
            loaded: state.loaded
        },
        data: {
            list: state.list,
            pageNumber: state.pageNumber,
            isBeginning: state.pageNumber === 1,
            isEnd:
                state.cache[state.pageNumber] &&
                !state.cache[state.pageNumber].next
        },
        actions: {
            back: prevPage,
            next: nextPage
        }
    }
}

export default usePagination
