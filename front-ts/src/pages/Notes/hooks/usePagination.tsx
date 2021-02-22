import { useState, useEffect } from 'react'
import { Note } from '../types'

type HookResponse = {
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

type ApiResponse = {
    items: Note[]
    next: string
}

type Fetcher = (cursor: string | null) => Promise<ApiResponse>

/**
 * This module is takes a fetcher function and returns data, network, and actions
 * to facilitate the pagination workflow.
 */
const usePagination = (apiCall: Fetcher): HookResponse => {
    const [loading, updateLoading] = useState<boolean>(true)
    const [loaded, updateLoaded] = useState<boolean>(false)
    const [errorMessage, updateErrorMessage] = useState<string | false>(false)
    const [list, updateList] = useState<Array<Note>>([])
    const [next, updateNext] = useState<string | null>(null)
    const [cache, updateCache] = useState<Record<number, ApiResponse>>({})
    const [pageNumber, updatePageNumber] = useState(1)

    /**
     * Make initial api call
     */
    useEffect(() => {
        apiCall(null)
            .then((data: ApiResponse) => {
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
     */
    const getDataWithFetcher = async (
        cursor: string | null,
        page: number
    ): Promise<void> => {
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
     */
    const nextPage = async (): Promise<void> => {
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
     */
    const prevPage = async (): Promise<void> => {
        if (pageNumber === 1) {
            return
        }

        const prevIndex = pageNumber - 1
        if (cache[prevIndex]) {
            updateList(cache[prevIndex].items)
            updatePageNumber(prevIndex)
            return
        }

        await getDataWithFetcher(cache[pageNumber].next, prevIndex)
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
