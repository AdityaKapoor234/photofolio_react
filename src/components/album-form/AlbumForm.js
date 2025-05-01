import { useEffect, useRef } from "react";

import { db } from "../../firebaseinit";
import { collection, doc, addDoc, updateDoc } from "firebase/firestore";

// Toast notification library
import { toast } from "react-toastify";

import AlbumFormStyle from "./AlbumForm.module.css";

export default function AlbumForm(props) {
    const albumNameRef = useRef("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        props?.setLoading(true);
        try {
            if (!albumNameRef.current.value?.trim()) {
                toast.error("Please enter album name");
                return;
            }

            if (props?.isEdit) {
                const docRef = doc(db, "albums", props?.edit?.id);

                await updateDoc(docRef, {
                    ...props?.edit,
                    albumName: albumNameRef.current.value,
                });

                toast.success("Album has been updated");

                props?.setIsEdit(false);
                props?.setEdit({});
            } else {
                await addDoc(collection(db, "albums"), {
                    albumName: albumNameRef.current.value,
                    images: [],
                    thumbnail: "",
                });

                toast.success("Album created successfully!");
            }

            if (albumNameRef.current) albumNameRef.current.value = "";
        } catch (e) {
            console.log("ERROR: ", e);
            toast.error("Something went wrong please try again later");
        } finally {
            await props?.getInitialData();
            props?.setLoading(false);
        }
    }

    useEffect(() => {
        if (props?.isEdit) {
            albumNameRef.current.value = props?.edit?.albumName;
        }
    }, [props?.edit, props?.edit.imageURL, props?.edit.name, props?.isEdit])

    return (
        <form onSubmit={handleSubmit} className={AlbumFormStyle.form}>
            <div className={AlbumFormStyle.albumFormHeading}>
                {props?.isEdit ? "Edit Album" : "Create Album"}
            </div>
            <div>
                <input type="text" placeholder="Enter an album name..." ref={albumNameRef} className={AlbumFormStyle.albumFormInputBox} />
            </div>
            <div>
                <button type="button" onClick={() => { albumNameRef.current.value = ""; }} className={AlbumFormStyle.button}>
                    Clear
                </button>
                <button type="submit" className={AlbumFormStyle.button}>
                    {props?.isEdit ? "Edit" : "Create"}
                </button>
            </div>
        </form>
    )
}