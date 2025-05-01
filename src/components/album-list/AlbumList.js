// Import necessary hooks
import { useNavigate } from "react-router-dom";

// Firebase database and methods
import { db } from "../../firebaseinit";
import { doc, deleteDoc } from "firebase/firestore";

// Toast notification library
import { toast } from "react-toastify";

// Component styles
import AlbumListStyle from "./AlbumList.module.css";
import ImageListStyle from "../image-list/ImageList.module.css";

// Material UI icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AlbumList(props) {
    // Navigation hook for programmatic routing
    const navigate = useNavigate();

    /**
     * Toggles hover state for album items
     * id - Album ID
     * value - Hover state value
     */
    function setHover(id, value) {
        props?.setAlbums(
            props?.albums?.map(elem => {
                return elem.id === id ?
                    {
                        ...elem,
                        hover: !elem.hover, // Toggle hover for matching album
                    } :
                    {
                        ...elem,
                        hover: false, // Reset hover for other albums
                    }
            })
        );
    }

    /**
     * Handles edit action for an album
     * item - Album to edit
     */
    function handleEdit(item) {
        try {
            props?.setAddAlbum(true); // Show album form
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
     * Deletes an album from Firestore
     * id - Album ID to delete
     */
    async function deleteAlbum(id) {
        props?.setLoading(true); // Show loading state
        try {
            await deleteDoc(doc(db, "albums", id)); // Delete document
            toast.success("Album deleted successfully!");
        } catch (e) {
            console.log("ERROR: ", e);
            toast.error("Something went wrong please try again later");
        } finally {
            await props?.getInitialData(); // Refresh album list
            props?.setLoading(false); // Hide loading state
        }
    }

    return (
        <div className={AlbumListStyle.container}>
            {
                // Conditional rendering for empty state
                props?.albums && props?.albums?.length < 1 ?
                    <div className="notFound">
                        No Album Found
                    </div>
                    :
                    // Map through albums and render each one
                    props?.albums?.map((elem) => {
                        return (
                            <>
                                {/* Individual album container */}
                                <div
                                    className={AlbumListStyle.albumContainer}
                                    onMouseEnter={() => setHover(elem?.id, true)} // Set hover on enter
                                    onMouseLeave={() => setHover(elem?.id, false)} // Remove hover on leave
                                >
                                    {
                                        // Show edit/delete buttons when hovered
                                        elem?.hover &&
                                        <>
                                            {/* Edit button */}
                                            <div className={ImageListStyle.hoverEditButtons} onClick={() => handleEdit(elem)}>
                                                <EditIcon />
                                            </div>
                                            {/* Delete button */}
                                            <div
                                                className={AlbumListStyle.hoverButtons}
                                                onClick={() => deleteAlbum(elem?.id)}
                                            >
                                                <DeleteIcon />
                                            </div>
                                        </>
                                    }
                                    {/* Album content (clickable area) */}
                                    <div className={ImageListStyle.containerMargin} onClick={() => navigate(`album/${elem?.id}`)}>
                                        {/* Album thumbnail image */}
                                        <div
                                            className={AlbumListStyle.albumThumbnail}
                                            style={
                                                elem?.thumbnail ?
                                                    { backgroundImage: `url(${elem?.thumbnail})` } : // Use custom thumbnail if available
                                                    { backgroundImage: "url(/assets/image-icon.png)" } // Fallback to default icon
                                            }
                                        >
                                        </div>
                                        {/* Album name (truncated if too long) */}
                                        <div className={AlbumListStyle.heading}>
                                            <div className="elip-text" title={elem?.albumName}>
                                                {elem?.albumName?.substring(0, 11)}
                                                {elem?.albumName?.length > 11 && "..."}
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