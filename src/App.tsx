import { useEffect, useState } from "react";

import { Switch, Route } from "react-router-dom";

// screens
import StartScreen from "./views/StartScreen";
import BubbleChart from "./views/Bubbles";
import { bubbleDummyData } from "./utils";

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

    const isFinished = answers.genres.length > 5 && answers.actors.length > 5 && answers.directors.length > 5;

    useEffect(() => {
        console.log({ answers });
    }, [answers]);

    return (
        <div className="App">
            <Switch>
                <Route
                    path={"/genres"}
                    exact
                    component={() => (
                        <BubbleChart
                            selected={answers.genres}
                            items={bubbleDummyData}
                            previousStage={""}
                            nextStage="/actors"
                            isFinished={isFinished}
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
                            items={bubbleDummyData}
                            previousStage={"/genres"}
                            nextStage="/directors"
                            isFinished={isFinished}
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
                            items={bubbleDummyData}
                            previousStage={"/actors"}
                            nextStage=""
                            isFinished={isFinished}
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
