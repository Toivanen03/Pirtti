import Carousel from 'react-bootstrap/Carousel'
import { useState, useEffect } from 'react'

import Kaiteella from '../assets/carousel-images/Kaiteella.jpg'
import Lammella from '../assets/carousel-images/Lammella.jpg'
import Taidetta from '../assets/carousel-images/Taidetta.jpg'
import Taidetta2 from '../assets/carousel-images/Taidetta2.jpg'
import Hiekkaleikit from "../assets/carousel-images/Hiekkaleikit.jpg"
import Jalat from "../assets/carousel-images/Jalat.jpg"
import Omenat from "../assets/carousel-images/Omenat.jpg"
import Syksy from "../assets/carousel-images/Syksy.jpg"
import Liidut from "../assets/carousel-images/liidut.jpg"
import Vesileikit from "../assets/carousel-images/vesileikkeja.jpg"
import Satuhetki from "../assets/carousel-images/satuhetki.jpg"
import Maenlasku from "../assets/carousel-images/maenlasku.jpg"

const images = [Kaiteella, Maenlasku, Lammella, Liidut, Taidetta, Satuhetki, Hiekkaleikit, Vesileikit, Jalat, Taidetta2, Omenat, Syksy]

const ImageCarousel = ({ home, bookNumber, pageNumber }) => {
    const [randomIndex, setRandomIndex] = useState(0)

    useEffect(() => {
        if (!home && pageNumber === undefined) return

        setRandomIndex(Math.floor(Math.random() * images.length))
    }, [bookNumber, pageNumber])

    return (
        <Carousel fade controls={false} activeIndex={(home || !home && !bookNumber && !pageNumber) ? undefined : randomIndex} indicators={false} pause={false} className={home ? "home-carousel" : "non-home-carousel"}>
            {images.map((image, i) => (
                <Carousel.Item key={i} className="carousel-item-hero">
                    <img src={image} alt={`Kuva ${i + 1}`} className="carousel-image" />
                </Carousel.Item>
            ))}
        </Carousel>
    )
}

export default ImageCarousel