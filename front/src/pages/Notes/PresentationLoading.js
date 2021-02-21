import React from 'react'
import PropTypes from 'prop-types'
import Note from './components/Note'
import PaginationSection from './components/Pagination'

function PaginationLoading(props) {
    return (
        <div className="h-screen bg-gray-100 flex items-center justify-center flex-col">
            <p className="w-96 mb-2 text-3xl font-bold text-gray-300">
                My Notes
            </p>
            <div className=" w-96 bg-white shadow-md rounded">
                <div className="divide-y divide-gray-100">
                    <Note key={'empty-1'} loading={true} />
                    <Note key={'empty-2'} loading={true} />
                    <Note key={'empty-3'} loading={true} />
                    <Note key={'empty-4'} loading={true} />
                </div>
            </div>
            <PaginationSection pageNumber={props.pageNumber} />
        </div>
    )
}

PaginationLoading.propTypes = {
    pageNumber: PropTypes.number.isRequired
}

export default PaginationLoading
