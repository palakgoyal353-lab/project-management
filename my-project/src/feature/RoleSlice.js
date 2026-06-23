import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  roles: []
}

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {}
})

export default roleSlice.reducer