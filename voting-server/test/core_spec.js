import {List, Map} from 'immutable';
import {expect} from 'chai';
import {setEntries, next, vote} from '../src/core';

describe('application logic', ()=> {
    describe('setEntries', ()=> {
        it('adds the entries to the state', ()=> {
            const state = Map();
            const entries = ['Trainspotting', '28 days later'];
            const nextState = setEntries(state, entries);

            expect(nextState).to.equal(Map({
                entries: List.of('Trainspotting', '28 days later')
            }));

            expect(state).to.equal(Map());
        });
    });

    describe('next', ()=> {
        it('takes the next two entries under vote', ()=> {
            const state = Map({
                entries: List.of('Trainspotting', '28 days later', 'Sunshine')
            });
            const nextState = next(state);

            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Trainspotting', '28 days later')
                }),
                entries: List.of('Sunshine')
            }));

            expect(state).to.equal(Map({
                entries: List.of('Trainspotting', '28 days later', 'Sunshine')
            }));
        });

        it('puts the winner to the end of entries', ()=> {
            const state = Map({
                vote: Map({
                    pair: List.of('Trainspotting', '28 days later'),
                    tally: Map({
                        'Trainspotting': 4,
                        '28 days later': 2
                    }),
                }),
                entries: List.of('Sunshine', 'Millions', '127 Hours')
            });

            const nextState = next(state);

            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Sunshine', 'Millions')
                }),
                entries: List.of('127 Hours', 'Trainspotting')
            }));
        });

        it('puts the winner to the end of entries if there one entries has no votes', ()=> {
            const state = Map({
                vote: Map({
                    pair: List.of('Trainspotting', '28 days later'),
                    tally: Map({
                        'Trainspotting': 4
                    }),
                }),
                entries: List.of('Sunshine', 'Millions', '127 Hours')
            });

            const nextState = next(state);

            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Sunshine', 'Millions')
                }),
                entries: List.of('127 Hours', 'Trainspotting')
            }));
        });

        it('puts pair back to the end of entries in the event of a tie', ()=> {
            const state = Map({
                vote: Map({
                    pair: List.of('Trainspotting', '28 days later'),
                    tally: Map({
                        'Trainspotting': 2,
                        '28 days later': 2
                    }),
                }),
                entries: List.of('Sunshine', 'Millions', '127 Hours')
            });

            const nextState = next(state);

            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Sunshine', 'Millions')
                }),
                entries: List.of('127 Hours', 'Trainspotting', '28 days later')
            }));
        });

        it('marks winner when there is only one entry left', ()=> {
            const state = Map({
                vote: Map({
                    pair: List.of('Trainspotting', '28 Days Later'),
                    tally: Map({
                        'Trainspotting': 4,
                        '28 Days Later': 2
                    })
                }),
                entries: List()
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                winner: 'Trainspotting'
            }));
        });
    });

    describe('vote', ()=> {
        it('creates a tally for the voted entry', () => {
            const state = Map({
                pair: List.of('Trainspotting', '28 Days Later')
            });
            const nextState = vote(state, 'Trainspotting')
            expect(nextState).to.equal(Map({
                pair: List.of('Trainspotting', '28 Days Later'),
                tally: Map({
                    'Trainspotting': 1
                })
            }));
        });

        it('adds to existing tally for the voted entry', () => {
            const state = Map({
                pair: List.of('Trainspotting', '28 Days Later'),
                tally: Map({
                    'Trainspotting': 3,
                    '28 Days Later': 2
                })
            });
            const nextState = vote(state, 'Trainspotting');
            expect(nextState).to.equal(Map({
                pair: List.of('Trainspotting', '28 Days Later'),
                tally: Map({
                    'Trainspotting': 4,
                    '28 Days Later': 2
                })
            }));
        });
    });
});