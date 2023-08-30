import { configureStore } from '@reduxjs/toolkit';
import inboxReducer from './inboxSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import nextTokenReducer from './nextTokenSlice';


const persistConfig = {
  key: 'root',
  storage,
};

const persistedInboxReducer = persistReducer(persistConfig, inboxReducer);
const persistedNextTokenReducer = persistReducer(persistConfig, nextTokenReducer); 

const store = configureStore({
  reducer: {
    inbox: persistedInboxReducer,
    nextToken: persistedNextTokenReducer, 
  },
});

export const persistor = persistStore(store);

export default store;