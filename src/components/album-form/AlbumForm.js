// Import necessary hooks
import { useEffect, useRef } from "react";

// Firebase database and methods
import { db } from "../../firebaseinit";
import { collection, doc, addDoc, updateDoc } from "firebase/firestore";

// Toast notification library
import { toast } from "react-toastify";

// Component styles
import AlbumFormStyle from "./AlbumForm.module.css";

export default function AlbumForm(props) {
    // Reference to the album name input field
    const albumNameRef = useRef("");

    // Handles form submission for both creating and editing albums
    const handleSubmit = async (event) => {
        event.preventDefault();
        props?.setLoading(true);
        try {
            // Validate album name input
            if (!albumNameRef.current.value?.trim()) {
                toast.error("Please enter album name");
                return;
            }

            // Check if in edit mode
            if (props?.isEdit) {
                // Update existing album document
                const docRef = doc(db, "albums", props?.edit?.id);

                await updateDoc(docRef, {
                    ...props?.edit,
                    albumName: albumNameRef.current.value,
                });

                toast.success("Album has been updated");

                // Reset edit state
                props?.setIsEdit(false);
                props?.setEdit({});
            } else {
                // Create new album document
                await addDoc(collection(db, "albums"), {
                    albumName: albumNameRef.current.value,
                    images: [],
                    thumbnail: "",
                });

                toast.success("Album created successfully!");
            }

            // Clear input field after submission
            if (albumNameRef.current) albumNameRef.current.value = "";
        } catch (e) {
            console.log("ERROR: ", e);
            toast.error("Something went wrong please try again later");
        } finally {
            // Refresh data and hide loading state
            await props?.getInitialData();
            props?.setLoading(false);
        }
    }

    // Effect hook to populate form when in edit mode
    useEffect(() => {
        if (props?.isEdit) {
            // Set input value to current album name when editing
            albumNameRef.current.value = props?.edit?.albumName;
        }
    }, [props?.edit, props?.edit.imageURL, props?.edit.name, props?.isEdit])

    return (
        // Form container
        <form onSubmit={handleSubmit} className={AlbumFormStyle.form}>
            {/* Form header - changes based on edit/create mode */}
            <div className={AlbumFormStyle.albumFormHeading}>
                {props?.isEdit ? "Edit Album" : "Create Album"}
            </div>

            {/* Album name input field */}
            <div>
                <input type="text" placeholder="Enter an album name..." ref={albumNameRef} className={AlbumFormStyle.albumFormInputBox} />
            </div>

            {/* Form action buttons */}
            <div>
                {/* Clear button - resets input field */}
                <button type="button" onClick={() => { albumNameRef.current.value = ""; }} className={AlbumFormStyle.button}>
                    Clear
                </button>
                {/* Submit button - changes label based on edit/create mode */}
                <button type="submit" className={AlbumFormStyle.button}>
                    {props?.isEdit ? "Edit" : "Create"}
                </button>
            </div>
        </form>
    )
}