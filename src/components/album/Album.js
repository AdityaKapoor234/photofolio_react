import { useState, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { db } from "../../firebaseinit";
import { doc, getDoc } from "firebase/firestore";

import ImageForm from "../image-form/ImageForm";
import ImageList from "../image-list/ImageList";

import AlbumStyle from "./Album.module.css";
import HomeStyle from "../home/Home.module.css";

import CircularProgress from "@mui/material/CircularProgress";

export default function Album(props) {
    // Get album ID from URL params
    const { albumID } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    // const [loading, setLoading] = useState(false);
    const [addImage, setAddImage] = useState(false);
    const [images, setImages] = useState([]);

    async function getInitialData() {
        try {
            const docRef = doc(db, "albums", albumID);
            const docSnap = await getDoc(docRef);

            console.log(docSnap.data(), "images docSnap.")
            if (docSnap.exists()) {
                setImages({
                    ...docSnap.data(),
                    hover: false,
                });
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }
        } catch (e) {
            console.log("ERROR: ", e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getInitialData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                            addImage &&
                            <ImageForm
                                images={images}
                                albumID={albumID}
                                getInitialData={getInitialData}
                                darkMode={props?.darkMode}
                            />
                        }
                        <div className={HomeStyle.titleRow}>
                            <div className={AlbumStyle.backButton} onClick={() => navigate("/")}>
                                <div style={{ backgroundImage: "url(/assets/back-button.png)" }}></div>
                            </div>
                            <div>
                                <h1>
                                    {images?.albumName} Albums
                                </h1>
                            </div>
                            <div>
                                <button className={HomeStyle.button} onClick={() => setAddImage(prev => !prev)}>
                                    {addImage ? "Cancel" : "Add Image"}
                                </button>
                            </div>
                        </div>
                        <ImageList
                            images={images}
                            setImages={setImages}
                            albumID={albumID}
                            getInitialData={getInitialData}
                            darkMode={props?.darkMode}
                        />
                    </div>
            }
        </>
    )
}