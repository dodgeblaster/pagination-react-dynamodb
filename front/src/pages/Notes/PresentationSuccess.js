import React from 'react'
import Note from './components/Note'
import PaginationSection from './components/Pagination'

function Pagination(props) {
    let empty = props.list.length > 4 ? 0 : 4 - props.list.length

    return (
        <div className="h-screen bg-gray-100 flex items-center justify-center flex-col">
            <p className="w-96 mb-2 text-3xl font-bold text-gray-300">
                My Notes
            </p>
            <div className=" w-96 bg-white shadow-md rounded">
                <div className="divide-y divide-gray-100">
                    {props.list.map((x) => (
                        <Note key={x.sk} title={x.title} />
                    ))}
                    {Array.from({ length: empty }).map((x, i) => (
                        <Note key={'blank-' + i} title={''} />
                    ))}
                </div>
            </div>
            <PaginationSection
                back={props.back}
                next={props.next}
                atTheBeginning={props.isBeginning}
                atTheEnd={props.isEnd}
                paginationState={props.pageNumber}
            />
        </div>
    )
}

export default Pagination
