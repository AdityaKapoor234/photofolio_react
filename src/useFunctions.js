import React, { useState, createContext, useContext } from "react";

import { useNavigate } from 'react-router-dom';

// Toast notifications
import { toast } from 'react-toastify';

const FunctionContext = createContext();

export default function FunctionsProvider({ children }) {
    const navigate = useNavigate();

    const [state, setState] = useState({
        albums: [],
        loading: false,
        darkMode: false,
    });

    const setAlbum = (albums) => {
        setState(prev => ({
            ...prev,
            albums
        }))
    }

    const addAlbum = (newAlbum) => {
        setState(prev => ({
            ...prev,
            albums: [
                ...prev.albums,
                newAlbum,
            ]
        }))
    }

    const editAlbum = (editedAlbum, id) => {
        setState(prev => ({
            ...prev,
            albums: prev.albums?.map(elem => {
                return elem?.id === id ? editedAlbum : elem;
            }),
        }))
    }

    const deleteAlbum = (id) => {
        setState(prev => ({
            ...prev,
            albums: prev.albums?.filter(elem => elem?.id !== id),
        }))
    }

    const addImageToAlbum = (newAlbum) => {

    }

    const editImageForAlbum = (editedAlbum, id) => {

    }

    const deleteImageFromAlbum = (id) => {

    }

    const value = {
        state,
        functions: {
            setAlbum,
            addAlbum,
            editAlbum,
            deleteAlbum,
            addImageToAlbum,
            editImageForAlbum,
            deleteImageFromAlbum,        
        },
    }

    return (
        <FunctionContext.Provider value={value}>
            {children}
        </FunctionContext.Provider>
    )
}

export const useFunctions = () => {
    const context = useContext(FunctionContext);

    if (!context) {
        throw new Error('useProduct must be used within a FunctionProvider');
    }

    return context;
}