import Carousel from 'react-bootstrap/Carousel'
import Kaiteella from '../assets/carousel-images/Kaiteella.jpg'
import Lammella from '../assets/carousel-images/Lammella.jpg'
import Taidetta from '../assets/carousel-images/Taidetta.jpg'
import Hiekkaleikit from "../assets/carousel-images/Hiekkaleikit.jpg"
import Jalat from "../assets/carousel-images/Jalat.jpg"
import Omenat from "../assets/carousel-images/Omenat.jpg"
import Syksy from "../assets/carousel-images/Syksy.jpg"

const images = [Kaiteella, Lammella, Taidetta, Hiekkaleikit, Jalat, Omenat, Syksy]

const ImageCarousel = ({ home }) => {
    return (
        <Carousel fade controls={false} indicators={false} pause={false} className={home ? "home-carousel" : "non-home-carousel"}>
            {images.map((image, i) => (
                <Carousel.Item key={i} className="carousel-item-hero">
                    <img src={image} alt={`Kuva ${i + 1}`} className={home ? "carousel-image" : "carousel-image"} />
                </Carousel.Item>
            ))}
        </Carousel>
    )
}

export default ImageCarousel