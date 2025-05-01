// Import necessary hooks
import { useEffect, useRef } from "react";

// Firebase database and methods
import { db } from "../../firebaseinit";
import { doc, updateDoc } from "firebase/firestore";

// Toast notification library
import { toast } from "react-toastify";

// CSS modules
import AlbumFormStyle from "../album-form/AlbumForm.module.css";

export default function ImageForm(props) {
    // Refs for form inputs
    const titleRef = useRef(""); // Reference for image title input
    const urlRef = useRef("");   // Reference for image URL input

    /**
     * Handles form submission for both adding and editing images
     * event - Form submission event
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        props?.setLoading(true);
        try {
            // Validate inputs
            if (!titleRef.current.value?.trim()) {
                toast.error("Please enter image title");
                return;
            }
            if (!urlRef.current.value?.trim()) {
                toast.error("Please enter image url");
                return;
            }

            // Reference to the album document
            const docRef = doc(db, "albums", props?.albumID);

            // Check if in edit mode
            if (props?.isEdit) {
                // Update existing image in the album
                await updateDoc(docRef, {
                    ...props?.images,
                    images: props?.images?.images?.map((elem) => {
                        return elem?.id === props?.edit?.id ?
                            {
                                ...elem,
                                name: titleRef.current.value?.trim(),
                                imageURL: urlRef.current.value?.trim(),
                            }
                            :
                            {
                                ...elem,
                            }
                    }),
                });

                toast.success("Image has been updated");

                // Reset edit state
                props?.setIsEdit(false);
                props?.setEdit({});
            } else {
                // Add new image to the album
                await updateDoc(docRef, {
                    ...props?.images,
                    images: [
                        ...props?.images?.images,
                        {
                            // Generate new ID for the image
                            id: props?.images?.images?.length < 1 ? 1 : props?.images?.images[props?.images?.images?.length - 1]?.id + 1,
                            name: titleRef.current.value?.trim(),
                            imageURL: urlRef.current.value?.trim(),
                            isThumbnail: false,
                        },
                    ]
                });

                toast.success("Image uploaded successfully!");
            }

            // Clear form inputs
            if (titleRef.current) titleRef.current.value = "";
            if (urlRef.current) urlRef.current.value = "";

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
            // Set form values to the image being edited
            titleRef.current.value = props?.edit?.name;
            urlRef.current.value = props?.edit?.imageURL;
        }
    }, [props?.edit?.imageURL, props?.edit?.name, props?.isEdit])

    return (
        // Form container
        <form onSubmit={handleSubmit} className={AlbumFormStyle.form}>
            {/* Form header - changes based on mode */}
            <div className={AlbumFormStyle.albumFormHeading}>
                {props?.isEdit ? "Edit Image" : "Add Image"}
            </div>

            {/* Form inputs container */}
            <div>
                {/* Image title input */}
                <div>
                    <input type="text" placeholder="Title" ref={titleRef} className={AlbumFormStyle.albumFormInputBox} />
                </div>
                {/* Image URL input */}
                <div>
                    <input type="text" placeholder="Image URL" ref={urlRef} className={AlbumFormStyle.albumFormInputBox} />
                </div>
            </div>

            {/* Form action buttons */}
            <div>
                {/* Clear button - resets form inputs */}
                <button
                    type="button"
                    onClick={() => {
                        titleRef.current.value = "";
                        urlRef.current.value = "";
                    }
                    }
                    className={AlbumFormStyle.button}
                >
                    Clear
                </button>
                {/* Submit button - changes label based on mode */}
                <button type="submit" className={AlbumFormStyle.button}>
                    {props?.isEdit ? "Edit" : "Create"}
                </button>
            </div>
        </form>
    )
}