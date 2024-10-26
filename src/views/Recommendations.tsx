import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { GiFilmSpool } from "react-icons/gi";

import Button from "../components/Button";
import RecommendationCard from "../components/RecommendationCard";
import { TRecommendationItem } from "../types";

type TProps = {
    title?: "";
    recommendations?: any; // TODO: type this
    resetAppState: () => void;
};

const Recommendations = ({ title, recommendations, resetAppState }: TProps) => {
    const [results, setResults] = useState<Array<TRecommendationItem> | null>(null);

    const history = useHistory();
    const handleRestart = () => {
        if (localStorage.getItem("imx__answers")) {
            localStorage.removeItem("imx__answers");
        }
        if (localStorage.getItem("imx__recommendations")) {
            localStorage.removeItem("imx__recommendations");
        }
        resetAppState();
        history.replace("/genres");
    };

    useEffect(() => {
        if (recommendations) {
            console.log({ recommendations });
            setResults(recommendations);
        }
    }, [recommendations]);

    return (
        <>
            <div className="relative h-[100dvh] w-full flex flex-col items-center bg-blend">
                <div className="w-full h-[30dvh] mx-auto flex flex-col items-center justify-end lin-grad-bg">
                    <h1 className="text-4xl md:text-7xl text-white mt-auto">iMX</h1>
                    <h2 className="text-2xl md:text-3xl font-thin text-white text-center">Your Recommendations</h2>
                    <div className="flex justify-center w-full gap-6 mt-4">
                        <Button onClick={handleRestart} withAnimation size="xl" title={"Start Over"} IconRight={GiFilmSpool} />
                    </div>
                </div>
                <div className="w-full h-[70dvh] bg-white flex flex-col items-center bg-white-blend mx-auto">
                    <div className="flex flex-col items-center justify-center py-8 mt-8 w-full max-w-screen-lg shadow-lg">
                        {results && results.length > 0
                            ? results.map((eachRecommendedMovie: TRecommendationItem) => {
                                  return <RecommendationCard movie={eachRecommendedMovie} key={eachRecommendedMovie.id} />;
                              })
                            : "nah"}
                    </div>
                    <br />
                </div>
            </div>
        </>
    );
};

export default Recommendations;
