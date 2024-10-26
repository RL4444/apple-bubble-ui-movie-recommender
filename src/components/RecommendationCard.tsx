import Button from "./Button";
import { BsArrowRight } from "react-icons/bs";

import { TRecommendationItem } from "../types";
import { toPrettyDate } from "../utils";

type TProps = {
    movie: TRecommendationItem;
};
const RecommendationCard = ({ movie }: TProps) => {
    return (
        <article className="flex flex-col md:flex-row shadow-md w-full bg-zinc-100 hover:scale-105 transition hover:shadow-xl">
            <div className="w-full md:w-[50%]">
                <img
                    src={
                        movie.backdrop_path
                            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                            : movie.poster_path
                            ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                            : "../logo.svg"
                    }
                    alt={`${movie.title} poster`}
                    className="object-cover w-full h-full aspect-video"
                />
            </div>
            <div className="w-full md:w-[50%] py-6 px-4 ">
                <div className="flex items-center">
                    <h4 className="font-light text-4xl">{movie.title}</h4>
                    <div className="text-thin ml-auto text-white border bg-green-600 rounded  flex flex-col items-center justify-center overflow-hidden p-1">
                        <div>{Math.round(movie.popularity!)}</div>
                        <div className="text-white text-xs">score</div>
                    </div>
                </div>
                <div className="my-4 flex items-baseline gap-1">
                    {movie.release_date ? (
                        <div className="rounded bg-blue-300 py-2 px-2 text-sm text-black">{toPrettyDate(movie.release_date)}</div>
                    ) : null}
                </div>
                <p className="mt-4 text-lg line-clamp-2">{movie.overview}</p>
                <br />
                <br />
                <br />
                <div className="flex justify-end">
                    <Button
                        externalLink={`https://www.themoviedb.org/movie/${movie.id}`}
                        size="sm"
                        title={"read more"}
                        bgColor="hollow"
                        IconRight={BsArrowRight}
                    />
                </div>
            </div>
        </article>
    );
};

export default RecommendationCard;
