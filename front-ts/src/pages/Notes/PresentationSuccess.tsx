import React from 'react'
import NoteComponent from './components/Note'
import PaginationControls from './components/PaginationControls'
import { Note } from './types'
import analytics from '../../lib/analytics'

type PaginationProps = {
    pageNumber: number
    list: Note[]
    isBeginning: boolean
    isEnd: boolean
    next: () => Promise<void>
    back: () => Promise<void>
}

function Pagination(props: PaginationProps) {
    let empty = props.list.length > 4 ? 0 : 4 - props.list.length

    const handleButtonClick = () => {
        analytics({
            name: 'BuyButton',
            value: 1
        })
    }

    return (
        <div className="h-screen bg-gray-100 flex items-center justify-center flex-col">
            <p className="w-96 mb-2 text-3xl font-bold text-gray-300">
                My Notes <button onClick={handleButtonClick}>Buy</button>
            </p>
            <div className=" w-96 bg-white shadow-md rounded">
                <div className="divide-y divide-gray-100">
                    {props.list.map((x) => (
                        <NoteComponent key={x.sk} title={x.title} />
                    ))}
                    {Array.from({ length: empty }).map((x, i) => (
                        <NoteComponent key={'blank-' + i} title={''} />
                    ))}
                </div>
            </div>
            <PaginationControls
                back={props.back}
                next={props.next}
                atTheBeginning={props.isBeginning}
                atTheEnd={props.isEnd}
                pageNumber={props.pageNumber}
            />
        </div>
    )
}

export default Pagination
