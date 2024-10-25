import { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";

import { fetchInitialData } from "./api/api";

// screens
import StartScreen from "./views/StartScreen";
import BubbleChart from "./views/Bubbles";

type TIdList = Array<number>;

type TAnswers = {
    genres: TIdList;
    actors: TIdList;
    directors: TIdList;
};

function App() {
    const [answers, setAnswers] = useState<TAnswers>({
        genres: [],
        actors: [],
        directors: [],
    });
    const [questions, setQuestions] = useState({
        genres: [],
        actors: [],
        directors: [],
    });
    const [loaded, setLoaded] = useState<boolean>(false);

    const isFinished = answers.genres.length >= 5 && answers.actors.length >= 5 && answers.directors.length >= 3;

    useEffect(() => {
        const stateToStore = JSON.stringify({ ...answers });
        console.log({ stateToStore });
        localStorage.setItem("imx__answers", stateToStore);
    }, [answers]);

    useEffect(() => {
        const prevSessionState = localStorage.getItem("imx__answers");
        if (prevSessionState) {
            console.log("previous session ", JSON.parse(prevSessionState));
            setAnswers(JSON.parse(prevSessionState));
        }
    }, []);

    useEffect(() => {
        async function fetchData() {
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
        }

        if (!loaded) {
            fetchData();
        }
    }, [questions, loaded]);

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
                            nextStage=""
                            isFinished={isFinished}
                            selectAmount={3}
                            onFinish={(directorsAnswers: Array<number>) =>
                                setAnswers({
                                    ...answers,
                                    directors: directorsAnswers,
                                })
                            }
                        />
                    )}
                />
                <Route path={"/"} exact component={() => <StartScreen />} />
            </Switch>
        </div>
    );
}

export default App;
