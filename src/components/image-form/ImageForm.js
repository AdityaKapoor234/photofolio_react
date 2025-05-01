import { useEffect, useRef } from "react";

import { db } from "../../firebaseinit";
import { doc, updateDoc } from "firebase/firestore";

// Toast notification library
import { toast } from "react-toastify";

import AlbumFormStyle from "../album-form/AlbumForm.module.css";

export default function ImageForm(props) {
    const titleRef = useRef("");
    const urlRef = useRef("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        props?.setLoading(true);
        try {
            if (!titleRef.current.value?.trim()) {
                toast.error("Please enter image title");
                return;
            }
            if (!urlRef.current.value?.trim()) {
                toast.error("Please enter image url");
                return;
            }

            const docRef = doc(db, "albums", props?.albumID);

            if (props?.isEdit) {
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

                props?.setIsEdit(false);
                props?.setEdit({});
            } else {
                await updateDoc(docRef, {
                    ...props?.images,
                    images: [
                        ...props?.images?.images,
                        {
                            id: props?.images?.images?.length < 1 ? 1 : props?.images?.images[props?.images?.images?.length - 1]?.id + 1,
                            name: titleRef.current.value?.trim(),
                            imageURL: urlRef.current.value?.trim(),
                            isThumbnail: false,
                        },
                    ]
                });

                toast.success("Image uploaded successfully!");
            }


            if (titleRef.current) titleRef.current.value = "";
            if (urlRef.current) urlRef.current.value = "";

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
            titleRef.current.value = props?.edit?.name;
            urlRef.current.value = props?.edit?.imageURL;
        }
    }, [props?.edit?.imageURL, props?.edit?.name, props?.isEdit])

    return (
        <form onSubmit={handleSubmit} className={AlbumFormStyle.form}>
            <div className={AlbumFormStyle.albumFormHeading}>
                {props?.isEdit ? "Edit Image" : "Add Image"}
            </div>
            <div>
                <div>
                    <input type="text" placeholder="Title" ref={titleRef} className={AlbumFormStyle.albumFormInputBox} />
                </div>
                <div>
                    <input type="text" placeholder="Image URL" ref={urlRef} className={AlbumFormStyle.albumFormInputBox} />
                </div>
            </div>
            <div>
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
                <button type="submit" className={AlbumFormStyle.button}>
                    {props?.isEdit ? "Edit" : "Create"}
                </button>
            </div>
        </form>
    )
}