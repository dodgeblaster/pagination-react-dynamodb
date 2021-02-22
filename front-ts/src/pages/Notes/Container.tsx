import React from 'react'
import usePagination from './hooks/usePagination'
import PresentationError from './PresentationError'
import PresentationLoading from './PresentationLoading'
import PresentationSuccess from './PresentationSuccess'

const notesFetcher = async (cursor: string | null) => {
    const url: string = process.env.REACT_APP_URL || ''
    const x = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            cursor: cursor
        })
    })

    const data = await x.json()
    return data
}

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
