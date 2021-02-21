import React from 'react'
import usePagination from './hooks/usePagination'
import PresentationError from './PresentationError'
import PresentationLoading from './PresentationLoading'
import PresentationSuccess from './PresentationSuccess'

/**
 * @typedef NotesResponse
 * @type {object}
 * @property {object[]} items - list of notes to show
 * @property {string} next - string representing the cursor for the next paginated call
 */

/**
 * @name NotesFetcher
 * @param {string} cursor - if not provided, will default to null
 * @returns {Promise<NotesResponse>}
 */
const notesFetcher = async (cursor = null) => {
    const x = await fetch(process.env.REACT_APP_URL, {
        method: 'POST',
        body: JSON.stringify({
            cursor: cursor
        })
    })

    const data = await x.json()
    return data
}

/**
 * @name PaginationContainer
 * @component
 * @example
 * <PaginationContainer/>
 */
function PaginationContainer() {
    const { network, data, actions } = usePagination(notesFetcher)

    if (network.error) {
        return (
            <PresentationError pageNumber={data.pageNumber}>
                {network.error}
            </PresentationError>
        )
    }

    if (network.loading) {
        return <PresentationLoading pageNumber={data.pageNumber} />
    }

    return (
        <PresentationSuccess
            list={data.list}
            isBeginning={data.isBeginning}
            isEnd={data.isEnd}
            pageNumber={data.pageNumber}
            next={actions.next}
            back={actions.back}
        />
    )
}

export default PaginationContainer
