import React from 'react'
import PropTypes from 'prop-types'
import Note from './components/Note'
import PaginationControls from './components/PaginationControls'

/**
 * @name Pagination
 * @component
 * @example
 * <Pagination
 *      list={listOfData}
 *      isBeginning={false}
 *      isEnd={false}
 *      pageNumber={1}
 *      next={nextFunction}
 *      back={backFunction}
 *  />
 */
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

Pagination.propTypes = {
    list: PropTypes.array,
    paginationState: PropTypes.number.isRequired,
    isBeginning: PropTypes.bool,
    isEnd: PropTypes.bool,
    pageNumber: PropTypes.number,
    back: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired
}

export default Pagination
