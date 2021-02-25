import { useState, useEffect } from 'react'
import { Note } from '../types'

/**
 * A function that takes a cursor, and returns data
 */
export type UsePaginationInput = {
    fetcher: (cursor: string | null) => Promise<ApiResponse>
}

type ApiResponse = {
    items: Note[]
    next: string
}

/**
 * Data, Network, and Action objects will be returned from this hook
 */
export type UsePaginationOutput = {
    data: {
        list: Note[]
        pageNumber: number
        isBeginning: boolean
        isEnd: boolean
    }
    network: {
        loading: boolean
        error: string | boolean
        loaded: boolean
    }
    actions: {
        back: () => Promise<void>
        next: () => Promise<void>
    }
}

/**
 * Internal State for the Pagination app is accomplished with 1 useState hook
 */
type InternalState = {
    loading: boolean
    loaded: boolean
    errorMessage: string | false
    list: Note[]
    next: string | null
    cache: Record<number, ApiResponse>
    pageNumber: number
}

const initialState: InternalState = {
    loading: true,
    loaded: false,
    errorMessage: false,
    list: [],
    next: null,
    cache: {},
    pageNumber: 1
}

/**
 * This module is takes a fetcher function and returns data, network, and actions
 * to facilitate the pagination workflow.
 */
export default function usePagination({
    fetcher
}: UsePaginationInput): UsePaginationOutput {
    const [state, updateState] = useState(initialState)

    /**
     * Make initial api call
     */
    useEffect(() => {
        fetcher(null)
            .then((data: ApiResponse) => {
                updateState({
                    ...state,
                    loading: false,
                    loaded: true,
                    list: data.items,
                    next: data.next,
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
                    ...state,
                    errorMessage: e.message
                })
            })
    }, [fetcher])

    /**
     * This function will use the passed in fetcher function to make an api call.
     * Once it as received the data, it will
     * - update loading state
     * - update list with new data
     * - update the next cursor
     * - update cache
     * - update current page number
     */
    const getDataWithFetcher = async (
        cursor: string | null,
        page: number
    ): Promise<void> => {
        updateState({
            ...state,
            loading: true
        })
        try {
            const data = await fetcher(cursor)
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
     */
    const nextPage = async (): Promise<void> => {
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
     */
    const prevPage = async (): Promise<void> => {
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
