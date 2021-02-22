import React from 'react'
import PaginationControls from './PaginationControls'
export default {
    title: 'Pagination/PaginationControls',
    component: PaginationControls
}

export const Normal = () => (
    <PaginationControls
        pageNumber={12}
        back={() => console.log('BACK')}
        next={() => console.log('NEXT')}
        atTheBeginning={false}
        atTheEnd={false}
    />
)

export const AtTheBeginning = () => (
    <PaginationControls
        pageNumber={12}
        back={() => console.log('BACK')}
        next={() => console.log('NEXT')}
        atTheBeginning={true}
        atTheEnd={false}
    />
)

export const AtTheEnd = () => (
    <PaginationControls
        pageNumber={12}
        back={() => console.log('BACK')}
        next={() => console.log('NEXT')}
        atTheBeginning={false}
        atTheEnd={true}
    />
)
