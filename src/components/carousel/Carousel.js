import CarouselStyle from "./Carousel.module.css";

import CloseIcon from '@mui/icons-material/Close';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';

export default function Carousel(props) {

    return (
        <div className="bodySpace" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
            <div className={CarouselStyle.carousel}>
                <div className={CarouselStyle.closeButton}>
                    <CloseIcon
                        fontSize="large"
                        className={CarouselStyle.button}
                        onClick={() => props?.setIsCarousel(false)}
                    />
                </div>
                <div className={CarouselStyle.imageButtonRow}>
                    <div>
                        <SkipPreviousIcon
                            fontSize="large"
                            className={CarouselStyle.button}
                            onClick={() => props?.initializeCarouselImage(props?.carouselImage?.index, "prev")}
                        />
                    </div>
                    <div
                        className={CarouselStyle.image}
                        style={{ backgroundImage: `url(${props?.carouselImage?.imageURL})` }}
                    ></div>
                    <div>
                        <SkipNextIcon
                            fontSize="large"
                            className={CarouselStyle.button}
                            onClick={() => props?.initializeCarouselImage(props?.carouselImage?.index, "next")}
                        />
                    </div>
                </div>
                <div className={CarouselStyle.name}>
                    {props?.carouselImage?.name}
                </div>
            </div>
        </div>
    )
}