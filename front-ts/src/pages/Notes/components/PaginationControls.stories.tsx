import React from 'react'
import PaginationControls from './PaginationControls'
export default {
    title: 'Pagination/PaginationControls',
    component: PaginationControls
}

const backFn = async () => console.log('BACK')
const nextFn = async () => console.log('NEXT')

export const Normal = () => (
    <PaginationControls
        pageNumber={12}
        back={backFn}
        next={nextFn}
        atTheBeginning={false}
        atTheEnd={false}
    />
)

export const AtTheBeginning = () => (
    <PaginationControls
        pageNumber={12}
        back={backFn}
        next={nextFn}
        atTheBeginning={true}
        atTheEnd={false}
    />
)

export const AtTheEnd = () => (
    <PaginationControls
        pageNumber={12}
        back={backFn}
        next={nextFn}
        atTheBeginning={false}
        atTheEnd={true}
    />
)
