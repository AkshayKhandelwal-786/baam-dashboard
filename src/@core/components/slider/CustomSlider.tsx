import React from 'react'
import SimpleImageSlider from "react-simple-image-slider";

const images = [
    { url: "images/1.jpg" },
    { url: "images/2.jpg" },
    { url: "images/3.jpg" },
    { url: "images/4.jpg" },
    { url: "images/5.jpg" },
    { url: "images/6.jpg" },
    { url: "images/7.jpg" },
];

type Props = {
    list: any[]
}

const CustomSlider = ({ list = images }: Props) => {
    return (
        <div className='custom_carousel' >
            <SimpleImageSlider
                width={400}
                height={200}
                images={list}
                showBullets={list?.length > 1}
                showNavs={list?.length > 1}
                slideDuration={0.1}
                style={{
                    // width: "81%"
                }}
            />

        </div>


    )
}

export default CustomSlider