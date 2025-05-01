import { db } from "../../firebaseinit";
import { doc, updateDoc } from "firebase/firestore";

import ImageListStyle from "./ImageList.module.css";
import AlbumListStyle from "../album-list/AlbumList.module.css";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Toast notification library
import { toast } from "react-toastify";
import Carousel from "../carousel/Carousel";

export default function ImageList(props) {

    function setHover(id, value) {
        props?.setImages({
            ...props?.images,
            images: props?.images?.images?.map(elem => {
                return elem.id === id ?
                    {
                        ...elem,
                        hover: value,
                    } :
                    {
                        ...elem,
                        hover: false,
                    }
            })
        });
    }

    async function setThumbnail(item) {
        props?.setLoading(true);
        try {

            const docRef = doc(db, "albums", props?.albumID);

            let newThumbnail = item?.isThumbnail ? "" : item?.imageURL;

            await updateDoc(docRef, {
                ...props?.images,
                images: props?.images?.images?.map((elem) => {
                    return elem?.id === item?.id ?
                        {
                            ...elem,
                            isThumbnail: !elem?.isThumbnail,
                        }
                        :
                        {
                            ...elem,
                            isThumbnail: false,
                        }
                }),
                thumbnail: newThumbnail,
            });

            toast.success(item?.isThumbnail ? "There is no thumbnail for this album now" : "New Thumbnail has been updated");

        } catch (e) {
            console.log("ERROR: ", e);
            toast.error("Something went wrong please try again later");
        } finally {
            await props?.getInitialData();
            props?.setLoading(false);
        }
    }

    function handleEdit(item) {
        try {
            props?.setAddImage(true);
            props?.setIsEdit(true);
            props?.setEdit({
                ...item,
                hover: false,
            });
        } catch (e) {
            console.log("ERROR: ", e);
        }
    }

    async function handleDelete(item) {
        props?.setLoading(true);
        try {
            const docRef = doc(db, "albums", props?.albumID);

            let newThumbnail = item?.isThumbnail ? "" : props?.images?.thumbnail;

            await updateDoc(docRef, {
                ...props?.images,
                images: props?.images?.images?.filter((elem) => elem?.id !== item?.id),
                thumbnail: newThumbnail,
            });

            toast.success("Image has been deleted");

        } catch (e) {
            console.log("ERROR: ", e);
            toast.error("Something went wrong please try again later");
        } finally {
            await props?.getInitialData();
            props?.setLoading(false);
        }
    }

    function setCarousel(index) {
        props?.initializeCarouselImage(index, "set");
        props?.setIsCarousel(true);
    }

    return (
        <div className={AlbumListStyle.container}>
            {
                props?.images?.images && props?.images?.images?.length < 1 ?
                    <div className="notFound">
                        No Images Found
                    </div>
                    :
                    props?.images?.images?.map((elem, index) => {
                        return (
                            <>
                                <div
                                    className={AlbumListStyle.albumContainer}
                                    onMouseEnter={() => setHover(elem?.id, true)}
                                    onMouseLeave={() => setHover(elem?.id, false)}
                                >
                                    {
                                        (elem?.hover || elem?.isThumbnail) &&
                                        <div className={ImageListStyle.hoverThumbnailButtons} onClick={() => setThumbnail(elem)}>
                                            <AccountCircleIcon />
                                        </div>
                                    }
                                    {
                                        (elem?.hover) &&
                                        <>
                                            <div className={ImageListStyle.hoverEditButtons} onClick={() => handleEdit(elem)}>
                                                <EditIcon />
                                            </div>
                                            <div className={AlbumListStyle.hoverButtons} onClick={() => handleDelete(elem)}>
                                                <DeleteIcon />
                                            </div>
                                        </>
                                    }
                                    <div className={ImageListStyle.containerMargin} onClick={() => setCarousel(index)} style={{cursor: "pointer"}}>
                                        <div className={AlbumListStyle.albumThumbnail} style={{ backgroundImage: `url(${elem?.imageURL})` }}>
                                        </div>
                                        <div className={AlbumListStyle.heading}>
                                            <div className="elip-text" title={elem?.name}>
                                                {elem?.name?.substring(0, 11)}
                                                {elem?.name?.length > 11 && "..."}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    })
            }
        </div>
    )
}