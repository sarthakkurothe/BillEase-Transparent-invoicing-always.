import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  invoices: [],
  loading: false,
  error: null
}

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    addInvoice: (state, action) => {
      state.invoices.push(action.payload)
    },
    updateInvoice: (state, action) => {
      const index = state.invoices.findIndex(invoice => invoice.id === action.payload.id)
      if (index !== -1) {
        state.invoices[index] = action.payload
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

export const { addInvoice, updateInvoice, setLoading, setError } = invoicesSlice.actions
export default invoicesSlice.reducer 