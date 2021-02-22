import usePagination from './usePagination'

function Component(props: any) {
    const { network, data, actions } = usePagination(props.fetcher)

    if (network.error) {
        return <p>{network.error}</p>
    }

    if (network.loading) {
        return <p>Loading</p>
    }

    return (
        <div>
            <p>Successfully Loaded</p>
            <div>
                {data.list.map((x: any, i: number) => (
                    <p key={i}>{x.title}</p>
                ))}
            </div>
            {data.isBeginning && <p>First Page</p>}
            {data.isEnd && <p>Last Page</p>}
            <button onClick={actions.back}>BackButton</button>
            <p>{data.pageNumber}</p>
            <button onClick={actions.next}>Next</button>
        </div>
    )
}

export default Component
