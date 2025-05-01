// Component styles
import CarouselStyle from "./Carousel.module.css";

// Material UI icons
import CloseIcon from '@mui/icons-material/Close';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';

export default function Carousel(props) {

    return (
        // Main container with semi-transparent black background
        <div className="bodySpace" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
            {/* Carousel container */}
            <div className={CarouselStyle.carousel}>
                {/* Close button to exit carousel view */}
                <div className={CarouselStyle.closeButton}>
                    <CloseIcon
                        fontSize="large"
                        className={CarouselStyle.button}
                        onClick={() => props?.setIsCarousel(false)}
                    />
                </div>

                {/* Row containing navigation buttons and current image */}
                <div className={CarouselStyle.imageButtonRow}>
                    {/* Previous image button */}
                    <div>
                        <SkipPreviousIcon
                            fontSize="large"
                            className={CarouselStyle.button}
                            onClick={() => props?.initializeCarouselImage(props?.carouselImage?.index, "prev")}
                        />
                    </div>

                    {/* Current image display */}
                    <div
                        className={CarouselStyle.image}
                        style={{ backgroundImage: `url(${props?.carouselImage?.imageURL})` }}
                    ></div>

                    {/* Next image button */}
                    <div>
                        <SkipNextIcon
                            fontSize="large"
                            className={CarouselStyle.button}
                            onClick={() => props?.initializeCarouselImage(props?.carouselImage?.index, "next")}
                        />
                    </div>
                </div>

                {/* Display name of current image */}
                <div className={CarouselStyle.name}>
                    {props?.carouselImage?.name}
                </div>
            </div>
        </div>
    )
}