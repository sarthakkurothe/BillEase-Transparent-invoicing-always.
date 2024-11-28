import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  customers: [],
  loading: false,
  error: null
}

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    addCustomer: (state, action) => {
      state.customers.push(action.payload)
    },
    updateCustomer: (state, action) => {
      const index = state.customers.findIndex(customer => customer.id === action.payload.id)
      if (index !== -1) {
        state.customers[index] = action.payload
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const { addCustomer, updateCustomer, setLoading, setError } = customersSlice.actions
export default customersSlice.reducer 