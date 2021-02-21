import {
    render,
    screen,
    waitForElementToBeRemoved
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import Component from './TestComponent'

const makePromise = (response) => new Promise((res) => res(response))

test('pagination hook can fetch data, cache data, show begingging and last pages', async () => {
    /**
     * Setting up the fetcher to return three different
     * sets of data, because the apiCall will be executed
     * 3 times in our testing scenario
     *
     */
    const fetcher = jest
        .fn()
        .mockReturnValueOnce(
            makePromise({
                items: [
                    {
                        title: 'Note 1'
                    },
                    {
                        title: 'Note 2'
                    },
                    {
                        title: 'Note 3'
                    }
                ],
                next: 'next_2'
            })
        )
        .mockReturnValueOnce(
            makePromise({
                items: [
                    {
                        title: 'Note 4'
                    },
                    {
                        title: 'Note 5'
                    },
                    {
                        title: 'Note 6'
                    }
                ],
                next: 'next_3'
            })
        )
        .mockReturnValueOnce(
            makePromise({
                items: [
                    {
                        title: 'Note 7'
                    }
                ],
                next: false
            })
        )

    /**
     * Test Scenario
     *
     */
    render(<Component fetcher={fetcher} />)

    // After Initial Loading, check for list elements
    await waitForElementToBeRemoved(() => screen.getByText(/Loading/i))
    screen.getByText(/Successfully Loaded/i)
    screen.getByText(/Note 1/i)
    screen.getByText(/Note 2/i)
    screen.getByText(/Note 3/i)

    // Click next button, wait for loading to be done, and validate next list of items
    let nextButton = screen.getByText(/Next/i)
    userEvent.click(nextButton)
    await waitForElementToBeRemoved(() => screen.getByText(/Loading/i))

    screen.getByText(/Note 4/i)
    screen.getByText(/Note 5/i)
    screen.getByText(/Note 6/i)

    // Clicking the back button shouldnt require a loading screen, because the result is cached
    let backButton = screen.getByText(/BackButton/i)
    userEvent.click(backButton)
    screen.getByText(/Note 1/i)
    screen.getByText(/Note 2/i)
    screen.getByText(/Note 3/i)

    // Should show Is Beginning, because its the first page of data
    screen.getByText(/First Page/i)

    // Clicking next should show no loading screen because its cached
    userEvent.click(screen.getByText(/Next/i))

    // But clicking next a second time should show a loading screen, because we have not
    // fetched this data yet
    userEvent.click(screen.getByText(/Next/i))
    await waitForElementToBeRemoved(() => screen.getByText(/Loading/i))
    screen.getByText(/Note 7/i)

    // and because the api call returns false for next token, we should see the Last Page text showing
    screen.getByText(/Last Page/i)
})
