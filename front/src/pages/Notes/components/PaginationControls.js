import React from 'react'
import PropTypes from 'prop-types'

/**
 * @component
 * @example
 * <PaginationControls
 *      pageNumber={12}
 *      back={() => console.log('BACK')}
 *      next={() => console.log('NEXT')}
 *      atTheBeginning={false}
 *      atTheEnd={false}
 * />
 */
function PaginationControls(props) {
    const activeButtonStyles = `py-2 px-3 rounded bg-purple-700 text-white text-xs`
    const disabledButtonStyles = `py-2 px-3 rounded bg-purple-200 text-white text-xs cursor-not-allowed`

    const emptyFn = () => {}

    return (
        <div className="flex justify-between items-center mt-2 w-96">
            <button
                disabled={props.atTheBeginning}
                className={
                    props.atTheBeginning
                        ? disabledButtonStyles
                        : activeButtonStyles
                }
                onClick={props.back || emptyFn}
            >
                Back
            </button>
            <p className="px-5 py-2 mx-2 text-xs rounded flex justify-center flex-1 ">
                {props.pageNumber}
            </p>
            <button
                disabled={props.atTheEnd}
                onClick={props.next || emptyFn}
                className={
                    props.atTheEnd ? disabledButtonStyles : activeButtonStyles
                }
            >
                Next
            </button>
        </div>
    )
}

PaginationControls.propTypes = {
    atTheBeginning: PropTypes.bool,
    atTheEnd: PropTypes.bool,
    pageNumber: PropTypes.number,
    back: PropTypes.func,
    next: PropTypes.func
}

export default PaginationControls
