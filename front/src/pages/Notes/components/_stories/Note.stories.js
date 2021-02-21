import React from 'react'
import Note from '../Note'
export default {
    title: 'Pagination/Note',
    component: Note
}

export const Primary = () => (
    <div className=" w-96 bg-white shadow-md rounded">
        <div className="divide-y divide-gray-100">
            <Note title="Example Note 1" />
            <Note title="Example Note 2" />
            <Note title="Example Note 3" />
            <Note title="Example Note 4" />
        </div>
    </div>
)
export const Loading = () => (
    <div className=" w-96 bg-white shadow-md rounded">
        <div className="divide-y divide-gray-100">
            <Note loading={true} />
            <Note loading={true} />
            <Note loading={true} />
            <Note loading={true} />
        </div>
    </div>
)

export const Empty = () => (
    <div className=" w-96 bg-white shadow-md rounded">
        <div className="divide-y divide-gray-100">
            <Note />
            <Note />
            <Note />
            <Note />
        </div>
    </div>
)
