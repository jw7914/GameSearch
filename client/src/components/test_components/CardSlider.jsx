import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { fetchLastest } from "../../../api/api";
import LastestGameCard from './LastestGameCard';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const games = fetchLastest()

function CardSlider(){
    const [games, setGames] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const latestGames = await fetchLastest();
            setGames(latestGames);
        };

        fetchData();
    }, []);

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
    };

    return(
        <>
            <Slider {...settings}>
                {games.map((game, index) => (
                    <LastestGameCard
                        key={index}
                        gameName={game.name}
                        cover={game.cover}
                        cardId={index}
                    />
                ))}
            </Slider>
        </>
    );
};

export default CardSlider;