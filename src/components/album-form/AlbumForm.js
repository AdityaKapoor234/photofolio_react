import { useRef } from "react";

import { db } from "../../firebaseinit";
import { collection, addDoc } from "firebase/firestore";

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

            await addDoc(collection(db, "albums"), {
                albumName: albumNameRef.current.value,
                images: [],
                thumbnail: "",
            });
            if (albumNameRef.current) albumNameRef.current.value = "";
            toast.success("Album created successfully!");
        } catch (e) {
            console.log("ERROR: ", e);
            toast.error("Something went wrong please try again later");
        } finally {
            await props?.getInitialData();
            props?.setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className={AlbumFormStyle.form}>
            <div className={AlbumFormStyle.albumFormHeading}>
                Create Album
            </div>
            <div>
                <input type="text" placeholder="Enter an album name..." ref={albumNameRef} className={AlbumFormStyle.albumFormInputBox} />
            </div>
            <div>
                <button type="button" onClick={() => { albumNameRef.current.value = ""; }} className={AlbumFormStyle.button}>
                    Clear
                </button>
                <button type="submit" className={AlbumFormStyle.button}>
                    Create
                </button>
            </div>
        </form>
    )
}