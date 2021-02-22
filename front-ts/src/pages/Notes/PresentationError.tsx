import React from 'react'
import Note from './components/Note'
import PaginationControls from './components/PaginationControls'

type PaginationErrorProps = {
    pageNumber: number
    children: any
}

/**
 * @name Pagination/PresentationError
 * @component
 * @example
 * <PresentationError pageNumber={1}>
 *    There was a problem
 * </PresentationError>
 */
function PaginationError(props: PaginationErrorProps) {
    return (
        <div className="h-screen bg-gray-100 flex items-center justify-center flex-col">
            <p className="w-96 mb-2 text-3xl font-bold text-gray-300">
                My Notes
            </p>
            <div className=" w-96 bg-white shadow-md rounded relative">
                <div className="absolute top-2 left-2 right2 bg-red-700 text-white rounded px-2 py-2">
                    {props.children}
                </div>
                <div className="divide-y divide-gray-100">
                    <Note key={'empty-1'} />
                    <Note key={'empty-2'} />
                    <Note key={'empty-3'} />
                    <Note key={'empty-4'} />
                </div>
            </div>
            <PaginationControls pageNumber={props.pageNumber} />
        </div>
    )
}

export default PaginationError
