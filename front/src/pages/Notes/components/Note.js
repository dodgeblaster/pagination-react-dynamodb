import React from 'react'
import PropTypes from 'prop-types'

const Icon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        height="20"
        className="mr-3 text-purple-300"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
    </svg>
)

/**
 * @name Pagination/Component/Note
 * @component
 * @example
 * <Note title="Example Note 1" />
 */
function Note(props) {
    if (props.loading) {
        return (
            <div className="flex items-center px-3 h-14">
                <Icon />
                <div className="h-2 w-10 rounded bg-gray-100"></div>
                <div className="ml-auto h-1 w-16 rounded bg-gray-100"></div>
            </div>
        )
    }
    if (!props.title || props.title.length === 0) {
        return <div className="flex items-center px-3 h-14"></div>
    }
    return (
        <div className="flex items-center px-3 h-14">
            <Icon />
            <p className="text-gray-800">{props.title}</p>
            <p className="ml-auto text-gray-300 text-xs">Added on Jan 30th</p>
        </div>
    )
}

Note.propTypes = {
    loading: PropTypes.bool,
    title: PropTypes.string
}

export default Note
