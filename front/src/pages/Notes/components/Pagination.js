import React from 'react'

function PaginationSection(props) {
    const activeButtonStyles = `py-2 px-3 rounded bg-purple-700 text-white text-xs`
    const disabledButtonStyles = `py-2 px-3 rounded bg-purple-200 text-white text-xs cursor-not-allowed`

    return (
        <div className="flex justify-between items-center mt-2 w-96">
            <button
                disabled={props.atTheBeginning}
                className={
                    props.atTheBeginning
                        ? disabledButtonStyles
                        : activeButtonStyles
                }
                onClick={props.back}
            >
                Back
            </button>
            <p className="px-5 py-2 mx-2 text-xs rounded flex justify-center flex-1 ">
                {props.paginationState}
            </p>
            <button
                disabled={props.atTheEnd}
                onClick={props.next}
                className={
                    props.atTheEnd ? disabledButtonStyles : activeButtonStyles
                }
            >
                Next
            </button>
        </div>
    )
}

export default PaginationSection
