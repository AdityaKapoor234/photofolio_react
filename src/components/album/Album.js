// Import necessary hooks
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Firebase database and methods
import { db } from "../../firebaseinit";
import { doc, getDoc } from "firebase/firestore";

// Component imports
import ImageForm from "../image-form/ImageForm";
import ImageList from "../image-list/ImageList";
import Carousel from "../carousel/Carousel";

// CSS modules
import AlbumStyle from "./Album.module.css";
import HomeStyle from "../home/Home.module.css";

// Material UI component
import CircularProgress from "@mui/material/CircularProgress";

export default function Album() {
    // Get album ID from URL params
    const { albumID } = useParams();

    // Navigation hook for programmatic routing
    const navigate = useNavigate();

    // State management
    const [loading, setLoading] = useState(true); // Loading state
    const [isCarousel, setIsCarousel] = useState(false); // Carousel visibility
    const [carouselImage, setCarouselImage] = useState(false); // Current carousel image
    const [addImage, setAddImage] = useState(false); // Add image form visibility
    const [isEdit, setIsEdit] = useState(false); // Edit mode flag
    const [edit, setEdit] = useState({}); // Image being edited
    const [images, setImages] = useState([]); // Album images data

    /**
     * Handles carousel navigation (set, previous, next)
     * index - Current image index
     * mode - Navigation mode ('set', 'prev', 'next')
     */
    function initializeCarouselImage(index, mode) {
        switch (mode) {
            case "set": // Set specific image
                setCarouselImage({
                    ...images?.images[index],
                    index
                });
                break;
            case "prev": // Previous image (with wrap-around)
                if (index === 0) {
                    setCarouselImage({
                        ...images?.images[images?.images?.length - 1],
                        index: images?.images?.length - 1,
                    });
                } else {
                    setCarouselImage({
                        ...images?.images[index - 1],
                        index: index - 1,
                    });
                }
                break;
            case "next": // Next image (with wrap-around)
                if (images?.images?.length - 1 === index) {
                    setCarouselImage({
                        ...images?.images[0],
                        index: 0,
                    });
                } else {
                    setCarouselImage({
                        ...images?.images[index + 1],
                        index: index + 1,
                    });
                }
                break;
            default:
                break;
        }
    }

    // Fetches album data from Firestore
    async function getInitialData() {
        try {
            const docRef = doc(db, "albums", albumID);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // Format images data with hover state
                setImages({
                    ...docSnap.data(),
                    images: [
                        ...docSnap.data()?.images?.map((elem) => {
                            let newObj = {
                                ...elem,
                                hover: false, // Add hover state to each image
                            }
                            return newObj;
                        })
                    ],
                });
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }
        } catch (e) {
            console.log("ERROR: ", e);
        } finally {
            setLoading(false); // Always disable loading
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
                    // Once loaded, show either carousel or album view
                    isCarousel ?
                        <Carousel
                            carouselImage={carouselImage}
                            setIsCarousel={setIsCarousel}
                            initializeCarouselImage={initializeCarouselImage}
                        />
                        :
                        // Main album view container
                        <div className="bodySpace">
                            {
                                // Conditionally render image form when adding/editing
                                addImage &&
                                <ImageForm
                                    images={images}
                                    albumID={albumID}
                                    isEdit={isEdit}
                                    setIsEdit={setIsEdit}
                                    edit={edit}
                                    setEdit={setEdit}
                                    getInitialData={getInitialData}
                                    setLoading={setLoading}
                                />
                            }
                            {/* Album header with back button and title */}
                            <div className={HomeStyle.titleRow}>
                                <div className={AlbumStyle.backButton} onClick={() => navigate("/")}>
                                    <div style={{ backgroundImage: "url(/assets/back-button.png)" }}></div>
                                </div>
                                <div>
                                    <h1>
                                        {images?.albumName} Albums
                                    </h1>
                                </div>
                                {/* Toggle button for add image form */}
                                <div>
                                    <button
                                        className={HomeStyle.button}
                                        onClick={() => {
                                            setAddImage(prev => !prev);
                                            setIsEdit(false);
                                            setEdit({});
                                        }}
                                    >
                                        {addImage ? "Cancel" : "Add Image"}
                                    </button>
                                </div>
                            </div>
                            {/* Image list component */}
                            <ImageList
                                albumID={albumID}
                                images={images}
                                setImages={setImages}
                                setAddImage={setAddImage}
                                setIsEdit={setIsEdit}
                                setEdit={setEdit}
                                getInitialData={getInitialData}
                                setLoading={setLoading}
                                setIsCarousel={setIsCarousel}
                                initializeCarouselImage={initializeCarouselImage}
                            />
                        </div>
            }
        </>
    )
}