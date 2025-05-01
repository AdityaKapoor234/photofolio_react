// Firebase database and methods
import { db } from "../../firebaseinit";
import { doc, updateDoc } from "firebase/firestore";

// CSS modules
import ImageListStyle from "./ImageList.module.css";
import AlbumListStyle from "../album-list/AlbumList.module.css";

// Material UI icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Toast notification library
import { toast } from "react-toastify";

export default function ImageList(props) {

    /**
     * Sets hover state for a specific image
     * id - Image ID
     * value - Hover state value
     */
    function setHover(id, value) {
        props?.setImages({
            ...props?.images,
            images: props?.images?.images?.map(elem => {
                return elem.id === id ?
                    {
                        ...elem,
                        hover: value, // Set hover for matching image
                    } :
                    {
                        ...elem,
                        hover: false, // Reset hover for other images
                    }
            })
        });
    }

    /**
     * Sets or removes thumbnail for the album
     * item - Image to set as thumbnail
     */
    async function setThumbnail(item) {
        props?.setLoading(true);
        try {

            const docRef = doc(db, "albums", props?.albumID);

            // Determine new thumbnail value
            let newThumbnail = item?.isThumbnail ? "" : item?.imageURL;

            // Update document with new thumbnail status
            await updateDoc(docRef, {
                ...props?.images,
                images: props?.images?.images?.map((elem) => {
                    return elem?.id === item?.id ?
                        {
                            ...elem,
                            isThumbnail: !elem?.isThumbnail, // Toggle thumbnail status
                        }
                        :
                        {
                            ...elem,
                            isThumbnail: false, // Ensure only one thumbnail
                        }
                }),
                thumbnail: newThumbnail, // Update album thumbnail
            });

            // Show appropriate success message
            toast.success(item?.isThumbnail ? "There is no thumbnail for this album now" : "New Thumbnail has been updated");

        } catch (e) {
            console.log("ERROR: ", e);
            toast.error("Something went wrong please try again later");
        } finally {
            await props?.getInitialData(); // Refresh album list
            props?.setLoading(false); // Hide loading state
        }
    }

    /**
     * Handles edit action for an image
     * item - Image to edit
     */
    function handleEdit(item) {
        try {
            props?.setAddImage(true); // Show image form
            props?.setIsEdit(true); // Set edit mode
            props?.setEdit({
                ...item,
                hover: false, // Reset hover state
            });
        } catch (e) {
            console.log("ERROR: ", e);
        }
    }

    /**
     * Handles image deletion
     * item - Image to delete
     */
    async function handleDelete(item) {
        props?.setLoading(true);
        try {
            const docRef = doc(db, "albums", props?.albumID);

            // Handle thumbnail if deleted image was the thumbnail
            let newThumbnail = item?.isThumbnail ? "" : props?.images?.thumbnail;

            // Update document by removing the image
            await updateDoc(docRef, {
                ...props?.images,
                images: props?.images?.images?.filter((elem) => elem?.id !== item?.id), // Remove image
                thumbnail: newThumbnail, // Update thumbnail if needed
            });

            toast.success("Image has been deleted");

        } catch (e) {
            console.log("ERROR: ", e);
            toast.error("Something went wrong please try again later");
        } finally {
            await props?.getInitialData(); // Refresh album list
            props?.setLoading(false); // Hide loading state
        }
    }

    /**
     * Opens carousel view for an image
     * index - Index of image to show in carousel
     */
    function setCarousel(index) {
        props?.initializeCarouselImage(index, "set"); // Set current carousel image
        props?.setIsCarousel(true); // Show carousel
    }

    return (
        <div className={AlbumListStyle.container}>
            {
                // Conditional rendering for empty state
                props?.images?.images && props?.images?.images?.length < 1 ?
                    <div className="notFound">
                        No Images Found
                    </div>
                    :
                    // Map through images and render each one
                    props?.images?.images?.map((elem, index) => {
                        return (
                            <>
                                {/* Individual image container */}
                                <div
                                    className={AlbumListStyle.albumContainer}
                                    onMouseEnter={() => setHover(elem?.id, true)} // Set hover on enter
                                    onMouseLeave={() => setHover(elem?.id, false)} // Remove hover on leave
                                >
                                    {
                                        // Show thumbnail button when hovered or if image is thumbnail
                                        (elem?.hover || elem?.isThumbnail) &&
                                        <div className={ImageListStyle.hoverThumbnailButtons} onClick={() => setThumbnail(elem)}>
                                            <AccountCircleIcon />
                                        </div>
                                    }
                                    {
                                        // Show edit/delete buttons when hovered
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
                                    {/* Image content (clickable area) */}
                                    <div className={ImageListStyle.containerMargin} onClick={() => setCarousel(index)} style={{ cursor: "pointer" }}>
                                        {/* Image thumbnail */}
                                        <div className={AlbumListStyle.albumThumbnail} style={{ backgroundImage: `url(${elem?.imageURL})` }}>
                                        </div>
                                        {/* Image name (truncated if too long) */}
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