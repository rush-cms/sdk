import { GalleryBlock as GalleryBlockType } from '@rushcms/types'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { cn } from '../../utils'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/autoplay'

interface GallerySliderProps {
    block: GalleryBlockType
    className?: string
    type?: 'slider' | 'carousel'
}

export function GallerySlider({ block, className, type = 'slider' }: GallerySliderProps) {

    const navigationClassName = 'text-slate-900 w-10 h-10 bg-white backdrop-50 z-20 absolute top-1/2 hover:backdrop-90 flex items-center justify-center rounded-lg shadow-md'

    return (
        <Swiper
            className={cn('relative w-full', className)}
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={type === 'slider' ? 1 : 3}
            autoplay={{ delay: 5000 }}
            navigation
            autoHeight={true}
        >
            {block.data.images.map((image, index) => (
                <SwiperSlide key={index}>
                    <img src={image.url} alt={image.name || ('Image #' + index)} />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}