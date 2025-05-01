import { useNavigate } from "react-router-dom";

import { db } from "../../firebaseinit";
import { doc, deleteDoc } from "firebase/firestore";

// Toast notification library
import { toast } from "react-toastify";

import AlbumListStyle from "./AlbumList.module.css";
import ImageListStyle from "../image-list/ImageList.module.css";

import DeleteIcon from '@mui/icons-material/Delete';

export default function AlbumList(props) {
    const navigate = useNavigate();

    function setHover(id, value) {
        props?.setAlbums(
            props?.albums?.map(elem => {
                return elem.id === id ?
                    {
                        ...elem,
                        hover: !elem.hover,
                    } :
                    {
                        ...elem,
                        hover: false,
                    }
            })
        );
    }

    async function deleteAlbum(id) {
        props?.setLoading(true);
        try {
            await deleteDoc(doc(db, "albums", id));
            toast.success("Album deleted successfully!");
        } catch (e) {
            console.log("ERROR: ", e);
            toast.error("Something went wrong please try again later");
        } finally {
            await props?.getInitialData();
            props?.setLoading(false);
        }
    }

    return (
        <div className={AlbumListStyle.container}>
            {
                props?.albums && props?.albums?.length < 1 ?
                    <div className="notFound">
                        No Album Found
                    </div>
                    :
                    props?.albums?.map((elem) => {
                        return (
                            <>
                                <div
                                    className={AlbumListStyle.albumContainer}
                                    onMouseEnter={() => setHover(elem?.id, true)}
                                    onMouseLeave={() => setHover(elem?.id, false)}
                                >
                                    {
                                        elem?.hover &&
                                        <div
                                            className={AlbumListStyle.hoverButtons}
                                            onClick={() => deleteAlbum(elem?.id)}
                                        >
                                            <DeleteIcon />
                                        </div>
                                    }
                                    <div className={ImageListStyle.containerMargin} onClick={() => navigate(`album/${elem?.id}`)}>
                                        <div
                                            className={AlbumListStyle.albumThumbnail}
                                            style={
                                                elem?.thumbnail ?
                                                    { backgroundImage: `url(${elem?.thumbnail})` } :
                                                    { backgroundImage: "url(/assets/image-icon.png)" }
                                            }
                                        >
                                        </div>
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