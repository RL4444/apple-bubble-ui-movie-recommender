import { useEffect, useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";

import { fetchInitialData, postRecommendations } from "./api/api";

// screens
import StartScreen from "./views/StartScreen";
import BubbleChart from "./views/Bubbles";
import Recommendations from "./views/Recommendations";

import { TAnswers, TQuestions, TRecommendationItem } from "./types";

function App() {
    const history = useHistory();
    const [answers, setAnswers] = useState<TAnswers>({
        genres: [],
        actors: [],
        directors: [],
    });
    const [questions, setQuestions] = useState<TQuestions>({
        genres: [],
        actors: [],
        directors: [],
    });

    const [recommendations, setRecommendations] = useState<Array<TRecommendationItem> | null>(null);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [fetchingResults, setFetchingResults] = useState<boolean>(false);

    const isFinished = answers.genres.length >= 5 && answers.actors.length >= 5 && answers.directors.length >= 3;

    useEffect(() => {
        const stateToStore = JSON.stringify({ ...answers });
        localStorage.setItem("imx__answers", stateToStore);
    }, [answers]);

    useEffect(() => {
        const prevSessionState = localStorage.getItem("imx__answers");
        if (prevSessionState) {
            setAnswers(JSON.parse(prevSessionState));
        }
    }, []);

    useEffect(() => {
        const prevRecommendations = localStorage.getItem("imx__recommendations");
        if (prevRecommendations) {
            setRecommendations(JSON.parse(prevRecommendations!));
        }
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data, error } = await fetchInitialData();
                if (error) {
                    window.alert("error fetching data, check logs and connection ");
                    return;
                }
                setQuestions({
                    genres: data.genres,
                    actors: data.actors,
                    directors: data.directors,
                });
                setLoaded(true);
            } catch (error) {
                setLoaded(true);
            }
        }
        if (!loaded) {
            fetchData();
        }
    }, [questions, loaded]);

    const buildRecommendations = async () => {
        setFetchingResults(true);
        const matchedIds: any = {};

        for (const answerSet in answers) {
            const copyAnswers = [...answers[answerSet as keyof TAnswers]];
            // @ts-ignore
            const copyQuestions = [...questions[answerSet]];
            matchedIds[answerSet] = copyAnswers.map((eachAnswerId) => {
                return copyQuestions.find((eachQuestion) => eachQuestion.id === eachAnswerId)!.tmdbId;
            });
        }

        const results = await postRecommendations(matchedIds);

        if (results.data) {
            setRecommendations(results.data);
        }

        setFetchingResults(false);
        history.replace("/recommendations");
    };

    const resetAppState = () => {
        setAnswers({ genres: [], actors: [], directors: [] });
        setRecommendations(null);
    };

    return (
        <div className="App">
            <Switch>
                <Route
                    path={"/genres"}
                    exact
                    component={() => (
                        <BubbleChart
                            selected={answers.genres}
                            items={questions.genres}
                            previousStage={""}
                            nextStage="/actors"
                            isFinished={isFinished}
                            selectAmount={5}
                            onFinish={(genreAnswers: Array<number>) =>
                                setAnswers({
                                    ...answers,
                                    genres: genreAnswers,
                                })
                            }
                        />
                    )}
                />
                <Route
                    path={"/actors"}
                    exact
                    component={() => (
                        <BubbleChart
                            selected={answers.actors}
                            items={questions.actors}
                            previousStage={"/genres"}
                            nextStage="/directors"
                            isFinished={isFinished}
                            selectAmount={5}
                            onFinish={(actorAnswers: Array<number>) =>
                                setAnswers({
                                    ...answers,
                                    actors: actorAnswers,
                                })
                            }
                        />
                    )}
                />
                <Route
                    path={"/directors"}
                    exact
                    component={() => (
                        <BubbleChart
                            selected={answers.directors}
                            items={questions.directors}
                            previousStage={"/actors"}
                            nextStage={undefined}
                            isFinished={isFinished}
                            finalStage
                            selectAmount={3}
                            onFinish={(directorsAnswers: Array<number>) => {
                                setAnswers({
                                    ...answers,
                                    directors: directorsAnswers,
                                });
                                console.log("should build recommendations now");

                                buildRecommendations();
                            }}
                        />
                    )}
                />
                <Route
                    path={"/recommendations"}
                    exact
                    component={() => <Recommendations resetAppState={resetAppState} recommendations={recommendations} />}
                />
                <Route path={"/"} exact component={() => <StartScreen />} />
            </Switch>
            {fetchingResults && (
                <div className="bg-[rgba(1,1,1,0.8)] fixed inset-0 h-[100dvh] w-[100vw] flex items-center justify-center">
                    <div className="flex gap-4">
                        <svg
                            className="text-gray-300 animate-spin"
                            viewBox="0 0 64 64"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                        >
                            <path
                                d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                                stroke="currentColor"
                                stroke-width="5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            ></path>
                            <path
                                d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                                stroke="currentColor"
                                stroke-width="5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="text-red-500"
                            ></path>
                        </svg>
                        <p className="text-white">Generating results</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
