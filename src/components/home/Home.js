// Import necessary hooks
import { useState, useEffect } from "react";

// Firebase database and methods
import { db } from "../../firebaseinit";
import { collection, query, getDocs } from "firebase/firestore";

// Component imports
import AlbumForm from "../album-form/AlbumForm";
import AlbumList from "../album-list/AlbumList";

// CSS modules
import HomeStyle from "./Home.module.css";

// Material UI component
import CircularProgress from "@mui/material/CircularProgress";

export default function Home() {
    // State management
    const [loading, setLoading] = useState(true); // Loading state flag
    const [addAlbum, setAddAlbum] = useState(false); // Toggle album form visibility
    const [isEdit, setIsEdit] = useState(false); // Edit mode flag
    const [edit, setEdit] = useState({}); // Album data being edited
    const [albums, setAlbums] = useState([]); // Stores album data

    // Fetches initial album data from Firestore
    async function getInitialData() {
        try {
            // Create query for albums collection
            const q = query(collection(db, "albums"));

            // Execute query and process results
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map((doc) => {
                return {
                    id: doc.id, // Document ID
                    ...doc.data(), // Spread all document data
                    hover: false, // Add hover state
                }
            });

            // Update albums state with fetched data
            setAlbums([...data]);
        } catch (e) {
            console.log("ERROR: ", e);
        } finally {
            setLoading(false); // Always disable loading state
        }
    }

    // Fetch data on component mount
    useEffect(() => {
        getInitialData();
    }, []); // Empty dependency array means runs once on mount


    return (
        <>
            {
                // Conditional rendering based on loading state
                loading ?
                    // Show loading spinner when data is being fetched
                    <div className="loadingBox">
                        <CircularProgress style={{ color: "#F54A00" }} className="loadingBoxContent" />
                    </div>
                    :
                    // Main content when loading is complete
                    <div className="bodySpace">
                        {
                            // Conditionally render AlbumForm when addAlbum is true
                            addAlbum &&
                            <AlbumForm
                                isEdit={isEdit}
                                setIsEdit={setIsEdit}
                                edit={edit}
                                setEdit={setEdit}
                                getInitialData={getInitialData}
                                setLoading={setLoading}
                            />
                        }
                        {/* Header section with title and add album button */}
                        <div className={HomeStyle.titleRow}>
                            <div>
                                <h1>
                                    Your Albums
                                </h1>
                            </div>
                            <div>
                                {/* Toggle button for add album form */}
                                <button
                                    className={HomeStyle.button}
                                    onClick={() => {
                                        setAddAlbum(prev => !prev) // Toggle form visibility
                                        setIsEdit(false); // Reset edit mode
                                        setEdit({}); // Clear edit data
                                    }}
                                >
                                    {addAlbum ? "Cancel" : <>Add&nbsp;Album</>}
                                </button>
                            </div>
                        </div>
                        {/* Album list component */}
                        <AlbumList
                            albums={albums}
                            setAlbums={setAlbums}
                            setIsEdit={setIsEdit}
                            setEdit={setEdit}
                            getInitialData={getInitialData}
                            setLoading={setLoading}
                            setAddAlbum={setAddAlbum}
                        />
                    </div>
            }
        </>
    )
}