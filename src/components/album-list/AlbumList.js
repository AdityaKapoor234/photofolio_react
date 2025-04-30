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

    function setHover(id) {
        props?.setAlbums(
            props?.albums?.map(elem => {
                return elem.id === id ?
                    {
                        ...elem,
                        hover: !elem.hover,
                    } :
                    elem
            })
        );
    }

    async function deleteAlbum(id) {
        try {
            await deleteDoc(doc(db, "albums", id));
            toast.success("Album deleted successfully!");
            props?.getInitialData();
        } catch (e) {
            console.log("ERROR: ", e);
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
                                    onMouseEnter={() => setHover(elem?.id)}
                                    onMouseLeave={() => setHover(elem?.id)}
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
                                            {elem?.albumName}
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