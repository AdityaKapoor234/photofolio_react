import { db } from "../../firebaseinit";
import { doc, updateDoc } from "firebase/firestore";

import ImageListStyle from "./ImageList.module.css";
import AlbumListStyle from "../album-list/AlbumList.module.css";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Toast notification library
import { toast } from "react-toastify";

export default function ImageList(props) {

    function setHover(id) {
        props?.setImages({
            ...props?.images,
            images: props?.images?.images?.map(elem => {
                return elem.id === id ?
                    {
                        ...elem,
                        hover: !elem.hover,
                    } :
                    elem
            })
        });
    }

    async function setThumbnail(item) {
        try {

            const docRef = doc(db, "albums", props?.albumID);

            await updateDoc(docRef, {
                ...props?.images,
                images: props?.images?.images?.map((elem) => {
                    return elem?.id === item?.id ?
                        {
                            ...elem,
                            isThumbnail: true,
                        }
                        :
                        {
                            ...elem,
                            isThumbnail: false,
                        }
                }),
                thumbnail: item?.imageURL,
            });

            toast.success("New Thumbnail has been updated");

            props?.getInitialData();
        } catch (e) {
            console.log("ERROR: ", e);
        }
    }

    async function handleEdit(item) {
        try {

        } catch (e) {
            console.log("ERROR: ", e);
        }
    }

    async function handleDelete(id) {
        try {

        } catch (e) {
            console.log("ERROR: ", e);
        }
    }

    return (
        <div className={AlbumListStyle.container}>
            {console.log(props?.images, "images")}
            {
                props?.images?.images && props?.images?.images?.length < 1 ?
                    <div className="notFound">
                        No Images Found
                    </div>
                    :
                    props?.images?.images?.map((elem) => {
                        return (
                            <>
                                <div
                                    className={AlbumListStyle.albumContainer}
                                    onMouseEnter={() => setHover(elem?.id)}
                                    onMouseLeave={() => setHover(elem?.id)}
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
                                            <div className={AlbumListStyle.hoverButtons} onClick={() => handleDelete(elem?.id)}>
                                                <DeleteIcon />
                                            </div>
                                        </>
                                    }
                                    <div className={ImageListStyle.containerMargin}>
                                        <div className={AlbumListStyle.albumThumbnail} style={{ backgroundImage: `url(${elem?.imageURL})` }}>
                                        </div>
                                        <div className={AlbumListStyle.heading}>
                                            {elem?.name}
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