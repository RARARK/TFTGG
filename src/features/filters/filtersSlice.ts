import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    search: '',
    cost: 0, // 0 = 전체
    trait: null,
}

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setSearch(state, action) {
            state.search = action.payload
        },
        setCost(state, action) {
            state.cost = action.payload
        },
        setTrait(state, action) {
            state.trait = action.payload
        },
        resetFilters() {
            return initialState
        },
    },
})

export const { setSearch, setCost, setTrait, resetFilters } =
    filtersSlice.actions

export default filtersSlice.reducer
