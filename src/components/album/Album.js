import { useState, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { db } from "../../firebaseinit";
import { doc, getDoc } from "firebase/firestore";

import ImageForm from "../image-form/ImageForm";
import ImageList from "../image-list/ImageList";
import Carousel from "../carousel/Carousel";

import AlbumStyle from "./Album.module.css";
import HomeStyle from "../home/Home.module.css";

import CircularProgress from "@mui/material/CircularProgress";

export default function Album() {
    // Get album ID from URL params
    const { albumID } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [isCarousel, setIsCarousel] = useState(false);
    const [carouselImage, setCarouselImage] = useState(false);
    const [addImage, setAddImage] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [edit, setEdit] = useState({});
    const [images, setImages] = useState([]);

    function initializeCarouselImage(index, mode) {
        switch (mode) {
            case "set":
                setCarouselImage({
                    ...images?.images[index],
                    index
                });
                break;
            case "prev":
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
            case "next":
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

    async function getInitialData() {
        try {
            const docRef = doc(db, "albums", albumID);
            const docSnap = await getDoc(docRef);

            console.log(docSnap.data(), "images docSnap.")
            if (docSnap.exists()) {
                setImages({
                    ...docSnap.data(),
                    images: [
                        ...docSnap.data()?.images?.map((elem) => {
                            let newObj = {
                                ...elem,
                                hover: false,
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
                    isCarousel ?
                        <Carousel
                            carouselImage={carouselImage}
                            setIsCarousel={setIsCarousel}
                            initializeCarouselImage={initializeCarouselImage}
                        />
                        :
                        <div className="bodySpace">
                            {
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