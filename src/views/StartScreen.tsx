import { useEffect, useState } from "react";

import Button from "../components/Button";

import { GiFilmSpool } from "react-icons/gi";
import { FaQuestionCircle } from "react-icons/fa";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { RiNetflixFill } from "react-icons/ri";
import { SiParamountplus, SiPrime, SiSky } from "react-icons/si";

type TProps = {
    title?: "";
};

const StartScreen = ({ title }: TProps) => {
    const [previousResults, setPreviousResults] = useState<any>({ valid: false });

    useEffect(() => {
        const prevSessionState = localStorage.getItem("imx__recommendations");
        if (prevSessionState) {
            console.log("previous session ", JSON.parse(prevSessionState));
        }
        setPreviousResults({ ...JSON.parse(prevSessionState!), valid: false });
    }, []);

    return (
        <>
            <div className="relative h-[100dvh] w-full flex flex-col items-center bg-blend">
                <div className="w-full h-[50dvh] mx-auto flex flex-col items-center lin-grad-bg">
                    <h1 className="text-7xl md:text-9xl text-white mt-auto">iMX</h1>
                    <h2 className="text-3xl md:text-5xl font-thin text-white mb-auto text-center">Let AI Choose your next film</h2>
                    <div className="flex justify-center w-full gap-6">
                        <Button to={"/genres"} withAnimation size="xl" title={"Let's go"} IconRight={GiFilmSpool} />
                        {previousResults.valid && (
                            <Button to={"/recommendations"} withAnimation size="xl" title={"Let's go"} IconRight={GiFilmSpool} />
                        )}
                    </div>
                    <br />
                    <br />
                </div>
                <div className="w-full h-[50dvh] bg-white flex flex-col items-center justify-around bg-white-blend">
                    <div className="flex items-center justify center gap-6">
                        <RiNetflixFill fill="red" size={"40px"} />
                        <SiPrime size={"40px"} />
                        <SiParamountplus size={"40px"} />
                        <SiSky size={"40px"} />
                    </div>
                    <br />
                    <div>
                        <h3 className="font-regular text-xl md:text-2xl text-indigo-900 text-center">A little bit more about what we do</h3>
                        <br />
                        <div className="flex gap-6">
                            <Button size="md" title={"Privacy"} bgColor="hollow" IconRight={MdOutlinePrivacyTip} />
                            <Button size="md" title={"How It Works"} bgColor="bg-indigo-900" IconRight={FaQuestionCircle} />
                        </div>
                    </div>
                    <br />
                </div>
            </div>
        </>
    );
};

export default StartScreen;
