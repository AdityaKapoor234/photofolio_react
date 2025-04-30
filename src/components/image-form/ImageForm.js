import { useRef } from "react";

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

            titleRef.current.value = "";
            urlRef.current.value = "";

            toast.success("Image uploaded successfully!");
            props?.getInitialData();
        } catch (e) {
            console.log("ERROR: ", e);
        }
    }

    return (
        <form onSubmit={handleSubmit} className={AlbumFormStyle.form}>
            <div className={AlbumFormStyle.albumFormHeading}>
                Add Image
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
                    Create
                </button>
            </div>
        </form>
    )
}