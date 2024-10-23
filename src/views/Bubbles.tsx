import { DataSet } from "vis-data";
import { Network } from "vis-network";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

import Button from "../components/Button";

import { BsArrowLeft, BsArrowRight, BsCheck2Circle } from "react-icons/bs";
import "vis-network/styles/vis-network.css";

interface IBubbleData {
    id: number;
    name: string;
    relevence: number;
    value: string | number;
}

interface IVisNode {
    id: number;
    label?: string;
    value?: number;
    color?: string;
    x?: number;
    y?: number;
    physics?: boolean;
}

type TProps = {
    nextStage: string;
    previousStage: string;
    selected: Array<number>;
    onFinish: (answers: Array<number>) => void;
    isFinished: boolean;
    items: Array<IBubbleData>;
};

const BubbleChart: React.FC<TProps> = ({ nextStage, previousStage, items, onFinish, selected, isFinished }: TProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const networkRef = useRef<Network | null>(null);
    const [selectedNodes, setSelectedNodes] = useState<number[]>([]); // Array of selected node IDs
    const [nodes, setNodes] = useState<DataSet<IVisNode>>({} as DataSet<IVisNode>); // Store nodes to update them later
    const [loaded, setLoaded] = useState<boolean>(false);

    const history = useHistory();
    const selectedNodesRef: any = useRef([...selected]);
    const originalItems: any = useRef([...items]);

    const updateNode = useCallback(
        (nodeId: number) => {
            const node = nodes.get(nodeId);
            const isSelected = ![...selectedNodesRef.current!].includes(nodeId);

            if (!node) {
                console.log("this node is not valid");
                return;
            }

            if (!selectedNodesRef.current!.includes(nodeId)) {
                // Adding a new node
                nodes.update({
                    ...node,
                    color: "purple",
                    value: isSelected ? 500 : 400,
                    // @ts-ignore
                    y: (node!.y || 0) + 0.00001,
                    physics: true,
                });
                setSelectedNodes([...selectedNodesRef.current!, nodeId]);
            } else {
                // Removing a node
                nodes.update({
                    ...node,
                    color: "blue",
                    value: isSelected ? 500 : 400,
                    physics: true,
                });
                setSelectedNodes([...selectedNodesRef.current!.filter((id: number) => id !== nodeId)]);
            }
        },
        [nodes]
    );

    const handleClick = useCallback(
        (params: any) => {
            if (networkRef.current && nodes && nodes.get()) {
                if (!params.nodes.length) {
                    console.log("click doing nothing -- returning");
                    return;
                }
                const nodeId = params.nodes[0];
                updateNode(nodeId);
            }
        },
        [nodes, updateNode]
    );

    useEffect(() => {
        originalItems.current = items;

        if (!containerRef.current) return;

        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;

        // Initialize nodes dataset with any previously selected nodes
        const initialNodes = new DataSet([
            ...items.map((item, index) => {
                const isSelected = !selectedNodesRef.current.includes(item.id) || false;
                return {
                    id: item.id,
                    label: item.name.split(" ").join("\n"), // Use custom HTML content for the label
                    color: "blue", // Default color,
                    value: isSelected ? 500 : 400,
                    x: index % 2 === 0 ? -containerWidth / 2 : containerWidth / 2, // Position nodes
                    y: Math.random() * containerHeight - containerHeight / 2, // Random Y position
                    physics: true,
                };
            }),
        ]);

        setNodes(initialNodes); // Store nodes in state for later updates

        const edges = new DataSet([]); // No edges for this example

        const networkOptions = {
            locale: "en",
            nodes: {
                shape: "circle", // Set shape to html for custom HTML nodes
                shapeProperties: {
                    borderDashes: false, // only for borders
                    borderRadius: 99,
                },
                scaling: {
                    min: 400,
                    max: 400,
                },
                font: {
                    size: 200, // Font size for labels
                    color: "#fff", // White label color
                    vadjust: 0,
                    align: "center",
                    multi: true,
                },
                labelHighlightBold: false,
                borderWidth: 30,
            },

            physics: {
                enabled: true,
                solver: "barnesHut",
                timestep: 0.615,
                barnesHut: {
                    gravitationalConstant: -25000,
                    centralGravity: 0.21,
                    springLength: 15,
                    springConstant: 0.65,
                    damping: 0.008,
                    avoidOverlap: 14, // Prevent nodes from overlapping
                },
                stabilization: {
                    enabled: true,
                    iterations: 1000,
                    updateInterval: 100,
                },
            },
            interaction: {
                zoomView: true, // Allow zooming
                dragView: true, // Allow dragging
            },
        };

        // Initialize network
        const network = new Network(containerRef.current, { nodes: initialNodes, edges }, networkOptions);

        networkRef.current = network;

        // Zoom in on the nodes after initialization
        network.once("beforeDrawing", () => {
            network.fit({
                nodes: initialNodes.getIds(),
                animation: { duration: 500, easingFunction: "easeInOutQuad" },
            });
        });

        network.focus(1);
        setLoaded(true);

        return () => {
            network.destroy(); // Clean up on unmount
        };
    }, [items]);

    // Handle node click events
    useEffect(() => {
        if (loaded) {
            networkRef.current!.on("click", handleClick);
        }
        return () => {
            networkRef.current!.off("click", handleClick); // Remove the previous listener
        };
    }, [handleClick, loaded]);

    useEffect(() => {
        selectedNodesRef.current = [...selectedNodes];
    }, [selectedNodes]);

    const handleNextStage = () => {
        onFinish(selectedNodesRef.current);

        if (isFinished) {
            history.push("/recommendations");
        } else history.push(nextStage);
    };

    const isEnoughSelected = selectedNodes.length >= 5;

    return (
        <div className="h-[100dvh] w-[100dvw] overflow-hidden relative">
            <div ref={containerRef} className="h-[90dvh] w-[100vw]" />

            <div className="flex items-center flex-col justify-center py-8 bg-zinc-200 w-[100vw] bottom-0 fixed border-t border-blue-100 ">
                <div className="flex justify-between items-center px-4 w-full mx-auto max-w-screen-xl">
                    <Button
                        bgColor="unstyled"
                        withAnimation
                        size="xl"
                        title={previousStage !== "/" ? `Choose ${previousStage.replace("/", "")}` : "/"}
                        to={nextStage}
                        IconLeft={BsArrowLeft}
                    />
                    {isEnoughSelected ? (
                        <div>
                            <BsCheck2Circle size={"3rem"} color="green" />
                            Great!
                        </div>
                    ) : (
                        <h2 className="font-light text-3xl">
                            Select {5 - selectedNodes.length} or more {window.location.pathname.replace("/", "")}
                        </h2>
                    )}
                    <Button
                        disabled={selectedNodes.length < 5}
                        bgColor={selectedNodes.length < 5 ? "unstyled" : "bg-green-600"}
                        withAnimation
                        size="xl"
                        title={nextStage ? `Choose ${nextStage.replace("/", "")}` : isFinished ? "Get Recommendations" : "Next"}
                        onClick={handleNextStage}
                        IconRight={BsArrowRight}
                    />
                </div>
            </div>
        </div>
    );
};

export default BubbleChart;
