import { useState, useEffect } from "react";

import { db } from "../../firebaseinit";
import { collection, query, getDocs } from "firebase/firestore";

import AlbumForm from "../album-form/AlbumForm";
import AlbumList from "../album-list/AlbumList";

import HomeStyle from "./Home.module.css";

import CircularProgress from "@mui/material/CircularProgress";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [addAlbum, setAddAlbum] = useState(false);

    const [albums, setAlbums] = useState([]);

    async function getInitialData() {
        try {
            const q = query(collection(db, "albums"));

            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data(),
                    hover: false,
                }
            });

            setAlbums([...data]);
        } catch (e) {
            console.log("ERROR: ", e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getInitialData();
    }, []);


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
                    <div className="bodySpace">
                        {
                            addAlbum &&
                            <AlbumForm getInitialData={getInitialData} />
                        }
                        <div className={HomeStyle.titleRow}>
                            <div>
                                <h1>
                                    Your Albums
                                </h1>
                            </div>
                            <div>
                                <button className={HomeStyle.button} onClick={() => setAddAlbum(prev => !prev)}>
                                    {addAlbum ? "Cancel" : <>Add&nbsp;Album</>}
                                </button>
                            </div>
                        </div>
                        <AlbumList albums={albums} setAlbums={setAlbums} getInitialData={getInitialData} />
                    </div>
            }
        </>
    )
}