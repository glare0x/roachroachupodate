import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { InformationCircleIcon } from '@heroicons/react/24/outline'

export default function AskBet({ open, close, winner }) {

  const cancelButtonRef = useRef(null)

  return (
        <Dialog open={open} as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={close}>
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <InformationCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                </div>
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">The round ended</Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                           The round has ended, and here are the results! <br /><hr className="my-2" />
                                           {winner && (
                                            <div>
                                            Round number: {winner.roundNumber}<br />
                                            The winner is Roach {winner.winnerRoach}!<br />
                                            <br />
                                            The rewards are:<br />
                                            Amount of winners: {winner.numberOfWinners}<br />
                                            Total rewards: {winner.totalWinnerSponsors}<br />
                                            <br />
                                            Amount of losers: {winner.numberOfLosers}<br />
                                            Total rewards: {winner.totalLoserSponsors}<br />
                                            </div>
                                           )}

                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            
                            <button
                                type="button"
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                onClick={() => close(false)}
                                ref={cancelButtonRef}
                            >
                                OK
                            </button>
                        </div>
                    </Dialog.Panel>

                </div>
            </div>
        </Dialog>

    )
}
